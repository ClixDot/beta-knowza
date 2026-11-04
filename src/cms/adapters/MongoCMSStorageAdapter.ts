import type { CMSDocument, CmsRecord, MediaItem, RecordKind, RevisionRecord, Stage } from '../types';
import type { CMSStorageAdapter, StorageUsage } from './CMSStorageAdapter';

const CACHE_KEY = 'knowza.cms.cache.published';
const REQUEST_TIMEOUT_MS = 12000;

/**
 * Production adapter. It talks to the CMS API, never to MongoDB or Cloudinary
 * directly: credentials stay on the server. Files upload straight to Cloudinary
 * using a short-lived signature, because serverless functions cap request size.
 */
export class MongoCMSStorageAdapter implements CMSStorageAdapter {
  readonly kind = 'remote' as const;
  private saveQueue: Partial<Record<Stage, Promise<unknown>>> = {};

  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        credentials: 'same-origin',
        signal: controller.signal,
        ...init,
        headers: { 'X-Knowza-CMS': '1', ...init.headers },
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw Object.assign(new Error(body?.error ?? `Request failed (${response.status}).`), { status: response.status });
      return body as T;
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw new Error('The server took too long to respond.');
      throw err;
    } finally {
      window.clearTimeout(timer);
    }
  }

  private json(method: string, body: unknown): RequestInit {
    return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
  }

  /** Last seen live content, so returning visitors get an immediate first paint. */
  getCachedDocument(stage: Stage): CMSDocument | null {
    if (stage !== 'published') return null;
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      return raw ? (JSON.parse(raw) as CMSDocument) : null;
    } catch {
      return null;
    }
  }

  private cache(stage: Stage, doc: CMSDocument | null) {
    if (stage !== 'published') return;
    try {
      if (doc) localStorage.setItem(CACHE_KEY, JSON.stringify(doc));
      else localStorage.removeItem(CACHE_KEY);
    } catch {
      // The cache is only an optimisation.
    }
  }

  async loadDocument(stage: Stage) {
    const doc = await this.request<CMSDocument | null>(`/documents/${stage}`);
    this.cache(stage, doc);
    return doc;
  }

  saveDocument(stage: Stage, doc: CMSDocument) {
    // Writes run in order, so a slow earlier save cannot overwrite a newer one.
    const run = async () => {
      await this.request<void>(`/documents/${stage}`, this.json('PUT', doc));
      this.cache(stage, doc);
    };
    const next = (this.saveQueue[stage] ?? Promise.resolve()).catch(() => undefined).then(run);
    this.saveQueue[stage] = next;
    return next;
  }

  async clearDocuments() {
    await this.request<void>('/documents', { method: 'DELETE' });
    this.cache('published', null);
  }

  listRevisions() {
    return this.request<Omit<RevisionRecord, 'document'>[]>('/revisions');
  }

  getRevision(id: string) {
    return this.request<RevisionRecord | null>(`/revisions/${encodeURIComponent(id)}`);
  }

  saveRevision(revision: RevisionRecord) {
    return this.request<void>('/revisions', this.json('POST', revision));
  }

  deleteRevision(id: string) {
    return this.request<void>(`/revisions/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  listMedia() {
    return this.request<MediaItem[]>('/media');
  }

  async resolveMediaUrls(ids: string[]) {
    const urls: Record<string, string> = {};
    for (let i = 0; i < ids.length; i += 50) {
      const batch = ids.slice(i, i + 50).map(encodeURIComponent).join(',');
      Object.assign(urls, await this.request<Record<string, string>>(`/media-urls?ids=${batch}`));
    }
    return urls;
  }

  async getMediaBlob(id: string) {
    const url = (await this.resolveMediaUrls([id]))[id];
    if (!url) return null;
    const response = await fetch(url);
    return response.ok ? response.blob() : null;
  }

  async putMedia(item: MediaItem, blob?: Blob) {
    let upload: { url: string; publicId: string; resourceType: string } | undefined;
    if (blob) {
      const signed = await this.request<any>('/media/sign', this.json('POST', { id: item.id, kind: item.kind }));
      const form = new FormData();
      form.append('file', blob);
      form.append('api_key', signed.apiKey);
      form.append('signature', signed.signature);
      for (const key of ['timestamp', 'public_id', 'folder', 'overwrite', 'invalidate', 'allowed_formats']) {
        form.append(key, String(signed[key]));
      }
      const response = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/${signed.resourceType}/upload`, { method: 'POST', body: form });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error?.message ?? 'Cloudinary rejected this upload.');
      upload = { url: result.secure_url, publicId: result.public_id, resourceType: signed.resourceType };
    }
    await this.request<void>('/media', this.json('POST', { item, upload }));
  }

  deleteMedia(id: string) {
    return this.request<void>(`/media/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  listRecords<T extends CmsRecord>(kind: RecordKind) {
    return this.request<T[]>(`/records?kind=${kind}`);
  }

  putRecord(record: CmsRecord) {
    return this.request<void>('/records', this.json('PUT', record));
  }

  deleteRecord(id: string) {
    return this.request<void>(`/records/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  getUsage() {
    return this.request<StorageUsage>('/usage');
  }

  async login(email: string, password: string) {
    return this.request<{ name: string; email: string; role: string }>('/auth/login', this.json('POST', { email, password }));
  }

  whoAmI() {
    return this.request<{ name: string; email: string; role: string } | null>('/auth/me');
  }

  logout() {
    return this.request<void>('/auth/logout', { method: 'POST' });
  }

  changePassword(current: string, next: string) {
    return this.request<void>('/auth/password', this.json('POST', { current, next }));
  }
}
