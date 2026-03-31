import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/logo-full.png" alt="Plan Your Park" className="footer-logo" />
          <p className="footer-tagline">
            Your ultimate guide to Orlando theme parks
          </p>
        </div>
        
        <nav className="footer-links">
          <div className="footer-col">
            <h4>Explore</h4>
            <Link href="/parks">All Parks</Link>
            <Link href="/rides">Rides & Attractions</Link>
            <Link href="/character-dining">Character Dining</Link>
            <Link href="/deals">Deals & Discounts</Link>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <Link href="/blog">Blog</Link>
            <a href="/closures" target="_blank" rel="noopener">Park Closures</a>
            <a href="/sitemap.xml">Sitemap</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="/about" target="_blank" rel="noopener">About Us</a>
            <a href="/privacy" target="_blank" rel="noopener">Privacy Policy</a>
          </div>
        </nav>
        
        <div className="footer-bottom">
          <p className="footer-disclaimer">
            As an Amazon Associate and Undercover Tourist affiliate, we may earn from qualifying purchases at no extra cost to you.
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} PlanYourPark.com — All rights reserved.
          </p>
        </div>
      </div>
      
      <style>{`
        .site-footer {
          background: var(--text-dark);
          color: white;
          padding: 3rem 1.5rem 2rem;
          margin-top: 4rem;
        }
        
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-brand {
          margin-bottom: 2rem;
        }

        .footer-logo {
          height: 32px;
          width: auto;
          margin-bottom: 0.5rem;
          filter: brightness(0) invert(1);
        }
        
        .footer-tagline {
          color: rgba(255,255,255,0.6);
          font-size: 0.875rem;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .footer-col h4 {
          font-family: var(--font-heading);
          font-size: 0.8125rem;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.5rem;
        }

        .footer-col a {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.15s;
        }

        .footer-col a:hover {
          color: white;
        }

        .footer-bottom {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .footer-disclaimer {
          color: rgba(255,255,255,0.4);
          font-size: 0.75rem;
          line-height: 1.5;
        }
        
        .footer-copyright {
          color: rgba(255,255,255,0.4);
          font-size: 0.75rem;
        }

        @media (max-width: 640px) {
          .footer-links {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
        }

        @media (max-width: 400px) {
          .footer-links {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
