const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.SITE_URL || 'http://127.0.0.1:5188/urinatech/';
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined, headless: true, args: ['--no-sandbox'] });
  const report = [];
  try {
    for (const width of [1440, 768, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      const layout = async state => {
        const dimensions = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
        assert.equal(dimensions.scrollWidth, width, state);
        const nodes = page.locator('main *, .sol-header__brand, .sol-header__actions, .sol-nav, .header__inner, .topbar');
        assert.ok(await nodes.count());
        const overflow = await nodes.evaluateAll(nodes => nodes.filter(n => { const r = n.getBoundingClientRect(); return r.width && (r.left < -1 || r.right > innerWidth + 1); }).map(n => [n.tagName, n.className]));
        assert.deepEqual(overflow, [], state);
        report.push({ state, ...dimensions });
      };
      const heading = text => page.getByRole('heading', { level: 1, name: text }).waitFor();
      const sectionVisible = id => page.waitForFunction(id => { const r = document.getElementById(id)?.getBoundingClientRect(); return r && r.top >= 0 && r.top < innerHeight - 80; }, id);
      const menu = async section => {
        const burger = page.getByRole('button', { name: 'Открыть меню', exact: true });
        const mobile = await burger.isVisible();
        if (mobile) await burger.click();
        await page.locator(`${mobile ? '.mobile-nav' : '.nav'} a[href="#/urinatech?section=${section}"]`).click();
        if (mobile) assert.equal(await page.getByRole('button', { name: 'Открыть меню', exact: true }).getAttribute('aria-expanded'), 'false');
      };
      await page.goto(base, { waitUntil: 'networkidle' });
      await heading(/Здоровье/);
      assert.match(await page.title(), /^Пансионат «Солнышко»/);
      assert.equal(await page.locator('a[href^="#/urinatech"]').count(), 0);
      await page.reload({ waitUntil: 'networkidle' });
      await heading(/Здоровье/);
      await layout('landing');
      await page.locator('.sol-nav a[href="#/solnyshko/station"]').click();
      await heading('Стационарная уринотерапия');
      assert.equal(await page.locator('.sol-supplier a').count(), 2);
      await layout('urinotherapy');
      await page.locator('.sol-supplier a[href="#/urinatech"]').click();
      await heading(/Производство/);
      assert.match(await page.title(), /^УринаТех/);
      const cookie = page.getByRole('button', { name: 'Понятно', exact: true });
      if (await cookie.count()) await cookie.click();
      await layout('manufacturer');
      await menu('products');
      await sectionVisible('products');
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await menu('products');
      await sectionVisible('products');
      await page.reload({ waitUntil: 'networkidle' });
      await sectionVisible('products');
      await page.locator('.product-card button:enabled').first().click();
      await page.locator('.cart-drawer').waitFor();
      await page.getByRole('button', { name: 'Сформировать спецификацию', exact: true }).click();
      await page.getByText('Спецификация сформирована', { exact: true }).waitFor();
      await page.getByRole('button', { name: 'Закрыть', exact: true }).last().click();
      await menu('company');
      await sectionVisible('company');
      assert.match(await page.locator('#company').innerText(), /Московский Институт Обогащения Урины/);
      await page.locator('.topbar a[href="#/solnyshko/station"]').click();
      await heading('Стационарная уринотерапия');
      await page.goBack();
      await heading(/Производство/);
      await page.locator('.topbar a[href="#/"]').click();
      await heading(/Здоровье/);
      await page.locator('.sol-header__actions button').click();
      await sectionVisible('sol-booking');
      for (const hash of ['#products', '#company', '#/urinatech?section=products']) {
        await page.goto(base + hash, { waitUntil: 'networkidle' });
        await heading(/Производство/);
        await sectionVisible(hash.includes('company') ? 'company' : 'products');
      }
      await page.goto(base + '#/solnyshko', { waitUntil: 'networkidle' });
      await heading(/Здоровье/);
      await page.goto(base + '#/missing', { waitUntil: 'networkidle' });
      await heading('Страница не найдена');
      await page.getByRole('button', { name: 'Вернуться на главную', exact: true }).click();
      await heading(/Здоровье/);
      assert.deepEqual(errors, []);
      report.push({ state: 'navigation-legacy-cart-404', width, errors });
      await page.close();
      console.log('PASS', width);
    }
    fs.writeFileSync(process.env.REPORT_PATH || '/tmp/urinatech-site-hierarchy.json', JSON.stringify(report, null, 2) + '\n');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
