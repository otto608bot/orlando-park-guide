import type { Metadata } from "next";
import Link from "next/link";

import BlogPostCard from "@/components/BlogPostCard";
import NewsletterForm from "@/components/NewsletterForm";
import { dedupePostsBySlug, type BlogPostLike } from "@/lib/blog";
import { createPageMetadata } from "@/lib/seo";
import { sanityClient } from "@/lib/sanity";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "Orlando Theme Park Guides for Families with Kids",
  description:
    "Family guides for Disney, Universal, and Epic Universe: kid ride heights, 1-day plans, packing lists, and which Orlando park fits your kids.",
  path: "/blog",
  keywords: [
    "Orlando theme parks with kids",
    "Disney World family guide",
    "Universal Orlando kids",
    "Epic Universe plan",
    "ride height requirements",
  ],
});

interface BlogIndexPost extends Omit<BlogPostLike, "slug" | "title" | "categories"> {
  _id: string;
  title: string;
  slug: { current: string };
  categories?: Array<{ title: string }>;
  heroImage?: {
    asset?: { url?: string | null };
    alt?: string | null;
  };
}

const START_HERE_LINKS = [
  {
    href: "/parks",
    title: "Compare Orlando parks",
    description: "Use this when you are still deciding between Disney, Universal, SeaWorld, or a mixed trip.",
  },
  {
    href: "/rides/?height=40",
    title: "Ride finder for kids under ~40″",
    description: "Filter every major Orlando park by your kid’s height before you buy tickets or walk into a line.",
  },
  {
    href: "/blog/epic-universe-1-day-plan",
    title: "Epic Universe 1-day plan",
    description: "Our strongest family touring plan for Super Nintendo World, Berk, and the rest of Epic.",
  },
  {
    href: "/blog/best-magic-kingdom-rides-kids-under-40-inches",
    title: "Magic Kingdom rides under 40″",
    description: "What shorter kids can actually ride — and what to skip without a meltdown.",
  },
  {
    href: "/deals",
    title: "Ticket deals for families",
    description: "Move from research into booking Disney, Universal, and Epic options in one place.",
  },
];

/** Pin proven organic earners + commercial guides above pure recency. */
const FEATURED_SLUG_PRIORITY = [
  "epic-universe-1-day-plan",
  "best-magic-kingdom-rides-kids-under-40-inches",
  "disney-world-packing-list-kids",
  "epic-universe-rides-ranked-guide",
  "universal-orlando-height-requirements",
];

async function getAllBlogPosts() {
  const posts = await sanityClient.fetch<BlogIndexPost[]>(`
    *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      readTime,
      tags,
      categories[] { title },
      heroImage { asset-> { url }, alt }
    }
  `);

  return dedupePostsBySlug(posts || []);
}

