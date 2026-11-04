# KNOWZA CMS: how it works

The public site and the admin share one content document. Pages no longer hold text; they render sections from that document.

## Data flow

```
src/cms/migration/seed/*      original website content, as data
        │  first load, or when nothing is stored
        ▼
draft document ──Publish──▶ published document ──▶ public site
        ▲                                            ▲
   admin editors                    ?cmsPreview=draft reads the draft instead
```

- **Draft** edits autosave after 0.7 seconds. **Save draft** also records a revision.
- **Publish** copies the draft, or one scope of it (a page, an article, the gallery, global settings), to the published document.
- The public site reads the published document only. Previews load the real site in an iframe with `?cmsPreview=draft`.

## Folders

| Path | Purpose |
|---|---|
| `src/cms/types` | The JSON content model |
| `src/cms/schemas` | Field declarations for every section and setting. Editors are generated from these |
| `src/cms/adapters` | `CMSStorageAdapter`, `LocalCMSStorageAdapter`, `MongoCMSStorageAdapter` |
| `src/cms/services` | Store and publishing, media, backup, submissions, activity, insights, auth |
| `src/cms/hooks` | `useSiteContent` and related hooks for public components |
| `src/cms/migration` | Seed content, schema migrations, asset inventory |
| `src/sections` | Public section components and `PageRenderer` |
| `src/admin` | The admin interface, loaded as a separate bundle |
| `server`, `api` | The CMS API and its Vercel entry point |

## Storage modes

The default is the real backend: MongoDB and Cloudinary through `/api/cms`. See [the backend guide](BACKEND_MIGRATION.md).

Setting `VITE_CMS_BACKEND=local` runs everything in one browser instead, with no password. Only the adapter touches storage, so the rest of the CMS is the same in both modes.

Content refers to uploads as `media:<id>`, and the store swaps those for displayable URLs before components render them.

## Common changes

**Edit an existing section's fields:** change its entry in `src/cms/schemas/sections.ts` and the component in `src/sections`. Add the default value to the seed. If stored documents need the new field, add a step to `MIGRATIONS` in `src/cms/migration/index.ts` and raise `CMS_SCHEMA_VERSION`.

**Add a section template:** add a component to `src/sections/TemplateSections.tsx`, register its type in `PageRenderer.tsx`, and add a schema with `defaults` to the `templates` array.

**Bundled images added to `/public`:** run `node scripts/build-asset-manifest.mjs` so they appear in the Media Library.

## Global design settings

Empty typography and design settings output no CSS at all, so the original stylesheet stays in charge until an admin opts in. Colour overrides target the site's existing colour classes.

## Tests

Both tests drive the admin in a real browser and check the results on the public site.

```bash
npm i --no-save playwright pngjs
npx playwright install chromium

# Local mode
VITE_CMS_BACKEND=local npm run build
npx vite preview --port 4802 &
node tests/cms-e2e.mjs http://localhost:4802 test-output

# Backend mode. Use a separate database and folder so real content is untouched.
export MONGODB_DB=knowza_cms_test CLOUDINARY_FOLDER=knowza-test
node scripts/create-admin.mjs qa-admin@example.com "QA Admin" admin
node scripts/create-admin.mjs qa-editor@example.com "QA Editor" editor
npm run build
npx vite preview --port 4802 &
QA_EMAIL=qa-admin@example.com QA_PASSWORD=... QA_EDITOR_PASSWORD=... node tests/cms-remote-e2e.mjs http://localhost:4802
```

The backend test expects an empty test database and asserts against the `mg4ku51f` Cloudinary account.
