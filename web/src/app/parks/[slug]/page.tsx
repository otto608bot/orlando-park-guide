import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import RideCard from "@/components/RideCard";

interface ParkPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const parks = await sanityClient.fetch(`
    *[_type == "park"] { "slug": slug.current }
  `);
  return parks.map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ParkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const park = await sanityClient.fetch(`
    *[_type == "park" && slug.current == $slug][0] {
      name,
      description
    }
  `, { slug });
  
  if (!park) return { title: "Park Not Found" };
  return {
    title: park.name,
    description: park.description,
  };
}

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

async function getParkData(slug: string) {
  const [park, rides] = await Promise.all([
    sanityClient.fetch(`
      *[_type == "park" && slug.current == $slug][0] {
        _id,
        name,
        slug,
        description,
        image { asset-> { url }, alt }
      }
    `, { slug }),
    sanityClient.fetch(`
      *[_type == "ride" && park == $parkName] | order(thrillLevel desc, name asc) {
        _id,
        name,
        park,
        description,
        heightRequirement,
        thrillLevel,
        rideType,
        accessibility,
        isClosed,
        closureNote
      }
    `, { parkName: slugToParkName(slug) }),
  ]);
  
  return { park, rides };
}

function slugToParkName(slug: string): string {
  const map: Record<string, string> = {
    'magic-kingdom': 'Magic Kingdom',
    'epcot': 'EPCOT',
    'hollywood-studios': 'Hollywood Studios',
    'animal-kingdom': 'Animal Kingdom',
    'universal-studios-florida': 'Universal Studios Florida',
    'islands-of-adventure': 'Islands of Adventure',
    'epic-universe': 'Epic Universe',
    'seaworld-orlando': 'SeaWorld Orlando',
    'legoland-florida': 'LEGOLAND Florida',
  };
  return map[slug] || slug;
}

export default async function ParkDetailPage({ params }: ParkPageProps) {
  const { slug } = await params;
  const { park, rides } = await getParkData(slug);
  
  if (!park) {
    return (
      <div className="park-detail-container">
        <h1>Park Not Found</h1>
        <p>Sorry, we couldn&apos;t find this park.</p>
        <Link href="/parks">← Back to all parks</Link>
      </div>
    );
  }

  const imageSrc = park.image?.asset?.url || `/${parkImages[slug] || 'Disney-World.webp'}`;

  return (
    <div className="park-detail-container">
      <div className="park-hero">
        <img src={imageSrc} alt={park.image?.alt || park.name} />
        <div className="park-hero-overlay">
          <h1>{park.name}</h1>
        </div>
      </div>
      
      <div className="park-content">
        {park.description && (
          <section className="park-description">
            <p>{park.description}</p>
          </section>
        )}
        
        <section className="park-rides">
          <h2>Rides & Attractions ({rides.length})</h2>
          <div className="rides-grid">
            {rides.map((ride: any) => (
              <RideCard key={ride._id} ride={ride} />
            ))}
          </div>
          {rides.length === 0 && (
            <p className="no-rides">No rides found for this park.</p>
          )}
        </section>
        
        <div className="park-cta">
          <Link href="/rides" className="cta-secondary">Browse All Rides</Link>
          <a 
            href="https://www.dpbolvw.net/click-101693488-5527150" 
            target="_blank" 
            rel="noopener"
            className="cta-primary"
          >
            Get Tickets
          </a>
        </div>
      </div>
      
      <style>{`
        .park-detail-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 0 4rem;
        }
        
        .park-hero {
          position: relative;
          width: 100%;
          height: 300px;
          overflow: hidden;
          background: var(--bg-light);
        }
        
        .park-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .park-hero-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem 1.5rem;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
        }
        
        .park-hero-overlay h1 {
          font-family: var(--font-heading);
          font-size: clamp(1.75rem, 5vw, 2.5rem);
          font-weight: 800;
          color: white;
          margin: 0;
        }
        
        .park-content {
          padding: 2rem 1.5rem;
        }
        
        .park-description {
          margin-bottom: 2.5rem;
        }
        
        .park-description p {
          font-size: 1.0625rem;
          color: var(--text-medium);
          line-height: 1.7;
        }
        
        .park-rides h2 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 1.5rem;
        }
        
        .rides-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        
        .no-rides {
          color: var(--text-light);
          text-align: center;
          padding: 2rem;
        }
        
        .park-cta {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 3rem;
          flex-wrap: wrap;
        }
        
        .cta-primary {
          display: inline-block;
          background: var(--primary);
          color: white;
          padding: 0.875rem 1.75rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.2s;
        }
        
        .cta-primary:hover {
          background: #e85a1a;
        }
        
        .cta-secondary {
          display: inline-block;
          background: var(--bg-white);
          color: var(--text-dark);
          padding: 0.875rem 1.75rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          border: 1px solid var(--border);
          transition: all 0.2s;
        }
        
        .cta-secondary:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        
        @media (max-width: 640px) {
          .park-hero { height: 200px; }
          .park-content { padding: 1.5rem 1rem; }
          .rides-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
