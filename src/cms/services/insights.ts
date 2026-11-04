import { isPostLive } from '../hooks/useSiteContent';
import { SECTION_SCHEMAS } from '../schemas/sections';
import type { Field } from '../schemas/fields';
import type { CMSDocument, PageId } from '../types';
import { collectStrings, isValidLink } from '../utils';
import { resolveMediaString } from './cmsStore';

export interface SiteMetrics {
  pages: number;
  sections: number;
  publishedContent: number;
  draftContent: number;
  galleryImages: number;
  articles: number;
  hiddenSections: number;
  liveArticles: number;
  draftArticles: number;
  scheduledArticles: number;
}

/** Every number on the dashboard is counted from the actual content document. */
export function computeMetrics(doc: CMSDocument): SiteMetrics {
  const pages = Object.values(doc.pages);
  const sections = pages.flatMap((page) => page.sections);
  const hiddenSections = sections.filter((section) => !section.enabled).length;
  const liveArticles = doc.blog.posts.filter((post) => isPostLive(post)).length;
  const scheduledArticles = doc.blog.posts.filter((post) => post.status === 'scheduled' && !isPostLive(post)).length;
  const draftArticles = doc.blog.posts.filter((post) => post.status === 'draft').length;
  const hiddenImages = doc.gallery.items.filter((item) => !item.enabled).length;
  return {
    pages: pages.length,
    sections: sections.length,
    publishedContent: sections.length - hiddenSections + liveArticles + (doc.gallery.items.length - hiddenImages),
    draftContent: hiddenSections + draftArticles + scheduledArticles + hiddenImages,
    galleryImages: doc.gallery.items.length,
    articles: doc.blog.posts.length,
    hiddenSections,
    liveArticles,
    draftArticles,
    scheduledArticles,
  };
}

export type HealthSeverity = 'error' | 'warning';

export interface HealthIssue {
  severity: HealthSeverity;
  message: string;
  location: string;
  link: string;
}

const IMAGE_KEY = /(^|\.)(image|coverImage|src|poster|logo|logoLight|logoDark|texture|portrait|imageLeft|imageRight)$/;
const isImagePath = (text: string) => /^(\/|media:|https?:).*\.(jpe?g|png|webp|gif|avif|svg)$/i.test(text) || text.startsWith('media:');

const loadImage = (src: string) =>
  new Promise<boolean>((resolve) => {
    const image = new Image();
    const timer = window.setTimeout(() => resolve(false), 10000);
    image.onload = () => {
      window.clearTimeout(timer);
      resolve(true);
    };
    image.onerror = () => {
      window.clearTimeout(timer);
      resolve(false);
    };
    image.src = src;
  });

/** Walks a schema alongside its value and reports missing alt text and bad links. */
function walkFields(fields: Field[], value: any, visit: (issue: Omit<HealthIssue, 'location' | 'link'>) => void) {
  if (!value) return;
  fields.forEach((field) => {
    if (field.kind === 'group') {
      walkFields(field.fields, field.key ? value[field.key] : value, visit);
    } else if (field.kind === 'list') {
      (value[field.key] ?? []).forEach((item: any) => walkFields(field.fields, item, visit));
    } else if (field.kind === 'image') {
      const image = value[field.key];
      if (image?.src && !image.alt && !field.noAlt) visit({ severity: 'warning', message: `${field.label} has no alt text` });
    } else if (field.kind === 'url') {
      const url = value[field.key];
      if (url && !isValidLink(url)) visit({ severity: 'error', message: `${field.label} is not a valid link: ${url}` });
    } else if (field.kind === 'buttons') {
      (value[field.key] ?? []).forEach((button: any) => {
        if (!isValidLink(button.url)) visit({ severity: 'error', message: `Button "${button.label}" has an invalid link` });
      });
    } else if (field.kind === 'button') {
      const button = value[field.key];
      if (button && !isValidLink(button.url)) visit({ severity: 'error', message: `Button "${button.label}" has an invalid link` });
    }
  });
}

