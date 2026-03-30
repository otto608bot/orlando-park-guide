import { client } from "@/lib/sanity";
import { allPostsQuery } from "@/lib/queries";
import Link from "next/link";
import type { Metadata } from "next";
import "@/app/blog.css";

export const metadata: Metadata = {
  title: "Blog | Plan Your Park",
  description: "Latest tips, guides, and news for your Orlando theme park vacation.",
};

export default async function BlogIndex() {
  const posts = await client.fetch(allPostsQuery);

  return (
    <main className="blog-container">
      <header className="blog-header">
        <h1>Orlando Theme Park Blog</h1>
        <p className="excerpt">
          Tips, guides, and insights for your perfect theme park vacation.
        </p>
      </header>

      <div className="blog-list">
        {posts.map((post: {
          _id: string;
          title: string;
          slug: { current: string };
          excerpt?: string;
          heroImage?: { asset?: { url: string } };
          publishedAt: string;
        }) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug.current}`}
            className="blog-card"
          >
            {post.heroImage?.asset?.url && (
              <img
                src={post.heroImage.asset.url}
                alt={post.title}
                className="blog-card-image"
              />
            )}
            <div className="blog-card-content">
              <h3>{post.title}</h3>
              {post.excerpt && <p>{post.excerpt}</p>}
              {post.publishedAt && (
                <time>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}