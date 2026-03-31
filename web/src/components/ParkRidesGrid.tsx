'use client';

import { useMemo, useState } from 'react';
import type { Ride } from '@/lib/sanity-types';
import { useFilters } from '@/context/FiltersContext';
import RideModal from './RideModal';

interface ParkRidesGridProps {
  rides: Ride[];
  parkName: string;
  parkColor?: string;
}

function thrillClass(level?: number): string {
  if (!level) return 'thrill-family';
  if (level >= 4) return 'thrill-high';
  if (level >= 3) return 'thrill-medium';
  return 'thrill-family';
}

function thrillLabel(level?: number): string {
  if (!level) return 'Family';
  if (level >= 4) return 'High Thrill';
  if (level >= 3) return 'Medium';
  if (level >= 2) return 'Low Thrill';
  return 'Family';
}

function isPregnancySafe(ride: Ride): boolean {
  if (!ride.accessibility) return true;
  return !ride.accessibility.some(a =>
    a?.toLowerCase().includes('pregnancy') || a?.toLowerCase().includes('expectant')
  );
}

function isWheelchairAccessible(ride: Ride): boolean {
  if (!ride.accessibility) return true;
  return ride.accessibility.some(a =>
    a?.toLowerCase().includes('wheelchair') || a?.toLowerCase().includes('wav') || a?.toLowerCase().includes('ecv')
  );
}

function isCalmExperience(ride: Ride): boolean {
  if (!ride.accessibility) return false;
  const calmIndicators = ['calm', 'gentle', 'slow', 'peaceful', 'no sudden'];
  return ride.accessibility.some(a =>
    calmIndicators.some(ci => a?.toLowerCase().includes(ci))
  );
}

