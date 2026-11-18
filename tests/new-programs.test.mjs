import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRootStore, RootStoreContext } from '../src/stores/RootStore.ts';
import { SolnyshkoStore } from '../src/stores/SolnyshkoStore.ts';
import { SOL_PROGRAMS } from '../src/data/solPrograms.ts';
import App from '../src/App.tsx';
import SolBooking from '../src/components/solnyshko/SolBooking.tsx';

const programs = [
  ['morozko', 'Каловая криотерапия «Морозко»', ['Природное сырьё. Холодный расчёт.', 'Разморозка в стоимость программы не входит.', 'журнал оттаивания', 'спячк', 'Тёплые отзывы']],
  ['golden-reserve', 'Капельная уринотерапия «Золотой резерв»', ['Теперь ближе к сердцу.', 'Собственный резерв', 'Золотой стандарт', 'Семейный капитал', 'полученные средства']],
];
function browser(t) {
  const oldWindow = globalThis.window, oldDocument = globalThis.document;
  const events = new EventTarget(), meta = {};
  globalThis.window = { location: { hash: '#/' }, addEventListener: events.addEventListener.bind(events) };
  globalThis.document = { title: '', querySelector: () => ({ setAttribute: (k, v) => meta[k] = v }) };
  t.after(() => { globalThis.window = oldWindow; globalThis.document = oldDocument; });
  return { meta, navigate(hash) { window.location.hash = hash; events.dispatchEvent(new Event('hashchange')); } };
}
const render = (Component, store) => renderToStaticMarkup(React.createElement(RootStoreContext.Provider, { value: store }, React.createElement(Component, { initialNotFound: false })));

test('new programs are discoverable and direct routes preserve their content, metadata and manufacturer links', t => {
  const env = browser(t), store = createRootStore();
  const home = render(App, store);
  for (const [id, title, canon] of programs) {
    const program = SOL_PROGRAMS.find(p => p.id === id);
    assert.ok(program, id);
    assert.ok(home.includes(`href="#/solnyshko/${id}"`));
    env.navigate(`#/solnyshko/${id}/?section=products`);
    assert.equal(store.router.route, 'solnyshko');
    assert.equal(store.router.program, id);
    assert.equal(store.router.section, null);
    assert.equal(document.title, `${title} — пансионат «Солнышко»`);
    assert.equal(env.meta.content, program.meta);
    const html = render(App, store);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    for (const text of canon) assert.ok(html.includes(text), `${id}: ${text}`);
    assert.ok(html.includes(`src="${program.image}"`));
    assert.match(html, /href="#\/urinatech\?section=urinatorium"/);
    assert.match(html, /Имеются противопоказания/);
    assert.match(html, /не является лекарственным средством/);
    assert.match(html, /18\+/);
    env.navigate(`#/solnyshko/${id}/extra`);
    assert.equal(store.router.route, 'notFound');
    assert.equal(store.router.program, null);
  }
  env.navigate('#/urinatech?section=urinatorium');
  assert.equal(store.router.route, 'urinatech');
  assert.equal(store.router.section, 'urinatorium');
  assert.equal(store.router.program, null);
  assert.doesNotMatch(render(App, store), /id="sol-morozko"|id="sol-golden-reserve"/);
});

test('both new programs produce the correct local voucher, reject short names and keep the existing reset contract', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const store = new SolnyshkoStore();
  for (const [id, title] of programs) {
    store.chooseProgram(id);
    assert.equal(store.program, id);
    assert.equal(store.status, 'form');
    assert.equal(store.canSubmit, false);
    store.setName(' А ');
    await store.submit();
    assert.equal(store.status, 'form');
    assert.equal(store.voucher, null);
    store.setName(' Ан ');
    assert.equal(store.canSubmit, true);
    store.chooseProgram('missing');
    assert.equal(store.program, id);
    const pending = store.submit();
    assert.equal(store.status, 'sending');
    store.setProgram('kalofores');
    assert.equal(store.program, id);
    t.mock.timers.runAll(); await pending;
    assert.equal(store.status, 'done');
    const html = render(SolBooking, { solnyshko: store });
    assert.ok(html.includes(title));
    assert.match(html, /не бронирует место и не подтверждает оплату/);
    assert.doesNotMatch(html, /Режим калофореза/);
    store.reset();
    assert.equal(store.voucher, null);
    assert.equal(store.name, '');
    assert.equal(store.status, 'form');
  }
  store.chooseProgram('morozko'); store.setName('Иванов');
  const pending = store.submit();
  store.chooseProgram('golden-reserve');
  t.mock.timers.runAll(); await pending;
  assert.equal(store.program, 'golden-reserve');
  assert.equal(store.status, 'form');
  assert.equal(store.voucher, null);
});
