const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.SITE_URL || 'http://127.0.0.1:5188/urinatech/';

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined, args: ['--no-sandbox'] });
  const report = [];
  try {
    for (const width of [1440, 768, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      const layout = async state => {
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, state);
        report.push({ width, state });
      };
      await page.goto(base + '#/urinatech', { waitUntil: 'networkidle' });
      assert.equal(await page.locator('.cookie-banner').count(), 0);
      const glass = page.locator('.product-card').filter({ has: page.getByRole('heading', { name: 'УТ-С1 «Стакан 2.0»', exact: true }) });
      await glass.getByRole('button').click();
      const item = page.locator('.cart-item').first();
      const plus = item.getByRole('button', { name: '+', exact: true });
      const minus = item.getByRole('button', { name: '−', exact: true });
      const total = async value => assert.equal((await page.locator('.cart-total span').last().innerText()).replace(/\s/g, ''), value + '₽');
      for (let n = 1; n < 9; n++) await plus.click();
      await total(900);
      await plus.click(); await total(500);
      await plus.click(); await total(550);
      await minus.click(); await minus.click(); await total(900);
      await layout('cart-boundaries');
      await page.getByRole('button', { name: 'Закрыть', exact: true }).click();
      await page.locator('.product-card').filter({ has: page.getByRole('heading', { name: 'УТ-01 «Утренний»', exact: true }) }).getByRole('button').click();
      await total(1200); await plus.click(); await total(800);
      await page.getByRole('button', { name: 'Сформировать спецификацию', exact: true }).click();
      assert.match(await page.locator('.cart-order').innerText(), /Сумма: 800 ₽/);
      await layout('specification');
      await page.locator('.cart-order button').click();
      const age = page.getByLabel('Возраст, лет');
      assert.match(await page.locator('.calc-result').innerText(), /63 л/);
      assert.match(await page.locator('.calc-result').innerText(), /70 л/);
      await age.fill('17'); assert.equal(await page.locator('.calc-result__row').count(), 0);
      await age.fill('18'); assert.equal(await page.locator('.calc-result__row').count(), 5);
      await age.fill(''); assert.equal(await page.locator('.calc-result__row').count(), 0);
      await layout('calculator-invalid');
      await age.fill('18');
      const donor = page.locator('.donor-form');
      assert.equal(await donor.getByRole('button').isDisabled(), true);
      await page.getByLabel('Имя донора').fill('Иван Проверочный');
      await page.getByLabel('Регион сбора').fill('Кимры');
      await page.getByLabel('Рацион за последние 24 часа', { exact: true }).fill('Зерно');
      await donor.getByRole('button').click();
      assert.equal(await donor.locator('input:disabled').count(), 3);
      await page.locator('.donor-ticket').waitFor();
      assert.match(await page.locator('#donor').innerText(), /Карточка донора готова/);
      assert.doesNotMatch(await page.locator('#donor').innerText(), /зарегистрирован/i);
      await layout('donor-card');
      await page.getByRole('button', { name: 'Составить новую карточку' }).click();
      assert.equal(await page.getByLabel('Имя донора').inputValue(), '');
      const batch = page.getByPlaceholder('Номер партии, напр. УТ-2002-0417');
      for (const code of ['УТ-2002-0417', 'УТ-2003-0004', 'УТ-2024-0001', 'УТ-2026-9999', 'bad']) {
        await batch.fill(code);
        await page.locator('.detector-form button').click();
        await page.waitForFunction(() => !document.querySelector('.verdict--checking'));
        const verdict = await page.locator('.verdict').innerText();
        assert.match(verdict, code === 'bad' ? /Некорректный ввод/ : code === 'УТ-2026-9999' ? /Запись в реестре отсутствует/ : /Партия внесена в реестр/);
        assert.doesNotMatch(verdict, /Чистота|подделка/i);
      }
      await layout('archive');
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.locator('.donor-form').count(), 1);
      await page.locator('.header .topbar a').first().click();
      await page.getByRole('heading', { level: 1, name: /Пансионат/ }).waitFor();
      await page.locator('.sol-form input').fill('Иван Проверочный');
      await page.locator('.sol-form button').click();
      await page.locator('.sol-voucher').waitFor();
      assert.match(await page.locator('.sol-voucher').innerText(), /Бланк сформирован/);
      assert.doesNotMatch(await page.locator('.sol-voucher').innerText(), /зарегистрирован/i);
      await layout('voucher-blank');
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.locator('.sol-form input').inputValue(), '');
      assert.deepEqual(errors, []);
      report.push({ width, state: 'console', errors });
      await page.close();
      console.log('PASS', width);
    }
    fs.writeFileSync(process.env.REPORT_PATH || '/tmp/urinatech-content-revision-browser.json', JSON.stringify(report, null, 2) + '\n');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
