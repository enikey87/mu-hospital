import { observer } from "mobx-react-lite";
import { UG9_PRODUCT } from "../data/catalog";
import { useStore } from "../stores/RootStore";

const BENEFITS = [
  ["Удержание до 12 атм", "Говно остаётся внутри при давлении, на которое стандартное кольцо не выдаёт никаких обязательств."],
  ["Работа с жидкой фракцией", "Понос удерживается без предварительного сгущения. Консистенция не является основанием для разгерметизации."],
  ["Пивостойкое исполнение", "Пшеничное пиво не проходит. Наличие дрожжей и степень фильтрации на результат не влияют."],
  ["Нормально закрытая конструкция", "Исходное положение — закрыто. Сон, чихание и потеря самообладания не считаются командой на открытие."],
  ["Ручное разрешение сброса", "Момент раскрытия определяет владелец. Автоматический сброс по инициативе среды конструкцией не предусмотрен."],
  ["Два контура уплотнения", "Основной и резервный контуры работают последовательно. При износе первого содержимое остаётся в пределах узла."],
  ["Сменная манжета", "Изнашиваемый элемент заменяется отдельно от кольца. Списание владельца вместе с уплотнением не требуется."],
  ["Энергонезависимое удержание", "Батарея, Bluetooth и подписка не нужны. Отключение интернета не приводит к открытию кольца."],
  ["Индивидуальный паспорт", "Номер узла, комплектность и результат заводской приёмки прилагаются. За удержание отвечает конкретное изделие."],
];

function Ug9Offer() {
  const { cart } = useStore();
  return (
    <section id="ug9" className="ug9" aria-labelledby="ug9-title">
      <div className="container">
        <div className="ug9-heading">
          <span className="section-label">Специальное машиностроение · ТУ УГ-09.12</span>
          <span className="ug9-edition">Узел удержания / серия 09</span>
        </div>
        <div className="ug9-overview">
          <div className="ug9-copy">
            <h2 className="section-title" id="ug9-title">Анальное кольцо УГ-9</h2>
            <p className="ug9-lead">Замена стандартного анального кольца на узел с паспортом.</p>
            <p className="ug9-description">Стандартное кольцо поставляется без указания рабочего давления. УГ-9 удерживает говно до 12 атм. Понос не проходит. Пшеничное пиво не проходит.</p>
            <dl className="ug9-rating">
              <div><dt>Давление удержания</dt><dd>до 12 <span>атм</span></dd></div>
              <div><dt>Отличительных свойств</dt><dd>09</dd></div>
            </dl>
            <div className="ug9-purchase">
              <p className="ug9-price">{UG9_PRODUCT.price.toLocaleString("ru-RU")} ₽ <span>/ {UG9_PRODUCT.unit}</span></p>
              <button className="btn btn-primary" onClick={() => cart.add(UG9_PRODUCT)}>Включить УГ-9 в спецификацию</button>
              <p>Кольцо, сменная манжета, паспорт. Стоимость замены в цену комплекта не входит.</p>
            </div>
          </div>
          <figure className="ug9-drawing">
            <div className="ug9-drawing__label"><span>УГ-9.00.000 СБ</span><span>Общий вид</span></div>
            <svg viewBox="0 0 480 420" role="img" aria-label="Схема узла УГ-9: кольцевая обойма, два контура уплотнения и запорные лепестки">
              <defs>
                <pattern id="ug9-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#c8c5ba" strokeWidth="0.5" /></pattern>
                <linearGradient id="ug9-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#dedbd1" /><stop offset="0.5" stopColor="#f8f6ef" /><stop offset="1" stopColor="#aaa99e" /></linearGradient>
              </defs>
              <rect width="480" height="420" fill="url(#ug9-grid)" />
              <path d="M40 210H440M240 24V396" stroke="#62635d" strokeDasharray="10 5 2 5" />
              <circle cx="240" cy="210" r="156" fill="url(#ug9-metal)" stroke="#1b1d1c" strokeWidth="2" />
              <circle cx="240" cy="210" r="140" fill="none" stroke="#62635d" />
              <circle cx="240" cy="210" r="116" fill="#1b1d1c" stroke="#1b1d1c" strokeWidth="8" />
              <circle cx="240" cy="210" r="103" fill="none" stroke="#c73522" strokeWidth="8" />
              <circle cx="240" cy="210" r="89" fill="#62635d" stroke="#efede6" />
              {[0, 60, 120, 180, 240, 300].map(angle => <g key={angle} transform={`rotate(${angle} 240 210)`}>
                <circle cx="240" cy="81" r="6" fill="#1b1d1c" />
                <path d="M240 124L260 210L240 210L220 173Z" fill="#babbb1" stroke="#1b1d1c" />
              </g>)}
              <circle cx="240" cy="210" r="10" fill="#1b1d1c" />
              <path d="M344 105L408 46H454M329 192H420" fill="none" stroke="#c73522" strokeWidth="1.5" />
              <text x="420" y="37" fill="#1b1d1c" fontSize="14">01</text>
              <text x="426" y="197" fill="#1b1d1c" fontSize="14">02</text>
            </svg>
            <figcaption><span>01 — несущая обойма</span><span>02 — двойное уплотнение</span><span>Схема изделия · без масштаба</span></figcaption>
          </figure>
        </div>
        <div className="ug9-properties">
          <h3>Девять свойств одного кольца</h3>
          <ol className="ug9-benefits">
            {BENEFITS.map(([title, description], index) => <li className="ug9-benefit" key={title}>
              <span className="ug9-benefit__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div><h4>{title}</h4><p>{description}</p></div>
            </li>)}
          </ol>
        </div>
        <div className="ug9-tables">
          <table>
            <caption>Что меняется при замене</caption>
            <thead><tr><th scope="col">Параметр</th><th scope="col">Стандартное кольцо</th><th scope="col">УГ-9</th></tr></thead>
            <tbody>
              <tr><th scope="row">Рабочее давление</th><td>В паспорте не указано</td><td>До 12 атм</td></tr>
              <tr><th scope="row">Условия раскрытия</th><td>По обстоятельствам</td><td>По разрешению владельца</td></tr>
              <tr><th scope="row">Документация</th><td>Без паспорта</td><td>Индивидуальный паспорт узла</td></tr>
            </tbody>
          </table>
          <table>
            <caption>Удерживаемые среды · закрытый контур, до 12 атм</caption>
            <thead><tr><th scope="col">Среда</th><th scope="col">Прохождение</th></tr></thead>
            <tbody>{["Говно", "Понос", "Пшеничное пиво"].map(medium => <tr key={medium}><th scope="row">{medium}</th><td>Не проходит</td></tr>)}</tbody>
          </table>
        </div>
        <p className="ug9-footnote">Комплектация и характеристики приведены по ТУ УГ-09.12. Спецификация носит справочный характер. Имеются противопоказания. Необходима консультация специалиста. 18+.</p>
      </div>
    </section>
  );
}

export default observer(Ug9Offer);