function pickFeaturedPosts(posts: BlogIndexPost[], limit = 3): BlogIndexPost[] {
  const bySlug = new Map(posts.map((post) => [post.slug.current, post]));
  const featured: BlogIndexPost[] = [];
  const seen = new Set<string>();

  for (const slug of FEATURED_SLUG_PRIORITY) {
    const hit = bySlug.get(slug);
    if (!hit || seen.has(slug)) continue;
    featured.push(hit);
    seen.add(slug);
    if (featured.length >= limit) return featured;
  }

  for (const post of posts) {
    const slug = post.slug.current;
    if (!slug || seen.has(slug)) continue;
    featured.push(post);
    seen.add(slug);
    if (featured.length >= limit) break;
  }

  return featured;
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  const featuredPosts = pickFeaturedPosts(posts, 3);

  const blogCollectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Plan Your Park Blog",
    description: "Orlando theme park planning guides, updates, and trip strategy articles.",
    url: "https://planyourpark.com/blog/",
    hasPart: featuredPosts
      .map((post) => {
        const slug = typeof post.slug === "string" ? post.slug : post.slug?.current;
        if (!slug) return null;
        return {
          "@type": "BlogPosting",
          headline: post.title,
          url: `https://planyourpark.com/blog/${slug}`,
          description: post.excerpt,
        };
      })
      .filter(Boolean),
  };

  return (
    <div className="blog-page-container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogCollectionLd) }} />

      <header className="blog-page-header">
        <h1>Orlando Theme Park Guides for Families with Kids</h1>
        <p className="blog-page-subtitle">
          Height-friendly ride picks, 1-day plans, packing lists, and which Orlando park actually fits your kids — not just what&apos;s newest.
        </p>
      </header>

      <section className="blog-start-here">
        <div className="blog-start-here-copy">
          <h2>Start here if you&apos;re planning from scratch</h2>
          <p>
            Jump into the tools and guides families use most — compare parks, filter rides by height, then follow a proven day plan.
          </p>
        </div>
        <div className="blog-start-here-grid">
          {START_HERE_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="blog-start-here-card">
              <strong>{link.title}</strong>
              <span>{link.description}</span>
            </Link>
          ))}
        </div>
      </section>

      {featuredPosts.length > 0 ? (
        <section className="blog-featured-posts">
          <div className="blog-section-heading">
            <h2>Featured family guides</h2>
            <Link href="/deals">Need prices instead? See deals</Link>
          </div>
          <div className="blog-posts-grid">
            {featuredPosts.map((post) => (
              <BlogPostCard key={post.slug.current || post._id} post={post} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="blog-all-posts">
        <div className="blog-section-heading">
          <h2>All articles</h2>
          <span>{posts.length} published guides</span>
        </div>
        <div className="blog-posts-grid">
          {posts.map((post) => (
            <BlogPostCard key={post.slug.current || post._id} post={post} />
          ))}
        </div>
      </section>

      {posts.length === 0 ? (
        <p className="no-posts">No blog posts yet. Check back soon!</p>
      ) : null}

      <div className="blog-email-capture">
        <h3>Get park updates in your inbox</h3>
        <p>Closures, new rides, and money-saving tips — delivered weekly.</p>
        <NewsletterForm />
      </div>

      <style>{`
        .blog-page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }

        .blog-page-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .blog-page-header h1 {
          font-family: var(--font-heading);
          font-size: clamp(1.75rem, 5vw, 2.5rem);
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 1rem;
        }

        .blog-page-subtitle {
          font-size: 1.125rem;
          color: var(--text-medium);
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .blog-start-here,
        .blog-featured-posts,
        .blog-all-posts {
          margin-bottom: 2.5rem;
        }

        .blog-start-here {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
        }

        .blog-start-here-copy {
          margin-bottom: 1rem;
        }

        .blog-start-here-copy h2,
        .blog-section-heading h2 {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.35rem;
        }

        .blog-start-here-copy p {
          color: var(--text-medium);
          line-height: 1.7;
        }

        .blog-start-here-grid,
        .blog-posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .blog-start-here-card {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: #fffaf5;
          border: 1px solid #fed7aa;
          border-radius: 12px;
          padding: 1rem;
          color: inherit;
          text-decoration: none;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .blog-start-here-card:hover {
          transform: translateY(-1px);
          border-color: var(--primary);
        }

        .blog-start-here-card strong {
          color: var(--text-dark);
          font-size: 0.95rem;
        }

        .blog-start-here-card span {
          color: var(--text-medium);
          line-height: 1.6;
          font-size: 0.9rem;
        }

        .blog-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .blog-section-heading a,
        .blog-section-heading span {
          color: var(--text-light);
          font-size: 0.9rem;
          text-decoration: none;
        }

        .blog-section-heading a:hover {
          color: var(--primary);
        }

        .no-posts {
          text-align: center;
          color: var(--text-light);
          padding: 3rem;
        }

        @media (max-width: 640px) {
          .blog-page-container { padding: 1.5rem 1rem 3rem; }
          .blog-posts-grid,
          .blog-start-here-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
