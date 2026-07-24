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
