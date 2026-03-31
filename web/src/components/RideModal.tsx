'use client';

import { useEffect } from 'react';
import type { Ride } from '@/lib/sanity-types';

interface RideModalProps {
  ride: Ride | null;
  onClose: () => void;
}

function getRideImageSrc(ride: Ride): string | null {
  if (ride.image?.asset?.url) {
    return ride.image.asset.url;
  }
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

export default function RideModal({ ride, onClose }: RideModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (ride) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [ride]);

  if (!ride) return null;

  const imageSrc = getRideImageSrc(ride);
  const parkSlug = getParkSlug(ride.park);
  const thrill = thrillClass(ride.thrillLevel);
  const thrillLbl = thrillLabel(ride.thrillLevel);
  const parkColorMap: Record<string, string> = {
    'magic-kingdom': '#4A9DE8',
    'epcot': '#8B5CF6',
    'hollywood-studios': '#EF4444',
    'animal-kingdom': '#10B981',
    'universal-studios-florida': '#F59E0B',
    'islands-of-adventure': '#06B6D4',
    'epic-universe': '#8B5CF6',
    'seaworld-orlando': '#3B82F6',
    'legoland-florida': '#F97316',
  };
  const parkColor = parkColorMap[parkSlug] || '#F37021';

  const accessibility = ride.accessibility || [];
  const isPregnancySafe = !accessibility.some(a =>
    a?.toLowerCase().includes('pregnancy') || a?.toLowerCase().includes('expectant')
  );
  const isWheelchair = accessibility.some(a =>
    a?.toLowerCase().includes('wheelchair') || a?.toLowerCase().includes('wav') || a?.toLowerCase().includes('ecv')
  );
  const isCalm = accessibility.some(a =>
    ['calm', 'gentle', 'slow', 'peaceful', 'no sudden'].some(ci => a?.toLowerCase().includes(ci))
  );

  return (
    <>
      <div className="ride-modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="ride-modal" role="dialog" aria-modal="true" aria-labelledby="ride-modal-title">
        <button className="ride-modal-close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Hero Image */}
        <div className="ride-modal-hero">
          {imageSrc ? (
            <img src={imageSrc} alt={ride.name} />
          ) : (
            <div className="ride-modal-hero-placeholder" style={{ background: `${parkColor}22` }}>
              <span style={{ fontSize: '4rem' }}>🎢</span>
            </div>
          )}
          {ride.isClosed && (
            <div className="ride-modal-closed-overlay">
              <span>CLOSED TEMPORARILY</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="ride-modal-content">
          {/* Park + Land */}
          <div className="ride-modal-park">
            <span className={`park-link park-badge--${parkSlug}`} style={{ color: parkColor, fontWeight: 600, fontSize: '0.875rem' }}>
              {ride.park}
            </span>
          </div>

          {/* Title + Badges */}
          <div className="ride-modal-header">
            <h2 id="ride-modal-title" className="ride-modal-title">{ride.name}</h2>
            <div className="ride-modal-badges">
              <span className={`thrill-badge thrill-badge--${thrill}`}>{thrillLbl}</span>
              {ride.rideType && <span className="type-pill">{ride.rideType}</span>}
              {ride.isClosed && <span className="closed-pill">CLOSED</span>}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="ride-modal-stats">
            <div className="stat-item">
              <span className="stat-label">Height Req.</span>
              <span className="stat-value">
                {ride.heightRequirement && ride.heightRequirement > 0
                  ? `${ride.heightRequirement}"`
                  : 'None'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Thrill Level</span>
              <span className={`stat-value thrill-text thrill-text--${thrill}`}>{thrillLbl}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Type</span>
              <span className="stat-value">{ride.rideType || 'Ride'}</span>
            </div>
          </div>

          {/* Description */}
          {ride.description && (
            <div className="ride-modal-section">
              <h3>About This Ride</h3>
              <p>{ride.description}</p>
            </div>
          )}

          {/* Accessibility */}
          <div className="ride-modal-section">
            <h3>Accessibility &amp; Safety</h3>
            <div className="accessibility-grid">
              <div className={`access-row ${isPregnancySafe ? 'access-ok' : 'access-no'}`}>
                <span className="access-emoji">{isPregnancySafe ? '✅' : '❌'}</span>
                <div>
                  <strong>Pregnancy</strong>
                  <p>{isPregnancySafe ? 'Generally safe — always check posted warnings' : 'Not recommended — check posted warnings'}</p>
                </div>
              </div>
              <div className={`access-row ${isWheelchair ? 'access-ok' : 'access-mixed'}`}>
                <span className="access-emoji">♿</span>
                <div>
                  <strong>Wheelchair / ECV</strong>
                  <p>{isWheelchair ? 'Wheelchair & ECV accessible rides available' : 'Contact guest services for accommodation options'}</p>
                </div>
              </div>
              <div className={`access-row ${isCalm ? 'access-ok' : 'access-mixed'}`}>
                <span className="access-emoji">😌</span>
                <div>
                  <strong>Sensory / Calm</strong>
                  <p>{isCalm ? 'Calm experience options available' : 'May include intense motion, darkness, or loud sounds'}</p>
                </div>
              </div>
            </div>
            {accessibility.length > 0 && (
              <div className="access-tags">
                {accessibility.map((tag, i) => (
                  <span key={i} className="access-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="ride-modal-cta">
            <a
              href={`https://www.dpbolvw.net/click-101693488-5527150`}
              target="_blank"
              rel="noopener"
              className="modal-cta-btn"
            >
              Get Tickets for {ride.park} →
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .ride-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1000;
          backdrop-filter: blur(2px);
          animation: backdropFadeIn 0.2s ease;
        }

        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .ride-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1001;
          width: min(680px, calc(100vw - 2rem));
          max-height: calc(100vh - 4rem);
          overflow-y: auto;
          background: var(--bg-white);
          border-radius: 16px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.25);
          animation: modalSlideIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes modalSlideIn {
          from { opacity: 0; transform: translate(-50%, -48%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }

        .ride-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 10;
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.9);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dark);
          transition: all 0.15s;
          backdrop-filter: blur(4px);
        }

        .ride-modal-close:hover {
          background: white;
          transform: scale(1.1);
        }

        .ride-modal-hero {
          width: 100%;
          height: 260px;
          overflow: hidden;
          background: var(--bg-light);
          position: relative;
          border-radius: 16px 16px 0 0;
        }

        .ride-modal-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ride-modal-hero-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ride-modal-closed-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ride-modal-closed-overlay span {
          background: #EF4444;
          color: white;
          font-size: 0.875rem;
          font-weight: 700;
          padding: 0.5rem 1.25rem;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ride-modal-content {
          padding: 1.5rem;
        }

        .ride-modal-park {
          margin-bottom: 0.75rem;
        }

        .ride-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }

        .ride-modal-title {
          font-family: var(--font-heading);
          font-size: clamp(1.25rem, 4vw, 1.75rem);
          font-weight: 800;
          color: var(--text-dark);
          line-height: 1.2;
        }

        .ride-modal-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
          flex-shrink: 0;
        }

        .closed-pill {
          display: inline-block;
          font-size: 0.625rem;
          font-weight: 700;
          color: #EF4444;
          background: #FEF2F2;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ride-modal-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: var(--bg-light);
          border-radius: 10px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          text-align: center;
        }

        .stat-label {
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .thrill-text--thrill-high { color: #DC2626; }
        .thrill-text--thrill-medium { color: #D97706; }
        .thrill-text--thrill-family { color: #059669; }

        .ride-modal-section {
          margin-bottom: 1.5rem;
        }

        .ride-modal-section h3 {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border);
        }

        .ride-modal-section p {
          font-size: 0.9375rem;
          color: var(--text-medium);
          line-height: 1.65;
        }

        .accessibility-grid {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          margin-bottom: 0.75rem;
        }

        .access-row {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.625rem 0.75rem;
          border-radius: 8px;
          background: var(--bg-light);
        }

        .access-row.access-ok { background: #F0FDF4; }
        .access-row.access-no { background: #FEF2F2; }
        .access-row.access-mixed { background: #FFFBEB; }

        .access-emoji {
          font-size: 1.125rem;
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .access-row strong {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 0.125rem;
        }

        .access-row p {
          font-size: 0.8125rem;
          color: var(--text-medium);
          margin: 0;
          line-height: 1.4;
        }

        .access-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }

        .access-tag {
          font-size: 0.6875rem;
          font-weight: 500;
          color: var(--text-medium);
          background: var(--bg-light);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          border: 1px solid var(--border);
        }

        .ride-modal-cta {
          margin-top: 1.5rem;
        }

        .modal-cta-btn {
          display: block;
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, var(--primary) 0%, #e85a1a 100%);
          color: white;
          text-align: center;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.9375rem;
          border-radius: 10px;
          transition: opacity 0.2s;
        }

        .modal-cta-btn:hover {
          opacity: 0.9;
        }

        @media (max-width: 480px) {
          .ride-modal-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .ride-modal-header {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
