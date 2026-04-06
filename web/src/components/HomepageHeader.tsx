'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useFilters } from '@/context/FiltersContext';
import type { Ride } from '@/lib/sanity-types';

interface HomepageHeaderProps {
  totalRides: number;
  allRides: Ride[];
}

const FRANCHISES = [
  {
    key: 'disney',
    label: 'Disney',
    parks: ['Magic Kingdom', 'EPCOT', 'Hollywood Studios', 'Animal Kingdom'],
    color: '#4A9DE8',
  },
  {
    key: 'universal',
    label: 'Universal Orlando',
    parks: ['Universal Studios Florida', 'Islands of Adventure', 'Epic Universe'],
    color: '#F59E0B',
  },
  {
    key: 'seaworld',
    label: 'SeaWorld Orlando',
    parks: ['SeaWorld Orlando'],
    color: '#3B82F6',
  },
  {
    key: 'legoland',
    label: 'LEGOLAND Florida',
    parks: ['LEGOLAND Florida'],
    color: '#F97316',
  },
];

export default function HomepageHeader({ totalRides, allRides }: HomepageHeaderProps) {
  const { filters } = useFilters();

  const franchiseData = useMemo(() => {
    return FRANCHISES.map(franchise => {
      // Total rides for this franchise
      const franchiseTotal = allRides.filter(r => franchise.parks.includes(r.park)).length;

      // Filtered rides for this franchise (apply same filters as HomepageRides)
      let visible = allRides.filter(r => franchise.parks.includes(r.park));

      if (filters.selectedParks.length > 0) {
        visible = visible.filter(r => filters.selectedParks.includes(r.park));
      }

      if (filters.height > 0) {
        visible = visible.filter(r => !r.heightRequirement || r.heightRequirement <= filters.height);
      }

      if (filters.pregnancySafe) {
        visible = visible.filter(r => {
          if (!r.accessibility) return true;
          return !r.accessibility.some(a =>
            a?.toLowerCase().includes('pregnancy') ||
            a?.toLowerCase().includes('expectant')
          );
        });
      }

      if (filters.wheelchairAccessible) {
        visible = visible.filter(r => {
          if (!r.accessibility) return false;
          return r.accessibility.some(a =>
            a?.toLowerCase().includes('wheelchair') ||
            a?.toLowerCase().includes('wav') ||
            a?.toLowerCase().includes('ecv')
          );
        });
      }

      if (filters.calmExperience) {
        visible = visible.filter(r => {
          if (!r.accessibility) return false;
          const calmIndicators = ['calm', 'gentle', 'slow', 'peaceful', 'no sudden'];
          return r.accessibility.some(a =>
            calmIndicators.some(ci => a?.toLowerCase().includes(ci))
          );
        });
      }

      return {
        ...franchise,
        total: franchiseTotal,
        visible: visible.length,
      };
    });
  }, [allRides, filters]);

  const hasActiveFilters = filters.height > 0 || filters.pregnancySafe ||
    filters.wheelchairAccessible || filters.calmExperience ||
    filters.selectedParks.length > 0;

  return (
    <>
      <header className="home-header">
        <div className="home-header-inner">
          <div className="home-header-top">
            <div className="home-title-row">
              <h1 className="home-title">Find Rides for Everyone</h1>
              <span className="total-rides-badge">
                {hasActiveFilters ? allRides.length : totalRides} of {totalRides} rides
              </span>
            </div>
            <Link href="/rides" className="home-cta-btn">
              Browse All Rides
            </Link>
          </div>

          {/* Franchise Meters */}
          <div className="franchise-meters">
            {franchiseData.map(franchise => (
              <div key={franchise.key} className="franchise-meter">
                <div className="meter-header">
                  <span className="meter-label">{franchise.label}</span>
                  <span className="meter-count">
                    {hasActiveFilters ? franchise.visible : franchise.total}
                    <span className="meter-total">/{franchise.total}</span>
                  </span>
                </div>
                <div className="meter-bar-bg">
                  <div
                    className="meter-bar-fill"
                    style={{
                      width: `${Math.round(((hasActiveFilters ? franchise.visible : franchise.total) / Math.max(franchise.total, 1)) * 100)}%`,
                      backgroundColor: franchise.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <style>{`
        .home-header {
          margin-bottom: 1rem;
          padding: 0.875rem 1rem;
          background: linear-gradient(135deg, #F37021 0%, #E85A1A 100%);
          border-radius: 10px;
          position: relative;
          overflow: hidden;
        }

        .home-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse at 70% 80%, rgba(0,0,0,0.05) 0%, transparent 60%);
          pointer-events: none;
        }

        .home-header-inner {
          position: relative;
        }

        .home-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .home-title {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 800;
          color: white;
          margin: 0;
          line-height: 1.2;
          text-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }

        .home-title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .total-rides-badge {
          display: inline-block;
          background: rgba(255,255,255,0.2);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          border: 1px solid rgba(255,255,255,0.3);
          white-space: nowrap;
        }

        .home-cta-btn {
          display: inline-block;
          background: white;
          color: #E85A1A;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.8125rem;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          white-space: nowrap;
        }

        .home-cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(0,0,0,0.15);
          background: #fff5f0;
        }

        /* Franchise Meters */
        .franchise-meters {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.625rem;
        }

        .franchise-meter {
          background: rgba(255,255,255,0.15);
          border-radius: 8px;
          padding: 0.5rem 0.625rem;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .meter-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.3rem;
          gap: 0.25rem;
        }

        .meter-label {
          font-size: 0.6875rem;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .meter-count {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 800;
          color: white;
          white-space: nowrap;
        }

        .meter-total {
          font-weight: 400;
          opacity: 0.7;
          font-size: 0.6875rem;
        }

        .meter-bar-bg {
          height: 5px;
          background: rgba(0,0,0,0.2);
          border-radius: 3px;
          overflow: hidden;
        }

        .meter-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
          min-width: 3px;
        }

        @media (max-width: 640px) {
          .home-header {
            padding: 0.625rem 0.875rem;
          }

          .home-title {
            font-size: 0.9375rem;
          }

          .franchise-meters {
            grid-template-columns: repeat(2, 1fr);
          }

          .meter-label {
            font-size: 0.625rem;
          }
        }
      `}</style>
    </>
  );
}
