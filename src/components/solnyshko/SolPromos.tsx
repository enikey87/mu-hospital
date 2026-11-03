import { PROMOS } from "../../data/solnyshko";

function SolPromos() {
  return (
    <section className="sol-section">
      <div className="sol-container">
        <span className="sol-label">Специальные предложения</span>
        <h2 className="sol-title">Акции здравницы</h2>
        <p className="sol-sub"> Сезонные условия размещения и предложения для постоянных отдыхающих. </p>
        <div className="sol-promos">
          {PROMOS.map((p) => (
            <article key={p.name} className="sol-card sol-card--sm sol-card--accent">
              <span className="sol-badge">{p.tag}</span>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SolPromos;
