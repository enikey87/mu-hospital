import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RootStoreContext, createRootStore } from '../src/stores/RootStore.ts';
import { CartStore } from '../src/stores/CartStore.ts';
import { QuizStore } from '../src/stores/QuizStore.ts';
import { CalculatorStore } from '../src/stores/CalculatorStore.ts';
import { SolnyshkoStore } from '../src/stores/SolnyshkoStore.ts';
import { DonorStore } from '../src/stores/DonorStore.ts';
import { PRODUCTS } from '../src/data/catalog.ts';
import App from '../src/App.tsx';
import Detector from '../src/components/Detector.tsx';
import { ARCHIVE_BATCHES } from '../src/data/company.ts';
import { POWER_OPTIONS, recommendQuizResult } from '../src/data/solnyshko.ts';
import CartDrawer from '../src/components/CartDrawer.tsx';
import Calculator from '../src/components/Calculator.tsx';
import Donor from '../src/components/Donor.tsx';
import SolBooking from '../src/components/solnyshko/SolBooking.tsx';
const render = (Component, store) => renderToStaticMarkup(React.createElement(RootStoreContext.Provider, { value: store }, React.createElement(Component)));

test('скидка действует от десяти стаканов, отменяется ниже порога и совпадает в строке, итоге и спецификации', () => {
  const cart = new CartStore();
  const glass = PRODUCTS.find(p => p.id === 'stakan');
  for (let i = 0; i < 9; i++) cart.add(glass);
  assert.equal(cart.total, 900);
  cart.add(glass);
  assert.equal(cart.total, 500);
  assert.match(render(CartDrawer, { cart }), /cart-item__price">500 ₽/);
  cart.add(glass);
  assert.equal(cart.total, 550);
  cart.dec(glass.id);
  assert.equal(cart.total, 500);
  cart.dec(glass.id);
  assert.equal(cart.total, 900);
  cart.add(PRODUCTS.find(p => p.id === 'morning'));
  assert.equal(cart.total, 1200);
  cart.add(glass);
  assert.equal(cart.total, 800);
  cart.checkout();
  assert.equal(cart.lastOrderTotal, 800);
  assert.equal(cart.total, 0);
  assert.match(render(CartDrawer, { cart }), /Сумма: 800 ₽/);
  cart.add(glass);
  assert.equal(cart.lastOrderTotal, null);
  assert.equal(cart.total, 100);
  cart.remove(glass.id);
  assert.equal(cart.total, 0);
});

test('анкета спрашивает только о выбранном направлении и очищает старые уточнения при его смене', () => {
  const quiz = new QuizStore();
  assert.equal(quiz.result, null);
  quiz.answer('unknown');
  assert.equal(quiz.step, 0);
  quiz.answer('enema');
  assert.equal(quiz.complete, true);
  assert.equal(quiz.result.key, 'enema');
  assert.equal(quiz.record.length, 1);
  assert.doesNotMatch(JSON.stringify(quiz.record), /Срок|медвед|лошад/);
  quiz.back();
  quiz.answer('kalofores');
  assert.equal(quiz.result, null);
  assert.equal(quiz.total, 2);
  quiz.answer('horse');
  assert.equal(quiz.complete, false);
  quiz.answer('deer');
  assert.equal(quiz.result.key, 'kalofores');
  quiz.back(); quiz.back(); quiz.answer('station');
  assert.equal(quiz.result, null);
  assert.equal(quiz.answers[1], null);
  quiz.answer('asis');
  assert.equal(quiz.result.key, 'station');
  assert.match(quiz.result.days, /согласованию/);
  quiz.reset();
  assert.equal(quiz.answered, 0);
  assert.equal(quiz.step, 0);
  for (const [answers, key] of [[['station','week'],'morning'],[['station','month'],'safety'],[['station','long'],'second'],[['station','asis'],'station'],[['roots'],'roots'],[['complex'],'complex'],[['kalofores','taiga'],'kalofores']])
    assert.equal(recommendQuizResult(answers)?.key, key);
  for (const answers of [[],['missing'],['station'],['station','missing'],['kalofores','horse']]) assert.equal(recommendQuizResult(answers), null);
  assert.deepEqual(POWER_OPTIONS.map(p => p.value), ['bear','deer','taiga']);
});

test('калькулятор не выдаёт результат для несовершеннолетних и неполных данных; фасовка отделена от потребности', () => {
  const calc = new CalculatorStore();
  assert.match(render(Calculator, { calc }), /type="range" min="0"/);
  assert.match(render(Calculator, { calc }), /type="number" min="18"/);
  assert.match(render(Calculator, { calc }), /63 л/);
  assert.match(render(Calculator, { calc }), /70 л/);
  for (const age of ['17','0','','no','Infinity']) {
    calc.setAge(age);
    assert.equal(calc.result, null, age);
    assert.doesNotMatch(render(Calculator, { calc }), /calc-result__row/);
  }
  calc.setAge('18');
  assert.equal(calc.result.course, 21);
  calc.setAge('60');
  assert.equal(calc.result.course, 28);
  for (const weight of ['0','','-1','invalid']) { calc.setWeight(weight); assert.equal(calc.result, null); }
  calc.setWeight('70');
  assert.equal(calc.result.canisters, 9);
});

test('бланки не обещают регистрацию, оплату или заезд и сбрасываются без позднего восстановления', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const solnyshko = new SolnyshkoStore();
  const donor = new DonorStore();
  for (const [Component, store] of [[SolBooking, {solnyshko}], [Donor, {donor}]]) {
    const html = render(Component, store);
    assert.match(html, /[Бб]ланк|[Кк]арточк/);
    assert.doesNotMatch(html, /Подать заявку|После регистрации/);
  }
  await donor.submit();
  assert.equal(donor.status, 'form');
  assert.equal(donor.submitted, null);
  solnyshko.setName('Иванов');
  donor.setName('Петров'); donor.setCity('Кимры'); donor.setDinner('Зерно');
  const first = solnyshko.submit(); const second = donor.submit();
  donor.setName('Подмена'); donor.setCity('Другой город'); donor.setDinner('Подмена');
  assert.deepEqual([donor.name, donor.city, donor.dinner], ['Петров', 'Кимры', 'Зерно']);
  t.mock.timers.runAll(); await Promise.all([first, second]);
  for (const html of [render(SolBooking,{solnyshko}), render(Donor,{donor})]) {
    assert.doesNotMatch(html, /[Зз]арегистрирован|предъявляется при заезде|с момента регистрации/);
    assert.match(html, /[Бб]ланк|[Кк]арточк/);
  }
  const submitted = donor.submitted;
  const repeated = donor.submit();
  assert.equal(donor.status, 'done');
  await repeated;
  assert.equal(donor.submitted, submitted);
  donor.reset(); donor.setName('Петров'); donor.setCity('Кимры'); donor.setDinner('Зерно');
  const pending = donor.submit();
  donor.reset();
  t.mock.timers.runAll(); await pending;
  assert.equal(donor.status, 'form');
  assert.equal(donor.submitted, null);
  assert.equal(donor.name, '');
});


