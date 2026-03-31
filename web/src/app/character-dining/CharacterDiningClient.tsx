'use client';

import { useState } from 'react';
import type { CharacterDining } from '@/lib/sanity-types';

interface CharacterDiningClientProps {
  diningList: CharacterDining[];
}

const ALL_PARKS = [
  { name: 'Magic Kingdom', slug: 'magic-kingdom' },
  { name: 'EPCOT', slug: 'epcot' },
  { name: 'Hollywood Studios', slug: 'hollywood-studios' },
  { name: 'Animal Kingdom', slug: 'animal-kingdom' },
  { name: 'Magic Kingdom Resort', slug: 'magic-kingdom' },
  { name: 'Epcot Resort', slug: 'epcot' },
  { name: 'Other Disney Resort', slug: 'magic-kingdom' },
];

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
];

function parkSlug(park: string | undefined): string {
  if (!park) return 'magic-kingdom';
  const map: Record<string, string> = {
    'Magic Kingdom': 'magic-kingdom',
    'EPCOT': 'epcot',
    'Hollywood Studios': 'hollywood-studios',
    'Animal Kingdom': 'animal-kingdom',
    'Magic Kingdom Resort': 'magic-kingdom',
    'Epcot Resort': 'epcot',
    'Other Disney Resort': 'magic-kingdom',
  };
  return map[park] || 'magic-kingdom';
}

function DiningPlaceholderSVG({ park }: { park: string | undefined }) {
  const slug = parkSlug(park);
  const displayPark = park || 'Orlando';
  const colors: Record<string, string> = {
    'magic-kingdom': '#4A9DE8',
    'epcot': '#8B5CF6',
    'hollywood-studios': '#EF4444',
    'animal-kingdom': '#10B981',
  };
  const color = colors[slug] || '#F37021';
  return (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="400" height="200" fill={color} />
      <circle cx="200" cy="80" r="30" fill="rgba(255,255,255,0.2)" />
      <text x="200" y="87" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="sans-serif">CHARACTERS</text>
      <text x="200" y="130" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="sans-serif">{displayPark}</text>
      <text x="200" y="155" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="10" fontFamily="sans-serif">Character Dining</text>
    </svg>
  );
}

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

  const activeCount = [selectedPark, selectedMeal, searchChar].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedPark('');
    setSelectedMeal('');
    setSearchChar('');
  };

  return (
    <div className="dining-client">
      <div className="dining-filters">
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
          <div className="filter-section">
            <span className="filter-section-label">Park / Location</span>
            <div className="filter-pills">
              {ALL_PARKS.map(p => (
                <button
                  key={p.name}
                  className={`filter-pill park-${p.slug} ${selectedPark === p.name ? 'active' : ''}`}
                  onClick={() => setSelectedPark(selectedPark === p.name ? '' : p.name)}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <span className="filter-section-label">Meal Type</span>
            <div className="filter-pills">
              {MEAL_TYPES.map(m => (
                <button
                  key={m.value}
                  className={`filter-pill ${selectedMeal === m.value ? 'active' : ''}`}
                  onClick={() => setSelectedMeal(selectedMeal === m.value ? '' : m.value)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <span className="filter-section-label">Search Character</span>
            <div className="filter-search-wrap">
              <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Mickey, Belle..."
                value={searchChar}
                onChange={(e) => setSearchChar(e.target.value)}
                className="filter-search-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="results-count-bar">
        <p className="count-text">
          Showing <strong>{filtered.length}</strong> of <strong>{diningList.length}</strong> experiences
        </p>
      </div>

      <div className="dining-grid">
        {filtered.map((item) => (
          <div key={item._id} className="dining-card card">
            <div className="dining-card-image">
              <DiningPlaceholderSVG park={item.park} />
            </div>

            <div className="dining-card-body">
              <div className="dining-card-top">
                <h3>{item.name}</h3>
                <span className={`park-badge park-badge--${parkSlug(item.park)}`}>{item.park || 'Orlando'}</span>
              </div>

              {item.mealType && (
                <div className="dining-meals">
                  {item.mealType.map(m => (
                    <span key={m} className={`meal-badge meal-badge--${m}`}>{m}</span>
                  ))}
                </div>
              )}

              {item.characters && item.characters.length > 0 && (
                <div className="dining-characters">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>{item.characters.slice(0, 4).join(', ')}</span>
                  {item.characters.length > 4 && (
                    <span className="more-chars">+{item.characters.length - 4} more</span>
                  )}
                </div>
              )}

              {item.priceRange && (
                <div className="dining-price">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  <span>{item.priceRange}</span>
                </div>
              )}

              {item.description && (
                <p className="dining-desc">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="no-results-state">
          <p>No character dining matches your filters.</p>
          <button className="no-results-reset" onClick={clearFilters}>Reset Filters</button>
        </div>
      )}

      <style>{`
        .dining-client {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 0 4rem;
        }

        .dining-filters {
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

        .filter-count-badge {
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

        .filters-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .filters-body:not(.open) { display: none; }
          .filters-header { flex-wrap: wrap; }
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

        .filter-search-wrap {
          position: relative;
          max-width: 280px;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
          pointer-events: none;
        }

        .filter-search-input {
          width: 100%;
          padding: 0.5rem 0.75rem 0.5rem 2.25rem;
          border: 1.5px solid var(--border);
          border-radius: 9999px;
          font-size: 0.875rem;
          color: var(--text-dark);
          background: var(--bg-light);
          transition: border-color 0.15s ease;
        }

        .filter-search-input:focus {
          outline: none;
          border-color: var(--primary);
        }

        .dining-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        @media (max-width: 900px) {
          .dining-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 600px) {
          .dining-client { padding: 0 0 3rem; }
          .dining-grid { grid-template-columns: 1fr; }
        }

        .dining-card {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .dining-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--card-shadow);
        }

        .dining-card-image {
          width: 100%;
          height: 140px;
          overflow: hidden;
          flex-shrink: 0;
          background: var(--bg-light);
        }

        .dining-card-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          flex: 1;
        }

        .dining-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .dining-card-top h3 {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-dark);
          margin: 0;
          line-height: 1.3;
        }

        .dining-meals {
          display: flex;
          gap: 0.375rem;
          flex-wrap: wrap;
        }

        .meal-badge {
          display: inline-block;
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          background: var(--bg-light);
          color: var(--text-medium);
          border: 1px solid var(--border);
          letter-spacing: 0.03em;
        }

        .meal-badge--breakfast { background: #FEF3C7; color: #92400E; border-color: #FCD34D; }
        .meal-badge--lunch { background: #DBEAFE; color: #1E40AF; border-color: #93C5FD; }
        .meal-badge--dinner { background: #EDE9FE; color: #5B21B6; border-color: #C4B5FD; }

        .dining-characters {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          flex-wrap: wrap;
          color: var(--text-medium);
          font-size: 0.8125rem;
        }

        .dining-characters svg {
          flex-shrink: 0;
          color: var(--text-light);
        }

        .more-chars {
          color: var(--text-light);
          font-size: 0.75rem;
        }

        .dining-price {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-dark);
        }

        .dining-price svg {
          flex-shrink: 0;
          color: var(--text-light);
        }

        .dining-desc {
          font-size: 0.8125rem;
          color: var(--text-medium);
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .no-results-state {
          text-align: center;
          padding: 4rem 1rem;
          color: var(--text-light);
        }

        .no-results-state p {
          font-size: 1rem;
          margin-bottom: 1rem;
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
