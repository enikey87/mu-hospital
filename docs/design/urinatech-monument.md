# УринаТех — «Промышленный монумент»

Выбор автора 04.11.2026: первый из трёх предложенных макетов. [Утверждённый концепт](urinatech-monument-concept.webp).

Подсайт производителя получает собственный облик: графитовый первый экран и шапка, сигнальный красный, тёплый светлый каталог, крупный узкий Oswald и технические подписи IBM Plex Mono. Три наклонные полосы образуют знак производителя. Калькулятор, поставки, документы, отзывы, формы, корзина и подвал продолжают эту систему.

Стили ограничены `.ut`. Главная здравницы и её направления сохраняют прежний бело-синий стиль и Inter. Переход из первого экрана уринотерапии, обратные ссылки и старые адреса сохранены. Новых маршрутов, зависимостей и серверных действий нет.

На макете встречались вымышленные показатели мощности и количества линий. В реализации используются существующие факты: полный цикл, линия №4, живая фильтрация, рецептуры с 1246 года. Объёмы на бутылках согласованы с каталогом: УТ-01 — 1 л, УТ-02 — 0,5 л. Ассортимент, цены, отзывы, архивы и дисклеймеры сохранены. Спецификация базовой серии перенесена в её карточку.

## Шрифт

`public/fonts/oswald-bold.ttf` — Oswald Bold, получен через Google Fonts; кириллический диапазон проверен `fc-scan`. Шрифт поставляется локально с лицензией `public/fonts/OFL-Oswald.txt`. Источник лицензии: [Google Fonts / Oswald](https://github.com/google/fonts/tree/main/ofl/oswald). CSS использует отдельное имя `Oswald UT`, чтобы не менять типографику здравницы.

## Графика

Изображения сгенерированы встроенным `imagegen`, проверены визуально и перекодированы в WebP без изменения композиции и размера. Это иллюстрации вымышленной организации.

| Файл | Размер | Байты |
|---|---|---|
| `public/images/production-monument.webp` | 1536 × 1024 | 121314 |
| `public/images/ut-01-monument.webp` | 1199 × 1312 | 64682 |
| `public/images/ut-02-monument.webp` | 1199 × 1312 | 59770 |

### Запрос: производство

Use case: photorealistic-natural. Asset type: actual production website hero photograph, no UI, no typography, no text anywhere. A world-class architectural industrial photograph inside a credible large stainless-steel liquid processing facility. Wide landscape composition about 3:2, high fidelity metal with real brushed grain, flange bolts and believable pipes, glass circular inspection porthole showing transparent warm golden amber liquid. The large hero process vessel and porthole fill the RIGHT HALF; LEFT HALF very dark graphite shadow with sparse defocused factory structure, comfortable uninterrupted dark negative space for a large cream headline in HTML. Imposing heavy-industry scale, real natural optics, restrained warm light on amber liquid and cold daylight on metal, photographic and serious. Designed for a graphite, ivory and vermilion industrial holding brand, no neon, no futuristic sci-fi, no cartoon, no logos, no numbers, no serial text, no certificates, no UI, no collage, no people, no decorative objects, no floating particles. Entire image is a photograph, edge to edge.

### Запрос: УТ-01

Use case: product-mockup. Asset type: real catalog photograph for fictional industrial company УринаТех, not a web page. ONE upright clear cylindrical 1-liter industrial glass bottle filled with transparent golden amber liquid, brushed stainless screw cap. Centered straight-on studio photograph, whole bottle including cap and base visible with breathing room. Pale warm ivory background #efede6, quiet pale stone surface and grounded shadow, refined soft side light, crisp glass reflections, believable weight, commercial industrial photography of exceptional quality. A professionally printed warm-white paper label, single strong horizontal vermilion-red rule, dark charcoal concise grotesk text. Exact label text ONLY: "УринаТех", "УТ-01", "«Утренний»", "1 л". Make "УТ-01" the largest label text. Accurate Cyrillic, no other words, no extra codes, no standards, no certifications. No props, no herbs, no decorations, no logo icon, no other bottles, no UI, no watermark. Portrait or square framing optimized for a generous catalog panel.

### Запрос: УТ-02

Use case: product-mockup. Asset type: real catalog photograph for fictional industrial company УринаТех, not a web page. ONE upright clear cylindrical HALF-LITER industrial glass bottle filled with transparent golden amber liquid, brushed stainless screw cap. Centered straight-on studio photograph, whole bottle including cap and base visible with breathing room. Pale warm ivory background #efede6, quiet pale stone surface and grounded shadow, refined soft side light, crisp glass reflections, believable weight, commercial industrial photography of exceptional quality. A professionally printed warm-white paper label, single strong horizontal vermilion-red rule, dark charcoal concise grotesk text. Exact label text ONLY: "УринаТех", "УТ-02", "«Эталон»", "0,5 л". Make "УТ-02" the largest label text. Accurate Cyrillic, no other words, no extra codes, no standards, no certifications. No props, no herbs, no decorations, no logo icon, no other bottles, no UI, no watermark. Portrait or square framing optimized for a generous catalog panel.

## Проверка

Автотесты проверяют отдельный контейнер темы, сохранение здравницы, локальные изображения, состав каталога, характеристики и переход в продукцию. Браузерный сценарий `tools/verify-monument.cjs` проверяет загруженный шрифт, обе фотографии, все разделы, переполнение заголовков и страницы, контраст основных элементов, фокус, корзину, раскрытый FAQ и переходы между темами на ширинах 1440/768/390/320 px.

Проверки первоначально падали на прежней версии. Намеренное распространение переменных производителя на `.sol` ломает браузерную проверку цвета здравницы. Проверка ширины заголовка также выявила реальное переполнение первой версии на мобильных; размер скорректирован. Отдельные регрессии покрывают корзину со скидкой, калькулятор, бланки, архив партий, все отзывы и портреты.

Используется headless Chrome; физические устройства не проверялись. Скриншоты пользователю не прилагаются. Протокол выполнения — в журнале аудита.
