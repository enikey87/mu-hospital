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
import Products from '../src/components/Products.tsx';
import { RootStoreContext } from '../src/stores/RootStore.ts';
import { CartStore } from '../src/stores/CartStore.ts';

const render = Component => renderToStaticMarkup(React.createElement(Component));

test('фотографии поставляются вместе с сайтом, в формате WebP', async () => {
  assert.equal(Object.keys(MEDIA).length, 10);
  for (const url of Object.values(MEDIA)) {
    const data = await readFile(new URL(`../public${url}`, import.meta.url));
    assert.equal(data.toString('ascii', 0, 4), 'RIFF');
    assert.equal(data.toString('ascii', 8, 12), 'WEBP');
    assert.ok(data.byteLength > 10000 && data.byteLength < 400000, url);
  }
});

test('первые экраны имеют один заголовок и фотографию без отложенной загрузки; номера загружаются отложенно', () => {
  for (const [Component, title, photo] of [[Hero, 'Первый', MEDIA.production], [SolHero, 'Пансионат', MEDIA.resort]]) {
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

test('направления здравницы открывают отдельные страницы обычными ссылками', () => {
  const links = [];
  const walk = node => {
    if (!React.isValidElement(node)) return;
    if (node.type === 'a' && node.props.className?.includes('sol-btn')) links.push(node.props.href);
    React.Children.forEach(node.props.children, walk);
  };
  walk(SolServices());
  assert.deepEqual(links, ['#/solnyshko/station', '#/solnyshko/enemas', '#/solnyshko/kalofores', '#/solnyshko/roots']);
});


test('промышленный первый экран использует согласованные факты, а каталог показывает три отдельные фотографии продукции', () => {
  const hero = render(Hero);
  assert.match(hero, /class="industrial-facts"/);
  for (const fact of ['Полный цикл', 'Живая фильтрация', '1246']) assert.ok(hero.includes(fact), fact);
  assert.doesNotMatch(hero, /120.?000|Линий.*4/);
  assert.match(hero, /href="#\/urinatech\?section=products"/);
  const products = renderToStaticMarkup(React.createElement(RootStoreContext.Provider, { value: { cart: new CartStore() } }, React.createElement(Products)));
  for (const key of ['morningProduct', 'horseProduct', 'sunshineProduct']) {
    assert.ok(MEDIA[key], key);
    assert.ok(products.includes(`src="${MEDIA[key]}"`), key);
  }
  assert.equal((products.match(/class="product-card__photo"/g) ?? []).length, 3);
  assert.match(products, /0,5 л/);
  assert.match(products, /ГОСТ Р 1246-2002/);
  assert.match(products, /Серийная продукция/);
});
