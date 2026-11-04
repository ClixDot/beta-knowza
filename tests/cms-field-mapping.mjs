// Fills every text field of every section with a unique marker, then checks the marker reaches the public page.
// Run against a local-mode server (VITE_CMS_BACKEND=local). usage: node cms-field-mapping.mjs <baseUrl>
import { chromium } from 'playwright';

const [base] = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.setDefaultTimeout(20000);

await page.goto(base + '/admin');
await page.getByRole('button', { name: 'Enter admin' }).click();
await page.getByRole('heading', { name: 'Dashboard' }).waitFor();

const saved = () => page.waitForFunction(() => document.querySelector('[data-testid=save-status]')?.textContent === 'Draft saved', null, { timeout: 20000 });

const expandAll = async (scope) => {
  for (let i = 0; i < 300; i++) {
    const closed = page.locator(`${scope} button[aria-expanded=false]:not([disabled])`);
    if (!(await closed.count())) return;
    await closed.first().click();
  }
};

/** Writes a marker into each plain text field. URLs, colours and alt text are left alone. */
const fillMarkers = async (scope, prefix) => {
  const fields = page.locator(`${scope} input[type=text], ${scope} textarea`);
  const count = await fields.count();
  const written = [];
  for (let i = 0; i < count; i++) {
    const field = fields.nth(i);
    const info = await field.evaluate((el) => ({
      placeholder: el.getAttribute('placeholder') ?? '',
      label: el.closest('div')?.parentElement?.querySelector('label')?.textContent ?? el.getAttribute('aria-label') ?? '',
      value: el.value,
    }));
    if (info.placeholder.startsWith('/about') || info.placeholder === 'Original' || info.label === 'Section name in the admin') continue;
    const marker = `${prefix}m${i}z`;
    await field.fill(marker);
    written.push({ marker, label: info.label, original: info.value });
  }
  return written;
};

const textOf = async (p) =>
  (await p.evaluate(() => `${document.body.innerText}\n${document.documentElement.innerHTML.replace(/<[^>]+>/g, '')}\n${document.documentElement.innerHTML}`)).replace(/\s+/g, '').toLowerCase();

const missing = [];
let total = 0;

const pages = { home: '/', about: '/about', gallery: '/gallery', blog: '/blog', contact: '/contact' };
for (const [pageId, publicPath] of Object.entries(pages)) {
  await page.goto(`${base}/admin/pages/${pageId}`);
  const rows = page.locator('[data-testid^=section-]');
  await rows.first().waitFor();
  const ids = await rows.evaluateAll((els) => els.map((el) => el.dataset.testid.replace('section-', '')));
  for (const id of ids) {
    await page.getByTestId(`section-${id}`).click();
    await page.waitForTimeout(150);
    await expandAll('main fieldset');
    const written = await fillMarkers('main fieldset', id.replace(/\W/g, '').toLowerCase());
    if (!written.length) continue;
    await saved();
    const preview = await ctx.newPage();
    await preview.goto(`${base}${publicPath}?cmsPreview=draft&cmsSection=${id}`);
    await preview.waitForTimeout(1600);
    const text = await textOf(preview);
    await preview.close();
    const lost = written.filter((w) => !text.includes(w.marker.toLowerCase()));
    total += written.length;
    lost.forEach((w) => missing.push(`${pageId} › ${id} › ${w.label} (was: ${w.original.slice(0, 40)})`));
    console.log(`${pageId}/${id}: ${written.length - lost.length}/${written.length}`);
  }
}

for (const tab of ['Brand', 'Header', 'Footer']) {
  await page.goto(`${base}/admin/brand`);
  await page.getByRole('tab', { name: tab }).click();
  await page.waitForTimeout(150);
  await expandAll('main fieldset');
  const written = await fillMarkers('main fieldset', `global${tab.toLowerCase()}`);
  await saved();
  const preview = await ctx.newPage();
  await preview.goto(`${base}/?cmsPreview=draft`);
  await preview.waitForTimeout(1600);
  const text = await textOf(preview);
  await preview.close();
  const lost = written.filter((w) => !text.includes(w.marker.toLowerCase()));
  total += written.length;
  lost.forEach((w) => missing.push(`brand/${tab} › ${w.label} (was: ${w.original.slice(0, 40)})`));
  console.log(`brand/${tab}: ${written.length - lost.length}/${written.length}`);
}

console.log(`\n${total - missing.length}/${total} fields reached the page`);
missing.forEach((m) => console.log('NOT FOUND  ' + m));
await browser.close();
