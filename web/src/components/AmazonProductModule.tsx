import {
  AMAZON_DISCLOSURE,
  AMAZON_LINK_REL,
  amazonProductUrl,
  getAmazonModulesForSlug,
  getAmazonTagForSlug,
  productsForModule,
  type AmazonModule,
  type AmazonProduct,
} from "@/config/amazon-products";

function ProductLink({
  product,
  tag,
}: {
  product: AmazonProduct;
  tag: string;
}) {
  const href = amazonProductUrl(product.asin, tag);

  return (
    <li className="amp-item">
      <a
        href={href}
        target="_blank"
        rel={AMAZON_LINK_REL}
        className="amp-item-link"
        data-amazon-tag={tag}
      >
        <span className="amp-item-row">
          <span className="amp-item-name">{product.name}</span>
          <span className="amp-cta">View →</span>
        </span>
        <span className="amp-item-why">{product.why}</span>
      </a>
    </li>
  );
}

type Props = {
  module: AmazonModule;
  showDisclosure?: boolean;
};

export default function AmazonProductModule({ module, showDisclosure = false }: Props) {
  const products = productsForModule(module);
  const tag = getAmazonTagForSlug(module.slug);

  return (
    <aside
      className={`amp amp--${module.variant}`}
      aria-labelledby={`amp-title-${module.id}`}
      data-amazon-module={module.variant}
      data-amazon-slug={module.slug}
      data-amazon-box={module.id}
      data-amazon-after={module.afterHeading || ""}
      data-amazon-tag={tag}
    >
      <div className="amp-header">
        <h2 id={`amp-title-${module.id}`}>{module.title}</h2>
        {module.intro ? <p>{module.intro}</p> : null}
      </div>
      <ol className="amp-list">
        {products.map((product) => (
          <ProductLink key={product.id} product={product} tag={tag} />
        ))}
      </ol>
      {showDisclosure ? <p className="amp-disclosure">{AMAZON_DISCLOSURE}</p> : null}
    </aside>
  );
}

type ListProps = {
  slug: string;
  showDisclosureOnFirst?: boolean;
};

/** Render every catalog box for a slug (used on /deals). */
export function AmazonProductModules({ slug, showDisclosureOnFirst = true }: ListProps) {
  const modules = getAmazonModulesForSlug(slug);
  if (!modules.length) return null;
  return (
    <div className="amp-groups" data-amazon-slug={slug}>
      {modules.map((module, index) => (
        <AmazonProductModule
          key={module.id}
          module={module}
          showDisclosure={showDisclosureOnFirst && index === 0}
        />
      ))}
    </div>
  );
}
