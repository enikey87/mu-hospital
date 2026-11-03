import { useState } from "react";
import { MEDIA } from "../../data/media";
import { playNeigh } from "./neigh";

function SolHero() {
  const [neigh, setNeigh] = useState(0);

  const callConsultant = () => {
    setNeigh((count) => count + 1);
    playNeigh();
  };

  return (
    <section className="sol-hero">
      <img className="sol-hero__photo" src={MEDIA.resort} alt="Корпус пансионата среди сосен в горах Алтая" width="1536" height="1024" loading="eager" />
      <div className="sol-container sol-hero__content">
        <span className="sol-label">Пансионат «Солнышко» · Учреждение ООО «УринаТех»</span>
        <h1 className="sol-hero__title">Здоровье —<br />в стакане</h1>
        <div className="sol-hero__location"><span aria-hidden="true">↗</span> Республика Алтай</div>
        <p className="sol-hero__sub">Стационарные программы уринотерапии, клизмотроники и калофореза. Закрытая территория, круглосуточное наблюдение, режим тишины. Приём отдыхающих ведётся с 1246 года.</p>
        <div className="sol-hero__cta">
          <button className="sol-btn sol-btn--big" onClick={() => document.getElementById("sol-services")?.scrollIntoView({ behavior: "smooth" })}>
            Программы здравницы <span aria-hidden="true">↗</span>
          </button>
          <button className="hero-secondary" onClick={() => document.getElementById("sol-booking")?.scrollIntoView({ behavior: "smooth" })}>Запись на курс</button>
        </div>
      </div>
      <div className="sol-hero__foot">
        <div className="sol-container sol-hero__badges">
          <span>Категория: три звезды</span>
          <span>Конная доставка от Горно-Алтайска включена</span>
          <div className="sol-hero__consultant">
            <button type="button" onClick={callConsultant} aria-label="Позвать консультанта — Зинаиду">Консультант: Зинаида</button>
            {neigh > 0 && <span role="status" key={neigh}>«И-го-го» — Зинаида</span>}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SolHero;
