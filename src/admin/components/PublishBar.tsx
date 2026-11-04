import React, { useState } from 'react';
import { AlertTriangle, Check, CloudOff, Eye, Loader2, Save, Upload } from 'lucide-react';
import { Btn, useFeedback } from './ui';
import { PreviewModal } from '../editors/PreviewModal';
import { canEdit, canPublish, useSession } from '../../cms/services/auth';
import { flushDraft, saveDraft, useCmsState } from '../../cms/services/cmsStore';
import { timeAgo } from '../../cms/utils';

export const SaveIndicator: React.FC = () => {
  const { saveStatus, savedAt } = useCmsState();
  const view = {
    idle: { icon: <Check className="w-3.5 h-3.5" />, text: savedAt ? `Saved ${timeAgo(savedAt).toLowerCase()}` : 'No changes yet' },
    dirty: { icon: <CloudOff className="w-3.5 h-3.5" />, text: 'Unsaved changes' },
    saving: { icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, text: 'Saving…' },
    saved: { icon: <Check className="w-3.5 h-3.5" />, text: 'Draft saved' },
    error: { icon: <AlertTriangle className="w-3.5 h-3.5" />, text: 'Not saved' },
  }[saveStatus];
  return (
    <span role="status" data-testid="save-status" className={`inline-flex items-center gap-1.5 text-[12px] font-medium leading-none ${saveStatus === 'error' ? 'text-[#9F3424]' : 'text-adm-mute'}`}>
      {view.icon}
      <span>{view.text}</span>
    </span>
  );
};

interface PublishBarProps {
  previewPath: string;
  sectionId?: string;
  publishLabel?: string;
  onPublish: () => Promise<void>;
  extra?: React.ReactNode;
  hasChanges?: boolean;
}

/** Save, preview and publish controls shared by every editor. */
export const PublishBar: React.FC<PublishBarProps> = ({ previewPath, sectionId, publishLabel = 'Publish', onPublish, extra, hasChanges = true }) => {
  const session = useSession();
  const { run, confirm } = useFeedback();
  const [previewing, setPreviewing] = useState(false);
  const [busy, setBusy] = useState<'save' | 'publish' | null>(null);

  const save = async () => {
    setBusy('save');
    await run(() => saveDraft(), 'Draft saved. It is not public until you publish.');
    setBusy(null);
  };

  const publish = async () => {
    const ok = await confirm({ title: `${publishLabel}?`, text: 'These changes become visible on the public website.', confirmLabel: 'Publish' });
    if (!ok) return;
    setBusy('publish');
    await run(onPublish, 'Published to the website.');
    setBusy(null);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SaveIndicator />
      {extra}
      <Btn
        size="sm"
        icon={<Eye className="w-3.5 h-3.5" />}
        onClick={async () => {
          await flushDraft().catch(() => undefined);
          setPreviewing(true);
        }}
      >
        Preview
      </Btn>
      <Btn size="sm" icon={<Save className="w-3.5 h-3.5" />} busy={busy === 'save'} disabled={!canEdit(session?.role)} onClick={save}>
        Save draft
      </Btn>
      <Btn size="sm" variant="primary" icon={<Upload className="w-3.5 h-3.5" />} busy={busy === 'publish'} disabled={!canPublish(session?.role) || !hasChanges} onClick={publish}>
        {publishLabel}
      </Btn>
      <PreviewModal open={previewing} onClose={() => setPreviewing(false)} path={previewPath} sectionId={sectionId} />
    </div>
  );
};
