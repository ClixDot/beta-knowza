import React, { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { ChevronDown, ChevronRight, Copy, Film, GripVertical, ImageIcon, Images, Link2, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { CmsIcon, ICON_NAMES, SOCIAL_ICON_NAMES, SocialIcon } from '../../components/cms/icons';
import { Btn, Chip, IconBtn, Modal, Select, Toggle, useFeedback } from '../components/ui';
import { ImageUrlForm, MediaPicker } from '../media/MediaPicker';
import type { Field } from '../../cms/schemas/fields';
import { canEdit, useSession } from '../../cms/services/auth';
import { resolveMediaString, resolveThumb, useCmsState } from '../../cms/services/cmsStore';
import { IMAGE_TYPES, uploadFiles } from '../../cms/services/media';
import type { ButtonValue, ImageValue, VideoValue } from '../../cms/types';
import { clone, isValidLink, makeButton, uid } from '../../cms/utils';

export const FieldShell: React.FC<{ label: string; help?: string; htmlFor?: string; error?: string; children: React.ReactNode }> = ({ label, help, htmlFor, error, children }) => {
  const generatedId = React.useId();
  // A lone select gets associated with the label automatically.
  const isSelect = React.isValidElement(children) && children.type === Select;
  const id = htmlFor ?? (isSelect ? generatedId : undefined);
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-[13px] text-adm-ink mb-1.5">{label}</label>
      {isSelect ? React.cloneElement(children as React.ReactElement<{ id?: string }>, { id }) : children}
      {error && <p role="alert" className="text-[12px] text-[#9F3424] mt-1">{error}</p>}
      {help && !error && <p className="text-[12px] text-adm-mute mt-1">{help}</p>}
    </div>
  );
};

const useFieldId = (label: string) => React.useId() + label.replace(/\W/g, '');

export const TextInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; help?: string; placeholder?: string; multiline?: boolean; type?: string; error?: string; rows?: number; autoComplete?: string }> = ({ label, value, onChange, help, placeholder, multiline, type = 'text', error, rows, autoComplete }) => {
  const id = useFieldId(label);
  const length = (value ?? '').length;
  return (
    <FieldShell label={label} help={help} htmlFor={id} error={error}>
      {multiline ? (
        <textarea id={id} className="adm-input resize-y" aria-invalid={Boolean(error)} rows={rows ?? Math.min(9, Math.max(3, Math.ceil(length / 70)))} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} type={type} autoComplete={autoComplete} className="adm-input" aria-invalid={Boolean(error)} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </FieldShell>
  );
};

export const UrlInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; help?: string }> = ({ label, value, onChange, help }) => (
  <TextInput
    label={label}
    value={value}
    onChange={onChange}
    help={help}
    placeholder="/about or https://…"
    error={value && !isValidLink(value) ? 'Use a path like /about, a full https:// address, mailto: or tel:' : undefined}
  />
);

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

