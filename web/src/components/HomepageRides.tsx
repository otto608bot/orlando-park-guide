'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import type { Ride } from '@/lib/sanity-types';
import RidesTable from '@/components/RidesTable';
import { useFilters } from '@/context/FiltersContext';

interface HomepageRidesProps {
  allRides: Ride[];
  totalCount: number;
}

export default function HomepageRides({ allRides, totalCount }: HomepageRidesProps) {
  const { filters } = useFilters();

  const filteredCount = useMemo(() => {
    let result = allRides;

    if (filters.selectedParks.length > 0) {
      result = result.filter(r => filters.selectedParks.includes(r.park));
    }

    if (filters.height > 0) {
      result = result.filter(r =>
        !r.heightRequirement || r.heightRequirement <= filters.height
      );
    }

    if (filters.pregnancySafe) {
      result = result.filter(r => {
        if (!r.accessibility) return true;
        return !r.accessibility.some(a =>
          a?.toLowerCase().includes('pregnancy') ||
          a?.toLowerCase().includes('expectant')
        );
      });
    }

    if (filters.wheelchairAccessible) {
      result = result.filter(r => {
        if (!r.accessibility) return false;
        return r.accessibility.some(a =>
          a?.toLowerCase().includes('wheelchair') ||
          a?.toLowerCase().includes('wav') ||
          a?.toLowerCase().includes('ecv')
        );
      });
    }

    if (filters.calmExperience) {
      result = result.filter(r => {
        if (!r.accessibility) return false;
        const calmIndicators = ['calm', 'gentle', 'slow', 'peaceful', 'no sudden'];
        return r.accessibility.some(a =>
          calmIndicators.some(ci => a?.toLowerCase().includes(ci))
        );
      });
    }

    return result.length;
  }, [allRides, filters]);

  const hasActiveFilters = filters.height > 0 || filters.pregnancySafe ||
    filters.wheelchairAccessible || filters.calmExperience ||
    filters.selectedParks.length > 0;

  return (
    <>
      {/* Ride Count Banner */}
      <div className="ride-count-banner">
        <div className="count-display">
          <span className="count-num">{hasActiveFilters ? filteredCount : totalCount}</span>
          <span className="count-sep"> of </span>
          <span className="count-total">{totalCount}</span>
          <span className="count-label"> RIDES</span>
        </div>
        {hasActiveFilters && (
          <span className="filter-indicator">
            Filtered
          </span>
        )}
      </div>

      {/* Compact Rides Table */}
      <div className="homepage-rides">
        <RidesTable rides={allRides} showParkColumn={true} compact={true} />
      </div>

      <style>{`
        .ride-count-banner {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        .count-display {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .count-num {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-dark);
          line-height: 1;
        }

        .count-sep,
        .count-total {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-light);
        }

        .count-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-light);
          letter-spacing: 0.1em;
          margin-left: 0.25rem;
        }

        .filter-indicator {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--primary);
          background: rgba(243, 112, 33, 0.08);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
        }

        .homepage-rides {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1rem;
        }
      `}</style>
    </>
  );
}
