import { PARTNERS } from "../data/company";

function Partners() {
  return (
    <section className="section-slim">
      <div className="container">
        <span className="section-label">П.10 · Производственная кооперация</span>
        <div className="partners">
          {PARTNERS.map((p) => (
            <div key={p.name} className="glass partner">
              <div className="partner__name">{p.name}</div>
              <div className="partner__note">{p.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Partners;
