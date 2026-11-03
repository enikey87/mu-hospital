function SolServices() {
  return (
    <section id="sol-services" className="sol-section">
      <div className="sol-container">
        <span className="sol-label"> Программы пребывания </span>
        <h2 className="sol-title"> Направления здравницы </h2>
        <p className="sol-sub"> Курсы проводятся под наблюдением персонала. Срок, последовательность и состав процедур указываются в программе пребывания. </p>
        <div className="sol-services">
          <article className="sol-card sol-card--accent">
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
          <article className="sol-card sol-card--accent">
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
