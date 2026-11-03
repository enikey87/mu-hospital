export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container">
        <span className="section-label">Производственно-исследовательская компания</span>
        <h1 className="hero-title">УринаТех</h1>
        <p className="hero-motto">Русская моча против скальпеля врача</p>
        <p className="hero-sub">
          Производство и поставка продукции серии УТ. Сбор сырья, фильтрация
          и консервация в едином производственном цикле.
          Контроль качества каждой партии по рецептурам с 1246 года.
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <a className="btn btn-primary" href="#products">Каталог продукции</a>
          <a className="btn btn-ghost" href="#donor">Донорская программа</a>
        </div>
        <div className="hero-badges">
          <span className="hero-badge">Основана в 2002 году</span>
          <span className="hero-badge">Производственная линия №4</span>
          <span className="hero-badge">18+ · имеются противопоказания</span>
        </div>
      </div>
    </section>
  );
}
