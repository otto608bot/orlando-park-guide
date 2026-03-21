#!/usr/bin/env node
/**
 * Update all pages with standardized global navigation
 * Usage: node update-global-nav.mjs
 */

import fs from 'fs';
import path from 'path';

const SITE_DIR = '/Users/rufusbot/.openclaw/workspace/orlando-park-guide';

// Standardized navigation component
const globalNavComponent = `<!-- Header -->
<header class="header">
  <div class="header-content">
    <button class="mobile-menu-btn" onclick="toggleMobileNav()" aria-label="Open menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
    
    <a href="/" class="logo">
      <img src="/logo-full.png" alt="Plan Your Park" class="logo-img">
    </a>
    
    <nav class="nav">
      <a href="/">Rides</a>
      <a href="/character-dining.html">Character Dining</a>
      <a href="/blog/">Blog</a>
    </nav>
  </div>
</header>

<div class="mobile-nav-sheet" id="mobileNavSheet" onclick="closeMobileNav(event)">
  <div class="mobile-nav-content" onclick="event.stopPropagation()">
    <div class="mobile-nav-header">
      <h3>Menu</h3>
      <button class="mobile-nav-close" onclick="toggleMobileNav()" aria-label="Close menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <nav class="mobile-nav">
      <a href="/" onclick="toggleMobileNav()">Rides</a>
      <a href="/character-dining.html" onclick="toggleMobileNav()">Character Dining</a>
      <a href="/blog/" onclick="toggleMobileNav()">Blog</a>
    </nav>
  </div>
</div>
`;

// Standardized CSS (add to :root or at top of style block)
const globalNavCSS = `
  /* Global Header */
  .header {
    background: var(--white);
    border-bottom: 1px solid var(--gray-200);
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: var(--shadow-sm);
  }
  
  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }
  
  .logo {
    display: flex;
    align-items: center;
  }
  
  .logo-img {
    height: 48px;
    width: auto;
    object-fit: contain;
  }
  
  .nav {
    display: flex;
    gap: 2rem;
    margin-left: auto;
  }
  
  .nav a {
    color: var(--gray-600);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9375rem;
    transition: color 0.2s;
  }
  
  .nav a:hover,
  .nav a.active {
    color: var(--action-orange);
  }
  
  .mobile-menu-btn {
    display: none;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--gray-600);
    border-radius: 8px;
    transition: background 0.2s;
  }
  
  .mobile-menu-btn:hover {
    background: var(--gray-100);
  }
  
  .mobile-menu-btn svg {
    width: 24px;
    height: 24px;
  }
  
  .mobile-nav-sheet {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 200;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0.3s;
  }
  
  .mobile-nav-sheet.active {
    opacity: 1;
    visibility: visible;
  }
  
  .mobile-nav-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 280px;
    height: 100%;
    background: var(--white);
    padding: 1.5rem;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
  }
  
  .mobile-nav-sheet.active .mobile-nav-content {
    transform: translateX(0);
  }
  
  .mobile-nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--gray-200);
  }
  
  .mobile-nav-header h3 {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
  }
  
  .mobile-nav-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--gray-600);
    border-radius: 6px;
    transition: background 0.2s;
  }
  
  .mobile-nav-close:hover {
    background: var(--gray-100);
  }
  
  .mobile-nav-close svg {
    width: 20px;
    height: 20px;
  }
  
  .mobile-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .mobile-nav a {
    color: var(--base-dark);
    text-decoration: none;
    font-weight: 500;
    font-size: 1.125rem;
    padding: 0.875rem 1rem;
    border-radius: 8px;
    transition: background 0.2s;
  }
  
  .mobile-nav a:hover {
    background: var(--gray-100);
    color: var(--action-orange);
  }
  
  @media (max-width: 768px) {
    .header-content {
      padding: 0.75rem 1rem;
    }
    
    .mobile-menu-btn {
      display: flex;
    }
    
    .nav {
      display: none;
    }
    
    .logo-img {
      height: 40px;
    }
  }
  
  @media (min-width: 769px) {
    .mobile-menu-btn,
    .mobile-nav-sheet {
      display: none !important;
    }
    
    .nav {
      display: flex !important;
    }
  }
`;

// Standardized JavaScript
const globalNavJS = `
function toggleMobileNav() {
  const sheet = document.getElementById('mobileNavSheet');
  sheet.classList.toggle('active');
  document.body.style.overflow = sheet.classList.contains('active') ? 'hidden' : '';
}

function closeMobileNav(event) {
  if (event.target === event.currentTarget) {
    toggleMobileNav();
  }
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const sheet = document.getElementById('mobileNavSheet');
    if (sheet && sheet.classList.contains('active')) {
      toggleMobileNav();
    }
  }
});
`;

console.log('Global navigation component created at components/global-nav.html');
console.log('CSS and JS components ready for injection');
console.log('');
console.log('To apply to all pages:');
console.log('1. Add the CSS to each page\'s :root or style block');
console.log('2. Replace header HTML with the component');
console.log('3. Add the JavaScript before closing </body>');
