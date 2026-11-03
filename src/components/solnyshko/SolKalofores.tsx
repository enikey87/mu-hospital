import { KALO_MODES, KALO_SUBSTANCES, KALO_ULTIMATE } from "../../data/solnyshko";

function SolKalofores() {
  return (
    <section id="sol-kalofores" className="sol-section sol-section--wide">
      <div className="sol-container">
        <span className="sol-label">Уникальная разработка · заявка на патент №1246-К</span>
        <h2 className="sol-title">
          Калофорез<sup>®</sup> — перенятие силы <em>зверя</em>
        </h2>
        <p className="sol-sub"> Метод перенятия силы зверя с использованием биосубстанций «КалоМедведь» и «КалоОлень». Процедура проводится на аппарате «Калофорез-Кедр М2». Рабочая сила тока — 4,2 мА. Разработка — заявка №1246-К. </p>

        <div className="sol-kalo">
          {KALO_SUBSTANCES.map((s) => (
            <article key={s.name} className="sol-card sol-card--accent">
              <h3>{s.name}</h3>
              <div className="sol-enemas__region">{s.source}</div>
              <p className="sol-enemas__substance">{s.collection}</p>
              <p className="sol-enemas__note">{s.effect}</p>
            </article>
          ))}
        </div>

        <div className="sol-device">
          <div className="sol-device__head">
            <h3>Аппарат «Калофорез-Кедр М2»</h3>
            <span className="sol-badge"> М2 · два режима субстанции </span>
          </div>
          <div className="sol-device__modes">
            {KALO_MODES.map((m) => (
              <div key={m.name} className="sol-device__mode">
                <div className="sol-device__mode-name">{m.name}</div>
                <div className="sol-device__mode-current">{m.current}</div>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
          <div className="sol-device__row">
            <div>
              <b>Показания:</b> Упадок сил, нарушение сезонного режима отдыха. </div>
            <div>
              <b>Противопоказания:</b> Имеются противопоказания. Необходима консультация специалиста. 18+. </div>
          </div>
        </div>

        <div className="sol-ultimate">
          <div className="sol-ultimate__head">
            <h3>{KALO_ULTIMATE.name}</h3>
            <span className="sol-badge">для особых случаев · {KALO_ULTIMATE.code}</span>
          </div>
          <p className="sol-ultimate__intro">{KALO_ULTIMATE.intro}</p>
          <div className="sol-ultimate__nails">
            <div className="sol-ultimate__nail sol-ultimate__nail--folk">
              <b>{KALO_ULTIMATE.folk.title}</b>
              <p>{KALO_ULTIMATE.folk.text}</p>
              <p className="sol-ultimate__case">
                <b>{KALO_ULTIMATE.folk.caseTitle}.</b> {KALO_ULTIMATE.folk.caseText}
              </p>
            </div>
            <div className="sol-ultimate__nail sol-ultimate__nail--official">
              <b>{KALO_ULTIMATE.official.title}</b>
              <p>{KALO_ULTIMATE.official.text}</p>
              <p className="sol-ultimate__case">
                <b>{KALO_ULTIMATE.official.altTitle}.</b> {KALO_ULTIMATE.official.altText}
              </p>
            </div>
          </div>
          <p className="sol-ultimate__ban">⚠ {KALO_ULTIMATE.ban}</p>
          <p className="sol-ultimate__last">{KALO_ULTIMATE.ifNotHelped}</p>
        </div>
      </div>
    </section>
  );
}

export default SolKalofores;
