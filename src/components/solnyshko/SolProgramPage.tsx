import { observer } from "mobx-react-lite";
import { SOL_PROGRAMS, type SolProgramId } from "../../data/solPrograms";
import { useStore } from "../../stores/RootStore";
import SolHeader from "./SolHeader";
import SolFooter from "./SolFooter";
import SolStation from "./SolStation";
import SolEnemas from "./SolEnemas";
import SolKalofores from "./SolKalofores";
import SolRoots from "./SolRoots";

const CONTENT = { station: SolStation, enemas: SolEnemas, kalofores: SolKalofores, roots: SolRoots };

function SolProgramPage({ id }: { id: SolProgramId }) {
  const { router, solnyshko } = useStore();
  const program = SOL_PROGRAMS.find(p => p.id === id);
  if (!program) return null;
  const Content = CONTENT[id];
  const book = () => {
    solnyshko.chooseProgram(program.booking);
    router.goSolnyshko("sol-booking");
  };
  return (
    <>
      <SolHeader />
      <main className={`sol-detail sol-detail--${id}`}>
        <section className="sol-detail__hero">
          <div className="sol-container">
            <nav className="sol-breadcrumbs" aria-label="Хлебные крошки">
              <a href="#/">Пансионат «Солнышко»</a><span aria-hidden="true">/</span><span aria-current="page">{program.label}</span>
            </nav>
            <div className="sol-detail__hero-grid">
              <div>
                <span className="sol-label">Направление здравницы</span>
                <h1>{program.title}</h1>
                <p className="sol-detail__lead">{program.summary}</p>
                <button className="sol-btn" onClick={book}>Записаться на это направление <span aria-hidden="true">↗</span></button>
              </div>
              <img src={program.image} alt={program.imageAlt} width="1536" height="1024" loading="eager" />
            </div>
            <dl className="sol-detail__facts">{program.facts.map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}</dl>
          </div>
        </section>
        <nav className="sol-program-nav sol-container" aria-label="Направления здравницы">
          {SOL_PROGRAMS.map(p => <a key={p.id} href={`#/solnyshko/${p.id}`} aria-current={p.id === id ? "page" : undefined}>{p.label}</a>)}
        </nav>
        <section className="sol-section">
          <div className="sol-container sol-detail__story">
            <h2 className="sol-title">{program.heading}</h2>
            <div>{program.paragraphs.map(p => <p key={p}>{p}</p>)}</div>
          </div>
          <figure className="sol-container sol-detail__flow">
            <figcaption>Схема направления</figcaption>
            <ol>{program.flow.map((label, i) => <li key={label}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>{label}</li>)}</ol>
          </figure>
        </section>
        <Content />
        <section className="sol-section sol-detail__booking">
          <div className="sol-container">
            <div><span className="sol-label">Отделение путёвок</span><h2 className="sol-title">Выбрать курс</h2><p>Направление будет указано в форме заявки.</p></div>
            <button className="sol-btn" onClick={book}>Перейти к записи</button>
            <p className="sol-detail__disclaimer">Имеются противопоказания. Необходима консультация специалиста. Продукция не является лекарственным средством. 18+</p>
          </div>
        </section>
      </main>
      <SolFooter />
    </>
  );
}

export default observer(SolProgramPage);
