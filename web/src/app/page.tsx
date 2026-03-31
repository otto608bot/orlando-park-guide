import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import FilterSidebar from "@/components/FilterSidebar";
import EmailForm from "@/components/EmailForm";
import HomepageRides from "@/components/HomepageRides";

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
        {/* Clean Header */}
        <header className="home-header">
          <h1 className="home-title">Find Rides for Everyone</h1>
          <p className="home-subtitle">
            Browse {totalRides} rides across Orlando&apos;s top theme parks
          </p>
        </header>

        {/* Park Cards with Filters */}
        <section className="rides-browser">
          <HomepageRides allRides={allRides} totalCount={totalRides} />
        </section>

        {/* Email Signup */}
        <section className="email-signup-section">
          <div className="email-signup-content">
            <h3>Get Exclusive Park Deals</h3>
            <p>Subscribe for weekly updates on closures, new rides, and money-saving discounts.</p>
            <EmailForm buttonText="Get Updates" />
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

        .home-header {
          text-align: center;
          margin-bottom: 2rem;
          padding: 2rem;
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 16px;
        }

        .home-title {
          font-family: var(--font-heading);
          font-size: clamp(1.75rem, 5vw, 2.5rem);
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }

        .home-subtitle {
          font-size: 1rem;
          color: var(--text-medium);
        }

        .rides-browser {
          margin-bottom: 2.5rem;
        }

        .email-signup-section {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2.5rem 2rem;
          text-align: center;
        }

        .email-signup-content h3 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }

        .email-signup-content p {
          font-size: 1rem;
          color: var(--text-medium);
          margin-bottom: 1.5rem;
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
