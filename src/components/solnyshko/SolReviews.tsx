import ReviewPortrait from "../ReviewPortrait";
import { SOL_REVIEWS } from "../../data/solnyshko";

function SolReviews() {
  return (
    <section className="sol-section">
      <div className="sol-container">
        <span className="sol-label">Отдыхающие</span>
        <h2 className="sol-title">Книга отзывов здравницы</h2>
        <p className="sol-sub"> Выдержки из книги отзывов и входящей корреспонденции пансионата. </p>
        <p className="review-disclosure">Портреты авторов и иллюстрации к письмам созданы нейросетью.</p>
        <div className="sol-station">
          {SOL_REVIEWS.map((r) => (
            <article key={r.name + r.meta} className="sol-card">
              <div className="sol-review__head">
                <ReviewPortrait avatar={r.avatar} name={r.name} />
                <div>
                  <b>{r.name}</b>
                  <span>{r.meta}</span>
                </div>
              </div>
              <p>{r.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SolReviews;
