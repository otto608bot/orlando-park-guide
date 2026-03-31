import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import EmailForm from "@/components/EmailForm";
import QuestionForm from "@/components/QuestionForm";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch(`
    *[_type == "blogPost"].slug.current
  `);
  return slugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityClient.fetch(`
    *[_type == "blogPost" && slug.current == $slug][0] {
      title,
      excerpt
    }
  `, { slug });
  
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.excerpt };
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
  
  const related = allPosts.filter((p: any) => p.slug.current !== slug).slice(0, 2);
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
      normal: ({ children }: { children?: React.ReactNode }) => <p>{children}</p>,
    },
    marks: {
      link: ({ children, value }: { children?: React.ReactNode; value?: { href?: string; blank?: boolean } }) => (
        <a href={value?.href} target={value?.blank ? "_blank" : undefined} rel={value?.blank ? "noopener noreferrer" : undefined}>{children}</a>
      ),
    },
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
          {post.categories?.length > 0 && (
            <div className="blog-categories">
              {post.categories.map((cat: any) => <span key={cat.slug.current}>{cat.title}</span>)}
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
            {post.tags.map((tag: string) => <span key={tag}>#{tag}</span>)}
          </div>
        )}
        
        {/* Related Posts */}
        {related.length > 0 && (
          <div className="blog-related">
            <h2>Keep Reading</h2>
            <div className="related-posts">
              {related.map((r: any) => (
                <Link key={r.slug.current} href={`/blog/${r.slug.current}`} className="related-post">
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
          <EmailForm />
        </div>
      </main>
    </>
  );
}
