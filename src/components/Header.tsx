import BrandMark from "./BrandMark";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/RootStore";

const NAV_LINKS = [
  { href: "#/urinatech?section=products", label: "Продукция" },
  { href: "#/urinatech?section=instructions", label: "Инструкция" },
  { href: "#/urinatech?section=pricing", label: "Обслуживание" },
  { href: "#/urinatech?section=reviews", label: "Отзывы" },
  { href: "#/urinatech?section=detector", label: "Партии" },
  { href: "#/urinatech?section=donor", label: "Донорам" },
  { href: "#/urinatech?section=company", label: "История" },
  { href: "#/urinatech?section=faq", label: "Вопросы" },
];

function Header() {
  const { cart } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = (href: string) => {
    setMenuOpen(false);
    const section = new URLSearchParams(href.split("?")[1]).get("section");
    if (section) document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="header">
      <nav className="topbar" aria-label="Путь к производителю">
        <a href="#/">Пансионат «Солнышко»</a>
        <a href="#/solnyshko/station">Уринотерапия →</a>
      </nav>
      <div className="header__inner">
        <a className="logo" href="#/urinatech?section=top" onClick={() => navigate("#/urinatech?section=top")}>
          <BrandMark />
          УринаТех
        </a>
        <nav className="nav" aria-label="Основная навигация">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => navigate(l.href)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="header__actions">
          <button className="btn btn-primary btn-sm cart-btn" onClick={() => cart.open()}>
            Корзина
            {cart.count > 0 && <span className="cart-btn__badge">{cart.count}</span>}
          </button>
          <button
            className={`burger ${menuOpen ? "burger--open" : ""}`}
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      <nav className={`mobile-nav ${menuOpen ? "mobile-nav--open" : ""}`} aria-label="Мобильная навигация">
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => navigate(l.href)}>
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

export default observer(Header);
