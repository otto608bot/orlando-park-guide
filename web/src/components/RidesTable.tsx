'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Ride } from '@/lib/sanity-types';
import { useFilters } from '@/context/FiltersContext';
import RideModal from './RideModal';

interface RidesTableProps {
  rides: Ride[];
  showParkColumn?: boolean;
  compact?: boolean;
}

type SortField = 'name' | 'park' | 'thrillLevel' | 'heightRequirement' | 'rideType';
type SortDirection = 'asc' | 'desc';

function getRideImageSrc(ride: Ride): string | null {
  // Try to use the Sanity image if available
  if (ride.image?.asset?.url) {
    return ride.image.asset.url;
  }
  // Use the slug field to derive the local image path
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

function heightLabel(height?: number): string {
  if (!height || height === 0) return 'None';
  return `${height}"`;
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

const PARK_SORT_ORDER = [
  'Magic Kingdom',
  'EPCOT',
  'Hollywood Studios',
  'Animal Kingdom',
  'Universal Studios Florida',
  'Islands of Adventure',
  'Epic Universe',
  'SeaWorld Orlando',
  'LEGOLAND Florida',
];

export default function RidesTable({ rides, showParkColumn = true, compact = false }: RidesTableProps) {
  const { filters } = useFilters();
  const [sortField, setSortField] = useState<SortField>('park');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  const filteredAndSortedRides = useMemo(() => {
    let result = [...rides];

    // Apply park filter
    if (filters.selectedParks.length > 0) {
      result = result.filter(r => filters.selectedParks.includes(r.park));
    }

    // Apply height filter: show rides the user can ride (height req <= user's height)
    if (filters.height > 0) {
      result = result.filter(r => 
        !r.heightRequirement || r.heightRequirement <= filters.height
      );
    }

    // Apply pregnancy safe filter
    if (filters.pregnancySafe) {
      result = result.filter(r => isPregnancySafe(r));
    }

    // Apply wheelchair filter
    if (filters.wheelchairAccessible) {
      result = result.filter(r => isWheelchairAccessible(r));
    }

    // Apply calm experience filter
    if (filters.calmExperience) {
      result = result.filter(r => isCalmExperience(r));
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal: any = '';
      let bVal: any = '';

      switch (sortField) {
        case 'name':
          aVal = a.name || '';
          bVal = b.name || '';
          break;
        case 'park':
          aVal = PARK_SORT_ORDER.indexOf(a.park);
          bVal = PARK_SORT_ORDER.indexOf(b.park);
          // Fall back to alphabetical if park not in order list
          if (aVal === -1) aVal = a.park || '';
          if (bVal === -1) bVal = b.park || '';
          break;
        case 'thrillLevel':
          aVal = a.thrillLevel || 0;
          bVal = b.thrillLevel || 0;
          break;
        case 'heightRequirement':
          aVal = a.heightRequirement || 0;
          bVal = b.heightRequirement || 0;
          break;
        case 'rideType':
          aVal = a.rideType || '';
          bVal = b.rideType || '';
          break;
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [rides, filters, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="sort-icon">↕</span>;
    return <span className="sort-icon sort-active">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="rides-table-wrapper">
      <div className="results-count-bar">
        <p className="count-text">
          Showing <strong>{filteredAndSortedRides.length}</strong> of <strong>{rides.length}</strong> rides
        </p>
      </div>

      <div className="table-scroll">
        <table className={`rides-table ${compact ? 'compact' : ''}`}>
          <thead>
            <tr>
              <th className="th-image">Image</th>
              <th className="th-name sortable" onClick={() => handleSort('name')}>
                Ride Name <SortIcon field="name" />
              </th>
              {showParkColumn && (
                <th className="th-park sortable" onClick={() => handleSort('park')}>
                  Park <SortIcon field="park" />
                </th>
              )}
              <th className="th-thrill sortable" onClick={() => handleSort('thrillLevel')}>
                Thrill <SortIcon field="thrillLevel" />
              </th>
              <th className="th-height sortable" onClick={() => handleSort('heightRequirement')}>
                Height <SortIcon field="heightRequirement" />
              </th>
              <th className="th-type sortable" onClick={() => handleSort('rideType')}>
                Type <SortIcon field="rideType" />
              </th>
              <th className="th-access">Access</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedRides.map(ride => {
              const imageSrc = getRideImageSrc(ride);
              const parkSlug = getParkSlug(ride.park);
              const thrill = thrillClass(ride.thrillLevel);
              const thrillLbl = thrillLabel(ride.thrillLevel);
              const heightLbl = heightLabel(ride.heightRequirement);
              const pregnancyOk = isPregnancySafe(ride);
              const wheelchairOk = isWheelchairAccessible(ride);
              const calm = isCalmExperience(ride);

              return (
                <tr key={ride._id} className={`ride-row ${ride.isClosed ? 'ride-closed' : ''}`} onClick={() => setSelectedRide(ride)} style={{ cursor: 'pointer' }}>
                  <td className="td-image">
                    <div className="ride-thumb">
                      {imageSrc ? (
                        <img src={imageSrc} alt={ride.name} />
                      ) : (
                        <div className={`ride-thumb-placeholder img-placeholder--${parkSlug}`}>
                          <span>🎢</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="td-name">
                    <div className="ride-name-cell">
                      {ride.isClosed && <span className="closed-badge">CLOSED</span>}
                      <span className="ride-name">{ride.name}</span>
                    </div>
                  </td>
                  {showParkColumn && (
                    <td className="td-park">
                      <Link href={`/parks/${parkSlug}`} className={`park-link park-badge--${parkSlug}`}>
                        {ride.park}
                      </Link>
                    </td>
                  )}
                  <td className="td-thrill">
                    <span className={`thrill-badge thrill-badge--${thrill}`}>{thrillLbl}</span>
                  </td>
                  <td className="td-height">
                    <span className={heightLbl === 'None' ? 'height-none' : ''}>{heightLbl}</span>
                  </td>
                  <td className="td-type">
                    <span className="type-pill">{ride.rideType || 'N/A'}</span>
                  </td>
                  <td className="td-access">
                    <div className="access-icons">
                      {pregnancyOk && <span title="Pregnancy Safe" className="access-icon access-pregnancy">🤰</span>}
                      {wheelchairOk && <span title="Wheelchair Accessible" className="access-icon access-wheelchair">♿</span>}
                      {calm && <span title="Calm Experience" className="access-icon access-calm">😌</span>}
                      {!pregnancyOk && <span title="Not Recommended for Pregnancy" className="access-icon access-no">🚫</span>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredAndSortedRides.length === 0 && (
        <div className="no-results-state">
          <p>No rides match your filters. Try adjusting your criteria.</p>
        </div>
      )}

      <RideModal ride={selectedRide} onClose={() => setSelectedRide(null)} />

      <style>{`
        .rides-table-wrapper {
          width: 100%;
        }

        .table-scroll {
          overflow-x: auto;
        }

        .rides-table {
          width: 100%;
          border-collapse: collapse;
          background: var(--bg-white);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }

        .rides-table thead {
          background: var(--bg-light);
        }

        .rides-table th {
          padding: 0.875rem 1rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border);
          white-space: nowrap;
        }

        .rides-table th.sortable {
          cursor: pointer;
          user-select: none;
        }

        .rides-table th.sortable:hover {
          color: var(--primary);
        }

        .sort-icon {
          margin-left: 0.375rem;
          opacity: 0.4;
          font-size: 0.625rem;
        }

        .sort-icon.sort-active {
          opacity: 1;
          color: var(--primary);
        }

        .rides-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border);
          vertical-align: middle;
        }

        .rides-table tbody tr:last-child td {
          border-bottom: none;
        }

        .rides-table tbody tr:nth-child(even) {
          background: #fafbfc;
        }

        .rides-table tbody tr:hover {
          background: var(--bg-light);
        }

        .rides-table.compact th,
        .rides-table.compact td {
          padding: 0.5rem 0.75rem;
        }

        /* Image Column */
        .th-image {
          width: 80px;
        }

        .ride-thumb {
          width: 60px;
          height: 45px;
          border-radius: 6px;
          overflow: hidden;
          background: var(--bg-light);
        }

        .compact .ride-thumb {
          width: 50px;
          height: 38px;
        }

        .ride-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ride-thumb-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
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

        /* Name Column */
        .ride-name-cell {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .ride-name {
          font-family: var(--font-heading);
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .compact .ride-name {
          font-size: 0.8125rem;
        }

        .closed-badge {
          display: inline-block;
          font-size: 0.5625rem;
          font-weight: 700;
          color: #EF4444;
          background: #FEF2F2;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          width: fit-content;
        }

        /* Park Column */
        .park-link {
          font-size: 0.8125rem;
          font-weight: 500;
          text-decoration: none;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          background: var(--bg-light);
        }

        .park-link:hover {
          background: var(--border);
        }

        .park-badge--magic-kingdom { color: #4A9DE8; }
        .park-badge--epcot { color: #8B5CF6; }
        .park-badge--hollywood-studios { color: #EF4444; }
        .park-badge--animal-kingdom { color: #10B981; }
        .park-badge--universal-studios-florida { color: #F59E0B; }
        .park-badge--islands-of-adventure { color: #06B6D4; }
        .park-badge--epic-universe { color: #8B5CF6; }
        .park-badge--seaworld-orlando { color: #3B82F6; }
        .park-badge--legoland-florida { color: #F97316; }

        /* Thrill Column */
        .thrill-badge {
          display: inline-block;
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          padding: 0.25rem 0.5rem;
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

        /* Height Column */
        .td-height {
          font-size: 0.875rem;
          color: var(--text-medium);
          font-weight: 500;
        }

        .height-none {
          color: var(--text-light);
        }

        /* Type Column */
        .type-pill {
          display: inline-block;
          font-size: 0.6875rem;
          font-weight: 500;
          color: var(--text-medium);
          background: var(--bg-light);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        /* Access Column */
        .access-icons {
          display: flex;
          gap: 0.375rem;
        }

        .access-icon {
          font-size: 0.875rem;
          cursor: help;
        }

        /* Closed Row */
        .ride-closed {
          opacity: 0.6;
        }

        /* Results Bar */
        .results-count-bar {
          padding: 0.75rem 0;
          margin-bottom: 0.5rem;
        }

        .count-text {
          font-size: 0.875rem;
          color: var(--text-medium);
        }

        .no-results-state {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-light);
          background: var(--bg-white);
          border-radius: 12px;
        }

        @media (max-width: 768px) {
          .th-park,
          .td-park {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .th-type,
          .td-type {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
