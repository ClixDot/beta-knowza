import type { ActivityRecord } from '../types';
import { uid } from '../utils';
import { adapter } from './cmsStore';
import { getCurrentSession } from './auth';

const MAX_ACTIVITY = 300;
const listeners = new Set<() => void>();

export const subscribeActivity = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

let lastEdit: { target: string; at: number } | null = null;

export async function logActivity(action: ActivityRecord['action'], target: string) {
  // Keystroke autosaves on one target collapse into a single entry per five minutes.
  if (action === 'edited') {
    if (lastEdit && lastEdit.target === target && Date.now() - lastEdit.at < 5 * 60 * 1000) return;
    lastEdit = { target, at: Date.now() };
  }
  try {
    await adapter.putRecord({
      id: uid('act'),
      kind: 'activity',
      createdAt: new Date().toISOString(),
      action,
      target,
      author: getCurrentSession()?.name ?? 'Unknown',
    });
    const all = await adapter.listRecords<ActivityRecord>('activity');
    await Promise.all(all.slice(MAX_ACTIVITY).map((old) => adapter.deleteRecord(old.id)));
    listeners.forEach((listener) => listener());
  } catch {
    // The activity log is informational and must never block saving content.
  }
}

export const listActivity = () => adapter.listRecords<ActivityRecord>('activity');
