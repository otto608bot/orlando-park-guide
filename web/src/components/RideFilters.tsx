'use client';

import { useState, useEffect } from 'react';
import type { Ride } from '@/lib/sanity-types';

interface RideFiltersProps {
  rides: Ride[];
  onFilter: (filtered: Ride[]) => void;
  totalCount: number;
}

const ALL_PARKS = [
  { name: 'Magic Kingdom', slug: 'magic-kingdom' },
  { name: 'EPCOT', slug: 'epcot' },
  { name: 'Hollywood Studios', slug: 'hollywood-studios' },
  { name: 'Animal Kingdom', slug: 'animal-kingdom' },
  { name: 'Universal Studios Florida', slug: 'universal-studios-florida' },
  { name: 'Islands of Adventure', slug: 'islands-of-adventure' },
  { name: 'Epic Universe', slug: 'epic-universe' },
  { name: 'SeaWorld Orlando', slug: 'seaworld-orlando' },
  { name: 'LEGOLAND Florida', slug: 'legoland-florida' },
];

const RIDE_TYPES = [
  'Coaster',
  'Dark Ride',
  'Simulator',
  'Boat Ride',
  'Spinner',
  'Show',
  'Shooter',
  'Trackless',
  'Drop Tower',
  'Water Coaster',
  'River Rapids',
  'Train',
  'Carousel',
  'Safari',
];

const THRILL_LEVELS = [
  { value: 1, label: 'Family', class: 'thrill-family' },
  { value: 2, label: 'Low Thrill', class: 'thrill-family' },
  { value: 3, label: 'Medium', class: 'thrill-medium' },
  { value: 4, label: 'High Thrill', class: 'thrill-high' },
  { value: 5, label: 'Extreme', class: 'thrill-high' },
];

export default function RideFilters({ rides, onFilter, totalCount }: RideFiltersProps) {
  const [selectedPark, setSelectedPark] = useState<string>('');
  const [selectedThrill, setSelectedThrill] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedHeight, setSelectedHeight] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let filtered = [...rides];

    if (selectedPark) {
      filtered = filtered.filter(r => r.park === selectedPark);
    }

    if (selectedThrill) {
      filtered = filtered.filter(r => r.thrillLevel === selectedThrill);
    }

    if (selectedType) {
      filtered = filtered.filter(r => r.rideType === selectedType);
    }

    if (selectedHeight) {
      if (selectedHeight === 'any') {
        filtered = filtered.filter(r => !r.heightRequirement || r.heightRequirement === 0);
      } else if (selectedHeight === '42') {
        filtered = filtered.filter(r => r.heightRequirement && r.heightRequirement >= 42);
      }
    }

    onFilter(filtered);
  }, [selectedPark, selectedThrill, selectedType, selectedHeight, rides, onFilter]);

  const clearFilters = () => {
    setSelectedPark('');
    setSelectedThrill(null);
    setSelectedType('');
    setSelectedHeight('');
  };

  const activeCount = [selectedPark, selectedThrill, selectedType, selectedHeight].filter(Boolean).length;

  return (
    <div className="ride-filters">
      <div className="filters-header">
        <button
          className="mobile-filter-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          {mobileOpen ? 'Hide Filters' : 'Show Filters'}
          {activeCount > 0 && (
            <span className="filter-count-badge">{activeCount}</span>
          )}
        </button>

        {activeCount > 0 && (
          <button className="filter-clear-btn" onClick={clearFilters}>
            Clear all
            <span className="filter-count-badge">{activeCount}</span>
          </button>
        )}
      </div>

      <div className={`filters-body ${mobileOpen ? 'open' : ''}`}>
        {/* Park Filters */}
        <div className="filter-section">
          <span className="filter-section-label">Park</span>
          <div className="filter-pills">
            {ALL_PARKS.map(park => (
              <button
                key={park.slug}
                className={`filter-pill park-${park.slug} ${selectedPark === park.name ? 'active' : ''}`}
                onClick={() => setSelectedPark(selectedPark === park.name ? '' : park.name)}
              >
                {park.name}
              </button>
            ))}
          </div>
        </div>

        {/* Thrill Level Filters */}
        <div className="filter-section">
          <span className="filter-section-label">Thrill Level</span>
          <div className="filter-pills">
            {THRILL_LEVELS.map(level => (
              <button
                key={level.value}
                className={`filter-pill ${level.class} ${selectedThrill === level.value ? 'active' : ''}`}
                onClick={() => setSelectedThrill(selectedThrill === level.value ? null : level.value)}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ride Type Filters */}
        <div className="filter-section">
          <span className="filter-section-label">Ride Type</span>
          <div className="filter-pills">
            {RIDE_TYPES.map(type => (
              <button
                key={type}
                className={`filter-pill ${selectedType === type ? 'active' : ''}`}
                onClick={() => setSelectedType(selectedType === type ? '' : type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Height Filters */}
        <div className="filter-section">
          <span className="filter-section-label">Height</span>
          <div className="filter-pills">
            <button
              className={`filter-pill ${selectedHeight === 'any' ? 'active' : ''}`}
              onClick={() => setSelectedHeight(selectedHeight === 'any' ? '' : 'any')}
            >
              No Height Req.
            </button>
            <button
              className={`filter-pill ${selectedHeight === '42' ? 'active' : ''}`}
              onClick={() => setSelectedHeight(selectedHeight === '42' ? '' : '42')}
            >
              42&quot;+ (Most Thrills)
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .ride-filters {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .filters-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1rem;
          gap: 0.75rem;
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
        }

        .mobile-filter-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--bg-light);
          border: 1px solid var(--border);
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-dark);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .mobile-filter-toggle:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .filter-clear-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-medium);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .filter-clear-btn:hover {
          color: #EF4444;
          border-color: #EF4444;
        }

        .filters-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .filters-body .filter-count-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 0.3rem;
          border-radius: 9999px;
          font-size: 0.625rem;
          font-weight: 700;
          background: var(--primary);
          color: white;
        }

        @media (max-width: 768px) {
          .filters-body {
            display: none;
          }
          .filters-body.open {
            display: flex;
          }
          .filters-header {
            flex-wrap: wrap;
          }
        }

        .filter-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-section-label {
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
      `}</style>
    </div>
  );
}