export const ImageInput: React.FC<{ label: string; value: ImageValue; onChange: (v: ImageValue) => void; help?: string; noAlt?: boolean }> = ({ label, value, onChange, help, noAlt }) => {
  useCmsState();
  const session = useSession();
  const { toast } = useFeedback();
  const editable = canEdit(session?.role);
  const [picking, setPicking] = useState(false);
  const [linking, setLinking] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dropping, setDropping] = useState(false);
  const uploadRef = React.useRef<HTMLInputElement>(null);
  const image = value ?? { src: '', alt: '' };
  const src = resolveMediaString(image.src);
  const linked = /^https:\/\//i.test(image.src ?? '');

  const upload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    const { items, errors } = await uploadFiles([file]);
    setUploading(false);
    errors.forEach((error) => toast(error, 'error'));
    if (items[0]) {
      onChange({ ...image, src: items[0].ref });
      setLinking(false);
    }
  };

  const source = (active = false) =>
    `min-h-[36px] min-w-0 px-2 rounded-full inline-flex items-center justify-center gap-1.5 text-[13px] whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${active ? 'bg-adm-deep text-white' : 'text-adm-ink hover:bg-white'}`;

  return (
    <FieldShell label={label} help={help}>
      <div
        data-testid="image-field"
        className={`adm-tile adm-imagefield p-3 ${dropping ? 'is-dropping' : ''}`}
        onDragOver={(e) => {
          if (editable && e.dataTransfer.types.includes('Files')) {
            e.preventDefault();
            setDropping(true);
          }
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropping(false);
        }}
        onDrop={(e) => {
          if (!editable || !e.dataTransfer.types.includes('Files')) return;
          e.preventDefault();
          setDropping(false);
          void upload(e.dataTransfer.files);
        }}
      >
        <div className="adm-imagefield-body">
          <div className="adm-imagefield-preview">
            {image.src ? (
              <img src={resolveThumb(image.src, 640)} alt="" loading="lazy" className="w-full h-full" style={{ objectFit: image.objectFit || 'cover', objectPosition: image.objectPosition }} />
            ) : (
              <span className="flex flex-col items-center gap-1 text-center text-[12px] text-adm-mute px-2">
                <ImageIcon className="w-5 h-5" />
                {dropping ? 'Drop to upload' : 'Drop an image here'}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div role="group" aria-label={`${label} source`} className="adm-imagefield-sources">
              <button type="button" className={source()} disabled={uploading} onClick={() => uploadRef.current?.click()}>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload
              </button>
              <button type="button" className={source(linking)} aria-expanded={linking} onClick={() => setLinking(!linking)}>
                <Link2 className="w-4 h-4" /> URL
              </button>
              <button type="button" className={source()} onClick={() => setPicking(true)}>
                <Images className="w-4 h-4" /> Library
              </button>
            </div>
            <input ref={uploadRef} type="file" hidden data-testid="image-upload" accept={IMAGE_TYPES.join(',')} onChange={(e) => { void upload(e.target.files); e.target.value = ''; }} />
            {image.src && (
              <div className="flex flex-wrap items-center gap-1.5">
                <Btn size="sm" variant="ghost" onClick={() => onChange({ ...image, src: '' })}>Remove</Btn>
                {linked && <Chip>Linked from URL</Chip>}
              </div>
            )}
            {!noAlt && (
              <input className="adm-input" aria-label={`${label} alt text`} placeholder="Describe the image for screen readers" value={image.alt ?? ''} onChange={(e) => onChange({ ...image, alt: e.target.value })} />
            )}
          </div>
        </div>
        {linking && (
          <div className="mt-3 pt-3 border-t border-adm-line/70">
            <ImageUrlForm
              label={label}
              initial={linked ? image.src : ''}
              submitLabel="Use image"
              help="The image stays on that site. If it is removed there, it disappears here too. Upload it to keep your own copy."
              onCancel={() => setLinking(false)}
              onSubmit={(url) => {
                onChange({ ...image, src: url });
                setLinking(false);
              }}
            />
          </div>
        )}
      </div>
      <MediaPicker
        open={picking}
        kind="image"
        onClose={() => setPicking(false)}
        onPick={(item) => onChange({ ...image, src: item.ref, alt: image.alt || item.alt })}
      />
    </FieldShell>
  );
};

const ImageUrlInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; help?: string }> = ({ label, value, onChange, help }) => (
  <ImageInput label={label} help={help} noAlt value={{ src: value, alt: '' }} onChange={(next) => onChange(next.src)} />
);

const VideoInput: React.FC<{ label: string; value: VideoValue; onChange: (v: VideoValue) => void; help?: string }> = ({ label, value, onChange, help }) => {
  useCmsState();
  const [picking, setPicking] = useState(false);
  const video = value ?? { src: '', poster: '', autoplay: false, muted: false, loop: false, controls: true };
  return (
    <FieldShell label={label} help={help}>
      <div className="adm-tile p-3 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-40 aspect-video rounded-[12px] overflow-hidden bg-adm-deep flex items-center justify-center shrink-0">
            {video.src ? <video src={resolveMediaString(video.src)} poster={resolveMediaString(video.poster)} muted className="w-full h-full object-cover" /> : <Film className="w-6 h-6 text-white/70" />}
          </div>
          <div className="flex flex-wrap items-start gap-1.5">
            <Btn size="sm" onClick={() => setPicking(true)}>{video.src ? 'Replace video' : 'Choose video'}</Btn>
            {video.src && <Btn size="sm" variant="ghost" onClick={() => onChange({ ...video, src: '' })}>Remove</Btn>}
          </div>
        </div>
        <ImageUrlInput label="Poster image" value={video.poster} onChange={(poster) => onChange({ ...video, poster })} />
        <div className="grid grid-cols-2 gap-2">
          <Toggle label="Autoplay" checked={video.autoplay} onChange={(autoplay) => onChange({ ...video, autoplay, muted: autoplay ? true : video.muted })} />
          <Toggle label="Muted" checked={video.muted} onChange={(muted) => onChange({ ...video, muted })} />
          <Toggle label="Loop" checked={video.loop} onChange={(loop) => onChange({ ...video, loop })} />
          <Toggle label="Controls" checked={video.controls} onChange={(controls) => onChange({ ...video, controls })} />
        </div>
        {video.autoplay && <p className="text-[12px] text-adm-mute">Browsers only autoplay muted video, so autoplay also turns on mute.</p>}
      </div>
      <MediaPicker open={picking} kind="video" onClose={() => setPicking(false)} onPick={(item) => onChange({ ...video, src: item.ref })} />
    </FieldShell>
  );
};

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