export function contentIssues(doc: CMSDocument): HealthIssue[] {
  const issues: HealthIssue[] = [];
  (Object.keys(doc.pages) as PageId[]).forEach((pageId) => {
    const page = doc.pages[pageId];
    page.sections.forEach((section) => {
      const schema = SECTION_SCHEMAS[section.type];
      if (!schema || schema.sharedKey) return;
      walkFields(schema.fields, section.content, (issue) =>
        issues.push({ ...issue, location: `${page.title} › ${section.label}`, link: `/admin/pages/${pageId}?section=${section.id}` })
      );
    });
  });
  doc.gallery.items.forEach((item) => {
    if (!item.alt) issues.push({ severity: 'warning', message: 'Image has no alt text', location: `Gallery › ${item.title}`, link: '/admin/gallery' });
  });
  doc.blog.posts.forEach((post) => {
    if (!post.coverAlt) issues.push({ severity: 'warning', message: 'Cover image has no alt text', location: `Blog › ${post.title}`, link: `/admin/blog/${post.id}` });
    if (!post.excerpt) issues.push({ severity: 'warning', message: 'Article has no excerpt', location: `Blog › ${post.title}`, link: `/admin/blog/${post.id}` });
  });
  doc.global.socials.forEach((social) => {
    if (social.enabled && !isValidLink(social.url)) {
      issues.push({ severity: 'error', message: `${social.label} is enabled without a valid URL`, location: 'Social Media', link: '/admin/social' });
    }
  });
  return issues;
}

export function imageReferences(doc: CMSDocument): string[] {
  const refs = new Set<string>();
  collectStrings(doc, (text, keyPath) => {
    if (!text) return;
    if (isImagePath(text) || (IMAGE_KEY.test(keyPath[keyPath.length - 1] ?? '') && text.startsWith('/'))) refs.add(text);
  });
  return [...refs];
}

export async function findBrokenImages(doc: CMSDocument): Promise<string[]> {
  const refs = imageReferences(doc);
  const results = await Promise.all(refs.map(async (ref) => ({ ref, ok: await loadImage(resolveMediaString(ref)) })));
  return results.filter((result) => !result.ok).map((result) => result.ref);
}

export interface SearchHit {
  group: string;
  title: string;
  detail: string;
  link: string;
}

const snippet = (text: string, needle: string) => {
  const at = text.toLowerCase().indexOf(needle);
  return text.slice(Math.max(0, at - 24), at + needle.length + 40);
};

/** Searches real content, so an admin can find any sentence on the site. */
export function searchContent(doc: CMSDocument, query: string): SearchHit[] {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return [];
  const hits: SearchHit[] = [];
  const firstMatch = (value: unknown) => {
    let found = '';
    collectStrings(value, (text) => {
      if (!found && !text.startsWith('/') && !text.startsWith('media:') && text.toLowerCase().includes(needle)) found = text;
    });
    return found;
  };

  (Object.keys(doc.pages) as PageId[]).forEach((pageId) => {
    const page = doc.pages[pageId];
    if (page.title.toLowerCase().includes(needle)) hits.push({ group: 'Pages', title: page.title, detail: page.path, link: `/admin/pages/${pageId}` });
    page.sections.forEach((section) => {
      const match = section.label.toLowerCase().includes(needle) ? section.label : firstMatch(section.content);
      if (match) hits.push({ group: page.title, title: section.label, detail: snippet(match, needle), link: `/admin/pages/${pageId}?section=${section.id}` });
    });
  });
  doc.blog.posts.forEach((post) => {
    const match = firstMatch(post);
    if (match) hits.push({ group: 'Articles', title: post.title, detail: snippet(match, needle), link: `/admin/blog/${post.id}` });
  });
  doc.gallery.items.forEach((item) => {
    const match = firstMatch(item);
    if (match) hits.push({ group: 'Gallery', title: item.title, detail: snippet(match, needle), link: '/admin/gallery' });
  });
  const globalMatch = firstMatch(doc.global);
  if (globalMatch) hits.push({ group: 'Global settings', title: 'Brand settings', detail: snippet(globalMatch, needle), link: '/admin/brand' });
  return hits.slice(0, 30);
}
