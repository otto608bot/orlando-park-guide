import React, { type ReactNode } from 'react';
import { PortableText } from "@portabletext/react";
export const revalidate = 60;
import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import QuestionForm from "@/components/QuestionForm";
import NewsletterForm from "@/components/NewsletterForm";
import { AFFILIATE_LINKS } from "@/config/affiliate-links";
import { processTextWithAffiliates } from "@/components/blogAffiliates";
import BlogContentUrlProcessor from "@/components/BlogContentUrlProcessor";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch(`
    *[_type == "blogPost"].slug.current
  `);
  // Filter out null/malformed slugs before generating params
  return (slugs as string[]).filter((slug): slug is string => !!slug).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityClient.fetch(`
    *[_type == "blogPost" && slug.current == $slug][0] {
      title,
      excerpt,
      tags,
      categories[] { title, slug }
    }
  `, { slug });
  
  if (!post) return { title: "Post Not Found" };
  
  // Build keywords from tags, fallback to excerpt-based
  const keywords = post.tags?.length > 0
    ? post.tags.join(", ")
    : "Disney World packing list, Orlando theme parks, family travel";
  
  return {
    title: post.title,
    description: post.excerpt,
    keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      locale: "en_US",
      url: `https://planyourpark.com/blog/${slug}`,
      siteName: "Plan Your Park",
    },
    alternates: {
      canonical: `https://planyourpark.com/blog/${slug}`,
    },
  };
}

