import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import FilterSidebar from "@/components/FilterSidebar";
import EmailForm from "@/components/EmailForm";

export const metadata: Metadata = {
  title: "Plan Your Park | Orlando Theme Park Planning Guide",
  description: "Your ultimate guide to Orlando theme parks - Disney World, Universal, SeaWorld & more!",
};

const parkImages: Record<string, string> = {
  'magic-kingdom': 'Magic-Kingdom.webp',
  'epcot': 'epcot.jpeg',
  'hollywood-studios': 'Hollywood-Studios.jpeg',
  'animal-kingdom': 'animal-kingdom.jpeg',
  'universal-studios-florida': 'Universal-Studios-Florida.jpeg',
  'islands-of-adventure': 'islands-of-adventure.webp',
  'epic-universe': 'epic-universe.jpeg',
  'seaworld-orlando': 'sea-world.jpeg',
  'legoland-florida': 'legoland.jpeg',
};

const parkOrganizations: Record<string, string> = {
  'magic-kingdom': 'Walt Disney World',
  'epcot': 'Walt Disney World',
  'hollywood-studios': 'Walt Disney World',
  'animal-kingdom': 'Walt Disney World',
  'universal-studios-florida': 'Universal Orlando',
  'islands-of-adventure': 'Universal Orlando',
  'epic-universe': 'Universal Orlando',
  'seaworld-orlando': 'SeaWorld Parks',
  'legoland-florida': 'Merlin Entertainments',
};

async function getHomePageData() {
  const [parks, allRides] = await Promise.all([
    sanityClient.fetch(`
      *[_type == "park"] | order(name asc) [0...6] {
        _id,
        name,
        slug,
        description,
        image { asset-> { url }, alt }
      }
    `),
    sanityClient.fetch(`
      *[_type == "ride"] {
        _id,
        name,
        park
      }
    `),
  ]);

  // Count rides per park
  const rideCounts: Record<string, number> = {};
  allRides.forEach((ride: any) => {
    if (ride.park) {
      rideCounts[ride.park] = (rideCounts[ride.park] || 0) + 1;
    }
  });

  // Get sample rides per park
  const sampleRides: Record<string, string[]> = {};
  const processedParks = new Set<string>();
  allRides.forEach((ride: any) => {
    if (ride.park && !processedParks.has(ride.park)) {
      if (!sampleRides[ride.park]) {
        sampleRides[ride.park] = [];
      }
      if (sampleRides[ride.park].length < 3) {
        sampleRides[ride.park].push(ride.name);
      }
    }
  });

  return { parks, rideCounts, sampleRides, totalRides: allRides.length };
}

