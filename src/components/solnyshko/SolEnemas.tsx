import { ENEMAS } from "../../data/solnyshko";

function SolEnemas() {
  return (
    <section id="sol-enemas" className="sol-section">
      <div className="sol-container">
        <span className="sol-label">Клизмотроника™ · двенадцать рецептур</span>
        <h2 className="sol-title">
          Гидратация природными богатствами <em>России</em>
        </h2>
        <p className="sol-sub"> Рецептуры на основе природного сырья. Для каждой указаны место происхождения и состав. Подбор рецептуры производится при назначении курса. </p>
        <div className="sol-enemas">
          {ENEMAS.map((e) => (
            <article key={e.id} className="sol-card sol-card--sm">
              <h3>{e.name}</h3>
              <div className="sol-enemas__region">{e.region}</div>
              <p className="sol-enemas__substance">{e.substance}</p>
              <p className="sol-enemas__note">{e.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SolEnemas;
