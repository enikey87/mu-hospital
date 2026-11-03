import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/RootStore";
import SolEmblem from "./SolEmblem";

function SolHeader() {
  const { router } = useStore();

  return (
    <header className="sol-header">
      <div className="sol-topbar">
        <span>Профсоюзная путёвка · действует бессрочно</span>
        <span>форма №1246</span>
      </div>
      <div className="sol-header__inner">
        <a
          className="sol-header__brand"
          href="#/solnyshko"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <SolEmblem size={46} />
          <span>
            <span className="sol-header__name">Пансионат «Солнышко»</span>
            <span className="sol-header__sub">здравница закрытого типа</span>
          </span>
        </a>
        <div className="sol-header__actions">
          <button className="sol-link" onClick={() => router.goMain()}>
            <span className="sol-link__full">ООО «УринаТех» — основной сайт</span>
            <span className="sol-link__short">Основной сайт</span>
          </button>
          <button
            className="sol-btn"
            onClick={() =>
              document.getElementById("sol-booking")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Записаться на курс
          </button>
        </div>
      </div>
      <nav className="sol-nav" aria-label="Разделы пансионата">
        {[
          ["sol-services", "Программы"], ["sol-roots", "Исконный"],
          ["sol-rooms", "Проживание"], ["sol-dining", "Питание"],
          ["sol-staff", "Специалисты"], ["sol-documents", "Документы"],
          ["sol-faq", "Вопросы"],
        ].map(([id, label]) => (
          <button key={id} className="sol-link" onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}>
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}

export default observer(SolHeader);
