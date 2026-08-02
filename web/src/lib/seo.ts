import type { Metadata } from "next";

export const SITE_NAME = "Plan Your Park";
export const SITE_URL = "https://planyourpark.com";

/** Public brand handles for Organization sameAs (no X channel yet). */
export const SITE_SAME_AS = [
  "https://www.facebook.com/people/Plan-Your-Park/61582020494983/",
  "https://www.instagram.com/planyourparknow/",
  "https://www.pinterest.com/PlanYourPark/",
] as const;

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

/**
 * Sitewide Organization + WebSite JSON-LD for knowledge panel / brand entity.
 * Inject once in root layout (home had zero ld+json on production before this pack).
 */
export function getSiteJsonLd(): Record<string, unknown> {
  const orgId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo-full.png`,
        },
        description:
          "Family planning tools for Orlando theme parks — filter rides by kid height and thrill, compare parks, and book with trusted partner pricing.",
        sameAs: [...SITE_SAME_AS],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "Orlando parks ride finder for kids: Disney, Universal, Epic Universe, SeaWorld & LEGOLAND by height and thrill.",
        publisher: { "@id": orgId },
        inLanguage: "en-US",
      },
    ],
  };
}

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  keywords?: Metadata["keywords"];
  openGraphType?: "website" | "article";
  /** Absolute or site-relative image path for OG/Twitter. Defaults to Disney-World.webp. */
  image?: string;
  imageAlt?: string;
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords,
  openGraphType = "website",
  image,
  imageAlt,
}: PageMetadataInput): Metadata {
  const canonical = normalizePath(path);
  const imagePath = image || "/Disney-World.webp";
  const imageUrl = imagePath.startsWith("http") ? imagePath : `${SITE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  const alt = imageAlt || `${SITE_NAME} — Orlando parks for families`;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_US",
      type: openGraphType,
      images: [{ url: imageUrl, alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
