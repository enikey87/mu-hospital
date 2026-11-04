import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RouterStore } from '../src/stores/RouterStore.ts';
import { createRootStore, RootStoreContext } from '../src/stores/RootStore.ts';
import App from '../src/App.tsx';

function browser(t, hash = '') {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const events = new EventTarget();
  const description = {};
  const scrolls = [];
  globalThis.window = { location: { hash }, addEventListener: events.addEventListener.bind(events) };
  globalThis.document = {
    title: '', querySelector: () => ({ setAttribute: (key, value) => description[key] = value }),
    getElementById: id => ({ scrollIntoView: options => scrolls.push([id, options]) }),
  };
  t.after(() => {
    if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow;
    if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument;
  });
  return { description, scrolls, navigate: hash => { window.location.hash = hash; events.dispatchEvent(new Event('hashchange')); } };
}
const render = store => renderToStaticMarkup(React.createElement(RootStoreContext.Provider, { value: store }, React.createElement(App, { initialNotFound: false })));

test('главная открывает здравницу; производитель, старые якоря и ошибочные адреса сохраняют свои назначения', t => {
  const env = browser(t);
  const router = new RouterStore();
  assert.equal(router.route, 'solnyshko');
  for (const hash of ['', '#', '#/', '#/?section=sol-rooms', '#/solnyshko', '#/solnyshko/']) {
    env.navigate(hash);
    assert.equal(router.route, 'solnyshko', hash);
    assert.equal(router.program, null);
    assert.equal(router.section, hash.includes('section=') ? 'sol-rooms' : null);
    assert.match(document.title, /Солнышко/);
    assert.match(env.description.content, /Республика Алтай/);
  }
  router.goSolnyshko('sol-booking');
  assert.equal(window.location.hash, '#/?section=sol-booking');
  env.navigate(window.location.hash);
  router.goSolnyshko('sol-booking');
  assert.deepEqual(env.scrolls.pop(), ['sol-booking', { behavior: 'smooth' }]);
  for (const hash of ['#/urinatech', '#/urinatech/', '#/urinatech?section=products', '#products', '#company', '#top']) {
    env.navigate(hash);
    assert.equal(router.route, 'urinatech', hash);
    assert.equal(router.program, null);
    const section = hash.includes('section=') ? 'products' : hash.startsWith('#/') ? null : hash.slice(1);
    assert.equal(router.section, section);
    assert.match(document.title, /^УринаТех/);
    assert.match(env.description.content, /донорская программа/);
  }
  for (const hash of ['#/?section=products', '#/urinatech?section=sol-rooms', '#/urinatech?section=__proto__']) {
    env.navigate(hash);
    assert.equal(router.section, null, hash);
  }
  for (const hash of ['#/missing', '#/urinatech/products', '#unknown', '#/%ZZ']) {
    env.navigate(hash);
    assert.equal(router.route, 'notFound', hash);
    assert.equal(router.section, null);
    assert.match(document.title, /404.*Солнышко/);
  }
  router.goMain();
  env.navigate(window.location.hash);
  assert.equal(router.route, 'solnyshko');
  assert.equal(router.section, null);
});

test('путь к поставщику проходит через уринотерапию; сайт производителя сохраняет каталог и обратные ссылки', t => {
  const env = browser(t);
  const store = createRootStore();
  const home = render(store);
  assert.match(home, /^<div class="sol">/);
  assert.match(home, /<h1[^>]*>Пансионат/);
  assert.match(home, /href="#\/solnyshko\/station"[^>]*>Уринотерапия/);
  assert.doesNotMatch(home, /основной сайт|href="#\/urinatech/);
  env.navigate('#/solnyshko/station');
  const station = render(store);
  const hero = station.match(/<section class="sol-detail__hero">([\s\S]*?)<\/section>/)?.[1];
  assert.ok(hero);
  assert.match(hero, /class="sol-btn" href="#\/urinatech">Сайт «УринаТех»/);
  assert.match(station, /href="#\/urinatech"[^>]*>О производителе/);
  assert.match(station, /href="#\/urinatech\?section=products"/);
  assert.match(station, /Производитель продукции.*УринаТех/);
  for (const id of ['enemas', 'kalofores', 'roots']) {
    env.navigate(`#/solnyshko/${id}`);
    assert.doesNotMatch(render(store), /О производителе|Сайт «УринаТех»/);
  }
  env.navigate('#/urinatech');
  const manufacturer = render(store);
  assert.match(manufacturer, /^<div class="ut">/);
  assert.match(manufacturer, /<h1[^>]*>Производство/);
  assert.match(manufacturer, /id="products"/);
  assert.match(manufacturer, /href="#\/solnyshko\/station"[^>]*>Уринотерапия/);
  assert.match(manufacturer, /href="#\/"[^>]*>Пансионат «Солнышко»/);
  assert.match(manufacturer, /href="#\/urinatech\?section=company"[^>]*>История/);
  assert.doesNotMatch(manufacturer, /href="#(?:products|top|donor|company)"/);
  assert.match(manufacturer, /Имеются противопоказания/);
});

test('метаданные стартового HTML и страницы ошибки принадлежат здравнице', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<title>Пансионат «Солнышко»/);
  assert.match(html, /name="description"\s+content="Пансионат «Солнышко»/);
  const error = await readFile(new URL('../public/404.html', import.meta.url), 'utf8');
  assert.match(error, /<title>404 — пансионат «Солнышко»/);
});
