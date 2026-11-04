import { useSyncExternalStore } from 'react';
import { LocalCMSStorageAdapter } from '../adapters/LocalCMSStorageAdapter';
import { MongoCMSStorageAdapter } from '../adapters/MongoCMSStorageAdapter';
import type { CMSStorageAdapter } from '../adapters/CMSStorageAdapter';
import { createSeedDocument, isValidDocument, migrateDocument } from '../migration';
import type { CMSDocument, PageId, RevisionRecord, Stage } from '../types';
import { BLANK_IMAGE, clone, collectStrings, isMediaRef, mapStrings, mediaIdFromRef, thumbUrl, uid } from '../utils';
import cloudinaryMapping from '../cloudinaryMapping.json';
import { logActivity } from './activity';
import { getCurrentSession, isLocalBackend, registerAuthApi, restoreSession } from './auth';

export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

export interface CmsState {
  ready: boolean;
  draft: CMSDocument;
  published: CMSDocument;
  saveStatus: SaveStatus;
  savedAt: string | null;
  error: string | null;
  /** Object URLs for uploaded media, keyed by media id. */
  mediaUrls: Record<string, string>;
  mediaVersion: number;
}

const remote = isLocalBackend() ? null : new MongoCMSStorageAdapter('/api/cms');
if (remote) registerAuthApi(remote);

export const adapter: CMSStorageAdapter = remote ?? new LocalCMSStorageAdapter();

const CHANNEL = 'knowza-cms';
const AUTOSAVE_MS = 700;
const MAX_REVISIONS = 40;

const readInitial = (stage: Stage): { doc: CMSDocument | null; error: string | null } => {
  try {
    const cached = adapter.getCachedDocument?.(stage) ?? null;
    if (!cached) return { doc: null, error: null };
    const migrated = migrateDocument(cached);
    if (!isValidDocument(migrated)) throw new Error('Stored content is not a valid CMS document.');
    return { doc: migrated, error: null };
  } catch (err) {
    return { doc: null, error: (err as Error).message };
  }
};

const initialPublished = readInitial('published');
const initialDraft = readInitial('draft');
const seed = createSeedDocument();

let state: CmsState = {
  ready: false,
  published: initialPublished.doc ?? seed,
  draft: initialDraft.doc ?? initialPublished.doc ?? seed,
  saveStatus: 'idle',
  savedAt: initialDraft.doc?.updatedAt ?? null,
  error: initialPublished.error ?? initialDraft.error,
  mediaUrls: {},
  mediaVersion: 0,
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

const setState = (patch: Partial<CmsState>) => {
  state = { ...state, ...patch };
  emit();
};

const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL) : null;
const announce = () => channel?.postMessage({ type: 'changed', at: Date.now() });

export const getCmsState = () => state;
export const subscribeCms = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export function useCmsState(): CmsState {
  return useSyncExternalStore(subscribeCms, getCmsState);
}

// ---------------------------------------------------------------------------
// Media URL resolution
// ---------------------------------------------------------------------------

const missingMedia = new Set<string>();

async function ensureMediaUrls(docs: CMSDocument[]) {
  const ids = new Set<string>();
  docs.forEach((doc) => {
    collectStrings(doc, (text) => {
      if (isMediaRef(text)) ids.add(mediaIdFromRef(text));
    });
  });
  const toLoad = [...ids].filter((id) => !state.mediaUrls[id] && !missingMedia.has(id));
  if (!toLoad.length) return;
  const next = { ...state.mediaUrls };
  if (adapter.resolveMediaUrls) {
    try {
      const urls = await adapter.resolveMediaUrls(toLoad);
      toLoad.forEach((id) => {
        if (urls[id]) next[id] = urls[id];
        else missingMedia.add(id);
      });
    } catch {
      // Retried on the next load; images show a blank placeholder until then.
    }
    setState({ mediaUrls: next, mediaVersion: state.mediaVersion + 1 });
    return;
  }
  await Promise.all(
    toLoad.map(async (id) => {
      try {
        const blob = await adapter.getMediaBlob(id);
        if (blob) next[id] = URL.createObjectURL(blob);
        else missingMedia.add(id);
      } catch {
        missingMedia.add(id);
      }
    })
  );
  setState({ mediaUrls: next, mediaVersion: state.mediaVersion + 1 });
}

