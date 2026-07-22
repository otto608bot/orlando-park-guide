import React, { type ReactNode } from "react";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import Link from "next/link";

import NewsletterForm from "@/components/NewsletterForm";
import BlogContentUrlProcessor from "@/components/BlogContentUrlProcessor";
import { processTextWithAffiliates } from "@/components/blogAffiliates";
import QuestionForm from "@/components/QuestionForm";
import { AFFILIATE_LINKS } from "@/config/affiliate-links";
import {
  dedupePostsBySlug,
  getContextualTicketCta,
  getHelpfulInternalLinks,
  getRelatedPosts,
  normalizePortableTextBlocks,
  type BlogPostLike,
} from "@/lib/blog";
import { sanityClient } from "@/lib/sanity";

export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

interface BlogPostRecord extends BlogPostLike {
  body?: any[];
  heroImage?: { asset?: { url?: string | null }; alt?: string | null };
  author?: { name?: string | null };
  _updatedAt?: string;
}

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<string[]>(`
    *[_type == "blogPost" && defined(slug.current)].slug.current
  `);

  return [...new Set((slugs || []).filter(Boolean))].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityClient.fetch<BlogPostRecord | null>(
    `
      *[_type == "blogPost" && slug.current == $slug][0] {
        title,
        excerpt,
        tags,
        categories[] { title, slug },
        heroImage { asset-> { url }, alt },
        author { name },
        publishedAt,
        _updatedAt
      }
    `,
    { slug },
  );

  if (!post) {
    return { title: "Post Not Found" };
  }

  const keywords = post.tags?.length
    ? post.tags
    : ["Orlando theme parks", "Disney World planning", "Universal Orlando tips"];

  const canonicalPath = `/blog/${slug}`;
  const image = post.heroImage?.asset?.url;

  return {
    title: post.title,
    description: post.excerpt,
    keywords,
    authors: post.author?.name ? [{ name: post.author.name }] : [{ name: "Plan Your Park" }],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      locale: "en_US",
      url: canonicalPath,
      siteName: "Plan Your Park",
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      ...(image ? { images: [{ url: image, alt: post.heroImage?.alt || post.title || "Plan Your Park blog" }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
      ...(image ? { images: [image] } : {}),
    },
  };
}

async function getPostData(slug: string) {
  const [post, allPostsRaw] = await Promise.all([
    sanityClient.fetch<BlogPostRecord | null>(
      `
        *[_type == "blogPost" && slug.current == $slug][0] {
          _id,
          title,
          slug,
          body,
          excerpt,
          heroImage { asset-> { url }, alt },
          author { name },
          categories[] { title, slug },
          tags,
          publishedAt,
          readTime,
          _updatedAt
        }
      `,
      { slug },
    ),
    sanityClient.fetch<BlogPostRecord[]>(`
      *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        readTime,
        publishedAt,
        categories[] { title, slug },
        tags
      }
    `),
  ]);

  const allPosts = dedupePostsBySlug(allPostsRaw || []);

  if (!post) {
    return { post: null, related: [], helpfulLinks: [], contextualTicketCta: null };
  }

  const normalizedPost = {
    ...post,
    body: normalizePortableTextBlocks(post.body),
  };

  return {
    post: normalizedPost,
    related: getRelatedPosts(normalizedPost, allPosts, 3),
    helpfulLinks: getHelpfulInternalLinks(normalizedPost, allPosts),
    contextualTicketCta: getContextualTicketCta(normalizedPost),
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getFallbackHero(post: BlogPostRecord) {
  const categoryText = (post.categories || []).map((category) => category.title || "").join(" ").toLowerCase();
  const slug = typeof post.slug === "string"
    ? post.slug.toLowerCase()
    : post.slug?.current?.toLowerCase() || "";

  if (slug.includes("epic-universe")) return "/epic-universe.jpeg";
  if (categoryText.includes("disney") || slug.includes("disney")) return "/Disney-World.webp";
  if (categoryText.includes("universal") || slug.includes("universal")) return "/Universal-Studios.jpeg";
  if (categoryText.includes("seaworld") || slug.includes("seaworld")) return "/seaworld.jpg";
  return "/epcot.jpeg";
}

function getTicketButtonHref(ticketText: string) {
  const label = ticketText.toLowerCase();

  if (label.includes("1-park epic universe")) return AFFILIATE_LINKS.universal1Park1DayEpic;
  if (label.includes("2-park")) return AFFILIATE_LINKS.universal2Park2Day;
  if (label.includes("3-park")) return AFFILIATE_LINKS.universal3Park3Day;
  if (label.includes("direct from universal")) return AFFILIATE_LINKS.universalOrlandoDirect;
  if (label.includes("disney")) return AFFILIATE_LINKS.disney4DayParkHopper;
  return AFFILIATE_LINKS.ucDealsPage;
}

function renderProcessedText(children?: ReactNode) {
  return processTextWithAffiliates(children);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const { post, related, helpfulLinks, contextualTicketCta } = await getPostData(slug);

  if (!post || !contextualTicketCta) {
    return (
      <main className="blog-container">
        <article className="blog-content">
          <h1>Post Not Found</h1>
          <p>Sorry, we couldn&apos;t find this blog post.</p>
          <Link href="/blog">← Back to blog</Link>
        </article>
      </main>
    );
  }

  const components = {
    block: {
      h2: ({ children }: { children?: ReactNode }) => <h2>{children}</h2>,
      h3: ({ children }: { children?: ReactNode }) => <h3>{children}</h3>,
      normal: ({ children }: { children?: ReactNode }) => {
        let ticketText: string | null = null;

        if (typeof children === "string") {
          const match = children.match(/^\[ Buy (.+?) → \]$/);
          if (match) ticketText = match[1];
        } else if (Array.isArray(children) && children.length === 1 && typeof children[0] === "string") {
          const match = children[0].match(/^\[ Buy (.+?) → \]$/);
          if (match) ticketText = match[1];
        }

        if (ticketText) {
          return (
            <p>
              <a href={getTicketButtonHref(ticketText)} target="_blank" rel="noopener noreferrer" className="ticket-cta-btn">
                Buy {ticketText} →
              </a>
            </p>
          );
        }

        return <p>{renderProcessedText(children)}</p>;
      },
      blockquote: ({ children }: { children?: ReactNode }) => <blockquote><p>{children}</p></blockquote>,
    },
    marks: {
      strong: ({ children }: { children?: ReactNode }) => <strong style={{ color: "var(--text-dark)", fontWeight: 700 }}>{children}</strong>,
      description: ({ children }: { children?: ReactNode }) => <span className="blog-inline-note">{children}</span>,
      link: ({ children, value }: { children?: ReactNode; value?: { href?: string } }) => {
        const href = value?.href?.trim();
        if (!href) return <>{children}</>;

        const isInternal = href.startsWith("/") || href.startsWith("https://planyourpark.com") || href.startsWith("http://planyourpark.com");
        const cleanHref = href.replace(/^https?:\/\/planyourpark\.com/, "");

        return isInternal ? (
          <Link href={cleanHref || href} className="inline-link">
            {children}
          </Link>
        ) : (
          <a href={href} target="_blank" rel="noopener noreferrer" className="affiliate-link">
            {children}
          </a>
        );
      },
    },
    list: {
      bullet: ({ children }: { children?: ReactNode }) => <ul className="blog-ul">{children}</ul>,
      number: ({ children }: { children?: ReactNode }) => <ol className="blog-ol">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }: { children?: ReactNode }) => <li>{children}</li>,
      number: ({ children }: { children?: ReactNode }) => <li>{children}</li>,
    },
    types: {
      span: ({ value }: { value?: { text?: string } }) => value?.text ? <p>{value.text}</p> : null,
    },
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    mainEntityOfPage: `https://planyourpark.com/blog/${slug}`,
    image: [post.heroImage?.asset?.url || `https://planyourpark.com${getFallbackHero(post)}`],
    author: { "@type": "Person", name: post.author?.name || "Plan Your Park" },
    publisher: { "@type": "Organization", name: "Plan Your Park", url: "https://planyourpark.com" },
    keywords: post.tags,
    articleSection: post.categories?.map((category) => category.title).filter(Boolean),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://planyourpark.com/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://planyourpark.com/blog/" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://planyourpark.com/blog/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <main className="blog-container">
        <nav className="blog-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/blog">Blog</Link>
          <span>/</span>
          <span aria-current="page">{post.title}</span>
        </nav>

        <header className="blog-header">
          {post.categories?.length ? (
            <div className="blog-categories">
              {post.categories.map((category) => {
                const categoryKey = typeof category.slug === "string" ? category.slug : category.slug?.current;
                return <span key={categoryKey || category.title}>{category.title}</span>;
              })}
            </div>
          ) : null}
          <h1>{post.title}</h1>
          {post.excerpt ? <p className="excerpt">{post.excerpt}</p> : null}
          <div className="blog-meta">
            <span>By {post.author?.name || "Plan Your Park"}</span>
            <span>•</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt || new Date().toISOString())}</time>
            {post.readTime ? <><span>•</span><span>{post.readTime} min read</span></> : null}
          </div>
        </header>

        <div className="blog-hero">
          <img src={post.heroImage?.asset?.url || getFallbackHero(post)} alt={post.heroImage?.alt || post.title || "Plan Your Park blog hero"} />
        </div>

        <BlogContentUrlProcessor>
          <PortableText value={post.body as any} components={components} />
        </BlogContentUrlProcessor>

        <section className="blog-helpful-links">
          <div className="blog-helpful-links-header">
            <h2>Plan your next step</h2>
            <p>Use these related tools and guides to keep planning without starting from scratch.</p>
          </div>
          <div className="blog-helpful-links-grid">
            {helpfulLinks.map((link) => (
              <Link key={link.href} href={link.href} className="blog-helpful-link-card">
                <strong>{link.label}</strong>
                <span>{link.description}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="blog-primary-cta">
          <div>
            <p className="blog-primary-cta-kicker">Booking support</p>
            <h2>{contextualTicketCta.label}</h2>
            <p>{contextualTicketCta.description}</p>
            <p className="blog-monetization-note">
              If you book through a partner link, Plan Your Park may earn a commission at no extra cost to you. We keep these links limited to genuinely helpful next steps.
            </p>
          </div>
          <div className="blog-primary-cta-actions">
            <a href={contextualTicketCta.href} target="_blank" rel="noopener noreferrer" className="primary">
              {contextualTicketCta.supportingLabel}
            </a>
            <Link href="/deals" className="secondary">See all Orlando deal options</Link>
          </div>
        </section>

        {post.tags?.length ? (
          <div className="blog-tags">
            {post.tags.map((tag) => <span key={tag}>#{tag}</span>)}
          </div>
        ) : null}

        {related.length ? (
          <section className="blog-related">
            <h2>Keep reading</h2>
            <div className="related-posts">
              {related.map((relatedPost) => {
                const slugValue = relatedPost.slug;
                const relatedSlug = typeof slugValue === "string" ? slugValue : slugValue?.current;
                if (!relatedSlug) return null;
                return (
                  <Link key={relatedSlug} href={`/blog/${relatedSlug}`} className="related-post">
                    <h4>{relatedPost.title}</h4>
                    <p>{relatedPost.excerpt || "Another practical Orlando planning guide."}</p>
                    <span>{relatedPost.readTime ? `${relatedPost.readTime} min read` : "Read guide"}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="blog-qa">
          <h2>Planning questions</h2>
          <div className="qa-item">
            <h4>How current is this guide?</h4>
            <p>
              We publish against the current Sanity content feed and rebuild locally with real validation. For time-sensitive pricing or refurbishments, compare this guide with our deals page and latest blog updates.
            </p>
          </div>
          <div className="qa-item">
            <h4>What should I do next if I&apos;m narrowing a trip plan?</h4>
            <p>
              Start with the helpful links above, then compare parks, browse rides by height requirement, and check current ticket options before booking.
            </p>
          </div>
          <div className="qa-item">
            <h4>Need a family-specific recommendation?</h4>
            <QuestionForm />
          </div>
        </section>

        <div className="blog-email-capture">
          <h3>Get park updates in your inbox</h3>
          <p>Closures, new rides, and practical money-saving tips — delivered weekly.</p>
          <NewsletterForm />
        </div>
      </main>
    </>
  );
}
