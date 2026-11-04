import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Eye, EyeOff, Pencil, Search } from 'lucide-react';
import { Card, Chip, EmptyState, IconBtn, PageHeader } from '../components/ui';
import { SECTION_SCHEMAS } from '../../cms/schemas/sections';
import { canEdit, useSession } from '../../cms/services/auth';
import { updatePage, useCmsState } from '../../cms/services/cmsStore';
import type { PageId } from '../../cms/types';

export const PagesManagement: React.FC = () => {
  const { draft, published } = useCmsState();
  return (
    <div>
      <PageHeader title="Page Management" subtitle="Every page on the website. Open one to edit its sections." />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
        {(Object.keys(draft.pages) as PageId[]).map((id) => {
          const page = draft.pages[id];
          const changed = JSON.stringify(page) !== JSON.stringify(published.pages[id]);
          return (
            <Link key={id} to={`/admin/pages/${id}`} data-testid={`page-card-${id}`} className="adm-glass adm-lift group p-5 sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[26px] leading-tight">{page.title}</h3>
                {page.status === 'unpublished' ? <Chip tone="red">Unpublished</Chip> : changed ? <Chip tone="amber">Draft changes</Chip> : <Chip tone="green">Live</Chip>}
              </div>
              <p className="text-[13px] mt-5">
                {page.sections.filter((s) => s.enabled).length} visible of {page.sections.length} sections
              </p>
              <span className="block h-1.5 rounded-full bg-adm-deep/10 overflow-hidden mt-2" aria-hidden="true">
                <span className="block h-full rounded-full bg-[#5F6C36]" style={{ width: `${page.sections.length ? (page.sections.filter((s) => s.enabled).length / page.sections.length) * 100 : 0}%` }} />
              </span>
              <span className="flex items-center gap-1 text-[13px] text-adm-deep mt-4">
                Edit page <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const SectionsOverview: React.FC = () => {
  const { draft } = useCmsState();
  const session = useSession();
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (Object.keys(draft.pages) as PageId[]).flatMap((id) =>
      draft.pages[id].sections
        .filter((s) => !needle || s.label.toLowerCase().includes(needle) || draft.pages[id].title.toLowerCase().includes(needle))
        .map((section) => ({ pageId: id, pageTitle: draft.pages[id].title, section }))
    );
  }, [draft, query]);

  return (
    <div>
      <PageHeader title="Website Sections" subtitle="All sections across the site in one list." />
      <div className="relative mb-3 max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3.5 text-adm-mute" />
        <input className="adm-input pl-9" placeholder="Filter by section or page" aria-label="Filter sections" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <Card>
        {rows.length === 0 ? (
          <EmptyState title="No sections match" text="Try a different word." />
        ) : (
          <ul className="divide-y divide-adm-line">
            {rows.map(({ pageId, pageTitle, section }) => (
              <li key={section.id} className="flex items-center gap-3 px-4 sm:px-5 py-2.5 first:rounded-t-[24px] last:rounded-b-[24px] hover:bg-adm-deep/[0.05] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] truncate ${section.enabled ? '' : 'text-adm-mute line-through'}`}>{section.label}</p>
                  <p className="text-[12px] text-adm-mute truncate">{pageTitle} · {SECTION_SCHEMAS[section.type]?.label ?? section.type}</p>
                </div>
                <IconBtn
                  label={section.enabled ? `Hide ${section.label}` : `Show ${section.label}`}
                  disabled={!canEdit(session?.role)}
                  onClick={() => updatePage(pageId, (p) => ({ ...p, sections: p.sections.map((s) => (s.id === section.id ? { ...s, enabled: !s.enabled } : s)) }), `${pageTitle}: ${section.label}`)}
                >
                  {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </IconBtn>
                <Link to={`/admin/pages/${pageId}?section=${section.id}`} aria-label={`Edit ${section.label}`} title="Edit" className="inline-flex items-center justify-center w-9 h-9 rounded-full text-adm-mute hover:text-adm-ink hover:bg-adm-deep/[0.05]">
                  <Pencil className="w-4 h-4" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};
