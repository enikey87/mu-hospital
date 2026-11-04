import { FAQ } from "../data/catalog";

function Faq() {
  return (
    <section id="faq">
      <div className="container">
        <span className="section-label">Вопросы и ответы</span>
        <h2 className="section-title">Вопросы и ответы</h2>
        <div className="faq-list">
          {FAQ.map((f) => (
            <details key={f.q} className="glass faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
