interface RideCardProps {
  ride: {
    _id: string;
    name: string;
    park: string;
    description?: string;
    heightRequirement?: number;
    thrillLevel?: number;
    rideType?: string;
    accessibility?: string[];
    image?: {
      asset: { url?: string };
      alt?: string;
    };
    isClosed?: boolean;
    closureNote?: string;
  };
}

/* Map park names to CSS class suffixes */
function parkSlug(park: string): string {
  const map: Record<string, string> = {
    'Magic Kingdom': 'magic-kingdom',
    'EPCOT': 'epcot',
    'Hollywood Studios': 'hollywood-studios',
    'Animal Kingdom': 'animal-kingdom',
    'Universal Studios Florida': 'universal-studios-florida',
    'Islands of Adventure': 'islands-of-adventure',
    'Epic Universe': 'epic-universe',
    'SeaWorld Orlando': 'seaworld-orlando',
    'LEGOLAND Florida': 'legoland-florida',
  };
  return map[park] || '';
}

function thrillClass(level?: number): string {
  if (!level) return '';
  if (level >= 4) return 'thrill-high';
  if (level >= 3) return 'thrill-medium';
  return 'thrill-family';
}

function thrillLabel(level?: number): string {
  if (!level) return '';
  if (level >= 4) return 'High Thrill';
  if (level >= 3) return 'Medium';
  if (level >= 2) return 'Low Thrill';
  return 'Family';
}

/* SVG icon for a park when no image is available */
function ParkPlaceholderSVG({ park }: { park: string }) {
  const slug = parkSlug(park);
  const colors: Record<string, string> = {
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
  const color = colors[slug] || '#F37021';
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="400" height="240" fill={color} />
      <text x="200" y="110" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="sans-serif">PLAN YOUR PARK</text>
      <text x="200" y="135" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="11" fontWeight="500" fontFamily="sans-serif">{park}</text>
      <circle cx="200" cy="175" r="20" fill="rgba(255,255,255,0.2)" />
      <text x="200" y="180" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="sans-serif">RIDE</text>
    </svg>
  );
}

export default function RideCard({ ride }: RideCardProps) {
  const ps = parkSlug(ride.park);
  const thrill = thrillClass(ride.thrillLevel);
  const thrillLbl = thrillLabel(ride.thrillLevel);
  const hasImage = ride.image?.asset?.url;

  return (
    <div className={`ride-card card ${ride.isClosed ? 'ride-card--closed' : ''}`}>
      <div className="ride-card-image">
        {hasImage ? (
          <img src={ride.image!.asset.url!} alt={ride.image!.alt || ride.name} />
        ) : (
          <div className={`ride-card-placeholder img-placeholder--${ps}`}>
            <ParkPlaceholderSVG park={ride.park} />
          </div>
        )}
        {ride.isClosed && (
          <div className="ride-card-closed-overlay">
            <span>Currently Closed</span>
          </div>
        )}
      </div>

      <div className="ride-card-body">
        <div className="ride-card-top">
          <h3 className="ride-name">{ride.name}</h3>
          <span className={`park-badge park-badge--${ps}`}>{ride.park}</span>
        </div>

        <div className="ride-card-meta">
          {ride.rideType && (
            <span className="ride-type-pill">{ride.rideType}</span>
          )}
          {thrill && (
            <span className={`thrill-badge thrill-badge--${thrill}`}>{thrillLbl}</span>
          )}
        </div>

        {ride.heightRequirement !== undefined && ride.heightRequirement > 0 && (
          <div className="ride-height">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M2 12h20"/>
            </svg>
            <span>{ride.heightRequirement}&quot;+ height required</span>
          </div>
        )}

        {ride.description && (
          <p className="ride-desc">{ride.description}</p>
        )}

        {ride.isClosed && ride.closureNote && (
          <p className="closure-note">{ride.closureNote}</p>
        )}
      </div>

      <style>{`
        .ride-card {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .ride-card--closed {
          opacity: 0.8;
        }

        .ride-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--card-shadow);
          border-color: var(--border);
        }

        .ride-card-image {
          width: 100%;
          height: 160px;
          overflow: hidden;
          background: var(--bg-light);
          position: relative;
          flex-shrink: 0;
        }

        .ride-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ride-card-placeholder {
          width: 100%;
          height: 100%;
        }

        .ride-card-closed-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ride-card-closed-overlay span {
          background: #EF4444;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.375rem 0.875rem;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ride-card-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          flex: 1;
        }

        .ride-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .ride-name {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-dark);
          margin: 0;
          line-height: 1.3;
        }

        .ride-card-meta {
          display: flex;
          gap: 0.375rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .ride-height {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          color: var(--text-light);
          font-size: 0.8125rem;
        }

        .ride-height svg {
          flex-shrink: 0;
          color: var(--text-light);
        }

        .ride-desc {
          font-size: 0.8125rem;
          color: var(--text-medium);
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .closure-note {
          font-size: 0.75rem;
          color: #EF4444;
          background: #FEF2F2;
          padding: 0.375rem 0.625rem;
          border-radius: 6px;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
