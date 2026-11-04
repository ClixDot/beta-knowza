import type { CMSDocument, CmsRecord, MediaItem, RecordKind, RevisionRecord, Stage } from '../types';
import type { CMSStorageAdapter, StorageUsage } from './CMSStorageAdapter';

const DOC_KEY = (stage: Stage) => `knowza.cms.document.${stage}`;
const DB_NAME = 'knowza-cms';
const DB_VERSION = 1;
const STORES = { media: 'media', blobs: 'blobs', revisions: 'revisions', records: 'records' } as const;
type StoreName = keyof typeof STORES;

const promisify = <T,>(request: IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

/**
 * Development storage. Content JSON lives in localStorage so first paint can be
 * synchronous. Media blobs, revisions and records live in IndexedDB.
 * This is per-browser storage, not a shared production database.
 */
export class LocalCMSStorageAdapter implements CMSStorageAdapter {
  readonly kind = 'local' as const;
  private dbPromise: Promise<IDBDatabase> | null = null;

  private db(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const open = indexedDB.open(DB_NAME, DB_VERSION);
        open.onupgradeneeded = () => {
          const db = open.result;
          (Object.keys(STORES) as StoreName[]).forEach((name) => {
            if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: name === 'blobs' ? 'id' : 'id' });
          });
        };
        open.onsuccess = () => resolve(open.result);
        open.onerror = () => {
          this.dbPromise = null;
          reject(open.error);
        };
      });
    }
    return this.dbPromise;
  }

  private async store(name: StoreName, mode: IDBTransactionMode = 'readonly') {
    return (await this.db()).transaction(name, mode).objectStore(name);
  }

  getCachedDocument(stage: Stage): CMSDocument | null {
    try {
      const raw = localStorage.getItem(DOC_KEY(stage));
      return raw ? (JSON.parse(raw) as CMSDocument) : null;
    } catch {
      return null;
    }
  }

  async loadDocument(stage: Stage) {
    return this.getCachedDocument(stage);
  }

  async saveDocument(stage: Stage, doc: CMSDocument) {
    localStorage.setItem(DOC_KEY(stage), JSON.stringify(doc));
  }

  async clearDocuments() {
    localStorage.removeItem(DOC_KEY('draft'));
    localStorage.removeItem(DOC_KEY('published'));
  }

  async listRevisions() {
    const all = await promisify((await this.store('revisions')).getAll()) as RevisionRecord[];
    return all
      .map(({ document: _document, ...meta }) => meta)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getRevision(id: string) {
    return ((await promisify((await this.store('revisions')).get(id))) as RevisionRecord) ?? null;
  }

  async saveRevision(revision: RevisionRecord) {
    await promisify((await this.store('revisions', 'readwrite')).put(revision));
  }

  async deleteRevision(id: string) {
    await promisify((await this.store('revisions', 'readwrite')).delete(id));
  }

  async listMedia() {
    return (await promisify((await this.store('media')).getAll())) as MediaItem[];
  }

  async getMediaBlob(id: string) {
    const row = (await promisify((await this.store('blobs')).get(id))) as { id: string; blob: Blob } | undefined;
    return row?.blob ?? null;
  }

  async putMedia(item: MediaItem, blob?: Blob) {
    if (blob) await promisify((await this.store('blobs', 'readwrite')).put({ id: item.id, blob }));
    await promisify((await this.store('media', 'readwrite')).put(item));
  }

  async deleteMedia(id: string) {
    await promisify((await this.store('blobs', 'readwrite')).delete(id));
    await promisify((await this.store('media', 'readwrite')).delete(id));
  }

  async listRecords<T extends CmsRecord>(kind: RecordKind) {
    const all = (await promisify((await this.store('records')).getAll())) as CmsRecord[];
    return all
      .filter((r) => r.kind === kind)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)) as T[];
  }

  async putRecord(record: CmsRecord) {
    await promisify((await this.store('records', 'readwrite')).put(record));
  }

  async deleteRecord(id: string) {
    await promisify((await this.store('records', 'readwrite')).delete(id));
  }

  async getUsage(): Promise<StorageUsage> {
    const documentBytes = ['draft', 'published'].reduce(
      (sum, stage) => sum + (localStorage.getItem(DOC_KEY(stage as Stage))?.length ?? 0),
      0
    );
    const media = await this.listMedia();
    const mediaBytes = media.filter((m) => m.origin === 'upload').reduce((sum, m) => sum + m.size, 0);
    const estimate = await navigator.storage?.estimate?.();
    return {
      documentBytes,
      mediaBytes,
      usedBytes: estimate?.usage ?? documentBytes + mediaBytes,
      quotaBytes: estimate?.quota ?? 0,
    };
  }
}
