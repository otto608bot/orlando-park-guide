'use client';

import { useState, useEffect } from 'react';
import type { Ride } from '@/lib/sanity-types';

interface RideFiltersProps {
  rides: Ride[];
  onFilter: (filtered: Ride[]) => void;
}

const ALL_PARKS = [
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
  { value: 1, label: 'Family' },
  { value: 2, label: 'Low Thrill' },
  { value: 3, label: 'Medium Thrill' },
  { value: 4, label: 'High Thrill' },
  { value: 5, label: 'Extreme' },
];

export default function RideFilters({ rides, onFilter }: RideFiltersProps) {
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

  const hasFilters = selectedPark || selectedThrill || selectedType || selectedHeight;

  return (
    <div className="ride-filters">
      <button 
        className="mobile-filter-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? 'Hide Filters' : 'Show Filters'}
        {hasFilters && <span className="filter-badge">•</span>}
      </button>

      <div className={`filters-container ${mobileOpen ? 'open' : ''}`}>
        <div className="filter-group">
          <label>Park</label>
          <select 
            value={selectedPark} 
            onChange={(e) => setSelectedPark(e.target.value)}
          >
            <option value="">All Parks</option>
            {ALL_PARKS.map(park => (
              <option key={park} value={park}>{park}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Thrill Level</label>
          <select 
            value={selectedThrill || ''} 
            onChange={(e) => setSelectedThrill(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Any Level</option>
            {THRILL_LEVELS.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Ride Type</label>
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            {RIDE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Height Requirement</label>
          <select 
            value={selectedHeight} 
            onChange={(e) => setSelectedHeight(e.target.value)}
          >
            <option value="">Any Height</option>
            <option value="any">No Height Req.</option>
            <option value="42">42"+ (Most Thrills)</option>
          </select>
        </div>

        {hasFilters && (
          <button className="clear-filters" onClick={clearFilters}>
            Clear All
          </button>
        )}
      </div>

      <style>{`
        .ride-filters {
          margin-bottom: 1.5rem;
        }
        
        .mobile-filter-toggle {
          display: none;
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-dark);
          cursor: pointer;
          margin-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
          .mobile-filter-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }
          
          .filters-container {
            display: none;
          }
          
          .filters-container.open {
            display: block;
          }
        }
        
        .filter-badge {
          color: var(--primary);
          font-size: 1.25rem;
        }
        
        .filters-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          background: var(--bg-white);
          padding: 1rem;
          border: 1px solid var(--border);
          border-radius: 8px;
        }
        
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        
        .filter-group label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-medium);
          text-transform: uppercase;
        }
        
        .filter-group select {
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          font-size: 0.875rem;
          color: var(--text-dark);
          background: var(--bg-light);
          cursor: pointer;
        }
        
        .filter-group select:focus {
          outline: none;
          border-color: var(--primary);
        }
        
        .clear-filters {
          grid-column: 1 / -1;
          padding: 0.5rem;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 6px;
          font-size: 0.8125rem;
          color: var(--text-medium);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .clear-filters:hover {
          background: var(--bg-light);
          color: var(--primary);
        }
      `}</style>
    </div>
  );
}
