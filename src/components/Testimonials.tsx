import { observer } from "mobx-react-lite";
import { useStore } from "../stores/RootStore";
import Poll from "./Poll";
import ReviewPortrait from "./ReviewPortrait";

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
        <span className="section-label"> Гостевая книга и переписка </span>
        <h2 className="section-title"> Отзывы и обращения </h2>
        <p className="section-sub"> Выдержки из гостевой книги и официальная переписка. Сообщения авторов публикуются отдельно от производственной документации. </p>
        <p className="review-disclosure">Портреты авторов и иллюстрации к письмам созданы нейросетью.</p>
        <div className="reviews-grid">
          {testimonials.reviews.map((r) => (
            <article key={r.id} className="glass review-card">
              <div className="review-card__head">
                <ReviewPortrait avatar={r.avatar} name={r.name} />
                <div>
                  <div className="review-card__name">{r.name}</div>
                  <div className="review-card__city">{r.city}</div>
                </div>
                <div className="review-card__rating">
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
