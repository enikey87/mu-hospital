import { SOL_PROGRAMS } from "../../data/solPrograms";

function SolServices() {
  return (
    <section id="sol-services" className="sol-section sol-programs">
      <div className="sol-container">
        <span className="sol-label">Программы пребывания</span>
        <h2 className="sol-title">Направления здравницы</h2>
        <p className="sol-sub">Стационар, географический каталог клизмотроники, перенятие силы зверя и комплекс обретения корней.</p>
        <div className="sol-services">
          {SOL_PROGRAMS.map(p => (
            <article key={p.id} className={`sol-card sol-program-card--${p.id}`}>
              <a className="sol-program-card__image" href={`#/solnyshko/${p.id}`} tabIndex={-1} aria-hidden="true"><img src={p.image} alt="" width="1536" height="1024" loading="lazy" /></a>
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              <a className="sol-btn sol-btn--ghost" href={`#/solnyshko/${p.id}`}>О направлении <span className="visually-hidden">«{p.label}»</span><span aria-hidden="true"> ↗</span></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SolServices;
