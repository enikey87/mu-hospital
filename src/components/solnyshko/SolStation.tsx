import { STATION_PROGRAMS } from "../../data/solnyshko";

function SolStation() {
  return (
    <section id="sol-station" className="sol-section">
      <div className="sol-container">
        <span className="sol-label">Стационарное отделение</span>
        <h2 className="sol-title">
          Уринотерапия в условиях <em>стационара</em>
        </h2>
        <p className="sol-sub"> Круглосуточное наблюдение и личный стакан с гравировкой. Приёмы продукции и питание проводятся по графику выбранной программы. </p>
        <div className="sol-station">
          {STATION_PROGRAMS.map((p) => (
            <article key={p.name} className="sol-card">
              <div className="sol-station__days">{p.days}</div>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SolStation;
