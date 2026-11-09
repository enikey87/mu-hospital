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

const PRODUCT_IMAGES: Record<string, { src: string; alt: string; width: number; height: number }> = {
  morning: { src: MEDIA.morningProduct, alt: "УТ-01 «Утренний» — заводская стеклянная тара с красной маркировкой", width: 1199, height: 1312 },
  horse: { src: MEDIA.horseProduct, alt: "УТ-02 «Эталон» — заводская стеклянная тара с красной маркировкой", width: 1199, height: 1312 },
  "sunshine-u": { src: MEDIA.sunshineProduct, alt: "Солнышко-У — аппарат со сменной янтарной кассетой и двумя индивидуальными тубусами", width: 1254, height: 1254 },
};

function ProductCard({ product }: { product: Product }) {
  const { cart } = useStore();
  const image = PRODUCT_IMAGES[product.id];

  return (
    <article className={`glass product-card${image ? " product-card--featured" : ""}`}>
      <div className="product-card__top">
        <span className="product-card__code">{product.name.split(" «")[0]}</span>
        {product.tag && <span className={`tag ${TAG_CLASS[product.tag]}`}>{product.tag}</span>}
      </div>
      {image && <figure className="product-card__photo">
        <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
      </figure>}
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
      {product.id === "morning" && <dl className="catalog-spec">
        <div><dt>Форма</dt><dd>Раствор для внутреннего применения</dd></div>
        <div><dt>Сбор сырья</dt><dd>04:00–05:40 МСК</dd></div>
        <div><dt>Стандарт</dt><dd>ГОСТ Р 1246-2002</dd></div>
        <div><dt>Рецептура</dt><dd>По записи 1246 года</dd></div>
      </dl>}
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
        <h2 className="section-title">Серийная продукция</h2>
        <p className="section-sub"> Продукция на основе донорского сырья и узлы удержания. В каталоге приведены серии, комплектация и стоимость единицы. Номер партии и условия хранения указаны на этикетке. </p>
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
