import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '../src/App.tsx';
import { createRootStore, RootStoreContext } from '../src/stores/RootStore.ts';

function page(t, hash = '#/solnyshko/franchise') {
  const previous = { window: globalThis.window, document: globalThis.document };
  const events = new EventTarget();
  const meta = {};
  globalThis.window = { location: { hash }, addEventListener: events.addEventListener.bind(events) };
  globalThis.document = { title: '', querySelector: () => ({ setAttribute: (name, value) => meta[name] = value }) };
  t.after(() => {
    for (const key of ['window', 'document']) {
      if (previous[key] === undefined) delete globalThis[key]; else globalThis[key] = previous[key];
    }
  });
  const store = createRootStore();
  return {
    store, meta,
    render: () => renderToStaticMarkup(React.createElement(RootStoreContext.Provider, { value: store }, React.createElement(App, { initialNotFound: false }))),
    go: hash => { window.location.hash = hash; events.dispatchEvent(new Event('hashchange')); },
  };
}

test('франшиза имеет отдельный адрес и метаданные; её разделы изолированы от программ и производителя', t => {
  const env = page(t);
  assert.equal(env.store.router.route, 'franchise');
  assert.equal(env.store.router.program, null);
  assert.match(document.title, /Франшиза.*Калофорез/);
  assert.match(env.meta.content, /М2/);
  env.go('#/solnyshko/franchise?section=franchise-brief');
  assert.equal(env.store.router.section, 'franchise-brief');
  for (const hash of ['#/solnyshko/franchise?section=products', '#/?section=franchise-brief', '#/urinatech?section=franchise-brief']) {
    env.go(hash); assert.equal(env.store.router.section, null, hash);
  }
  env.go('#/solnyshko/kalofores'); assert.equal(env.store.router.route, 'solnyshko'); assert.equal(env.store.router.program, 'kalofores');
  env.go('#/solnyshko/franchise/invalid'); assert.equal(env.store.router.route, 'notFound');
});

test('промостраница содержит аппарат, комплектацию, коммерческие условия и локальный расчёт без обещаний регистрации', t => {
  const env = page(t);
  const html = env.render();
  assert.match(html, /^<div class="sol">/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  for (const text of ['Франшиза калофореза', 'Калофорез-Кедр М2', '4,2 мА', 'КалоМедведь', 'КалоОлень', '4,2%', 'Паушальный взнос']) assert.ok(html.includes(text), text);
  assert.match(html, /src="\/images\/sol-kalofores.webp"/);
  assert.match(html, /124.?600/);
  assert.match(html, /Город открытия/);
  assert.match(html, /Количество кабинетов/);
  assert.match(html, /Сформировать расчёт/);
  assert.match(html, /Заявка не отправляется/);
  assert.match(html, /Имеются противопоказания/);
  assert.doesNotMatch(html, /id="ug9"|id="sol-booking"|Заявка принята|Оплачено/);
});

test('калофорез ведёт на франшизу, а промостраница возвращает к программе и главной', t => {
  const env = page(t, '#/solnyshko/kalofores');
  assert.match(env.render(), /href="#\/solnyshko\/franchise"/);
  env.go('#/solnyshko/franchise');
  const html = env.render();
  assert.match(html, /href="#\/solnyshko\/kalofores"/);
  assert.match(html, /href="#\/"/);
  assert.match(html, /href="#\/solnyshko\/franchise\?section=franchise-brief"/);
});