/** Registers a freshly uploaded or replaced blob without waiting for a reload. */
export function registerMediaBlob(id: string, blob: Blob) {
  const previous = state.mediaUrls[id];
  if (previous) URL.revokeObjectURL(previous);
  missingMedia.delete(id);
  setState({ mediaUrls: { ...state.mediaUrls, [id]: URL.createObjectURL(blob) }, mediaVersion: state.mediaVersion + 1 });
}

/** The media list carries hosted URLs, which covers uploads no page uses yet. */
export function registerMediaUrls(items: { id: string; url?: string }[]) {
  const fresh = items.filter((item) => item.url && !state.mediaUrls[item.id]);
  if (!fresh.length) return;
  const next = { ...state.mediaUrls };
  fresh.forEach((item) => {
    next[item.id] = item.url!;
    missingMedia.delete(item.id);
  });
  setState({ mediaUrls: next, mediaVersion: state.mediaVersion + 1 });
}

export function forgetMedia(id: string) {
  const previous = state.mediaUrls[id];
  if (previous) URL.revokeObjectURL(previous);
  const next = { ...state.mediaUrls };
  delete next[id];
  setState({ mediaUrls: next, mediaVersion: state.mediaVersion + 1 });
}

const cloudMap = cloudinaryMapping as Record<string, string>;

export const resolveMediaString = (value: string) => {
  if (isMediaRef(value)) return state.mediaUrls[mediaIdFromRef(value)] ?? BLANK_IMAGE;
  return cloudMap[value] ?? value;
};

export const resolveThumb = (value: string, width: number) => thumbUrl(resolveMediaString(value), width);

const resolveCache = new Map<CMSDocument, { version: number; resolved: CMSDocument }>();

/** Replaces media references with displayable URLs, so components can use plain src attributes. */
export function resolveDocument(doc: CMSDocument): CMSDocument {
  const cached = resolveCache.get(doc);
  if (cached && cached.version === state.mediaVersion) return cached.resolved;
  const resolved = mapStrings(doc, resolveMediaString);
  resolveCache.clear();
  resolveCache.set(doc, { version: state.mediaVersion, resolved });
  return resolved;
}

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

/** Visitors never request the draft. Only the admin and its previews need it. */
const needsDraft = () => {
  if (adapter.kind === 'local') return true;
  const { pathname, search } = window.location;
  return pathname.startsWith('/admin') || new URLSearchParams(search).get('cmsPreview') === 'draft';
};

async function reloadFromStorage() {
  const [storedPublished, storedDraft] = await Promise.all([
    adapter.loadDocument('published'),
    needsDraft()
      ? adapter.loadDocument('draft').catch((err) => {
          if (err?.status === 401 || err?.status === 403) return null;
          throw err;
        })
      : Promise.resolve(null),
  ]);
  const published = storedPublished ? migrateDocument(storedPublished) : createSeedDocument();
  const draft = storedDraft ? migrateDocument(storedDraft) : published;
  setState({ published, draft, ready: true, savedAt: storedDraft?.updatedAt ?? state.savedAt });
  await ensureMediaUrls([published, draft]);
}

let bootPromise: Promise<void> | null = null;

export function bootCms() {
  if (!bootPromise) {
    bootPromise = reloadFromStorage().catch((err) => {
      setState({ ready: true, error: (err as Error).message });
    });
    const refresh = () => {
      if (state.saveStatus === 'dirty' || state.saveStatus === 'saving') return;
      void reloadFromStorage().catch(() => undefined);
    };
    if (channel) channel.onmessage = refresh;
    // Other devices may have published since this tab was last looked at.
    if (adapter.kind === 'remote') window.addEventListener('focus', refresh);
  }
  return bootPromise;
}

// ---------------------------------------------------------------------------
// Permissions
// ---------------------------------------------------------------------------

function assertAllowed(action: 'edit' | 'publish') {
  const role = getCurrentSession()?.role;
  const allowed = action === 'edit' ? role === 'admin' || role === 'editor' : role === 'admin';
  if (!allowed) throw new Error(`Your role does not allow this action (${action}).`);
}

const author = () => getCurrentSession()?.name ?? 'Unknown';

// ---------------------------------------------------------------------------
// Draft editing
// ---------------------------------------------------------------------------

let autosaveTimer: number | undefined;
let pendingTarget: string | null = null;

