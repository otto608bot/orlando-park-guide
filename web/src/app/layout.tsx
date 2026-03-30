import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Plan Your Park | Orlando Theme Park Planning Guide",
  description:
    "Your ultimate guide to Orlando theme parks - Disney World, Universal, SeaWorld & more!",
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon/favicon-64x64.png", sizes: "64x64" },
    ],
    apple: "/favicon/favicon-180x180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable}`}>
      <body className="min-h-full flex flex-col antialiased">
        {/* Global Header */}
        <header className="global-header">
          <div className="global-header-content">
            <button
              className="global-mobile-menu-btn"
              aria-label="Open menu"
              onClick={() => {
                /* JS-driven mobile nav */
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
                <button className="nav-dropdown-toggle">
                  Parks
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div className="nav-dropdown-menu">
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

        {/* Mobile Nav Sheet */}
        <div className="global-mobile-nav-sheet">
          <div className="global-mobile-nav-content">
            <div className="global-mobile-nav-header">
              <h3>Menu</h3>
              <button className="global-close-nav-btn">&times;</button>
            </div>
            <nav className="global-mobile-nav-links">
              <Link href="/">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Home
              </Link>
              <div className="mobile-nav-section expanded">
                <div className="mobile-nav-section-header">
                  <span className="mobile-nav-section-title">Parks</span>
                  <svg className="mobile-nav-section-toggle" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                <div className="mobile-nav-section-content">
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
          </div>
        </div>

        {children}

        {/* Site Footer */}
        <footer className="site-footer">
          <p>
            &copy; {new Date().getFullYear()} PlanYourPark.com |{" "}
            <a href="/privacy-policy">Privacy Policy</a> | Affiliate links help
            support our site
          </p>
        </footer>
      </body>
    </html>
  );
}