const BUTTON_STYLES: [ButtonValue['style'], string][] = [
  ['white-fill', 'White fill'],
  ['white', 'White outline'],
  ['dark', 'Dark'],
  ['olive-fill', 'Olive fill'],
  ['olive', 'Olive outline'],
  ['primary', 'Primary'],
  ['secondary', 'Secondary'],
  ['plain', 'Designed default'],
];

const ButtonEditor: React.FC<{ value: ButtonValue; onChange: (v: ButtonValue) => void }> = ({ value, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <TextInput label="Label" value={value.label} onChange={(label) => onChange({ ...value, label })} />
    <UrlInput label="URL" value={value.url} onChange={(url) => onChange({ ...value, url })} />
    <FieldShell label="Style">
      <Select className="adm-input" value={value.style} onChange={(e) => onChange({ ...value, style: e.target.value as ButtonValue['style'] })}>
        {BUTTON_STYLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </Select>
    </FieldShell>
    <FieldShell label="Arrow">
      <Select className="adm-input" value={value.arrow} onChange={(e) => onChange({ ...value, arrow: e.target.value as ButtonValue['arrow'] })}>
        <option value="none">None</option>
        <option value="up-right">Up right</option>
        <option value="right">Right</option>
      </Select>
    </FieldShell>
  </div>
);

// ---------------------------------------------------------------------------
// Repeating lists
// ---------------------------------------------------------------------------

const withKeys = (items: any[]) => {
  let changed = false;
  const next = items.map((item) => {
    if (item && typeof item === 'object' && !item.id) {
      changed = true;
      return { ...item, id: uid('item') };
    }
    return item;
  });
  return changed ? next : items;
};

const ListRow: React.FC<{
  item: any;
  index: number;
  count: number;
  title: string;
  fixed?: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
  onMove: (delta: number) => void;
  children: React.ReactNode;
}> = ({ item, index, count, title, fixed, onDuplicate, onDelete, onMove, children }) => {
  const controls = useDragControls();
  const [open, setOpen] = useState(false);

  return (
    <Reorder.Item value={item} dragListener={false} dragControls={controls} className="adm-tile overflow-hidden" layout="position">
      <div className="flex items-center gap-1 pl-1 pr-1.5 py-1">
        <button
          type="button"
          aria-label={`Reorder ${title}. Use the arrow keys to move.`}
          title="Drag to reorder"
          className="w-8 h-9 flex items-center justify-center text-adm-mute cursor-grab active:cursor-grabbing touch-none rounded-full hover:bg-adm-deep/[0.05] shrink-0"
          onPointerDown={(e) => controls.start(e)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp' && index > 0) {
              e.preventDefault();
              onMove(-1);
            }
            if (e.key === 'ArrowDown' && index < count - 1) {
              e.preventDefault();
              onMove(1);
            }
          }}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex-1 min-w-0 min-h-[36px] flex items-center gap-2 text-left text-[13px] rounded-[10px] px-1.5 hover:bg-adm-deep/[0.05]">
          {open ? <ChevronDown className="w-4 h-4 shrink-0 text-adm-mute" /> : <ChevronRight className="w-4 h-4 shrink-0 text-adm-mute" />}
          <span className="truncate">{title}</span>
        </button>
        {!fixed && (
          <>
            <IconBtn label={`Duplicate ${title}`} onClick={onDuplicate}><Copy className="w-4 h-4" /></IconBtn>
            <IconBtn label={`Delete ${title}`} tone="danger" onClick={onDelete}><Trash2 className="w-4 h-4" /></IconBtn>
          </>
        )}
      </div>
      {open && <div className="p-3 border-t border-adm-line/70 bg-white">{children}</div>}
    </Reorder.Item>
  );
};

