import React, { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff, GripVertical, Images, LayoutGrid, Link2, Maximize2, Pencil, Rows3, Star, Trash2, Upload, X } from 'lucide-react';
import { Btn, Card, Chip, EmptyState, IconBtn, Modal, PageHeader, Select, Tabs, useFeedback } from '../components/ui';
import { FieldShell, FormRenderer, ImageInput, TextInput } from '../editors/FormRenderer';
import { PublishBar } from '../components/PublishBar';
import { ImageUrlForm } from '../media/MediaPicker';
import { canEdit, canPublish, useSession } from '../../cms/services/auth';
import { publishGallery, publishPage, resolveMediaString, updateDraft, updatePage, useCmsState } from '../../cms/services/cmsStore';
import { IMAGE_TYPES, nameFromUrl, uploadFiles } from '../../cms/services/media';
import { SECTION_SCHEMAS } from '../../cms/schemas/sections';
import { f } from '../../cms/schemas/fields';
import type { GalleryItemDoc } from '../../cms/types';
import { uid } from '../../cms/utils';

const setItems = (updater: (items: GalleryItemDoc[]) => GalleryItemDoc[], target = 'Gallery') =>
  updateDraft((d) => ({ ...d, gallery: { ...d.gallery, items: updater(d.gallery.items) } }), target);

const FullscreenViewer: React.FC<{ items: GalleryItemDoc[]; index: number; onClose: () => void; onIndex: (i: number) => void }> = ({ items, index, onClose, onIndex }) => {
  const item = items[index];
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, items.length, onClose, onIndex]);
  if (!item) return null;
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`Preview of ${item.title}`} className="admin-root fixed inset-0 z-[85] bg-adm-deeper/95 flex flex-col p-3 sm:p-6" onClick={onClose}>
      <div className="flex items-center justify-between text-white mb-2">
        <span className="text-[13px]">{index + 1} of {items.length}</span>
        <button type="button" aria-label="Close preview" className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center" onClick={onClose}><X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 min-h-0 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Previous image" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0" onClick={() => onIndex((index - 1 + items.length) % items.length)}><ArrowLeft className="w-5 h-5" /></button>
        <img src={resolveMediaString(item.image)} alt={item.alt} className="flex-1 min-w-0 h-full object-contain" />
        <button type="button" aria-label="Next image" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0" onClick={() => onIndex((index + 1) % items.length)}><ArrowRight className="w-5 h-5" /></button>
      </div>
      <p className="text-center text-white text-[14px] mt-2">{item.title}</p>
    </div>,
    document.body
  );
};

