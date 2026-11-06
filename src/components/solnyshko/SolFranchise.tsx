import { useState } from "react";
import { MEDIA } from "../../data/media";
import { KALO_SUBSTANCES } from "../../data/solnyshko";
import SolHeader from "./SolHeader";
import SolFooter from "./SolFooter";

const PACKAGE_PRICE = 124600;
const money = (amount: number) => `${amount.toLocaleString("ru-RU")} ₽`;

export default function SolFranchise() {
  const [city, setCity] = useState("");
  const [rooms, setRooms] = useState(1);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ city: string; rooms: number } | null>(null);

  return <>
    <SolHeader />
    <main className="sol-franchise">
      <section className="sol-detail__hero">
        <div className="sol-container">
          <nav className="sol-breadcrumbs" aria-label="Хлебные крошки"><a href="#/">«Солнышко»</a><span aria-hidden="true">/</span><a href="#/solnyshko/kalofores">Калофорез</a><span aria-hidden="true">/</span><span aria-current="page">Франшиза</span></nav>
          <div className="sol-detail__hero-grid">
            <div>
              <span className="sol-label">Партнёрская программа здравницы</span>
              <h1>Франшиза калофореза</h1>
              <p className="sol-detail__lead">Откройте кабинет с аппаратом «Калофорез-Кедр М2». Силу зверя теперь можно получить в своём районе.</p>
              <div className="sol-detail__actions"><a className="sol-btn" href="#/solnyshko/franchise?section=franchise-brief">Рассчитать комплект ↗</a><a className="sol-link" href="#/solnyshko/franchise?section=franchise-kit">Состав франшизы</a></div>
            </div>
            <img src={MEDIA.kalofores} alt="Аппарат «Калофорез-Кедр М2» с закрытыми кассетами для медвежьей и оленьей субстанций" width="1536" height="1024" loading="eager" />
          </div>
          <dl className="sol-detail__facts"><div><dt>Паушальный взнос</dt><dd>{money(PACKAGE_PRICE)} / кабинет</dd></div><div><dt>Аппарат</dt><dd>М2 · три режима · 4,2 мА</dd></div><div><dt>Роялти</dt><dd>4,2% от выручки кабинета</dd></div></dl>
        </div>
      </section>
      <section className="sol-section" id="franchise-kit">
        <div className="sol-container">
          <span className="sol-label">Один кабинет · полный комплект</span>
          <h2 className="sol-title">Аппарат, субстанции и порядок учёта</h2>
          <div className="sol-franchise__grid">
            <article><span>01 / Оснащение</span><h3>«Калофорез-Кедр М2»</h3><p>Один аппарат, две кассеты, паспорт и журнал обслуживания. Медвежий, олений и смешанный таёжный режимы. Гвоздевой комплект М2-ГВ предназначен для рамки с документом; к электрической сети он не подключается.</p></article>
            <article><span>02 / Снабжение</span><h3>Две биосубстанции</h3><p>{KALO_SUBSTANCES.map(s => s.name).join(" и ")}. Стартовые партии входят в комплект. Дальнейшие поставки согласуются с сезоном сбора. Дополнительная заготовка в период спячки не предусмотрена.</p></article>
            <article><span>03 / Сопровождение</span><h3>Подготовка персонала</h3><p>Обучение оператора, карты наблюдения и регламент возврата мигрирующих клиентов. Учетно-методический пакет по заявке №1246-К. Право на вывеску не заменяет разрешений на работу кабинета.</p></article>
          </div>
        </div>
      </section>
      <section className="sol-section sol-franchise__conditions" id="franchise-terms">
        <div className="sol-container">
          <span className="sol-label">Условия открытия</span>
          <h2 className="sol-title">Помещение ваше. Повадки — наши.</h2>
          <div className="sol-franchise__grid">
            <article><h3>Подготовьте кабинет</h3><p>Процедурная зона, отдельное хранение кассет и место для сезонного отдыха клиентов. Медвежья программа планируется с ноября по март; длительный сон учитывается в загрузке помещения.</p></article>
            <article><h3>Согласуйте территорию</h3><p>Закрепляется адрес кабинета, а не миграционный маршрут стада. Клиент оленьей программы может покинуть район обслуживания по собственной сезонной инициативе.</p></article>
            <article><h3>Учитывайте расходы</h3><p>Взнос включает стартовый комплект и подготовку одного оператора. Аренда, ремонт, доставка, последующие партии и обязательные разрешения оплачиваются отдельно. Роялти — 4,2% от выручки кабинета.</p></article>
          </div>
          <p className="sol-franchise__note">Окупаемость зависит от расходов и загрузки. Количество медведей в регионе не принимается за прогноз спроса. Медицинская лицензия здравнице не выдавалась; документы франшизы не являются медицинской лицензией.</p>
        </div>
      </section>
      <section className="sol-section" id="franchise-brief">
        <div className="sol-container sol-franchise__brief">
          <div><span className="sol-label">Предварительная комплектация</span><h2 className="sol-title">Ваш первый кабинет калофореза</h2><p className="sol-sub">Укажите город и количество кабинетов. На каждый кабинет предусмотрены один М2, стартовые партии и подготовка одного оператора.</p><p className="sol-franchise__note">Заявка не отправляется. Расчёт формируется на этой странице, данные не передаются. Он не подтверждает договор, поставку или оплату.</p></div>
          {result ? <div className="sol-franchise__result" role="status">
            <h3>Предварительный расчёт готов</h3><p>Город: <b>{result.city}</b></p><p>Кабинетов: {result.rooms} · аппаратов М2: {result.rooms}</p><p className="sol-franchise__total">{money(result.rooms * PACKAGE_PRICE)}</p><p>Стартовые комплекты. Доставка и последующие расходы — отдельно. Роялти — 4,2% от выручки.</p>
            <button className="sol-btn sol-btn--ghost" onClick={() => { setResult(null); setCity(""); setRooms(1); setError(""); }}>Новый расчёт</button>
          </div> : <form className="sol-form" onSubmit={event => {
            event.preventDefault();
            if (city.trim().length < 2) { setError("Укажите название города: не менее двух символов."); return; }
            setError(""); setResult({ city: city.trim(), rooms });
          }}>
            <label>Город открытия<input className="sol-input" value={city} onChange={event => { setCity(event.target.value); setError(""); }} required minLength={2} maxLength={80} autoComplete="address-level2" /></label>
            <label>Количество кабинетов<select className="sol-input" id="franchise-rooms" value={rooms} onChange={event => { const count = Number(event.target.value); if ([1, 2, 3].includes(count)) setRooms(count); }}>{[1, 2, 3].map(count => <option key={count} value={count}>{count}</option>)}</select></label>
            <output htmlFor="franchise-rooms" className="sol-franchise__total">{money(rooms * PACKAGE_PRICE)}</output>
            {error && <p role="alert">{error}</p>}
            <button className="sol-btn" type="submit">Сформировать расчёт</button>
          </form>}
        </div>
      </section>
    </main>
    <SolFooter />
  </>;
}