const ListField: React.FC<{ field: Extract<Field, { kind: 'list' }>; value: any[]; onChange: (v: any[]) => void }> = ({ field, value, onChange }) => {
  const { confirm } = useFeedback();
  const items = withKeys(value ?? []);

  return (
    <FieldShell label={field.label} help={field.help}>
      <Reorder.Group axis="y" values={items} onReorder={onChange} className="space-y-2">
        {items.map((item, index) => (
          <ListRow
            key={item.id}
            item={item}
            index={index}
            count={items.length}
            fixed={field.fixed}
            title={field.itemTitle(item, index)}
            onMove={(delta) => {
              const next = [...items];
              next.splice(index + delta, 0, next.splice(index, 1)[0]);
              onChange(next);
            }}
            onDuplicate={() => {
              const next = [...items];
              next.splice(index + 1, 0, { ...clone(item), id: uid('item') });
              onChange(next);
            }}
            onDelete={async () => {
              const ok = await confirm({ title: `Delete this ${field.itemLabel}?`, text: `"${field.itemTitle(item, index)}" will be removed from the draft.`, confirmLabel: 'Delete', danger: true });
              if (ok) onChange(items.filter((_, i) => i !== index));
            }}
          >
            <FormRenderer fields={field.fields} value={item} onChange={(next) => onChange(items.map((row, i) => (i === index ? next : row)))} />
          </ListRow>
        ))}
      </Reorder.Group>
      {!field.fixed && field.newItem && (
        <Btn size="sm" className="mt-2" icon={<Plus className="w-4 h-4" />} onClick={() => onChange([...items, field.newItem!()])}>
          Add {field.itemLabel}
        </Btn>
      )}
    </FieldShell>
  );
};

const ButtonsField: React.FC<{ field: Extract<Field, { kind: 'buttons' }>; value: ButtonValue[]; onChange: (v: ButtonValue[]) => void }> = ({ field, value, onChange }) => (
  <ListField
    field={{
      kind: 'list',
      key: field.key,
      label: field.label,
      help: field.help,
      itemLabel: 'button',
      itemTitle: (b) => `${b.label || 'Button'} → ${b.url || 'no link'}`,
      fields: [],
      newItem: () => makeButton('New button', '/contact', 'dark', 'right'),
    }}
    value={value}
    onChange={onChange}
  />
);

