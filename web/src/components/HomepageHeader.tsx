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
          <div className="callout-emojis">
            <span className="emoji emoji-left">🎢</span>
            <span className="emoji emoji-right">🏰</span>
          </div>
          <h1 className="home-title">Find Rides for Everyone</h1>
          <div className="callout-emojis-bottom">
            <span className="emoji emoji-star">🌟</span>
          </div>
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
          margin-bottom: 2rem;
          padding: 2.5rem 2rem 2rem;
          background: linear-gradient(135deg, #F37021 0%, #E85A1A 100%);
          border-radius: 16px;
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

        .callout-emojis {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 0.25rem;
        }

        .callout-emojis-bottom {
          display: flex;
          justify-content: center;
          margin-top: 0.25rem;
        }

        .emoji {
          font-size: 1.75rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
        }

        .emoji-left {
          animation: emojiBounceLeft 2s ease-in-out infinite;
        }

        .emoji-right {
          animation: emojiBounceRight 2s ease-in-out infinite;
        }

        .emoji-star {
          animation: emojiPulse 1.8s ease-in-out infinite;
        }

        @keyframes emojiBounceLeft {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-6px) rotate(5deg); }
        }

        @keyframes emojiBounceRight {
          0%, 100% { transform: translateY(0) rotate(5deg); }
          50% { transform: translateY(-6px) rotate(-5deg); }
        }

        @keyframes emojiPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        .home-title {
          font-family: var(--font-heading);
          font-size: clamp(2rem, 6vw, 3rem);
          font-weight: 800;
          color: white;
          margin: 0;
          line-height: 1.15;
          text-shadow: 0 2px 8px rgba(0,0,0,0.2);
          animation: titlePulse 3s ease-in-out infinite;
        }

        @keyframes titlePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }

        .home-subtitle {
          font-size: 1.0625rem;
          color: rgba(255,255,255,0.88);
          margin: 1rem auto 0;
          max-width: 480px;
        }

        .home-cta-wrap {
          margin-top: 1.5rem;
        }

        .home-cta-btn {
          display: inline-block;
          background: white;
          color: #E85A1A;
          padding: 0.875rem 2rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .home-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
          background: #fff5f0;
        }

        @media (max-width: 640px) {
          .home-header {
            padding: 2rem 1.25rem 1.75rem;
          }
          .emoji {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