async function persistDraft() {
  window.clearTimeout(autosaveTimer);
  setState({ saveStatus: 'saving' });
  try {
    const snapshot = state.draft;
    const doc = { ...snapshot, updatedAt: new Date().toISOString() };
    await adapter.saveDocument('draft', doc);
    // The admin may have kept typing during the network request. Those edits stay in the draft.
    const changedMeanwhile = state.draft !== snapshot;
    setState({
      draft: changedMeanwhile ? { ...state.draft, updatedAt: doc.updatedAt } : doc,
      saveStatus: changedMeanwhile ? 'dirty' : 'saved',
      savedAt: doc.updatedAt,
      error: null,
    });
    announce();
    if (pendingTarget) {
      void logActivity('edited', pendingTarget);
      pendingTarget = null;
    }
  } catch (err) {
    const quota = (err as DOMException)?.name === 'QuotaExceededError';
    if ((err as { status?: number })?.status === 401) void restoreSession().catch(() => undefined);
    setState({
      saveStatus: 'error',
      error: quota ? 'Browser storage is full, so this change was not saved. Export a backup and free up space.' : (err as Error).message,
    });
    throw err;
  }
}

/** Applies an immutable update to the draft and schedules an autosave. */
export function updateDraft(updater: (draft: CMSDocument) => CMSDocument, target = 'Content') {
  assertAllowed('edit');
  pendingTarget = target;
  setState({ draft: updater(state.draft), saveStatus: 'dirty' });
  window.clearTimeout(autosaveTimer);
  autosaveTimer = window.setTimeout(() => {
    void persistDraft().catch(() => undefined);
    void ensureMediaUrls([state.draft]);
  }, AUTOSAVE_MS);
}

export function updatePage(pageId: PageId, updater: (page: CMSDocument['pages'][PageId]) => CMSDocument['pages'][PageId], target?: string) {
  updateDraft(
    (draft) => ({ ...draft, pages: { ...draft.pages, [pageId]: updater(draft.pages[pageId]) } }),
    target ?? `${state.draft.pages[pageId].title} page`
  );
}

async function createRevision(doc: CMSDocument, stage: Stage, label: string) {
  const revision: RevisionRecord = {
    id: uid('rev'),
    createdAt: new Date().toISOString(),
    label,
    stage,
    author: author(),
    document: clone(doc),
  };
  await adapter.saveRevision(revision);
  const all = await adapter.listRevisions();
  await Promise.all(all.slice(MAX_REVISIONS).map((old) => adapter.deleteRevision(old.id)));
}

/** Writes pending edits immediately, for example before opening a preview. */
export async function flushDraft() {
  if (state.saveStatus === 'dirty') await persistDraft();
}

/** Flushes pending edits and records a restorable revision. */
export async function saveDraft(label = 'Saved draft') {
  assertAllowed('edit');
  await persistDraft();
  await createRevision(state.draft, 'draft', label);
  await logActivity('saved', label);
}

async function commitPublished(next: CMSDocument, label: string, activityTarget: string) {
  const doc = { ...next, updatedAt: new Date().toISOString() };
  await adapter.saveDocument('published', doc);
  setState({ published: doc });
  await createRevision(doc, 'published', label);
  await logActivity('published', activityTarget);
  announce();
  void ensureMediaUrls([doc]);
}

export async function publishAll() {
  assertAllowed('publish');
  await persistDraft();
  await commitPublished(clone(state.draft), 'Published entire site', 'Entire website');
}

export async function publishPage(pageId: PageId) {
  assertAllowed('publish');
  await persistDraft();
  const page = clone(state.draft.pages[pageId]);
  await commitPublished(
    { ...state.published, pages: { ...state.published.pages, [pageId]: page } },
    `Published ${page.title} page`,
    `${page.title} page`
  );
}

export async function publishGlobal() {
  assertAllowed('publish');
  await persistDraft();
  await commitPublished({ ...state.published, global: clone(state.draft.global) }, 'Published global settings', 'Global settings');
}

export async function publishGallery() {
  assertAllowed('publish');
  await persistDraft();
  await commitPublished({ ...state.published, gallery: clone(state.draft.gallery) }, 'Published gallery', 'Gallery');
}

/** Publishes the article together with the blog categories it may depend on. */
export async function publishPost(postId: string) {
  assertAllowed('publish');
  await persistDraft();
  const post = clone(state.draft.blog.posts.find((p) => p.id === postId));
  if (!post) throw new Error('Article not found.');
  const live = state.published.blog.posts;
  const order = state.draft.blog.posts.map((p) => p.id);
  const merged = [...live.filter((p) => p.id !== postId), post].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  await commitPublished(
    { ...state.published, blog: { categories: clone(state.draft.blog.categories), posts: merged } },
    `Published article: ${post.title}`,
    post.title
  );
}

