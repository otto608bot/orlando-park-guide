'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo">
          <img src="/logo-full.png" alt="Plan Your Park" />
        </Link>
        
        {/* Desktop Nav */}
        <nav className="main-nav desktop-nav">
          <Link href="/parks">Parks</Link>
          <Link href="/rides">Rides</Link>
          <Link href="/character-dining">Character Dining</Link>
          <Link href="/deals">Deals</Link>
          <Link href="/blog">Blog</Link>
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
        <Link href="/parks" onClick={() => setMobileMenuOpen(false)}>Parks</Link>
        <Link href="/rides" onClick={() => setMobileMenuOpen(false)}>Rides</Link>
        <Link href="/character-dining" onClick={() => setMobileMenuOpen(false)}>Character Dining</Link>
        <Link href="/deals" onClick={() => setMobileMenuOpen(false)}>Deals</Link>
        <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
      </nav>
      
      <style>{`
        .desktop-nav {
          display: flex;
        }
        
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
        }
        
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }
        
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block;
          }
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
          padding: 1rem;
          background: var(--bg-white);
          border-top: 1px solid var(--border);
        }
        
        .mobile-nav.open {
          display: flex;
        }
        
        @media (min-width: 769px) {
          .mobile-nav {
            display: none !important;
          }
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
      `}</style>
    </header>
  );
}
