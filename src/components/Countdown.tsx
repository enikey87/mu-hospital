import { observer } from "mobx-react-lite";
import { useStore } from "../stores/RootStore";

function Countdown() {
  const { countdown } = useStore();
  const p = countdown.parts;
  const cells = [
    { v: p.years, l: "лет" },
    { v: p.days, l: "дней" },
    { v: p.hours, l: "часов" },
    { v: p.minutes, l: "минут" },
    { v: p.seconds, l: "секунд" },
  ];

  return (
    <section id="queue">
      <div className="container">
        <span className="section-label">Прил. А · Очередь на коллекционную партию</span>
        <h2 className="section-title">
          Следующая партия УТ-К — <span className="grad-text">2374 год</span>
        </h2>
        <p className="section-sub"> Коллекционный выпуск 2024 года реализован полностью. Следующий выпуск запланирован на 2374 год. Приём заявок закрыт. </p>
        <div className="glass countdown-wrap">
          <div className="cd">
            {cells.map((c) => (
              <div className="cd__cell" key={c.l}>
                <div className="cd__value">{String(c.v).padStart(2, "0")}</div>
                <div className="cd__label">{c.l}</div>
              </div>
            ))}
          </div>
          <p className="cd-note"> Отсчёт ведётся до 1 января 2374 года по московскому времени. </p>
        </div>
      </div>
    </section>
  );
}

export default observer(Countdown);
