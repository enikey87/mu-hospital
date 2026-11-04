import BrandMark from "../BrandMark";

function SolFooter() {
  return (
    <footer className="sol-footer">
      <div className="sol-container">
        <div className="sol-footer__grid">
          <div className="sol-footer__col">
            <div className="sol-footer__brand">
              <BrandMark size={54} />
              <b>Пансионат «Солнышко»</b>
            </div>
            <p> Пансионат «Солнышко» — учреждение ООО «УринаТех». Республика Алтай, 40 вёрст от асфальта. Конная доставка от Горно-Алтайска включена. </p>
          </div>
          <div className="sol-footer__col">
            <b>Сезонность</b>
            <p> Приём круглый год. Медвежьи программы — с ноября по март, оленьи — в период миграции. Стационарные курсы — круглогодично. </p>
          </div>
          <div className="sol-footer__col">
            <b>Документы</b>
            <a className="sol-link" href="#/?section=sol-documents" onClick={() => document.getElementById("sol-documents")?.scrollIntoView({ behavior: "smooth" })}>Опись документов →</a>
            <p> Категория пансионата — три звезды. Разработка калофореза ведётся по заявке №1246-К. Медицинская лицензия здравнице не выдавалась. </p>
          </div>
        </div>
        <p className="sol-footer__disclaimer">
          Информация не является публичной офертой. Продукция не является
          лекарственным средством. Имеются противопоказания. Необходима
          консультация специалиста. 18+
        </p>
        <div className="sol-footer__bottom">
          <span> © 1246–2026 Пансионат «Солнышко». </span>
          <a className="sol-link" href="#/solnyshko/station">Программы уринотерапии →</a>
        </div>
      </div>
    </footer>
  );
}

export default SolFooter;
