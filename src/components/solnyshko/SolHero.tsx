import { useState } from "react";
import SolEmblem from "./SolEmblem";
import { playNeigh } from "./neigh";

function SolHero() {
  const [neigh, setNeigh] = useState(0);

  const callConsultant = () => {
    setNeigh((count) => count + 1);
    playNeigh();
  };

  return (
    <section className="sol-hero">
      <div className="sol-container">
        <div className="sol-hero__emblem">
          <button
            type="button"
            className="sol-hero__emblem-btn"
            onClick={callConsultant}
            aria-label="Позвать консультанта — Зинаиду"
          >
            <SolEmblem size={130} decorative />
          </button>
          {neigh > 0 && (
            <span className="sol-hero__emblem-reply" role="status" key={neigh}>
              «И-го-го» — Зинаида
            </span>
          )}
        </div>
        <div className="sol-hero__text">
          <span className="sol-label"> Учреждение ООО «УринаТех» · Республика Алтай </span>
          <h1 className="sol-hero__title">Пансионат «Солнышко»</h1>
          <div className="sol-hero__name">
            Здоровье — в стакане
          </div>
          <p className="sol-hero__sub"> Стационарные программы уринотерапии, клизмотроники и калофореза. Закрытая территория, круглосуточное наблюдение, режим тишины. Приём отдыхающих ведётся с 1246 года. </p>
          <div className="sol-hero__cta">
            <button
              className="sol-btn sol-btn--big"
              onClick={() =>
                document.getElementById("sol-services")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Программы здравницы
            </button>
            <button
              className="sol-btn sol-btn--ghost"
              onClick={() =>
                document.getElementById("sol-booking")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Запись на курс
            </button>
          </div>
          <div className="sol-hero__badges">
            <span className="sol-badge">
              Категория: три звезды
            </span>
            <span className="sol-badge">Конная доставка от Горно-Алтайска включена</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SolHero;
