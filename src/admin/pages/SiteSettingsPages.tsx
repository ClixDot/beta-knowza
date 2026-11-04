import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowLeft, ArrowRight, Copy, Download, GripVertical, Inbox, Mail, Plus, Trash2 } from 'lucide-react';
import { SocialIcon } from '../../components/cms/icons';
import { Btn, Card, Chip, EmptyState, IconBtn, Modal, PageHeader, Skeleton, Tabs, useFeedback } from '../components/ui';
import { FormRenderer, TextInput } from '../editors/FormRenderer';
import { SectionBuilder } from '../editors/SectionBuilder';
import { PublishBar } from '../components/PublishBar';
import { f } from '../../cms/schemas/fields';
import {
  BRAND_FIELDS,
  CONTACT_DETAIL_FIELDS,
  FOOTER_FIELDS,
  HEADER_FIELDS,
} from '../../cms/schemas/sections';
import { canEdit, changePassword, useSession } from '../../cms/services/auth';
import { adapter, getCmsState, publishAll, publishGlobal, updateDraft, useCmsState } from '../../cms/services/cmsStore';
import { deleteSubmission, listEnquiries, listSubscribers, setEnquiryRead, subscribeSubmissions } from '../../cms/services/submissions';
import type { EnquiryRecord, GlobalSettings, SocialLink, SubscriberRecord } from '../../cms/types';
import { clone, timeAgo, uid } from '../../cms/utils';

const setGlobal = (key: keyof GlobalSettings, value: unknown, target: string) =>
  updateDraft((d) => ({ ...d, global: { ...d.global, [key]: value } }), target);

const useGlobalChanged = () => {
  const { draft, published } = useCmsState();
  return JSON.stringify(draft.global) !== JSON.stringify(published.global);
};

// ---------------------------------------------------------------------------
// Brand settings
// ---------------------------------------------------------------------------

export const GlobalSettingsPage: React.FC = () => {
  const { draft } = useCmsState();
  const changed = useGlobalChanged();
  const session = useSession();
  const [tab, setTab] = useState('brand');
  const g = draft.global;

  return (
    <div>
      <PageHeader
        title="Brand Settings"
        subtitle="Site-wide content and design that appears on every page."
        actions={<PublishBar previewPath="/" publishLabel="Publish settings" hasChanges={changed} onPublish={publishGlobal} />}
      />
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: 'brand', label: 'Brand' },
          { id: 'header', label: 'Header' },
          { id: 'footer', label: 'Footer' },
        ]}
      />
      <fieldset disabled={!canEdit(session?.role)} className="contents">
        <Card className="p-4 sm:p-5 max-w-4xl">
          {tab === 'brand' && <FormRenderer fields={BRAND_FIELDS} value={g.brand} onChange={(v) => setGlobal('brand', v, 'Brand identity')} />}
          {tab === 'header' && <FormRenderer fields={HEADER_FIELDS} value={g.header} onChange={(v) => setGlobal('header', v, 'Header')} />}
          {tab === 'footer' && <FormRenderer fields={FOOTER_FIELDS} value={g.footer} onChange={(v) => setGlobal('footer', v, 'Footer')} />}
        </Card>
      </fieldset>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Social media
// ---------------------------------------------------------------------------

const SOCIAL_FIELDS = [
  f.toggle('enabled', 'Show on the website'),
  f.text('label', 'Label', { half: true }),
  f.text('handle', 'Handle', { half: true, placeholder: '@knowzagroup' }),
  f.url('url', 'URL'),
  f.socialIcon('icon', 'Icon'),
];

/** Each platform's own brand colour. The website and custom links use KNOWZA's. */
const SOCIAL_COLORS: Record<string, string> = {
  instagram: 'linear-gradient(45deg, #F09433, #E6683C 30%, #DC2743 55%, #CC2366 78%, #BC1888)',
  facebook: '#1877F2',
  youtube: '#FF0000',
  pinterest: '#E60023',
  linkedin: '#0A66C2',
  tiktok: '#000000',
};

const socialTitle = (link: SocialLink) => `${link.label || 'Link'}${link.enabled ? '' : ' (off)'}`;

