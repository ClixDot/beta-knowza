import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Film, Image as ImageIcon, Link2, RefreshCw, Search, Trash2, Upload } from 'lucide-react';
import { Btn, Card, Chip, EmptyState, IconBtn, Modal, PageHeader, Select, Skeleton, useFeedback } from '../components/ui';
import { FieldShell, TextInput } from '../editors/FormRenderer';
import { ImageUrlForm, MediaThumb, useMediaLibrary } from '../media/MediaPicker';
import { canEdit, useSession } from '../../cms/services/auth';
import { IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, VIDEO_TYPES, deleteMedia, findUsage, importImageFromUrl, replaceMedia, updateMediaMeta, uploadFiles } from '../../cms/services/media';
import { resolveMediaString, useCmsState } from '../../cms/services/cmsStore';
import type { MediaItem } from '../../cms/types';
import { formatBytes } from '../../cms/utils';

const ALL_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES].join(',');

const MediaDetail: React.FC<{ item: MediaItem; onClose: () => void; editable: boolean }> = ({ item, onClose, editable }) => {
  useCmsState();
  const { run, confirm, toast } = useFeedback();
  const [meta, setMeta] = useState(item);
  const replaceRef = useRef<HTMLInputElement>(null);
  const usage = findUsage(item.ref);
  const src = resolveMediaString(item.ref);

  useEffect(() => setMeta(item), [item]);

  // Bundled assets report their true dimensions once the browser has decoded them.
  const onLoaded = (width: number, height: number) => {
    if (!meta.width && width) setMeta((current) => ({ ...current, width, height }));
  };

  const save = () => run(() => updateMediaMeta(item, { name: meta.name, alt: meta.alt, caption: meta.caption, category: meta.category, width: meta.width, height: meta.height }), 'Details saved.');

  return (
    <Modal
      open
      onClose={onClose}
      title={meta.name}
      size="lg"
      footer={
        <>
          <Btn
            variant="danger"
            disabled={!editable}
            icon={<Trash2 className="w-4 h-4" />}
            onClick={async () => {
              if (usage.length) {
                toast(`This file is still used in ${usage.length} place${usage.length > 1 ? 's' : ''}. Replace it there first.`, 'error');
                return;
              }
              const ok = await confirm({ title: `Delete ${item.name}?`, text: item.origin === 'upload' ? 'The file is removed from this browser permanently.' : 'This bundled image is hidden from the library. The file itself stays in the project.', confirmLabel: 'Delete', danger: true });
              if (ok && (await run(() => deleteMedia(item), 'Deleted.'))) onClose();
            }}
          >
            Delete
          </Btn>
          <Btn disabled={!editable} icon={<RefreshCw className="w-4 h-4" />} onClick={() => replaceRef.current?.click()}>Replace file</Btn>
          <input
            ref={replaceRef}
            type="file"
            hidden
            data-testid="media-replace"
            accept={item.kind === 'video' ? VIDEO_TYPES.join(',') : IMAGE_TYPES.join(',')}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (file && (await run(() => replaceMedia(item, file), 'File replaced everywhere it is used.'))) onClose();
            }}
          />
          <div className="flex-1" />
          <Btn variant="primary" disabled={!editable} onClick={save}>Save details</Btn>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {item.kind === 'video' ? (
            <video src={src} controls className="w-full rounded-[16px] bg-adm-deep" onLoadedMetadata={(e) => onLoaded(e.currentTarget.videoWidth, e.currentTarget.videoHeight)} />
          ) : (
            <img src={src} alt={meta.alt} className="w-full rounded-[16px] bg-adm-panel" onLoad={(e) => onLoaded(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)} />
          )}
          <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-[12.5px] mt-3">
            <dt className="text-adm-mute">Type</dt><dd className="break-all">{item.mime}</dd>
            <dt className="text-adm-mute">Size</dt><dd>{formatBytes(item.size)}</dd>
            <dt className="text-adm-mute">Dimensions</dt><dd>{meta.width ? `${meta.width} × ${meta.height}` : 'Reading…'}</dd>
            <dt className="text-adm-mute">Source</dt><dd>{item.origin === 'upload' ? 'Uploaded' : 'Bundled with the site'}</dd>
            <dt className="text-adm-mute">Reference</dt>
            <dd className="flex items-center gap-1 min-w-0">
              <span className="truncate">{item.ref}</span>
              <IconBtn label="Copy reference" className="!w-7 !h-7" onClick={() => navigator.clipboard.writeText(item.ref).then(() => toast('Copied.'))}><Copy className="w-3.5 h-3.5" /></IconBtn>
            </dd>
          </dl>
        </div>
        <div className="space-y-3">
          <TextInput label="Name" value={meta.name} onChange={(name) => setMeta({ ...meta, name })} />
          <TextInput multiline label="Alt text" value={meta.alt} onChange={(alt) => setMeta({ ...meta, alt })} help="Filled in automatically when this image is picked for a field with no alt text." />
          <TextInput label="Caption" value={meta.caption} onChange={(caption) => setMeta({ ...meta, caption })} />
          <TextInput label="Category" value={meta.category} onChange={(category) => setMeta({ ...meta, category })} />
          <FieldShell label={`Used in ${usage.length} place${usage.length === 1 ? '' : 's'}`}>
            {usage.length === 0 ? (
              <p className="text-[13px] text-adm-mute">Not used anywhere yet.</p>
            ) : (
              <ul className="space-y-1 text-[13px] max-h-44 overflow-y-auto adm-scroll">
                {usage.map((use) => (
                  <li key={`${use.location}-${use.stage}`} className="flex items-center gap-1.5">
                    <Chip tone={use.stage === 'live' ? 'green' : 'neutral'}>{use.stage === 'live' ? 'Live only' : 'Draft'}</Chip>
                    <span className="truncate">{use.location}</span>
                  </li>
                ))}
              </ul>
            )}
          </FieldShell>
        </div>
      </div>
    </Modal>
  );
};

