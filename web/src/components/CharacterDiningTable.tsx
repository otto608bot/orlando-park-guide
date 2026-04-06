'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { CharacterDining } from '@/lib/sanity-types';

interface CharacterDiningTableProps {
  showFilters?: boolean;
  parkContext?: string;

  diningList: CharacterDining[];
}

type MealType = 'all' | 'breakfast' | 'lunch' | 'dinner';
type LocationType = 'all' | 'inpark' | 'resort';

function getParkSlug(park: string | undefined): string {
  if (!park) return 'other';
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
  return map[park] || 'other';
}

function getParkColor(park: string | undefined): string {
  if (!park) return '#718096';
  const colorMap: Record<string, string> = {
    'magic-kingdom': '#4A9DE8',
    'epcot': '#8B5CF6',
    'hollywood-studios': '#EF4444',
    'animal-kingdom': '#10B981',
    'universal-studios-florida': '#F59E0B',
    'islands-of-adventure': '#06B6D4',
    'epic-universe': '#8B5CF6',
    'seaworld-orlando': '#3B82F6',
    'legoland-florida': '#F97316',
    'resort': '#EC4899',
    'other': '#718096',
  };
  const slug = getParkSlug(park);
  return colorMap[slug] || '#718096';
}

function getLocationLabel(park: string | undefined, itemName: string | undefined): string {
  if (!park) return 'Orlando Area';
  // If it's a known in-park location, show park name
  const inParkMap: Record<string, string> = {
    'Magic Kingdom': 'Magic Kingdom',
    'EPCOT': 'EPCOT',
    'Hollywood Studios': 'Hollywood Studios',
    'Animal Kingdom': 'Animal Kingdom',
    'Universal Studios Florida': 'Universal Studios Florida',
    'Islands of Adventure': 'Islands of Adventure',
    'Epic Universe': 'Epic Universe',
    'SeaWorld Orlando': 'SeaWorld Orlando',
    'LEGOLAND Florida': 'LEGOLAND Florida',
  };
  if (inParkMap[park]) return inParkMap[park];
  // Otherwise show the specific resort name (item.park from Sanity)
  return park;
}

function isInPark(park: string | undefined): boolean {
  if (!park) return false;
  return !park.includes('Resort') && !park.includes('Hotel') && !park.includes('Villa');
}

function isResort(park: string | undefined): boolean {
  if (!park) return false;
  return park.includes('Resort') || park.includes('Hotel') || park.includes('Grand Floridian') || park.includes('Contemporary') || park.includes('Polynesian');
}

function formatCharacters(chars: string[] | undefined): string {
  if (!chars || chars.length === 0) return 'N/A';
  return chars.slice(0, 3).join(', ') + (chars.length > 3 ? ` +${chars.length - 3}` : '');
}

