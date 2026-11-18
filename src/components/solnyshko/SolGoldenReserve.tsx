import { DONOR_RESERVES, RESERVE_STATEMENT } from "../../data/solSpecialPrograms";

function SolGoldenReserve() {
  return (
    <section id="sol-golden-reserve" className="sol-section sol-special sol-special--reserve">
      <div className="sol-container">
        <span className="sol-label">Персональное обслуживание · досье №1246-ЗР</span>
        <h2 className="sol-title">УринаТех. Теперь ближе к сердцу.</h2>
        <p className="sol-sub">Три формы участия в донорской программе. Источник средств выбирается заранее; сведения о нём остаются в личном деле после закрытия резерва.</p>
        <div className="sol-special__cards">
          {DONOR_RESERVES.map(item => <article className="sol-card" key={item.name}>
            <span className="sol-label">{item.caption}</span><h3>{item.name}</h3><p>{item.text}</p><p className="sol-special__clause">{item.clause}</p>
          </article>)}
        </div>
        <div className="sol-special__register">
          <div><span className="sol-label">Выписка по программе</span><h3>В выписке указываются полученные средства</h3><p>Ни одна капля не проходит без записи. При закрытии программы отдыхающий получает историю поступлений, сведения об источнике и остатке. Доходность определяется впечатлениями вкладчика.</p></div>
          <dl>{RESERVE_STATEMENT.map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
        </div>
        <aside className="sol-special__notice"><span className="sol-label">Порядок пополнения</span><h3>Не всякий приток — поступление.</h3><p>Материал без паспорта не зачисляется. Просьба «считать своим» не заменяет подтверждение происхождения.</p></aside>
        <div className="sol-special__partner"><div><span className="sol-label">Именная донорская программа</span><h3>Источник вашего резерва — УринаТех</h3><p>Первый уринаторий в России ведёт отбор доноров и историю каждой партии.</p></div><a className="sol-btn sol-btn--ghost" href="#/urinatech?section=urinatorium">Уринаторий «УринаТех» ↗</a></div>
        <a className="sol-special__related" href="#/solnyshko/station">Другие программы стационарной уринотерапии ↗</a>
      </div>
    </section>
  );
}

export default SolGoldenReserve;