function getRideImageSrc(ride: Ride): string | null {
  if (ride.image?.asset?.url) return ride.image.asset.url;
  if (ride.slug?.current) return `/images/rides/${ride.slug.current}.jpg`;
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

type SortF = 'name' | 'thrillLevel' | 'heightRequirement' | 'rideType';
type SortD = 'asc' | 'desc';

export default function ParkRidesGrid({ rides, parkName }: ParkRidesGridProps) {
  const { filters } = useFilters();
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [sortField, setSortField] = useState<SortF>('thrillLevel');
  const [sortDir, setSortDir] = useState<SortD>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const { filtered, total } = useMemo(() => {
    let result = [...rides];

    // Apply height filter
    if (filters.height > 0) {
      result = result.filter(r => !r.heightRequirement || r.heightRequirement <= filters.height);
    }
    if (filters.pregnancySafe) {
      result = result.filter(r => isPregnancySafe(r));
    }
    if (filters.wheelchairAccessible) {
      result = result.filter(r => isWheelchairAccessible(r));
    }
    if (filters.calmExperience) {
      result = result.filter(r => isCalmExperience(r));
    }

    // Sort
    result.sort((a, b) => {
      let aVal: any = '';
      let bVal: any = '';
      switch (sortField) {
        case 'name': aVal = a.name || ''; bVal = b.name || ''; break;
        case 'thrillLevel': aVal = a.thrillLevel || 0; bVal = b.thrillLevel || 0; break;
        case 'heightRequirement': aVal = a.heightRequirement || 0; bVal = b.heightRequirement || 0; break;
        case 'rideType': aVal = a.rideType || ''; bVal = b.rideType || ''; break;
      }
      if (typeof aVal === 'string') return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return { filtered: result, total: rides.length };
  }, [rides, filters, sortField, sortDir]);

  const handleSort = (field: SortF) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const hasFilters = filters.height > 0 || filters.pregnancySafe || filters.wheelchairAccessible || filters.calmExperience;

  return (
    <>
      {/* Inline mini filters + count bar */}
      <div className="park-rides-toolbar">
        <p className="park-rides-count">
          <strong>{filtered.length}</strong> of <strong>{total}</strong> rides
          {hasFilters && <span className="filtered-note"> (filtered)</span>}
        </p>
        <div className="toolbar-right">
          <button
            className="mini-filter-toggle"
            onClick={() => setShowFilters(s => !s)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="park-mini-filters">
          <div className="mini-filter-group">
            <label>Minimum Height: <strong>{filters.height === 0 ? 'Any' : `${filters.height}"`}</strong></label>
          </div>
          <div className="mini-filter-toggles">
            {filters.pregnancySafe && <span className="mini-pill">🤰 Pregnancy Safe</span>}
            {filters.wheelchairAccessible && <span className="mini-pill">♿ Wheelchair</span>}
            {filters.calmExperience && <span className="mini-pill">😌 Calm</span>}
            {!hasFilters && <span className="mini-pill empty">No filters set — all rides shown</span>}
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="park-rides-grid">
        {filtered.map(ride => {
          const imageSrc = getRideImageSrc(ride);
          const parkSlug = getParkSlug(ride.park);
          const thrill = thrillClass(ride.thrillLevel);
          const thrillLbl = thrillLabel(ride.thrillLevel);
          const pregnancyOk = isPregnancySafe(ride);
          const wheelchairOk = isWheelchairAccessible(ride);
          const calm = isCalmExperience(ride);

          return (
            <div
              key={ride._id}
              className={`ride-card ${ride.isClosed ? 'ride-closed' : ''}`}
              onClick={() => setSelectedRide(ride)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedRide(ride); }}
              style={{ cursor: 'pointer' }}
            >
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
                {ride.description && <p className="ride-card-desc">{ride.description}</p>}
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
                  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
                }
                .ride-card:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
                  border-color: var(--primary);
                }
                .ride-closed { opacity: 0.7; }
                .ride-card-image { width: 100%; height: 160px; overflow: hidden; background: var(--bg-light); position: relative; }
                .ride-card-image img { width: 100%; height: 100%; object-fit: cover; }
                .ride-image-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; background: #F1F5F9; }
                .closed-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
                .closed-overlay span { background: #EF4444; color: white; font-size: 0.75rem; font-weight: 700; padding: 0.375rem 0.875rem; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
                .ride-card-content { padding: 1rem; }
                .ride-card-badges { display: flex; flex-wrap: wrap; gap: 0.375rem; margin-bottom: 0.5rem; }
                .thrill-badge { display: inline-block; font-size: 0.625rem; font-weight: 700; text-transform: uppercase; padding: 0.2rem 0.5rem; border-radius: 4px; letter-spacing: 0.03em; }
                .thrill-badge--thrill-high { background: #FEE2E2; color: #DC2626; }
                .thrill-badge--thrill-medium { background: #FEF3C7; color: #D97706; }
                .thrill-badge--thrill-family { background: #D1FAE5; color: #059669; }
                .type-pill { display: inline-block; font-size: 0.625rem; font-weight: 500; color: var(--text-medium); background: var(--bg-light); padding: 0.2rem 0.5rem; border-radius: 4px; }
                .ride-card-name { font-family: var(--font-heading); font-size: 1rem; font-weight: 700; color: var(--text-dark); margin-bottom: 0.375rem; line-height: 1.3; }
                .ride-card-desc { font-size: 0.8125rem; color: var(--text-medium); line-height: 1.5; margin-bottom: 0.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .ride-card-meta { margin-bottom: 0.5rem; }
                .height-req { font-size: 0.8125rem; font-weight: 500; color: var(--text-medium); }
                .height-none { color: var(--text-light); }
                .ride-card-access { display: flex; gap: 0.5rem; }
                .access-icon { font-size: 1rem; }
                .access-no { opacity: 0.5; }
              `}</style>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="no-rides-state">
          <p>No rides match your current filters. Try adjusting your height filter on the homepage.</p>
        </div>
      )}

      <RideModal ride={selectedRide} onClose={() => setSelectedRide(null)} />

      <style>{`
        .park-rides-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .park-rides-count {
          font-size: 0.9375rem;
          color: var(--text-medium);
        }
        .park-rides-count strong { color: var(--text-dark); }
        .filtered-note { color: var(--primary); font-style: italic; }
        .toolbar-right { display: flex; gap: 0.5rem; }
        .mini-filter-toggle {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--primary);
          background: rgba(243, 112, 33, 0.08);
          border: 1px solid rgba(243, 112, 33, 0.2);
          padding: 0.375rem 0.875rem;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .mini-filter-toggle:hover { background: rgba(243, 112, 33, 0.15); }
        .park-mini-filters {
          background: var(--bg-light);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.875rem 1rem;
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .mini-filter-group label { font-size: 0.875rem; color: var(--text-medium); }
        .mini-filter-group strong { color: var(--primary); }
        .mini-filter-toggles { display: flex; flex-wrap: wrap; gap: 0.375rem; }
        .mini-pill {
          font-size: 0.75rem;
          font-weight: 500;
          background: var(--bg-white);
          border: 1px solid var(--border);
          padding: 0.2rem 0.625rem;
          border-radius: 9999px;
          color: var(--text-medium);
        }
        .mini-pill.empty { color: var(--text-light); }
        .park-rides-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .no-rides-state {
          text-align: center;
          padding: 2.5rem;
          background: var(--bg-white);
          border-radius: 12px;
          color: var(--text-light);
          font-size: 0.9375rem;
        }
        @media (max-width: 900px) { .park-rides-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .park-rides-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