export const MediaLibrary: React.FC = () => {
  const items = useMediaLibrary();
  const { draft } = useCmsState();
  const session = useSession();
  const editable = canEdit(session?.role);
  const { toast } = useFeedback();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [category, setCategory] = useState('all');
  const [usageFilter, setUsageFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [linking, setLinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => [...new Set((items ?? []).map((i) => i.category))].sort(), [items]);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (items ?? []).filter((item) => {
      if (kind !== 'all' && item.kind !== kind) return false;
      if (category !== 'all' && item.category !== category) return false;
      if (needle && ![item.name, item.alt, item.caption, item.category].some((text) => text.toLowerCase().includes(needle))) return false;
      if (usageFilter !== 'all' && (findUsage(item.ref).length > 0) !== (usageFilter === 'used')) return false;
      return true;
    });
  }, [items, query, kind, category, usageFilter, draft]);

  const selected = items?.find((i) => i.id === selectedId) ?? null;

  const upload = async (files: FileList | File[] | null) => {
    if (!files || !files.length) return;
    setBusy(true);
    const { items: uploaded, errors } = await uploadFiles([...files]);
    setBusy(false);
    errors.forEach((error) => toast(error, 'error'));
    if (uploaded.length) toast(`${uploaded.length} file${uploaded.length > 1 ? 's' : ''} uploaded.`);
  };

  return (
    <div
      onDragOver={(e) => {
        if (editable && e.dataTransfer.types.includes('Files')) {
          e.preventDefault();
          setDragging(true);
        }
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void upload(e.dataTransfer.files);
      }}
    >
      <PageHeader
        title="Media Library"
        subtitle={`Images up to ${formatBytes(MAX_IMAGE_BYTES)} and videos up to ${formatBytes(MAX_VIDEO_BYTES)}. Drop files anywhere on this page.`}
        actions={
          <>
            <Btn disabled={!editable} icon={<Link2 className="w-4 h-4" />} onClick={() => setLinking(true)}>Add by URL</Btn>
            <Btn variant="primary" busy={busy} disabled={!editable} icon={<Upload className="w-4 h-4" />} onClick={() => inputRef.current?.click()}>Upload files</Btn>
            <input ref={inputRef} data-testid="media-upload" type="file" hidden multiple accept={ALL_TYPES} onChange={(e) => { void upload(e.target.files); e.target.value = ''; }} />
          </>
        }
      />
      <div className="flex flex-col md:flex-row gap-2 mb-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-adm-mute" />
          <input className="adm-input pl-9" placeholder="Search name, alt text or caption" aria-label="Search media" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 md:flex">
          <Select className="md:w-36" aria-label="Filter by type" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="all">All types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </Select>
          <Select className="md:w-48" aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select className="md:w-36" aria-label="Filter by usage" value={usageFilter} onChange={(e) => setUsageFilter(e.target.value)}>
            <option value="all">Any usage</option>
            <option value="used">In use</option>
            <option value="unused">Unused</option>
          </Select>
        </div>
      </div>

      {dragging && <div className="mb-3 rounded-[24px] border-2 border-dashed border-[#5F6C36] bg-white p-6 text-center text-[14px]">Drop to upload</div>}

      {items === null ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2.5">
          {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
        </div>
      ) : shown.length === 0 ? (
        <Card><EmptyState icon={kind === 'video' ? <Film className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />} title="Nothing matches" text="Change the filters or upload a new file." /></Card>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2.5">
          {shown.map((item) => {
            const uses = findUsage(item.ref).length;
            return (
              <li key={item.id}>
                <button type="button" data-testid={`media-${item.name}`} onClick={() => setSelectedId(item.id)} className="adm-tile adm-lift w-full text-left overflow-hidden">
                  <MediaThumb item={item} className="w-full aspect-square block" />
                  <span className="block p-2.5">
                    <span className="block text-[12.5px] truncate">{item.name}</span>
                    <span className="block text-[11.5px] text-adm-mute truncate">{formatBytes(item.size)} · {uses ? `${uses} use${uses > 1 ? 's' : ''}` : 'Unused'}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Modal open={linking} onClose={() => setLinking(false)} title="Add an image by URL">
        <ImageUrlForm
          label="the library image"
          submitLabel="Add to library"
          help="Saves your own copy in the library, so it keeps working if the original is removed."
          onSubmit={async (url) => {
            await importImageFromUrl(url);
            setLinking(false);
            toast('Image added to the library.');
          }}
        />
      </Modal>

      {selected && <MediaDetail item={selected} editable={editable} onClose={() => setSelectedId(null)} />}
    </div>
  );
};
