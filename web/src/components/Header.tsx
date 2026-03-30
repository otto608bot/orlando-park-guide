'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [parksOpen, setParksOpen] = useState(false)

  return (
    <header className="global-header">
      <div className="global-header-content">
        <button
          className="global-mobile-menu-btn"
          aria-label="Open menu"
          onClick={() => {
            if (typeof window !== 'undefined') {
              (window as unknown as { __openMobileNav?: () => void }).__openMobileNav?.()
            }
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div className="global-logo">
          <Link href="/">
            <img src="/logo-full.png" alt="Plan Your Park" />
          </Link>
        </div>

        <nav className="global-nav">
          <Link href="/">Home</Link>
          <div className="nav-dropdown">
            <button
              className="nav-dropdown-toggle"
              onClick={() => setParksOpen(!parksOpen)}
              aria-expanded={parksOpen}
            >
              Parks
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div className={`nav-dropdown-menu${parksOpen ? ' active' : ''}`}>
              <Link href="/park/magic-kingdom">Magic Kingdom</Link>
              <Link href="/park/epcot">EPCOT</Link>
              <Link href="/park/hollywood-studios">Hollywood Studios</Link>
              <Link href="/park/animal-kingdom">Animal Kingdom</Link>
              <Link href="/park/universal-studios">Universal Studios Florida</Link>
              <Link href="/park/islands-of-adventure">Islands of Adventure</Link>
              <Link href="/park/seaworld">SeaWorld Orlando</Link>
              <Link href="/park/legoland">LEGOLAND Florida</Link>
            </div>
          </div>
          <Link href="/rides">Rides</Link>
          <Link href="/character-dining">Character Dining</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/deals">Deals</Link>
        </nav>

        <button className="global-mobile-filter-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Filters
        </button>
      </div>
    </header>
  )
}