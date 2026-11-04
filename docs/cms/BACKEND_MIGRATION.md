# Backend: MongoDB and Cloudinary

The CMS runs on MongoDB and Cloudinary through the API in `server/handler.ts`. On Vercel it is served by `api/cms.ts`; in `npm run dev` and `vite preview`, the Vite server hosts the same handler.

**Security rule:** the database URI and Cloudinary secret stay on the server. Nothing with a `VITE_` prefix may hold a secret, because Vite ships those values to the browser.

## Deploying to Vercel

1. In Vercel, open **Settings › Environment Variables** and add:
   - `MONGODB_URI`
   - `MONGODB_DB` set to `knowza_cms`
   - `CLOUDINARY_URL`
2. In MongoDB Atlas, open **Network Access** and allow Vercel to connect. Vercel has no fixed IP addresses on most plans, so this usually means allowing `0.0.0.0/0`, with a strong database password.
3. Deploy, then check:
   - [ ] `/about` opens directly, without a 404
   - [ ] `/api/cms/documents/published` returns JSON
   - [ ] `/admin` shows the sign-in page and you can sign in
   - [ ] An image uploaded in the admin appears on the site on another device
   - [ ] A contact form message reaches **Contact Management**

## Accounts

Create or reset a user. A random password is printed once:

```bash
node scripts/create-admin.mjs someone@example.com "Their Name" editor
```

Roles are enforced by the server. Admin can edit and publish. Editor can edit drafts and read enquiries. Viewer can read content but not enquiries.

## Rotating credentials

1. Change the password in Atlas or regenerate the Cloudinary secret.
2. Update `.env.local` and the Vercel environment variables.
3. Redeploy.

## How it fits together

| Data | Where |
|---|---|
| Draft and published documents | MongoDB `documents` |
| Revisions | MongoDB `revisions` |
| Media details | MongoDB `media` |
| Uploaded files | Cloudinary, in the `knowza` folder |
| Enquiries, subscribers, activity | MongoDB `records` |
| Users and sessions | MongoDB `admin_users`, `sessions` |
| Login and form limits | MongoDB `rate_limits` |

- **Uploads** go directly from the browser to Cloudinary with a signature from the server, because Vercel functions limit request bodies to about 4.5 MB. The server only signs for signed-in editors and allowed formats.
- **Images bundled in `/public`** stay with the site. Only new uploads go to Cloudinary.
- **Content references** stay as `media:<id>`, so replacing a file updates every page that uses it.
- **Sessions** are random tokens stored hashed, in HTTP-only SameSite=Strict cookies, and last 7 days.

## Moving content from local mode

If content was edited in local mode (`VITE_CMS_BACKEND=local`), export it from **Admin Settings › Backup & storage**, then sign in to the live admin and restore that file. Uploads are sent to Cloudinary during the restore.

`node scripts/seed-cms.mjs` loads the original website content into an empty database. It never overwrites existing content.

## Known limits

- If two people edit the same draft at once, the last save wins.
- Enquiries appear in the admin but do not send a notification email.
- Spam protection is a rate limit of 10 public submissions per hour per IP address, with no CAPTCHA.
- Uploaded draft images have public Cloudinary URLs, even before publishing.
- File size limits for uploads are checked in the browser, not by Cloudinary. A Cloudinary upload preset can enforce them.
