// End-to-end test of the admin, driving real interactions. usage: node e2e.mjs <baseUrl> <shotsDir>
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const [base, shots] = process.argv.slice(2);
fs.mkdirSync(shots, { recursive: true });
const results = [];
const check = (name, ok, note = '') => {
  results.push({ name, ok, note });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${note ? ' — ' + note : ''}`);
};

// Small real image files for the upload tests.
const png = (w, h, rgb) => {
  const p = new PNG({ width: w, height: h });
  for (let i = 0; i < w * h; i++) p.data.set([...rgb, 255], i * 4);
  return PNG.sync.write(p);
};
const tmp = path.join(shots, 'files');
fs.mkdirSync(tmp, { recursive: true });
const redPath = path.join(tmp, 'qa-red.png');
const bluePath = path.join(tmp, 'qa-blue.png');
const greenPath = path.join(tmp, 'qa-green.png');
const fakePath = path.join(tmp, 'fake.png');
const txtPath = path.join(tmp, 'note.txt');
fs.writeFileSync(redPath, png(40, 30, [200, 30, 30]));
fs.writeFileSync(bluePath, png(30, 40, [30, 30, 200]));
fs.writeFileSync(greenPath, png(50, 50, [30, 200, 30]));
fs.writeFileSync(fakePath, 'this is not an image');
fs.writeFileSync(txtPath, 'text');

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => {
  if (m.type() === 'error' && !/fontshare|ERR_|Failed to load resource/.test(m.text())) errors.push('console: ' + m.text());
});

const pub = async (url) => {
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(`public ${url}: ` + e.message));
  await p.goto(base + url);
  await p.waitForTimeout(1500);
  return p;
};
const saved = async () => {
  await page.waitForFunction(() => document.querySelector('[data-testid=save-status]')?.textContent === 'Draft saved', null, { timeout: 8000 });
};
const dialogConfirm = async (label) => {
  await page.getByRole('dialog').getByRole('button', { name: label, exact: true }).click();
  await page.waitForTimeout(300);
};
const publishCurrent = async (label) => {
  await page.getByRole('button', { name: label, exact: true }).first().click();
  await dialogConfirm('Publish');
  await page.getByText('Published to the website.').first().waitFor({ timeout: 6000 });
};
const openSection = async (id) => {
  await page.getByTestId(`section-${id}`).click();
  await page.waitForTimeout(150);
};

// ---- Auth
await page.goto(base + '/admin');
await page.getByRole('heading', { name: 'Sign in to the admin' }).waitFor();
check('Admin route shows the marked development sign-in', await page.getByText('Local storage mode.').isVisible());
await page.screenshot({ path: path.join(shots, 'signin.png') });
await page.getByRole('button', { name: 'Enter admin' }).click();
await page.getByRole('heading', { name: 'Dashboard' }).waitFor();
await page.waitForTimeout(2200);
await page.screenshot({ path: path.join(shots, 'dashboard-1440.png') });
check('Dashboard status comes from real content', (await page.getByRole('listitem').filter({ hasText: /^Live\s*47$/ }).count()) === 1);

// ---- Home hero edit, draft isolation, publish
await page.goto(base + '/admin/pages/home');
await openSection('home-hero');
await page.screenshot({ path: path.join(shots, 'home-editor-1440.png') });
await page.getByLabel('Eyebrow', { exact: true }).fill('QA EYEBROW EDIT');
await saved();
let live = await pub('/');
check('Draft edit is NOT public before publishing', !(await live.getByText('QA EYEBROW EDIT').count()));
await live.close();
let preview = await pub('/?cmsPreview=draft');
check('Draft preview shows the unpublished edit', (await preview.getByText('QA EYEBROW EDIT').count()) > 0);
await preview.close();
await publishCurrent('Publish Home');
live = await pub('/');
check('Publishing makes the edit public', (await live.getByText('QA EYEBROW EDIT').count()) > 0);
await live.close();
await page.reload();
await page.getByTestId('section-home-hero').waitFor();
await openSection('home-hero');
check('Edit persists after refresh', (await page.getByLabel('Eyebrow', { exact: true }).inputValue()) === 'QA EYEBROW EDIT');

// ---- Buttons: edit, add
const btnRow = page.getByRole('button', { name: /^Explore Sanctuaries → \/gallery/ }).first();
await btnRow.click();
await page.getByLabel('Label', { exact: true }).first().fill('QA Button');
await page.getByLabel('URL', { exact: true }).first().fill('javascript:alert(1)');
check('Unsafe button URL is flagged in the editor', await page.getByText('Use a path like /about').first().isVisible());
await page.getByLabel('URL', { exact: true }).first().fill('/contact');
await page.getByRole('button', { name: 'Add button' }).click();
await saved();

// ---- Image replacement with upload through picker
await page.getByRole('button', { name: 'Library', exact: true }).first().click();
await page.getByRole('dialog').getByRole('heading', { name: 'Choose an image' }).waitFor();
await page.getByTestId('picker-upload').setInputFiles(redPath);
await page.getByRole('heading', { name: 'Choose an image' }).waitFor({ state: 'hidden' });
await page.getByLabel('Background image alt text').fill('QA red hero');
await saved();
await publishCurrent('Publish Home');
live = await pub('/');
const heroImg = live.locator('img[alt="QA red hero"]');
check('Uploaded image replaces the hero on the public site', (await heroImg.count()) === 1 && (await heroImg.evaluate((i) => i.src.startsWith('blob:') && i.naturalWidth === 40)));
check('Edited button shows and uses its new URL', (await live.locator('a[href="/contact"]', { hasText: 'QA Button' }).count()) === 1);
await live.reload();
await live.waitForTimeout(1500);
check('Uploaded image survives a public page refresh', await live.locator('img[alt="QA red hero"]').evaluate((i) => i.naturalWidth === 40));
await live.close();

// ---- Card editing: add, duplicate, delete
await openSection('home-sanctuary-features');
await page.getByRole('button', { name: 'Add card' }).click();
await page.getByRole('button', { name: 'Duplicate Heritage Courtyard' }).click();
await page.getByRole('button', { name: /^Heritage Courtyard$/ }).nth(1).waitFor();
await page.getByRole('button', { name: 'Delete Canopy Sanctuary' }).click();
await dialogConfirm('Delete');
await saved();
preview = await pub('/?cmsPreview=draft');
check('Add, duplicate and delete cards work', (await preview.getByText('New sanctuary').count()) > 0 && (await preview.getByRole('heading', { name: 'Heritage Courtyard' }).count()) === 2 && (await preview.getByRole('heading', { name: 'Canopy Sanctuary' }).count()) === 0);
await preview.close();

// ---- Section operations
await page.getByRole('button', { name: 'Hide Foundations' }).click();
await saved();
preview = await pub('/?cmsPreview=draft');
check('Hide section works', (await preview.getByText('The Principles of Our Experience').count()) === 0);
await preview.close();
await page.getByRole('button', { name: 'Show Foundations' }).click();
await openSection('home-offerings');
await page.getByRole('button', { name: 'Duplicate section' }).click();
await page.waitForTimeout(200);
await page.getByRole('button', { name: 'Delete section' }).click();
await dialogConfirm('Delete section');
await saved();
// Add every template and verify it renders.
const templates = ['tpl-hero', 'tpl-text', 'tpl-image-text', 'tpl-gallery', 'tpl-features', 'tpl-stats', 'tpl-testimonials', 'tpl-cta', 'tpl-video', 'tpl-blog', 'tpl-contact'];
for (const t of templates) {
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByTestId(`template-${t}`).click();
  await page.waitForTimeout(120);
}
await saved();
await page.getByRole('button', { name: 'Move Brand Statement down' }).click();
await saved();
preview = await pub('/?cmsPreview=draft');
const order = await preview.evaluate(() => [...document.querySelectorAll('[data-cms-section]')].map((n) => n.getAttribute('data-cms-section')));
check('Reorder changes the order on the page', order.indexOf('home-sanctuary-features') < order.indexOf('home-brand-statement'), order.slice(0, 4).join(','));
check('All 11 section templates render', (await Promise.all(['A New Headline', 'A New Heading', 'Image Gallery', 'What Sets Us Apart', 'In Numbers', 'In Their Words', 'A New Invitation.', 'Watch', 'Latest Stories', 'Sanctuary Enquiry Form'].map((t) => preview.getByRole('heading', { name: t, exact: true }).count()))).every((n) => n >= 1));
await preview.setViewportSize({ width: 375, height: 800 });
await preview.waitForTimeout(300);
check('Templates do not overflow at 375px', await preview.evaluate(() => document.documentElement.scrollWidth <= 376));
await preview.close();

// ---- Preview UI
await page.getByRole('button', { name: 'Preview', exact: true }).click();
await page.getByRole('button', { name: 'Mobile' }).click();
await page.waitForTimeout(2000);
const frameWidth = await page.getByTestId('preview-frame').evaluate((f) => f.getBoundingClientRect().width / 1);
await page.screenshot({ path: path.join(shots, 'preview-mobile.png') });
check('Mobile preview renders at phone width', Math.abs(frameWidth - 375) < 2, String(frameWidth));
const frame = page.frameLocator('[data-testid=preview-frame]');
check('Preview frame shows draft content', (await frame.getByText('QA EYEBROW EDIT').count()) > 0 || (await frame.locator('[data-cms-section]').count()) === 1);
await page.getByRole('button', { name: 'Close' }).click();

// ---- About
await page.goto(base + '/admin/pages/about');
await openSection('about-north-star');
await page.getByRole('button', { name: 'Mission', exact: true }).click();
await page.getByRole('dialog').waitFor({ state: 'detached', timeout: 500 }).catch(() => {});
await page.getByLabel('Banner quote').nth(1).fill('QA MISSION QUOTE');
await openSection('about-founder');
await page.getByLabel('Name', { exact: true }).first().fill('QA Founder');
await page.getByRole('button', { name: 'Founding Covenant & Earth Charter' }).click();
await page.getByLabel('Seal text').fill('QA SEAL');
await saved();
await publishCurrent('Publish About');
live = await pub('/about');
await live.getByRole('button', { name: /02 \/ Our Mission/ }).click();
await live.waitForTimeout(400);
check('About mission tab text editable', (await live.getByText('QA MISSION QUOTE').count()) > 0);
check('Founder details editable', (await live.getByText('QA Founder').count()) > 0);
await live.getByRole('button', { name: /Founding Covenant/ }).click();
check('Earth Charter editable', (await live.getByText('QA SEAL').count()) > 0);
await live.close();

// ---- Gallery
await page.goto(base + '/admin/gallery');
await page.getByTestId('gallery-upload').setInputFiles([bluePath, greenPath]);
await page.getByText('2 images added').waitFor();
await page.screenshot({ path: path.join(shots, 'gallery-1440.png') });
const first = page.locator('[data-testid^=gallery-item-]').nth(0);
await first.getByRole('button', { name: /^Edit / }).click();
await page.getByRole('dialog').getByLabel('Title', { exact: true }).fill('QA Gallery Image');
await page.getByRole('dialog').getByLabel('Image alt text').fill('QA alt');
await page.getByRole('dialog').getByRole('button', { name: 'Done' }).click();
// Drag the new image to the third position.
const beforeOrder = await page.locator('[data-testid^=gallery-item-]').evaluateAll((n) => n.map((x) => x.dataset.testid));
await page.locator('[data-testid^=gallery-item-]').nth(0).dragTo(page.locator('[data-testid^=gallery-item-]').nth(3));
await page.waitForTimeout(300);
const afterOrder = await page.locator('[data-testid^=gallery-item-]').evaluateAll((n) => n.map((x) => x.dataset.testid));
check('Gallery drag and drop reorders images', beforeOrder[0] !== afterOrder[0] && afterOrder[3] === beforeOrder[0]);
await page.getByRole('button', { name: 'Hide The Valley Sanctuary at Dusk' }).click();
await page.getByRole('button', { name: 'View QA Gallery Image full screen' }).click();
check('Full-screen preview opens', await page.getByRole('dialog', { name: /Preview of QA Gallery Image/ }).isVisible());
await page.keyboard.press('Escape');
await saved();
await publishCurrent('Publish gallery');
live = await pub('/gallery');
check('Gallery changes reach the public page', (await live.getByRole('heading', { name: 'QA Gallery Image' }).count()) === 1);
check('Hidden gallery items are not public', (await live.getByRole('heading', { name: 'The Valley Sanctuary at Dusk' }).count()) === 0);
await live.close();

// ---- Blog
await page.goto(base + '/admin/blog');
await page.getByRole('button', { name: 'New article' }).click();
await page.getByLabel('Article title').waitFor();
await page.getByLabel('Article title').fill('QA Article Title');
await page.getByRole('button', { name: 'Generate from title' }).click();
await page.getByLabel('Excerpt').fill('QA excerpt.');
await page.getByLabel('Paragraph text').first().fill('First **bold** paragraph with [a link](javascript:alert(2)).');
await page.getByRole('button', { name: 'Pull quote' }).click();
await page.getByLabel('Quote', { exact: true }).fill('QA Quote');
await page.getByLabel('SEO title').fill('QA SEO Title');
await saved();
await page.screenshot({ path: path.join(shots, 'blog-editor-1440.png') });
await page.getByRole('button', { name: 'Save draft' }).click();
await page.waitForTimeout(400);
live = await pub('/blog/qa-article-title');
check('Draft article is not public', (await live.getByText('Story Not Found').count()) === 1);
await live.close();
preview = await pub('/blog/qa-article-title?cmsPreview=draft');
check('Draft article previews', (await preview.getByRole('heading', { name: 'QA Article Title' }).count()) === 1);
await preview.close();
await page.getByRole('button', { name: 'Publish', exact: true }).click();
await dialogConfirm('Publish');
await page.getByText('Article published.').waitFor();
live = await pub('/blog/qa-article-title');
check('Published article has a working route', (await live.getByRole('heading', { name: 'QA Article Title' }).count()) === 1);
check('Rich text renders bold', (await live.locator('strong', { hasText: 'bold' }).count()) === 1);
check('Script URLs in rich text are neutralised', (await live.locator('a[href^="javascript"]').count()) === 0);
check('Article SEO title applied', (await live.title()) === 'QA SEO Title');
await live.close();
// Schedule
await page.getByRole('button', { name: 'Schedule' }).click();
const soon = new Date(Date.now() + 3600 * 1000);
const local = new Date(soon.getTime() - soon.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
await page.getByLabel('Go live at').fill(local);
await page.getByRole('dialog').getByRole('button', { name: 'Schedule' }).click();
await page.getByText(/Scheduled for/).waitFor();
live = await pub('/blog/qa-article-title');
check('Scheduled article stays hidden until its time', (await live.getByText('Story Not Found').count()) === 1);
await live.close();
await page.getByRole('button', { name: 'Unpublish' }).click();
await dialogConfirm('Unpublish');
await page.getByText('Article unpublished.').waitFor();
await page.goto(base + '/admin/blog');
await page.getByRole('button', { name: 'Duplicate QA Article Title' }).click();
await page.getByRole('link', { name: /QA Article Title \(copy\)/ }).waitFor();
await page.getByRole('button', { name: 'Delete QA Article Title (copy)' }).click();
await dialogConfirm('Delete article');
await page.getByText('Article deleted.').waitFor();
check('Duplicate and delete article work', (await page.getByRole('link', { name: /QA Article Title \(copy\)/ }).count()) === 0);
const originalRoute = await pub('/blog/reconnecting-with-nature-the-healing-language-of-forests');
check('Existing article routes still work', (await originalRoute.getByRole('heading', { name: /Reconnecting with Nature/ }).count()) === 1);
await originalRoute.close();

// ---- Media library
await page.goto(base + '/admin/media');
await page.getByPlaceholder('Search name, alt text or caption').fill('qa-red');
await page.getByTestId('media-qa-red.png').click();
await page.getByRole('dialog').getByText(/Used in \d+ place/).waitFor();
const usageText = await page.getByRole('dialog').getByText(/Used in \d+ place/).textContent();
check('Usage tracking finds where media is used', !usageText.includes('Used in 0'), usageText);
check('Image dimensions shown', (await page.getByRole('dialog').getByText('40 × 30').count()) === 1);
await page.screenshot({ path: path.join(shots, 'media-detail.png') });
await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
await page.getByText(/still used in/i).waitFor();
check('Deleting media that is in use is blocked', true);
await page.getByTestId('media-replace').setInputFiles(greenPath);
await page.getByText('File replaced everywhere').waitFor();
live = await pub('/');
check('Replacing a file updates it everywhere', await live.locator('img[alt="QA red hero"]').evaluate((i) => i.naturalWidth === 50));
await live.close();
await page.getByTestId('media-upload').setInputFiles(fakePath);
await page.getByText('could not be read as an image').waitFor({ timeout: 5000 });
check('Fake image file is rejected', true);
await page.getByTestId('media-upload').setInputFiles(txtPath);
await page.getByText('is not a supported file').waitFor({ timeout: 5000 });
check('Unsupported file type is rejected', true);
const lsSize = await page.evaluate(() => JSON.stringify(localStorage).length);
const hasBase64 = await page.evaluate(() => JSON.stringify(localStorage).includes('base64,'));
check('No Base64 images in localStorage', !hasBase64, `${Math.round(lsSize / 1024)} KB used`);

// ---- Socials
await page.goto(base + '/admin/social');
await page.getByRole('button', { name: /^Instagram$/ }).first().click();
await page.getByLabel('URL', { exact: true }).fill('https://instagram.com/qa-handle');
await page.getByRole('button', { name: 'Done' }).click();
await page.getByRole('button', { name: /^Facebook \(off\)$/ }).click();
await page.getByRole('switch', { name: 'Show on the website' }).click();
await page.getByLabel('URL', { exact: true }).fill('https://facebook.com/qa');
await page.getByRole('button', { name: 'Done' }).click();
await saved();
await page.screenshot({ path: path.join(shots, 'social.png') });
await publishCurrent('Publish social links');
live = await pub('/contact');
check('Social URL updates footer and contact page', (await live.locator('a[href="https://instagram.com/qa-handle"]').count()) >= 5);
check('Newly enabled social appears', (await live.locator('footer a[href="https://facebook.com/qa"]').count()) === 1);
await live.close();

// ---- Header, footer, global
await page.goto(base + '/admin/brand');
await page.getByRole('tab', { name: 'Header' }).click();
await page.getByRole('button', { name: /^CONTACT → \/contact/ }).click();
await page.getByLabel('Label', { exact: true }).fill('ENQUIRE');
await page.getByRole('tab', { name: 'Footer' }).click();
await page.getByRole('button', { name: 'Bottom bar' }).click();
await page.getByLabel('Copyright').fill('QA copyright {year} {brand}');
await saved();
await page.goto(base + '/admin/pages/home');
await page.getByTestId('section-home-closing').click();
await page.getByLabel('Heading').fill('QA SHARED INVITATION');
await saved();
await page.goto(base + '/admin/brand');
await page.screenshot({ path: path.join(shots, 'brand.png') });
await publishCurrent('Publish settings');
live = await pub('/about');
await live.locator('header').getByRole('link', { name: 'ENQUIRE' }).waitFor({ timeout: 8000 }).catch(() => {});
check('Header nav label updates', (await live.locator('header').getByRole('link', { name: 'ENQUIRE' }).count()) === 1);
check('Footer copyright updates', (await live.locator('footer').getByText(/QA copyright \d{4} KNOWZA/).count()) === 1);
check('Shared closing invitation updates', (await live.getByRole('heading', { name: 'QA SHARED INVITATION' }).count()) === 1);
await live.close();

// ---- Contact enquiry
live = await pub('/contact');
await live.getByRole('button', { name: 'Send Sanctuary Enquiry' }).click();
check('Contact form validates', (await live.getByText('Please provide your full name.').count()) === 1);
await live.getByLabel('Full Name *').fill('QA Visitor');
await live.getByLabel('Email Address *').fill('qa@example.com');
await live.getByLabel('Message / Journey Intentions *').fill('QA message body');
await live.getByRole('button', { name: 'Send Sanctuary Enquiry' }).click();
await live.getByText('Your Enquiry is Received').waitFor();
check('Enquiry confirmation includes the sender', (await live.getByText('QA Visitor').count()) === 1);
await live.close();
await page.goto(base + '/admin/contact');
await page.getByTestId('enquiry-row').first().waitFor();
check('Enquiry appears in the admin inbox', (await page.getByTestId('enquiry-row').filter({ hasText: 'QA Visitor' }).count()) === 1);
await page.screenshot({ path: path.join(shots, 'contact.png') });
await page.getByRole('tab', { name: 'Contact details' }).click();
await page.getByLabel('Phone number').fill('+91 99999 00000');
await saved();
await publishCurrent('Publish details');
live = await pub('/contact');
check('Phone number appears when set', (await live.locator('a[href="tel:+919999900000"]').count()) === 1);
await live.close();

// ---- Unpublish a page
await page.goto(base + '/admin/pages/gallery');
await page.getByRole('button', { name: 'Unpublish', exact: true }).click();
await dialogConfirm('Unpublish');
await page.getByText('Page unpublished.').waitFor();
live = await pub('/gallery');
check('Unpublished page returns the 404 page', (await live.getByRole('heading', { name: '404' }).count()) === 1);
await live.close();
await page.getByRole('button', { name: 'Re-publish' }).click();
await dialogConfirm('Publish');
await page.getByText('Page published.').waitFor();

// ---- Roles
await page.goto(base + '/admin');
await page.getByRole('button', { name: 'Account menu' }).click();
await page.getByRole('button', { name: 'Log out' }).click();
await page.getByRole('heading', { name: 'Sign in to the admin' }).waitFor();
await page.getByLabel('Role to test').click();
await page.getByRole('option', { name: /^Editor/ }).click();
await page.getByRole('button', { name: 'Enter admin' }).click();
await page.goto(base + '/admin/pages/home');
await page.getByTestId('section-home-hero').waitFor();
check('Editor role cannot publish', await page.getByRole('button', { name: 'Publish Home' }).isDisabled());
await page.getByRole('button', { name: 'Account menu' }).click();
await page.getByRole('button', { name: 'Log out' }).click();
await page.getByLabel('Role to test').click();
await page.getByRole('option', { name: /^Viewer/ }).click();
await page.getByRole('button', { name: 'Enter admin' }).click();
await page.goto(base + '/admin/pages/home');
await page.getByTestId('section-home-hero').click();
check('Viewer role cannot edit', await page.getByLabel('Eyebrow', { exact: true }).isDisabled());
await page.getByRole('button', { name: 'Account menu' }).click();
await page.getByRole('button', { name: 'Log out' }).click();
await page.getByRole('button', { name: 'Enter admin' }).click();

// ---- Admin responsive
for (const [w, h] of [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [425, 800], [375, 700], [320, 640]]) {
  await page.setViewportSize({ width: w, height: h });
  for (const route of ['', '/pages/home', '/pages/about', '/sections', '/blog', '/gallery', '/media', '/social', '/brand', '/contact', '/settings']) {
    await page.goto(base + '/admin' + route);
    await page.waitForTimeout(250);
    const over = await page.evaluate(() => {
      const main = document.querySelector('main');
      return { doc: document.documentElement.scrollWidth - window.innerWidth, main: main ? main.scrollWidth - main.clientWidth : 0 };
    });
    if (over.doc > 1 || over.main > 1) check(`No horizontal overflow at ${w}px ${route || '/'}`, false, JSON.stringify(over));
  }
  await page.goto(base + '/admin');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(shots, `dash-${w}.png`) });
}
check('Admin responsive sweep complete (failures listed above)', true);
await page.setViewportSize({ width: 375, height: 700 });
await page.goto(base + '/admin/pages/home');
await page.getByRole('button', { name: 'Open menu' }).click();
await page.waitForTimeout(350);
await page.screenshot({ path: path.join(shots, 'drawer-375.png') });
await page.getByRole('link', { name: 'Media Library' }).click();
await page.getByRole('heading', { name: 'Media Library' }).waitFor();
check('Mobile drawer navigates', true);
await page.goto(base + '/admin/pages/home');
await page.getByTestId('section-home-offerings').click();
await page.waitForTimeout(250);
await page.screenshot({ path: path.join(shots, 'editor-375.png') });

check('No uncaught errors during the whole run', errors.length === 0, errors.slice(0, 5).join(' | '));
await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