const GroupField: React.FC<{ field: Extract<Field, { kind: 'group' }>; value: any; onChange: (v: any) => void }> = ({ field, value, onChange }) => {
  const [open, setOpen] = useState(Boolean(field.open));
  return (
    <div className="adm-tile overflow-hidden">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="w-full min-h-[44px] flex items-center gap-2 px-3.5 text-left text-[14px] hover:bg-adm-deep/[0.05] transition-colors">
        {open ? <ChevronDown className="w-4 h-4 text-adm-mute" /> : <ChevronRight className="w-4 h-4 text-adm-mute" />}
        <span className="font-semibold">{field.label}</span>
      </button>
      {open && (
        <div className="p-3.5 pt-1">
          {field.help && <p className="text-[12px] text-adm-mute mb-3">{field.help}</p>}
          <FormRenderer fields={field.fields} value={value} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

const IconSelect: React.FC<{ label: string; value: string; onChange: (v: string) => void; names: string[]; social?: boolean; half?: boolean }> = ({ label, value, onChange, names, social }) => (
  <FieldShell label={label}>
    <div className="flex items-center gap-2">
      <span className="w-[42px] h-[42px] rounded-[14px] bg-white border border-adm-deep/10 flex items-center justify-center text-adm-deep shrink-0">
        {social ? <SocialIcon name={value} className="w-5 h-5" /> : <CmsIcon name={value} className="w-5 h-5" />}
      </span>
      <Select className="adm-input" aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
        {names.map((name) => <option key={name} value={name}>{name}</option>)}
      </Select>
    </div>
  </FieldShell>
);

const ColorInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; help?: string }> = ({ label, value, onChange, help }) => (
  <FieldShell label={label} help={help}>
    <div className="flex items-center gap-2">
      <input type="color" aria-label={`${label} picker`} value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#79864B'} onChange={(e) => onChange(e.target.value.toUpperCase())} className="w-[42px] h-[42px] rounded-[14px] border border-adm-deep/15 bg-white p-1 cursor-pointer shrink-0" />
      <input className="adm-input" aria-label={label} placeholder="Original" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      {value && <Btn size="sm" variant="ghost" onClick={() => onChange('')}>Reset</Btn>}
    </div>
  </FieldShell>
);

// ---------------------------------------------------------------------------
// Renderer
// ---------------------------------------------------------------------------

export const FormRenderer: React.FC<{ fields: Field[]; value: any; onChange: (next: any) => void }> = ({ fields, value, onChange }) => {
  const data = value ?? {};
  const setKey = (key: string, next: unknown) => onChange({ ...data, [key]: next });

  // A button item inside the generic list has no declared fields.
  if (fields.length === 0) return <ButtonEditor value={data} onChange={onChange} />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {fields.map((field, index) => {
        const wide = !('half' in field && field.half);
        const key = 'key' in field && field.key ? field.key : `group-${index}`;
        return (
          <div key={key} className={wide ? 'sm:col-span-2' : ''}>
            {(() => {
              switch (field.kind) {
                case 'text':
                  return <TextInput label={field.label} help={field.help} placeholder={field.placeholder} value={data[field.key]} onChange={(v) => setKey(field.key, v)} />;
                case 'textarea':
                  return <TextInput multiline label={field.label} help={field.help} placeholder={field.placeholder} value={data[field.key]} onChange={(v) => setKey(field.key, v)} />;
                case 'url':
                  return <UrlInput label={field.label} help={field.help} value={data[field.key]} onChange={(v) => setKey(field.key, v)} />;
                case 'color':
                  return <ColorInput label={field.label} help={field.help} value={data[field.key]} onChange={(v) => setKey(field.key, v)} />;
                case 'icon':
                  return <IconSelect label={field.label} names={ICON_NAMES} value={data[field.key]} onChange={(v) => setKey(field.key, v)} />;
                case 'socialIcon':
                  return <IconSelect social label={field.label} names={SOCIAL_ICON_NAMES} value={data[field.key]} onChange={(v) => setKey(field.key, v)} />;
                case 'number':
                  return (
                    <TextInput
                      type="number"
                      label={field.label}
                      help={field.help}
                      value={String(data[field.key] ?? 0)}
                      onChange={(v) => setKey(field.key, v === '' ? 0 : Number(v))}
                    />
                  );
                case 'toggle':
                  return <div className="pt-1"><Toggle label={field.label} checked={Boolean(data[field.key])} onChange={(v) => setKey(field.key, v)} /></div>;
                case 'select':
                  return (
                    <FieldShell label={field.label} help={field.help}>
                      <Select className="adm-input" aria-label={field.label} value={data[field.key] ?? ''} onChange={(e) => setKey(field.key, e.target.value)}>
                        {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </Select>
                    </FieldShell>
                  );
                case 'image':
                  return <ImageInput label={field.label} help={field.help} noAlt={field.noAlt} value={data[field.key]} onChange={(v) => setKey(field.key, v)} />;
                case 'imageUrl':
                  return <ImageUrlInput label={field.label} help={field.help} value={data[field.key]} onChange={(v) => setKey(field.key, v)} />;
                case 'video':
                  return <VideoInput label={field.label} help={field.help} value={data[field.key]} onChange={(v) => setKey(field.key, v)} />;
                case 'button':
                  return (
                    <FieldShell label={field.label}>
                      <ButtonEditor value={data[field.key]} onChange={(v) => setKey(field.key, v)} />
                    </FieldShell>
                  );
                case 'buttons':
                  return <ButtonsField field={field} value={data[field.key]} onChange={(v) => setKey(field.key, v)} />;
                case 'list':
                  return <ListField field={field} value={data[field.key]} onChange={(v) => setKey(field.key, v)} />;
                case 'group':
                  return field.key ? (
                    <GroupField field={field} value={data[field.key]} onChange={(v) => setKey(field.key!, v)} />
                  ) : (
                    <GroupField field={field} value={data} onChange={onChange} />
                  );
                default:
                  return null;
              }
            })()}
          </div>
        );
      })}
    </div>
  );
};
