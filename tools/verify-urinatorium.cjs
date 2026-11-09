const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.SITE_URL || 'http://127.0.0.1:5188/mu-hospital/';
const digits = value => value.replace(/\D/g, '');

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined, args: ['--no-sandbox'] });
  const report = [];
  try {
    for (const width of [1440, 1280, 1200, 768, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const errors = [], failedResources = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => { if (/\/(assets|images|fonts)\//.test(r.url()) && r.status() >= 400) failedResources.push(r.url()); });
      const layout = async state => {
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, state);
        const nodes = page.locator('main h1, main h2, main h3, main h4, .urinatorium, .urinatorium-source > div, .urinatorium-device > *, .urinatorium-refill > div, .header__inner, .nav');
        assert.ok(await nodes.count());
        const overflow = await nodes.evaluateAll(nodes => nodes.filter(n => { const r = n.getBoundingClientRect(); return r.width && (r.left < -1 || r.right > innerWidth + 1 || n.scrollWidth > n.clientWidth + 1); }).map(n => [n.tagName, n.className]));
        assert.deepEqual(overflow, [], state);
      };
      const sectionVisible = () => page.waitForFunction(() => { const r = document.getElementById('urinatorium')?.getBoundingClientRect(); return r && r.top >= 0 && r.top < 200; });
      const menu = async section => {
        const burger = page.getByRole('button', { name: 'Открыть меню', exact: true });
        const mobile = await burger.isVisible();
        if (mobile) await burger.click();
        await page.locator(`${mobile ? '.mobile-nav' : '.nav'} a[href="#/urinatech?section=${section}"]`).click();
        if (mobile) assert.equal(await burger.getAttribute('aria-expanded'), 'false');
      };
      await page.goto(base + '#/urinatech', { waitUntil: 'networkidle' });
      assert.match(await page.locator('h1').innerText(), /Первый\s+уринаторий\s+в России/i);
      assert.match(await page.title(), /первый уринаторий/);
      await layout('manufacturer-hero');
      await page.locator('.hero a[href="#/urinatech?section=urinatorium"]').click();
      await sectionVisible();
      assert.equal(await page.locator('.urinatorium-feature').count(), 5);
      const photos = page.locator('img[src$="/images/solnyshko-u.webp"]');
      assert.equal(await photos.count(), 2);
      for (const photo of await photos.all()) {
        await photo.scrollIntoViewIfNeeded(); await photo.evaluate(n => n.decode());
        assert.deepEqual(await photo.evaluate(n => [n.naturalWidth, n.naturalHeight]), [1254, 1254]);
        assert.equal(await photo.getAttribute('src'), new URL('images/solnyshko-u.webp', base).pathname);
      }
      await layout('urinatorium-and-catalog');
      const deviceButton = page.getByRole('button', { name: 'Включить аппарат в спецификацию', exact: true });
      await deviceButton.click();
      assert.equal(digits(await page.locator('.cart-total').innerText()), '24920');
      await page.locator('.cart-close').click();
      await page.getByRole('button', { name: 'Добавить кассету', exact: true }).click();
      assert.equal(digits(await page.locator('.cart-total').innerText()), '26166');
      await page.locator('.cart-close').click();
      await menu('products');
      const card = name => page.locator('.product-card').filter({ has: page.getByRole('heading', { name, exact: true, level: 3 }) });
      await card('Изолят отборной мочи').getByRole('button', { name: 'В спецификацию', exact: true }).click();
      assert.equal(await page.locator('.cart-item').count(), 2);
      assert.equal(digits(await page.locator('.cart-total').innerText()), '27412');
      await page.locator('.cart-close').click();
      await card('Солнышко-У').getByRole('button', { name: 'В спецификацию', exact: true }).click();
      assert.equal(await page.locator('.cart-item').count(), 2);
      assert.equal(digits(await page.locator('.cart-total').innerText()), '52332');
      await page.locator('.cart-item').filter({ hasText: 'Солнышко-У' }).getByRole('button', { name: '−', exact: true }).click();
      await page.locator('.cart-item').filter({ hasText: 'Изолят отборной мочи' }).getByRole('button', { name: '−', exact: true }).click();
      assert.equal(digits(await page.locator('.cart-total').innerText()), '26166');
      await page.getByRole('button', { name: 'Сформировать спецификацию', exact: true }).click();
      await page.getByText('Спецификация сформирована', { exact: true }).waitFor();
      await page.locator('.cart-order').getByRole('button', { name: 'Закрыть', exact: true }).click();
      await deviceButton.click();
      assert.equal(await page.locator('.cart-item .qty').innerText(), '1');
      await page.locator('.cart-item').getByRole('button', { name: '−', exact: true }).click();
      await page.getByText('Корзина пуста.', { exact: false }).waitFor();
      await page.locator('.cart-close').click();
      await menu('urinatorium'); await sectionVisible();
      await page.reload({ waitUntil: 'networkidle' }); await sectionVisible();
      await menu('ug9'); await page.goBack({ waitUntil: 'networkidle' }); await sectionVisible();
      await page.goto(base + '#urinatorium', { waitUntil: 'networkidle' }); await sectionVisible();
      await page.locator('.topbar a[href="#/"]').click(); await page.locator('.sol h1').waitFor();
      assert.equal(await page.locator('#urinatorium').count(), 0);
      assert.equal(await page.locator('.sol').evaluate(n => getComputedStyle(n).getPropertyValue('--accent').trim()), '#003cdb');
      await page.locator('.sol-nav a[href="#/solnyshko/station"]').click();
      await page.locator('.sol-detail__hero a[href="#/urinatech"]').click();
      await page.locator('.ut h1').waitFor(); await layout('return-to-manufacturer');
      assert.deepEqual(errors, []); assert.deepEqual(failedResources, []);
      report.push({ width, base, states: ['hero-menu-direct-legacy-history', 'photo-and-catalog', 'mixed-basket-quantity-complete-restart-empty', 'resort-theme'], errors, failedResources });
      await page.close(); console.log('PASS', width);
    }
    fs.writeFileSync(process.env.REPORT_PATH || '/tmp/mu-urinatorium-browser.json', JSON.stringify(report, null, 2) + '\n');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
