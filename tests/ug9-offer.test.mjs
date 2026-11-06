import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '../src/App.tsx';
import { PRODUCTS } from '../src/data/catalog.ts';
import { createRootStore, RootStoreContext } from '../src/stores/RootStore.ts';
import CartDrawer from '../src/components/CartDrawer.tsx';

function setup(t, hash = '#/urinatech?section=ug9') {
  const previous = { window: globalThis.window, document: globalThis.document };
  const events = new EventTarget();
  globalThis.window = { location: { hash }, addEventListener: events.addEventListener.bind(events) };
  globalThis.document = { title: '', querySelector: () => ({ setAttribute() {} }) };
  t.after(() => {
    for (const key of ['window', 'document']) {
      if (previous[key] === undefined) delete globalThis[key]; else globalThis[key] = previous[key];
    }
  });
  const store = createRootStore();
  return {
    store,
    render: (Component = App) => renderToStaticMarkup(React.createElement(RootStoreContext.Provider, { value: store }, React.createElement(Component, { initialNotFound: false }))),
    navigate: hash => { window.location.hash = hash; events.dispatchEvent(new Event('hashchange')); },
  };
}

test('УГ-9 представлен отдельным предложением с девятью свойствами, схемой, сравнением и удерживаемыми средами', t => {
  const env = setup(t);
  const html = env.render();
  const section = html.match(/<section\b[^>]*id="ug9"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section, 'Предложение УГ-9 должно быть видно на сайте производителя');
  assert.equal((section.match(/class="ug9-benefit"/g) ?? []).length, 9);
  assert.match(section, /Анальное кольцо УГ-9/);
  assert.match(section, /[Зз]амена стандартного анального кольца/);
  assert.match(section, /[Гг]овно/);
  assert.match(section, /12 атм/);
  for (const medium of ['Понос', 'Пшеничное пиво']) assert.ok(section.includes(medium), medium);
  assert.equal((section.match(/Не проходит/g) ?? []).length, 3);
  assert.match(section, /<svg[^>]*role="img"[^>]*aria-label="[^"]+"/);
  assert.match(section, /<caption>[^<]+<\/caption>/);
  assert.match(section, /<th scope="col">/);
  assert.match(section, /Стандартное кольцо/);
  assert.match(section, /УГ-9/);
  assert.match(section, /Включить УГ-9 в спецификацию/);
  assert.ok(html.indexOf('id="ug9"') < html.indexOf('id="products"'));
  assert.match(html, /Имеются противопоказания/);
});

test('предложение и каталог используют один комплект УГ-9; количество, итог и новая спецификация согласованы', t => {
  const env = setup(t);
  const product = PRODUCTS.find(p => p.id === 'ug9');
  assert.ok(product, 'Изделие должно участвовать в существующей спецификации');
  assert.equal(PRODUCTS.filter(p => p.id === 'ug9').length, 1);
  assert.equal(product.price, 12460);
  assert.equal(product.unit, 'комплект');
  const cart = env.store.cart;
  cart.checkout(); assert.equal(cart.lastOrderTotal, null);
  cart.add(product); cart.add(product);
  assert.equal(cart.items.length, 1);
  assert.equal(cart.items[0].qty, 2);
  assert.equal(cart.total, 24920);
  assert.match(env.render(CartDrawer), /Анальное кольцо УГ-9/);
  cart.dec('ug9'); assert.equal(cart.total, 12460);
  cart.checkout(); assert.equal(cart.lastOrderTotal, 12460); assert.equal(cart.count, 0);
  cart.add(product); assert.equal(cart.lastOrderTotal, null); assert.equal(cart.total, 12460);
  cart.dec('ug9'); assert.equal(cart.count, 0);
});

test('прямой адрес УГ-9, ссылка первого экрана и меню работают только в подсайте производителя', t => {
  const env = setup(t);
  for (const hash of ['#/urinatech?section=ug9', '#ug9']) {
    env.navigate(hash);
    assert.equal(env.store.router.route, 'urinatech');
    assert.equal(env.store.router.section, 'ug9');
  }
  const html = env.render();
  const hero = html.match(/<section class="hero"[\s\S]*?<\/section>/)?.[0];
  assert.match(hero, /href="#\/urinatech\?section=ug9"/);
  assert.match(html, /href="#\/urinatech\?section=ug9"[^>]*>УГ-9<\/a>/);
  for (const hash of ['#/', '#/?section=ug9', '#/solnyshko/station']) {
    env.navigate(hash);
    assert.equal(env.store.router.route, 'solnyshko');
    assert.equal(env.store.router.section, null);
    assert.doesNotMatch(env.render(), /id="ug9"/);
  }
  env.navigate('#/urinatech?section=ug9-invalid'); assert.equal(env.store.router.section, null);
});
