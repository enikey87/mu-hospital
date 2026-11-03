import { observer } from "mobx-react-lite";
import { PRODUCTS, type Product } from "../data/catalog";
import { useStore } from "../stores/RootStore";

const TAG_CLASS: Record<NonNullable<Product["tag"]>, string> = {
  "Бестселлер": "tag--hit",
  "Эксклюзив": "tag--exclusive",
  "Нет в наличии": "tag--soldout",
  "Новинка": "tag--new",
  "Умное устройство": "tag--iot",
  "Особая серия": "tag--molecule",
};

function ProductCard({ product }: { product: Product }) {
  const { cart } = useStore();

  return (
    <article className="glass product-card">
      <div className="product-card__top">
        {product.tag && <span className={`tag ${TAG_CLASS[product.tag]}`}>{product.tag}</span>}
      </div>
      <h3 className="product-card__name">{product.name}</h3>
      <div className="product-card__subtitle">{product.subtitle}</div>
      <p className="product-card__desc">{product.description}</p>
      <div className="tech-chips">
        {product.tech.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>
      <div className="product-card__bottom">
        <div className="price">
          {product.price.toLocaleString("ru-RU")} ₽ <span>/ {product.unit}</span>
        </div>
        <button
          className="btn btn-primary btn-sm"
          disabled={product.soldOut}
          onClick={() => cart.add(product)}
        >
          {product.soldOut ? "Нет в наличии" : "В спецификацию"}
        </button>
      </div>
    </article>
  );
}

function Products() {
  return (
    <section id="products">
      <div className="container">
        <span className="section-label"> П.2 · Каталог продукции · с 2002 года </span>
        <h2 className="section-title">Продукция</h2>
        <p className="section-sub"> Продукция на основе донорского сырья. В каталоге приведены серии, варианты фасовки и стоимость единицы. Номер партии и условия хранения указаны на этикетке. </p>
        <div className="products-grid">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default observer(Products);
