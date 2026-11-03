import { SOL_DOCUMENTS } from "../../data/solnyshko";

function SolDocuments() {
  return (
    <section id="sol-documents" className="sol-section">
      <div className="sol-container">
        <span className="sol-label">Документы</span>
        <h2 className="sol-title">
          Лицензии и <em>документы</em>
        </h2>
        <p className="sol-sub"> Реквизиты документов пансионата. Архивные оригиналы хранятся в приёмной и у старшей сестры. </p>
        <div className="sol-docs">
          {SOL_DOCUMENTS.map((d) => (
            <article className="sol-doc" key={d.title}>
              <div className="sol-doc__head">
                <span
                  className={`sol-doc__status ${
                    d.ok === true
                      ? "sol-doc__status--ok"
                      : d.ok === false
                        ? "sol-doc__status--fail"
                        : "sol-doc__status--note"
                  }`}
                >
                  {d.status}
                </span>
              </div>
              <div className="sol-doc__no">{d.no}</div>
              <h3>{d.title}</h3>
              <p className="sol-doc__issuer">{d.issuer}</p>
              <p className="sol-doc__note">{d.note}</p>
              <div className="sol-doc__valid">
                <span>Срок действия</span>
                {d.valid}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SolDocuments;
