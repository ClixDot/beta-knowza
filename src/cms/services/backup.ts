import { isValidDocument, migrateDocument } from '../migration';
import type { ActivityRecord, CmsRecord, EnquiryRecord, MediaItem, SubscriberRecord } from '../types';
import { logActivity } from './activity';
import { adapter, ensureMediaUrls, getCmsState, replaceAllContent, registerMediaBlob, publishAll } from './cmsStore';
import { getCurrentSession } from './auth';

const FORMAT = 'knowza-cms-backup';

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

/** Everything needed to rebuild the CMS, including uploads. This is also the MongoDB import format. */
export async function createBackup(): Promise<Blob> {
  const { draft, published } = getCmsState();
  const items = await adapter.listMedia();
  const media = await Promise.all(
    items.map(async (item) => {
      const blob = item.origin === 'upload' ? await adapter.getMediaBlob(item.id) : null;
      return { item, data: blob ? await blobToDataUrl(blob) : null };
    })
  );
  const [enquiries, subscribers] = await Promise.all([
    adapter.listRecords<EnquiryRecord>('enquiry'),
    adapter.listRecords<SubscriberRecord>('subscriber'),
  ]);
  const payload = { format: FORMAT, exportedAt: new Date().toISOString(), draft, published, media, records: [...enquiries, ...subscribers] };
  return new Blob([JSON.stringify(payload)], { type: 'application/json' });
}

export async function restoreBackup(file: File) {
  if (getCurrentSession()?.role !== 'admin') throw new Error('Only an admin can restore a backup.');
  let payload: any;
  try {
    payload = JSON.parse(await file.text());
  } catch {
    throw new Error('This file is not valid JSON.');
  }
  if (payload?.format !== FORMAT) throw new Error('This is not a KNOWZA CMS backup file.');
  const draft = migrateDocument(payload.draft);
  const published = migrateDocument(payload.published);
  if (!isValidDocument(draft) || !isValidDocument(published)) throw new Error('The backup contains invalid content.');
  // Checked before anything is written, so a bad file cannot leave a half-finished restore.
  for (const { item, data } of (payload.media ?? []) as { item: MediaItem; data: string | null }[]) {
    if (data && !/^data:(image|video)\//.test(data)) throw new Error(`Backup media "${item.name}" has an unsupported type.`);
  }

  for (const { item, data } of (payload.media ?? []) as { item: MediaItem; data: string | null }[]) {
    if (data) {
      const blob = await (await fetch(data)).blob();
      await adapter.putMedia(item, blob);
      registerMediaBlob(item.id, blob);
    } else {
      await adapter.putMedia(item);
    }
  }
  for (const record of (payload.records ?? []) as CmsRecord[]) {
    if (record.kind !== ('activity' as ActivityRecord['kind'])) await adapter.putRecord(record);
  }

  await replaceAllContent(published, 'Restoring backup');
  await publishAll();
  await replaceAllContent(draft, 'Restoring backup');
  await ensureMediaUrls([draft, published]);
  await logActivity('imported', file.name);
}
