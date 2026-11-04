import { SOL_STAFF } from "../../data/solnyshko";

function SolStaff() {
  return (
    <section id="sol-staff" className="sol-section">
      <div className="sol-container">
        <span className="sol-label">Персонал</span>
        <h2 className="sol-title"> Сотрудники и поставщики </h2>
        <div className="sol-staff">
          {SOL_STAFF.map((s) => (
            <article key={s.name} className="sol-card sol-card--sm">
              <h3>{s.name}</h3>
              <div className="sol-enemas__region">{s.role}</div>
              <div className="sol-staff__id">
                <span className="sol-staff__id-num">
                  {s.regalia.number === "б/н" ? "Удостоверение без номера" : `Удостоверение № ${s.regalia.number}`}
                </span>
                <span className="sol-staff__id-title">{s.regalia.title}</span>
                <span className="sol-staff__id-cat">
                  категория «{s.regalia.category}»
                </span>
                <span className="sol-staff__id-confirmed">
                  {s.regalia.confirmed}
                </span>
              </div>
              <p className="sol-enemas__note">{s.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SolStaff;
