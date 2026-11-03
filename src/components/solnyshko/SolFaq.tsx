import { SOL_FAQ } from "../../data/solnyshko";

function SolFaq() {
  return (
    <section id="sol-faq" className="sol-section">
      <div className="sol-container">
        <span className="sol-label">Вопросы отдыхающих</span>
        <h2 className="sol-title">Частые вопросы</h2>
        <div className="sol-faq">
          {SOL_FAQ.map((f) => (
            <details key={f.q} className="sol-faq__item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SolFaq;
