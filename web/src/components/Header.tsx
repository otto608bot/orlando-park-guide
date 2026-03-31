'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [parksDropdownOpen, setParksDropdownOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

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
        <Link href="/" className="logo">
          <img src="/logo-full.png" alt="Plan Your Park" />
        </Link>
        
        {/* Desktop Nav */}
        <nav className="main-nav desktop-nav">
          <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          
          <div 
            className="nav-dropdown"
            onMouseEnter={() => setParksDropdownOpen(true)}
            onMouseLeave={() => setParksDropdownOpen(false)}
          >
            <Link 
              href="/parks" 
              className={`nav-link dropdown-trigger ${isActive('/parks') ? 'active' : ''}`}
            >
              Parks
              <span className="dropdown-arrow">▾</span>
            </Link>
            
            {parksDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-section">
                  <span className="dropdown-section-label">Walt Disney World</span>
                  {parks.filter(p => p.name.includes('Magic') || p.name.includes('EPCOT') || p.name.includes('Hollywood') || p.name.includes('Animal')).map(park => (
                    <Link 
                      key={park.href} 
                      href={park.href} 
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
                      href={park.href} 
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
                      href={park.href} 
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
        
        {/* Mobile Menu Button */}
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
      </div>
      
      {/* Mobile Nav */}
      <nav className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
        <div className="mobile-nav-section">
          <span className="mobile-nav-section-title">Parks</span>
          {parks.map(park => (
            <Link 
              key={park.href} 
              href={park.href} 
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-sub"
            >
              {park.name}
            </Link>
          ))}
        </div>
        <Link href="/rides" onClick={() => setMobileMenuOpen(false)}>Rides</Link>
        <Link href="/character-dining" onClick={() => setMobileMenuOpen(false)}>Character Dining</Link>
        <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
        <Link href="/deals" onClick={() => setMobileMenuOpen(false)}>Deals</Link>
      </nav>
      
      <style>{`
        .site-header {
          background: var(--bg-white);
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
          justify-content: space-between;
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

        /* Mobile Menu */
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
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

        .mobile-nav {
          display: none;
          flex-direction: column;
          padding: 0 1rem 1rem;
          background: var(--bg-white);
          border-top: 1px solid var(--border);
        }

        .mobile-nav.open {
          display: flex;
        }

        .mobile-nav a {
          padding: 0.75rem 0;
          color: var(--text-medium);
          font-weight: 500;
          text-decoration: none;
          border-bottom: 1px solid var(--border);
        }

        .mobile-nav a:last-child {
          border-bottom: none;
        }

        .mobile-nav-section {
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border);
        }

        .mobile-nav-section-title {
          display: block;
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.5rem;
        }

        .mobile-nav-sub {
          padding-left: 1rem !important;
          font-size: 0.875rem !important;
        }

        @media (max-width: 900px) {
          .desktop-nav {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }
        }

        @media (min-width: 901px) {
          .mobile-nav {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
