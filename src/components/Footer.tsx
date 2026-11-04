import BrandMark from "./BrandMark";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__col" id="company">
            <div className="footer__brand"><BrandMark /><span>УринаТех</span></div>
            <div className="footer__heading">История компании</div>
            <p className="footer__text">
              Московский Институт Обогащения Урины — первое название компании,
              основанной в 2002 году. Сегодня «УринаТех» ведёт производство полного
              цикла. Технологии документированы с 1246 года.
            </p>
          </div>
          <div className="footer__col">
            <div className="footer__heading"> Пансионат «Солнышко» </div>
            <p className="footer__text"> Стационарная уринотерапия, клизмотроника и калофорез. Республика Алтай, 40 вёрст от асфальта. Конная доставка от Горно-Алтайска включена в путёвку. </p>
            <a className="footer__link" href="#/">
              На главную здравницы →
            </a>
          </div>
          <div className="footer__col">
            <div className="footer__heading">Контакты</div>
            <p className="footer__text">
              107113, г. Москва, проходная конюшни №4 (спросить Петра).
              <br /> Донорская программа: регистрация в разделе «Донорам». <br /> При обращении указывайте номер партии или заявки. </p>
          </div>
          <div className="footer__col">
            <div className="footer__heading">Правовая информация</div>
            <p className="footer__text"> Переписка с Обществом Красного Креста ведётся с 14.05.2003. Реквизиты обращений приведены в архиве документов компании. </p>
          </div>
        </div>
        <div className="footer__bottom">
          <span> © 2002–2026 ООО «УринаТех». </span>
          <span>
            Информация не является публичной офертой. Продукция не является
            лекарственным средством. Имеются противопоказания — необходима
            консультация специалиста. 18+
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
