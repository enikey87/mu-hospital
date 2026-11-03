import { observer } from "mobx-react-lite";
import { QUIZ_QUESTIONS } from "../../data/solnyshko";
import { useStore } from "../../stores/RootStore";

function SolQuiz() {
  const { quiz, solnyshko } = useStore();
  const current = quiz.current;
  const result = quiz.result;

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="sol-quiz" className="sol-section">
      <div className="sol-container">
        <span className="sol-label">Анкетирование при поступлении</span>
        <h2 className="sol-title">
          Подберём <em>путь к силе</em>
        </h2>
        <p className="sol-sub"> Выберите желаемый результат, способ прохождения курса и срок. По ответам будет предложена программа пребывания. </p>

        {result ? (
          <div className="sol-quiz__result">
            <span className="sol-quiz__stamp"> Предлагаемая программа </span>
            <div className="sol-quiz__result-no">
              {result.no} · результат подбора </div>
            <h3>{result.name}</h3>
            <div className="sol-quiz__result-days">{result.days}</div>
            <p className="sol-quiz__result-desc">{result.desc}</p>
            <p className="sol-quiz__verdict">
              По результатам анкетирования {result.verdict}
            </p>
            <dl className="sol-quiz__record">
              {quiz.record.map((row) => (
                <div key={row.no}>
                  <dt>
                    {row.no} · {row.question}
                  </dt>
                  <dd>{row.answer}</dd>
                </div>
              ))}
            </dl>
            <p className="sol-quiz__result-note"> При равенстве предпочтений предлагается комплекс «Всё сразу». Программу можно изменить при записи. </p>
            <div className="sol-quiz__actions">
              <button
                className="sol-btn"
                type="button"
                onClick={() => scrollTo(result.anchor)}
              >
                {result.anchorLabel}
              </button>
              <button
                className="sol-btn"
                type="button"
                onClick={() => {
                  solnyshko.reset();
                  solnyshko.setProgram(result.key);
                  solnyshko.setPower(quiz.answers[0] ?? "bear");
                  scrollTo("sol-booking");
                }}
              >
                Записаться на эту программу
              </button>
              <button
                className="sol-btn sol-btn--ghost"
                type="button"
                onClick={() => quiz.reset()}
              >
                Заполнить повторно
              </button>
            </div>
          </div>
        ) : current ? (
          <div className="sol-quiz">
            <div className="sol-quiz__progress" role="status">
              Пункт {quiz.step + 1} из {quiz.total} · заполнено: {quiz.answered}{" "}
              из {quiz.total}
            </div>
            <div className="sol-quiz__bar" aria-hidden="true">
              {QUIZ_QUESTIONS.map((q, i) => (
                <span
                  key={q.no}
                  className={
                    i < quiz.step
                      ? "sol-quiz__tick sol-quiz__tick--done"
                      : i === quiz.step
                        ? "sol-quiz__tick sol-quiz__tick--current"
                        : "sol-quiz__tick"
                  }
                />
              ))}
            </div>
            <article className="sol-quiz__question">
              <div className="sol-quiz__no">{current.no}</div>
              <h3>{current.title}</h3>
              <p className="sol-quiz__hint">{current.note}</p>
              <div
                className="sol-quiz__options"
                role="group"
                aria-label={current.title}
              >
                {current.options.map((o) => (
                  <button
                    key={o.value}
                    className="sol-quiz__option"
                    type="button"
                    onClick={() => quiz.answer(o.value)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </article>
            <div className="sol-quiz__nav">
              <button
                className="sol-btn sol-btn--ghost"
                type="button"
                onClick={() => quiz.back()}
                disabled={quiz.step === 0}
              >
                К предыдущему пункту
              </button>
              <span className="sol-quiz__nav-note"> Ответ можно изменить, вернувшись к предыдущему пункту. </span>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default observer(SolQuiz);
