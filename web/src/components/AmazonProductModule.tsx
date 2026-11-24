import {
  AMAZON_DISCLOSURE,
  AMAZON_LINK_REL,
  amazonProductUrl,
  getAmazonModule,
  productsForModule,
  type AmazonModuleVariant,
  type AmazonProduct,
} from "@/config/amazon-products";

const CTA_LABEL: Record<AmazonModuleVariant, string> = {
  "pick-list": "View on Amazon",
  "gear-box": "View on Amazon",
  "deals-grid": "Order on Amazon",
};

function ProductLink({
  product,
  variant,
}: {
  product: AmazonProduct;
  variant: AmazonModuleVariant;
}) {
  const href = amazonProductUrl(product.asin);
  const cta = CTA_LABEL[variant];

  if (variant === "deals-grid") {
    return (
      <a
        href={href}
        target="_blank"
        rel={AMAZON_LINK_REL}
        className="amp-card"
      >
        <div className="amp-card-info">
          <h3>{product.name}</h3>
          <p>{product.why}</p>
        </div>
        <span className="amp-cta">{cta} →</span>
      </a>
    );
  }

  return (
    <li className="amp-item">
      <a href={href} target="_blank" rel={AMAZON_LINK_REL} className="amp-item-link">
        <span className="amp-item-name">{product.name}</span>
        <span className="amp-item-why">{product.why}</span>
        <span className="amp-cta">{cta} →</span>
      </a>
    </li>
  );
}

type Props = {
  slug: string;
};

export default function AmazonProductModule({ slug }: Props) {
  const module = getAmazonModule(slug);
  if (!module) return null;

  const products = productsForModule(module);
  const isGrid = module.variant === "deals-grid";

  return (
    <aside
      className={`amp amp--${module.variant}`}
      aria-labelledby={`amp-title-${module.slug}`}
      data-amazon-module={module.variant}
      data-amazon-slug={module.slug}
    >
      <div className="amp-header">
        <h2 id={`amp-title-${module.slug}`}>{module.title}</h2>
        <p>{module.intro}</p>
      </div>
      {isGrid ? (
        <div className="amp-grid">
          {products.map((product) => (
            <ProductLink key={product.id} product={product} variant={module.variant} />
          ))}
        </div>
      ) : (
        <ol className="amp-list">
          {products.map((product) => (
            <ProductLink key={product.id} product={product} variant={module.variant} />
          ))}
        </ol>
      )}
      <p className="amp-disclosure">{AMAZON_DISCLOSURE}</p>
    </aside>
  );
}
