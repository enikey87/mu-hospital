import { TEAM } from "../data/company";

function Company() {
  return (
    <section id="company">
      <div className="container">
        <span className="section-label">П.9 · О компании</span>
        <h2 className="section-title">Корпоративное управление</h2>
        <p className="section-sub"> Компания основана в 2002 году как Московский Институт Обогащения Урины. Производство, поставки и наблюдения ведутся отдельными подразделениями. </p>

        <h3 className="subsection-title">Руководство</h3>
        <div className="team-grid">
          {TEAM.map((m) => (
            <div key={m.name} className="glass team-card">
              <div className="team-card__name">{m.name}</div>
              <div className="team-card__role">{m.role}</div>
              <div className="team-card__bio">{m.bio}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Company;
