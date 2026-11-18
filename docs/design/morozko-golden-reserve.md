# «Морозко» и «Золотой резерв»

По идеям автора и утверждённому развороту от 18.11.2026. Две самостоятельные программы «Солнышка», в существующем бело-синем оформлении здравницы. Карточки на главной и общая навигация ведут на подробные страницы; кнопки путёвки переносят направление в локальный справочный бланк.

- `#/solnyshko/morozko` — каловая криотерапия. «Природное сырьё. Холодный расчёт». Свойства медведя и оленя продолжают канон калофореза; холодовые партии имеют паспорт и журнал оттаивания. Спячка учитывается отдельно. Разморозка в стоимость программы не входит.
- `#/solnyshko/golden-reserve` — капельницы с уриной. «УринаТех. Теперь ближе к сердцу». «Собственный резерв», «Золотой стандарт» и «Семейный капитал» раскрыты через банковский язык: вкладчик, происхождение средств, пополнение, выписка. Разновидности описательные; бланк выбирает направление целиком.

У каждой программы своя фотография, метаданные, схема и подробные условия. Ссылки на уринаторий УринаТеха представлены отдельным партнёрским блоком. Юмор вымышленный; реальные медицинские инструкции, дозировки и подготовка материала отсутствуют. Оплата и отправка заявок не добавлены. Существующие дисклеймеры сохранены.

## Графика

Создана встроенным инструментом imagegen. Фотографии вымышленных предметов, без людей и проведения процедур. Сохранены как WebP quality 86 / method 6, без изменения размера и композиции, 1536×1024:

- `public/images/sol-morozko.webp` — оригинал `exec-069d86d3-b936-418c-a996-16b0f334244d.png`.
- `public/images/sol-golden-reserve.webp` — оригинал `exec-025b7b86-9fa0-44e1-a0d7-f14a40d7a4b7.png`.

Оригиналы: `/home/enikey/.codex/generated_images/01a1a0c8-80b7-77e2-8881-5ebc380b1558/`.

### Запрос «Морозко»

Use case: product-mockup. Asset type: landscape 3:2 editorial hero photograph for fictional Russian sanatorium program “Морозко”, fecal cryotherapy satire in a serious industrial wrapper. Primary subject: a precision made ivory and navy cryogenic specimen cabinet on a stainless clinical workbench, open upper compartment with three sealed squat dark amber glass specimen cartridges in a frosted steel rack. Earthy opaque contents are enclosed, no exposed feces. Fine frost on glass and cold condensation, one plain mechanical dial on front, a folded pale blue towel and blank batch passport nearby. Quiet pine forest daylight from blurred window, clean white gray navy institutional palette, restrained premium documentary equipment photography, natural materials, tactile brushed metal. Wide landscape composition at 1536x1024, cabinet on right two thirds, fully in frame. No people, no anatomy, no treatment, no needles, no tubing attached to a body, no readable text or logos, no temperature or procedural instructions, no emblems, no watermark, no UI. The image should look like a real professionally manufactured fictional prop, never sci-fi or cartoon.

### Запрос «Золотой резерв»

Use case: product-mockup. Asset type: landscape 3:2 editorial hero photograph for fictional sanatorium urine drip program “Золотой резерв”, grotesque satire presented like a serious premium financial institution. On a pale cool gray clinical worktop: a single sealed glass infusion reservoir holding clear warm golden amber liquid in a brushed steel stand, a coiled short translucent tube sealed at its end with a plain cap, no needle and no connection to any person; two spare sealed amber donor vials in a fitted navy tray, a closed dark navy personal dossier with no writing and a small brushed brass index tab. The donor reserve is treated like a precious bank deposit in the composition. Immaculate restrained clinical product photography, realistic glass refraction and amber reflections, cool white/navy setting, natural soft window light, faint pine forest blur far behind. Wide 1536x1024 3:2 landscape, main subject right two thirds and fully visible, no text overlay. No people, no anatomy, no body, no procedure performed, no needle, no puncture, no readable labels, no logos, no medication or regulatory claims, no dosage or preparation instructions, no watermark, no cartoon, no sci-fi, no UI.

## Проверка

`npm test` и `npm run build`. Новые контрактные тесты сначала падают без обеих программ; покрыты прямые и ошибочные маршруты, метаданные, контент, короткое имя, готовый бланк, сброс и отмена незавершённого оформления при смене направления.

`PLAYWRIGHT_MODULE=/path/to/playwright CHROME_BIN=/path/to/chrome node tools/verify-sol-programs.cjs` проверяет шесть направлений, переходы к производителю, историю браузера, перезагрузку, изображения, путёвки и отсутствие переполнения на 1440, 768, 390 и 320 px. `SITE_URL` задаёт опубликованный сайт, `REPORT_PATH` — файл результата. Отрицательный контроль: неверное ожидаемое количество карточек приводит к ошибке.
