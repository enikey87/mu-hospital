const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.SITE_URL || 'http://127.0.0.1:5188/urinatech/';
const programs = [
  ['station', 'Стационарная уринотерапия', 'morning'],
  ['enemas', 'Клизмотроника™', 'enema'],
  ['kalofores', 'Калофорез®', 'kalofores'],
  ['roots', 'Комплекс «Исконный»', 'roots'],
];
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined, headless: true, args: ['--no-sandbox'] });
  const report = [];
  try {
    for (const width of [1440, 768, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const layout = async state => {
        const actual = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
        assert.equal(actual.scrollWidth, width, state);
        const overflow = await page.locator('main *').evaluateAll(nodes => nodes.filter(node => {
          const r = node.getBoundingClientRect();
          return r.width && (r.left < -1 || r.right > innerWidth + 1);
        }).map(node => [node.tagName, node.className]));
        assert.deepEqual(overflow, [], state);
        report.push({ state, ...actual });
      };
      await page.goto(base, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('.sol-services article').count(), 4);
      await layout('resort-home');
      for (const [id, title, booking] of programs) {
        await page.locator(`.sol-services a.sol-btn[href="#/solnyshko/${id}"]`).click();
        await page.waitForURL(url => url.hash === `#/solnyshko/${id}`);
        await page.getByRole('heading', { level: 1, name: title, exact: true }).waitFor();
        assert.equal(await page.locator('h1').count(), 1);
        assert.equal(await page.locator('h1').innerText(), title);
        assert.ok((await page.title()).startsWith(title));
        await page.locator('.sol-detail__hero img').evaluate(i => i.decode());
        assert.equal(await page.locator('.sol-detail__hero img').evaluate(i => i.naturalWidth), 1536);
        assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).includes('18+'));
        await page.reload({ waitUntil: 'networkidle' });
        assert.equal(await page.locator('h1').innerText(), title);
        await layout(id);
        if (process.env.CAPTURE_DIR && (width === 1440 || width === 390)) {
          await page.screenshot({ path: `${process.env.CAPTURE_DIR}/${id}-${width}.png` });
        }
        await page.locator('.sol-nav a').filter({ hasText: 'Проживание' }).click();
        await page.waitForFunction(() => {
          const r = document.getElementById('sol-rooms')?.getBoundingClientRect();
          return r && r.top >= 0 && r.top < 300;
        });
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await page.locator('.sol-nav a').filter({ hasText: 'Проживание' }).click();
        await page.waitForFunction(() => {
          const r = document.getElementById('sol-rooms')?.getBoundingClientRect();
          return r && r.top >= 0 && r.top < 300;
        });
        await page.goBack();
        await page.waitForURL(url => url.hash === `#/solnyshko/${id}`);
        await page.getByRole('heading', { level: 1, name: title, exact: true }).waitFor();
        assert.equal(await page.locator('h1').innerText(), title);
        await page.locator('.sol-detail__hero button').click();
        await page.waitForURL(url => url.hash.includes('section=sol-booking'));
        assert.equal(await page.locator('.sol-form select').first().inputValue(), booking);
        assert.equal(await page.locator('.sol-form select').count(), id === 'kalofores' ? 2 : 1);
        await page.locator('.sol-form input').fill('Проверка направления');
        await page.locator('.sol-form button').click();
        await page.locator('.sol-voucher').waitFor();
        assert.match(await page.locator('.sol-voucher').innerText(), /Зарегистрировано/i);
        await layout('booking-' + id);
        await page.locator('.sol-voucher button').click();
        await page.locator('.sol-header__brand').click();
        await page.waitForURL(url => url.hash === '#/');
      }
      if (width === 1440 || width === 390) {
        for (const [method, duration, expected, target] of [
          [0, 0, 'kalofores', 'kalofores'], [1, 0, 'enema', 'enemas'], [3, 0, 'roots', 'roots'],
          [2, 0, 'morning', 'station'], [2, 1, 'safety', 'station'], [2, 2, 'second', 'station'], [2, 3, 'complex', null],
        ]) {
          await page.locator('.sol-quiz__option').nth(0).click();
          await page.locator('.sol-quiz__option').nth(method).click();
          await page.locator('.sol-quiz__option').nth(duration).click();
          const link = page.locator('.sol-quiz__actions a');
          assert.equal(await link.getAttribute('href'), target ? `#/solnyshko/${target}` : '#/?section=sol-services');
          await page.getByRole('button', { name: 'Записаться на эту программу', exact: true }).click();
          assert.equal(await page.locator('.sol-form select').first().inputValue(), expected);
          await page.getByRole('button', { name: 'Заполнить повторно', exact: true }).click();
        }
        await layout('quiz-all-results');
      }
      await page.goto(base + '#/solnyshko/missing');
      await page.getByRole('heading', { name: 'Страница не найдена' }).waitFor();
      await page.getByRole('button', { name: 'Вернуться на главную' }).click();
      await page.waitForFunction(() => document.querySelector('h1')?.textContent.includes('Здоровье'));
      assert.deepEqual(errors, []);
      report.push({ state: 'console', width, errors });
      console.log('PASS', width);
      await page.close();
    }
    fs.writeFileSync(process.env.REPORT_PATH || '/tmp/urinatech-sol-programs-browser.json', JSON.stringify(report, null, 2) + '\n');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
