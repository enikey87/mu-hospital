import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/RootStore";
import BrandMark from "../BrandMark";
import { SOL_PROGRAMS } from "../../data/solPrograms";

function SolHeader() {
  const { router, solnyshko } = useStore();
  const book = () => {
    const program = SOL_PROGRAMS.find(p => p.id === router.program);
    if (program) solnyshko.chooseProgram(program.booking);
    router.goSolnyshko("sol-booking");
  };

  return (
    <header className="sol-header">
      <div className="sol-topbar">
        <span>Профсоюзная путёвка · действует бессрочно</span>
        <span>форма №1246</span>
      </div>
      <div className="sol-header__inner">
        <a
          className="sol-header__brand"
          href="#/"
          onClick={(e) => {
            if (!router.program && !router.section) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <BrandMark size={46} />
          <span>
            <span className="sol-header__name">Пансионат «Солнышко»</span>
            <span className="sol-header__sub">здравница закрытого типа</span>
          </span>
        </a>
        <div className="sol-header__actions">
          <button
            className="sol-btn"
            onClick={book}
          >
            Путёвка
          </button>
        </div>
      </div>
      <nav className="sol-nav" aria-label="Разделы пансионата">
        {[
          ["#/?section=sol-services", "Направления"], ["#/solnyshko/station", "Уринотерапия"], ["#/solnyshko/roots", "Исконный"],
          ["#/?section=sol-rooms", "Проживание"], ["#/?section=sol-dining", "Питание"],
          ["#/?section=sol-staff", "Сотрудники"], ["#/?section=sol-documents", "Документы"],
          ["#/?section=sol-faq", "Вопросы"],
        ].map(([href, label]) => (
          <a key={href} className="sol-link" href={href} onClick={() => {
            const section = new URLSearchParams(href.split("?")[1]).get("section");
            if (section) document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
          }}>{label}</a>
        ))}
      </nav>
    </header>
  );
}

export default observer(SolHeader);
