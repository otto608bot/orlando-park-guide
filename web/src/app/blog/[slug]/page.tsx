import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import { getSamplePost, getSamplePostSlugs } from "@/lib/sample-data";

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
          <p>Sorry, we couldn't find this blog post.</p>
        </article>
      </main>
    );
  }
  
  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  
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
      
      <div className="blog-cta">
        <p>Ready to book your Disney World adventure?</p>
        <a href="https://www.dpbolvw.net/click-101693488-5527150" target="_blank" rel="noopener">Get Discounted Tickets →</a>
      </div>
      
      {post.tags?.length > 0 && (
        <div className="blog-tags">
          {post.tags.map((tag) => <span key={tag}>#{tag}</span>)}
        </div>
      )}
    </main>
  );
}
