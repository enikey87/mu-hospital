const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.SITE_URL || 'http://127.0.0.1:5188/mu-hospital/';

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined, args: ['--no-sandbox'] });
  const report = [];
  try {
    for (const width of [1440, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const errors = [], failedResources = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', response => {
        if (/\/(assets|images|fonts)\//.test(response.url()) && response.status() >= 400) failedResources.push(response.url());
      });
      await page.goto(base + '?ref=check#/urinatech', { waitUntil: 'networkidle' });
      await page.locator('.ut h1').waitFor();
      const images = page.locator('.hero-photo, .product-card__photo img');
      assert.equal(await images.count(), 3);
      for (const img of await images.all()) {
        await img.scrollIntoViewIfNeeded(); await img.evaluate(n => n.decode());
        assert.ok((await img.getAttribute('src')).startsWith(new URL('images/', base).pathname));
      }
      const missing = new URL('missing?ref=check', base).href;
      if (process.env.MOCK_PAGES_404 === '1') await page.route(missing, route => route.fulfill({ status: 404, contentType: 'text/html', body: fs.readFileSync('public/404.html', 'utf8') }));
      await page.goto(missing + '#detail', { waitUntil: 'networkidle' });
      await page.waitForURL(url => url.pathname === new URL(base).pathname && !url.hash);
      await page.getByRole('heading', { name: 'Страница не найдена', exact: true }).waitFor();
      assert.equal(await page.evaluate(() => sessionStorage.getItem('ut-redirect')), null);
      await page.getByRole('button', { name: 'Вернуться на главную', exact: true }).click();
      await page.locator('.sol h1').waitFor();
      assert.equal(new URL(page.url()).pathname, new URL(base).pathname);
      await page.reload({ waitUntil: 'networkidle' });
      await page.locator('.sol h1').waitFor();
      await page.locator('.sol-nav a[href="#/solnyshko/station"]').click();
      await page.locator('.sol-detail__hero a[href="#/urinatech"]').click();
      await page.locator('.ut h1').waitFor();
      assert.equal(new URL(page.url()).pathname, new URL(base).pathname);
      assert.deepEqual(errors, []);
      assert.deepEqual(failedResources, []);
      report.push({ width, base, state: 'assets-physical404-return-reload-subsite', errors, failedResources, mockPages404: process.env.MOCK_PAGES_404 === '1' });
      await page.close();
      console.log('PASS', width);
    }
    fs.writeFileSync(process.env.REPORT_PATH || '/tmp/mu-hospital-hosting-browser.json', JSON.stringify(report, null, 2) + '\n');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
