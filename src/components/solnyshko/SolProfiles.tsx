import { DAILY_ROUTINE } from "../../data/solnyshko";

function SolProfiles() {
  return (
    <section className="sol-section">
      <div className="sol-container">
        <span className="sol-label">Пребывание в пансионате</span>
        <h2 className="sol-title">Условия пребывания</h2>
        <div className="sol-station">
          {DAILY_ROUTINE.map(p => <article key={p.title} className="sol-card"><h3>{p.title}</h3><p>{p.text}</p></article>)}
        </div>
        <p className="sol-profiles__contra">Имеются противопоказания. Необходима консультация специалиста. Программы предназначены для совершеннолетних. 18+.</p>
      </div>
    </section>
  );
}

export default SolProfiles;