export const GalleryEditor: React.FC = () => {
  const { draft, published } = useCmsState();
  const session = useSession();
  const editable = canEdit(session?.role);
  const { confirm, toast, run } = useFeedback();
  const { items, categories } = draft.gallery;
  const [tab, setTab] = useState('images');
  const [view, setView] = useState<'grid' | 'masonry'>('grid');
  const [category, setCategory] = useState('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewer, setViewer] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);

  const shown = useMemo(() => (category === 'ALL' ? items : items.filter((i) => i.category === category)), [items, category]);
  const editing = items.find((i) => i.id === editingId) ?? null;
  const gridSection = draft.pages.gallery.sections.find((s) => s.type === 'gallery-grid');
  const hasChanges = JSON.stringify(draft.gallery) !== JSON.stringify(published.gallery) || JSON.stringify(draft.pages.gallery) !== JSON.stringify(published.pages.gallery);

  const newItem = (image: string, title: string, width = 1, height = 1): GalleryItemDoc => ({
    id: uid('g'),
    title,
    category: category === 'ALL' ? categories[0]?.name ?? 'NATURE' : category,
    description: '',
    caption: '',
    image,
    alt: '',
    aspectRatio: width > height ? 'landscape' : width < height ? 'portrait' : 'square',
    location: '',
    featured: false,
    enabled: true,
  });

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    const { items: uploaded, errors } = await uploadFiles([...files], 'gallery');
    setBusy(false);
    errors.forEach((error) => toast(error, 'error'));
    if (uploaded.length) {
      const fresh = uploaded.map((media) => newItem(media.ref, media.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '), media.width, media.height));
      setItems((current) => [...fresh, ...current], `Added ${fresh.length} gallery image${fresh.length > 1 ? 's' : ''}`);
      toast(`${fresh.length} image${fresh.length > 1 ? 's' : ''} added. Add alt text before publishing.`);
    }
  };

  const patch = (id: string, change: Partial<GalleryItemDoc>) => setItems((current) => current.map((i) => (i.id === id ? { ...i, ...change } : i)), 'Gallery image');

  const moveItem = (id: string, targetId: string) => {
    if (id === targetId) return;
    setItems((current) => {
      const next = [...current];
      const from = next.findIndex((i) => i.id === id);
      const to = next.findIndex((i) => i.id === targetId);
      next.splice(to, 0, next.splice(from, 1)[0]);
      return next;
    }, 'Gallery order');
  };

  const step = (item: GalleryItemDoc, delta: number) => {
    const index = shown.findIndex((i) => i.id === item.id);
    const target = shown[index + delta];
    if (target) moveItem(item.id, target.id);
  };

  const remove = async (item: GalleryItemDoc) => {
    const ok = await confirm({ title: `Remove "${item.title}"?`, text: 'It leaves the gallery once published. The file stays in the Media Library.', confirmLabel: 'Remove', danger: true });
    if (ok) {
      setItems((current) => current.filter((i) => i.id !== item.id), `Removed ${item.title}`);
      setEditingId(null);
    }
  };

  const columns = view === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2.5' : 'columns-2 md:columns-3 2xl:columns-4 gap-2.5 [&>*]:mb-2.5 [&>*]:break-inside-avoid';

  return (
    <div>
      <PageHeader
        title="Gallery"
        subtitle="Upload, describe and arrange the images on the gallery page."
        actions={
          <PublishBar
            previewPath="/gallery"
            publishLabel="Publish gallery"
            hasChanges={hasChanges}
            onPublish={async () => {
              await publishGallery();
              await publishPage('gallery');
            }}
          />
        }
      />
      <Tabs active={tab} onChange={setTab} tabs={[{ id: 'images', label: 'Images', count: items.length }, { id: 'categories', label: 'Categories', count: categories.length }, { id: 'display', label: 'Display & filters' }]} />

      {tab === 'categories' && (
        <Card className="p-4 sm:p-5 max-w-3xl">
          <FormRenderer
            fields={[
              f.list('categories', 'Filter categories', 'category', (c) => c.name || 'Category', [f.text('name', 'Name'), f.area('description', 'Description'), f.toggle('enabled', 'Show as a filter')], {
                newItem: () => ({ id: uid('gcat'), name: 'NEW CATEGORY', description: '', enabled: true }),
              }),
            ]}
            value={{ categories }}
            onChange={(next) =>
              updateDraft((d) => {
                // Renaming a category keeps its images attached to it.
                const renamed = new Map<string, string>();
                d.gallery.categories.forEach((old) => {
                  const match = next.categories.find((c: any) => c.id === old.id);
                  if (match && match.name !== old.name) renamed.set(old.name, match.name);
                });
                return { ...d, gallery: { categories: next.categories, items: d.gallery.items.map((i) => (renamed.has(i.category) ? { ...i, category: renamed.get(i.category)! } : i)) } };
              }, 'Gallery categories')
            }
          />
        </Card>
      )}

      {tab === 'display' && gridSection && (
        <Card className="p-4 sm:p-5 max-w-3xl">
          <FormRenderer
            fields={SECTION_SCHEMAS['gallery-grid'].fields}
            value={gridSection.content}
            onChange={(content) => updatePage('gallery', (p) => ({ ...p, sections: p.sections.map((s) => (s.id === gridSection.id ? { ...s, content } : s)) }), 'Gallery display')}
          />
        </Card>
      )}

      {tab === 'images' && (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Select className="!w-44" aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="ALL">All categories</option>
              {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </Select>
            <div role="group" aria-label="Admin view" className="adm-tile !rounded-full flex gap-1 p-1">
              <IconBtn label="Grid view" tone={view === 'grid' ? 'active' : 'default'} onClick={() => setView('grid')}><LayoutGrid className="w-4 h-4" /></IconBtn>
              <IconBtn label="Masonry view" tone={view === 'masonry' ? 'active' : 'default'} onClick={() => setView('masonry')}><Rows3 className="w-4 h-4" /></IconBtn>
            </div>
            <div className="flex-1" />
            <Btn disabled={!editable} icon={<Link2 className="w-4 h-4" />} onClick={() => setLinking(true)}>Add by URL</Btn>
            <Btn variant="primary" busy={busy} disabled={!editable} icon={<Upload className="w-4 h-4" />} onClick={() => uploadRef.current?.click()}>Upload images</Btn>
            <input ref={uploadRef} data-testid="gallery-upload" type="file" hidden multiple accept={IMAGE_TYPES.join(',')} onChange={(e) => { void upload(e.target.files); e.target.value = ''; }} />
          </div>

          {shown.length === 0 ? (
            <Card><EmptyState icon={<Images className="w-5 h-5" />} title="No images here yet" text="Upload images or choose another category." /></Card>
          ) : (
            <ul className={columns}>
              {shown.map((item, index) => (
                <li
                  key={item.id}
                  data-testid={`gallery-item-${item.id}`}
                  draggable={editable}
                  onDragStart={(e) => {
                    setDragId(item.id);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragId) moveItem(dragId, item.id);
                    setDragId(null);
                  }}
                  onDragEnd={() => setDragId(null)}
                  className={`adm-tile group overflow-hidden transition-opacity ${dragId === item.id ? 'opacity-40' : ''} ${item.enabled ? '' : 'is-off'}`}
                >
                  <div className="relative">
                    <img
                      src={resolveMediaString(item.image)}
                      alt={item.alt}
                      draggable={false}
                      className={`w-full object-cover bg-adm-panel ${view === 'grid' ? 'aspect-[4/3]' : item.aspectRatio === 'portrait' ? 'aspect-[3/4]' : item.aspectRatio === 'square' ? 'aspect-square' : 'aspect-[4/3]'} ${item.enabled ? '' : 'opacity-50'}`}
                    />
                    <span className="absolute left-2 top-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-adm-mute cursor-grab" title="Drag to reorder" aria-hidden="true"><GripVertical className="w-4 h-4" /></span>
                    <div className="absolute right-2 top-2 flex gap-1">
                      {item.featured && <span className="w-7 h-7 rounded-full bg-adm-deep text-white flex items-center justify-center" title="Featured"><Star className="w-3.5 h-3.5" fill="currentColor" /></span>}
                    </div>
                    {!item.alt && <span className="absolute left-2 bottom-2"><Chip tone="amber">No alt text</Chip></span>}
                  </div>
                  <div className="p-2.5">
                    <p className="text-[13px] truncate">{item.title}</p>
                    <p className="text-[11.5px] text-adm-mute truncate">{item.category}{item.location ? ` · ${item.location}` : ''}</p>
                    <div className="flex items-center -mx-1 mt-1">
                      <IconBtn label={`Edit ${item.title}`} disabled={!editable} onClick={() => setEditingId(item.id)}><Pencil className="w-4 h-4" /></IconBtn>
                      <IconBtn label={`View ${item.title} full screen`} onClick={() => setViewer(index)}><Maximize2 className="w-4 h-4" /></IconBtn>
                      <IconBtn label={item.enabled ? `Hide ${item.title}` : `Show ${item.title}`} disabled={!editable} onClick={() => patch(item.id, { enabled: !item.enabled })}>{item.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</IconBtn>
                      <IconBtn label={`Move ${item.title} earlier`} className="md:hidden" disabled={!editable || index === 0} onClick={() => step(item, -1)}><ArrowLeft className="w-4 h-4" /></IconBtn>
                      <IconBtn label={`Move ${item.title} later`} className="md:hidden" disabled={!editable || index === shown.length - 1} onClick={() => step(item, 1)}><ArrowRight className="w-4 h-4" /></IconBtn>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {viewer !== null && <FullscreenViewer items={shown} index={viewer} onClose={() => setViewer(null)} onIndex={setViewer} />}

      <Modal open={linking} onClose={() => setLinking(false)} title="Add an image by URL">
        <ImageUrlForm
          label="the gallery image"
          submitLabel="Add image"
          help="The image stays on that site. If it is removed there, it disappears here too. Upload it to keep your own copy."
          onSubmit={(url, size) => {
            const item = newItem(url, nameFromUrl(url), size.width, size.height);
            setItems((current) => [item, ...current], `Added ${item.title}`);
            setLinking(false);
            toast('Image added. Add alt text before publishing.');
          }}
        />
      </Modal>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditingId(null)}
        title={editing?.title ?? 'Image'}
        size="lg"
        footer={
          <>
            <Btn variant="danger" icon={<Trash2 className="w-4 h-4" />} onClick={() => editing && remove(editing)}>Remove from gallery</Btn>
            <div className="flex-1" />
            <Btn variant="primary" onClick={() => setEditingId(null)}>Done</Btn>
          </>
        }
      >
        {editing && (
          <div className="space-y-3.5">
            <ImageInput label="Image" value={{ src: editing.image, alt: editing.alt, objectPosition: editing.objectPosition }} onChange={(v) => patch(editing.id, { image: v.src, alt: v.alt, objectPosition: v.objectPosition })} />
            <TextInput label="Title" value={editing.title} onChange={(title) => patch(editing.id, { title })} />
            <TextInput multiline label="Description" value={editing.description} onChange={(description) => patch(editing.id, { description })} />
            <TextInput label="Caption" value={editing.caption} onChange={(caption) => patch(editing.id, { caption })} help="Shown in the full-screen view." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <FieldShell label="Category">
                <Select className="adm-input" value={editing.category} onChange={(e) => patch(editing.id, { category: e.target.value })}>
                  {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </Select>
              </FieldShell>
              <TextInput label="Location" value={editing.location} onChange={(location) => patch(editing.id, { location })} />
              <FieldShell label="Shape in masonry layout">
                <Select className="adm-input" value={editing.aspectRatio} onChange={(e) => patch(editing.id, { aspectRatio: e.target.value as GalleryItemDoc['aspectRatio'] })}>
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                  <option value="square">Square</option>
                </Select>
              </FieldShell>
              <label className="flex items-center gap-2 text-[13px] pt-7 cursor-pointer">
                <input type="checkbox" className="accent-[#79864B] w-4 h-4" checked={editing.featured} onChange={(e) => patch(editing.id, { featured: e.target.checked })} />
                Featured image
              </label>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
