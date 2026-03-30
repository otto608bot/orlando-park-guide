import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import Link from "next/link";
import { getSamplePost, getSamplePostSlugs } from "@/lib/sample-data";
import EmailForm from "@/components/EmailForm";
import QuestionForm from "@/components/QuestionForm";

export async function generateStaticParams() {
  return getSamplePostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getSamplePost(slug);
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getSamplePost(slug);
  
  if (!post) {
    return (
      <main className="blog-container">
        <article className="blog-content">
          <h1>Post Not Found</h1>
          <p>Sorry, we couldn&apos;t find this blog post.</p>
        </article>
      </main>
    );
  }
  
  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  
  // Get related posts (excluding current)
  const allSlugs = getSamplePostSlugs().filter(s => s !== slug);
  const relatedPosts = allSlugs.slice(0, 2).map(s => {
    const p = getSamplePost(s);
    return p ? { slug: s, ...p } : null;
  }).filter(Boolean);
  
  const components = {
    block: {
      h2: ({ children }: { children?: React.ReactNode }) => <h2>{children}</h2>,
      h3: ({ children }: { children?: React.ReactNode }) => <h3>{children}</h3>,
      normal: ({ children }: { children?: React.ReactNode }) => <p>{children}</p>,
    },
    marks: {
      link: ({ children, value }: { children?: React.ReactNode; value?: { href?: string; blank?: boolean } }) => (
        <a href={value?.href} target={value?.blank ? "_blank" : undefined} rel={value?.blank ? "noopener noreferrer" : undefined}>{children}</a>
      ),
    },
  };
  
  return (
    <main className="blog-container">
      <header className="blog-header">
        {post.categories?.length > 0 && (
          <div className="blog-categories">
            {post.categories.map((cat) => <span key={cat.slug.current}>{cat.title}</span>)}
          </div>
        )}
        <h1>{post.title}</h1>
        {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
        <div className="blog-meta">
          <span>By {post.author?.name}</span>
          <span>•</span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.readTime && <><span>•</span><span>{post.readTime} min read</span></>}
        </div>
      </header>
      
      {post.heroImage?.asset?.url && (
        <div className="blog-hero">
          <img src={post.heroImage.asset.url} alt={post.heroImage.alt || post.title} />
        </div>
      )}
      
      <article className="blog-content">
        <PortableText value={post.body} components={components} />
      </article>
      
      {/* Bottom CTA */}
      <div className="blog-bottom-cta">
        <h2>Plan Your Perfect Orlando Trip</h2>
        <p>Get exclusive deals and tips delivered to your inbox.</p>
        <div className="cta-buttons">
          <a href="https://www.dpbolvw.net/click-101693488-5527150" target="_blank" rel="noopener" className="primary">Get Tickets</a>
          <a href="/blog" className="secondary">More Articles</a>
        </div>
      </div>
      
      {post.tags?.length > 0 && (
        <div className="blog-tags">
          {post.tags.map((tag) => <span key={tag}>#{tag}</span>)}
        </div>
      )}
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="blog-related">
          <h2>Keep Reading</h2>
          <div className="related-posts">
            {relatedPosts.map((related) => related && (
              <Link key={related.slug} href={`/blog/${related.slug}`} className="related-post">
                <h4>{related.title}</h4>
                <span>{related.readTime} min read</span>
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
        <EmailForm />
      </div>
      <style>{`
        @media (max-width: 640px) {
          .mobile-filter-btn {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}