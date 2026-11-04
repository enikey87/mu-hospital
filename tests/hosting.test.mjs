import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import config from '../vite.config.ts';

const main = await readFile(new URL('../src/main.tsx', import.meta.url), 'utf8');
const startup = main.match(/const notFound = ([\s\S]*?);\s*\ncreateRoot/)[1];

function consume(base, stored, failure) {
  const values = new Map(stored === null ? [] : [['ut-redirect', stored]]);
  let removals = 0;
  const sessionStorage = {
    getItem(key) { if (failure === 'get') throw new Error('Storage blocked'); return values.get(key) ?? null; },
    removeItem(key) { if (failure === 'remove') throw new Error('Storage blocked'); removals++; values.delete(key); },
  };
  const run = () => vm.runInNewContext(startup.replaceAll('import.meta.env.BASE_URL', JSON.stringify(base)), { sessionStorage });
  return { run, values, removals: () => removals };
}

test('публикация использует mu-hospital, локальная разработка — корень; robots и sitemap указывают новый сайт', async () => {
  assert.equal(config({ mode: 'production' }).base, '/mu-hospital/');
  assert.equal(config({ mode: 'development' }).base, '/');
  const robots = await readFile(new URL('../public/robots.txt', import.meta.url), 'utf8');
  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  assert.match(robots, /Sitemap: https:\/\/enikey87.github.io\/mu-hospital\/sitemap.xml/);
  assert.match(sitemap, /<loc>https:\/\/enikey87.github.io\/mu-hospital\/<\/loc>/);
  assert.match(sitemap, /mu-hospital\/#\/urinatech/);
  assert.doesNotMatch(sitemap, /github.io\/urinatech\//);
  assert.match(sitemap, /1246-01-01/);
});

test('404 сохраняет полный ошибочный адрес и возвращает на новый корень приложения', async () => {
  const html = await readFile(new URL('../public/404.html', import.meta.url), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const values = new Map();
  let destination;
  vm.runInNewContext(script, {
    sessionStorage: { setItem: (key, value) => values.set(key, value) },
    location: { pathname: '/mu-hospital/missing', search: '?ref=check', hash: '#detail', replace: value => destination = value },
  });
  assert.equal(destination, '/mu-hospital/');
  const saved = values.get('ut-redirect');
  assert.equal(saved, '/mu-hospital/missing?ref=check#detail');
  assert.equal(consume('/mu-hospital/', saved).run(), true);
});

test('старт приложения учитывает BASE_URL, однократно забирает 404 и переносит отказ хранилища', () => {
  const fresh = consume('/mu-hospital/', null);
  assert.equal(fresh.run(), false);
  assert.equal(fresh.removals(), 0);
  for (const [base, path] of [['/mu-hospital/', '/mu-hospital/'], ['/mu-hospital/', '/mu-hospital/?a=1#/urinatech'], ['/mu-hospital/', '/mu-hospital/#/urinatech'], ['/', '/'], ['/another/', '/another/']]) {
    const state = consume(base, path);
    assert.equal(state.run(), false, path);
    assert.equal(state.removals(), 1);
    assert.equal(state.values.has('ut-redirect'), false);
  }
  for (const path of ['/mu-hospital/missing', '/mu-hospital-extra', '/mu-hospital/missing?x=1#detail']) {
    const state = consume('/mu-hospital/', path);
    assert.equal(state.run(), true, path);
    assert.equal(state.run(), false);
    assert.equal(state.removals(), 1);
  }
  for (const failure of ['get', 'remove']) assert.equal(consume('/mu-hospital/', '/mu-hospital/missing', failure).run(), false);
});
