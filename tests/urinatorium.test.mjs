import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '../src/App.tsx';
import { PRODUCTS } from '../src/data/catalog.ts';
import { MEDIA } from '../src/data/media.ts';
import { createRootStore, RootStoreContext } from '../src/stores/RootStore.ts';
import CartDrawer from '../src/components/CartDrawer.tsx';

function page(t, hash = '#/urinatech') {
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
    render: (Component = App) => renderToStaticMarkup(React.createElement(RootStoreContext.Provider, { value: store }, React.createElement(Component, { initialNotFound: false }))),
    go: hash => { window.location.hash = hash; events.dispatchEvent(new Event('hashchange')); },
  };
}
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

test('первый экран представляет уринаторий; аппарат, изолят и семейная комплектация раскрыты в отдельном блоке', t => {
  const env = page(t);
  const html = env.render();
  const copy = text(html);
  assert.match(copy, /Первый уринаторий в России/);
  assert.match(copy, /Инновационные составы для вашего здоровья/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  const section = html.match(/<section\b[^>]*id="urinatorium"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  const story = text(section);
  for (const phrase of ['Изолят отборной мочи', 'Анонимная моча', 'Ваш персональный уринаторий', 'Солнышко-У', 'именной тубус', 'Мы знаем каждого', 'Отбор проходит донор', 'Семейный', 'истощении донора']) assert.ok(story.includes(phrase), phrase);
  assert.equal((section.match(/class="urinatorium-feature"/g) ?? []).length, 5);
  assert.match(section, /Включить аппарат в спецификацию/);
  assert.match(section, /Добавить кассету/);
  assert.match(html, /id="ug9"/);
  assert.match(html, /Имеются противопоказания/);
});

test('аппарат и кассета входят в общий каталог, объединяются по артикулу и формируют согласованную спецификацию', t => {
  const env = page(t);
  const device = PRODUCTS.find(p => p.id === 'sunshine-u');
  const cassette = PRODUCTS.find(p => p.id === 'isolate');
  assert.ok(device); assert.ok(cassette);
  for (const id of ['sunshine-u', 'isolate']) assert.equal(PRODUCTS.filter(p => p.id === id).length, 1);
  assert.equal(device.price, 24920); assert.equal(cassette.price, 1246);
  const cart = env.store.cart;
  cart.checkout(); assert.equal(cart.lastOrderTotal, null);
  cart.add(device); cart.add(cassette); cart.add(cassette);
  assert.equal(cart.items.length, 2); assert.equal(cart.count, 3); assert.equal(cart.total, 27412);
  const html = env.render(CartDrawer);
  assert.match(html, /Солнышко-У/); assert.match(html, /Изолят отборной мочи/);
  cart.dec('isolate'); assert.equal(cart.total, 26166);
  cart.checkout(); assert.equal(cart.lastOrderTotal, 26166); assert.equal(cart.count, 0);
  cart.add(device); assert.equal(cart.lastOrderTotal, null); assert.equal(cart.total, 24920);
  cart.dec('sunshine-u'); assert.equal(cart.count, 0); assert.equal(cart.total, 0);
});

test('новые ссылки и метаданные принадлежат УринаТеху и не появляются на страницах здравницы', t => {
  const env = page(t);
  for (const hash of ['#/urinatech?section=urinatorium', '#urinatorium']) {
    env.go(hash);
    assert.equal(env.store.router.route, 'urinatech'); assert.equal(env.store.router.section, 'urinatorium');
    assert.match(document.title, /первый уринаторий/);
    assert.match(env.meta.content, /Солнышко-У/);
  }
  const html = env.render();
  assert.match(html.match(/<section class="hero"[\s\S]*?<\/section>/)[0], /href="#\/urinatech\?section=urinatorium"/);
  assert.match(html, /href="#\/urinatech\?section=urinatorium"[^>]*>Уринаторий<\/a>/);
  for (const hash of ['#/?section=urinatorium', '#/solnyshko/station', '#/solnyshko/franchise']) {
    env.go(hash); assert.equal(env.store.router.section, null);
    assert.doesNotMatch(env.render(), /id="urinatorium"|Первый уринаторий/);
  }
  env.go('#/urinatech?section=urinatorium-invalid'); assert.equal(env.store.router.section, null);
});

test('фотография собственного аппарата поставляется локально и используется в промоблоке и каталоге', async t => {
  assert.ok(MEDIA.sunshineProduct);
  const data = await readFile(new URL(`../public${MEDIA.sunshineProduct}`, import.meta.url));
  assert.equal(data.toString('ascii', 0, 4), 'RIFF');
  assert.equal(data.toString('ascii', 8, 12), 'WEBP');
  assert.ok(data.byteLength > 10000 && data.byteLength < 400000);
  const env = page(t);
  assert.equal((env.render().match(new RegExp(`src="${MEDIA.sunshineProduct}"`, 'g')) ?? []).length, 2);
  assert.match(env.render(), /alt="Солнышко-У[^\"]+"/);
});