/** One icon card per platform. Each opens its own editor, so the grid never shifts while editing. */
const SocialCards: React.FC<{ socials: SocialLink[]; editable: boolean; onChange: (next: SocialLink[]) => void }> = ({ socials, editable, onChange }) => {
  const { confirm } = useFeedback();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const editing = socials.find((s) => s.id === editingId) ?? null;

  const move = (index: number, target: number) => {
    if (target < 0 || target >= socials.length) return;
    const next = [...socials];
    next.splice(target, 0, next.splice(index, 1)[0]);
    onChange(next);
  };

  const add = () => {
    const link: SocialLink = { id: uid('social'), platform: 'custom', label: 'New link', handle: '', url: '', icon: 'link', enabled: false };
    onChange([...socials, link]);
    setEditingId(link.id);
  };

  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {socials.map((link, index) => (
          <li
            key={link.id}
            draggable={editable}
            onDragStart={(e) => {
              setDragId(link.id);
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (dragId) move(socials.findIndex((s) => s.id === dragId), index);
              setDragId(null);
            }}
            onDragEnd={() => setDragId(null)}
            className={`adm-tile flex flex-col overflow-hidden transition-opacity ${dragId === link.id ? 'opacity-40' : ''}`}
          >
            <button type="button" aria-label={socialTitle(link)} onClick={() => setEditingId(link.id)} className="flex-1 min-w-0 text-left p-4 hover:bg-adm-deep/[0.05] transition-colors">
              <span className="flex items-start justify-between gap-2">
                <span className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-white" style={{ background: SOCIAL_COLORS[link.icon] ?? '#28351F' }}>
                  <SocialIcon name={link.icon} className="w-5 h-5" />
                </span>
                <Chip tone={link.enabled ? 'green' : 'neutral'}>{link.enabled ? 'On' : 'Off'}</Chip>
              </span>
              <span className="adm-display block text-[19px] leading-tight mt-3 truncate">{link.label || 'Link'}</span>
              <span className="block text-[12px] text-adm-mute mt-0.5 truncate">{link.handle || 'No handle yet'}</span>
            </button>
            <div className="flex items-center gap-0.5 px-1.5 py-1 border-t border-adm-line/70">
              <button
                type="button"
                aria-label={`Reorder ${link.label}. Use the arrow keys to move.`}
                title="Drag to reorder"
                className="w-8 h-9 flex items-center justify-center text-adm-mute cursor-grab active:cursor-grabbing rounded-full hover:bg-adm-deep/[0.05] shrink-0"
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    move(index, index - 1);
                  }
                  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    move(index, index + 1);
                  }
                }}
              >
                <GripVertical className="w-4 h-4" />
              </button>
              <IconBtn label={`Move ${link.label} earlier`} className="md:hidden" disabled={index === 0} onClick={() => move(index, index - 1)}><ArrowLeft className="w-4 h-4" /></IconBtn>
              <IconBtn label={`Move ${link.label} later`} className="md:hidden" disabled={index === socials.length - 1} onClick={() => move(index, index + 1)}><ArrowRight className="w-4 h-4" /></IconBtn>
              <div className="flex-1" />
              <IconBtn
                label={`Duplicate ${socialTitle(link)}`}
                onClick={() => {
                  const next = [...socials];
                  next.splice(index + 1, 0, { ...clone(link), id: uid('social') });
                  onChange(next);
                }}
              >
                <Copy className="w-4 h-4" />
              </IconBtn>
              <IconBtn
                label={`Delete ${socialTitle(link)}`}
                tone="danger"
                onClick={async () => {
                  const ok = await confirm({ title: 'Delete this link?', text: `"${socialTitle(link)}" will be removed from the draft.`, confirmLabel: 'Delete', danger: true });
                  if (ok) onChange(socials.filter((s) => s.id !== link.id));
                }}
              >
                <Trash2 className="w-4 h-4" />
              </IconBtn>
            </div>
          </li>
        ))}
        <li>
          <button type="button" onClick={add} className="adm-tile is-off w-full h-full min-h-[120px] flex flex-col items-center justify-center gap-2 p-4 text-[13px] hover:bg-adm-deep/[0.05] transition-colors">
            <span className="w-11 h-11 rounded-full bg-adm-deep/10 text-adm-deep flex items-center justify-center"><Plus className="w-5 h-5" /></span>
            Add link
          </button>
        </li>
      </ul>
      <Modal open={Boolean(editing)} onClose={() => setEditingId(null)} title={editing?.label || 'Link'} footer={<Btn variant="primary" onClick={() => setEditingId(null)}>Done</Btn>}>
        {editing && (
          <FormRenderer
            fields={SOCIAL_FIELDS}
            value={editing}
            onChange={(next) => onChange(socials.map((s) => (s.id === editing.id ? next : s)))}
          />
        )}
      </Modal>
    </>
  );
};

