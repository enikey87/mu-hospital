const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.SITE_URL || 'http://127.0.0.1:5188/urinatech/';

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN || undefined,
    headless: true,
    args: ['--no-sandbox'],
  });
  const report = [];
  try {
    const fallback = await browser.newPage();
    await fallback.route('**/avatars/kovalchuk-review.webp', route => route.abort());
    await fallback.goto(baseURL);
    const failedPortrait = fallback.locator('.review-portrait').first();
    await failedPortrait.scrollIntoViewIfNeeded();
    await fallback.waitForFunction(() => document.querySelector('.review-portrait span'), null, { timeout: 5000 });
    assert.equal(await failedPortrait.innerText(), 'КМ');
    assert.equal(await failedPortrait.locator('img').count(), 0);
    report.push({ state: 'broken-image-fallback', initials: 'КМ' });
    await fallback.close();

    for (const width of [1440, 768, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(baseURL, { waitUntil: 'networkidle' });
      const cookie = page.getByRole('button', { name: 'Понятно', exact: true });
      if (await cookie.count()) await cookie.click();
      const text = await page.locator('body').innerText();
      assert.doesNotMatch(text, /2374|Корпоративное управление/);
      assert.equal(await page.locator('main section').count(), 12);
      assert.equal(await page.locator('.review-portrait').count(), 4);
      await page.locator('#reviews').scrollIntoViewIfNeeded();
      const more = page.getByRole('button', { name: 'Показать ещё', exact: true });
      while (await more.count()) {
        await more.click();
        await page.waitForFunction(() => !document.querySelector('#reviews button[disabled]'));
      }
      assert.equal(await page.locator('.review-portrait').count(), 17);
      const verifyImages = async (expected) => {
        const images = page.locator('.review-portrait img');
        assert.equal(await images.count(), expected);
        for (const img of await images.all()) {
          await img.scrollIntoViewIfNeeded();
          await img.evaluate(image => image.decode());
          assert.deepEqual(await img.evaluate(image => [image.naturalWidth, image.naturalHeight]), [256, 256]);
          assert.ok((await img.getAttribute('src')).startsWith('/urinatech/avatars/'));
        }
        const dimensions = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
        assert.equal(dimensions.scrollWidth, width);
        const overflow = await page.locator('.review-card, .sol-card').evaluateAll(cards => cards.filter(card => {
          const r = card.getBoundingClientRect();
          return r.left < -1 || r.right > innerWidth + 1;
        }).map(card => card.innerText));
        assert.deepEqual(overflow, []);
        return dimensions;
      };
      report.push({ state: 'main-reviews', images: 17, ...await verifyImages(17) });
      if (width < 1201) {
        await page.getByRole('button', { name: 'Открыть меню' }).click();
        await page.locator('.mobile-nav a[href="#company"]').click();
      } else {
        await page.locator('.nav a[href="#company"]').click();
      }
      await page.waitForFunction(() => {
        const r = document.getElementById('company').getBoundingClientRect();
        return r.top >= 0 && r.bottom <= innerHeight;
      });
      assert.match(await page.locator('footer #company').innerText(), /Московский Институт Обогащения Урины/);
      await page.locator('.footer a[href="#/solnyshko"]').click();
      await page.locator('.sol-review__head').first().waitFor();
      report.push({ state: 'resort-reviews', images: 4, ...await verifyImages(4) });
      assert.match(await page.locator('.sol main').innerText(), /созданы нейросетью/);
      await page.locator('.sol-form input').fill('Проверка портретов');
      await page.locator('.sol-form button').click();
      await page.locator('.sol-voucher').waitFor();
      assert.match(await page.locator('.sol-voucher').innerText(), /Зарегистрировано/i);
      await page.locator('.sol-voucher button').click();
      assert.equal(await page.locator('.sol-form input').inputValue(), '');
      assert.deepEqual(errors, []);
      report.push({ state: "console", width, errors });
      await page.close();
      console.log(`PASS ${width}`);
    }
    const output = process.env.REPORT_PATH || '/tmp/urinatech-review-portraits-browser.json';
    fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
