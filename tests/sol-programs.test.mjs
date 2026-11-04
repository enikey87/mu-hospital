import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RouterStore } from '../src/stores/RouterStore.ts';
import { SolnyshkoStore } from '../src/stores/SolnyshkoStore.ts';
import { createRootStore, RootStoreContext } from '../src/stores/RootStore.ts';
import { SOL_PROGRAMS } from '../src/data/solPrograms.ts';
import { ENEMAS, ROOT_VEGETABLES, STATION_PROGRAMS } from '../src/data/solnyshko.ts';
import App from '../src/App.tsx';
import SolBooking from '../src/components/solnyshko/SolBooking.tsx';

function browser(t, hash) {
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
  return { description, scrolls, navigate: value => { window.location.hash = value; events.dispatchEvent(new Event('hashchange')); } };
}
const render = (Component, store, props = {}) => renderToStaticMarkup(React.createElement(RootStoreContext.Provider, { value: store }, React.createElement(Component, props)));

test('прямые адреса направлений, разделы главной и ошибочные пути обновляют состояние и метаданные', t => {
  const env = browser(t, '#/solnyshko/enemas');
  const router = new RouterStore();
  assert.equal(router.program, 'enemas');
  assert.match(document.title, /Клизмотроника/);
  assert.match(env.description.content, /двенадцати/);
  for (const program of SOL_PROGRAMS) {
    env.navigate(`#/solnyshko/${program.id}/`);
    assert.equal(router.route, 'solnyshko');
    assert.equal(router.program, program.id);
    assert.equal(router.section, null);
    assert.ok(document.title.startsWith(program.title));
  }
  router.goSolnyshko('sol-booking');
  env.navigate(window.location.hash);
  assert.equal(router.program, null);
  assert.equal(router.section, 'sol-booking');
  router.goSolnyshko('sol-booking');
  assert.deepEqual(env.scrolls, [['sol-booking', { behavior: 'smooth' }]]);
  for (const hash of ['#/solnyshko?section=missing', '#/solnyshko?section=__proto__']) {
    env.navigate(hash);
    assert.equal(router.route, 'solnyshko');
    assert.equal(router.section, null);
  }
  for (const hash of ['#/solnyshko/missing', '#/solnyshko/station/extra', '#/missing', '#/solnyshko/%ZZ']) {
    env.navigate(hash);
    assert.equal(router.route, 'notFound');
    assert.equal(router.program, null);
    assert.match(document.title, /404/);
  }
  for (const hash of ['#/', '']) {
    env.navigate(hash);
    assert.equal(router.route, 'solnyshko');
    assert.equal(router.program, null);
    assert.match(document.title, /Солнышко/);
  }
  router.goSolnyshko('not-a-section');
  assert.equal(window.location.hash, '#/');
});

test('страницы содержат один заголовок, графику, канонические гэги и ограничения; главная не повторяет полный каталог', t => {
  const env = browser(t, '#/solnyshko');
  const store = createRootStore();
  const home = render(App, store, { initialNotFound: false });
  for (const program of SOL_PROGRAMS) assert.ok(home.includes(`href="#/solnyshko/${program.id}"`));
  assert.doesNotMatch(home, /id="sol-station"|id="sol-enemas"|id="sol-kalofores"|id="sol-roots"/);
  const canon = { station: ['1246 дней', 'Именной стакан'], enemas: ['Алтайский рассвет', 'Ламинария Дальняя'], kalofores: ['2007', 'Пробуждение в журнале не зарегистрировано', '4,2 мА', 'запрещено'], roots: ['1953', 'Груздев', 'Выдаче не подлежит', 'Дачник', 'Агроном'] };
  for (const program of SOL_PROGRAMS) {
    env.navigate(`#/solnyshko/${program.id}`);
    const html = render(App, store, { initialNotFound: false });
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.ok(html.includes(program.title));
    assert.ok(html.includes(`src="${program.image}"`));
    assert.match(html, /loading="eager"/);
    assert.match(html, /Имеются противопоказания/);
    assert.match(html, /18\+/);
    for (const text of canon[program.id]) assert.ok(html.includes(text), `${program.id}: ${text}`);
  }
  assert.equal(ENEMAS.length, 12);
  assert.equal(ROOT_VEGETABLES.length, 5);
  assert.equal(STATION_PROGRAMS.length, 3);
});

test('выбор направления сохраняет черновик, сбрасывает готовую заявку и отменяет отправку; невалидный выбор ничего не меняет', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const store = new SolnyshkoStore();
  store.setName('Иванов');
  store.chooseProgram('enema');
  assert.equal(store.name, 'Иванов');
  assert.equal(store.program, 'enema');
  assert.doesNotMatch(render(SolBooking, { solnyshko: store }), /Режим калофореза/);
  const first = store.submit();
  store.chooseProgram('missing');
  assert.equal(store.status, 'sending');
  store.chooseProgram('roots');
  t.mock.timers.runAll();
  await first;
  assert.equal(store.status, 'form');
  assert.equal(store.program, 'roots');
  assert.equal(store.voucher, null);
  store.setName('Петров');
  const second = store.submit();
  t.mock.timers.runAll();
  await second;
  assert.equal(store.status, 'done');
  store.chooseProgram('kalofores');
  assert.equal(store.status, 'form');
  assert.equal(store.name, '');
  assert.equal(store.voucher, null);
  assert.equal(store.program, 'kalofores');
  assert.match(render(SolBooking, { solnyshko: store }), /Режим калофореза/);
});
