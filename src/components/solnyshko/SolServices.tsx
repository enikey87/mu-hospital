function SolServices() {
  return (
    <section id="sol-services" className="sol-section sol-programs">
      <div className="sol-container">
        <span className="sol-label"> Программы пребывания </span>
        <h2 className="sol-title"> Направления здравницы </h2>
        <p className="sol-sub"> Курсы проводятся под наблюдением персонала. Срок, последовательность и состав процедур указываются в программе пребывания. </p>
        <div className="sol-services">
          <article className="sol-card">
            <svg className="program-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M5 38V12m0 18h38v8M5 22h38v8M11 22v-7h11v7m4 0v-7h11v7" /></svg>
            <h3>Стационарная уринотерапия</h3>
            <p> Стационарные курсы продолжительностью от 7 до 1246 дней. Круглосуточное наблюдение, личный стакан и индивидуальная карта. </p>
            <button
              className="sol-btn sol-btn--ghost"
              onClick={() =>
                document.getElementById("sol-station")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Программы стационара
            </button>
          </article>
          <article className="sol-card">
            <svg className="program-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M24 5C20 12 10 21 10 29a14 14 0 0 0 28 0C38 21 28 12 24 5Z M17 28c0 5 3 8 7 8" /></svg>
            <h3>Клизмотроника™</h3>
            <p> Гидратация с использованием природного сырья. Рецептуры различаются местом происхождения и составом. </p>
            <button
              className="sol-btn sol-btn--ghost"
              onClick={() =>
                document.getElementById("sol-enemas")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Меню по географии
            </button>
          </article>
          <article className="sol-card">
            <svg className="program-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M15 5v7h20a5 5 0 0 1 0 10H13a5 5 0 0 0 0 10h20a5 5 0 0 1 0 10H23v-4M15 18h18M14 27h18M12 38h6" /></svg>
            <h3>Калофорез®</h3>
            <p> Перенятие силы медведя и выносливости оленя. Используются биосубстанции и аппарат «Калофорез-Кедр М2». </p>
            <button
              className="sol-btn sol-btn--ghost"
              onClick={() =>
                document.getElementById("sol-kalofores")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              О методике
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}

export default SolServices;