/** Publishes category changes only. Article drafts stay as they are. */
export async function publishBlogCategories() {
  assertAllowed('publish');
  await persistDraft();
  await commitPublished(
    { ...state.published, blog: { ...state.published.blog, categories: clone(state.draft.blog.categories) } },
    'Published blog categories',
    'Blog categories'
  );
}

export async function removeLivePost(postId: string) {
  assertAllowed('publish');
  if (!state.published.blog.posts.some((p) => p.id === postId)) return;
  const posts = state.published.blog.posts.filter((p) => p.id !== postId);
  await commitPublished({ ...state.published, blog: { ...state.published.blog, posts } }, 'Removed article from live site', 'Article');
}

export async function setPageStatus(pageId: PageId, status: 'published' | 'unpublished') {
  assertAllowed('publish');
  const patch = (doc: CMSDocument): CMSDocument => ({
    ...doc,
    pages: { ...doc.pages, [pageId]: { ...doc.pages[pageId], status } },
  });
  setState({ draft: patch(state.draft) });
  await persistDraft();
  await commitPublished(
    patch(state.published),
    `${status === 'published' ? 'Published' : 'Unpublished'} ${state.draft.pages[pageId].title} page`,
    `${state.draft.pages[pageId].title} page`
  );
  if (status === 'unpublished') await logActivity('unpublished', `${state.draft.pages[pageId].title} page`);
}

export async function discardDraft() {
  assertAllowed('edit');
  setState({ draft: clone(state.published) });
  await persistDraft();
  await createRevision(state.draft, 'draft', 'Discarded draft changes');
}

export async function restoreRevision(id: string) {
  assertAllowed('publish');
  const revision = await adapter.getRevision(id);
  if (!revision) throw new Error('This revision no longer exists.');
  await createRevision(state.draft, 'draft', 'Before restoring a revision');
  setState({ draft: migrateDocument(clone(revision.document)) });
  await persistDraft();
  await logActivity('restored', revision.label);
  void ensureMediaUrls([state.draft]);
}

export async function replaceAllContent(doc: CMSDocument, label: string) {
  assertAllowed('publish');
  const migrated = migrateDocument(doc);
  if (!isValidDocument(migrated)) throw new Error('This file is not a valid KNOWZA CMS document.');
  await createRevision(state.draft, 'draft', `Before: ${label}`);
  setState({ draft: migrated });
  await persistDraft();
  void ensureMediaUrls([migrated]);
}

export async function resetToOriginal() {
  assertAllowed('publish');
  await createRevision(state.draft, 'draft', 'Before resetting to original content');
  const seedDoc = createSeedDocument();
  setState({ draft: seedDoc });
  await persistDraft();
  await logActivity('reset', 'Draft reset to original website content');
}

// ---------------------------------------------------------------------------
// Draft vs live comparison
// ---------------------------------------------------------------------------

export interface PendingChange {
  scope: string;
  label: string;
}

export function pendingChanges(current: CmsState = state): PendingChange[] {
  const { draft, published } = current;
  const out: PendingChange[] = [];
  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
  (Object.keys(draft.pages) as PageId[]).forEach((id) => {
    if (!same(draft.pages[id], published.pages[id])) out.push({ scope: `page:${id}`, label: `${draft.pages[id].title} page` });
  });
  if (!same(draft.global, published.global)) out.push({ scope: 'global', label: 'Global settings' });
  if (!same(draft.gallery, published.gallery)) out.push({ scope: 'gallery', label: 'Gallery' });
  draft.blog.posts.forEach((post) => {
    const live = published.blog.posts.find((p) => p.id === post.id);
    if (!same(post, live)) out.push({ scope: `post:${post.id}`, label: post.title || 'Untitled article' });
  });
  published.blog.posts.forEach((post) => {
    if (!draft.blog.posts.some((p) => p.id === post.id)) out.push({ scope: `post:${post.id}`, label: `Deleted: ${post.title}` });
  });
  if (!same(draft.blog.categories, published.blog.categories)) out.push({ scope: 'blog-categories', label: 'Blog categories' });
  return out;
}

export { ensureMediaUrls };
