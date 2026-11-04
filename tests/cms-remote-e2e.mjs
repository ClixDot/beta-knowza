// End-to-end test against real MongoDB (test database) and Cloudinary (test folder).
// usage: QA_EMAIL=.. QA_PASSWORD=.. QA_EDITOR_PASSWORD=.. node remote-e2e.mjs <baseUrl>
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const [base] = process.argv.slice(2);
const { QA_EMAIL, QA_PASSWORD, QA_EDITOR_PASSWORD } = process.env;
const results = [];
const check = (name, ok, note = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${note ? ' — ' + note : ''}`);
};
const tmp = 'remote-files';
fs.mkdirSync(tmp, { recursive: true });
const png = (w, h, rgb) => {
  const p = new PNG({ width: w, height: h });
  for (let i = 0; i < w * h; i++) p.data.set([...rgb, 255], i * 4);
  return PNG.sync.write(p);
};
const redPath = path.join(tmp, 'qa-red.png');
const greenPath = path.join(tmp, 'qa-green.png');
fs.writeFileSync(redPath, png(40, 30, [200, 30, 30]));
fs.writeFileSync(greenPath, png(50, 50, [30, 200, 30]));

const browser = await chromium.launch();
const adminCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await adminCtx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

// A separate context stands in for another visitor or device: no shared cookies or storage.
const visitor = async (url) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push('visitor: ' + e.message));
  await p.goto(base + url);
  await p.waitForTimeout(2500);
  return p;
};
const api = (p, method, url, body, headers = { 'X-Knowza-CMS': '1' }) =>
  p.evaluate(async ([m, u, b, h]) => {
    const r = await fetch('/api/cms' + u, { method: m, headers: { 'Content-Type': 'application/json', ...h }, body: b ? JSON.stringify(b) : undefined });
    return r.status;
  }, [method, url, body, headers]);
const saved = () => page.waitForFunction(() => document.querySelector('[data-testid=save-status]')?.textContent === 'Draft saved', null, { timeout: 15000 });
const confirmDialog = async (label) => {
  await page.getByRole('dialog').getByRole('button', { name: label, exact: true }).click();
};
const publish = async (label) => {
  await page.getByRole('button', { name: label, exact: true }).first().click();
  await confirmDialog('Publish');
  await page.getByText('Published to the website.').first().waitFor({ timeout: 15000 });
};

// ---- Anonymous access
let v = await visitor('/');
check('Public site renders from the API with no content stored yet', (await v.getByRole('heading', { name: /WHERE NATURE/ }).count()) === 1);
check('Anonymous draft read is refused', (await api(v, 'GET', '/documents/draft')) === 401);
check('Anonymous publish is refused', (await api(v, 'PUT', '/documents/published', { pages: {} })) === 401);
check('Anonymous enquiry list is refused', (await api(v, 'GET', '/records?kind=enquiry')) === 401);
check('Anonymous upload signature is refused', (await api(v, 'POST', '/media/sign', { id: 'x', kind: 'image' })) === 401);
check('Anonymous media delete is refused', (await api(v, 'DELETE', '/media/x')) === 401);
check('Write without the CSRF header is refused', (await api(v, 'PUT', '/records', { kind: 'subscriber', email: 'a@b.co' }, {})) === 403);
await v.close();

// ---- Login
await page.goto(base + '/admin');
await page.getByRole('heading', { name: 'Sign in to the admin' }).waitFor();
check('No development sign-in on the backend', (await page.getByText('Local storage mode').count()) === 0);
await page.getByLabel('Email').fill(QA_EMAIL);
await page.getByLabel('Password', { exact: true }).fill('wrong-password-123');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByText('That email or password is not correct.').waitFor();
check('Wrong password is refused', true);
await page.getByLabel('Password', { exact: true }).fill(QA_PASSWORD);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('heading', { name: 'Dashboard' }).waitFor({ timeout: 15000 });
const cookie = (await adminCtx.cookies()).find((c) => c.name === 'knowza_cms_session');
check('Session cookie is HttpOnly and SameSite Strict', cookie?.httpOnly === true && cookie?.sameSite === 'Strict');
check('Session cookie is not readable by scripts', !(await page.evaluate(() => document.cookie)).includes('knowza_cms_session'));
await page.reload();
await page.getByRole('heading', { name: 'Dashboard' }).waitFor({ timeout: 15000 });
check('Session survives a refresh', true);

// ---- Draft and publish across devices
await page.goto(base + '/admin/pages/home');
await page.getByTestId('section-home-hero').click();
await page.getByLabel('Eyebrow', { exact: true }).fill('REMOTE QA EYEBROW');
// Keep typing while the save is in flight: nothing may be lost.
await page.waitForTimeout(800);
await page.getByLabel('Eyebrow', { exact: true }).fill('REMOTE QA EYEBROW FINAL');
await saved();
await page.waitForTimeout(1500);
check('Typing during a network save loses nothing', (await page.getByLabel('Eyebrow', { exact: true }).inputValue()) === 'REMOTE QA EYEBROW FINAL');
v = await visitor('/');
check('Draft is not visible to another device', (await v.getByText('REMOTE QA EYEBROW').count()) === 0);
await v.close();

// ---- Cloudinary upload
await page.getByRole('button', { name: 'Library', exact: true }).first().click();
await page.getByTestId('picker-upload').setInputFiles(redPath);
await page.getByRole('heading', { name: 'Choose an image' }).waitFor({ state: 'hidden', timeout: 30000 });
await page.getByLabel('Background image alt text').fill('Remote QA hero');
await saved();
await publish('Publish Home');
v = await visitor('/');
check('Published text reaches another device', (await v.getByText('REMOTE QA EYEBROW FINAL').count()) > 0);
const heroSrc = await v.locator('img[alt="Remote QA hero"]').getAttribute('src');
check('Uploaded image is served from Cloudinary to another device', /^https:\/\/res\.cloudinary\.com\/mg4ku51f\//.test(heroSrc), heroSrc);
check('The Cloudinary image loads', await v.locator('img[alt="Remote QA hero"]').evaluate((i) => i.naturalWidth === 40));
await v.close();

// ---- Video upload via Cloudinary, using a clip recorded in the browser
const webm = await page.evaluate(async () => {
  const canvas = Object.assign(document.createElement('canvas'), { width: 64, height: 48 });
  const c = canvas.getContext('2d');
  const recorder = new MediaRecorder(canvas.captureStream(10), { mimeType: 'video/webm' });
  const chunks = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);
  const done = new Promise((r) => (recorder.onstop = r));
  recorder.start();
  for (let i = 0; i < 12; i++) {
    c.fillStyle = i % 2 ? '#79864B' : '#28351F';
    c.fillRect(0, 0, 64, 48);
    await new Promise((r) => setTimeout(r, 80));
  }
  recorder.stop();
  await done;
  const bytes = new Uint8Array(await new Blob(chunks, { type: 'video/webm' }).arrayBuffer());
  return [...bytes];
});
const webmPath = path.join(tmp, 'qa-clip.webm');
fs.writeFileSync(webmPath, Buffer.from(webm));
await page.getByRole('button', { name: 'Choose video' }).click();
await page.getByTestId('picker-upload').setInputFiles(webmPath);
await page.getByRole('heading', { name: 'Choose a video' }).waitFor({ state: 'hidden', timeout: 60000 });
await saved();
await publish('Publish Home');
v = await visitor('/');
const videoSrc = await v.locator('video').first().getAttribute('src');
check('Hero video uploads and plays from Cloudinary', /res\.cloudinary\.com\/mg4ku51f\/video/.test(videoSrc ?? ''), videoSrc);
check('Video is muted and autoplays as configured', await v.locator('video').first().evaluate((el) => el.muted && el.autoplay));
await v.close();
await page.getByRole('button', { name: 'Remove', exact: true }).nth(0).waitFor();

// ---- Media delete protection and removal
await page.goto(base + '/admin/media');
await page.getByPlaceholder('Search name, alt text or caption').fill('qa-red');
await page.getByTestId('media-qa-red.png').click();
await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
await page.getByText(/still used in/i).waitFor();
check('Client blocks deleting media in use', true);
const ids = await page.evaluate(() => fetch('/api/cms/media').then((r) => r.json()).then((l) => l.filter((m) => m.origin === 'upload').map((m) => m.id)));
const inUseId = await page.evaluate(() => fetch('/api/cms/documents/draft').then((r) => r.text()).then((t) => (t.match(/media:(m-[\w-]+)/) || [])[1]));
check('Server also blocks deleting media in use', (await api(page, 'DELETE', `/media/${inUseId}`)) === 409);
check('Upload records stored', ids.length >= 2, `${ids.length} uploads`);
await page.keyboard.press('Escape');

// Replacing keeps the same reference and updates live.
await page.getByTestId('media-qa-red.png').click();
await page.getByTestId('media-replace').setInputFiles(greenPath);
await page.getByText('File replaced everywhere').waitFor({ timeout: 30000 });
v = await visitor('/');
await v.locator('video').first().waitFor();
await v.close();

// ---- Enquiry from another device
v = await visitor('/contact');
await v.getByLabel('Full Name *').fill('Remote Visitor');
await v.getByLabel('Email Address *').fill('remote@example.com');
await v.getByLabel('Message / Journey Intentions *').fill('Remote QA message');
await v.getByRole('button', { name: 'Send Sanctuary Enquiry' }).click();
await v.getByText('Your Enquiry is Received').waitFor({ timeout: 15000 });
await v.close();
await page.goto(base + '/admin/contact');
await page.getByTestId('enquiry-row').first().waitFor({ timeout: 15000 });
check('Enquiry from another device reaches the admin inbox', (await page.getByTestId('enquiry-row').filter({ hasText: 'Remote Visitor' }).count()) === 1);

// ---- Revisions
await page.goto(base + '/admin/settings');
await page.getByTestId('revision-row').first().waitFor({ timeout: 15000 });
check('Revisions are stored in the database', (await page.getByTestId('revision-row').count()) >= 2);

// ---- Article across devices
await page.goto(base + '/admin/blog?new=1');
await page.getByLabel('Article title').waitFor({ timeout: 15000 });
await page.getByLabel('Article title').fill('Remote QA Article');
await page.getByRole('button', { name: 'Generate from title' }).click();
await page.getByLabel('Excerpt').fill('Excerpt.');
await page.getByLabel('Paragraph text').first().fill('Body.');
await saved();
await page.getByRole('button', { name: 'Publish', exact: true }).click();
await confirmDialog('Publish');
await page.getByText('Article published.').waitFor({ timeout: 15000 });
v = await visitor('/blog/remote-qa-article');
check('Published article opens on another device', (await v.getByRole('heading', { name: 'Remote QA Article' }).count()) === 1);
await v.close();

// ---- Password change
await page.goto(base + '/admin/settings');
await page.getByRole('tab', { name: 'Account & security' }).click();
await page.getByLabel('Current password').fill('wrong-current-pass');
await page.getByLabel('New password').fill('a-brand-new-password-1');
await page.getByRole('button', { name: 'Change password' }).click();
await page.getByText('Your current password is not correct.').waitFor();
check('Password change requires the current password', true);

// ---- Logout ends the server session
const beforeLogout = (await adminCtx.cookies()).find((c) => c.name === 'knowza_cms_session').value;
await page.getByRole('button', { name: 'Account menu' }).click();
await page.getByRole('button', { name: 'Log out' }).click();
await page.getByRole('heading', { name: 'Sign in to the admin' }).waitFor();
const stolen = await browser.newContext();
await stolen.addCookies([{ name: 'knowza_cms_session', value: beforeLogout, url: base + '/api/cms' }]);
const sp = await stolen.newPage();
await sp.goto(base + '/');
check('A cookie from before logout no longer works', (await api(sp, 'GET', '/documents/draft')) === 401);
await stolen.close();

// ---- Editor role, enforced by the server
await page.getByLabel('Email').fill('qa-editor@example.com');
await page.getByLabel('Password', { exact: true }).fill(QA_EDITOR_PASSWORD);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('heading', { name: 'Dashboard' }).waitFor({ timeout: 15000 });
const draftDoc = await page.evaluate(() => fetch('/api/cms/documents/draft').then((r) => r.json()));
check('Editor can save a draft on the server', (await api(page, 'PUT', '/documents/draft', draftDoc)) === 200);
check('Server refuses publishing by an editor', (await api(page, 'PUT', '/documents/published', draftDoc)) === 403);
await page.getByRole('button', { name: 'Account menu' }).click();
await page.getByRole('button', { name: 'Log out' }).click();
await page.getByRole('heading', { name: 'Sign in to the admin' }).waitFor();

// ---- Login rate limit
for (let i = 0; i < 5; i++) {
  await page.getByLabel('Email').fill('qa-editor@example.com');
  await page.getByLabel('Password', { exact: true }).fill('bad-password-' + i);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('alert').waitFor();
  await page.waitForTimeout(500);
}
await page.getByLabel('Password', { exact: true }).fill(QA_EDITOR_PASSWORD);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByText('Too many failed attempts').waitFor({ timeout: 10000 });
check('Repeated failed logins lock out, even with the right password', true);

check('No uncaught errors', errors.length === 0, errors.slice(0, 3).join(' | '));
await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
