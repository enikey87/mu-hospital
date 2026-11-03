import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MEDIA } from '../src/data/media.ts';
import Hero from '../src/components/Hero.tsx';
import SolHero from '../src/components/solnyshko/SolHero.tsx';
import SolRooms from '../src/components/solnyshko/SolRooms.tsx';
import SolServices from '../src/components/solnyshko/SolServices.tsx';
import BrandMark from '../src/components/BrandMark.tsx';

const render = Component => renderToStaticMarkup(React.createElement(Component));

test('фотографии поставляются вместе с сайтом, в формате WebP', async () => {
  assert.equal(Object.keys(MEDIA).length, 4);
  for (const url of Object.values(MEDIA)) {
    const data = await readFile(new URL(`../public${url}`, import.meta.url));
    assert.equal(data.toString('ascii', 0, 4), 'RIFF');
    assert.equal(data.toString('ascii', 8, 12), 'WEBP');
    assert.ok(data.byteLength > 10000 && data.byteLength < 400000, url);
  }
});

test('первые экраны имеют один заголовок и фотографию без отложенной загрузки; номера загружаются отложенно', () => {
  for (const [Component, title, photo] of [[Hero, 'Производство', MEDIA.production], [SolHero, 'Здоровье', MEDIA.resort]]) {
    const html = render(Component);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.match(html, new RegExp(`<h1[^>]*>${title}`));
    assert.ok(html.includes(`src="${photo}"`));
    assert.match(html, /loading="eager"/);
    assert.match(html, /alt="[^\"]+"/);
    assert.doesNotMatch(html, /loading="lazy"/);
  }
  const rooms = render(SolRooms);
  assert.ok(rooms.includes(`src="${MEDIA.room}"`));
  assert.match(rooms, /loading="lazy"/);
  assert.match(rooms, /Стандарт/);
  assert.match(rooms, /Комфорт/);
  assert.match(rooms, /Люкс/);
  const brand = render(BrandMark);
  assert.match(brand, /aria-hidden="true"/);
  assert.match(brand, /focusable="false"/);
});

test('направления здравницы ведут к своим программам и допускают отсутствие целевого раздела', t => {
  const before = globalThis.document;
  const visited = [];
  globalThis.document = { getElementById: id => { return { scrollIntoView: options => visited.push([id, options]) }; } };
  t.after(() => { if (before === undefined) delete globalThis.document; else globalThis.document = before; });
  const buttons = [];
  const walk = node => {
    if (!React.isValidElement(node)) return;
    if (node.type === 'button') buttons.push(node);
    React.Children.forEach(node.props.children, walk);
  };
  walk(SolServices());
  assert.equal(buttons.length, 3);
  for (const button of buttons) button.props.onClick();
  assert.deepEqual(visited, ['sol-station', 'sol-enemas', 'sol-kalofores'].map(id => [id, { behavior: 'smooth' }]));
  globalThis.document.getElementById = () => null;
  for (const button of buttons) assert.doesNotThrow(() => button.props.onClick());
});
