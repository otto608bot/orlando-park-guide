'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [parksDropdownOpen, setParksDropdownOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildParkHref = (parkPath: string) => {
    const params = new URLSearchParams(searchParams.toString());
    return `${parkPath}${params.toString() ? `?${params.toString()}` : ''}`;
  };

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  // Pages that have filters
  const hasFilters = pathname === '/' || pathname === '/rides' || pathname.startsWith('/parks');

  // Check if any filters are active (from URL params)
  const hasActiveFilters = hasFilters && (
    searchParams.get('height') ||
    searchParams.get('pregnancySafe') ||
    searchParams.get('wheelchair') ||
    searchParams.get('calm') ||
    searchParams.get('parks')
  );

  const parks = [
    { name: 'Magic Kingdom', href: '/parks/magic-kingdom' },
    { name: 'EPCOT', href: '/parks/epcot' },
    { name: 'Hollywood Studios', href: '/parks/hollywood-studios' },
    { name: 'Animal Kingdom', href: '/parks/animal-kingdom' },
    { name: 'Universal Studios Florida', href: '/parks/universal-studios-florida' },
    { name: 'Islands of Adventure', href: '/parks/islands-of-adventure' },
    { name: 'Epic Universe', href: '/parks/epic-universe' },
    { name: 'SeaWorld Orlando', href: '/parks/seaworld-orlando' },
    { name: 'LEGOLAND Florida', href: '/parks/legoland-florida' },
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Mobile: Hamburger on LEFT */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Logo — centered on mobile, left on desktop */}
        <Link href="/" className="logo">
          <img src="/logo-full.png" alt="Plan Your Park" />
        </Link>

        {/* Desktop Nav (hidden on mobile) */}
        <nav className="main-nav desktop-nav">
          <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>

          <div
            className="nav-dropdown"
            onMouseEnter={() => setParksDropdownOpen(true)}
            onMouseLeave={() => setParksDropdownOpen(false)}
          >
            <button
              className={`nav-link dropdown-trigger nav-parks-btn ${isActive('/parks') ? 'active' : ''}`}
              onClick={() => setParksDropdownOpen(s => !s)}
              aria-haspopup="true"
              aria-expanded={parksDropdownOpen}
            >
              Parks
              <span className="dropdown-arrow">▾</span>
            </button>

            {parksDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-section">
                  <span className="dropdown-section-label">Walt Disney World</span>
                  {parks.filter(p => p.name.includes('Magic') || p.name.includes('EPCOT') || p.name.includes('Hollywood') || p.name.includes('Animal')).map(park => (
                    <Link
                      key={park.href}
                      href={buildParkHref(park.href)}
                      className="dropdown-item"
                    >
                      {park.name}
                    </Link>
                  ))}
                </div>
                <div className="dropdown-section">
                  <span className="dropdown-section-label">Universal Orlando</span>
                  {parks.filter(p => p.name.includes('Universal') || p.name.includes('Islands') || p.name.includes('Epic')).map(park => (
                    <Link
                      key={park.href}
                      href={buildParkHref(park.href)}
                      className="dropdown-item"
                    >
                      {park.name}
                    </Link>
                  ))}
                </div>
                <div className="dropdown-section">
                  <span className="dropdown-section-label">Other Parks</span>
                  {parks.filter(p => p.name.includes('SeaWorld') || p.name.includes('LEGOLAND')).map(park => (
                    <Link
                      key={park.href}
                      href={buildParkHref(park.href)}
                      className="dropdown-item"
                    >
                      {park.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/rides" className={`nav-link ${isActive('/rides') ? 'active' : ''}`}>
            Rides
          </Link>

          <Link href="/character-dining" className={`nav-link ${isActive('/character-dining') ? 'active' : ''}`}>
            Character Dining
          </Link>

          <Link href="/blog" className={`nav-link ${isActive('/blog') ? 'active' : ''}`}>
            Blog
          </Link>

          <Link href="/deals" className={`nav-link ${isActive('/deals') ? 'active' : ''}`}>
            Deals
          </Link>
        </nav>

        {/* Mobile: Filter button on RIGHT (only on filterable pages) */}
        {hasFilters && (
          <button
            className={`mobile-filter-btn ${hasActiveFilters ? 'active' : ''}`}
            onClick={() => {
              const event = new CustomEvent('openMobileFilters');
              window.dispatchEvent(event);
            }}
            aria-label="Open filters"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
          </button>
        )}
      </div>

      {/* Mobile Nav Backdrop */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Nav Side Sheet */}
      <nav className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <span className="mobile-nav-title">Menu</span>
          <button
            className="mobile-nav-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <div className="mobile-nav-items">
          <Link href="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>

          <div className="mobile-nav-expandable">
            <button
              className={`mobile-nav-link mobile-nav-expand-btn ${isActive('/parks') ? 'active' : ''}`}
              onClick={() => setParksDropdownOpen(!parksDropdownOpen)}
            >
              Parks
              <span className={`mobile-nav-expand-arrow ${parksDropdownOpen ? 'open' : ''}`}>▸</span>
            </button>
            {parksDropdownOpen && (
              <div className="mobile-nav-sub-items">
                <span className="mobile-nav-section-label">Walt Disney World</span>
                {parks.filter(p => p.name.includes('Magic') || p.name.includes('EPCOT') || p.name.includes('Hollywood') || p.name.includes('Animal')).map(park => (
                  <Link
                    key={park.href}
                    href={buildParkHref(park.href)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-nav-sub-link"
                  >
                    {park.name}
                  </Link>
                ))}
                <span className="mobile-nav-section-label" style={{marginTop:'0.75rem'}}>Universal Orlando</span>
                {parks.filter(p => p.name.includes('Universal') || p.name.includes('Islands') || p.name.includes('Epic')).map(park => (
                  <Link
                    key={park.href}
                    href={buildParkHref(park.href)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-nav-sub-link"
                  >
                    {park.name}
                  </Link>
                ))}
                <span className="mobile-nav-section-label" style={{marginTop:'0.75rem'}}>Other Parks</span>
                {parks.filter(p => p.name.includes('SeaWorld') || p.name.includes('LEGOLAND')).map(park => (
                  <Link
                    key={park.href}
                    href={buildParkHref(park.href)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-nav-sub-link"
                  >
                    {park.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/rides" className={`mobile-nav-link ${isActive('/rides') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Rides</Link>
          <Link href="/character-dining" className={`mobile-nav-link ${isActive('/character-dining') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Character Dining</Link>
          <Link href="/blog" className={`mobile-nav-link ${isActive('/blog') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Blog</Link>
          <Link href="/deals" className={`mobile-nav-link ${isActive('/deals') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Deals</Link>
        </div>
      </nav>

      <style>{`
        .site-header {
          background: linear-gradient(to bottom, #fff 0%, rgba(255,255,255,0.97) 100%);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          /* Desktop: hamburger and filter are hidden, logo left, nav right */
        }

        .logo {
          /* On desktop: left-aligned. On mobile: centered via media query */
          flex-shrink: 0;
        }

        .logo img {
          height: 40px;
          width: auto;
        }

        /* Desktop Nav */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-left: auto;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.875rem;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text-medium);
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.15s;
        }

        .nav-link:hover {
          color: var(--text-dark);
          background: var(--bg-light);
        }

        .nav-link.active {
          color: var(--primary);
          background: rgba(243, 112, 33, 0.08);
        }

        .nav-parks-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.875rem;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text-medium);
          border-radius: 8px;
          transition: all 0.15s;
        }

        .nav-parks-btn:hover {
          color: var(--text-dark);
          background: var(--bg-light);
        }

        .nav-parks-btn.active {
          color: var(--primary);
          background: rgba(243, 112, 33, 0.08);
        }

        .dropdown-arrow {
          font-size: 0.625rem;
          margin-left: 0.125rem;
        }

        /* Dropdown */
        .nav-dropdown {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 0.5rem;
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          padding: 1rem;
          display: flex;
          gap: 1.5rem;
          min-width: 280px;
          z-index: 200;
        }

        .dropdown-section {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .dropdown-section-label {
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0 0.5rem;
          margin-bottom: 0.25rem;
        }

        .dropdown-item {
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-medium);
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.15s;
        }

        .dropdown-item:hover {
          color: var(--primary);
          background: var(--bg-light);
        }

        /* Mobile Menu Button */
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          z-index: 10;
          margin-right: 0.5rem;
        }

        .hamburger {
          display: block;
          width: 24px;
          height: 18px;
          position: relative;
        }

        .hamburger span {
          display: block;
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--text-dark);
          transition: all 0.3s;
        }

        .hamburger span:nth-child(1) { top: 0; }
        .hamburger span:nth-child(2) { top: 8px; }
        .hamburger span:nth-child(3) { top: 16px; }

        .hamburger.open span:nth-child(1) { transform: rotate(45deg); top: 8px; }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: rotate(-45deg); top: 8px; }

        /* Mobile Filter Button */
        .mobile-filter-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: var(--text-dark);
          z-index: 10;
          border-radius: 6px;
          transition: background 0.15s, color 0.15s;
          margin-left: 0.5rem;
        }

        .mobile-filter-btn:hover {
          background: var(--bg-light);
        }

        .mobile-filter-btn.active {
          color: var(--primary);
          background: rgba(243, 112, 33, 0.1);
        }

        .mobile-filter-btn.active svg {
          fill: var(--primary);
          stroke: var(--primary);
        }

        /* Mobile Nav Backdrop */
        .mobile-nav-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 149;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Mobile Nav Side Sheet */
        .mobile-nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          height: 100vh;
          background: var(--bg-white);
          z-index: 150;
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 4px 0 24px rgba(0,0,0,0.15);
          overflow-y: auto;
        }

        .mobile-nav.open {
          transform: translateX(0);
        }

        .mobile-nav-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }

        .mobile-nav-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .mobile-nav-close {
          background: none;
          border: none;
          font-size: 1.125rem;
          color: var(--text-medium);
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          transition: background 0.15s;
        }

        .mobile-nav-close:hover {
          background: var(--bg-light);
        }

        .mobile-nav-items {
          display: flex;
          flex-direction: column;
          padding: 0.5rem 0;
          flex: 1;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1.25rem;
          color: var(--text-medium);
          font-weight: 500;
          font-size: 0.9375rem;
          text-decoration: none;
          border: none;
          background: none;
          cursor: pointer;
          font-family: inherit;
          width: 100%;
          text-align: left;
          transition: background 0.15s, color 0.15s;
          border-bottom: 1px solid var(--border);
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          color: var(--primary);
          background: rgba(243, 112, 33, 0.06);
        }

        .mobile-nav-expand-btn {
          justify-content: space-between;
        }

        .mobile-nav-expand-arrow {
          font-size: 0.75rem;
          transition: transform 0.2s;
        }

        .mobile-nav-expand-arrow.open {
          transform: rotate(90deg);
        }

        .mobile-nav-sub-items {
          display: flex;
          flex-direction: column;
          background: var(--bg-light);
          padding: 0.5rem 0;
        }

        .mobile-nav-section-label {
          display: block;
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0.5rem 1.5rem 0.25rem;
        }

        .mobile-nav-sub-link {
          padding: 0.625rem 1.5rem 0.625rem 2rem !important;
          font-size: 0.875rem !important;
          color: var(--text-medium) !important;
          border-bottom: none !important;
        }

        .mobile-nav-sub-link:hover {
          color: var(--primary) !important;
        }

        /* ============================================
           MOBILE: ≤768px — hamburger left, logo center, filter right
           ============================================ */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }

          .mobile-menu-btn {
            display: block;
          }

          .mobile-filter-btn {
            display: block;
          }

          .mobile-nav-backdrop {
            display: block;
          }

          .header-inner {
            justify-content: space-between;
          }

          /* Center the logo on mobile */
          .logo {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }

        /* Desktop: ≥769px — logo left, nav right */
        @media (min-width: 769px) {
          .mobile-nav {
            display: none !important;
          }

          .mobile-nav-backdrop {
            display: none !important;
          }

          .logo {
            position: static;
            transform: none;
          }
        }
      `}</style>
    </header>
  );
}
