import { INSERT_ROWS } from "../data/company";

function Instructions() {
  return (
    <section id="instructions">
      <div className="container">
        <span className="section-label">Документация к продукции</span>
        <h2 className="section-title">Инструкция по применению</h2>
        <p className="section-sub"> Вкладыш к продукции УТ-01 «Утренний». Для других серий применяются отдельные условия обработки и хранения. </p>
        <div className="insert">
          <div className="insert__grid">
            {INSERT_ROWS.map((row) => (
              <div className="insert__row" key={row.label}>
                <b>{row.label}</b>
                {row.text}
              </div>
            ))}
          </div>
          <div className="insert__foot"> ООО «УринаТех», производственная линия №4. При обращении указывайте номер партии. Продукция не является лекарственным средством. </div>
        </div>
      </div>
    </section>
  );
}

export default Instructions;
