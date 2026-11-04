import { observer } from "mobx-react-lite";
import { POWER_OPTIONS, PROGRAM_OPTIONS } from "../../data/solnyshko";
import { useStore } from "../../stores/RootStore";

function SolBooking() {
  const { solnyshko } = useStore();
  const withPower = solnyshko.program === "kalofores" || solnyshko.program === "complex";

  if (solnyshko.status === "done" && solnyshko.voucher) {
    const programLabel =
      PROGRAM_OPTIONS.find((p) => p.value === solnyshko.program)?.label ?? "";
    const powerLabel = POWER_OPTIONS.find((p) => p.value === solnyshko.power)?.label ?? "";
    return (
      <section id="sol-booking" className="sol-section">
        <div className="sol-container">
          <span className="sol-label">Отделение путёвок</span>
          <h2 className="sol-title">Бланк путёвки готов</h2>
          <div className="sol-voucher">
            <div className="sol-voucher__stamp">Бланк сформирован</div>
            <div className="sol-voucher__num">{solnyshko.voucher}</div>
            <p>
              Отдыхающий: <b>{solnyshko.name.trim()}</b>
              <br />
              Программа: <b>{programLabel}</b>
              {withPower && <><br />Режим калофореза: <b>{powerLabel}</b></>}
            </p>
            <p className="sol-voucher__note">
              Справочный бланк для оформления путёвки. Он не бронирует место и не подтверждает оплату. Конная доставка от Горно-Алтайска входит в условия пребывания.
            </p>
            <button className="sol-btn sol-btn--ghost" onClick={solnyshko.reset}>
              Составить новый бланк
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="sol-booking" className="sol-section">
      <div className="sol-container">
        <span className="sol-label">Отделение путёвок</span>
        <h2 className="sol-title">Бланк путёвки</h2>
        <p className="sol-sub"> Выберите курс и укажите имя для бланка. Бланк не является подтверждением заезда; оплата на сайте не производится. </p>
        <form
          className="sol-form"
          onSubmit={(e) => {
            e.preventDefault();
            void solnyshko.submit();
          }}
        >
          <label>
            ФИО отдыхающего
            <input
              className="sol-input"
              disabled={solnyshko.status === "sending"}
              value={solnyshko.name}
              onChange={(e) => solnyshko.setName(e.target.value)}
              placeholder="Иванов Иван Иванович"
            />
          </label>
          <label>
            Программа
            <select
              className="sol-input"
              disabled={solnyshko.status === "sending"}
              value={solnyshko.program}
              onChange={(e) => solnyshko.setProgram(e.target.value)}
            >
              {PROGRAM_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          {withPower && (
          <label>
            Режим калофореза
            <select
              className="sol-input"
              disabled={solnyshko.status === "sending"}
              value={solnyshko.power}
              onChange={(e) => solnyshko.setPower(e.target.value)}
            >
              {POWER_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          )}
          <button
            type="submit"
            className="sol-btn sol-btn--big"
            disabled={!solnyshko.canSubmit || solnyshko.status === "sending"}
          >
            {solnyshko.status === "sending" ? "Оформление…" : "Сформировать бланк"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default observer(SolBooking);
