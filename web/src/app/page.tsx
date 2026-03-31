import type { Metadata } from "next";
import Link from "next/link";
import "./blog.css";

export const metadata: Metadata = {
  title: "Plan Your Park | Orlando Theme Park Planning Guide",
  description: "Your ultimate guide to Orlando theme parks - Disney World, Universal, SeaWorld & more!",
};

export default function Home() {
  return (
    <main className="blog-container" style={{ maxWidth: '960px' }}>
      <header className="blog-header">
        <h1>Orlando Theme Park Guide</h1>
        <p className="excerpt">The ultimate resource for planning your perfect Orlando vacation — from Disney World to Universal, SeaWorld, and beyond.</p>
      </header>
      
      {/* Quick Links */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <Link href="/park" style={{ display: 'block', padding: '1.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: '12px', textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>🎢 Parks</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-medium)' }}>All Orlando parks</p>
        </Link>
        <Link href="/rides" style={{ display: 'block', padding: '1.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: '12px', textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>⭐ Rides</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-medium)' }}>Ride rankings & wait times</p>
        </Link>
        <Link href="/deals" style={{ display: 'block', padding: '1.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: '12px', textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>💰 Deals</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-medium)' }}>Tickets & discounts</p>
        </Link>
        <Link href="/blog" style={{ display: 'block', padding: '1.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: '12px', textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>📝 Blog</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-medium)' }}>Tips & updates</p>
        </Link>
      </section>
      
      {/* Featured Articles */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1.25rem' }}>Latest Articles</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/blog/orlando-closures-march-2026" style={{ display: 'block', padding: '1.25rem', background: 'white', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.375rem' }}>Orlando Theme Park Closures & Refurbs: March 2026</h4>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>5 min read • News</span>
          </Link>
          <Link href="/blog/free-things-disney-world" style={{ display: 'block', padding: '1.25rem', background: 'white', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.375rem' }}>25 Free Things to Do at Disney World</h4>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>12 min read • Disney World</span>
          </Link>
          <Link href="/blog/disney-world-guide" style={{ display: 'block', padding: '1.25rem', background: 'white', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.375rem' }}>Complete Disney World Planning Guide</h4>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>18 min read • Guides</span>
          </Link>
        </div>
      </section>
      
      {/* Mobile Filter Button - Hidden on blog pages via CSS */}
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