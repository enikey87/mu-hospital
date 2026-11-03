import { ENEMAS } from "../../data/solnyshko";

function SolEnemas() {
  return (
    <section id="sol-enemas" className="sol-section">
      <div className="sol-container">
        <span className="sol-label">Клизмотроника™ · двенадцать рецептур</span>
        <h2 className="sol-title">
          Географический <em>каталог</em>
        </h2>
        <p className="sol-sub"> Рецептуру записывают в путёвку под её полным названием. Регион и состав различают даже внутри минеральной, соляной и лесной групп. </p>
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
