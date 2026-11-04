// Final acceptance test. Runs in fresh browser profiles against a local-mode server (VITE_CMS_BACKEND=local),
// so all test data disappears with the profile. usage: node cms-acceptance.mjs <baseUrl> <workDir>
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const [base, work] = process.argv.slice(2);
fs.mkdirSync(work, { recursive: true });
const results = [];
const check = (name, ok, note = '') => {
  results.push({ name, ok: Boolean(ok), note });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${note ? ` (${note})` : ''}`);
};
const png = (w, h, rgb) => {
  const p = new PNG({ width: w, height: h });
  for (let i = 0; i < w * h; i++) p.data.set([...rgb, 255], i * 4);
  return PNG.sync.write(p);
};
const file = (name, data) => {
  const full = path.join(work, name);
  fs.writeFileSync(full, data);
  return full;
};
const red = file('qa-red.png', png(40, 30, [200, 30, 30]));
const blue = file('qa-blue.png', png(30, 40, [30, 30, 200]));
const green = file('qa-green.png', png(50, 50, [30, 200, 30]));
const fake = file('fake.png', 'not an image');
const note = file('note.txt', 'text');
const huge = file('huge.png', Buffer.alloc(16 * 1024 * 1024, 1));

const problems = [];
const watch = (p, where) => {
  p.setDefaultTimeout(12000);
  p.on('pageerror', (e) => problems.push(`${where} pageerror: ${e.message}`));
  p.on('console', (m) => {
    if (['error', 'warning'].includes(m.type()) && !/fontshare|fonts\.g|ERR_|Failed to load resource|Download the React DevTools|GPU stall|WebGL/.test(m.text())) problems.push(`${where} ${m.type()}: ${m.text().slice(0, 220)}`);
  });
  p.on('response', (r) => {
    if (r.status() >= 400 && r.url().startsWith(base) && !r.url().includes('/api/')) problems.push(`${where} ${r.status()}: ${r.url().replace(base, '')}`);
  });
};

const pick = async (p, name, option) => {
  await p.getByRole('combobox', { name }).click();
  const list = p.getByRole('option');
  await (typeof option === 'number' ? list.nth(option) : p.getByRole('option', { name: option, exact: true })).click();
  await p.waitForTimeout(150);
};

const browser = await chromium.launch();
const newSession = async (role) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await ctx.newPage();
  watch(page, 'admin');
  await page.goto(base + '/admin');
  if (role) await pick(page, 'Role to test', role);
  await page.getByRole('button', { name: 'Enter admin' }).click();
  await page.getByRole('heading', { name: 'Dashboard' }).waitFor();
  return { ctx, page };
};
let { ctx, page } = await newSession();

const go = async (route) => {
  await page.goto(base + '/admin' + route);
  await page.locator('main').waitFor();
  await page.waitForTimeout(350);
};
const saved = () => page.waitForFunction(() => document.querySelector('[data-testid=save-status]')?.textContent === 'Draft saved', null, { timeout: 15000 });
const confirmDialog = (label) => page.getByRole('dialog').getByRole('button', { name: label, exact: true }).click();
const publish = async (label) => {
  await page.getByRole('button', { name: label, exact: true }).first().click();
  await confirmDialog('Publish');
  await page.getByText('Published to the website.').first().waitFor();
  await page.waitForTimeout(150);
};
const pub = async (url) => {
  const p = await ctx.newPage();
  watch(p, `public ${url}`);
  await p.goto(base + url);
  await p.waitForTimeout(1500);
  return p;
};
const section = async (name, run) => {
  console.log(`\n== ${name}`);
  try {
    await run();
  } catch (err) {
    check(`${name}: finished without an unexpected stop`, false, err.message.split('\n').slice(0, 2).join(' ').slice(0, 220));
    await page.keyboard.press('Escape').catch(() => {});
  }
};

await section('Navigation and every dashboard link', async () => {
  const routes = [['Dashboard', 'Dashboard'], ['Page Management', 'Page Management'], ['Website Sections', 'Website Sections'], ['Blog & Journal', 'Blog & Journal'], ['Gallery', 'Gallery'], ['Media Library', 'Media Library'], ['Social Media', 'Social Media'], ['Brand Settings', 'Brand Settings'], ['Contact Management', 'Contact Management'], ['Admin Settings', 'Admin Settings']];
  const nav = page.getByRole('navigation', { name: 'Admin', exact: true });
  for (const [link, heading] of routes) {
    await nav.getByRole('link', { name: link, exact: true }).click();
    await page.getByRole('heading', { name: heading }).first().waitFor();
  }
  check('All 10 sidebar links open their page', true);
  const top = page.getByRole('navigation', { name: 'Admin areas' });
  for (const [pill, heading] of [['Content', 'Blog & Journal'], ['Website', 'Social Media'], ['Settings', 'Admin Settings'], ['Overview', 'Dashboard']]) {
    await top.getByRole('link', { name: pill }).click();
    await page.getByRole('heading', { name: heading }).first().waitFor();
  }
  check('All 4 top navigation pills work', true);

  await go('');
  for (const [name, heading] of [['All pages', 'Page Management'], ['Library', 'Media Library'], ['View all enquiries', 'Contact Management']]) {
    await page.getByRole('link', { name, exact: true }).click();
    await page.getByRole('heading', { name: heading }).first().waitFor();
    await go('');
  }
  for (const title of ['Home', 'About', 'Gallery', 'Blog & Journal', 'Contact']) {
    await page.getByRole('main').getByRole('link', { name: new RegExp(`^${title.replace('&', '&')}\\s`) }).first().click();
    await page.locator('[data-testid^=section-]').first().waitFor();
    await go('');
  }
  check('Dashboard card links work', true);
  await page.getByRole('button', { name: 'Upload media' }).click();
  await page.getByRole('heading', { name: 'Media Library' }).waitFor();

  await go('');
  for (const [name, check_] of [['Add gallery images', 'Gallery'], ['Upload media', 'Media Library']]) {
    await page.getByRole('button', { name: 'Quick action' }).click();
    await page.getByRole('link', { name, exact: true }).click();
    await page.getByRole('heading', { name: check_ }).first().waitFor();
  }
  await page.getByRole('button', { name: 'Quick action' }).click();
  await page.getByRole('link', { name: 'Edit home page' }).click();
  await page.locator('[data-testid^=section-]').first().waitFor();
  check('Quick action menu works', true);

  await go('');
  await page.getByLabel('Search all content').fill('reconnecting');
  await page.locator('.adm-pop a', { hasText: 'Reconnecting with Nature' }).first().click();
  await page.waitForTimeout(300);
  check('Search finds content and opens it', page.url().includes('/admin/blog/'));
  await go('');
  await page.getByLabel('Search all content').fill('zzzqqq');
  await page.getByText('Nothing found for').waitFor();
  check('Search shows an empty result', true);

  await go('');
  await page.getByRole('button', { name: 'Collapse sidebar' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Expand sidebar' }).waitFor();
  check('Collapsed sidebar is remembered', true);
  await page.getByRole('button', { name: 'Expand sidebar' }).click();
});

await section('Typing inside popups keeps focus', async () => {
  const types = async (name, open, input) => {
    await open();
    const field = input();
    await field.click();
    await field.fill('');
    await field.pressSequentially('abcdef', { delay: 30 });
    await page.waitForTimeout(150);
    const value = await field.inputValue();
    check(`${name}: can type a whole word`, value === 'abcdef', `got "${value}"`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  };
  await go('/gallery');
  await types('Gallery image popup', () => page.getByRole('button', { name: /^Edit / }).first().click(), () => page.getByRole('dialog').getByLabel('Title', { exact: true }));
  await go('/social');
  await types('Social link popup', () => page.getByRole('button', { name: /^Instagram$/ }).click(), () => page.getByRole('dialog').getByLabel('Handle', { exact: true }));
  await go('/media');
  await types('Media details popup', () => page.locator('main button[data-testid^="media-"]').first().click(), () => page.getByRole('dialog').getByLabel('Caption', { exact: true }));
  await go('/gallery');
  await types('Add by URL popup', () => page.getByRole('button', { name: 'Add by URL' }).click(), () => page.getByLabel('URL for the gallery image'));
  await go('/pages/home');
  await page.getByLabel('Eyebrow', { exact: true }).click();
  await page.getByLabel('Eyebrow', { exact: true }).fill('');
  await page.getByLabel('Eyebrow', { exact: true }).pressSequentially('abcdef', { delay: 30 });
  check('Section editor: can type a whole word', (await page.getByLabel('Eyebrow', { exact: true }).inputValue()) === 'abcdef');
});

await section('Popups: cancel, close and Escape', async () => {
  await go('/pages/home');
  await page.getByTestId('section-home-hero').waitFor();
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('[role=dialog]'));
  check('Escape closes a popup', true);
  await page.getByRole('button', { name: 'Delete section' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
  await page.waitForFunction(() => !document.querySelector('[role=dialog]'));
  check('Cancel on a delete keeps the section', (await page.getByTestId('section-home-hero').count()) === 1);

  await go('/gallery');
  await page.getByRole('button', { name: /^Edit / }).first().click();
  await page.getByRole('button', { name: 'Remove from gallery' }).click();
  await page.waitForTimeout(250);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  check('Escape on a nested confirm only closes the confirm', (await page.getByRole('dialog').count()) === 1, `${await page.getByRole('dialog').count()} popups left`);
  await page.keyboard.press('Escape');
});

await section('TEST A-D: page editing', async () => {
  await go('/pages/home');
  await page.getByLabel('Eyebrow', { exact: true }).fill('QA HOME HEADING');
  await saved();
  await page.getByRole('button', { name: 'Save draft' }).click();
  await page.getByText('Draft saved. It is not public until you publish.').waitFor();
  let live = await pub('/');
  check('A: an unpublished edit stays off the public site', (await live.getByText('QA HOME HEADING').count()) === 0);
  await live.close();
  await page.reload();
  await page.getByTestId('section-home-hero').waitFor();
  check('A: the edit survives a refresh', (await page.getByLabel('Eyebrow', { exact: true }).inputValue()) === 'QA HOME HEADING');

  await page.getByTestId('image-field').first().getByTestId('image-upload').setInputFiles(red);
  await page.waitForFunction(() => document.querySelector('[data-testid=image-field] .adm-imagefield-preview img')?.naturalWidth === 40);
  check('B: a replaced image shows in the preview', true);
  await page.getByLabel('Background image alt text').fill('QA hero');
  await saved();

  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.locator('[data-testid^=template-]').first().click();
  await page.waitForFunction(() => !document.querySelector('[role=dialog]'));
  const before = await page.locator('[data-testid^=section-]').evaluateAll((els) => els.map((e) => e.dataset.testid));
  const added = before.find((id) => id.startsWith('section-sec'));
  check('C: a new section is added', Boolean(added));
  const index = before.indexOf(added);
  await page.locator(`[data-testid="${added}"]`).locator('..').getByRole('button', { name: /^Move .* up$/ }).click();
  await page.waitForTimeout(250);
  const after = await page.locator('[data-testid^=section-]').evaluateAll((els) => els.map((e) => e.dataset.testid));
  check('C: the new section moves up', after.indexOf(added) === index - 1);
  await page.getByRole('button', { name: 'Duplicate section' }).click();
  await page.waitForTimeout(250);
  check('C: duplicate adds a copy', (await page.locator('[data-testid^=section-]').count()) === before.length + 1);
  await page.getByRole('button', { name: 'Delete section' }).click();
  await confirmDialog('Delete section');
  await page.waitForTimeout(250);
  check('C: delete removes the copy', (await page.locator('[data-testid^=section-]').count()) === before.length);
  await saved();
  await publish('Publish Home');
  live = await pub('/');
  check('J: the published heading is public', (await live.getByText('QA HOME HEADING').count()) > 0);
  check('J: the published image is public', (await live.locator('img[alt="QA hero"]').first().evaluate((i) => i.naturalWidth)) === 40);
  const order = await live.locator('[data-cms-section]').evaluateAll((els) => els.map((e) => e.getAttribute('data-cms-section')));
  check('J: the public order matches the admin', order.indexOf(added.replace('section-', '')) === index - 1, order.join(', ').slice(0, 120));
  await live.close();

  await go('/pages/about');
  const label = page.locator('main fieldset input[type=text], main fieldset textarea').nth(1);
  await label.fill('QA ABOUT TEXT');
  await saved();
  await publish('Publish About');
  live = await pub('/about');
  check('D: About page edit is public', (await live.getByText('QA ABOUT TEXT').count()) > 0);
  await live.close();

  await go('/pages/home');
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  await page.getByTestId('preview-frame').waitFor();
  for (const device of ['Tablet', 'Mobile', 'Desktop']) await page.getByRole('button', { name: device }).click();
  await page.getByRole('button', { name: 'Reload preview' }).click();
  check('Preview opens and switches device', true);
  await page.getByRole('button', { name: 'Close' }).click();
});

await section('SEO settings', async () => {
  await go('/pages/home');
  const button = page.getByRole('button', { name: 'Page SEO' });
  check('Every page has SEO settings', (await button.count()) === 1);
  await button.click();
  await page.getByLabel('SEO title').fill('QA Home SEO');
  await page.getByLabel('SEO description').fill('QA home description');
  await page.getByRole('dialog').getByRole('button', { name: 'Done' }).click();
  await saved();
  await publish('Publish Home');
  const live = await pub('/');
  check('Page SEO reaches the public page', (await live.title()) === 'QA Home SEO' && (await live.locator('meta[name=description]').getAttribute('content')) === 'QA home description');
  await live.close();
});

await section('TEST E: blog', async () => {
  await go('/blog');
  await page.getByRole('button', { name: 'New article' }).click();
  await page.getByLabel('Article title').waitFor();
  await page.getByLabel('Article title').fill('QA Acceptance Post');
  await page.getByRole('button', { name: 'Generate from title' }).click();
  await page.getByLabel('Paragraph text').fill('QA acceptance body.');
  await page.getByRole('button', { name: 'Heading', exact: true }).click();
  await page.getByRole('button', { name: 'Pull quote' }).click();
  await page.getByRole('button', { name: 'Image', exact: true }).click();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Delete Image' }).click();
  await saved();
  await page.getByRole('main').getByRole('button', { name: 'Publish', exact: true }).click();
  await confirmDialog('Publish');
  await page.getByText('Article published.').waitFor();
  let live = await pub('/blog/qa-acceptance-post');
  check('E: a new article has a public page', (await live.getByRole('heading', { name: 'QA Acceptance Post' }).count()) === 1 && (await live.getByText('QA acceptance body.').count()) === 1);
  await live.close();
  live = await pub('/blog');
  check('E: the article is on the blog list', (await live.getByText('QA Acceptance Post').count()) > 0);
  await live.close();

  await page.getByRole('button', { name: 'Schedule' }).click();
  await page.getByLabel('Go live at').fill('2020-01-01T10:00');
  await page.getByRole('dialog').getByRole('button', { name: 'Schedule' }).click();
  await page.getByText('Choose a date and time in the future.').waitFor();
  await page.getByLabel('Go live at').fill('2040-01-01T10:00');
  await page.getByRole('dialog').getByRole('button', { name: 'Schedule' }).click();
  await page.getByText(/^Scheduled for/).waitFor();
  live = await pub('/blog/qa-acceptance-post');
  check('E: a future scheduled article is not public', (await live.getByRole('heading', { name: 'QA Acceptance Post' }).count()) === 0);
  await live.close();
  await page.getByRole('main').getByRole('button', { name: 'Publish', exact: true }).click();
  await confirmDialog('Publish');
  await page.getByText('Article published.').waitFor();
  await page.getByRole('button', { name: 'Unpublish' }).click();
  await confirmDialog('Unpublish');
  await page.getByText('Article unpublished.').waitFor();
  live = await pub('/blog/qa-acceptance-post');
  check('E: an unpublished article leaves the public site', (await live.getByRole('heading', { name: 'QA Acceptance Post' }).count()) === 0);
  await live.close();

  await page.getByLabel('Slug').fill('Bad Slug!');
  await page.getByRole('main').getByRole('button', { name: 'Publish', exact: true }).click();
  await page.getByText(/^Fix the slug first/).waitFor();
  check('E: an invalid slug is refused', true);
  await page.getByRole('button', { name: 'Generate from title' }).click();

  await go('/blog');
  await pick(page, 'Filter by status', 'Draft');
  check('Blog status filter works', (await page.getByRole('link', { name: /QA Acceptance Post/ }).count()) === 1 && (await page.getByRole('link', { name: /Reconnecting/ }).count()) === 0);
  await pick(page, 'Filter by status', 'All statuses');
  await page.getByLabel('Search articles').fill('acceptance');
  check('Blog search works', (await page.getByRole('main').getByRole('link', { name: /QA Acceptance Post/ }).count()) === 1);
  await page.getByLabel('Search articles').fill('');
  await page.getByRole('button', { name: 'Duplicate QA Acceptance Post' }).click();
  await page.getByRole('link', { name: /QA Acceptance Post \(copy\)/ }).waitFor();
  await page.getByRole('button', { name: 'Delete QA Acceptance Post (copy)' }).click();
  await confirmDialog('Delete article');
  await page.getByText('Article deleted.').waitFor();
  check('Article duplicate and delete work', (await page.getByRole('link', { name: /\(copy\)/ }).count()) === 0);

  // Publishing categories must not also publish an unrelated article's draft edits.
  const first = page.locator('main ul li a').first();
  const firstTitle = (await first.locator('span').first().textContent()).trim();
  await first.click();
  await page.getByLabel('Article title').waitFor();
  const slug = await page.getByLabel('Slug').inputValue();
  await page.getByLabel('Excerpt').fill('QA UNPUBLISHED EXCERPT');
  await page.getByLabel('Article introduction').fill('QA UNPUBLISHED INTRO');
  await saved();
  await go('/blog');
  await page.getByRole('tab', { name: 'Categories' }).click();
  await page.getByRole('button', { name: 'Publish categories' }).click();
  await page.getByText('Categories published.').waitFor();
  await page.waitForTimeout(200);
  live = await pub(`/blog/${slug}`);
  const leaked = await live.getByText('QA UNPUBLISHED INTRO').count();
  await live.close();
  check('Publish categories leaves article drafts unpublished', leaked === 0, firstTitle);
});

await section('TEST F: gallery', async () => {
  await go('/gallery');
  const items = page.locator('[data-testid^=gallery-item-]');
  const before = await items.count();
  await page.getByTestId('gallery-upload').setInputFiles([red, blue]);
  await page.getByText('2 images added').waitFor();
  check('F: several images upload at once', (await items.count()) === before + 2);
  await page.getByRole('button', { name: /^Edit qa blue/ }).click();
  await page.getByRole('dialog').getByLabel('Title', { exact: true }).fill('QA Gallery Shot');
  await page.getByLabel('Image alt text').fill('QA gallery alt');
  await page.getByRole('dialog').getByRole('button', { name: 'Done' }).click();
  await saved();
  await publish('Publish gallery');
  let live = await pub('/gallery');
  check('F: a gallery image reaches the public page', (await live.getByText('QA Gallery Shot').count()) > 0);
  await live.close();
  await page.getByRole('button', { name: /^Edit QA Gallery Shot/ }).click();
  await page.getByRole('button', { name: 'Remove from gallery' }).click();
  await page.getByRole('dialog').last().getByRole('button', { name: 'Remove', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('[role=dialog]'));
  await page.getByRole('button', { name: /^Edit qa red/ }).click();
  await page.getByRole('button', { name: 'Remove from gallery' }).click();
  await page.getByRole('dialog').last().getByRole('button', { name: 'Remove', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('[role=dialog]'));
  await saved();
  check('F: a gallery image can be removed', (await items.count()) === before);
  await publish('Publish gallery');
  live = await pub('/gallery');
  check('F: the removed image leaves the public page', (await live.getByText('QA Gallery Shot').count()) === 0);
  await live.close();

  await pick(page, 'Filter by category', 1);
  await page.waitForTimeout(150);
  check('Gallery category filter works', (await items.count()) < before);
  await pick(page, 'Filter by category', 'All categories');
  await page.getByRole('button', { name: 'Masonry view' }).click();
  await page.getByRole('button', { name: 'Grid view' }).click();
  await page.getByRole('button', { name: /full screen$/ }).first().click();
  await page.getByRole('button', { name: 'Next image' }).click();
  await page.getByText('2 of').waitFor();
  await page.keyboard.press('Escape');
  check('Gallery views and full screen work', true);
  for (const tab of ['Categories', 'Display & filters', 'Images']) await page.getByRole('tab', { name: tab }).click();
  check('Gallery tabs work', true);
});

await section('Media library', async () => {
  await go('/media');
  await page.getByTestId('media-upload').setInputFiles(green);
  await page.getByText('1 file uploaded.').waitFor();
  check('Image upload works', (await page.getByTestId('media-qa-green.png').count()) === 1);
  await page.getByTestId('media-upload').setInputFiles(note);
  await page.getByText('is not a supported file').first().waitFor();
  check('Wrong file type is refused', true);
  await page.getByTestId('media-upload').setInputFiles(fake);
  await page.getByText('could not be read as an image').first().waitFor();
  check('A fake image is refused', true);
  await page.getByTestId('media-upload').setInputFiles(huge);
  await page.getByText(/larger than the 15 MB/).first().waitFor();
  check('An oversized file is refused', true);

  const webm = await page.evaluate(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const c = canvas.getContext('2d');
    const rec = new MediaRecorder(canvas.captureStream(10), { mimeType: 'video/webm' });
    const parts = [];
    rec.ondataavailable = (e) => parts.push(e.data);
    const done = new Promise((r) => (rec.onstop = r));
    rec.start();
    for (let i = 0; i < 8; i++) { c.fillStyle = `rgb(${i * 30},20,20)`; c.fillRect(0, 0, 32, 32); await new Promise((r) => setTimeout(r, 60)); }
    rec.stop();
    await done;
    const buf = new Uint8Array(await new Blob(parts).arrayBuffer());
    return Array.from(buf);
  });
  await page.getByTestId('media-upload').setInputFiles({ name: 'qa-clip.webm', mimeType: 'video/webm', buffer: Buffer.from(webm) });
  await page.getByTestId('media-qa-clip.webm').waitFor({ timeout: 15000 });
  check('Video upload works', true);
  await page.getByTestId('media-qa-clip.webm').click();
  check('Video preview shows', (await page.getByRole('dialog').locator('video').count()) === 1);
  await page.getByRole('button', { name: 'Close' }).click();

  await page.getByLabel('Search media').fill('qa-green');
  check('Media search works', (await page.locator('main button[data-testid^="media-"]').count()) === 1);
  await page.getByLabel('Search media').fill('');
  await pick(page, 'Filter by type', 'Videos');
  check('Media type filter works', (await page.locator('main button[data-testid^="media-"]').count()) === 1);
  await pick(page, 'Filter by type', 'All types');
  await pick(page, 'Filter by usage', 'In use');
  const used = await page.locator('main button[data-testid^="media-"]').count();
  await pick(page, 'Filter by usage', 'Any usage');
  check('Media usage filter works', used > 0 && used < (await page.locator('main button[data-testid^="media-"]').count()));

  await page.getByTestId('media-qa-green.png').click();
  await page.getByRole('dialog').getByLabel('Alt text').fill('QA green alt');
  await page.getByRole('button', { name: 'Save details' }).click();
  await page.getByText('Details saved.').waitFor();
  await page.getByTestId('media-replace').setInputFiles(blue);
  await page.getByText('File replaced everywhere it is used.').waitFor();
  check('Details save and file replace work', true);
  await page.waitForTimeout(250);
  await page.getByTestId('media-qa-green.png').click();
  check('Alt text is kept after a replace', (await page.getByRole('dialog').getByLabel('Alt text').inputValue()) === 'QA green alt');
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('dialog').last().getByRole('button', { name: 'Delete', exact: true }).click();
  await page.getByText('Deleted.').waitFor();
  await page.waitForTimeout(200);
  check('An unused file can be deleted', (await page.getByTestId('media-qa-green.png').count()) === 0);

  const inUse = page.locator('main button[data-testid^="media-"]', { hasText: /\d+ use/ }).first();
  await inUse.click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
  await page.getByText(/still used in/).first().waitFor();
  check('A file in use cannot be deleted', true);
  await page.getByRole('button', { name: 'Close' }).click();
});

await section('TEST G-H: social, contact, brand', async () => {
  await go('/social');
  await page.getByRole('button', { name: /^Instagram$/ }).click();
  await page.getByRole('dialog').getByLabel('URL', { exact: true }).fill('https://instagram.com/qa-accept');
  await page.getByRole('dialog').getByRole('button', { name: 'Done' }).click();
  await saved();
  await publish('Publish social links');
  let live = await pub('/contact');
  check('G: the social URL reaches the public site', (await live.locator('a[href="https://instagram.com/qa-accept"]').count()) > 0);
  await live.close();

  await go('/contact');
  await page.getByRole('tab', { name: 'Contact details' }).click();
  await page.getByLabel('Phone number').fill('+91 98888 77777');
  await saved();
  await publish('Publish details');
  live = await pub('/contact');
  check('H: contact details reach the public site', (await live.locator('a[href="tel:+919888877777"]').count()) === 1);
  await live.getByLabel('Full Name *').fill('QA Guest');
  await live.getByLabel('Email Address *').fill('qa@example.com');
  await live.getByLabel('Message / Journey Intentions *').fill('QA enquiry');
  await live.getByRole('button', { name: 'Send Sanctuary Enquiry' }).click();
  await live.getByText('Your Enquiry is Received').waitFor();
  await live.close();

  await go('/contact');
  const row = page.getByTestId('enquiry-row').first();
  await row.waitFor();
  await row.getByRole('button').first().click();
  check('Enquiry opens with its message', (await page.getByText('QA enquiry').count()) === 1);
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export CSV' }).click()]);
  check('Enquiry CSV downloads', download.suggestedFilename() === 'knowza-enquiries.csv');
  await page.getByRole('button', { name: /^Delete enquiry/ }).click();
  await confirmDialog('Delete');
  await page.getByText('Enquiry deleted.').waitFor();
  check('Enquiry can be deleted', true);
  for (const tab of ['Contact page', 'Enquiries']) await page.getByRole('tab', { name: tab }).click();

  await go('/brand');
  await page.getByRole('tab', { name: 'Header' }).click();
  await page.getByRole('button', { name: /^CONTACT → \/contact/ }).click();
  await page.getByLabel('Label', { exact: true }).fill('QA NAV');
  await page.getByRole('tab', { name: 'Footer' }).click();
  await page.getByRole('button', { name: 'Bottom bar' }).click();
  await page.getByLabel('Copyright').fill('QA copyright');
  await saved();
  await publish('Publish settings');
  live = await pub('/about');
  await live.locator('header').getByRole('link', { name: 'QA NAV' }).waitFor({ timeout: 8000 }).catch(() => {});
  check('Header edit is public', (await live.locator('header').getByRole('link', { name: 'QA NAV' }).count()) === 1);
  check('Footer edit is public', (await live.locator('footer').getByText('QA copyright').count()) === 1);
  await live.close();
});

await section('Notifications', async () => {
  await go('/gallery');
  await page.getByRole('button', { name: /^Hide / }).first().click();
  await saved();
  await go('');
  await page.getByRole('button', { name: /^Notifications/ }).click();
  await page.locator('.adm-pop a', { hasText: 'with unpublished changes' }).click();
  await page.waitForTimeout(250);
  check('The unpublished changes notice opens the changed area', page.url().endsWith('/admin/gallery') || /\/admin\/(pages|brand|blog)/.test(page.url()), page.url().replace(base, ''));
  await go('/gallery');
  await page.getByRole('button', { name: /^Show / }).first().click();
  await saved();
});

await section('Publishing states', async () => {
  await go('/pages/gallery');
  await page.getByRole('button', { name: 'Unpublish', exact: true }).click();
  await confirmDialog('Unpublish');
  await page.getByText('Page unpublished.').waitFor();
  let live = await pub('/gallery');
  check('An unpublished page shows the 404 page', (await live.getByText('404').count()) > 0);
  await live.close();
  await page.getByRole('button', { name: 'Re-publish' }).click();
  await confirmDialog('Publish');
  await page.getByText('Page published.').waitFor();
  live = await pub('/gallery');
  check('A re-published page returns', (await live.locator('[data-cms-section]').count()) > 0);
  await live.close();

  await go('/settings');
  const rows = page.getByTestId('revision-row');
  await rows.first().waitFor();
  check('Revisions are recorded', (await rows.count()) >= 5, `${await rows.count()}`);
  await rows.first().getByRole('button', { name: 'Restore' }).click();
  await confirmDialog('Restore to draft');
  await page.getByText('Revision restored to draft.').waitFor();
  check('A revision restores', true);
  await page.getByRole('tab', { name: 'Account & security' }).click();
  await page.getByText('Local browser storage').waitFor();
  check('Account tab shows the storage backend', true);
});

await section('Backup export and import', async () => {
  await go('/settings');
  const tab = page.getByRole('tab', { name: 'Backup' });
  check('Admin Settings has a backup tab', (await tab.count()) === 1);
  await tab.click();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download backup' }).click()]);
  const backup = path.join(work, 'backup.json');
  await download.saveAs(backup);
  const parsed = JSON.parse(fs.readFileSync(backup, 'utf8'));
  check('The backup holds the real content', parsed.format === 'knowza-cms-backup' && parsed.draft.pages.home.sections.length > 0 && parsed.published.blog.posts.some((p) => p.slug === 'qa-acceptance-post'));

  const other = await newSession();
  const swap = [ctx, page];
  ctx = other.ctx;
  page = other.page;
  await go('/settings');
  await page.getByRole('tab', { name: 'Backup' }).click();
  await page.getByTestId('backup-file').setInputFiles(note);
  await page.getByRole('dialog').getByRole('button', { name: 'Restore backup' }).click();
  await page.getByText(/not valid JSON/).waitFor();
  check('A wrong file is refused and changes nothing', true);
  await page.getByTestId('backup-file').setInputFiles(backup);
  await page.getByRole('dialog').getByRole('button', { name: 'Restore backup' }).click();
  await page.getByText('Backup restored.').waitFor();
  const live = await pub('/');
  check('An imported backup reaches the public site', (await live.getByText('QA HOME HEADING').count()) > 0 && (await live.locator('img[alt="QA hero"]').first().evaluate((i) => i.naturalWidth)) === 40);
  await live.close();
  await ctx.close();
  [ctx, page] = swap;
});

await section('Storage and damaged data', async () => {
  await go('/media');
  const stored = await page.evaluate(async () => {
    const list = await indexedDB.databases();
    const db = await new Promise((r) => { const q = indexedDB.open(list[0].name); q.onsuccess = () => r(q.result); });
    const stores = [...db.objectStoreNames];
    db.close();
    const raw = JSON.stringify(localStorage);
    return { stores, base64: raw.includes('data:image') || raw.includes('data:video'), keys: Object.keys(localStorage) };
  });
  check('Media files stay in IndexedDB, with no Base64 in localStorage', stored.stores.includes('media') && !stored.base64, stored.stores.join(', '));
  const schema = await page.evaluate(() => Object.keys(localStorage).filter((k) => /draft|published/.test(k)).map((k) => JSON.parse(localStorage[k]).schemaVersion));
  check('Stored content carries a schema version', schema.length === 2 && schema.every((v) => typeof v === 'number'), schema.join());

  for (const [name, bad] of [['invalid JSON', '{{{not json'], ['wrong content', '{"broken":true}']]) {
    const fresh = await browser.newContext();
    const p = await fresh.newPage();
    watch(p, 'damaged');
    await p.goto(base + '/');
    await p.evaluate(([keys, value]) => keys.forEach((k) => localStorage.setItem(k, value)), [stored.keys.filter((k) => /draft|published/.test(k)), bad]);
    await p.goto(base + '/');
    await p.waitForTimeout(1500);
    check(`Public site still loads with ${name} in storage`, (await p.locator('[data-cms-section]').count()) > 0);
    await p.goto(base + '/admin');
    await p.getByRole('button', { name: 'Enter admin' }).click();
    await p.getByRole('heading', { name: 'Dashboard' }).waitFor({ timeout: 8000 }).then(() => check(`Admin still loads with ${name} in storage`, true)).catch(() => check(`Admin still loads with ${name} in storage`, false));
    await fresh.close();
  }
});

await section('Application restart', async () => {
  const dir = path.join(work, 'profile');
  fs.rmSync(dir, { recursive: true, force: true });
  let persistent = await chromium.launchPersistentContext(dir, { viewport: { width: 1440, height: 900 } });
  let p = await persistent.newPage();
  await p.goto(base + '/admin');
  await p.getByRole('button', { name: 'Enter admin' }).click();
  await p.getByRole('heading', { name: 'Dashboard' }).waitFor();
  await p.goto(base + '/admin/pages/home');
  await p.getByLabel('Eyebrow', { exact: true }).fill('QA AFTER RESTART');
  await p.waitForFunction(() => document.querySelector('[data-testid=save-status]')?.textContent === 'Draft saved', null, { timeout: 15000 });
  await p.getByTestId('image-field').first().getByTestId('image-upload').setInputFiles(blue);
  await p.waitForFunction(() => document.querySelector('[data-testid=image-field] .adm-imagefield-preview img')?.naturalWidth === 30);
  await p.waitForFunction(() => document.querySelector('[data-testid=save-status]')?.textContent === 'Draft saved', null, { timeout: 15000 });
  await persistent.close();
  persistent = await chromium.launchPersistentContext(dir, { viewport: { width: 1440, height: 900 } });
  p = await persistent.newPage();
  await p.goto(base + '/admin');
  await p.getByRole('button', { name: 'Enter admin' }).click();
  await p.getByRole('heading', { name: 'Dashboard' }).waitFor();
  await p.goto(base + '/admin/pages/home');
  await p.getByTestId('section-home-hero').waitFor();
  check('I: text survives a browser restart', (await p.getByLabel('Eyebrow', { exact: true }).inputValue()) === 'QA AFTER RESTART');
  await p.waitForFunction(() => document.querySelector('[data-testid=image-field] .adm-imagefield-preview img')?.naturalWidth === 30, null, { timeout: 8000 }).then(() => check('I: uploaded image survives a browser restart', true)).catch(() => check('I: uploaded image survives a browser restart', false));
  await persistent.close();
});

await section('Roles', async () => {
  const viewer = await newSession('Viewer: read only');
  const p = viewer.page;
  const open = async (r) => { await p.goto(base + '/admin' + r); await p.locator('main').waitFor(); await p.waitForTimeout(350); };
  await open('/pages/home');
  await p.getByTestId('section-home-hero').click();
  const off = async (name, loc) => check(`Viewer: ${name} is off`, await loc.isDisabled());
  await off('text field', p.getByLabel('Eyebrow', { exact: true }));
  await off('Publish', p.getByRole('button', { name: 'Publish Home' }));
  await off('Save draft', p.getByRole('button', { name: 'Save draft' }));
  await off('Add section', p.getByRole('button', { name: 'Add', exact: true }));
  await open('/blog');
  await off('New article', p.getByRole('button', { name: 'New article' }));
  await open('/gallery');
  await off('Upload images', p.getByRole('button', { name: 'Upload images' }));
  await open('/media');
  await off('Upload files', p.getByRole('button', { name: 'Upload files' }));
  await open('/settings');
  await p.getByRole('tab', { name: 'Backup' }).click();
  await off('Download backup', p.getByRole('button', { name: 'Download backup' }));
  await off('Restore backup', p.getByRole('button', { name: 'Restore from a file' }));
  await open('/social');
  await off('Add link', p.getByRole('button', { name: 'Add link' }));
  await viewer.ctx.close();

  const editor = await newSession('Editor: edit drafts only');
  const e = editor.page;
  await e.goto(base + '/admin/blog');
  await e.getByRole('button', { name: /^Delete / }).first().click();
  await e.getByText('This article is live, so only an admin can delete it.').waitFor();
  check('Editor cannot delete a live article', (await e.getByRole('dialog').count()) === 0);
  await e.goto(base + '/admin/settings');
  await e.locator('main').waitFor();
  await e.getByRole('tab', { name: 'Backup' }).click();
  check('Editor cannot download or restore backups', await e.getByRole('button', { name: 'Download backup' }).isDisabled());
  await editor.ctx.close();
});

await section('Log out', async () => {
  await go('');
  await page.getByRole('button', { name: 'Account menu' }).click();
  await page.getByRole('button', { name: 'Log out' }).click();
  await page.getByRole('heading', { name: 'Sign in to the admin' }).waitFor();
  await page.goto(base + '/admin/pages/home');
  await page.getByRole('heading', { name: 'Sign in to the admin' }).waitFor();
  check('Log out protects admin pages', (await page.locator('main').count()) === 0);
  await page.getByRole('button', { name: 'Enter admin' }).click();
  await page.getByRole('navigation', { name: 'Admin', exact: true }).getByRole('button', { name: 'Logout' }).click();
  await page.getByRole('heading', { name: 'Sign in to the admin' }).waitFor();
  check('Sidebar Logout works', true);
  await page.getByRole('button', { name: 'Enter admin' }).click();
  await page.locator('main').waitFor();
});

await section('TEST K: phones and tablets', async () => {
  const widths = [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [425, 800], [375, 700], [320, 640]];
  const routes = ['', '/pages', '/pages/home', '/pages/about', '/sections', '/blog', '/gallery', '/media', '/social', '/brand', '/contact', '/settings'];
  const postLink = await (async () => { await go('/blog'); return page.locator('main ul li a').first().getAttribute('href'); })();
  routes.push(postLink.replace('/admin', ''));
  const bad = [];
  for (const [w, h] of widths) {
    await page.setViewportSize({ width: w, height: h });
    for (const route of routes) {
      await page.goto(base + '/admin' + route);
      await page.locator('main').waitFor();
      await page.waitForTimeout(200);
      const over = await page.evaluate(() => { const m = document.querySelector('main'); return Math.max(document.documentElement.scrollWidth - innerWidth, m.scrollWidth - m.clientWidth); });
      if (over > 1) bad.push(`${w} ${route} +${over}px`);
    }
  }
  check('Admin: no sideways scrolling at any of 7 widths', bad.length === 0, bad.slice(0, 6).join(', '));

  const pubBad = [];
  for (const [w, h] of widths) {
    await page.setViewportSize({ width: w, height: h });
    for (const route of ['/', '/about', '/gallery', '/blog', '/blog/reconnecting-with-nature', '/contact', '/no-such-page']) {
      await page.goto(base + route);
      await page.waitForTimeout(700);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (over > 1) pubBad.push(`${w} ${route} +${over}px`);
    }
  }
  check('Public site: no sideways scrolling at any of 7 widths', pubBad.length === 0, pubBad.slice(0, 6).join(', '));

  await page.setViewportSize({ width: 375, height: 700 });
  await go('/pages/home');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('link', { name: 'Gallery', exact: true }).click();
  await page.getByRole('heading', { name: 'Gallery' }).first().waitFor();
  await page.waitForTimeout(300);
  check('Mobile menu navigates and closes', (await page.getByRole('button', { name: 'Close menu' }).count()) === 0);
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Close menu' }).click();
  await page.waitForTimeout(300);
  const modalBad = [];
  for (const w of [320, 375, 425]) {
    await page.setViewportSize({ width: w, height: 640 });
    await go('/gallery');
    await page.getByRole('button', { name: /^Edit / }).first().click();
    await page.waitForTimeout(300);
    const box = await page.getByRole('dialog').boundingBox();
    if (box.x < 0 || box.x + box.width > w + 1 || box.height > 640) modalBad.push(`${w}: ${JSON.stringify(box)}`);
    const inner = await page.getByRole('dialog').evaluate((d) => d.querySelector('.adm-scroll').scrollWidth - d.querySelector('.adm-scroll').clientWidth);
    if (inner > 1) modalBad.push(`${w}: inner +${inner}`);
    await page.keyboard.press('Escape');
  }
  check('Popups fit on phones', modalBad.length === 0, modalBad.join(' '));
  await page.setViewportSize({ width: 1440, height: 900 });
});

await section('Public website behaviour', async () => {
  const fresh = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await fresh.newPage();
  watch(p, 'public fresh');
  for (const [route, want] of [['/', 'home-hero'], ['/about', null], ['/gallery', null], ['/blog', null], ['/contact', null]]) {
    await p.goto(base + route);
    await p.waitForTimeout(1200);
    check(`${route} renders its sections`, (await p.locator('[data-cms-section]').count()) > 0);
  }
  await p.goto(base + '/hospitality');
  await p.waitForTimeout(800);
  check('Old links redirect', p.url().includes('/about?tab=hospitality'));
  await p.goto(base + '/no-such-page');
  await p.waitForTimeout(800);
  check('Unknown URLs show the 404 page', (await p.getByText('404').count()) > 0);
  await p.goto(base + '/');
  await p.waitForTimeout(1500);
  const broken = await p.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 1500));
    return [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src'));
  });
  check('Home page has no broken images', broken.length === 0, broken.slice(0, 3).join(', '));
  const anim = await p.evaluate(() => ({ lenis: document.documentElement.className.includes('lenis'), gsap: [...document.querySelectorAll('*')].some((e) => e.style && e.style.transform) }));
  check('Smooth scrolling and animations are active', anim.lenis && anim.gsap, JSON.stringify(anim));
  await fresh.close();
});

check('No console errors, warnings or missing files', problems.length === 0, [...new Set(problems)].slice(0, 6).join(' | '));
await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
failed.forEach((f) => console.log(`FAILED: ${f.name}${f.note ? ` (${f.note})` : ''}`));
process.exit(failed.length ? 1 : 0);
