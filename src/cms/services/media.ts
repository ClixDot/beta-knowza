import { ASSET_MANIFEST } from '../migration/assetManifest';
import type { CMSDocument, MediaItem } from '../types';
import { MEDIA_PREFIX, collectStrings, mapStrings, uid } from '../utils';
import { logActivity } from './activity';
import { adapter, forgetMedia, getCmsState, registerMediaBlob, updateDraft } from './cmsStore';

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
export const VIDEO_TYPES = ['video/mp4', 'video/webm'];
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

const listeners = new Set<() => void>();
export const subscribeMedia = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const notify = () => listeners.forEach((listener) => listener());

const bundledId = (path: string) => `bundled:${path}`;

const bundledDefaults = (): MediaItem[] =>
  ASSET_MANIFEST.filter((asset) => asset.mime.startsWith('image/')).map((asset) => ({
    id: bundledId(asset.path),
    ref: asset.path,
    origin: 'bundled',
    name: asset.path.split('/').pop() ?? asset.path,
    kind: 'image',
    mime: asset.mime,
    size: asset.size,
    alt: '',
    caption: '',
    category: asset.category,
    createdAt: '2026-01-01T00:00:00.000Z',
  }));

/** Bundled /public images merged with uploads and any saved metadata overrides. */
export async function listMedia(includeHidden = false): Promise<MediaItem[]> {
  const stored = await adapter.listMedia();
  const overrides = new Map(stored.map((item) => [item.id, item]));
  const bundled = bundledDefaults().map((item) => overrides.get(item.id) ?? item);
  const uploads = stored.filter((item) => item.origin === 'upload').sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const all = [...uploads, ...bundled];
  return includeHidden ? all : all.filter((item) => !item.hidden);
}

export function validateFile(file: File): string | null {
  if (IMAGE_TYPES.includes(file.type)) {
    if (file.size > MAX_IMAGE_BYTES) return `${file.name} is larger than the ${MAX_IMAGE_BYTES / (1024 * 1024)} MB image limit.`;
    return null;
  }
  if (VIDEO_TYPES.includes(file.type)) {
    if (file.size > MAX_VIDEO_BYTES) return `${file.name} is larger than the ${MAX_VIDEO_BYTES / (1024 * 1024)} MB video limit.`;
    return null;
  }
  return `${file.name} is not a supported file. Use JPG, PNG, WebP, GIF, AVIF, MP4 or WebM.`;
}

const probeImage = (file: Blob) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('This file could not be read as an image.'));
    };
    image.src = url;
  });

const probeVideo = (file: Blob) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      resolve({ width: video.videoWidth, height: video.videoHeight });
      URL.revokeObjectURL(url);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('This file could not be read as a video.'));
    };
    video.src = url;
  });

async function storeFile(file: File, category: string, keep?: MediaItem): Promise<MediaItem> {
  const problem = validateFile(file);
  if (problem) throw new Error(problem);
  const kind = file.type.startsWith('video/') ? 'video' : 'image';
  // Decoding proves the contents match the claimed type, not just the extension.
  const { width, height } = kind === 'video' ? await probeVideo(file) : await probeImage(file);
  const id = keep?.id ?? uid('m');
  const item: MediaItem = {
    id,
    ref: `${MEDIA_PREFIX}${id}`,
    origin: 'upload',
    name: keep?.name ?? file.name,
    kind,
    mime: file.type,
    size: file.size,
    width,
    height,
    alt: keep?.alt ?? '',
    caption: keep?.caption ?? '',
    category: keep?.category ?? category,
    createdAt: keep?.createdAt ?? new Date().toISOString(),
  };
  await adapter.putMedia(item, file);
  registerMediaBlob(id, file);
  return item;
}

/** Loads an address as an image, so a broken or non-image link is caught before it is saved. */
export function probeImageUrl(url: string) {
  const value = url.trim();
  if (!/^https:\/\/[^\s]+$/i.test(value) && !/^\/[^\s/][^\s]*$/.test(value)) {
    return Promise.reject(new Error('Use a full address that starts with https://'));
  }
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    const fail = () => {
      window.clearTimeout(timer);
      reject(new Error("This address did not load as an image. Copy the image's own address, not the page it appears on."));
    };
    const timer = window.setTimeout(fail, 15000);
    image.onload = () => {
      window.clearTimeout(timer);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = fail;
    image.src = value;
  });
}

