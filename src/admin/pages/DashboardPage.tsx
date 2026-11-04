import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ImageIcon, Inbox } from 'lucide-react';
import { Card, EmptyState, Skeleton } from '../components/ui';
import { ActivityBars, StatusDonut } from '../dashboard/DashboardCharts';
import { MediaThumb, useMediaLibrary } from '../media/MediaPicker';
import { useSession } from '../../cms/services/auth';
import { listActivity, subscribeActivity } from '../../cms/services/activity';
import { resolveThumb, useCmsState } from '../../cms/services/cmsStore';
import { computeMetrics } from '../../cms/services/insights';
import { listEnquiries, subscribeSubmissions } from '../../cms/services/submissions';
import type { ActivityRecord, EnquiryRecord, PageId } from '../../cms/types';
import { formatBytes, timeAgo } from '../../cms/utils';

const PAGE_THUMBS: Record<PageId, string> = {
  home: 'home-hero',
  about: 'about-banner',
  gallery: '',
  blog: '',
  contact: 'contact-main',
};

const ACTION_LABELS: Record<ActivityRecord['action'], string> = {
  edited: 'Edited',
  saved: 'Saved',
  published: 'Published',
  unpublished: 'Unpublished',
  restored: 'Restored',
  uploaded: 'Uploaded',
  deleted: 'Deleted',
  imported: 'Imported',
  reset: 'Reset',
};

const pillLink = 'text-[12px] px-3.5 py-1 rounded-full bg-white border border-adm-deep/15 hover:bg-adm-deep/[0.05] hover:border-adm-deep/30 transition-all duration-200 whitespace-nowrap shrink-0';

