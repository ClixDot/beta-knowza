import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { bootCms, resolveDocument, useCmsState } from '../services/cmsStore';
import type { BlogPostDoc, CMSDocument, Stage } from '../types';

const PREVIEW_PARAM = 'cmsPreview';
const SECTION_PARAM = 'cmsSection';

const readParam = (key: string) =>
  typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get(key);

/** The public site always reads published content unless opened through the admin preview. */
export const previewStage = (): Stage => (readParam(PREVIEW_PARAM) === 'draft' ? 'draft' : 'published');
export const previewSectionId = () => readParam(SECTION_PARAM);

const StageContext = createContext<Stage>('published');

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stage = useMemo(previewStage, []);
  useEffect(() => {
    void bootCms();
  }, []);
  return <StageContext.Provider value={stage}>{children}</StageContext.Provider>;
};

export function useSiteContent(): CMSDocument {
  const stage = useContext(StageContext);
  const state = useCmsState();
  return resolveDocument(stage === 'draft' ? state.draft : state.published);
}

export const isPostLive = (post: BlogPostDoc, now = Date.now()) =>
  post.status === 'published' ||
  (post.status === 'scheduled' && Boolean(post.publishAt) && new Date(post.publishAt).getTime() <= now);

export function useLivePosts(): BlogPostDoc[] {
  const doc = useSiteContent();
  return useMemo(() => doc.blog.posts.filter((post) => isPostLive(post)), [doc]);
}

/** Drafts open only through the admin preview; visitors can only reach live articles. */
export function useArticle(slug: string | undefined): BlogPostDoc | undefined {
  const stage = useContext(StageContext);
  const doc = useSiteContent();
  const live = useLivePosts();
  return (stage === 'draft' ? doc.blog.posts : live).find((post) => post.slug === slug);
}

export function useGlobal() {
  return useSiteContent().global;
}
