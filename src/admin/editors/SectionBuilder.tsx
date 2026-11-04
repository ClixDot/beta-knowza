import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Reorder, useDragControls } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowUp, Copy, ExternalLink, Eye, EyeOff, GripVertical, Info, LayoutTemplate, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { FormRenderer, FieldShell, ImageInput, TextInput } from './FormRenderer';
import { Btn, Card, Chip, EmptyState, IconBtn, Modal, PageHeader, Select, useFeedback } from '../components/ui';
import { PublishBar } from '../components/PublishBar';
import { createSeedDocument } from '../../cms/migration';
import { SECTION_SCHEMAS, TEMPLATE_SCHEMAS } from '../../cms/schemas/sections';
import { canEdit, canPublish, useSession } from '../../cms/services/auth';
import { logActivity } from '../../cms/services/activity';
import { publishPage, setPageStatus, updateDraft, updatePage, useCmsState } from '../../cms/services/cmsStore';
import type { PageDoc, PageId, SectionBackground, SectionInstance } from '../../cms/types';
import { clone, uid } from '../../cms/utils';

const BACKGROUNDS: [SectionBackground, string][] = [
  ['default', 'Designed default'],
  ['canvas', 'Canvas'],
  ['white', 'Soft white'],
  ['cream', 'Cream'],
  ['sand', 'Sand'],
];

