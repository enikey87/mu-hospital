import { quantity } from "../format";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/RootStore";

function Calculator() {
  const { calc } = useStore();
  const r = calc.result;

  return (
    <section id="calculator">
      <div className="container">
        <span className="section-label">Система «УТ-Интеллект»</span>
        <h2 className="section-title">
          Расчёт <span className="grad-text">потребности</span>
        </h2>
        <p className="section-sub"> Объём на курс и количество тары по внутреннему протоколу компании. Расчёт предназначен для совершеннолетних. </p>
        <div className="glass calc-wrap">
          <div className="calc-form">
            <div className="calc-row">
              <label className="calc-field">
                Вес, кг
                <input
                  className="input"
                  type="number"
                  min="1"
                  value={calc.weight}
                  onChange={(e) => calc.setWeight(e.target.value)}
                />
              </label>
              <label className="calc-field">
                Возраст, лет
                <input
                  className="input"
                  type="number"
                  min="18"
                  value={calc.age}
                  onChange={(e) => calc.setAge(e.target.value)}
                />
              </label>
            </div>
            <label className="calc-field">
              Степень доверия традиционной медицине — {calc.trust}%
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={calc.trust}
                onChange={(e) => calc.setTrust(Number(e.target.value))}
              />
            </label>
            <p style={{ fontSize: 13, color: "var(--muted)" }}> Степень доверия учитывается при подборе серии и объёма продукции. </p>
          </div>

          <div className="calc-result" aria-live="polite">
            {r ? <>
            <div className="calc-result__row">
              <span>Расчётная серия</span>
              <strong>{r.product}</strong>
            </div>
            <div className="calc-result__row">
              <span>Объём по протоколу</span>
              <strong>
                по {quantity(r.cups, ["стакану", "стакана", "стаканов"])} × 3 раза в день
              </strong>
            </div>
            <div className="calc-result__row">
              <span>Курс</span>
              <strong>{quantity(r.course, ["день", "дня", "дней"])}</strong>
            </div>
            <div className="calc-result__row">
              <span>Потребность на курс</span>
              <strong>
                {r.liters.toLocaleString("ru-RU")} л
              </strong>
            </div>
            <div className="calc-result__row"><span>Фасовка к поставке</span><strong>{r.canisters} × 10 л — {r.canisters * 10} л</strong></div>
            </> : <p>Для расчёта укажите вес от 1 кг и возраст от 18 лет.</p>}
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}> Расчёт не является медицинской рекомендацией. Имеются противопоказания. Необходима консультация специалиста. 18+. </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default observer(Calculator);
