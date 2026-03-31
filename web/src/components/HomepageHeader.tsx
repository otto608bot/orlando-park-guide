'use client';

import Link from 'next/link';

interface HomepageHeaderProps {
  totalRides: number;
}

export default function HomepageHeader({ totalRides }: HomepageHeaderProps) {
  return (
    <>
      <header className="home-header">
        <div className="home-header-inner">
          <h1 className="home-title">Find Rides for Everyone</h1>
          <Link href="/rides" className="home-cta-btn">
            Browse All Rides
          </Link>
        </div>
      </header>

      <style>{`
        .home-header {
          margin-bottom: 1rem;
          padding: 0.625rem 1rem;
          background: linear-gradient(135deg, #F37021 0%, #E85A1A 100%);
          border-radius: 10px;
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

        .home-header-inner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .home-title {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 800;
          color: white;
          margin: 0;
          line-height: 1.2;
          text-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }

        .home-cta-btn {
          display: inline-block;
          background: white;
          color: #E85A1A;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.8125rem;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          white-space: nowrap;
        }

        .home-cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(0,0,0,0.15);
          background: #fff5f0;
        }

        @media (max-width: 640px) {
          .home-header {
            padding: 0.5rem 0.875rem;
          }

          .home-title {
            font-size: 0.9375rem;
          }
        }
      `}</style>
    </>
  );
}
