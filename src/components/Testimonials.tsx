import { observer } from "mobx-react-lite";
import { useStore } from "../stores/RootStore";
import Poll from "./Poll";

function Stars({ n }: { n: number }) {
  return (
    <span className="review-card__stars" title={`Оценка: ${n} из 5`}>
      {"★".repeat(n)}
      <span style={{ opacity: 0.25 }}>{"★".repeat(5 - n)}</span>
    </span>
  );
}

function Testimonials() {
  const { testimonials } = useStore();

  return (
    <section id="reviews">
      <div className="container">
        <span className="section-label"> П.4 · Отзывы и обращения </span>
        <h2 className="section-title"> Отзывы и обращения </h2>
        <p className="section-sub"> Выдержки из гостевой книги и официальная переписка. Сообщения авторов публикуются отдельно от производственной документации. </p>
        <p
          className="section-sub"
          style={{ fontSize: 12, marginTop: 6, fontFamily: "var(--mono)" }}
        > Авторы личных обращений обозначены именем или инициалами. </p>
        <div className="reviews-grid">
          {testimonials.reviews.map((r) => (
            <article key={r.id} className="glass review-card">
              <div className="review-card__head">
                <div className="review-card__avatar">
                  <span aria-hidden="true">{r.name.split(/[\s,]+/).slice(0, 2).map((part) => part[0]).join("")}</span>
                </div>
                <div>
                  <div className="review-card__name">{r.name}</div>
                  <div className="review-card__city">{r.city}</div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <Stars n={r.stars} />
                </div>
              </div>
              <p className="review-card__text">{r.text}</p>
            </article>
          ))}
        </div>
        {testimonials.hasMore && (
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button
              className="btn btn-ghost"
              onClick={() => testimonials.loadMore()}
              disabled={testimonials.loading}
            >
              {testimonials.loading ? "Загрузка архива…" : "Показать ещё"}
            </button>
          </div>
        )}
        <Poll />
      </div>
    </section>
  );
}

export default observer(Testimonials);
