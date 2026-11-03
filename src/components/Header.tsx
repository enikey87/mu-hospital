import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/RootStore";

const NAV_LINKS = [
  { href: "#products", label: "Продукция" },
  { href: "#instructions", label: "Инструкция" },
  { href: "#pricing", label: "Обслуживание" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#detector", label: "Партии" },
  { href: "#donor", label: "Донорам" },
  { href: "#company", label: "Компания" },
  { href: "#/solnyshko", label: "Солнышко", extra: "nav__sol" },
  { href: "#faq", label: "Вопросы" },
];

function Header() {
  const { cart } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="topbar">
        <span>ООО «УринаТех» · ТУ 1246-001-0202</span>
        <span>ПРОИЗВОДСТВО · СНАБЖЕНИЕ · КОНТРОЛЬ</span>
      </div>
      <div className="header__inner">
        <a className="logo" href="#top" onClick={() => setMenuOpen(false)}>
          <span className="logo__drop">УТ</span>
          УринаТех
        </a>
        <nav className="nav" aria-label="Основная навигация">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={l.extra}>
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
          <a key={l.href} href={l.href} className={l.extra} onClick={() => setMenuOpen(false)}>
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

export default observer(Header);
