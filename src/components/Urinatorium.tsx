import { observer } from "mobx-react-lite";
import { SUNSHINE_PRODUCT, ISOLATE_PRODUCT } from "../data/catalog";
import { MEDIA } from "../data/media";
import { useStore } from "../stores/RootStore";

const FEATURES = [
  ["Сменная донорская кассета", "Новый донор — без замены аппарата."],
  ["Именной тубус", "Персональный контакт с результатами коллективного труда."],
  ["Прослеживаемость каждого вдоха", "Номер партии сохраняется в журнале процедур."],
  ["Контроль остатка", "Аппарат заблаговременно сообщает об истощении донора."],
  ["Комплект «Семейный»", "Один источник. Раздельные тубусы."],
];

function Urinatorium() {
  const { cart } = useStore();
  return (
    <section id="urinatorium" className="urinatorium" aria-labelledby="urinatorium-title">
      <div className="container">
        <div className="urinatorium-source">
          <div>
            <span className="section-label">Сырьевая база · серия УТ-И1</span>
            <h2 className="section-title" id="urinatorium-title">Изолят отборной мочи</h2>
            <p className="urinatorium-lead">Утренний сбор. Аттестованный донор. Паспорт каждой партии.</p>
          </div>
          <div className="urinatorium-source__copy">
            <p>Для производства изолята принимается только сырьё, прошедшее донорскую комиссию. Происхождение, рацион и индивидуальные особенности поставщика фиксируются в документации. Анонимная моча в высокотехнологичном производстве не используется.</p>
            <p>Отбор проходит донор. Преимущества получаете вы.</p>
            <p className="urinatorium-signature">Мы знаем каждого, кто стоит за вашей партией.</p>
          </div>
        </div>
        <ol className="urinatorium-chain" aria-label="Производственный цикл">
          {["Отбор донора", "Обогащение сырья", "Паспорт партии"].map((step, index) => <li key={step}><span aria-hidden="true">0{index + 1}</span>{step}</li>)}
        </ol>
        <div className="urinatorium-device">
          <figure className="urinatorium-photo">
            <img src={MEDIA.sunshineProduct} alt="Солнышко-У — аппарат со сменной янтарной кассетой и двумя индивидуальными тубусами" width="1254" height="1254" loading="lazy" />
            <figcaption><span>УТ-А1 / Солнышко-У</span><span>Семейная комплектация</span></figcaption>
          </figure>
          <div className="urinatorium-device__copy">
            <span className="section-label">Аппаратное направление</span>
            <h3>Солнышко-У</h3>
            <p className="urinatorium-lead">Ваш персональный уринаторий. Теперь дома.</p>
            <p>Аппарат индивидуальной уриноингаляции на основе изолята отборной мочи. Закрытая сменная кассета, именной тубус и учёт использованных партий.</p>
            <p>Раньше для посещения уринатория требовалась путёвка. Теперь достаточно освободить место на тумбочке.</p>
            <dl className="catalog-spec">
              <div><dt>Комплект</dt><dd>Аппарат, кассета, два индивидуальных тубуса, журнал процедур</dd></div>
              <div><dt>Сырьё</dt><dd>УТ-И1 · изолят отборной мочи</dd></div>
              <div><dt>Учёт</dt><dd>Номер партии и именной донор</dd></div>
            </dl>
            <p className="urinatorium-price">{SUNSHINE_PRODUCT.price.toLocaleString("ru-RU")} ₽ <span>/ {SUNSHINE_PRODUCT.unit}</span></p>
            <button className="btn btn-primary" onClick={() => cart.add(SUNSHINE_PRODUCT)}>Включить аппарат в спецификацию</button>
          </div>
        </div>
        <ol className="urinatorium-features">
          {FEATURES.map(([title, description], index) => <li className="urinatorium-feature" key={title}>
            <span className="urinatorium-feature__number" aria-hidden="true">0{index + 1}</span><h4>{title}</h4><p>{description}</p>
          </li>)}
        </ol>
        <div className="urinatorium-refill">
          <div><span className="section-label">Расходные материалы · УТ-И1</span><h3>Отборная моча заслуживает собственного аппарата.</h3><p>Сменная донорская кассета для «Солнышка-У». Происхождение указано в паспорте партии. Аппарат и тубусы приобретаются в составе семейного комплекта.</p></div>
          <div><p className="urinatorium-price">{ISOLATE_PRODUCT.price.toLocaleString("ru-RU")} ₽ <span>/ {ISOLATE_PRODUCT.unit}</span></p><button className="btn btn-primary" onClick={() => cart.add(ISOLATE_PRODUCT)}>Добавить кассету</button></div>
        </div>
        <p className="urinatorium-note">Спецификация носит справочный характер. Оплата и поставка по ней не выполняются. Имеются противопоказания. Необходима консультация специалиста. 18+.</p>
      </div>
    </section>
  );
}

export default observer(Urinatorium);
