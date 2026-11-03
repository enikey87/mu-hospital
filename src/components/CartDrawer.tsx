import { observer } from "mobx-react-lite";
import { useStore } from "../stores/RootStore";

function CartDrawer() {
  const { cart } = useStore();

  if (!cart.isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => cart.close()} />
      <aside className="cart-drawer">
        <div className="cart-drawer__head">
          <span className="cart-drawer__title">Корзина</span>
          <button className="cart-close" onClick={() => cart.close()} aria-label="Закрыть">
            ×
          </button>
        </div>

        {cart.lastOrderTotal !== null ? (
          <div className="cart-empty">
            <div className="cart-order">
              <div style={{ fontSize: 42 }}>✓</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 18,
                  marginBottom: 10,
                }}
              >
                Спецификация сформирована
              </div>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>
                Сумма: {cart.lastOrderTotal.toLocaleString("ru-RU")} ₽.
                Спецификация носит справочный характер. Оплата и поставка
                по ней не выполняются. Условия регулярных поставок приведены
                в разделе «Обслуживание».
              </p>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: 16 }}
                onClick={() => cart.dismissOrder()}
              >
                Закрыть
              </button>
            </div>
          </div>
        ) : cart.items.length === 0 ? (
          <div className="cart-empty">
            <div>
              <p>
                Корзина пуста.
                <br />
                Выберите продукцию в каталоге.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.items.map(({ product, qty }) => (
                <div key={product.id} className="cart-item">
                  <div className="cart-item__info">
                    <div className="cart-item__name">{product.name}</div>
                    <div className="cart-item__price">
                      {(product.price * qty).toLocaleString("ru-RU")} ₽
                    </div>
                  </div>
                  <div className="qty-controls">
                    <button className="qty-btn" onClick={() => cart.dec(product.id)}>
                      −
                    </button>
                    <span className="qty">{qty}</span>
                    <button className="qty-btn" onClick={() => cart.add(product)}>
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-drawer__foot">
              <div className="cart-total">
                <span>Итого</span>
                <span>{cart.total.toLocaleString("ru-RU")} ₽</span>
              </div>
              <button className="btn btn-primary" onClick={() => cart.checkout()}>
                Сформировать спецификацию
              </button>
              <details className="cart-terms">
                <summary>Условия поставки</summary>
                <p>Стоимость указана за единицу продукции. Формирование спецификации
                  не является заказом и не предусматривает списания средств.
                  Коллекционные выпуски в регулярные поставки не входят.</p>
              </details>
              <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
                Информация не является публичной офертой.
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default observer(CartDrawer);
