import { MEDIA } from "../data/media";
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
        <span className="product-card__code">{product.name.split(" «")[0]}</span>
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
        <span className="section-label"> Каталог продукции · с 2002 года </span>
        <h2 className="section-title">Продукция</h2>
        <p className="section-sub"> Продукция на основе донорского сырья. В каталоге приведены серии, варианты фасовки и стоимость единицы. Номер партии и условия хранения указаны на этикетке. </p>
        <div className="catalog-feature">
          <div className="catalog-feature__copy">
            <span className="catalog-feature__series">Серия УТ / Базовый продукт</span>
            <h3>УТ-01 «Утренний»</h3>
            <p>От сбора сырья до паспорта партии — единый производственный цикл.</p>
            <dl className="catalog-spec">
              <div><dt>Форма</dt><dd>Раствор для внутреннего применения</dd></div>
              <div><dt>Сбор сырья</dt><dd>04:00–05:40 МСК</dd></div>
              <div><dt>Стандарт</dt><dd>ГОСТ Р 1246-2002</dd></div>
              <div><dt>Рецептура</dt><dd>По записи 1246 года</dd></div>
            </dl>
          </div>
          <img src={MEDIA.products} alt="Стеклянная тара с продукцией серии УТ" width="1536" height="1024" loading="lazy" />
        </div>
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
