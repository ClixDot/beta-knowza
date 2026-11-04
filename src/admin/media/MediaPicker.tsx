import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Film, Search, Upload } from 'lucide-react';
import { Btn, EmptyState, Modal, Skeleton, useFeedback } from '../components/ui';
import { IMAGE_TYPES, VIDEO_TYPES, listMedia, probeImageUrl, subscribeMedia, uploadFiles } from '../../cms/services/media';
import { resolveMediaString, useCmsState } from '../../cms/services/cmsStore';
import type { MediaItem } from '../../cms/types';

export function useMediaLibrary() {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  useEffect(() => {
    let alive = true;
    const load = () =>
      listMedia()
        .then((list) => alive && setItems(list))
        .catch(() => alive && setItems([]));
    void load();
    const unsubscribe = subscribeMedia(() => void load());
    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);
  return items;
}

export const MediaThumb: React.FC<{ item: MediaItem; className?: string }> = ({ item, className = '' }) => {
  useCmsState(); // Re-render when an uploaded blob's URL becomes available.
  const src = resolveMediaString(item.ref);
  if (item.kind === 'video') {
    return (
      <div className={`relative bg-adm-deep ${className}`}>
        <video src={src} muted preload="metadata" className="w-full h-full object-cover" />
        <span className="absolute left-2 top-2 p-1 rounded-md bg-black/60 text-white"><Film className="w-3.5 h-3.5" /></span>
      </div>
    );
  }
  return <img src={src} alt={item.alt || item.name} loading="lazy" className={`object-cover bg-adm-panel ${className}`} />;
};

/** Asks for an image address and only accepts it once it has actually loaded as an image. */
export const ImageUrlForm: React.FC<{
  label: string;
  initial?: string;
  submitLabel: string;
  help: string;
  onSubmit: (url: string, size: { width: number; height: number }) => void | Promise<void>;
  onCancel?: () => void;
}> = ({ label, initial = '', submitLabel, help, onSubmit, onCancel }) => {
  const [url, setUrl] = useState(initial);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError('');
    try {
      await onSubmit(url.trim(), await probeImageUrl(url));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col xs:flex-row gap-2">
        <input
          type="url"
          inputMode="url"
          className="adm-input flex-1 min-w-0"
          aria-label={`URL for ${label}`}
          aria-invalid={Boolean(error)}
          placeholder="https://example.com/photo.jpg"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (url.trim()) void submit();
            }
          }}
        />
        <Btn variant="primary" busy={busy} disabled={!url.trim()} onClick={submit}>{submitLabel}</Btn>
        {onCancel && <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>}
      </div>
      {error ? <p role="alert" className="text-[12px] text-[#9F3424] mt-1.5">{error}</p> : <p className="text-[12px] text-adm-mute mt-1.5">{help}</p>}
    </div>
  );
};

interface MediaPickerProps {
  open: boolean;
  kind: 'image' | 'video';
  onClose: () => void;
  onPick: (item: MediaItem) => void;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({ open, kind, onClose, onPick }) => {
  const items = useMediaLibrary();
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useFeedback();

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (items ?? []).filter(
      (item) => item.kind === kind && (!needle || item.name.toLowerCase().includes(needle) || item.alt.toLowerCase().includes(needle) || item.category.toLowerCase().includes(needle))
    );
  }, [items, kind, query]);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    const { items: uploaded, errors } = await uploadFiles([...files]);
    setBusy(false);
    errors.forEach((error) => toast(error, 'error'));
    if (uploaded.length === 1) {
      onPick(uploaded[0]);
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={kind === 'video' ? 'Choose a video' : 'Choose an image'}
      size="xl"
      footer={<Btn variant="ghost" onClick={onClose}>Cancel</Btn>}
    >
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-adm-mute" />
          <input className="adm-input pl-9" placeholder="Search by name, alt text or category" aria-label="Search media" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Btn variant="primary" icon={<Upload className="w-4 h-4" />} busy={busy} onClick={() => inputRef.current?.click()}>
          Upload new
        </Btn>
        <input
          ref={inputRef}
          type="file"
          hidden
          data-testid="picker-upload"
          accept={(kind === 'video' ? VIDEO_TYPES : IMAGE_TYPES).join(',')}
          onChange={(e) => {
            void upload(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {items === null ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="aspect-square" />)}
        </div>
      ) : shown.length === 0 ? (
        <EmptyState
          icon={kind === 'video' ? <Film className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
          title={query ? 'Nothing matches that search' : `No ${kind}s in the library yet`}
          text={query ? 'Try a different word.' : 'Upload one to use it here.'}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {shown.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onPick(item);
                onClose();
              }}
              className="adm-tile adm-lift group text-left overflow-hidden"
            >
              <span className="block relative">
                <MediaThumb item={item} className="w-full aspect-square block" />
                <span className="absolute inset-0 bg-adm-deep/0 group-hover:bg-adm-deep/30 transition-colors flex items-center justify-center">
                  <Check className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" />
                </span>
              </span>
              <span className="block px-2 py-1.5 text-[12px] truncate text-adm-mute">{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
};
