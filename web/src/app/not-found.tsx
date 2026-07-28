import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page may have moved. Compare Orlando parks, filter rides by height, or jump back into family ticket deals.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="not-found-page">
      <p className="not-found-eyebrow">Page not found</p>
      <h1>Let&apos;s get your family back to planning.</h1>
      <p>
        The page you tried may have moved. Start with the park comparison, check rides by height,
        or browse our family trip guides.
      </p>
      <nav aria-label="Helpful planning links" className="not-found-links">
        <Link href="/parks/">Compare Orlando parks</Link>
        <Link href="/rides/?height=40">Find rides by height</Link>
        <Link href="/blog/epic-universe-1-day-plan/">Epic Universe 1-day plan</Link>
        <Link href="/deals/">Family ticket deals</Link>
      </nav>
      <style>{`
        .not-found-page { max-width: 760px; margin: 0 auto; padding: 5rem 1.5rem 6rem; text-align: center; }
        .not-found-eyebrow { color: var(--primary); font-weight: 800; letter-spacing: .06em; text-transform: uppercase; font-size: .8rem; }
        .not-found-page h1 { color: var(--text-dark); font-family: var(--font-heading); font-size: clamp(2rem, 6vw, 3.25rem); margin: .5rem 0 1rem; }
        .not-found-page > p:not(.not-found-eyebrow) { color: var(--text-medium); line-height: 1.7; font-size: 1.05rem; }
        .not-found-links { display: flex; flex-wrap: wrap; justify-content: center; gap: .75rem; margin-top: 2rem; }
        .not-found-links a { background: var(--primary); border-radius: 999px; color: white; font-weight: 700; padding: .75rem 1rem; text-decoration: none; }
      `}</style>
    </main>
  );
}
