'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFilters } from '@/context/FiltersContext';

const PARKS = [
  { name: 'Magic Kingdom', slug: 'magic-kingdom' },
  { name: 'EPCOT', slug: 'epcot' },
  { name: 'Hollywood Studios', slug: 'hollywood-studios' },
  { name: 'Animal Kingdom', slug: 'animal-kingdom' },
  { name: 'Universal Studios', slug: 'universal-studios-florida' },
  { name: 'Islands of Adventure', slug: 'islands-of-adventure' },
  { name: 'Epic Universe', slug: 'epic-universe' },
  { name: 'SeaWorld Orlando', slug: 'seaworld-orlando' },
  { name: 'LEGOLAND Florida', slug: 'legoland-florida' },
];

export default function FilterSidebar() {
  const { filters, setHeight, setPregnancySafe, setWheelchairAccessible, setCalmExperience, setSelectedParks, clearFilters } = useFilters();
  const [localHeight, setLocalHeight] = useState(filters.height);

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setLocalHeight(val);
    setHeight(val);
  };

  const handleParkToggle = (parkName: string) => {
    const newParks = filters.selectedParks.includes(parkName)
      ? filters.selectedParks.filter(p => p !== parkName)
      : [...filters.selectedParks, parkName];
    setSelectedParks(newParks);
  };

  const hasActiveFilters = filters.height > 0 || filters.pregnancySafe || filters.wheelchairAccessible || filters.calmExperience || filters.selectedParks.length > 0;

  return (
    <aside className="filter-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Filter Rides</h3>

        {/* Park Filter */}
        <div className="filter-group">
          <label className="filter-label">Parks</label>
          <div className="park-filter-list">
            {PARKS.map(park => (
              <label key={park.slug} className="park-checkbox">
                <input
                  type="checkbox"
                  checked={filters.selectedParks.includes(park.name)}
                  onChange={() => handleParkToggle(park.name)}
                />
                <span className="park-checkmark"></span>
                <span className="park-name">{park.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Height Slider */}
        <div className="filter-group">
          <label className="filter-label">
            Min Height: <strong>{localHeight === 0 ? 'Any' : `${localHeight}"`}</strong>
          </label>
          <input
            type="range"
            min="0"
            max="60"
            step="2"
            value={localHeight}
            onChange={handleHeightChange}
            className="height-slider"
          />
          <div className="slider-labels">
            <span>Any</span>
            <span>60&quot;</span>
          </div>
        </div>

        {/* Accessibility Toggles */}
        <div className="filter-group">
          <label className="filter-label">Accessibility</label>
          <div className="toggle-list">
            <label className={`toggle-item ${filters.pregnancySafe ? 'active' : ''}`}>
              <input
                type="checkbox"
                checked={filters.pregnancySafe}
                onChange={(e) => setPregnancySafe(e.target.checked)}
              />
              <span className="toggle-switch"></span>
              <span className="toggle-text">🤰 Pregnancy Safe</span>
            </label>
            <label className={`toggle-item ${filters.wheelchairAccessible ? 'active' : ''}`}>
              <input
                type="checkbox"
                checked={filters.wheelchairAccessible}
                onChange={(e) => setWheelchairAccessible(e.target.checked)}
              />
              <span className="toggle-switch"></span>
              <span className="toggle-text">♿ Wheelchair Accessible</span>
            </label>
            <label className={`toggle-item ${filters.calmExperience ? 'active' : ''}`}>
              <input
                type="checkbox"
                checked={filters.calmExperience}
                onChange={(e) => setCalmExperience(e.target.checked)}
              />
              <span className="toggle-switch"></span>
              <span className="toggle-text">😌 Calm Experience</span>
            </label>
          </div>
        </div>

        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear All Filters
          </button>
        )}
      </div>

      {/* Ticket Affiliate Links */}
      <div className="sidebar-section ticket-section">
        <h3 className="sidebar-title">Get Tickets</h3>
        <p className="ticket-intro">Buy from trusted sellers and support Plan Your Park.</p>
        <div className="ticket-buttons">
          <a
            href="https://www.dpbolvw.net/click-101693488-5527150"
            target="_blank"
            rel="noopener noreferrer"
            className="ticket-btn ticket-btn--disney"
          >
            <span className="ticket-icon">🎢</span>
            <span className="ticket-text">
              <strong>Disney World</strong>
              <small>via Undercover Tourist</small>
            </span>
          </a>
          <a
            href="https://www.amazon.com/disney-world-tickets/s?k=disney+world+tickets&tag=planyourpark-20"
            target="_blank"
            rel="noopener noreferrer"
            className="ticket-btn ticket-btn--universal"
          >
            <span className="ticket-icon">🎠</span>
            <span className="ticket-text">
              <strong>Universal</strong>
              <small>via Amazon</small>
            </span>
          </a>
          <a
            href="https://www.amazon.com/seaworld-orlando-tickets/s?k=seaworld+orlando+tickets&tag=planyourpark-20"
            target="_blank"
            rel="noopener noreferrer"
            className="ticket-btn ticket-btn--seaworld"
          >
            <span className="ticket-icon">🐬</span>
            <span className="ticket-text">
              <strong>SeaWorld</strong>
              <small>via Amazon</small>
            </span>
          </a>
          <a
            href="https://www.amazon.com/legoland-florida-tickets/s?k=legoland+florida+tickets&tag=planyourpark-20"
            target="_blank"
            rel="noopener noreferrer"
            className="ticket-btn ticket-btn--legoland"
          >
            <span className="ticket-icon">🧱</span>
            <span className="ticket-text">
              <strong>LEGOLAND</strong>
              <small>via Amazon</small>
            </span>
          </a>
        </div>
      </div>

      <style>{`
        .filter-sidebar {
          width: 280px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .sidebar-section {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.25rem;
        }

        .sidebar-title {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 1rem;
        }

        .filter-group {
          margin-bottom: 1.25rem;
        }

        .filter-group:last-child {
          margin-bottom: 0;
        }

        .filter-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-medium);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.625rem;
        }

        .filter-label strong {
          color: var(--primary);
        }

        /* Park Checkboxes */
        .park-filter-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .park-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: var(--text-medium);
        }

        .park-checkbox input {
          display: none;
        }

        .park-checkmark {
          width: 18px;
          height: 18px;
          border: 2px solid var(--border);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          flex-shrink: 0;
        }

        .park-checkbox input:checked + .park-checkmark {
          background: var(--primary);
          border-color: var(--primary);
        }

        .park-checkbox input:checked + .park-checkmark::after {
          content: '✓';
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .park-name {
          flex: 1;
        }

        /* Height Slider */
        .height-slider {
          width: 100%;
          height: 6px;
          -webkit-appearance: none;
          appearance: none;
          background: var(--bg-light);
          border-radius: 3px;
          outline: none;
          cursor: pointer;
        }

        .height-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: var(--primary);
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }

        .height-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: var(--primary);
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }

        .slider-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 0.375rem;
          font-size: 0.6875rem;
          color: var(--text-light);
        }

        /* Toggle Switches */
        .toggle-list {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .toggle-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: var(--text-medium);
        }

        .toggle-item input {
          display: none;
        }

        .toggle-switch {
          width: 36px;
          height: 20px;
          background: var(--bg-light);
          border: 1px solid var(--border);
          border-radius: 10px;
          position: relative;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 14px;
          height: 14px;
          background: var(--text-light);
          border-radius: 50%;
          transition: all 0.2s;
        }

        .toggle-item input:checked + .toggle-switch {
          background: var(--primary);
          border-color: var(--primary);
        }

        .toggle-item input:checked + .toggle-switch::after {
          left: 18px;
          background: white;
        }

        .toggle-text {
          flex: 1;
        }

        /* Clear Filters Button */
        .clear-filters-btn {
          width: 100%;
          padding: 0.625rem;
          background: var(--bg-light);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-medium);
          cursor: pointer;
          transition: all 0.15s;
          margin-top: 1rem;
        }

        .clear-filters-btn:hover {
          border-color: #EF4444;
          color: #EF4444;
        }

        /* Ticket Section */
        .ticket-section {
          background: linear-gradient(135deg, var(--primary) 0%, #e85a1a 100%);
          border: none;
        }

        .ticket-section .sidebar-title {
          color: white;
        }

        .ticket-intro {
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.85);
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .ticket-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .ticket-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255,255,255,0.95);
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .ticket-btn:hover {
          background: white;
          transform: translateX(4px);
        }

        .ticket-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .ticket-text {
          display: flex;
          flex-direction: column;
        }

        .ticket-text strong {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .ticket-text small {
          font-size: 0.6875rem;
          color: var(--text-light);
        }

        @media (max-width: 900px) {
          .filter-sidebar {
            width: 100%;
          }
        }
      `}</style>
    </aside>
  );
}
