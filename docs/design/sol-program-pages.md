# Направления «Солнышка» и редактура контента

Решение оператора от 03.11.2026: расширить главные гэги на отдельных страницах с графикой; провести полный аудит содержания здравницы. Принят стиль промышленного холдинга из `industrial-holding.md`.

## Страницы

| Адрес после `/urinatech/` | Сюжет | Выбор в записи |
|---|---|---|
| `#/solnyshko/station` | От личного стакана до собственной партии; курсы стационара | «Утренний круг» |
| `#/solnyshko/enemas` | Процедурное путешествие по географическому каталогу | Клизмотроника |
| `#/solnyshko/kalofores` | Свойства зверя вместе с повадками, аппарат М2, архив 2007 года | Калофорез |
| `#/solnyshko/roots` | Обретение корней, ступени и севооборот, запись о Груздеве | «Исконный» |

На каждой странице: первый экран с иллюстрацией, сведения о курсе, развёрнутое описание, схема направления, подробный каталог или состав метода, переход к записи и ограничения. На главной — краткие анонсы направлений; полные каталоги перенесены на соответствующие страницы. Сохранены остальные разделы, портреты, отзывы и противопоказания.

Использован существующий hash-router: прямое открытие и обновление работают на GitHub Pages в подпути. У страниц отдельные заголовки и описания. Разделы главной адресуются через `?section=…`; неизвестный путь даёт 404. Навигация к записи переносит выбранную программу, сохраняет незавершённое имя, допускает новую заявку после завершённой и отменяет прежнюю незавершённую отправку при явном выборе нового курса.

Анкета учитывает способ прохождения курса. Срок различает стационарные программы; остальные направления возвращаются явно. Поле пожеланий к перенятию свойств показывается для калофореза и комплекса. Регистрация остаётся локальной демонстрацией без оплаты.

Полный редакторский отчёт: `docs/audits/2026-11-03-solnyshko-content.md`.

## Графика

Создана встроенным imagegen; изображения вымышленной здравницы и оборудования. Сохранены в WebP без изменения композиции: `public/images/sol-station.webp`, `sol-enemas.webp`, `sol-kalofores.webp`, `sol-roots.webp`. Схемы направлений оформлены средствами HTML/CSS и доступны как упорядоченные списки. Изображение корнеплодов показывается целиком.

Запросы генерации:

### sol-station.webp

Use case: photorealistic-natural. Asset type: wide editorial hero photograph for a fictional serious sanatorium's inpatient urine-therapy program. One heavy clear personal drinking glass containing golden amber liquid on a pale bedside laboratory tray, an understated blank patient chart and brushed steel carafe beside it. Background softly out of focus: immaculate white single sanatorium bed and daylight from a pine forest window. Understated institutional industrial holding aesthetic, cool white pale gray and navy with amber liquid. Photographic realism, precise glass reflections, honest materials. Wide 3:2 landscape composition, main glass on right half, quiet negative space on left. No people, no anatomy, no actual treatment being performed, no readable text, no emblems, no watermark, no UI.

### sol-enemas.webp

Use case: photorealistic-natural. Asset type: wide original editorial photograph for a fictional sanatorium's hydrotherapy department. A spotless contemporary procedure room, a polished stainless steel trolley holding a row of six sealed clear glass laboratory reservoirs filled with visually different natural liquids, pale gold, mineral clear, faint tea green. A simple clinical chair and cool white tiled wall in soft background, pine forest daylight from a window. Restrained credible institutional equipment photography, pale gray white and dark navy with natural muted liquids, meticulous real glass and steel. Landscape 3:2 composition, trolley and glassware on right, clear calm space left. No people, no bodies, no procedure, no visible electrical wiring or detailed DIY apparatus, no readable labels or numbers, no cartoon, no watermark, no UI.

### sol-kalofores.webp

Use case: product-mockup. Asset type: wide catalog photograph of a fictional sanatorium's invented physiotherapy apparatus, a deadpan serious industrial prop. A compact precision-made brushed aluminum tabletop device with restrained navy front panel, one analog gauge, two plain rotary controls, two sealed removable glass specimen cartridges with opaque dark earthy material, all neatly resting on a pale cool gray clinical worktop. The ONLY readable label on the front is "М2" in large simple navy sans-serif type. Believable manufactured product, quiet 1980s medical industrial design with contemporary immaculate condition, fine steel texture, natural daylight, serious documentary product shot. Landscape 3:2, device on right two thirds with space left. No humans, no bodies, no treatment being performed, no needles, no sockets, no nails, no plugs or wiring, no other text, no logos, no cartoon or UI.

### sol-roots.webp

Use case: product-mockup. Asset type: original wide specimen photograph for a fictional serious sanatorium's root-vegetable therapy catalog. On a pale cool gray steel laboratory specimen tray arranged neatly in one row: one small pale yellow turnip with purple shoulder, one round black radish, one dark beetroot, one yellow rutabaga, one narrow horseradish root. Whole actual natural roots, meticulous botanical detail, small traces of clean dry soil, no food preparation. Plain white blank specimen tags beside them, soft even northern daylight, restrained credible institutional catalog style, cool white gray navy palette and earthy botanical accents. Landscape 3:2. No humans, no anatomy, no treatment, no readable words, no logo, no cartoon, no collage, no UI.

## Проверка

`npm test`, `npm run build`. Для браузерного прогона при запущенном preview: `PLAYWRIGHT_MODULE=/path/to/playwright CHROME_BIN=/path/to/chrome node tools/verify-sol-programs.cjs`. Playwright устанавливается отдельно; зависимости проекта не изменены. `SITE_URL` задаёт адрес опубликованного сайта, `REPORT_PATH` — протокол. Необязательный `CAPTURE_DIR` сохраняет внутренние снимки в существующий каталог; к отчётам оператору они не прилагаются.
