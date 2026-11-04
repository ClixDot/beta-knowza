import type { CMSDocument, CmsRecord, MediaItem, RecordKind, RevisionRecord, Stage } from '../types';

export interface StorageUsage {
  usedBytes: number;
  quotaBytes: number;
  mediaBytes: number;
  documentBytes: number;
}

/**
 * The only boundary between the CMS and where its data lives. Services call this
 * interface and never touch localStorage or IndexedDB directly, so moving to
 * MongoDB and Cloudinary means providing another implementation.
 */
export interface CMSStorageAdapter {
  readonly kind: 'local' | 'remote';

  /**
   * Optional synchronous read used for first paint so the public site does not
   * flash seed content. A remote adapter may return null and rely on loadDocument.
   */
  getCachedDocument?(stage: Stage): CMSDocument | null;

  loadDocument(stage: Stage): Promise<CMSDocument | null>;
  saveDocument(stage: Stage, doc: CMSDocument): Promise<void>;
  clearDocuments(): Promise<void>;

  listRevisions(): Promise<Omit<RevisionRecord, 'document'>[]>;
  getRevision(id: string): Promise<RevisionRecord | null>;
  saveRevision(revision: RevisionRecord): Promise<void>;
  deleteRevision(id: string): Promise<void>;

  listMedia(): Promise<MediaItem[]>;
  getMediaBlob(id: string): Promise<Blob | null>;
  /** Hosted media can be displayed by URL, without downloading each file first. */
  resolveMediaUrls?(ids: string[]): Promise<Record<string, string>>;
  /** Stores or replaces an item. A blob is omitted when only metadata changes. */
  putMedia(item: MediaItem, blob?: Blob): Promise<void>;
  deleteMedia(id: string): Promise<void>;

  listRecords<T extends CmsRecord>(kind: RecordKind): Promise<T[]>;
  putRecord(record: CmsRecord): Promise<void>;
  deleteRecord(id: string): Promise<void>;

  getUsage(): Promise<StorageUsage>;
}
