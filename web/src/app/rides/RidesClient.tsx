'use client';

import { useState } from 'react';
import type { Ride } from '@/lib/sanity-types';
import FilterSidebar from '@/components/FilterSidebar';
import RidesTable from '@/components/RidesTable';

interface RidesClientProps {
  rides: Ride[];
}

export default function RidesClient({ rides }: RidesClientProps) {
  return (
    <div className="rides-page-layout">
      <FilterSidebar />
      
      <div className="rides-main">
        <RidesTable rides={rides} />
      </div>

      <style>{`
        .rides-page-layout {
          display: flex;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }

        .rides-main {
          flex: 1;
          min-width: 0;
        }

        @media (max-width: 900px) {
          .rides-page-layout {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
