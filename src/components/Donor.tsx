import { observer } from "mobx-react-lite";
import { useStore } from "../stores/RootStore";

function Donor() {
  const { donor } = useStore();

  if (donor.status === "done" && donor.submitted) {
    const app = donor.submitted;
    return (
      <section id="donor">
        <div className="container">
          <span className="section-label">П.6 · Донорская программа УТ-Донор</span>
          <h2 className="section-title">Карточка донора готова</h2>
          <div className="donor-ticket">
            <div className="donor-ticket__id">{app.id}</div>
            <p style={{ marginTop: 12, color: "var(--muted)" }}>
              Донор: <strong style={{ color: "var(--text)" }}>{app.name}</strong>,
              регион: <strong style={{ color: "var(--text)" }}>{app.city}</strong>.
              Рацион за последние 24 часа: «{app.dinner}». Место приёма сырья — конюшня №4. </p>
            <p style={{ marginTop: 12, fontWeight: 600 }}>
              Карточка содержит сведения для согласования поставки. Она не подтверждает приём сырья и выплату.
            </p>
            <p style={{ marginTop: 12, color: "var(--muted)", fontSize: 14 }}>
              Выплата: 30% денежными средствами, 40% натурой (сено), 30% —
              упоминанием в гостевой книге.
            </p>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 18 }} onClick={donor.reset}>
              Составить новую карточку
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="donor">
      <div className="container">
        <span className="section-label">П.6 · Донорская программа УТ-Донор</span>
        <h2 className="section-title">
          Компания <span className="grad-text">закупает сырьё</span> у физических лиц
        </h2>
        <p className="section-sub"> Компания принимает сырьё от совершеннолетних доноров. Для справочной карточки укажите имя, регион сбора и рацион за последние сутки. </p>
        <div className="glass donor-wrap">
          <form
            className="donor-form"
            onSubmit={(e) => {
              e.preventDefault();
              void donor.submit();
            }}
          >
            <label> Имя донора <input
                className="input"
                disabled={donor.status === "sending"}
                value={donor.name}
                onChange={(e) => donor.setName(e.target.value)}
                placeholder="Кузьмич"
              />
            </label>
            <label>
              Регион сбора
              <input
                className="input"
                disabled={donor.status === "sending"}
                value={donor.city}
                onChange={(e) => donor.setCity(e.target.value)}
                placeholder="Тверская область"
              />
            </label>
            <label> Рацион за последние 24 часа <input
                className="input"
                disabled={donor.status === "sending"}
                value={donor.dinner}
                onChange={(e) => donor.setDinner(e.target.value)}
                placeholder="Окрошка, сало, компот (3 порции)"
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!donor.canSubmit || donor.status === "sending"}
            >
              {donor.status === "sending" ? (
                <>
                  <span className="spinner" /> Оформление карточки…
                </>
              ) : (
                "Составить карточку"
              )}
            </button>
          </form>
          <div className="donor-info">
            <p>
              <strong>Требования к сырью:</strong> Происхождение сырья подтверждается генетической экспертизой. Принимается сырьё от совершеннолетних участников программы. </p>
            <p>
              <strong>Порядок выплат:</strong> 30% от выручки денежными средствами,
              40% натурой (сено по курсу дня) и 30% — упоминанием в гостевой книге.
            </p>
            <p>
              <strong>Логистика:</strong> После согласования приёма на сбор отводится 2–3 часа. Тара предоставляется донором. </p>
            <p>
              <strong>Диетический протокол «Проросшее зерно»:</strong> Подготовка — два-три дня на проросшем зерне. По протоколу такое сырьё допускается к передаче другим лицам. Надбавка к выплате — 12,46%. </p>
            <p>
              <strong>Эмоциональный режим:</strong> Спокойное состояние донора — условие допуска к сбору. Контроль осуществляет старшая сестра. Эталон состояния — консультант Зинаида. </p>
            <p style={{ fontSize: 13, opacity: 0.8 }}> Карточка не направляется в компанию. Условия приёма и расчёт согласуются отдельно. </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default observer(Donor);
