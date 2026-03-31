'use client';

import { useState } from 'react';
import type { Ride } from '@/lib/sanity-types';
import RideCard from '@/components/RideCard';
import RideFilters from '@/components/RideFilters';

interface RidesClientProps {
  rides: Ride[];
}

export default function RidesClient({ rides }: RidesClientProps) {
  const [filteredRides, setFilteredRides] = useState<Ride[]>(rides);

  return (
    <div className="rides-page">
      <RideFilters
        rides={rides}
        onFilter={(filtered) => setFilteredRides(filtered as Ride[])}
        totalCount={rides.length}
      />

      <div className="results-count-bar">
        <p className="count-text">
          Showing <strong>{filteredRides.length}</strong> of <strong>{rides.length}</strong> rides
        </p>
      </div>

      <div className="rides-grid">
        {filteredRides.map((ride) => (
          <RideCard key={ride._id} ride={ride} />
        ))}
      </div>

      {filteredRides.length === 0 && (
        <div className="no-results-state">
          <p>No rides match your filters. Try adjusting your criteria.</p>
          <button
            className="no-results-reset"
            onClick={() => window.location.reload()}
          >
            Reset Filters
          </button>
        </div>
      )}

      <style>{`
        .rides-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }

        .rides-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        @media (max-width: 900px) {
          .rides-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 600px) {
          .rides-page { padding: 1.5rem 1rem 3rem; }
          .rides-grid { grid-template-columns: 1fr; }
        }

        .no-results-reset {
          padding: 0.625rem 1.25rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .no-results-reset:hover {
          background: #e85a1a;
        }
      `}</style>
    </div>
  );
}
