import { COLD_REGISTER, COLD_RESERVES } from "../../data/solSpecialPrograms";

function SolMorozko() {
  return (
    <section id="sol-morozko" className="sol-section sol-special sol-special--cold">
      <div className="sol-container">
        <span className="sol-label">Холодовое отделение · фонд №1246-М</span>
        <h2 className="sol-title">Природное сырьё. Холодный расчёт.</h2>
        <p className="sol-sub">Происхождение важнее температуры. В резерв принимается партия с паспортом; безымянный пакет из морозилки основанием для программы не считается.</p>
        <div className="sol-special__cards">
          {COLD_RESERVES.map(item => <article className="sol-card" key={item.name}>
            <span className="sol-label">{item.source}</span><h3>{item.name}</h3><p>{item.text}</p>
          </article>)}
        </div>
        <div className="sol-special__register">
          <div><span className="sol-label">Сопроводительные документы</span><h3>Холодовая цепочка заканчивается подписью</h3><p>За каждой кассетой закреплено место. За каждым местом — ответственный. Пропажа из резерва считается утратой материала, даже если на месте осталась лужа.</p></div>
          <dl>{COLD_REGISTER.map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
        </div>
        <aside className="sol-special__notice"><span className="sol-label">Условия программы</span><h3>Разморозка в стоимость программы не входит.</h3><p>Хранение, выдача и оттаивание — отдельные строки учёта. Замороженная цена распространяется только на хранение.</p></aside>
        <div className="sol-special__partner"><div><span className="sol-label">Производственный партнёр</span><h3>УринаТех — паспорта партий и учёт сырья</h3><p>Происхождение материала подтверждается до включения в резерв.</p></div><a className="sol-btn sol-btn--ghost" href="#/urinatech?section=urinatorium">Уринаторий «УринаТех» ↗</a></div>
        <a className="sol-special__related" href="#/solnyshko/kalofores">Свойства зверя и архив калофореза ↗</a>
      </div>
    </section>
  );
}

export default SolMorozko;