async function getPostData(slug: string) {
  const [post, allPosts] = await Promise.all([
    sanityClient.fetch(`
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
        readTime
      }
    `, { slug }),
    sanityClient.fetch(`
      *[_type == "blogPost"] | order(publishedAt desc) [0...4] {
        _id,
        title,
        slug,
        excerpt,
        readTime
      }
    `),
  ]);
  
  const related = allPosts.filter((p: any) => p.slug?.current && p.slug.current !== slug).slice(0, 2);
  return { post, related };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const { post, related } = await getPostData(slug);
  
  if (!post) {
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
  
  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });

  const components = {
    block: {
      h2: ({ children }: { children?: React.ReactNode }) => <h2>{children}</h2>,
      h3: ({ children }: { children?: React.ReactNode }) => <h3>{children}</h3>,
      normal: ({ children }: { children?: React.ReactNode }) => {
        // children is React.ReactNode — can be a string, an array with one span, or an array of mixed content
        // Extract the ticket button text if present
        let ticketText: string | null = null;
        if (typeof children === 'string') {
          const match = (children as string).match(/^\[ Buy (.+?) → \]$/);
          if (match) ticketText = match[1];
        } else if (Array.isArray(children) && children.length === 1 && typeof children[0] === 'string') {
          // children is an array wrapping a single plain string like ["[ Buy X → ]"]
          const match = (children[0] as string).match(/^\[ Buy (.+?) → \]$/);
          if (match) ticketText = match[1];
        }
        if (ticketText) {
          // Map each ticket type to the correct affiliate URL
          let url: string = AFFILIATE_LINKS.universal3Park3Day;
          const labelLower = ticketText.toLowerCase();
          if (labelLower.includes('1-park epic universe')) {
            url = AFFILIATE_LINKS.universal1Park1DayEpic;
          } else if (labelLower.includes('2-park')) {
            url = AFFILIATE_LINKS.universal2Park2Day;
          } else if (labelLower.includes('3-park')) {
            url = AFFILIATE_LINKS.universal3Park3Day;
          } else if (labelLower.includes('express pass')) {
            url = AFFILIATE_LINKS.universal3Park3Day;
          } else if (labelLower.includes('direct from universal')) {
            url = AFFILIATE_LINKS.universalOrlandoDirect;
          } else if (labelLower.includes('undercover tourist')) {
            url = AFFILIATE_LINKS.universal3Park3Day;
          }
          return (
            <p>
              <a href={url} target="_blank" rel="noopener noreferrer" className="ticket-cta-btn">
                Buy {ticketText} →
              </a>
            </p>
          );
        }
        // Process string children to inject affiliate links
        const processed = Array.isArray(children)
          ? children.map((child) => typeof child === 'string' ? processTextWithAffiliates(child) : child)
          : typeof children === 'string' ? processTextWithAffiliates(children) : children;
        return <p>{processed}</p>;
      },
    },
    marks: {
      strong: ({ children }: { children?: React.ReactNode }) => <strong style={{ color: 'var(--text-dark)', fontWeight: 700 }}>{children}</strong>,
      link: ({ children, value }: { children?: React.ReactNode; value?: { href?: string; blank?: boolean } }) => {
        const isExternal = value?.blank;
        return isExternal ? (
          <a href={value?.href} target="_blank" rel="noopener noreferrer" className="affiliate-link">{children}</a>
        ) : (
          <a href={value?.href} className="inline-link">{children}</a>
        );
      },
    },
    list: {
      bullet: ({ children }: { children?: React.ReactNode }) => <ul className="blog-ul">{children}</ul>,
      number: ({ children }: { children?: React.ReactNode }) => <ol className="blog-ol">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
      number: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
    },
    // Handle plain text ticket buttons like "[ Buy 1-Park Epic Universe Tickets → ]"
    types: {
      span: ({ value }: { value?: { text?: string } }) => {
        const text = value?.text || '';
        const ticketMatch = text.match(/^\[ Buy (.+?) → \]$/);
        if (ticketMatch) {
          const label = ticketMatch[1];
          const url = AFFILIATE_LINKS.universal3Park3Day;
          return (
            <a href={url} target="_blank" rel="noopener noreferrer" className="ticket-cta-btn">
              Buy {label} →
            </a>
          );
        }
        return text;
      },
    },
  };

  const processTicketButtonsInline = (text: string): React.ReactNode => {
    const match = text.match(/^\[ Buy (.+?) → \]$/);
    if (match) {
      const label = match[1];
      return (
        <a href={AFFILIATE_LINKS.universal3Park3Day} target="_blank" rel="noopener noreferrer" className="ticket-cta-btn">
          Buy {label} →
        </a>
      );
    }
    return null;
  };

  // Also handle paragraphs that are entirely ticket button text
  const processTicketButtons = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const regex = /\[ Buy (.+?) → \]/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      const label = match[1];
      const url = AFFILIATE_LINKS.universal3Park3Day;
      parts.push(
        <a key={match.index} href={url} target="_blank" rel="noopener noreferrer" className="ticket-cta-btn">
          Buy {label} →
        </a>
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts.length > 0 ? parts : [];
  };

  // Fallback hero image based on category
  const getFallbackHero = () => {
    const cats = post.categories || [];
    const catTitles = (cats.map((c: any) => c.title || '').join(' ').toLowerCase());
    if (catTitles.includes('disney') || catTitles.includes('magic kingdom') || catTitles.includes('epcot') || catTitles.includes('hollywood') || catTitles.includes('animal')) {
      return '/Disney-World.webp';
    }
    if (catTitles.includes('universal')) {
      return '/Universal-Studios.jpeg';
    }
    if (catTitles.includes('news') || catTitles.includes('update')) {
      return '/Magic-Kingdom.webp';
    }
    return '/epcot.jpeg';
  };

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author?.name || "Plan Your Park" },
    publisher: { "@type": "Organization", name: "Plan Your Park", url: "https://planyourpark.com" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="blog-container">
        <header className="blog-header">
          {post.categories?.length > 0 ? (
            <div className="blog-categories">
              {post.categories.map((cat: any) => <span key={cat.slug?.current}>{cat.title}</span>)}
            </div>
          ) : (
            // Fallback category for posts without categories (e.g., epic-universe-tickets-guide)
            <div className="blog-categories">
              <span>Epic Universe</span>
            </div>
          )}
          <h1>{post.title}</h1>
          {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
          <div className="blog-meta">
            <span>By {post.author?.name ? post.author.name : "Plan Your Park"}</span>
            <span>•</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt || new Date().toISOString())}</time>
            {post.readTime && <><span>•</span><span>{post.readTime} min read</span></>}
          </div>
        </header>
        
        {(post.heroImage?.asset?.url || true) && (
          <div className="blog-hero">
            <img
              src={post.heroImage?.asset?.url || getFallbackHero()}
              alt={post.heroImage?.alt || post.title}
            />
          </div>
        )}
        
        <BlogContentUrlProcessor>
          <PortableText value={post.body} components={components} />
        </BlogContentUrlProcessor>

        {/* Buy Tickets CTA */}
        <div className="blog-buy-tickets">
          <h2>Get Your Tickets</h2>
          <p>Buy from trusted sellers and save up to 20% vs. gate pricing.</p>
          <div className="buy-tickets-grid">
            <a href={AFFILIATE_LINKS.disney4DayParkHopper} target="_blank" rel="noopener" className="buy-ticket-btn disney">
              <span>🏰</span>
              <div>
                <strong>Disney World</strong>
                <small>via Undercover Tourist</small>
              </div>
            </a>
            <a href={AFFILIATE_LINKS.universal3Park3Day} target="_blank" rel="noopener" className="buy-ticket-btn universal">
              <span>🪄</span>
              <div>
                <strong>Universal Orlando</strong>
                <small>via Undercover Tourist</small>
              </div>
            </a>
            <a href={AFFILIATE_LINKS.seaworld} target="_blank" rel="noopener" className="buy-ticket-btn seaworld">
              <span>🐬</span>
              <div>
                <strong>SeaWorld Orlando</strong>
                <small>via Undercover Tourist</small>
              </div>
            </a>
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div className="blog-bottom-cta">
          <h2>Plan Your Perfect Orlando Trip</h2>
          <p>Get exclusive deals and tips delivered to your inbox.</p>
          <div className="cta-buttons">
            <a href={AFFILIATE_LINKS.ucDealsPage} target="_blank" rel="noopener" className="primary">Get Tickets</a>
            <a href="/blog" className="secondary">More Articles</a>
          </div>
        </div>
        
        {post.tags?.length > 0 && (
          <div className="blog-tags">
            {post.tags.map((tag: string) => <span key={tag}>#{tag}</span>)}
          </div>
        )}
        
        {/* Related Posts */}
        {related.length > 0 && (
          <div className="blog-related">
            <h2>Keep Reading</h2>
            <div className="related-posts">
              {related.map((r: any) => (
                <Link key={r.slug?.current} href={`/blog/${r.slug?.current}`} className="related-post">
                  <h4>{r.title}</h4>
                  <span>{r.readTime} min read</span>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Q&A Section */}
        <div className="blog-qa">
          <h2>Frequently Asked Questions</h2>
          <div className="qa-item">
            <h4>When do parks typically close for refurbishment?</h4>
            <p>Most refurbishments happen during slower seasons — typically January through March and September through mid-November. Check our closures page for the latest updates.</p>
          </div>
          <div className="qa-item">
            <h4>How can I stay updated on park closures?</h4>
            <p>Subscribe to our newsletter below for weekly updates on closures, new ride openings, and exclusive deals.</p>
          </div>
          <div className="qa-item">
            <h4>Do you have a question about your upcoming trip?</h4>
            <QuestionForm />
          </div>
        </div>
        
        {/* Email Capture */}
        <div className="blog-email-capture">
          <h3>Get Park Updates in Your Inbox</h3>
          <p>Closures, new rides, and deals — delivered weekly.</p>
          <NewsletterForm />
        </div>
      </main>
    </>
  );
}
