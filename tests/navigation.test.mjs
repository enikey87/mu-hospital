import assert from 'node:assert/strict';
import { test } from 'node:test';
import { RouterStore } from '../src/stores/RouterStore.ts';
test('заголовок и описание соответствуют сайту при загрузке и переходах', t => {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const events = new EventTarget();
  const description = {};
  globalThis.window = {
    location: { hash: '#/solnyshko' },
    addEventListener: events.addEventListener.bind(events),
  };
  globalThis.document = {
    title: '',
    querySelector: () => ({ setAttribute: (key, value) => description[key] = value }),
  };
  t.after(() => {
    if (previousWindow === undefined)
      delete globalThis.window;
    else
      globalThis.window = previousWindow;
    if (previousDocument === undefined)
      delete globalThis.document;
    else
      globalThis.document = previousDocument;
  });
  const router = new RouterStore();
  assert.equal(router.route, 'solnyshko');
  assert.match(document.title, /Солнышко/);
  assert.match(description.content, /Республика Алтай/);
  router.goMain();
  events.dispatchEvent(new Event('hashchange'));
  assert.equal(router.route, 'main');
  assert.match(document.title, /УринаТех/);
  assert.ok(!document.title.includes('Солнышко'));
  assert.match(description.content, /донорская программа/);
  router.goSolnyshko();
  events.dispatchEvent(new Event('hashchange'));
  assert.equal(router.route, 'solnyshko');
  assert.match(document.title, /Солнышко/);
});
