import Link from 'next/link';

interface BlogPostCardProps {
  post: {
    _id: string;
    title: string;
    slug: { current: string };
    excerpt?: string;
    publishedAt?: string;
    readTime?: number;
    categories?: Array<{ title: string }>;
    heroImage?: {
      asset: { url: string };
      alt?: string;
    };
  };
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link href={`/blog/${post.slug.current}`} className="blog-post-card">
      <div className="blog-post-card-image">
        {post.heroImage?.asset?.url ? (
          <img src={post.heroImage.asset.url} alt={post.heroImage.alt || post.title} />
        ) : (
          <div className="blog-post-card-fallback">
            <span>🎢</span>
          </div>
        )}
      </div>
      <div className="blog-post-card-content">
        {post.categories && post.categories.length > 0 && (
          <span className="blog-post-category">{post.categories[0].title}</span>
        )}
        <h3>{post.title}</h3>
        {post.excerpt && <p>{post.excerpt}</p>}
        <div className="blog-post-meta">
          {post.publishedAt && (
            <span>{formatDate(post.publishedAt)}</span>
          )}
          {post.readTime && <span>{post.readTime} min read</span>}
        </div>
      </div>
      
      <style>{`
        .blog-post-card {
          display: block;
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        
        .blog-post-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-color: var(--primary);
        }
        
        .blog-post-card-image {
          width: 100%;
          height: 160px;
          overflow: hidden;
          background: var(--bg-light);
        }
        
        .blog-post-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .blog-post-card-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary) 0%, #e85a1a 100%);
          font-size: 2.5rem;
        }
        
        .blog-post-card-content {
          padding: 1rem;
        }
        
        .blog-post-category {
          display: inline-block;
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--primary);
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        
        .blog-post-card h3 {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        
        .blog-post-card p {
          font-size: 0.875rem;
          color: var(--text-medium);
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }
        
        .blog-post-meta {
          display: flex;
          gap: 0.75rem;
          font-size: 0.8125rem;
          color: var(--text-light);
        }
      `}</style>
    </Link>
  );
}