test('главная представляет здравницу, канонические гэги сохранены, а реестр честно описывает доступный архив', t => {
  const oldWindow = globalThis.window, oldDocument = globalThis.document;
  const events = new EventTarget();
  globalThis.window = { location: {hash:''}, addEventListener: events.addEventListener.bind(events) };
  globalThis.document = { title:'', querySelector:()=>null };
  t.after(()=>{
    if(oldWindow === undefined) delete globalThis.window; else globalThis.window=oldWindow;
    if(oldDocument === undefined) delete globalThis.document; else globalThis.document=oldDocument;
  });
  const store=createRootStore();
  const html=renderToStaticMarkup(React.createElement(RootStoreContext.Provider,{value:store},React.createElement(App,{initialNotFound:false})));
  assert.match(html, /<h1[^>]*>Пансионат<br\/>«Солнышко»/);
  assert.match(html, /Условия пребывания/);
  assert.doesNotMatch(html, /cookie-banner|Ближайшие заезды|В заявке можно указать сезон/);
  window.location.hash='#/solnyshko/roots'; events.dispatchEvent(new Event('hashchange'));
  const roots=renderToStaticMarkup(React.createElement(RootStoreContext.Provider,{value:store},React.createElement(App,{initialNotFound:false})));
  for(const text of ['признан урожаем','Внешние наблюдатели','считающих репу западной','1953','Груздев','Имеются противопоказания']) assert.ok(roots.includes(text),text);
  const archive=render(Detector,store);
  assert.equal(Object.keys(ARCHIVE_BATCHES).length,3);
  for(const code of ['УТ-2002-0417','УТ-2003-0004','УТ-2024-0001']) assert.ok(archive.includes(code));
  assert.match(archive,/архивные записи/);
  assert.doesNotMatch(archive,/Чистота/);
  window.location.hash='#/urinatech'; events.dispatchEvent(new Event('hashchange'));
  const manufacturer=renderToStaticMarkup(React.createElement(RootStoreContext.Provider,{value:store},React.createElement(App,{initialNotFound:false})));
  assert.doesNotMatch(manufacturer,/cookie-banner|plan__price">0 ₽/);
  assert.match(manufacturer,/Лошадь|лошадь/);
  assert.doesNotMatch(manufacturer,/регистрация в разделе «Донорам»/);
  assert.match(manufacturer,/карточка в разделе «Донорам»/);
});
