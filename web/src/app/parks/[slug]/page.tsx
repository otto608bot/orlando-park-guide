import type { Metadata } from "next";
export const revalidate = 60;
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import ParkRidesGrid from "@/components/ParkRidesGrid";
import CharacterDiningTable from "@/components/CharacterDiningTable";
import FilterSidebar from "@/components/FilterSidebar";
import { getParkTicketLink } from "@/config/affiliate-links";

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
  'universal-studios-florida': 'Universal-Studios.jpeg',
  'islands-of-adventure': 'islands-of-adventure.webp',
  'epic-universe': 'epic-universe.jpeg',
  'seaworld-orlando': 'sea-world.jpeg',
  'legoland-florida': 'legoland.jpeg',
};

const parkColors: Record<string, string> = {
  'magic-kingdom': '#4A9DE8',
  'epcot': '#8B5CF6',
  'hollywood-studios': '#EF4444',
  'animal-kingdom': '#10B981',
  'universal-studios-florida': '#F59E0B',
  'islands-of-adventure': '#06B6D4',
  'epic-universe': '#8B5CF6',
  'seaworld-orlando': '#3B82F6',
  'legoland-florida': '#F97316',
};

async function getParkData(slug: string) {
  const parkName = slugToParkName(slug);
  const [park, rides, dining, blogPosts] = await Promise.all([
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
        slug,
        image { asset-> { url }, alt },
        isClosed,
        closureNote
      }
    `, { parkName }),
    sanityClient.fetch(`
      *[_type == "characterDining" && park == $parkName] | order(name asc) {
        _id,
        name,
        park,
        characters,
        mealType,
        priceRange,
        description
      }
    `, { parkName }),
    sanityClient.fetch(`
      *[_type == "blogPost" && (title match $parkName || categories[]->title match $parkName)] | order(publishedAt desc) [0..2] {
        _id,
        title,
        slug,
        excerpt,
        readTime,
        heroImage { asset-> { url }, alt }
      }
    `, { parkName }),
  ]);

  return { park, rides, dining, blogPosts };
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
  const { park, rides, dining, blogPosts } = await getParkData(slug);

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
  const accentColor = parkColors[slug] || '#F37021';

  return (
    <div className="park-detail-container">
      {/* Hero Section */}
      <div className="park-hero" style={{ '--park-accent': accentColor } as React.CSSProperties}>
        <img src={imageSrc} alt={park.image?.alt || park.name} className="park-hero-img" />
        <div className="park-hero-overlay" />
        <div className="park-hero-content">
          <Link href="/parks" className="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            All Parks
          </Link>
          <h1>{park.name}</h1>
          <div className="park-hero-meta">
            <span className="ride-count-badge">
              {rides.length} Rides & Attractions
            </span>
          </div>
          <a
            href={getParkTicketLink(park.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-buy-tickets-btn"
          >
            Buy Tickets — Save Up to 20%
          </a>
        </div>
      </div>

      <div className="park-content">
        {park.description && (
          <section className="park-description">
            <p>{park.description}</p>
          </section>
        )}

        {/* Rides Cards Grid */}
        <section className="park-rides">
          <h2>Rides &amp; Attractions</h2>
          <div className="park-rides-layout">
            <FilterSidebar />
            <div className="park-rides-main">
              <ParkRidesGrid rides={rides} parkName={park.name} />
            </div>
          </div>
        </section>

        {/* Character Dining Section */}
        {dining.length > 0 && (
          <section className="park-dining">
            <h2>Character Dining at {park.name}</h2>
            <CharacterDiningTable diningList={dining} />
          </section>
        )}

        {/* Related Blog Posts */}
        <section className="park-blog">
          <h2>Planning Tips for {park.name}</h2>
          {blogPosts && blogPosts.length > 0 ? (
            <div className="park-blog-grid">
              {blogPosts.map((post: any) => (
                <Link key={post._id} href={`/blog/${post.slug?.current}`} className="park-blog-card">
                  {post.heroImage?.asset?.url && (
                    <div className="park-blog-img">
                      <img src={post.heroImage.asset.url} alt={post.heroImage.alt || post.title} />
                    </div>
                  )}
                  <div className="park-blog-info">
                    <h3>{post.title}</h3>
                    {post.excerpt && <p>{post.excerpt}</p>}
                    {post.readTime && <span className="blog-read-time">{post.readTime} min read</span>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p>Check our blog for the latest on closures, new attractions, and money-saving tips.</p>
          )}
          <Link href="/blog" className="blog-link">
            Browse All Articles →
          </Link>
        </section>

        <div className="park-cta">
          <Link href="/rides" className="cta-secondary">
            Browse All Rides
          </Link>
          <a
            href={getParkTicketLink(park.name)}
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
          height: 380px;
          overflow: hidden;
          background: var(--bg-light);
        }

        .park-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .park-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.15) 0%,
            rgba(0,0,0,0.1) 40%,
            rgba(0,0,0,0.65) 100%
          );
        }

        .park-hero-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          color: rgba(255,255,255,0.85);
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.15s;
        }

        .back-link:hover {
          color: white;
        }

        .park-hero-content h1 {
          font-family: var(--font-heading);
          font-size: clamp(1.75rem, 5vw, 2.75rem);
          font-weight: 800;
          color: white;
          margin: 0;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .park-hero-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ride-count-badge {
          display: inline-block;
          padding: 0.3rem 0.875rem;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
          color: white;
          font-size: 0.8125rem;
          font-weight: 600;
          border-radius: 9999px;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .hero-buy-tickets-btn {
          display: inline-block;
          margin-top: 0.5rem;
          padding: 0.625rem 1.5rem;
          background: linear-gradient(135deg, #F37021 0%, #E85A1A 100%);
          color: white;
          font-weight: 700;
          font-size: 0.9375rem;
          border-radius: 8px;
          text-decoration: none;
          box-shadow: 0 3px 12px rgba(243,112,33,0.4);
          transition: all 0.2s;
          text-align: center;
        }

        .hero-buy-tickets-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(243,112,33,0.5);
          background: linear-gradient(135deg, #E85A1A 0%, #d44f15 100%);
        }

        .park-content {
          padding: 2.5rem 1.5rem;
        }

        .park-description {
          margin-bottom: 3rem;
          max-width: 720px;
        }

        .park-description p {
          font-size: 1.0625rem;
          color: var(--text-medium);
          line-height: 1.75;
        }

        .park-rides,
        .park-dining,
        .park-blog {
          margin-bottom: 3rem;
        }

        .park-rides h2,
        .park-dining h2,
        .park-blog h2 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 1.5rem;
        }

        .park-rides-layout {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
        }

        .park-rides-main {
          flex: 1;
          min-width: 0;
        }

        .rides-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .no-rides {
          text-align: center;
          color: var(--text-light);
          padding: 2rem;
          background: var(--bg-white);
          border-radius: 12px;
        }

        .park-blog p {
          font-size: 1rem;
          color: var(--text-medium);
          margin-bottom: 1rem;
        }

        .park-blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        @media (max-width: 768px) {
          .park-blog-grid {
            grid-template-columns: 1fr;
          }
        }

        .park-blog-card {
          display: flex;
          flex-direction: column;
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
        }

        .park-blog-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.08);
        }

        .park-blog-img {
          height: 120px;
          overflow: hidden;
          background: var(--bg-light);
        }

        .park-blog-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .park-blog-info {
          padding: 0.875rem;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          flex: 1;
        }

        .park-blog-info h3 {
          font-family: var(--font-heading);
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--text-dark);
          margin: 0;
          line-height: 1.3;
        }

        .park-blog-info p {
          font-size: 0.8125rem;
          color: var(--text-medium);
          margin: 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-read-time {
          font-size: 0.75rem;
          color: var(--text-light);
          margin-top: auto;
        }

        .blog-link {
          display: inline-block;
          color: var(--primary);
          font-weight: 500;
          text-decoration: none;
        }

        .blog-link:hover {
          text-decoration: underline;
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
          .park-hero { height: 240px; }
          .park-content { padding: 1.5rem 1rem; }
        }

        @media (max-width: 900px) {
          .park-rides-layout {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
