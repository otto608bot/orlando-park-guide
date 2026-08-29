import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import FilterSidebar from "@/components/FilterSidebar";
import NewsletterForm from "@/components/NewsletterForm";
import HomepageRides from "@/components/HomepageRides";
import HomepageHeader from "@/components/HomepageHeader";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Orlando Parks Ride Finder for Kids — Height & Thrill Filters",
  description:
    "Plan Orlando theme parks with kids: filter Disney, Universal, Epic Universe, SeaWorld & LEGOLAND rides by height, thrills, and accessibility — then pick the right park.",
  path: "/",
  keywords: [
    "orlando theme parks with kids",
    "rides by height orlando",
    "disney universal height filter",
    "best orlando park for kids",
  ],
});

async function getHomePageData() {
  const allRides = await sanityClient.fetch(`
    *[_type == "ride"] | order(park asc, thrillLevel desc, name asc) {
      _id,
      name,
      park,
      slug,
      description,
      heightRequirement,
      thrillLevel,
      rideType,
      accessibility,
      image { asset-> { url }, alt },
      isClosed
    }
  `);

  return { allRides, totalRides: allRides.length };
}

export default async function HomePage() {
  const { allRides, totalRides } = await getHomePageData();

  return (
    <div className="home-layout">
      {/* Filter Sidebar */}
      <FilterSidebar />

      {/* Main Content */}
      <div className="home-main">
        {/* Hero Callout */}
        <HomepageHeader totalRides={totalRides} allRides={allRides} />

        {/* Planning shortcuts → parks hub, earners, ticket deals (SSR for SEO) */}
        <section className="home-start-here" aria-label="Family planning shortcuts">
          <div className="home-start-here-copy">
            <h2>Planning a family trip?</h2>
            <p>
              Filter rides below by height — or jump to park comparisons, proven day plans, and
              ticket options.
            </p>
          </div>
          <div className="home-start-here-grid">
            <Link href="/parks/" className="home-start-card">
              <strong>Which Orlando park fits?</strong>
              <span>Compare Disney, Universal, Epic, SeaWorld &amp; LEGOLAND for kids.</span>
            </Link>
            <Link href="/rides/for/under-40/" className="home-start-card">
              <strong>Rides under ~40″</strong>
              <span>Crawlable height list so you skip lines your kids can&apos;t ride.</span>
            </Link>
            <Link href="/rides/for/disney-world-under-40/" className="home-start-card">
              <strong>Disney World under ~40″</strong>
              <span>All 4 Disney parks — Magic Kingdom through Animal Kingdom short riders.</span>
            </Link>
            <Link href="/rides/for/universal-orlando-under-40/" className="home-start-card">
              <strong>Universal Orlando under ~40″</strong>
              <span>USF + Islands + Epic short-rider list in one crawlable page.</span>
            </Link>
            <Link href="/rides/for/disney-world-52/" className="home-start-card">
              <strong>Disney World 52″+</strong>
              <span>Near-full access across all 4 Disney parks for taller kids.</span>
            </Link>
            <Link href="/blog/epic-universe-1-day-plan/" className="home-start-card">
              <strong>Epic Universe 1-day plan</strong>
              <span>Our best-performing family touring plan for the newest park.</span>
            </Link>
            <Link href="/blog/best-magic-kingdom-rides-kids-under-40-inches/" className="home-start-card">
              <strong>Magic Kingdom under 40″</strong>
              <span>What shorter kids can actually ride at the most popular park.</span>
            </Link>
            <Link href="/deals/" className="home-start-card">
              <strong>Family ticket deals</strong>
              <span>Compare partner pricing before you lock dates.</span>
            </Link>
          </div>
        </section>

        {/* Park Cards with Filters */}
        <section className="rides-browser">
          <HomepageRides allRides={allRides} totalCount={totalRides} />
        </section>

        {/* Email Signup */}
        <section className="email-signup-section">
          <div className="email-signup-inner">
            <div className="email-signup-icon">🏰</div>
            <h3>Get Weekly Disney Tips</h3>
            <p>Closures, new rides, and money-saving tips — delivered every Tuesday.</p>
            <NewsletterForm />
          </div>
        </section>
      </div>

      <style>{`
        .home-layout {
          display: flex;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }

        .home-main {
          flex: 1;
          min-width: 0;
        }

        .rides-browser {
          margin-bottom: 2.5rem;
        }

        .home-start-here {
          margin: 0 0 1.5rem;
          padding: 1.15rem 1.15rem 1.25rem;
          background: #fff;
          border: 1px solid var(--border, #e2e8f0);
          border-radius: 14px;
        }

        .home-start-here-copy h2 {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-dark);
          margin: 0 0 0.35rem;
        }

        .home-start-here-copy p {
          margin: 0 0 0.9rem;
          color: var(--text-medium);
          font-size: 0.95rem;
          line-height: 1.55;
          max-width: 52rem;
        }

        .home-start-here-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 0.65rem;
        }

        .home-start-card {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          text-decoration: none;
          border: 1px solid var(--border, #e2e8f0);
          background: var(--bg-light, #fff7ed);
          border-radius: 12px;
          padding: 0.8rem 0.9rem;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .home-start-card:hover {
          border-color: var(--primary, #f37021);
          box-shadow: 0 4px 14px rgba(243, 112, 33, 0.12);
        }

        .home-start-card strong {
          color: var(--text-dark);
          font-size: 0.92rem;
          line-height: 1.3;
        }

        .home-start-card span {
          color: var(--text-medium);
          font-size: 0.8rem;
          line-height: 1.4;
        }

        .email-signup-section {
          background: linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%);
          border: 1px solid #FED7AA;
          border-radius: 16px;
          padding: 2.5rem 2rem;
          text-align: center;
        }

        .email-signup-inner h3 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }

        .email-signup-inner p {
          font-size: 1rem;
          color: var(--text-medium);
          margin-bottom: 1.5rem;
        }

        .email-signup-icon {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
        }

        @media (max-width: 900px) {
          .home-layout {
            flex-direction: column;
          }
        }

        @media (max-width: 640px) {
          .home-layout {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