export const SocialMediaEditor: React.FC = () => {
  const { draft } = useCmsState();
  const changed = useGlobalChanged();
  const session = useSession();
  return (
    <div>
      <PageHeader
        title="Social Media"
        subtitle="Enabled platforms with a URL appear in the website footer. The Instagram URL also powers the contact page preview."
        actions={<PublishBar previewPath="/contact" publishLabel="Publish social links" hasChanges={changed} onPublish={publishGlobal} />}
      />
      <fieldset disabled={!canEdit(session?.role)} className="contents">
        <Card className="p-4 sm:p-5">
          <h4 className="adm-title mb-3">Platforms <span className="text-adm-mute">{draft.global.socials.length}</span></h4>
          <SocialCards socials={draft.global.socials} editable={canEdit(session?.role)} onChange={(next) => setGlobal('socials', next, 'Social links')} />
        </Card>
      </fieldset>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Contact management
// ---------------------------------------------------------------------------

const csvEscape = (value: string) => `"${value.replace(/"/g, '""')}"`;

const downloadBlob = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
};

export const ContactEditor: React.FC = () => {
  const { draft } = useCmsState();
  const changed = useGlobalChanged();
  const session = useSession();
  const { confirm, run } = useFeedback();
  const [tab, setTab] = useState('enquiries');
  const [enquiries, setEnquiries] = useState<EnquiryRecord[] | null>(null);
  const [subscribers, setSubscribers] = useState<SubscriberRecord[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      listEnquiries().then(setEnquiries).catch(() => setEnquiries([]));
      listSubscribers().then(setSubscribers).catch(() => setSubscribers([]));
    };
    load();
    return subscribeSubmissions(load);
  }, []);

  const unread = enquiries?.filter((e) => !e.read).length ?? 0;

  const exportEnquiries = () => {
    const rows = [['Received', 'Name', 'Email', 'Phone', 'Purpose', 'Message'], ...(enquiries ?? []).map((e) => [e.createdAt, e.name, e.email, e.phone, e.purpose, e.message])];
    downloadBlob(new Blob([rows.map((row) => row.map(csvEscape).join(',')).join('\n')], { type: 'text/csv' }), 'knowza-enquiries.csv');
  };

  return (
    <div>
      <PageHeader title="Contact Management" subtitle="Enquiries received through the website, your contact details and the contact page." />
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: 'enquiries', label: 'Enquiries', count: unread || undefined },
          { id: 'subscribers', label: 'Subscribers', count: subscribers?.length },
          { id: 'details', label: 'Contact details' },
          { id: 'page', label: 'Contact page' },
        ]}
      />

      {tab === 'enquiries' && (
        <>
          {adapter.kind === 'local' && (
            <p className="flex items-start gap-2 text-[13px] text-adm-deep bg-adm-cream/80 rounded-[14px] px-3 py-2.5 mb-3 max-w-3xl">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              In local storage mode, enquiries stay in the browser that submitted them.
            </p>
          )}
          <Card>
            {enquiries === null ? (
              <div className="p-4 space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-12" />)}</div>
            ) : enquiries.length === 0 ? (
              <EmptyState icon={<Inbox className="w-5 h-5" />} title="No enquiries yet" text="Messages sent through the contact form will appear here." />
            ) : (
              <>
                <div className="flex justify-end p-3 pb-0"><Btn size="sm" icon={<Download className="w-4 h-4" />} onClick={exportEnquiries}>Export CSV</Btn></div>
                <ul className="divide-y divide-adm-line">
                  {enquiries.map((enquiry) => (
                    <li key={enquiry.id} data-testid="enquiry-row">
                      <div className="flex items-center gap-2 px-3 py-2">
                        <button
                          type="button"
                          aria-expanded={openId === enquiry.id}
                          onClick={() => {
                            setOpenId(openId === enquiry.id ? null : enquiry.id);
                            if (!enquiry.read && canEdit(session?.role)) void setEnquiryRead(enquiry, true);
                          }}
                          className="flex-1 min-w-0 min-h-[44px] text-left"
                        >
                          <span className="flex items-center gap-2">
                            {!enquiry.read && <span className="w-2 h-2 rounded-full bg-adm-olive shrink-0" aria-label="Unread" />}
                            <span className={`text-[14px] truncate ${enquiry.read ? '' : 'font-bold'}`}>{enquiry.name}</span>
                            <Chip>{enquiry.purpose}</Chip>
                          </span>
                          <span className="block text-[12px] text-adm-mute truncate">{enquiry.email} · {timeAgo(enquiry.createdAt)}</span>
                        </button>
                        <IconBtn
                          label={`Delete enquiry from ${enquiry.name}`}
                          tone="danger"
                          disabled={!canEdit(session?.role)}
                          onClick={async () => {
                            const ok = await confirm({ title: 'Delete this enquiry?', text: 'It cannot be recovered.', confirmLabel: 'Delete', danger: true });
                            if (ok) await run(() => deleteSubmission(enquiry.id), 'Enquiry deleted.');
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </IconBtn>
                      </div>
                      {openId === enquiry.id && (
                        <div className="px-4 pb-4 text-[13.5px] space-y-2">
                          <p className="whitespace-pre-wrap">{enquiry.message}</p>
                          <p className="text-adm-mute text-[12.5px]">{new Date(enquiry.createdAt).toLocaleString()}{enquiry.phone ? ` · ${enquiry.phone}` : ''}</p>
                          <a href={`mailto:${enquiry.email}`} className="inline-flex items-center gap-1.5 text-adm-deep underline underline-offset-2"><Mail className="w-3.5 h-3.5" /> Reply by email</a>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>
        </>
      )}

      {tab === 'subscribers' && (
        <Card>
          {!subscribers?.length ? (
            <EmptyState icon={<Mail className="w-5 h-5" />} title="No subscribers yet" text="Emails from the newsletter form will appear here." />
          ) : (
            <ul className="divide-y divide-adm-line">
              {subscribers.map((subscriber) => (
                <li key={subscriber.id} className="flex items-center gap-3 px-4 py-2">
                  <span className="flex-1 min-w-0 text-[14px] truncate">{subscriber.email}</span>
                  <span className="text-[12px] text-adm-mute">{timeAgo(subscriber.createdAt)}</span>
                  <IconBtn
                    label={`Remove ${subscriber.email}`}
                    tone="danger"
                    disabled={!canEdit(session?.role)}
                    onClick={async () => {
                      const ok = await confirm({ title: 'Remove this subscriber?', text: `${subscriber.email} cannot be recovered.`, confirmLabel: 'Remove', danger: true });
                      if (ok) await run(() => deleteSubmission(subscriber.id), 'Removed.');
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </IconBtn>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {tab === 'details' && (
        <div className="max-w-3xl">
          <div className="flex justify-end mb-3">
            <PublishBar previewPath="/contact" publishLabel="Publish details" hasChanges={changed} onPublish={publishGlobal} />
          </div>
          <fieldset disabled={!canEdit(session?.role)} className="contents">
            <Card className="p-4 sm:p-5">
              <FormRenderer fields={CONTACT_DETAIL_FIELDS} value={draft.global.contact} onChange={(v) => setGlobal('contact', v, 'Contact details')} />
            </Card>
          </fieldset>
        </div>
      )}

      {tab === 'page' && <SectionBuilder pageId="contact" embedded />}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Admin settings
// ---------------------------------------------------------------------------

const PasswordForm: React.FC = () => {
  const { run } = useFeedback();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  return (
    <form
      className="mt-4 pt-4 border-t border-adm-line space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (await run(() => changePassword(current, next), 'Password changed. Other devices were signed out.')) {
          setCurrent('');
          setNext('');
        }
      }}
    >
      <h4 className="adm-title">Change password</h4>
      <TextInput type="password" label="Current password" value={current} onChange={setCurrent} />
      <TextInput type="password" label="New password" value={next} onChange={setNext} help="At least 12 characters." />
      <Btn type="submit" disabled={!current || next.length < 12}>Change password</Btn>
    </form>
  );
};

export const AdminSettings: React.FC = () => {
  const session = useSession();

  return (
    <div>
      <PageHeader title="Admin Settings" subtitle="Your account and security settings." />

      <div className="max-w-2xl">
        <Card className="p-5">
          <h4 className="adm-title mb-3">Current session</h4>
          <dl className="grid grid-cols-2 gap-y-1 text-[13px]">
            <dt className="text-adm-mute">Name</dt><dd>{session?.name}</dd>
            <dt className="text-adm-mute">Email</dt><dd className="break-all">{session?.email}</dd>
            <dt className="text-adm-mute">Role</dt><dd className="capitalize">{session?.role}</dd>
          </dl>
          {session?.mode === 'server' && <PasswordForm />}
        </Card>
      </div>
    </div>
  );
};

