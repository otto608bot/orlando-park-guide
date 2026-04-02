import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import FilterSidebar from "@/components/FilterSidebar";
import TallyNewsletter from "@/components/TallyNewsletter";
import HomepageRides from "@/components/HomepageRides";
import HomepageHeader from "@/components/HomepageHeader";

export const metadata: Metadata = {
  title: "Plan Your Park | Orlando Theme Park Planning Guide",
  description: "Your ultimate guide to Orlando theme parks - Disney World, Universal, SeaWorld & more!",
};

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
            <TallyNewsletter />
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
