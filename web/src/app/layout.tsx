import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import "./blog.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Plan Your Park | Orlando Theme Park Planning Guide",
  description: "Your ultimate guide to Orlando theme parks - Disney World, Universal, SeaWorld & more!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <header className="site-header">
          <div className="header-inner">
            <a href="/" className="logo"><img src="/logo-full.png" alt="Plan Your Park" /></a>
            <nav className="main-nav">
              <a href="/">Home</a>
              <a href="/blog">Blog</a>
              <a href="/park">Parks</a>
              <a href="/rides">Rides</a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <p>© {new Date().getFullYear()} PlanYourPark.com — Affiliate links help support our site</p>
        </footer>
      </body>
    </html>
  );
}
