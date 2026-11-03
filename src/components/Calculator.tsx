import { quantity } from "../format";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/RootStore";

function Calculator() {
  const { calc } = useStore();
  const r = calc.result;

  return (
    <section id="calculator">
      <div className="container">
        <span className="section-label">Прил. Б · Система «УТ-Интеллект» · бета</span>
        <h2 className="section-title">
          Расчёт <span className="grad-text">дозировки</span>
        </h2>
        <p className="section-sub"> Расчёт продукта и потребности на курс по параметрам пациента. Используется внутренняя методика компании. </p>
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
                  min="0"
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

          <div className="calc-result">
            <div className="calc-result__row">
              <span>Рекомендуемый продукт</span>
              <strong>{r.product}</strong>
            </div>
            <div className="calc-result__row">
              <span>Схема приёма</span>
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
                {r.liters.toLocaleString("ru-RU")} л ({r.canisters} × УТ-БК-10)
              </strong>
            </div>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}> Расчёт не является медицинской рекомендацией. Имеются противопоказания. Необходима консультация специалиста. 18+. </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default observer(Calculator);
