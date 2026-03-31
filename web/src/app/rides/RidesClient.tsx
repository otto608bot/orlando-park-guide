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
      <RideFilters rides={rides} onFilter={(filtered) => setFilteredRides(filtered as Ride[])} />
      
      <div className="rides-results">
        <p className="results-count">{filteredRides.length} rides found</p>
      </div>
      
      <div className="rides-grid">
        {filteredRides.map((ride) => (
          <RideCard key={ride._id} ride={ride} />
        ))}
      </div>
      
      {filteredRides.length === 0 && (
        <p className="no-results">No rides match your filters. Try adjusting your criteria.</p>
      )}
      
      <style>{`
        .rides-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }
        
        .rides-results {
          margin-bottom: 1rem;
        }
        
        .results-count {
          font-size: 0.875rem;
          color: var(--text-light);
        }
        
        .rides-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        
        .no-results {
          text-align: center;
          color: var(--text-light);
          padding: 3rem 1rem;
        }
        
        @media (max-width: 640px) {
          .rides-page { padding: 1.5rem 1rem 3rem; }
          .rides-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
