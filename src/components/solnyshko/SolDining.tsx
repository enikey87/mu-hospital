import { DINING } from "../../data/solnyshko";

function SolDining() {
  return (
    <section id="sol-dining" className="sol-section">
      <div className="sol-container">
        <span className="sol-label">Питание</span>
        <h2 className="sol-title">
          {DINING.title}: <em>питание в пансионате</em>
        </h2>
        <p className="sol-sub">{DINING.rule}</p>
        <div className="sol-dining">
          <ul className="sol-dining__menu">
            {DINING.menu.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <p className="sol-dining__note">{DINING.note}</p>
        </div>
      </div>
    </section>
  );
}

export default SolDining;
