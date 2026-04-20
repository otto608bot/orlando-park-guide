import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/logo-full.png" alt="Plan Your Park" className="footer-logo" />
        </div>

        <nav className="footer-links">
          <Link href="/parks">Parks</Link>
          <Link href="/rides">Rides</Link>
          <Link href="/character-dining">Character Dining</Link>
          <Link href="/deals">Deals</Link>
          <Link href="/blog">Blog</Link>
          <a href="/sitemap.xml">Sitemap</a>
        </nav>

        <div className="footer-bottom">
          <p className="footer-disclaimer">
            As an Amazon Associate and Undercover Tourist affiliate, we may earn from qualifying purchases.
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} PlanYourPark.com
          </p>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: #F8FAFC;
          color: var(--text-medium);
          padding: 1.25rem 1.5rem 1rem;
          margin-top: 4rem;
          border-top: 1px solid var(--border);
        }

        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          text-align: center;
        }

        .footer-brand {
          display: flex;
          align-items: center;
        }

        .footer-logo {
          height: 22px;
          width: auto;
        }

        .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem 1.25rem;
          justify-content: center;
        }

        .footer-links a {
          color: var(--text-medium);
          text-decoration: none;
          font-size: 0.8125rem;
          transition: color 0.15s;
        }

        .footer-links a:hover {
          color: var(--primary);
        }

        .footer-bottom {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          align-items: center;
        }

        .footer-disclaimer {
          color: var(--text-light);
          font-size: 0.6875rem;
          line-height: 1.4;
          max-width: 480px;
        }

        .footer-copyright {
          color: var(--text-light);
          font-size: 0.6875rem;
        }
      `}</style>
    </footer>
  );
}
