import type { Metadata } from "next";
import Link from "next/link";
import { getSamplePostSlugs } from "@/lib/sample-data";
import EmailForm from "@/components/EmailForm";

export const metadata: Metadata = {
  title: "Blog | Plan Your Park",
  description: "Latest tips, guides, and news for your Orlando theme park vacation.",
};

export default function BlogPage() {
  const slugs = getSamplePostSlugs();
  
  return (
    <main className="blog-container">
      <header className="blog-header">
        <h1>Orlando Theme Park Blog</h1>
        <p className="excerpt">Tips, guides, and insights for your perfect theme park vacation.</p>
      </header>
      
      <div className="blog-list">
        {slugs.map((slug) => (
          <Link key={slug} href={`/blog/${slug}`} style={{ display: 'block', padding: '1rem', background: 'white', borderRadius: '8px', marginBottom: '1rem', textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>{slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
            <p style={{ color: 'var(--text-medium)', fontSize: '0.875rem' }}>Click to read</p>
          </Link>
        ))}
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