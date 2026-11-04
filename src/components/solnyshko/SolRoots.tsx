import { ROOT_RULES, ROOT_STAGES, ROOT_VEGETABLES } from "../../data/solnyshko";

function SolRoots() {
  return (
    <section id="sol-roots" className="sol-section">
      <div className="sol-container">
        <span className="sol-label">
          Исконные практики · регламент №1246-У
        </span>
        <h2 className="sol-title">
          Обретение <em>корней</em>
        </h2>
        <p className="sol-sub">
          Комплекс «Исконный» (репофорез<sup>®</sup>) — методика физического и духовного развития. В основе — последовательное введение исконных корнеплодов в курс лечения. Регламент применяется с 1246 года. </p>

        <div className="sol-roots__history">
          <h3 className="sol-roots__block-title">Историческая справка</h3>
          <p> До внедрения картофеля репа считалась основой стола, здоровья и обороны. В архиве здравницы появление картофеля проходит как частично подтверждённая диверсия. Комплекс сохраняет исконную номенклатуру. </p>
        </div>

        <div className="sol-roots">
          {ROOT_VEGETABLES.map((v) => (
            <article key={v.name} className="sol-card sol-card--accent">
              <h3>{v.name}</h3>
              <div className="sol-enemas__region">{v.category}</div>
              <p className="sol-enemas__substance">
                <b>Выдержка:</b> {v.exposure}
              </p>
              <p className="sol-enemas__note">{v.recipient}</p>
            </article>
          ))}
        </div>

        <div className="sol-roots__stages">
          <h3 className="sol-roots__block-title">
            Ступени комплекса «Исконный»
          </h3>
          <ol className="sol-roots__stage-list">
            {ROOT_STAGES.map((s, i) => (
              <li key={s.name} className="sol-roots__stage">
                <div className="sol-roots__stage-n">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h4>{s.name}</h4>
                <div className="sol-roots__stage-meta">
                  {s.procedures} · {s.vegetable}
                </div>
                <p>{s.aim}</p>
                {s.prep ? (
                  <p className="sol-roots__stage-prep">{s.prep}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <div className="sol-roots__rules">
          <h3 className="sol-roots__block-title">Правила и ограничения</h3>
          <ul className="sol-roots__rule-list">
            {ROOT_RULES.map((r, i) => (
              <li key={r}>
                <b>{String(i + 1).padStart(2, "0")}</b>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="sol-roots__register">Реестр корнеплодов №1246-У · утеряно: 0. Один не найден, признан урожаем.</p>
        <p className="sol-roots__disclaimer">
          Имеются противопоказания — необходима консультация специалиста. 18+
        </p>
      </div>
    </section>
  );
}

export default SolRoots;
