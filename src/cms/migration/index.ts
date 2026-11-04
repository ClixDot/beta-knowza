import { CMS_SCHEMA_VERSION, type CMSDocument } from '../types';
import { seedAbout } from './seed/about';
import { seedGlobal } from './seed/global';
import { seedHome } from './seed/home';
import { seedBlog, seedBlogPage, seedContactPage, seedGallery, seedGalleryPage } from './seed/listing';

/** The original hardcoded website expressed as a CMS document. */
export const createSeedDocument = (): CMSDocument => ({
  schemaVersion: CMS_SCHEMA_VERSION,
  updatedAt: '2026-11-03T00:00:00.000Z',
  pages: {
    home: seedHome(),
    about: seedAbout(),
    gallery: seedGalleryPage(),
    blog: seedBlogPage(),
    contact: seedContactPage(),
  },
  global: seedGlobal(),
  gallery: seedGallery(),
  blog: seedBlog(),
});

type Migration = (doc: any) => any;

/** Add an entry when the schema changes: MIGRATIONS[n] upgrades version n to n + 1. */
const MIGRATIONS: Record<number, Migration> = {};

export function migrateDocument(doc: any): CMSDocument {
  let current = doc;
  let version = Number(current?.schemaVersion) || 0;
  if (version > CMS_SCHEMA_VERSION) throw new Error(`Content schema ${version} is newer than this build supports.`);
  while (version < CMS_SCHEMA_VERSION) {
    const step = MIGRATIONS[version];
    if (!step) throw new Error(`No migration available from schema version ${version}.`);
    current = step(current);
    version += 1;
    current.schemaVersion = version;
  }
  return current as CMSDocument;
}

/** Guards imports and stored data against structurally invalid documents. */
export function isValidDocument(doc: any): doc is CMSDocument {
  if (!doc || typeof doc !== 'object') return false;
  const pagesOk = ['home', 'about', 'gallery', 'blog', 'contact'].every((id) => Array.isArray(doc.pages?.[id]?.sections));
  return pagesOk && Boolean(doc.global?.header) && Array.isArray(doc.gallery?.items) && Array.isArray(doc.blog?.posts);
}
