import { MEDIA } from "../data/media";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <img className="hero-photo" src={MEDIA.production} alt="Стеклянная ёмкость с продукцией на линии фильтрации" width="1536" height="1024" loading="eager" />
      <div className="container hero-content">
        <span className="section-label">УринаТех · Производственно-исследовательская компания</span>
        <h1 className="hero-title">Производство<br />полного цикла</h1>
        <p className="hero-motto">Русская моча против<br />скальпеля врача</p>
        <p className="hero-sub">
          Сбор сырья, фильтрация и консервация.
          Контроль качества каждой партии по рецептурам с 1246 года.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#products">Каталог продукции <span aria-hidden="true">↗</span></a>
          <a className="hero-secondary" href="#donor">Донорская программа</a>
        </div>
      </div>
      <div className="hero-foot">
        <div className="container hero-badges">
          <span className="hero-badge">Основана в 2002 году</span>
          <span className="hero-badge">Производственная линия №4</span>
          <span className="hero-badge">18+ · имеются противопоказания</span>
        </div>
      </div>
    </section>
  );
}