export default async function HomePage() {
  const { parks, rideCounts, sampleRides, totalRides } = await getHomePageData();

  return (
    <div className="home-layout">
      {/* Filter Sidebar */}
      <FilterSidebar />

      {/* Main Content */}
      <div className="home-main">
        <header className="home-header">
          <h1 className="home-title">Find Rides for Everyone</h1>
          <div className="ride-count-display">
            <span className="count-number">{totalRides}</span>
            <span className="count-label">OF {totalRides} RIDES</span>
          </div>
          <div className="park-group-breakdown">
            <span className="breakdown-item">🐭 Disney World: {Object.keys(rideCounts).filter(p => p.includes('Magic') || p.includes('EPCOT') || p.includes('Hollywood') || p.includes('Animal')).reduce((sum, p) => sum + (rideCounts[p] || 0), 0)}</span>
            <span className="breakdown-item">🎢 Universal: {Object.keys(rideCounts).filter(p => p.includes('Universal') || p.includes('Islands') || p.includes('Epic')).reduce((sum, p) => sum + (rideCounts[p] || 0), 0)}</span>
            <span className="breakdown-item">🐬 SeaWorld: {Object.keys(rideCounts).filter(p => p.includes('SeaWorld')).reduce((sum, p) => sum + (rideCounts[p] || 0), 0)}</span>
            <span className="breakdown-item">🧱 LEGOLAND: {Object.keys(rideCounts).filter(p => p.includes('LEGOLAND')).reduce((sum, p) => sum + (rideCounts[p] || 0), 0)}</span>
          </div>
        </header>

        {/* Parks Grid */}
        <section className="parks-section">
          <div className="section-header">
            <h2>Explore Orlando Parks</h2>
            <Link href="/parks" className="see-all">View all parks →</Link>
          </div>
          <div className="parks-grid">
            {parks.map((park: any) => {
              const slug = park.slug?.current || '';
              const imageSrc = park.image?.asset?.url || `/${parkImages[slug] || 'Disney-World.webp'}`;
              const rideCount = rideCounts[park.name] || 0;
              const samples = sampleRides[park.name] || [];

              return (
                <Link key={park._id} href={`/parks/${slug}`} className="park-card">
                  <div className="park-card-image">
                    <img src={imageSrc} alt={park.image?.alt || park.name} />
                    <div className="park-card-overlay" />
                  </div>
                  <div className="park-card-content">
                    <div className="park-card-header">
                      <h3>{park.name}</h3>
                      <span className="park-org">{parkOrganizations[slug] || ''}</span>
                    </div>
                    <div className="ride-count-badge">
                      <span className="count">{rideCount}</span>
                      <span className="label">Rides</span>
                    </div>
                    {samples.length > 0 && (
                      <div className="sample-rides">
                        {samples.map((name, i) => (
                          <span key={i} className="sample-ride">{name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
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
          margin-bottom: 2.5rem;
          padding: 2rem;
          background: linear-gradient(135deg, var(--primary) 0%, #e85a1a 100%);
          border-radius: 16px;
          color: white;
        }

        .home-title {
          font-family: var(--font-heading);
          font-size: clamp(1.75rem, 5vw, 2.5rem);
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
        }

        .ride-count-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1rem;
        }

        .count-number {
          font-family: var(--font-heading);
          font-size: 3rem;
          font-weight: 800;
          line-height: 1;
        }

        .count-label {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          opacity: 0.9;
        }

        .park-group-breakdown {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          margin-top: 1rem;
        }

        .breakdown-item {
          font-size: 0.8125rem;
          font-weight: 500;
          background: rgba(255,255,255,0.15);
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
        }

        /* Parks Grid */
        .parks-section {
          margin-bottom: 3rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .see-all {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--primary);
          text-decoration: none;
        }

        .see-all:hover {
          text-decoration: underline;
        }

        .parks-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .park-card {
          display: block;
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
        }

        .park-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          border-color: var(--primary);
        }

        .park-card-image {
          position: relative;
          height: 140px;
          overflow: hidden;
        }

        .park-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .park-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4) 100%);
        }

        .park-card-content {
          padding: 1rem;
        }

        .park-card-header {
          margin-bottom: 0.75rem;
        }

        .park-card-header h3 {
          font-family: var(--font-heading);
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-dark);
          margin: 0 0 0.25rem;
        }

        .park-org {
          font-size: 0.75rem;
          color: var(--text-light);
        }

        .ride-count-badge {
          display: inline-flex;
          align-items: baseline;
          gap: 0.25rem;
          background: var(--bg-light);
          padding: 0.25rem 0.625rem;
          border-radius: 6px;
          margin-bottom: 0.75rem;
        }

        .ride-count-badge .count {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--primary);
        }

        .ride-count-badge .label {
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--text-light);
          text-transform: uppercase;
        }

        .sample-rides {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }

        .sample-ride {
          font-size: 0.6875rem;
          color: var(--text-medium);
          background: var(--bg-light);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        /* Email Signup */
        .email-signup-section {
          background: linear-gradient(135deg, var(--primary) 0%, #e85a1a 100%);
          border-radius: 16px;
          padding: 2.5rem 2rem;
          text-align: center;
          color: white;
        }

        .email-signup-content h3 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
        }

        .email-signup-content p {
          font-size: 1rem;
          opacity: 0.9;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 900px) {
          .home-layout {
            flex-direction: column;
          }

          .parks-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .home-layout {
            padding: 1rem;
          }

          .park-group-breakdown {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
