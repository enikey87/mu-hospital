import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TestimonialsStore } from '../src/stores/TestimonialsStore.ts';
import { createRootStore, RootStoreContext } from '../src/stores/RootStore.ts';
import { SOL_REVIEWS } from '../src/data/solnyshko.ts';
import Testimonials from '../src/components/Testimonials.tsx';
import SolReviews from '../src/components/solnyshko/SolReviews.tsx';
import App from '../src/App.tsx';

const render = (Component, store, props = {}) => renderToStaticMarkup(React.createElement(RootStoreContext.Provider, { value: store }, React.createElement(Component, props)));

function loadArchive(t) {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const store = new TestimonialsStore();
  assert.equal(store.reviews.length, 4);
  assert.equal(store.loading, false);
  assert.equal(store.hasMore, true);
  while (store.hasMore) {
    const before = store.reviews.length;
    store.loadMore();
    assert.equal(store.loading, true);
    store.loadMore();
    t.mock.timers.tick(899);
    assert.equal(store.reviews.length, before);
    t.mock.timers.tick(1);
    assert.equal(store.reviews.length, before + 1);
    assert.equal(store.loading, false);
  }
  assert.equal(store.reviews.length, 17);
  assert.deepEqual(store.reviews.map(r => r.id), Array.from({ length: 17 }, (_, i) => i + 1));
  store.loadMore();
  t.mock.timers.runAll();
  assert.equal(store.loading, false);
  assert.equal(store.reviews.length, 17);
  return store;
}

test('весь архив загружается последовательно и у каждого автора есть собственное изображение', async t => {
  const testimonials = loadArchive(t);
  assert.equal(SOL_REVIEWS.length, 4);
  const authors = [...testimonials.reviews, ...SOL_REVIEWS];
  const images = new Set(authors.map(r => r.avatar));
  assert.equal(images.size, 20);
  for (const avatar of images) {
    assert.match(avatar, /^[a-z]+-review\.webp$/);
    const data = await readFile(new URL(`../public/avatars/${avatar}`, import.meta.url));
    assert.equal(data.toString('ascii', 0, 4), 'RIFF');
    assert.equal(data.toString('ascii', 8, 12), 'WEBP');
    assert.ok(data.byteLength > 1000 && data.byteLength <= 20000, avatar);
  }
  for (const [Component, store, expected] of [[Testimonials, { testimonials, poll: { voted: false } }, 17], [SolReviews, {}, 4]]) {
    const html = render(Component, store);
    assert.equal((html.match(/class="review-portrait"/g) ?? []).length, expected);
    assert.equal((html.match(/loading="lazy"/g) ?? []).length, expected);
    assert.match(html, /созданы нейросетью/);
    assert.doesNotMatch(html, /\.svg|avatars\/[^" ]+\.jpg/);
  }
  const byName = name => testimonials.reviews.find(r => r.name.includes(name)).avatar;
  assert.equal(byName('Зинаида'), 'zinaida-review.webp');
  assert.equal(byName('Скальпель'), 'skalpel-review.webp');
  assert.equal(byName('Сеченова'), 'sechenov-review.webp');
  assert.equal(byName('Красного Креста'), SOL_REVIEWS.find(r => r.name.includes('Красного Креста')).avatar);
});

test('главная страница не содержит удалённых блоков; история Института доступна по ссылке меню', t => {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  globalThis.window = { location: { hash: '' }, addEventListener() {} };
  globalThis.document = { title: '', querySelector: () => null };
  t.after(() => {
    if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow;
    if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument;
  });
  const interval = t.mock.method(globalThis, 'setInterval', () => { throw new Error('Неожиданный фоновый таймер'); });
  const store = createRootStore();
  const html = render(App, store, { initialNotFound: false });
  assert.equal(interval.mock.callCount(), 0);
  assert.doesNotMatch(html, /2374|Корпоративное управление|id="queue"|team-card/);
  assert.match(html, /href="#company"[^>]*>История/);
  assert.match(html, /<footer[\s\S]*id="company"[\s\S]*Московский Институт Обогащения Урины/);
  assert.match(html, /id="products"/);
  assert.match(html, /id="reviews"/);
  assert.match(html, /Имеются противопоказания/);
});