export const DashboardPage: React.FC = () => {
  const state = useCmsState();
  const { draft } = state;
  const session = useSession();
  const media = useMediaLibrary();
  const [activity, setActivity] = useState<ActivityRecord[] | null>(null);
  const [enquiries, setEnquiries] = useState<EnquiryRecord[] | null>(null);

  useEffect(() => {
    const load = () => listActivity().then(setActivity).catch(() => setActivity([]));
    void load();
    return subscribeActivity(() => void load());
  }, []);

  useEffect(() => {
    const load = () => listEnquiries().then(setEnquiries).catch(() => setEnquiries([]));
    void load();
    return subscribeSubmissions(() => void load());
  }, []);

  const metrics = useMemo(() => computeMetrics(draft), [draft]);
  const unread = enquiries?.filter((e) => !e.read).length ?? 0;

  const pages = Object.values(draft.pages);
  const thumbFor = (id: PageId, width: number) => {
    const page = draft.pages[id];
    const section = page.sections.find((s) => s.id === PAGE_THUMBS[id]);
    const src = section?.content?.image?.src ?? section?.content?.vignette?.image?.src;
    if (src) return resolveThumb(src, width);
    if (id === 'gallery') return resolveThumb(draft.gallery.items[0]?.image ?? '', width);
    return resolveThumb(draft.blog.posts[0]?.coverImage ?? '', width);
  };

  const uploads = media?.filter((m) => m.origin === 'upload') ?? [];
  const uploadBytes = uploads.reduce((sum, m) => sum + m.size, 0);
  const hiddenImages = draft.gallery.items.filter((i) => !i.enabled).length;
  const firstName = (session?.name ?? '').trim().split(' ')[0];

  return (
    <div>
      <div className="mb-8 sm:mb-10 pt-1">
        <h1 className="text-[36px] sm:text-[48px] leading-[1.05] text-adm-ink break-words">
          <span className="sr-only">Dashboard. </span>
          Welcome back{firstName ? `, ${firstName}` : ''}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3">
        <Link to="/admin/settings" aria-label={`Your account: ${session?.name}`} className="adm-lift group relative block min-h-[260px] rounded-[24px] overflow-hidden bg-adm-deep xl:col-span-3 border border-white/30 shadow-none">
          <img src={thumbFor('home', 1200)} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-t from-adm-deeper/85 via-adm-deeper/10 to-transparent" />
          <span className="absolute right-3 top-3 capitalize text-[12.5px] text-white px-3 py-1.5 rounded-full border border-white/50 bg-adm-deeper/70 backdrop-blur-md">{session?.role}</span>
          <span className="absolute left-4 right-4 bottom-4 text-white">
            <span className="adm-display block text-[22px] leading-tight break-words">{session?.name}</span>
            <span className="block text-[12px] text-white/85 truncate mt-0.5">{session?.email}</span>
          </span>
        </Link>

        <Card title="Editing activity" className="xl:col-span-3">
          <div className="p-5 pt-3">
            {activity === null ? <Skeleton className="h-44" /> : <ActivityBars activity={activity} />}
          </div>
        </Card>

        <Card title="Content status" className="xl:col-span-3">
          <div className="p-4 pt-3">
            <StatusDonut
              centerLabel="Live"
              segments={[
                { label: 'Live', value: metrics.publishedContent, color: '#5F6C36' },
                { label: 'Hidden', value: metrics.hiddenSections + hiddenImages, color: '#B09C55' },
                { label: 'Draft', value: metrics.draftArticles + metrics.scheduledArticles, color: '#28351F' },
              ]}
            />
          </div>
        </Card>

        {/* The two shapes above the card echo a stack: messages waiting for a reply. */}
        <div className="relative pt-3 xl:col-span-3 xl:row-span-2 flex flex-col">
          <span className="absolute left-6 right-6 top-0 h-6 rounded-t-[20px] bg-adm-deep/15" aria-hidden="true" />
          <span className="absolute left-3 right-3 top-1.5 h-6 rounded-t-[22px] bg-adm-deep/40" aria-hidden="true" />
          <section className="adm-swirl relative flex-1 rounded-[24px] p-5 text-white flex flex-col min-h-[320px]">
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <h2 className="text-[21px] leading-tight text-white">Enquiries</h2>
              <span className="adm-display text-[34px] leading-none text-white" data-testid="enquiry-count">{enquiries?.length ?? 0}</span>
            </div>
            <p className="text-[12px] text-white/75 mb-4">{unread ? `${unread} unread` : 'From the contact page'}</p>
            {enquiries === null ? (
              <p className="flex-1 text-[13px] text-white/75">Loading…</p>
            ) : enquiries.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-8">
                <span className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-knowza-dew"><Inbox className="w-5 h-5" /></span>
                <p className="text-[13px] text-white/85 max-w-[220px]">Messages sent through the contact form will appear here.</p>
              </div>
            ) : (
              <ul className="flex-1 min-h-0 space-y-1 -mx-1.5 overflow-y-auto adm-scroll xl:max-h-[420px]">
                {enquiries.map((enquiry) => (
                  <li key={enquiry.id} data-testid="dashboard-enquiry">
                    <Link to="/admin/contact" className="flex items-center gap-3 p-1.5 rounded-[14px] hover:bg-white/10 transition-colors">
                      <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[13px] text-knowza-dew uppercase shrink-0">{enquiry.name.trim().charAt(0)}</span>
                      <span className="flex-1 min-w-0">
                        <span className={`block text-[13px] truncate ${enquiry.read ? '' : 'font-bold'}`}>{enquiry.name}</span>
                        <span className="block text-[11.5px] text-white/75 truncate">{enquiry.purpose}, {timeAgo(enquiry.createdAt)}</span>
                      </span>
                      {!enquiry.read && <span className="w-2 h-2 rounded-full bg-knowza-dew shrink-0" aria-label="Unread" />}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/admin/contact" className="mt-4 flex items-center justify-center min-h-[38px] rounded-full bg-white text-adm-deep text-[13px] font-semibold hover:bg-adm-cream transition-all hover:scale-[1.01] active:scale-[0.98]">View all enquiries</Link>
          </section>
        </div>

        <Card title="Quick page access" action={<Link to="/admin/pages" className={pillLink}>All pages</Link>} className="xl:col-span-3">
          <ul className="p-3 pt-2 space-y-0.5">
            {pages.map((page) => (
              <li key={page.id}>
                <Link to={`/admin/pages/${page.id}`} className="flex items-center gap-3 p-1.5 rounded-[14px] hover:bg-adm-deep/[0.05] transition-colors">
                  <img src={thumbFor(page.id, 96)} alt="" className="w-10 h-10 rounded-full object-cover bg-adm-panel shrink-0" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13.5px] truncate">{page.title}</span>
                    <span className="block text-[11.5px] text-adm-mute truncate">{page.sections.length} sections</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-adm-mute shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Recent activity" className="xl:col-span-3">
          <div className="p-5 pt-3">
            {activity === null ? (
              <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-10" />)}</div>
            ) : activity.length === 0 ? (
              <EmptyState title="Nothing edited yet" text="Your edits and publishes will be listed here." />
            ) : (
              <ol className="relative space-y-3 before:absolute before:left-[3.5px] before:top-1.5 before:bottom-1.5 before:w-px before:bg-adm-deep/20">
                {activity.slice(0, 5).map((entry) => (
                  <li key={entry.id} className="relative pl-5">
                    <span className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-[#5F6C36]" aria-hidden="true" />
                    <span className="block text-[13px] leading-snug truncate">{entry.target.toLowerCase().startsWith(entry.action) ? entry.target : `${ACTION_LABELS[entry.action]} ${entry.target}`}</span>
                    <span className="block text-[11.5px] text-adm-mute truncate">{timeAgo(entry.createdAt)}, {entry.author}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </Card>

        <Card title="Media overview" action={<Link to="/admin/media" className={pillLink}>Library</Link>} className="xl:col-span-3">
          <div className="p-5 pt-3">
            <p className="flex items-center gap-1.5 text-[12px] text-adm-mute mb-3">
              <ImageIcon className="w-3.5 h-3.5 shrink-0" />
              {media ? `${media.filter((m) => m.kind === 'image').length} images, ${media.filter((m) => m.kind === 'video').length} videos, ${uploads.length} uploaded (${formatBytes(uploadBytes)})` : 'Loading…'}
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {media === null
                ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-square" />)
                : media.filter((m) => !m.ref.includes('/logo/') && !m.ref.includes('favicon') && !m.ref.includes('apple-touch')).slice(0, 6).map((item) => <MediaThumb key={item.id} item={item} className="w-full aspect-square rounded-[12px] block" />)}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
