import { useEffect } from "react";

function NotFound() {
  useEffect(() => {
    document.title = "404 — пансионат «Солнышко»";
  }, []);

  return (
    <section className="notfound">
      <div>
        <div className="notfound__code">404</div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(24px, 4vw, 36px)",
          }}
        >
          Страница не найдена
        </h1>
        <p className="notfound__text"> Проверьте адрес страницы или вернитесь на главную. </p>
        <button
          className="btn btn-primary"
          onClick={() => {
            window.location.href = import.meta.env.BASE_URL;
          }}
        >
          Вернуться на главную
        </button>
      </div>
    </section>
  );
}

export default NotFound;
