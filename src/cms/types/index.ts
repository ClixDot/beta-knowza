// Shared CMS content model. Everything here is JSON-compatible so the same
// shapes can be stored in localStorage/IndexedDB today and MongoDB later.

export const CMS_SCHEMA_VERSION = 1;

export type PageId = 'home' | 'about' | 'gallery' | 'blog' | 'contact';
export type Stage = 'draft' | 'published';
export type ImageFit = 'cover' | 'contain';

export interface ImageValue {
  /** A public path (/images/x.jpg), an absolute URL or a media reference (media:<id>). */
  src: string;
  alt: string;
  objectPosition?: string;
  objectFit?: ImageFit;
  /** CSS aspect-ratio such as 16/9. Empty keeps the section's designed ratio. */
  ratio?: string;
  caption?: string;
}

export interface VideoValue {
  src: string;
  poster: string;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  controls: boolean;
}

export type ButtonStyle = 'white-fill' | 'white' | 'dark' | 'olive' | 'olive-fill' | 'primary' | 'secondary' | 'plain';
export type ButtonArrow = 'none' | 'up-right' | 'right';

export interface ButtonValue {
  id: string;
  label: string;
  url: string;
  style: ButtonStyle;
  arrow: ButtonArrow;
}

export type SectionBackground = 'default' | 'canvas' | 'white' | 'cream' | 'sand';

export interface SectionInstance<C = any> {
  id: string;
  type: string;
  label: string;
  enabled: boolean;
  background?: SectionBackground;
  content: C;
}

export interface SeoValue {
  title: string;
  description: string;
  image: string;
}

export interface PageDoc {
  id: PageId;
  title: string;
  path: string;
  status: 'published' | 'unpublished';
  seo: SeoValue;
  sections: SectionInstance[];
}

export interface NavItem {
  id: string;
  label: string;
  url: string;
  enabled: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  handle: string;
  url: string;
  icon: string;
  enabled: boolean;
}

export interface HeaderSettings {
  visible: boolean;
  logoLight: string;
  logoDark: string;
  logoAlt: string;
  /** Pixel height override. 0 keeps the responsive design default. */
  logoHeight: number;
  /** How many items sit left of the centred logo on desktop. */
  leftCount: number;
  nav: NavItem[];
  ctaVisible: boolean;
  ctaLabel: string;
  ctaUrl: string;
  mobileCtaLabel: string;
  mobileCtaUrl: string;
  mobileShowNumbers: boolean;
  mobileFooterLeft: string;
  mobileFooterRight: string;
}

export interface FooterSettings {
  logo: string;
  logoAlt: string;
  description: string;
  tagline: string;
  navHeading: string;
  links: NavItem[];
  connectHeading: string;
  connectText: string;
  contactEmail: string;
  copyright: string;
  creditLabel: string;
  creditName: string;
  creditUrl: string;
  bottomLeft: string;
  bottomRight: string;
  background: string;
  newsletterEnabled: boolean;
  newsletterHeading: string;
  newsletterText: string;
  newsletterButton: string;
  newsletterPlaceholder: string;
  newsletterSuccess: string;
}

export interface TypographySettings {
  headingFont: string;
  bodyFont: string;
  h1Size: string;
  h2Size: string;
  h3Size: string;
  paragraphSize: string;
  lineHeight: string;
  headingWeight: string;
  bodyWeight: string;
  letterSpacing: string;
}

export interface DesignSettings {
  olive: string;
  bronze: string;
  deep: string;
  dew: string;
  canvas: string;
  surface: string;
  text: string;
  buttonRadius: string;
  cardRadius: string;
  imageBrightness: string;
}

export interface BrandSettings {
  brandName: string;
  tagline: string;
  territory: string;
  defaultSeo: SeoValue;
}

export interface ContactDetails {
  email: string;
  generalEnquiries: string;
  phone: string;
  address: string;
  locationContext: string;
  officeSchedule: string;
}

export interface SystemPages {
  notFound: Record<string, string>;
  blogDetail: Record<string, string>;
}

export interface GlobalSettings {
  brand: BrandSettings;
  header: HeaderSettings;
  footer: FooterSettings;
  socials: SocialLink[];
  contact: ContactDetails;
  typography: TypographySettings;
  design: DesignSettings;
  /** Shared closing CTA ("An Invitation") used across all pages. */
  cta: any;
  system: SystemPages;
}

export interface GalleryCategoryDoc {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface GalleryItemDoc {
  id: string;
  title: string;
  category: string;
  description: string;
  caption: string;
  image: string;
  alt: string;
  objectPosition?: string;
  aspectRatio: 'portrait' | 'landscape' | 'square';
  location: string;
  featured: boolean;
  enabled: boolean;
}

export type ArticleBlock =
  | { id: string; type: 'paragraph'; text: string }
  | { id: string; type: 'heading'; text: string; level: 2 | 3 }
  | { id: string; type: 'image'; src: string; alt: string; caption: string }
  | { id: string; type: 'quote'; text: string; author: string };

export type PostStatus = 'draft' | 'published' | 'scheduled';

export interface BlogPostDoc {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  coverImage: string;
  coverAlt: string;
  excerpt: string;
  introduction: string;
  body: ArticleBlock[];
  relatedSlugs: string[];
  status: PostStatus;
  publishAt: string;
  featured: boolean;
  seo: SeoValue;
}

export interface BlogCategoryDoc {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface CMSDocument {
  schemaVersion: number;
  updatedAt: string;
  pages: Record<PageId, PageDoc>;
  global: GlobalSettings;
  gallery: { categories: GalleryCategoryDoc[]; items: GalleryItemDoc[] };
  blog: { categories: BlogCategoryDoc[]; posts: BlogPostDoc[] };
}

export interface RevisionRecord {
  id: string;
  createdAt: string;
  label: string;
  stage: Stage;
  author: string;
  document: CMSDocument;
}

export interface MediaItem {
  id: string;
  /** media:<id> for uploads, the public path for bundled assets. */
  ref: string;
  origin: 'upload' | 'bundled';
  name: string;
  kind: 'image' | 'video' | 'other';
  mime: string;
  size: number;
  width?: number;
  height?: number;
  alt: string;
  caption: string;
  category: string;
  createdAt: string;
  hidden?: boolean;
}

export type RecordKind = 'enquiry' | 'subscriber' | 'activity';

export interface EnquiryRecord {
  id: string;
  kind: 'enquiry';
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  purpose: string;
  message: string;
  read: boolean;
}

export interface SubscriberRecord {
  id: string;
  kind: 'subscriber';
  createdAt: string;
  email: string;
}

export interface ActivityRecord {
  id: string;
  kind: 'activity';
  createdAt: string;
  action: 'edited' | 'saved' | 'published' | 'unpublished' | 'restored' | 'uploaded' | 'deleted' | 'imported' | 'reset';
  target: string;
  author: string;
}

export type CmsRecord = EnquiryRecord | SubscriberRecord | ActivityRecord;
