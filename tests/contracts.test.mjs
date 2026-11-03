import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DonorStore } from '../src/stores/DonorStore.ts';
import { CartStore } from '../src/stores/CartStore.ts';
import { DetectorStore } from '../src/stores/DetectorStore.ts';
import { QuizStore } from '../src/stores/QuizStore.ts';
import { SolnyshkoStore } from '../src/stores/SolnyshkoStore.ts';
import { PRODUCTS, PLANS, FAQ } from '../src/data/catalog.ts';
import { PROGRAM_OPTIONS, QUIZ_RESULTS, recommendQuizResult } from '../src/data/solnyshko.ts';
import { RootStoreContext } from '../src/stores/RootStore.ts';
import Calculator from '../src/components/Calculator.tsx';
import Pricing from '../src/components/Pricing.tsx';
import CartDrawer from '../src/components/CartDrawer.tsx';
import SolBooking from '../src/components/solnyshko/SolBooking.tsx';
import { CalculatorStore } from '../src/stores/CalculatorStore.ts';
const flushTimers = async (t) => {
  for (let step = 0; step < 8; step += 1) {
    t.mock.timers.runAll();
    await Promise.resolve();
  }
};
const render = (Component, store) => renderToStaticMarkup(React.createElement(RootStoreContext.Provider, { value: store }, React.createElement(Component)));
test('калькулятор склоняет единицы для минимальной, обычной и максимальной дозы', () => {
  const calc = new CalculatorStore();
  assert.match(render(Calculator, { calc }), /21 день/);
  for (const [weight, trust, expected] of [['1', 100, 'по 1 стакану'], ['50', 100, 'по 2 стакана'], ['1000', 0, 'по 5 стаканов']]) {
    calc.setWeight(weight);
    calc.setTrust(trust);
    assert.ok(render(Calculator, { calc }).includes(expected), expected);
  }
  calc.setAge('60');
  assert.match(render(Calculator, { calc }), /28 дней/);
});

test('коллекционный выпуск согласован с FAQ и не обещан в регулярных поставках', () => {
  const rare = PRODUCTS.find(p => p.id === '2san');
  assert.equal(rare.price, 100000);
  assert.equal(rare.soldOut, true);
  const answer = FAQ.find(f => f.q.includes('коллекцион')).a;
  assert.ok(!answer.includes('$'));
  assert.match(answer, /2024/);
  assert.match(answer, /Выпуск реализован на аукционе/);
  assert.doesNotMatch(JSON.stringify([rare, answer]), /2374|Следующ/);
  assert.ok(!PLANS.some(p => /II Сан/.test(JSON.stringify(p))));
});

test('тарифы ведут к доступному каталогу', () => {
  const html = renderToStaticMarkup(React.createElement(Pricing));
  assert.equal((html.match(/href="#products"/g) || []).length, PLANS.length);
  assert.ok(!html.includes('Подключить'));
});

test('корзина не создаёт пустую спецификацию и допускает следующую покупку', () => {
  const cart = new CartStore();
  cart.checkout();
  assert.equal(cart.lastOrderTotal, null);
  cart.add(PRODUCTS[0]);
  cart.add(PRODUCTS[0]);
  assert.equal(cart.total, 600);
  cart.checkout();
  assert.equal(cart.lastOrderTotal, 600);
  assert.equal(cart.count, 0);
  const html = render(CartDrawer, { cart });
  assert.match(html, /Спецификация сформирована/);
  assert.ok(!html.includes('Заказ передан'));
  cart.close();
  cart.add(PRODUCTS[1]);
  assert.equal(cart.lastOrderTotal, null);
  assert.equal(cart.count, 1);
  assert.ok(render(CartDrawer, { cart }).includes('УТ-02'));
  assert.ok(render(CartDrawer, { cart }).includes('Условия поставки'));
  cart.dec(PRODUCTS[1].id);
  assert.equal(cart.count, 0);
  cart.add(PRODUCTS.find(p => p.soldOut));
  assert.equal(cart.count, 0);
});

test('верификатор различает известный номер, неизвестный номер и ошибочный формат', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const detector = new DetectorStore();
  assert.equal(detector.verdict.kind, 'idle');
  for (const value of ['', 'test', 'УТ-', 'УТ-2002-041', 'УТ-2002-0417-extra']) {
    detector.setBatch(value);
    const invalid = detector.check();
    await flushTimers(t);
    await invalid;
    assert.equal(detector.verdict.kind, 'error', value);
  }
  detector.setBatch(' ут-2002-0417 ');
  const known = detector.check();
  assert.equal(detector.verdict.kind, 'checking');
  await flushTimers(t);
  await known;
  assert.equal(detector.verdict.kind, 'genuine');
  assert.equal(detector.verdict.batch, 'УТ-2002-0417');
  detector.setBatch('УТ-9999-9999');
  const missing = detector.check();
  await flushTimers(t);
  await missing;
  assert.equal(detector.verdict.kind, 'fake');
});

