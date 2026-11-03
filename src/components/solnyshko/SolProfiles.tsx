import { PROFILES } from "../../data/solnyshko";

function SolProfiles() {
  return (
    <section className="sol-section">
      <div className="sol-container">
        <span className="sol-label">Профили лечения</span>
        <h2 className="sol-title">
          Профили <em>программ</em>
        </h2>
        <p className="sol-sub"> Направления программ и применяемые методики. Состав курса определяется после консультации специалиста. </p>
        <div className="sol-station">
          {PROFILES.map((p) => (
            <article key={p.system} className="sol-card">
              <h3>{p.system}</h3>
              <ul className="sol-profiles__list">
                {p.indications.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <p className="sol-enemas__note">Метод: {p.method}.</p>
            </article>
          ))}
        </div>
        <p className="sol-profiles__contra"> Имеются противопоказания. Необходима консультация специалиста. Программы предназначены для совершеннолетних. 18+. </p>
      </div>
    </section>
  );
}

export default SolProfiles;
