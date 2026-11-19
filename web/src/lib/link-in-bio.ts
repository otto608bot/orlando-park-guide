/**
 * Link-in-bio helpers for /links (the single URL in our social bios).
 *
 * Every link on /links carries UTMs so GA4 can attribute bio traffic:
 *   ?utm_source=<network>&utm_medium=social&utm_campaign=link-in-bio&utm_content=<slug-or-tool>
 *
 * `source` defaults to "instagram". To reuse the page for another network later,
 * pass a different source (e.g. a /links/tiktok route) — no other change needed.
 */
export const LINK_IN_BIO_CAMPAIGN = "link-in-bio";
export const DEFAULT_LINK_IN_BIO_SOURCE = "instagram";

/** Build a site-relative href with exactly one "?" and link-in-bio UTMs. */
export function withLinkInBioUtm(
  path: string,
  content: string,
  source: string = DEFAULT_LINK_IN_BIO_SOURCE,
): string {
  const [beforeHash, hash = ""] = path.split("#", 2);
  const [base, existingQuery = ""] = beforeHash.split("?", 2);
  const params = new URLSearchParams(existingQuery);
  params.set("utm_source", source);
  params.set("utm_medium", "social");
  params.set("utm_campaign", LINK_IN_BIO_CAMPAIGN);
  params.set("utm_content", content);
  return `${base}?${params.toString()}${hash ? `#${hash}` : ""}`;
}

/** Path for a blog post, matching the site's trailingSlash: true config. */
export function blogPostPath(slug: string): string {
  return `/blog/${slug}/`;
}

/** Sanity CDN image URL resized/cropped for a card thumbnail. */
export function sanityThumb(url: string | null | undefined, width: number, height: number): string | null {
  if (!url) return null;
  if (!url.startsWith("https://cdn.sanity.io/")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}w=${width}&h=${height}&fit=crop&auto=format`;
}