test('старый ответ верификатора не перезаписывает изменённый номер', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const detector = new DetectorStore();
  detector.setBatch('УТ-2002-0417');
  const pending = detector.check();
  detector.setBatch('УТ-9999-9999');
  await flushTimers(t);
  await pending;
  assert.equal(detector.verdict.kind, 'idle');
});

test('при равенстве голосов квиз предлагает комплекс и все результаты доступны в записи', () => {
  assert.equal(recommendQuizResult(['bear', 'kalofores', 'week']).key, 'complex');
  for (const result of QUIZ_RESULTS)
    assert.ok(PROGRAM_OPTIONS.some(p => p.value === result.key), result.key);
  for (const [answers, expected] of [[['horse', 'enema', 'week'], 'morning'], [['deer', 'kalofores', 'month'], 'safety'], [['bear', 'station', 'long'], 'second'], [['taiga', 'committee', 'asis'], 'complex']])
    assert.equal(recommendQuizResult(answers).key, expected);
});

test('квиз не принимает неизвестный ответ, позволяет вернуться и начать заново', () => {
  const quiz = new QuizStore();
  assert.equal(quiz.result, null);
  quiz.answer('missing');
  assert.equal(quiz.step, 0);
  quiz.answer('horse');
  quiz.back();
  assert.equal(quiz.step, 0);
  quiz.answer('bear');
  quiz.answer('station');
  quiz.answer('long');
  assert.equal(quiz.result.key, 'second');
  quiz.reset();
  assert.equal(quiz.step, 0);
  assert.equal(quiz.answered, 0);
  assert.equal(quiz.result, null);
});

test('запись регистрирует выбранную программу без утверждения об оплате и сбрасывается', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const solnyshko = new SolnyshkoStore();
  assert.equal(solnyshko.canSubmit, false);
  await solnyshko.submit();
  assert.equal(solnyshko.status, 'form');
  solnyshko.setName('Иванов');
  solnyshko.setProgram('missing');
  solnyshko.setPower('missing');
  assert.equal(solnyshko.program, 'kalofores');
  assert.equal(solnyshko.power, 'bear');
  solnyshko.setProgram('morning');
  solnyshko.setPower('horse');
  const pending = solnyshko.submit();
  assert.equal(solnyshko.status, 'sending');
  solnyshko.setName('Другое имя');
  solnyshko.setProgram('second');
  assert.equal(solnyshko.name, 'Иванов');
  assert.equal(solnyshko.program, 'morning');
  await solnyshko.submit();
  await flushTimers(t);
  await pending;
  assert.equal(solnyshko.status, 'done');
  const html = render(SolBooking, { solnyshko });
  assert.match(html, /Зарегистрировано/);
  assert.ok(!html.includes('Оплачено'));
  assert.match(html, /Утренний круг/);
  solnyshko.reset();
  assert.equal(solnyshko.status, 'form');
  assert.equal(solnyshko.voucher, null);
  assert.equal(solnyshko.name, '');
});

test('сброс отменяет незавершённую регистрацию путёвки', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const solnyshko = new SolnyshkoStore();
  solnyshko.setName('Иванов');
  const pending = solnyshko.submit();
  solnyshko.reset();
  await flushTimers(t);
  await pending;
  assert.equal(solnyshko.status, 'form');
  assert.equal(solnyshko.voucher, null);
});

test('обработчики кнопок новой заявки сохраняют контекст хранилища', async t => {
  t.mock.timers.enable({apis: ['setTimeout']});
  const solnyshko = new SolnyshkoStore();
  solnyshko.setName('Иванов');
  const booking = solnyshko.submit();
  await flushTimers(t);
  await booking;
  const resetBooking = solnyshko.reset;
  resetBooking();
  assert.equal(solnyshko.status, 'form');
  assert.equal(solnyshko.voucher, null);

  const donor = new DonorStore();
  donor.setName('Иванов');
  donor.setCity('Кимры');
  donor.setDinner('Зерно');
  const application = donor.submit();
  await flushTimers(t);
  await application;
  assert.equal(donor.status, 'done');
  const resetDonor = donor.reset;
  resetDonor();
  assert.equal(donor.status, 'form');
  assert.equal(donor.submitted, null);
  assert.equal(donor.canSubmit, false);
});
