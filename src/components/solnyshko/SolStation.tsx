import { STATION_PROGRAMS } from "../../data/solnyshko";

function SolStation() {
  return (
    <section id="sol-station" className="sol-section">
      <div className="sol-container">
        <span className="sol-label">Стационарное отделение</span>
        <h2 className="sol-title">
          Уринотерапия в условиях <em>стационара</em>
        </h2>
        <p className="sol-sub"> Три срока пребывания. В недельном курсе считают приёмы продукции, в длительном — партии. Именной стакан входит во все программы. </p>
        <div className="sol-station">
          {STATION_PROGRAMS.map((p) => (
            <article key={p.name} className="sol-card">
              <div className="sol-station__days">{p.days}</div>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </div>
        <aside className="sol-supplier" aria-label="Поставщик продукции для уринотерапии">
          <div>
            <span className="sol-label">Производитель продукции — ООО «УринаТех»</span>
            <h3>От производственной линии до именного стакана</h3>
            <p>Для стационарных курсов используют продукцию серии УТ. «УринаТех» ведёт сбор, фильтрацию и консервацию, присваивает каждой партии номер. В каталоге производителя приведены составы, серии и условия поставки; в реестре можно проверить номер партии.</p>
          </div>
          <div className="sol-supplier__links">
            <a className="sol-btn" href="#/urinatech">О производителе — УринаТех <span aria-hidden="true">↗</span></a>
            <a className="sol-link" href="#/urinatech?section=products">Каталог продукции →</a>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default SolStation;
