import type { Metadata } from "next";

import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import BlogPostCard from "@/components/BlogPostCard";
import TallyNewsletter from "@/components/TallyNewsletter";
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, guides, and news for your Orlando theme park vacation.",
};

async function getAllBlogPosts() {
  return sanityClient.fetch(`
    *[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      readTime,
      categories[] { title },
      heroImage { asset-> { url }, alt }
    }
  `);
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="blog-page-container">
      <header className="blog-page-header">
        <h1>Orlando Theme Park Blog</h1>
        <p className="blog-page-subtitle">
          Tips, guides, and insights for your perfect theme park vacation.
        </p>
      </header>
      
      <div className="blog-posts-grid">
        {posts.map((post: any) => (
          <BlogPostCard key={post._id} post={post} />
        ))}
      </div>
      
      {posts.length === 0 && (
        <p className="no-posts">No blog posts yet. Check back soon!</p>
      )}
      
      <div className="blog-email-capture">
        <h3>Get Park Updates in Your Inbox</h3>
        <p>Closures, new rides, and deals — delivered weekly.</p>
        <TallyNewsletter />
      </div>
      
      <style>{`
        .blog-page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }
        
        .blog-page-header {
          text-align: center;
          margin-bottom: 3rem;
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
          max-width: 600px;
          margin: 0 auto;
        }
        
        .blog-posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        
        .no-posts {
          text-align: center;
          color: var(--text-light);
          padding: 3rem;
        }
        
        @media (max-width: 640px) {
          .blog-page-container { padding: 1.5rem 1rem 3rem; }
          .blog-posts-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