export default function CharacterDiningTable({ diningList, showFilters = true, parkContext }: CharacterDiningTableProps) {
  const [mealFilter, setMealFilter] = useState<MealType>('all');
  const [locationFilter, setLocationFilter] = useState<LocationType>('all');
  const [searchChar, setSearchChar] = useState('');

  const filteredDining = useMemo(() => {
    return diningList.filter(item => {
      // Meal filter
      if (mealFilter !== 'all') {
        if (!item.mealType?.includes(mealFilter)) return false;
      }

      // Location filter
      if (locationFilter === 'inpark') {
        if (!isInPark(item.park)) return false;
      } else if (locationFilter === 'resort') {
        if (!isResort(item.park)) return false;
      }

      // Character search
      if (searchChar) {
        const search = searchChar.toLowerCase();
        if (!item.characters?.some(c => c.toLowerCase().includes(search))) {
          return false;
        }
      }

      return true;
    });
  }, [diningList, mealFilter, locationFilter, searchChar]);

  return (
    <div className="dining-table-wrapper">
      {showFilters && (
      <div className="dining-filters">
        <div className="filter-group">
          <span className="filter-label">Meal</span>
          <div className="filter-pills">
            <button
              className={`pill ${mealFilter === 'all' ? 'active' : ''}`}
              onClick={() => setMealFilter('all')}
            >
              All Meals
            </button>
            <button
              className={`pill ${mealFilter === 'breakfast' ? 'active' : ''}`}
              onClick={() => setMealFilter('breakfast')}
            >
              Breakfast
            </button>
            <button
              className={`pill ${mealFilter === 'lunch' ? 'active' : ''}`}
              onClick={() => setMealFilter('lunch')}
            >
              Lunch
            </button>
            <button
              className={`pill ${mealFilter === 'dinner' ? 'active' : ''}`}
              onClick={() => setMealFilter('dinner')}
            >
              Dinner
            </button>
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Location</span>
          <div className="filter-pills">
            <button
              className={`pill ${locationFilter === 'all' ? 'active' : ''}`}
              onClick={() => setLocationFilter('all')}
            >
              All Locations
            </button>
            <button
              className={`pill ${locationFilter === 'inpark' ? 'active' : ''}`}
              onClick={() => setLocationFilter('inpark')}
            >
              In-Park Only
            </button>
            <button
              className={`pill ${locationFilter === 'resort' ? 'active' : ''}`}
              onClick={() => setLocationFilter('resort')}
            >
              Resort Hotels
            </button>
          </div>
        </div>

        <div className="filter-group search-group">
          <span className="filter-label">Search Character</span>
          <div className="search-wrap">
            <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Mickey, Belle, Ariel..."
              value={searchChar}
              onChange={(e) => setSearchChar(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>
      )}

      <div className="results-count-bar">
        <p className="count-text">
          Showing <strong>{filteredDining.length}</strong> of <strong>{diningList.length}</strong> character dining experiences
        </p>
      </div>

      {/* Table */}
      <div className="table-scroll">
        <table className="dining-table">
          <thead>
            <tr>
              <th className="th-restaurant">Restaurant</th>
              <th className="th-breakfast">
                <span className="meal-icon">🌅</span> Breakfast
              </th>
              <th className="th-lunch">
                <span className="meal-icon">☀️</span> Lunch
              </th>
              <th className="th-dinner">
                <span className="meal-icon">🌙</span> Dinner
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDining.map(item => {
              const parkSlug = getParkSlug(item.park);
              const hasBreakfast = item.mealType?.includes('breakfast');
              const hasLunch = item.mealType?.includes('lunch');
              const hasDinner = item.mealType?.includes('dinner');

              return (
                <tr key={item._id}>
                  <td className="td-restaurant">
                    <div className="restaurant-info">
                      <h3 className="restaurant-name">{item.name}</h3>
                      <span
                        className={`location-badge location-${parkSlug}`}
                        style={{
                          color: getParkColor(item.park),
                          backgroundColor: getParkColor(item.park) + '1A',
                        }}
                      >
                        {getLocationLabel(item.park, item.name)}
                      </span>
                      {item.priceRange && (
                        <span className="price-badge">{item.priceRange}</span>
                      )}
                    </div>
                  </td>
                  <td className={`td-meal td-breakfast ${!hasBreakfast ? 'meal-unavailable' : ''}`}>
                    {hasBreakfast ? (
                      <div className="meal-info">
                        <div className="characters-list">
                          {item.characters?.slice(0, 4).map((char, i) => (
                            <span key={i} className="char-name">{char}</span>
                          ))}
                          {item.characters && item.characters.length > 4 && (
                            <span className="more-chars">+{item.characters.length - 4}</span>
                          )}
                        </div>
                        {item.priceRange && (
                          <span className="meal-price">${item.priceRange.includes('$') ? '45' : ''}+</span>
                        )}
                      </div>
                    ) : (
                      <span className="unavailable">—</span>
                    )}
                  </td>
                  <td className={`td-meal td-lunch ${!hasLunch ? 'meal-unavailable' : ''}`}>
                    {hasLunch ? (
                      <div className="meal-info">
                        <div className="characters-list">
                          {item.characters?.slice(0, 4).map((char, i) => (
                            <span key={i} className="char-name">{char}</span>
                          ))}
                          {item.characters && item.characters.length > 4 && (
                            <span className="more-chars">+{item.characters.length - 4}</span>
                          )}
                        </div>
                        {item.priceRange && (
                          <span className="meal-price">${item.priceRange.includes('$$') ? '55' : ''}+</span>
                        )}
                      </div>
                    ) : (
                      <span className="unavailable">—</span>
                    )}
                  </td>
                  <td className={`td-meal td-dinner ${!hasDinner ? 'meal-unavailable' : ''}`}>
                    {hasDinner ? (
                      <div className="meal-info">
                        <div className="characters-list">
                          {item.characters?.slice(0, 4).map((char, i) => (
                            <span key={i} className="char-name">{char}</span>
                          ))}
                          {item.characters && item.characters.length > 4 && (
                            <span className="more-chars">+{item.characters.length - 4}</span>
                          )}
                        </div>
                        {item.priceRange && (
                          <span className="meal-price">${item.priceRange.includes('$$$') ? '65' : ''}+</span>
                        )}
                      </div>
                    ) : (
                      <span className="unavailable">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredDining.length === 0 && (
        <div className="no-results-state">
          <p>No character dining matches your filters.</p>
        </div>
      )}

      <style>{`
        .dining-table-wrapper {
          width: 100%;
        }

        .dining-filters {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-label {
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .filter-pills {
          display: flex;
          gap: 0.375rem;
          flex-wrap: wrap;
        }

        .pill {
          padding: 0.375rem 0.875rem;
          background: var(--bg-light);
          border: 1px solid var(--border);
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-medium);
          cursor: pointer;
          transition: all 0.15s;
        }

        .pill:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .pill.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .search-group {
          flex: 1;
          min-width: 200px;
        }

        .search-wrap {
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

        .search-input {
          width: 100%;
          padding: 0.5rem 0.75rem 0.5rem 2.25rem;
          border: 1.5px solid var(--border);
          border-radius: 9999px;
          font-size: 0.875rem;
          color: var(--text-dark);
          background: var(--bg-light);
          transition: border-color 0.15s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary);
        }

        /* Table */
        .table-scroll {
          overflow-x: auto;
        }

        .dining-table {
          width: 100%;
          border-collapse: collapse;
          background: var(--bg-white);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }

        .dining-table thead {
          background: var(--bg-light);
        }

        .dining-table th {
          padding: 1rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border);
        }

        .meal-icon {
          margin-right: 0.25rem;
        }

        .dining-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          vertical-align: top;
        }

        .dining-table tbody tr:last-child td {
          border-bottom: none;
        }

        .dining-table tbody tr:hover {
          background: var(--bg-light);
        }

        /* Restaurant Column */
        .th-restaurant {
          min-width: 200px;
        }

        .restaurant-info {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .restaurant-name {
          font-family: var(--font-heading);
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--text-dark);
          margin: 0;
        }

        .location-badge {
          display: inline-block;
          font-size: 0.6875rem;
          font-weight: 600;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          width: fit-content;
        }

        .location-magic-kingdom { color: #4A9DE8; background: #EFF6FF; }
        .location-epcot { color: #8B5CF6; background: #F5F3FF; }
        .location-hollywood-studios { color: #EF4444; background: #FEF2F2; }
        .location-animal-kingdom { color: #10B981; background: #ECFDF5; }
        .location-universal-studios-florida { color: #F59E0B; background: #FFFBEB; }
        .location-islands-of-adventure { color: #06B6D4; background: #ECFEFF; }
        .location-epic-universe { color: #8B5CF6; background: #F5F3FF; }
        .location-seaworld-orlando { color: #3B82F6; background: #EFF6FF; }
        .location-legoland-florida { color: #F97316; background: #FFF7ED; }
        .location-resort { color: #EC4899; background: #FDF2F8; }
        .location-other { color: var(--text-medium); }

        .price-badge {
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--text-light);
        }

        /* Meal Columns */
        .th-breakfast,
        .th-lunch,
        .th-dinner {
          min-width: 180px;
        }

        .td-meal {
          min-width: 180px;
        }

        .meal-unavailable {
          opacity: 0.4;
        }

        .unavailable {
          color: var(--text-light);
          font-size: 1.25rem;
        }

        .meal-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .characters-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .char-name {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-medium);
          background: var(--bg-light);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .more-chars {
          font-size: 0.6875rem;
          color: var(--text-light);
          padding: 0.2rem 0.375rem;
        }

        .meal-price {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--primary);
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

        @media (max-width: 900px) {
          .th-lunch,
          .td-lunch {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .th-breakfast,
          .td-breakfast,
          .th-dinner,
          .td-dinner {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
