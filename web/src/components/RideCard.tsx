import Link from 'next/link';
import type { Ride } from '@/lib/sanity-types';

interface RideCardProps {
  ride: Ride;
  showPark?: boolean;
}

function getRideImageSrc(ride: Ride): string | null {
  if (ride.image?.asset?.url) {
    return ride.image.asset.url;
  }
  if (ride.slug?.current) {
    return `/images/rides/${ride.slug.current}.jpg`;
  }
  return null;
}

function getParkSlug(park: string): string {
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

function thrillLabel(level?: number): string {
  if (!level) return 'Family';
  if (level >= 4) return 'High Thrill';
  if (level >= 3) return 'Medium';
  if (level >= 2) return 'Low Thrill';
  return 'Family';
}

function thrillClass(level?: number): string {
  if (!level) return 'thrill-family';
  if (level >= 4) return 'thrill-high';
  if (level >= 3) return 'thrill-medium';
  return 'thrill-family';
}

function isPregnancySafe(ride: Ride): boolean {
  if (!ride.accessibility) return true;
  return !ride.accessibility.some(a =>
    a?.toLowerCase().includes('pregnancy') ||
    a?.toLowerCase().includes('expectant')
  );
}

function isWheelchairAccessible(ride: Ride): boolean {
  if (!ride.accessibility) return true;
  return ride.accessibility.some(a =>
    a?.toLowerCase().includes('wheelchair') ||
    a?.toLowerCase().includes('wav') ||
    a?.toLowerCase().includes('ecv')
  );
}

function isCalmExperience(ride: Ride): boolean {
  if (!ride.accessibility) return false;
  const calmIndicators = ['calm', 'gentle', 'slow', 'peaceful', 'no sudden'];
  return ride.accessibility.some(a =>
    calmIndicators.some(ci => a?.toLowerCase().includes(ci))
  );
}

export default function RideCard({ ride, showPark = false }: RideCardProps) {
  const imageSrc = getRideImageSrc(ride);
  const parkSlug = getParkSlug(ride.park);
  const thrill = thrillClass(ride.thrillLevel);
  const thrillLbl = thrillLabel(ride.thrillLevel);
  const pregnancyOk = isPregnancySafe(ride);
  const wheelchairOk = isWheelchairAccessible(ride);
  const calm = isCalmExperience(ride);

  return (
    <div className={`ride-card ${ride.isClosed ? 'ride-closed' : ''}`}>
      <div className="ride-card-image">
        {imageSrc ? (
          <img src={imageSrc} alt={ride.name} />
        ) : (
          <div className={`ride-image-placeholder img-placeholder--${parkSlug}`}>
            <span>🎢</span>
          </div>
        )}
        {ride.isClosed && (
          <div className="closed-overlay">
            <span>CLOSED</span>
          </div>
        )}
      </div>

      <div className="ride-card-content">
        <div className="ride-card-badges">
          <span className={`thrill-badge thrill-badge--${thrill}`}>{thrillLbl}</span>
          {ride.rideType && <span className="type-pill">{ride.rideType}</span>}
        </div>

        <h3 className="ride-card-name">{ride.name}</h3>

        {ride.description && (
          <p className="ride-card-desc">{ride.description}</p>
        )}

        <div className="ride-card-meta">
          {ride.heightRequirement && ride.heightRequirement > 0 ? (
            <span className="height-req">Min: {ride.heightRequirement}&quot;</span>
          ) : (
            <span className="height-req height-none">No height requirement</span>
          )}
        </div>

        <div className="ride-card-access">
          {pregnancyOk && <span title="Pregnancy Safe" className="access-icon">🤰</span>}
          {wheelchairOk && <span title="Wheelchair Accessible" className="access-icon">♿</span>}
          {calm && <span title="Calm Experience" className="access-icon">😌</span>}
          {!pregnancyOk && <span title="Not Recommended for Pregnancy" className="access-icon access-no">🚫</span>}
        </div>
      </div>

      <style>{`
        .ride-card {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .ride-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          border-color: var(--primary);
        }

        .ride-closed {
          opacity: 0.7;
        }

        .ride-card-image {
          width: 100%;
          height: 160px;
          overflow: hidden;
          background: var(--bg-light);
          position: relative;
        }

        .ride-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ride-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          background: #F1F5F9;
        }

        .img-placeholder--magic-kingdom,
        .img-placeholder--epcot,
        .img-placeholder--hollywood-studios,
        .img-placeholder--animal-kingdom,
        .img-placeholder--universal-studios-florida,
        .img-placeholder--islands-of-adventure,
        .img-placeholder--epic-universe,
        .img-placeholder--seaworld-orlando,
        .img-placeholder--legoland-florida {
          background: #F1F5F9;
        }

        .closed-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .closed-overlay span {
          background: #EF4444;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.375rem 0.875rem;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ride-card-content {
          padding: 1rem;
        }

        .ride-card-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
          margin-bottom: 0.5rem;
        }

        .thrill-badge {
          display: inline-block;
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          letter-spacing: 0.03em;
        }

        .thrill-badge--thrill-high {
          background: #FEE2E2;
          color: #DC2626;
        }

        .thrill-badge--thrill-medium {
          background: #FEF3C7;
          color: #D97706;
        }

        .thrill-badge--thrill-family {
          background: #D1FAE5;
          color: #059669;
        }

        .type-pill {
          display: inline-block;
          font-size: 0.625rem;
          font-weight: 500;
          color: var(--text-medium);
          background: var(--bg-light);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .ride-card-name {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.375rem;
          line-height: 1.3;
        }

        .ride-card-desc {
          font-size: 0.8125rem;
          color: var(--text-medium);
          line-height: 1.5;
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ride-card-meta {
          margin-bottom: 0.5rem;
        }

        .height-req {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-medium);
        }

        .height-none {
          color: var(--text-light);
        }

        .ride-card-access {
          display: flex;
          gap: 0.5rem;
        }

        .access-icon {
          font-size: 1rem;
        }

        .access-no {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
