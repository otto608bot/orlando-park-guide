'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Ride } from '@/lib/sanity-types';
import { useFilters } from '@/context/FiltersContext';
import { getParkTicketLink } from '@/config/affiliate-links';

interface ParkInfo {
  name: string;
  slug: string;
  rideCount: number;
  sampleRides: string[];
}

interface HomepageRidesProps {
  allRides: Ride[];
  totalCount: number;
}

const PARK_MAP: Record<string, { slug: string; image: string }> = {
  'Magic Kingdom': { slug: 'magic-kingdom', image: 'Magic-Kingdom.webp' },
  'EPCOT': { slug: 'epcot', image: 'epcot.jpeg' },
  'Hollywood Studios': { slug: 'hollywood-studios', image: 'Hollywood-Studios.jpeg' },
  'Animal Kingdom': { slug: 'animal-kingdom', image: 'animal-kingdom.jpeg' },
  'Universal Studios Florida': { slug: 'universal-studios-florida', image: 'Universal-Studios.jpeg' },
  'Islands of Adventure': { slug: 'islands-of-adventure', image: 'islands-of-adventure.webp' },
  'Epic Universe': { slug: 'epic-universe', image: 'epic-universe.jpeg' },
  'SeaWorld Orlando': { slug: 'seaworld-orlando', image: 'sea-world.jpeg' },
  'LEGOLAND Florida': { slug: 'legoland-florida', image: 'legoland.jpeg' },
};

const PARK_ORG: Record<string, string> = {
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

export default function HomepageRides({ allRides, totalCount }: HomepageRidesProps) {
  const { filters } = useFilters();
  const searchParams = useSearchParams();

  // Compute park cards based on filters
  const parkCards = useMemo((): ParkInfo[] => {
    // Get parks to show based on filter
    let parksToShow = Object.keys(PARK_MAP);
    if (filters.selectedParks.length > 0) {
      parksToShow = filters.selectedParks;
    }

    return parksToShow.map(parkName => {
      const parkInfo = PARK_MAP[parkName];
      if (!parkInfo) return null;

      // Filter rides for this park
      let parkRides = allRides.filter(r => r.park === parkName);

      if (filters.height > 0) {
        parkRides = parkRides.filter(r =>
          !r.heightRequirement || r.heightRequirement <= filters.height
        );
      }
      if (filters.pregnancySafe) {
        parkRides = parkRides.filter(r => {
          if (!r.accessibility) return true;
          return !r.accessibility.some(a =>
            a?.toLowerCase().includes('pregnancy') ||
            a?.toLowerCase().includes('expectant')
          );
        });
      }
      if (filters.wheelchairAccessible) {
        parkRides = parkRides.filter(r => {
          if (!r.accessibility) return false;
          return r.accessibility.some(a =>
            a?.toLowerCase().includes('wheelchair') ||
            a?.toLowerCase().includes('wav') ||
            a?.toLowerCase().includes('ecv')
          );
        });
      }
      if (filters.calmExperience) {
        parkRides = parkRides.filter(r => {
          if (!r.accessibility) return false;
          const calmIndicators = ['calm', 'gentle', 'slow', 'peaceful', 'no sudden'];
          return r.accessibility.some(a =>
            calmIndicators.some(ci => a?.toLowerCase().includes(ci))
          );
        });
      }

      return {
        name: parkName,
        slug: parkInfo.slug,
        rideCount: parkRides.length,
        sampleRides: parkRides.slice(0, 3).map(r => r.name),
      };
    }).filter(Boolean) as ParkInfo[];
  }, [allRides, filters]);

  const hasActiveFilters = filters.height > 0 || filters.pregnancySafe ||
    filters.wheelchairAccessible || filters.calmExperience ||
    filters.selectedParks.length > 0;

  // Build href with preserved search params for park links
  const buildParkHref = (parkSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    return `/parks/${parkSlug}${params.toString() ? `?${params.toString()}` : ''}`;
  };

  return (
    <>
      {/* Park Cards Grid */}
      <div className="park-cards-grid">
        {parkCards.map(park => (
          <div key={park.slug} className="park-card">
            <Link href={buildParkHref(park.slug)} className="park-card-link">
              <div className="park-card-image">
                <img src={`/${PARK_MAP[park.name]?.image || 'Disney-World.webp'}`} alt={park.name} />
                <div className="park-card-overlay" />
              </div>
              <div className="park-card-content">
                <div className="park-card-header">
                  <h3>{park.name}</h3>
                  <span className="park-org">{PARK_ORG[park.slug] || ''}</span>
                </div>
                <div className="ride-count-badge">
                  <span className="count">{hasActiveFilters ? park.rideCount : allRides.filter(r => r.park === park.name).length}</span>
                  <span className="label">Rides</span>
                </div>
                {park.sampleRides.length > 0 && (
                  <div className="sample-rides">
                    {park.sampleRides.map((name, i) => (
                      <span key={i} className="sample-ride">{name}</span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
            <a
              href={getParkTicketLink(park.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="park-card-tickets-btn"
            >
              Buy Tickets
            </a>
          </div>
        ))}
      </div>

      <style>{`
        .park-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .park-card {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease;
        }

        .park-card:hover {
          box-shadow: 0 12px 35px rgba(0,0,0,0.12);
          border-color: var(--primary);
        }

        .park-card-link {
          display: block;
          text-decoration: none;
          color: inherit;
          flex: 1;
        }

        .park-card-image {
          position: relative;
          height: 120px;
          overflow: hidden;
          background: var(--bg-light);
        }

        .park-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .park-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35) 100%);
        }

        .park-card-content {
          padding: 0.875rem;
        }

        .park-card-header {
          margin-bottom: 0.5rem;
        }

        .park-card-header h3 {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-dark);
          margin: 0 0 0.2rem;
        }

        .park-org {
          font-size: 0.6875rem;
          color: var(--text-light);
        }

        .ride-count-badge {
          display: inline-flex;
          align-items: baseline;
          gap: 0.25rem;
          background: var(--bg-light);
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          margin-bottom: 0.5rem;
        }

        .ride-count-badge .count {
          font-family: var(--font-heading);
          font-size: 1.125rem;
          font-weight: 800;
          color: var(--primary);
        }

        .ride-count-badge .label {
          font-size: 0.625rem;
          font-weight: 600;
          color: var(--text-light);
          text-transform: uppercase;
        }

        .sample-rides {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .sample-ride {
          font-size: 0.625rem;
          color: var(--text-medium);
          background: var(--bg-light);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
        }

        .park-card-tickets-btn {
          display: block;
          width: 100%;
          padding: 0.625rem;
          background: linear-gradient(135deg, var(--primary) 0%, #e85a1a 100%);
          color: white;
          font-weight: 700;
          font-size: 0.875rem;
          text-align: center;
          text-decoration: none;
          border-top: 1px solid var(--border);
          transition: opacity 0.2s;
        }

        .park-card-tickets-btn:hover {
          opacity: 0.9;
        }

        @media (max-width: 600px) {
          .park-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
