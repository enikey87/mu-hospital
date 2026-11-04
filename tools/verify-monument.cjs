const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.SITE_URL || 'http://127.0.0.1:5188/urinatech/';

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined, args: ['--no-sandbox'] });
  const report = [];
  const luminance = color => {
    const rgb = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  };
  const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
  try {
    for (const width of [1440, 768, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(base + '#/urinatech', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.ut').count(), 1);
      const font = await page.evaluate(() => ({
        family: getComputedStyle(document.querySelector('.ut h1')).fontFamily,
        loaded: [...document.fonts].some(f => f.family.replaceAll('"', '') === 'Oswald UT' && f.status === 'loaded'),
        accent: getComputedStyle(document.querySelector('.ut')).getPropertyValue('--accent').trim(),
      }));
      assert.ok(font.family.includes('Oswald UT'));
      assert.equal(font.loaded, true);
      assert.equal(font.accent, '#c73522');
      const layout = async state => {
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, state);
        const nodes = page.locator('.ut main *, .ut .header__inner, .ut .footer__col');
        assert.ok(await nodes.count());
        const overflow = await nodes.evaluateAll(nodes => nodes.filter(n => {
          const r = n.getBoundingClientRect();
          return r.width && (r.left < -1 || r.right > innerWidth + 1);
        }).map(n => [n.tagName, n.className]));
        assert.deepEqual(overflow, [], state);
        const headings = await page.locator('.ut h1, .ut h2, .ut h3').evaluateAll(nodes => nodes.filter(n => n.scrollWidth > n.clientWidth + 1).map(n => n.textContent));
        assert.deepEqual(headings, [], state);
        report.push({ width, state });
      };
      const hero = page.locator('.hero');
      assert.equal(await page.locator('.industrial-facts > div').count(), 4);
      const heroStyle = await hero.evaluate(n => ({ background: getComputedStyle(n).backgroundColor, color: getComputedStyle(n).color }));
      assert.ok(contrast(heroStyle.color, heroStyle.background) >= 7);
      const button = page.locator('.hero-actions .btn-primary');
      const buttonStyle = await button.evaluate(n => ({ background: getComputedStyle(n).backgroundColor, color: getComputedStyle(n).color }));
      assert.ok(contrast(buttonStyle.color, buttonStyle.background) >= 4.5);
      await button.focus();
      assert.equal(await button.evaluate(n => getComputedStyle(n).outlineStyle), 'solid');
      await layout('manufacturer-hero');
      if (process.env.CAPTURE_DIR) await page.screenshot({ path: `${process.env.CAPTURE_DIR}/hero-${width}.png` });
      await button.click();
      assert.equal(await page.locator('.product-card').count(), 7);
      const photos = page.locator('.product-card__photo img');
      assert.equal(await photos.count(), 2);
      for (const img of await photos.all()) {
        await img.scrollIntoViewIfNeeded(); await img.evaluate(n => n.decode());
        assert.deepEqual(await img.evaluate(n => [n.naturalWidth, n.naturalHeight]), [1199, 1312]);
      }
      await layout('catalog');
      if (process.env.CAPTURE_DIR) {
        await page.locator('#products').scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${process.env.CAPTURE_DIR}/catalog-${width}.png` });
      }
      for (const id of ['calculator', 'pricing', 'instructions', 'reviews', 'detector', 'donor', 'licenses', 'faq']) {
        await page.locator('#' + id).scrollIntoViewIfNeeded();
        assert.ok(await page.locator('#' + id).innerText());
        await layout(id);
      }
      const calcColor = await page.locator('.calc-result__row strong').first().evaluate(n => getComputedStyle(n).color);
      assert.ok(contrast(calcColor, 'rgb(27, 29, 28)') >= 4.5);
      const soldOut = page.locator('.product-card').filter({ has: page.getByRole('heading', { name: 'УТ-К «II Сан»', exact: true }) });
      assert.equal(await soldOut.getByRole('button').isDisabled(), true);
      await page.locator('.product-card').first().getByRole('button').click();
      await page.locator('.cart-drawer').waitFor();
      await page.waitForFunction(() => { const r = document.querySelector('.cart-drawer')?.getBoundingClientRect(); return r && r.left >= 0 && r.right <= innerWidth + 1; });
      const drawer = await page.locator('.cart-drawer').boundingBox();
      assert.ok(drawer.x >= 0 && drawer.x + drawer.width <= width + 1);
      await page.locator('.cart-close').click();
      for (const summary of await page.locator('#faq summary').all()) await summary.click();
      await layout('faq-open');
      await page.locator('.topbar a[href="#/"]').click();
      await page.locator('.sol h1').waitFor();
      const resort = await page.locator('.sol').evaluate(n => ({ accent: getComputedStyle(n).getPropertyValue('--accent').trim(), font: getComputedStyle(n.querySelector('h1')).fontFamily }));
      assert.equal(resort.accent, '#003cdb');
      assert.ok(!resort.font.includes('Oswald'));
      await page.locator('.sol-nav a[href="#/solnyshko/station"]').click();
      await page.locator('.sol-detail__hero a[href="#/urinatech"]').click();
      await page.locator('.ut').waitFor();
      assert.deepEqual(errors, []);
      report.push({ width, state: 'theme-boundary-and-console', font, resort, errors });
      await page.close();
      console.log('PASS', width);
    }
    fs.writeFileSync(process.env.REPORT_PATH || '/tmp/urinatech-monument-browser.json', JSON.stringify(report, null, 2) + '\n');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
