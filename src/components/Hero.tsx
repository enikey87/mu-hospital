import { MEDIA } from "../data/media";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <img className="hero-photo" src={MEDIA.production} alt="Стальной резервуар с янтарной жидкостью в цехе фильтрации" width="1536" height="1024" loading="eager" />
      <div className="container hero-content">
        <span className="section-label">Производственно-исследовательская компания</span>
        <h1 className="hero-title">Первый<br />уринаторий<br />в России</h1>
        <p className="hero-motto">Инновационные составы для вашего здоровья.</p>
        <p className="hero-sub">
          Отбор доноров, обогащение сырья и собственное аппаратное направление.
          Полный производственный цикл — от утреннего сбора до индивидуальной процедуры.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#/urinatech?section=products">Каталог продукции <span aria-hidden="true">↗</span></a>
          <a className="hero-secondary" href="#/urinatech?section=urinatorium">Солнышко-У ↗</a>
          <a className="hero-secondary" href="#/urinatech?section=ug9">УГ-9 · удержание до 12 атм →</a>
        </div>
        <p className="hero-disclaimer">Русская моча против скальпеля врача.<br />18+ · Имеются противопоказания</p>
      </div>
      <div className="hero-foot">
        <div className="container">
          <dl className="industrial-facts">
            <div><dt>Производство</dt><dd>Полный цикл</dd></div>
            <div><dt>Площадка</dt><dd>Линия №4</dd></div>
            <div><dt>Технология</dt><dd>Живая фильтрация</dd></div>
            <div><dt>Рецептуры</dt><dd>С 1246 года</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}
