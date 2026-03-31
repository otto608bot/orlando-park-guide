import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import ParkCard from "@/components/ParkCard";
import BlogPostCard from "@/components/BlogPostCard";
import EmailForm from "@/components/EmailForm";

export const metadata: Metadata = {
  title: "Plan Your Park | Orlando Theme Park Planning Guide",
  description: "Your ultimate guide to Orlando theme parks - Disney World, Universal, SeaWorld & more!",
};

async function getHomePageData() {
  const [parks, recentPosts] = await Promise.all([
    sanityClient.fetch(`
      *[_type == "park"] | order(name asc) [0...6] {
        _id,
        name,
        slug,
        description,
        image { asset-> { url }, alt }
      }
    `),
    sanityClient.fetch(`
      *[_type == "blogPost"] | order(publishedAt desc) [0...3] {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        readTime,
        categories[] { title },
        heroImage { asset-> { url }, alt }
      }
    `),
  ]);
  
  return { parks, recentPosts };
}

export default async function HomePage() {
  const { parks, recentPosts } = await getHomePageData();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Orlando Theme Park Guide</h1>
        <p className="home-tagline">
          Your ultimate resource for planning the perfect Orlando vacation — from Disney World to Universal, SeaWorld, and beyond.
        </p>
      </header>
      
      {/* Quick Links */}
      <section className="quick-links">
        <Link href="/parks" className="quick-link-card">
          <span className="quick-link-icon">🎢</span>
          <span className="quick-link-title">Parks</span>
          <span className="quick-link-desc">All Orlando parks</span>
        </Link>
        <Link href="/rides" className="quick-link-card">
          <span className="quick-link-icon">⭐</span>
          <span className="quick-link-title">Rides</span>
          <span className="quick-link-desc">Rankings & filters</span>
        </Link>
        <Link href="/character-dining" className="quick-link-card">
          <span className="quick-link-icon">🍽️</span>
          <span className="quick-link-title">Character Dining</span>
          <span className="quick-link-desc">Meet your favorites</span>
        </Link>
        <Link href="/deals" className="quick-link-card">
          <span className="quick-link-icon">💰</span>
          <span className="quick-link-title">Deals</span>
          <span className="quick-link-desc">Tickets & discounts</span>
        </Link>
      </section>
      
      {/* Parks Grid */}
      <section className="home-section">
        <div className="section-header">
          <h2>Explore Orlando Parks</h2>
          <Link href="/parks" className="see-all">View all parks →</Link>
        </div>
        <div className="parks-grid">
          {parks.map((park: any) => (
            <ParkCard key={park._id} park={park} />
          ))}
        </div>
      </section>
      
      {/* Blog Posts */}
      <section className="home-section">
        <div className="section-header">
          <h2>Latest Articles</h2>
          <Link href="/blog" className="see-all">All articles →</Link>
        </div>
        <div className="blog-grid">
          {recentPosts.map((post: any) => (
            <BlogPostCard key={post._id} post={post} />
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="home-cta">
        <h2>Get Exclusive Park Deals</h2>
        <p>Subscribe for weekly updates on closures, new rides, and money-saving discounts.</p>
        <EmailForm buttonText="Get Updates" />
        <p className="cta-affiliate">
          <a href="https://www.dpbolvw.net/click-101693488-5527150" target="_blank" rel="noopener">
            Buy tickets through Undercover Tourist →
          </a>
        </p>
      </section>
      
      <style>{`
        .home-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }
        
        .home-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .home-header h1 {
          font-family: var(--font-heading);
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 1rem;
        }
        
        .home-tagline {
          font-size: 1.125rem;
          color: var(--text-medium);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .quick-links {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          margin-bottom: 3rem;
        }
        
        .quick-link-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem 1rem;
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
          text-align: center;
          transition: all 0.2s;
        }
        
        .quick-link-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-color: var(--primary);
        }
        
        .quick-link-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        
        .quick-link-title {
          font-family: var(--font-heading);
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.25rem;
        }
        
        .quick-link-desc {
          font-size: 0.75rem;
          color: var(--text-light);
        }
        
        .home-section {
          margin-bottom: 3rem;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .section-header h2 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-dark);
        }
        
        .see-all {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--primary);
          text-decoration: none;
        }
        
        .see-all:hover {
          text-decoration: underline;
        }
        
        .parks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        
        .home-cta {
          background: linear-gradient(135deg, var(--primary) 0%, #e85a1a 100%);
          color: white;
          padding: 3rem 2rem;
          border-radius: 16px;
          text-align: center;
          margin-top: 3rem;
        }
        
        .home-cta h2 {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.75rem;
        }
        
        .home-cta p {
          font-size: 1rem;
          color: rgba(255,255,255,0.9);
          margin-bottom: 1.5rem;
        }
        
        .home-cta .email-form button {
          background: white;
          color: var(--primary);
        }
        
        .cta-affiliate {
          margin-top: 1.5rem;
          margin-bottom: 0 !important;
          font-size: 0.875rem !important;
        }
        
        .cta-affiliate a {
          color: rgba(255,255,255,0.85);
          text-decoration: underline;
        }
        
        @media (max-width: 640px) {
          .home-container { padding: 1.5rem 1rem 3rem; }
          .quick-links { grid-template-columns: repeat(2, 1fr); }
          .section-header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
        }
      `}</style>
    </div>
  );
}
