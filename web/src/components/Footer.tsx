import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/parks">Parks</Link>
          <Link href="/rides">Rides</Link>
          <Link href="/character-dining">Character Dining</Link>
          <Link href="/deals">Deals</Link>
          <Link href="/blog">Blog</Link>
        </div>
        <p className="footer-tagline">
          Your ultimate guide to Orlando theme parks
        </p>
        <p className="footer-disclaimer">
          As an Amazon Associate and Undercover Tourist affiliate, we may earn from qualifying purchases.
        </p>
        <p className="footer-copyright">
          © {new Date().getFullYear()} PlanYourPark.com — All rights reserved.
        </p>
      </div>
      
      <style>{`
        .footer-inner {
          max-width: 960px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }
        
        .footer-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .footer-links a {
          color: var(--text-medium);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .footer-links a:hover {
          color: var(--primary);
        }
        
        .footer-tagline {
          color: var(--text-medium);
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
        }
        
        .footer-disclaimer {
          color: var(--text-light);
          font-size: 0.75rem;
          margin-bottom: 0.5rem;
        }
        
        .footer-copyright {
          color: var(--text-light);
          font-size: 0.75rem;
        }
      `}</style>
    </footer>
  );
}
