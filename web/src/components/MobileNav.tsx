'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [parksOpen, setParksOpen] = useState(true)

  return (
    <>
      {/* Mobile Nav Sheet */}
      <div
        className={`global-mobile-nav-sheet${isOpen ? ' active' : ''}`}
        onClick={() => setIsOpen(false)}
      >
        <div className="global-mobile-nav-content" onClick={(e) => e.stopPropagation()}>
          <div className="global-mobile-nav-header">
            <h3>Menu</h3>
            <button className="global-close-nav-btn" onClick={() => setIsOpen(false)}>
              &times;
            </button>
          </div>
          <nav className="global-mobile-nav-links">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Home
            </Link>
            <div className={`mobile-nav-section${parksOpen ? ' expanded' : ''}`}>
              <div
                className="mobile-nav-section-header"
                onClick={() => setParksOpen(!parksOpen)}
              >
                <span className="mobile-nav-section-title">Parks</span>
                <svg className="mobile-nav-section-toggle" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              <div className="mobile-nav-section-content">
                <Link href="/park/magic-kingdom" onClick={() => setIsOpen(false)}>Magic Kingdom</Link>
                <Link href="/park/epcot" onClick={() => setIsOpen(false)}>EPCOT</Link>
                <Link href="/park/hollywood-studios" onClick={() => setIsOpen(false)}>Hollywood Studios</Link>
                <Link href="/park/animal-kingdom" onClick={() => setIsOpen(false)}>Animal Kingdom</Link>
                <Link href="/park/universal-studios" onClick={() => setIsOpen(false)}>Universal Studios Florida</Link>
                <Link href="/park/islands-of-adventure" onClick={() => setIsOpen(false)}>Islands of Adventure</Link>
                <Link href="/park/seaworld" onClick={() => setIsOpen(false)}>SeaWorld Orlando</Link>
                <Link href="/park/legoland" onClick={() => setIsOpen(false)}>LEGOLAND Florida</Link>
              </div>
            </div>
            <Link href="/rides" onClick={() => setIsOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12h4l3-9 6 18 3-9h4"></path>
              </svg>
              Rides
            </Link>
            <Link href="/character-dining" onClick={() => setIsOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                <path d="M7 2v20"></path>
                <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
              </svg>
              Character Dining
            </Link>
            <Link href="/blog" onClick={() => setIsOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              Blog
            </Link>
            <Link href="/deals" onClick={() => setIsOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Deals
            </Link>
          </nav>
        </div>
      </div>

      {/* Expose open function via a data attribute + script */}
      <button
        id="mobile-nav-trigger"
        className="hidden"
        onClick={() => setIsOpen(true)}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.__openMobileNav = function() {
              document.dispatchEvent(new CustomEvent('open-mobile-nav'));
            };
            document.addEventListener('open-mobile-nav', function() {
              var el = document.querySelector('.global-mobile-nav-sheet');
              if (el) el.classList.add('active');
            });
          `,
        }}
      />
    </>
  )
}