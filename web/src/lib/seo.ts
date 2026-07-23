import type { Metadata } from "next";

export const SITE_NAME = "Plan Your Park";
export const SITE_URL = "https://planyourpark.com";

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  keywords?: Metadata["keywords"];
  openGraphType?: "website" | "article";
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords,
  openGraphType = "website",
}: PageMetadataInput): Metadata {
  const canonical = normalizePath(path);
  // Default share image for utility pages without a CMS hero (social + messengers).
  const defaultImage = `${SITE_URL}/Disney-World.webp`;

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
      images: [{ url: defaultImage, alt: `${SITE_NAME} — Orlando parks for families` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultImage],
    },
  };
}
