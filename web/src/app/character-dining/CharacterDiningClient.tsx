'use client';

import { useState } from 'react';
import type { CharacterDining } from '@/lib/sanity-types';

interface CharacterDiningClientProps {
  diningList: CharacterDining[];
}

const ALL_PARKS = [
  'Magic Kingdom',
  'EPCOT',
  'Hollywood Studios',
  'Animal Kingdom',
  'Magic Kingdom Resort',
  'Epcot Resort',
  'Other Disney Resort',
];

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'];

export default function CharacterDiningClient({ diningList }: CharacterDiningClientProps) {
  const [selectedPark, setSelectedPark] = useState<string>('');
  const [selectedMeal, setSelectedMeal] = useState<string>('');
  const [searchChar, setSearchChar] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = diningList.filter(item => {
    if (selectedPark && item.park !== selectedPark) return false;
    if (selectedMeal && !item.mealType?.includes(selectedMeal)) return false;
    if (searchChar) {
      const char = searchChar.toLowerCase();
      if (!item.characters?.some((c: string) => c.toLowerCase().includes(char))) return false;
    }
    return true;
  });

  return (
    <div className="dining-client">
      <div className="dining-filters">
        <button 
          className="mobile-filter-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div className={`filters-container ${mobileOpen ? 'open' : ''}`}>
          <div className="filter-group">
            <label>Park / Location</label>
            <select value={selectedPark} onChange={(e) => setSelectedPark(e.target.value)}>
              <option value="">All Locations</option>
              {ALL_PARKS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Meal Type</label>
            <select value={selectedMeal} onChange={(e) => setSelectedMeal(e.target.value)}>
              <option value="">All Meals</option>
              {MEAL_TYPES.map(m => (
                <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Search Character</label>
            <input 
              type="text" 
              placeholder="Mickey, Belle..."
              value={searchChar}
              onChange={(e) => setSearchChar(e.target.value)}
            />
          </div>

          {(selectedPark || selectedMeal || searchChar) && (
            <button 
              className="clear-filters"
              onClick={() => { setSelectedPark(''); setSelectedMeal(''); setSearchChar(''); }}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <p className="results-count">{filtered.length} locations found</p>

      <div className="dining-grid">
        {filtered.map((item) => (
          <div key={item._id} className="dining-card">
            <h3>{item.name}</h3>
            <span className="dining-park">{item.park}</span>
            {item.mealType && (
              <div className="dining-meals">
                {item.mealType.map(m => (
                  <span key={m} className="meal-badge">{m}</span>
                ))}
              </div>
            )}
            {item.characters && item.characters.length > 0 && (
              <div className="dining-characters">
                <strong>Characters:</strong> {item.characters.slice(0, 5).join(', ')}
                {item.characters.length > 5 && ` +${item.characters.length - 5} more`}
              </div>
            )}
            {item.priceRange && (
              <div className="dining-price">{item.priceRange}</div>
            )}
            {item.description && (
              <p className="dining-desc">{item.description}</p>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="no-results">No character dining matches your filters.</p>
      )}

      <style>{`
        .dining-client { max-width: 1200px; margin: 0 auto; padding: 0 0 4rem; }
        
        .dining-filters { margin-bottom: 1.5rem; }
        
        .mobile-filter-toggle {
          display: none;
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
          .mobile-filter-toggle { display: flex; align-items: center; justify-content: center; }
          .filters-container:not(.open) { display: none; }
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
        
        .filter-group { display: flex; flex-direction: column; gap: 0.375rem; }
        .filter-group label { font-size: 0.75rem; font-weight: 600; color: var(--text-medium); text-transform: uppercase; }
        .filter-group select, .filter-group input {
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          font-size: 0.875rem;
          background: var(--bg-light);
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
        }
        
        .results-count { font-size: 0.875rem; color: var(--text-light); margin-bottom: 1rem; }
        
        .dining-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }
        
        .dining-card {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1rem;
        }
        
        .dining-card h3 {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }
        
        .dining-park { font-size: 0.8125rem; color: var(--primary); font-weight: 500; }
        
        .dining-meals { display: flex; gap: 0.5rem; margin: 0.5rem 0; flex-wrap: wrap; }
        .meal-badge {
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          background: var(--bg-light);
          color: var(--text-medium);
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
        }
        
        .dining-characters { font-size: 0.8125rem; color: var(--text-medium); margin: 0.5rem 0; }
        .dining-price { font-size: 0.875rem; font-weight: 600; color: var(--text-dark); margin: 0.5rem 0; }
        .dining-desc { font-size: 0.8125rem; color: var(--text-light); margin-top: 0.5rem; }
        
        .no-results { text-align: center; color: var(--text-light); padding: 3rem 1rem; }
        
        @media (max-width: 640px) {
          .dining-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
