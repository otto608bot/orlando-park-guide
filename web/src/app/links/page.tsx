import type { Metadata } from "next";

import { dedupePostsBySlug } from "@/lib/blog";
import { blogPostPath, sanityThumb, withLinkInBioUtm } from "@/lib/link-in-bio";
import { sanityClient } from "@/lib/sanity";
import { createPageMetadata } from "@/lib/seo";

import "./links.css";

/**
 * /links — link-in-bio page (replaces Linktree). The Instagram bio points here once.
 *
 * Updates automatically: posts are pulled from Sanity at build time (static export),
 * newest first, so every Netlify deploy refreshes the "Newest post" card.
 * Deliberately noindex,follow and left out of sitemap.ts so it never competes with
 * the real hubs (/blog, /rides, /parks) in search.
 */
export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Links",
    description:
      "Plan Your Park quick links: our newest family guide, the ride finder by height, and the Orlando park chooser.",
    path: "/links",
  }),
  robots: { index: false, follow: true },
};

interface LinkPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt?: string;
  sortDate?: string;
  heroImage?: { asset?: { url?: string | null }; alt?: string | null };
}

const MORE_POSTS = 4;
const FALLBACK_IMAGE = "/Disney-World.webp";

const TOOLS = [
  {
    path: "/rides/",
    content: "ride-finder",
    title: "Ride finder by height",
    description: "Filter every Orlando ride by your kid's height and thrill level.",
  },
  {
    path: "/parks/",
    content: "park-chooser",
    title: "Park chooser",
    description: "All 9 Orlando parks compared for families. Pick the right one.",
  },
];

const GUIDES = [
  { path: "/rides/for/under-40/", content: "rides-under-40", title: "Rides for kids under 40\u2033" },
  { path: "/rides/for/height-44/", content: "rides-44-inches", title: "Rides for kids 44\u2033 and up" },
  { path: "/rides/for/height-48/", content: "rides-48-inches", title: "Rides for kids 48\u2033 and up" },
  { path: "/character-dining/", content: "character-dining", title: "Character dining guide" },
  { path: "/deals/", content: "ticket-deals", title: "Orlando ticket deals" },
  { path: "/blog/", content: "all-guides", title: "All family guides" },
];

async function getRecentPosts(): Promise<LinkPost[]> {
  // Published docs only (anonymous client). Posts with no publishedAt fall back to
  // _createdAt so they sort by age instead of floating to the top; future-dated
  // posts are skipped until they are live.
  const posts = await sanityClient.fetch<LinkPost[]>(`
    *[_type == "blogPost" && defined(slug.current) && coalesce(publishedAt, _createdAt) <= now()]
      | order(coalesce(publishedAt, _createdAt) desc) [0...12] {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        "sortDate": coalesce(publishedAt, _createdAt),
        heroImage { asset-> { url }, alt }
      }
  `);
  return dedupePostsBySlug(posts || []).slice(0, MORE_POSTS + 1);
}

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago",
  });
}

export default async function LinksPage() {
  const posts = await getRecentPosts();
  const [newest, ...more] = posts;

  return (
    <div className="links-page">
      <header className="links-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/favicon-180x180.png" alt="" width={72} height={72} className="links-logo" />
        <h1>Plan Your Park</h1>
        <p>Which Orlando park fits your kids, and which rides they&rsquo;ll actually love.</p>
      </header>

      {newest && (
        <section aria-labelledby="links-newest">
          <h2 id="links-newest" className="links-section-title">Newest post</h2>
          <a className="links-featured" href={withLinkInBioUtm(blogPostPath(newest.slug.current), newest.slug.current)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sanityThumb(newest.heroImage?.asset?.url, 800, 450) || FALLBACK_IMAGE}
              alt={newest.heroImage?.alt || ""}
              width={800}
              height={450}
            />
            <div className="links-featured-body">
              <span className="links-featured-title">{newest.title}</span>
              {newest.excerpt && <span className="links-featured-excerpt">{newest.excerpt}</span>}
              <span className="links-featured-cta">Read the guide &rarr;</span>
            </div>
          </a>
        </section>
      )}

      <section aria-label="Planning tools" className="links-tools">
        {TOOLS.map((tool) => (
          <a key={tool.content} className="links-tool" href={withLinkInBioUtm(tool.path, tool.content)}>
            <span className="links-tool-title">{tool.title}</span>
            <span className="links-tool-desc">{tool.description}</span>
          </a>
        ))}
      </section>

      {more.length > 0 && (
        <section aria-labelledby="links-recent">
          <h2 id="links-recent" className="links-section-title">More recent guides</h2>
          <ul className="links-list">
            {more.map((post) => (
              <li key={post._id}>
                <a className="links-post" href={withLinkInBioUtm(blogPostPath(post.slug.current), post.slug.current)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sanityThumb(post.heroImage?.asset?.url, 192, 108) || FALLBACK_IMAGE}
                    alt=""
                    width={96}
                    height={54}
                    loading="lazy"
                  />
                  <span className="links-post-text">
                    <span className="links-post-title">{post.title}</span>
                    {post.sortDate && <span className="links-post-date">{formatDate(post.sortDate)}</span>}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="links-guides">
        <h2 id="links-guides" className="links-section-title">Height guides &amp; more</h2>
        <ul className="links-chips">
          {GUIDES.map((guide) => (
            <li key={guide.content}>
              <a className="links-chip" href={withLinkInBioUtm(guide.path, guide.content)}>
                {guide.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