/** A readable title from an image address. */
export function nameFromUrl(url: string) {
  try {
    const last = new URL(url, window.location.origin).pathname.split('/').pop() ?? '';
    return decodeURIComponent(last).replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || 'Linked image';
  } catch {
    return 'Linked image';
  }
}

/** Copies an image from another site into the library, which only works if that site allows it. */
export async function importImageFromUrl(url: string): Promise<MediaItem> {
  let blob: Blob;
  try {
    const response = await fetch(url.trim());
    if (!response.ok) throw new Error();
    blob = await response.blob();
  } catch {
    throw new Error('That site does not allow copying its images. Download the image, then use Upload files.');
  }
  const name = url.trim().split(/[?#]/)[0].split('/').pop() || 'linked-image';
  const { items, errors } = await uploadFiles([new File([blob], name, { type: blob.type })]);
  if (!items[0]) throw new Error(errors[0] ?? 'The image could not be saved.');
  return items[0];
}

export interface UploadResult {
  items: MediaItem[];
  errors: string[];
}

export async function uploadFiles(files: File[], category = 'uploads'): Promise<UploadResult> {
  const items: MediaItem[] = [];
  const errors: string[] = [];
  for (const file of files) {
    try {
      items.push(await storeFile(file, category));
    } catch (err) {
      const quota = (err as DOMException)?.name === 'QuotaExceededError';
      errors.push(quota ? `${file.name}: browser storage is full.` : (err as Error).message);
    }
  }
  if (items.length) {
    await logActivity('uploaded', items.length === 1 ? items[0].name : `${items.length} files`);
    notify();
  }
  return { items, errors };
}

export async function updateMediaMeta(item: MediaItem, patch: Partial<Pick<MediaItem, 'name' | 'alt' | 'caption' | 'category' | 'width' | 'height'>>) {
  await adapter.putMedia({ ...item, ...patch });
  notify();
}

/** Keeps every reference working: uploads keep their id, bundled assets are re-pointed in the draft. */
export async function replaceMedia(item: MediaItem, file: File): Promise<MediaItem> {
  if (item.origin === 'upload') {
    const next = await storeFile(file, item.category, item);
    await logActivity('uploaded', `Replaced ${item.name}`);
    notify();
    return next;
  }
  const next = await storeFile(file, item.category, undefined);
  await adapter.putMedia({ ...next, alt: item.alt, caption: item.caption });
  await adapter.putMedia({ ...item, hidden: true });
  updateDraft((draft) => mapStrings(draft, (text) => (text === item.ref ? next.ref : text)), `Replaced ${item.name}`);
  notify();
  return next;
}

export interface MediaUsage {
  location: string;
  stage: 'draft' | 'live';
}

const usageIn = (doc: CMSDocument, ref: string, stage: MediaUsage['stage']): MediaUsage[] => {
  const out = new Set<string>();
  const scan = (value: unknown, location: string) =>
    collectStrings(value, (text) => {
      if (text === ref) out.add(location);
    });
  Object.values(doc.pages).forEach((page) => {
    page.sections.forEach((section) => scan(section.content, `${page.title} › ${section.label}`));
    scan(page.seo, `${page.title} › SEO`);
  });
  scan(doc.global, 'Global settings');
  doc.gallery.items.forEach((item) => scan(item, `Gallery › ${item.title}`));
  doc.blog.posts.forEach((post) => scan(post, `Blog › ${post.title}`));
  return [...out].map((location) => ({ location, stage }));
};

export function findUsage(ref: string): MediaUsage[] {
  const { draft, published } = getCmsState();
  const draftUses = usageIn(draft, ref, 'draft');
  const known = new Set(draftUses.map((u) => u.location));
  return [...draftUses, ...usageIn(published, ref, 'live').filter((u) => !known.has(u.location))];
}

/** Refuses to delete anything still in use so deletion can never break the site. */
export async function deleteMedia(item: MediaItem) {
  const usage = findUsage(item.ref);
  if (usage.length) throw new Error(`Still used in ${usage.length} place${usage.length > 1 ? 's' : ''}. Replace it there first.`);
  if (item.origin === 'upload') {
    await adapter.deleteMedia(item.id);
    forgetMedia(item.id);
  } else {
    await adapter.putMedia({ ...item, hidden: true });
  }
  await logActivity('deleted', item.name);
  notify();
}

export async function restoreHiddenMedia() {
  const all = await adapter.listMedia();
  await Promise.all(all.filter((item) => item.hidden).map((item) => adapter.putMedia({ ...item, hidden: false })));
  notify();
}
