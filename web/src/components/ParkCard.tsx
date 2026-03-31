import Link from 'next/link';

interface ParkCardProps {
  park: {
    _id: string;
    name: string;
    slug: { current: string };
    description?: string;
    image?: {
      asset: { url: string };
      alt?: string;
    };
  };
}

export default function ParkCard({ park }: ParkCardProps) {
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

  const imageSrc = park.image?.asset?.url || `/${parkImages[park.slug.current] || 'Disney-World.webp'}`;
  const altText = park.image?.alt || park.name;

  return (
    <Link href={`/parks/${park.slug.current}`} className="park-card">
      <div className="park-card-image">
        <img src={imageSrc} alt={altText} />
      </div>
      <div className="park-card-content">
        <h3>{park.name}</h3>
        {park.description && <p>{park.description.substring(0, 100)}...</p>}
      </div>
      
      <style>{`
        .park-card {
          display: block;
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        
        .park-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-color: var(--primary);
        }
        
        .park-card-image {
          width: 100%;
          height: 160px;
          overflow: hidden;
          background: var(--bg-light);
        }
        
        .park-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .park-card-content {
          padding: 1rem;
        }
        
        .park-card-content h3 {
          font-family: var(--font-heading);
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }
        
        .park-card-content p {
          font-size: 0.875rem;
          color: var(--text-medium);
          line-height: 1.5;
          margin: 0;
        }
      `}</style>
    </Link>
  );
}