const SectionRow: React.FC<{
  section: SectionInstance;
  index: number;
  count: number;
  active: boolean;
  disabled: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onMove: (delta: number) => void;
}> = ({ section, index, count, active, disabled, onSelect, onToggle, onMove }) => {
  const controls = useDragControls();
  return (
    <Reorder.Item value={section} dragListener={false} dragControls={controls} layout="position" className={`adm-tile transition-colors ${active ? 'is-active' : ''}`}>
      <div className="flex items-center gap-0.5 pr-1">
        <button
          type="button"
          disabled={disabled}
          aria-label={`Drag ${section.label} to reorder`}
          title="Drag to reorder"
          className="w-8 h-11 flex items-center justify-center text-adm-mute cursor-grab active:cursor-grabbing touch-none shrink-0"
          onPointerDown={(e) => controls.start(e)}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <button type="button" data-testid={`section-${section.id}`} aria-current={active} onClick={onSelect} className="flex-1 min-w-0 min-h-[44px] text-left py-1.5">
          <span className={`block text-[13px] truncate ${section.enabled ? 'text-adm-ink' : 'text-adm-mute line-through'}`}>{section.label}</span>
          {SECTION_SCHEMAS[section.type]?.label !== section.label && (
            <span className="block text-[11px] text-adm-mute truncate">{SECTION_SCHEMAS[section.type]?.label ?? section.type}</span>
          )}
        </button>
        <span className="hidden xl:flex">
          <IconBtn label={`Move ${section.label} up`} disabled={disabled || index === 0} onClick={() => onMove(-1)}><ArrowUp className="w-3.5 h-3.5" /></IconBtn>
          <IconBtn label={`Move ${section.label} down`} disabled={disabled || index === count - 1} onClick={() => onMove(1)}><ArrowDown className="w-3.5 h-3.5" /></IconBtn>
        </span>
        <IconBtn label={section.enabled ? `Hide ${section.label}` : `Show ${section.label}`} disabled={disabled} onClick={onToggle}>
          {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </IconBtn>
      </div>
    </Reorder.Item>
  );
};

export const SectionBuilder: React.FC<{ pageId: PageId; embedded?: boolean }> = ({ pageId, embedded }) => {
  const { draft, published } = useCmsState();
  const session = useSession();
  const editable = canEdit(session?.role);
  const { confirm, run } = useFeedback();
  const page = draft.pages[pageId];
  const [params, setParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(params.get('section') ?? page.sections[0]?.id ?? null);
  const [adding, setAdding] = useState(false);
  const [editingSeo, setEditingSeo] = useState(false);
  const [mobileEditing, setMobileEditing] = useState(Boolean(params.get('section')));

  useEffect(() => {
    const fromUrl = params.get('section');
    if (fromUrl) {
      setSelectedId(fromUrl);
      setMobileEditing(true);
    }
  }, [params]);

  const section = page.sections.find((s) => s.id === selectedId) ?? null;
  const schema = section ? SECTION_SCHEMAS[section.type] : null;
  const hasChanges = JSON.stringify(page) !== JSON.stringify(published.pages[pageId]);

  const setSeo = (patch: Partial<PageDoc['seo']>) => updatePage(pageId, (p) => ({ ...p, seo: { ...p.seo, ...patch } }), `${page.title} SEO`);

  const setSections = (sections: SectionInstance[], target?: string) => updatePage(pageId, (p) => ({ ...p, sections }), target);

  const patchSection = (id: string, patch: Partial<SectionInstance>, target?: string) =>
    setSections(page.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)), target);

  const move = (index: number, delta: number) => {
    const next = [...page.sections];
    next.splice(index + delta, 0, next.splice(index, 1)[0]);
    setSections(next, `${page.title} section order`);
  };

  const duplicate = (target: SectionInstance) => {
    const copy: SectionInstance = { ...clone(target), id: uid('sec'), label: `${target.label} copy` };
    const index = page.sections.findIndex((s) => s.id === target.id);
    const next = [...page.sections];
    next.splice(index + 1, 0, copy);
    setSections(next, `${page.title}: duplicated ${target.label}`);
    setSelectedId(copy.id);
  };

  const remove = async (target: SectionInstance) => {
    const ok = await confirm({
      title: `Delete "${target.label}"?`,
      text: 'It disappears from this page once you publish. You can bring it back from Revisions or the section library.',
      confirmLabel: 'Delete section',
      danger: true,
    });
    if (!ok) return;
    const index = page.sections.findIndex((s) => s.id === target.id);
    const next = page.sections.filter((s) => s.id !== target.id);
    setSections(next, `${page.title}: deleted ${target.label}`);
    void logActivity('deleted', `${page.title} › ${target.label}`);
    setSelectedId(next[Math.max(0, index - 1)]?.id ?? null);
    setMobileEditing(false);
  };

  const addTemplate = (type: string) => {
    const template = SECTION_SCHEMAS[type];
    const instance: SectionInstance = { id: uid('sec'), type, label: template.label, enabled: true, content: template.defaults!() };
    // New sections go above the closing invitation so the page still ends on its CTA.
    const closing = page.sections.findIndex((s) => s.type === 'closing-cta');
    const at = closing >= 0 ? closing : page.sections.length;
    const next = [...page.sections];
    next.splice(at, 0, instance);
    setSections(next, `${page.title}: added ${template.label}`);
    setSelectedId(instance.id);
    setAdding(false);
    setMobileEditing(true);
  };

  const missingOriginals = useMemo(() => {
    const seed = createSeedDocument().pages[pageId].sections;
    return seed.filter((original) => !page.sections.some((s) => s.id === original.id));
  }, [page.sections, pageId]);

  const restoreOriginal = (original: SectionInstance) => {
    const next = [...page.sections];
    const closing = next.findIndex((s) => s.type === 'closing-cta');
    next.splice(closing >= 0 && original.type !== 'closing-cta' ? closing : next.length, 0, clone(original));
    setSections(next, `${page.title}: restored ${original.label}`);
    setSelectedId(original.id);
    setAdding(false);
  };

  const select = (id: string) => {
    setSelectedId(id);
    setMobileEditing(true);
    if (params.get('section')) {
      params.delete('section');
      setParams(params, { replace: true });
    }
  };

  const sharedCta = schema?.sharedKey === 'cta';

  const list = (
    <Card className={`p-3 ${mobileEditing ? 'hidden lg:block' : ''}`}>
      <div className="flex items-center justify-between gap-2 mb-2.5 px-1">
        <h4 className="adm-title">Sections <span className="text-adm-mute">{page.sections.length}</span></h4>
        <Btn size="sm" variant="primary" disabled={!editable} icon={<Plus className="w-4 h-4" />} onClick={() => setAdding(true)}>Add</Btn>
      </div>
      {page.sections.length === 0 ? (
        <EmptyState icon={<LayoutTemplate className="w-5 h-5" />} title="This page has no sections" text="Add a section to start building it." />
      ) : (
        <Reorder.Group axis="y" values={page.sections} onReorder={(next) => editable && setSections(next, `${page.title} section order`)} className="space-y-1.5">
          {page.sections.map((item, index) => (
            <SectionRow
              key={item.id}
              section={item}
              index={index}
              count={page.sections.length}
              active={item.id === selectedId}
              disabled={!editable}
              onSelect={() => select(item.id)}
              onToggle={() => patchSection(item.id, { enabled: !item.enabled }, `${page.title}: ${item.enabled ? 'hid' : 'showed'} ${item.label}`)}
              onMove={(delta) => move(index, delta)}
            />
          ))}
        </Reorder.Group>
      )}
    </Card>
  );

  const editor = (
    <Card className={`p-4 sm:p-5 min-w-0 ${mobileEditing ? '' : 'hidden lg:block'}`}>
      {!section || !schema ? (
        <EmptyState icon={<LayoutTemplate className="w-5 h-5" />} title="Choose a section" text="Pick a section from the list to edit its content." />
      ) : (
        <fieldset disabled={!editable} className="contents">
          <button type="button" className="lg:hidden inline-flex items-center gap-1.5 text-[13px] text-adm-mute mb-3 min-h-[36px]" onClick={() => setMobileEditing(false)}>
            <ArrowLeft className="w-4 h-4" /> All sections
          </button>
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <h3 className="text-[24px] leading-tight break-words">{section.label}</h3>
              <p className="text-[13px] text-adm-mute mt-0.5">{schema.description}</p>
            </div>
            <div className="flex items-center gap-1">
              <IconBtn label="Duplicate section" onClick={() => duplicate(section)}><Copy className="w-4 h-4" /></IconBtn>
              <IconBtn label="Delete section" tone="danger" onClick={() => remove(section)}><Trash2 className="w-4 h-4" /></IconBtn>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4 pb-4 border-b border-adm-line">
            <TextInput label="Section name in the admin" value={section.label} onChange={(label) => patchSection(section.id, { label })} />
            {schema.backgrounds !== false && (
              <FieldShell label="Background">
                <Select className="adm-input" value={section.background ?? 'default'} onChange={(e) => patchSection(section.id, { background: e.target.value as SectionBackground })}>
                  {BACKGROUNDS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </Select>
              </FieldShell>
            )}
          </div>

          {sharedCta && (
            <p className="flex items-start gap-2 text-[13px] text-adm-deep bg-adm-cream/80 rounded-[14px] px-3 py-2.5 mb-4">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              This invitation is shared by every page and article. Editing it here changes all of them. Publish it from Brand Settings.
            </p>
          )}

          <FormRenderer
            key={section.id}
            fields={schema.fields}
            value={sharedCta ? draft.global.cta : section.content}
            onChange={(content) =>
              sharedCta
                ? updateDraft((d) => ({ ...d, global: { ...d.global, cta: content } }), 'Closing invitation')
                : patchSection(section.id, { content }, `${page.title} › ${section.label}`)
            }
          />
        </fieldset>
      )}
    </Card>
  );

  return (
    <>
      <PageHeader
        title={embedded ? `${page.title} page content` : `${page.title} page`}
        subtitle={`${page.sections.filter((s) => s.enabled).length} visible sections`}
        back={
          embedded ? undefined : (
            <Link to="/admin/pages" className="inline-flex items-center gap-1 text-[13px] text-adm-mute hover:text-adm-ink mb-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Pages
            </Link>
          )
        }
        actions={
          <PublishBar
            previewPath={page.path}
            sectionId={section?.id}
            publishLabel={`Publish ${page.title}`}
            hasChanges={hasChanges}
            onPublish={() => publishPage(pageId)}
            extra={
              <>
                {page.status === 'unpublished' ? <Chip tone="red">Unpublished</Chip> : hasChanges ? <Chip tone="amber">Draft changes</Chip> : <Chip tone="green">Live</Chip>}
                <a href={page.path} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[13px] text-adm-mute hover:text-adm-ink min-h-[36px]">
                  View live <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <Btn size="sm" variant="ghost" onClick={() => setEditingSeo(true)}>Page SEO</Btn>
                {canPublish(session?.role) && (
                  <Btn
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      const next = page.status === 'published' ? 'unpublished' : 'published';
                      const ok = await confirm({
                        title: next === 'unpublished' ? `Unpublish ${page.title}?` : `Publish ${page.title}?`,
                        text: next === 'unpublished' ? `Visitors to ${page.path} will see the 404 page.` : `${page.path} becomes available to visitors again.`,
                        confirmLabel: next === 'unpublished' ? 'Unpublish' : 'Publish',
                        danger: next === 'unpublished',
                      });
                      if (ok) await run(() => setPageStatus(pageId, next), next === 'unpublished' ? 'Page unpublished.' : 'Page published.');
                    }}
                  >
                    {page.status === 'published' ? 'Unpublish' : 'Re-publish'}
                  </Btn>
                )}
              </>
            }
          />
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[370px_minmax(0,1fr)] gap-4 items-start">
        <div className="lg:sticky lg:top-0">{list}</div>
        {editor}
      </div>

      <Modal open={editingSeo} onClose={() => setEditingSeo(false)} title={`${page.title} page SEO`} footer={<Btn variant="primary" onClick={() => setEditingSeo(false)}>Done</Btn>}>
        <fieldset disabled={!editable} className="space-y-3.5">
          <TextInput label="SEO title" value={page.seo?.title ?? ''} onChange={(title) => setSeo({ title })} help={`${(page.seo?.title ?? '').length}/60 characters. Empty uses the site default.`} />
          <TextInput multiline label="SEO description" value={page.seo?.description ?? ''} onChange={(description) => setSeo({ description })} help={`${(page.seo?.description ?? '').length}/160 characters. Empty uses the site default.`} />
          <ImageInput noAlt label="Social sharing image" value={{ src: page.seo?.image ?? '', alt: '' }} onChange={(v) => setSeo({ image: v.src })} help="Empty uses the site default." />
        </fieldset>
      </Modal>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add a section" size="lg">
        <p className="text-[13px] text-adm-mute mb-3">Templates use the KNOWZA type, colours and spacing, so new sections always match the site.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TEMPLATE_SCHEMAS.map((template) => (
            <button key={template.type} type="button" data-testid={`template-${template.type}`} onClick={() => addTemplate(template.type)} className="adm-tile adm-lift text-left p-3.5">
              <span className="block text-[14px] font-semibold">{template.label}</span>
              <span className="block text-[12px] text-adm-mute mt-0.5">{template.description}</span>
            </button>
          ))}
          <button type="button" data-testid="template-tpl-contact" onClick={() => {
            const instance: SectionInstance = { ...clone(createSeedDocument().pages.contact.sections.find((s) => s.type === 'contact-main')!), id: uid('sec'), label: 'Contact Section' };
            const next = [...page.sections];
            const closing = next.findIndex((s) => s.type === 'closing-cta');
            next.splice(closing >= 0 ? closing : next.length, 0, instance);
            setSections(next, `${page.title}: added Contact Section`);
            setSelectedId(instance.id);
            setAdding(false);
          }} className="adm-tile adm-lift text-left p-3.5">
            <span className="block text-[14px] font-semibold">Contact Section</span>
            <span className="block text-[12px] text-adm-mute mt-0.5">Concierge card and working enquiry form.</span>
          </button>
        </div>
        {missingOriginals.length > 0 && (
          <div className="mt-5">
            <h4 className="text-[14px] mb-2">Restore an original section</h4>
            <div className="space-y-1.5">
              {missingOriginals.map((original) => (
                <button key={original.id} type="button" onClick={() => restoreOriginal(original)} className="adm-tile adm-lift w-full flex items-center gap-2 text-left p-3 text-[13px]">
                  <RotateCcw className="w-4 h-4 text-adm-mute" /> {original.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
