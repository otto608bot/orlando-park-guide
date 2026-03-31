'use client';

import Link from 'next/link';

interface HomepageHeaderProps {
  totalRides: number;
}

export default function HomepageHeader({ totalRides }: HomepageHeaderProps) {
  return (
    <>
      <header className="home-header">
        <div className="callout-wrapper">
          <h1 className="home-title">Find Rides for Everyone</h1>
        </div>
        <p className="home-subtitle">
          Browse {totalRides} rides across Orlando&apos;s top theme parks
        </p>
        <div className="home-cta-wrap">
          <Link href="/rides" className="home-cta-btn">
            Browse All Rides
          </Link>
        </div>
      </header>

      <style>{`
        .home-header {
          text-align: center;
          margin-bottom: 1.5rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #F37021 0%, #E85A1A 100%);
          border-radius: 12px;
          position: relative;
          overflow: hidden;
        }

        .home-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse at 70% 80%, rgba(0,0,0,0.05) 0%, transparent 60%);
          pointer-events: none;
        }

        .callout-wrapper {
          position: relative;
          display: inline-block;
        }

        .home-title {
          font-family: var(--font-heading);
          font-size: clamp(1.25rem, 3vw, 1.75rem);
          font-weight: 800;
          color: white;
          margin: 0;
          line-height: 1.2;
          text-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .home-subtitle {
          font-size: 0.9375rem;
          color: rgba(255,255,255,0.88);
          margin: 0.5rem auto 0;
          max-width: 420px;
        }

        .home-cta-wrap {
          margin-top: 1rem;
        }

        .home-cta-btn {
          display: inline-block;
          background: white;
          color: #E85A1A;
          padding: 0.625rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }

        .home-cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.18);
          background: #fff5f0;
        }

        @media (max-width: 640px) {
          .home-header {
            padding: 0.875rem 1rem;
          }
        }
      `}</style>
    </>
  );
}
