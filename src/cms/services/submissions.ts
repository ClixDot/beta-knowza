import type { EnquiryRecord, SubscriberRecord } from '../types';
import { uid } from '../utils';
import { adapter } from './cmsStore';

const listeners = new Set<() => void>();
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('knowza-cms-records') : null;
if (channel) channel.onmessage = () => listeners.forEach((listener) => listener());

const notify = () => {
  listeners.forEach((listener) => listener());
  channel?.postMessage('changed');
};

export const subscribeSubmissions = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export async function saveEnquiry(input: Pick<EnquiryRecord, 'name' | 'email' | 'phone' | 'purpose' | 'message'>) {
  await adapter.putRecord({ ...input, id: uid('enq'), kind: 'enquiry', createdAt: new Date().toISOString(), read: false });
  notify();
}

export async function saveSubscriber(email: string) {
  // Visitors cannot read the list; on the backend the server removes duplicates itself.
  const existing = adapter.kind === 'local' ? await adapter.listRecords<SubscriberRecord>('subscriber') : [];
  if (!existing.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
    await adapter.putRecord({ id: uid('sub'), kind: 'subscriber', createdAt: new Date().toISOString(), email });
    notify();
  }
}

export const listEnquiries = () => adapter.listRecords<EnquiryRecord>('enquiry');
export const listSubscribers = () => adapter.listRecords<SubscriberRecord>('subscriber');

export async function setEnquiryRead(record: EnquiryRecord, read: boolean) {
  await adapter.putRecord({ ...record, read });
  notify();
}

export async function deleteSubmission(id: string) {
  await adapter.deleteRecord(id);
  notify();
}
