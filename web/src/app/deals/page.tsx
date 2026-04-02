import type { Metadata } from "next";
import Link from "next/link";
import TallyNewsletter from "@/components/TallyNewsletter";
import { AFFILIATE_LINKS } from "@/config/affiliate-links";

export const metadata: Metadata = {
  title: "Orlando Theme Park Deals & Discounts",
  description: "Save money on your Orlando vacation with exclusive ticket discounts and package deals.",
};

const gearItems = [
  {
    id: "travel-adapter",
    name: "Travel Adapter",
    description: "Universal adapter for international devices — works at Disney resorts and parks.",
    asin: "B00BWPQCRC",
    icon: "🔌",
  },
  {
    id: "phone-charger",
    name: "Portable Phone Charger",
    description: "20000mAh power bank to keep your phone charged all day in the parks.",
    asin: "B07YNMW3CX",
    icon: "🔋",
  },
  {
    id: "sunscreen-spray",
    name: "Sunscreen Spray",
    description: "Easy spray-on SPF 50 sunscreen — Florida sun is no joke at the parks.",
    asin: "B07JZGYJCL",
    icon: "☀️",
  },
  {
    id: "water-bottle",
    name: "Insulated Water Bottle",
    description: "Keeps water ice-cold for hours. Disney allows reusable bottles — fill up for free.",
    asin: "B09KV1QTQ8",
    icon: "💧",
  },
  {
    id: "mini-fan",
    name: "Mini Fan",
    description: "USB rechargeable handheld fan — a lifesaver in the Florida summer heat.",
    asin: "B0BZN1JZNL",
    icon: "🌀",
  },
];

const tips = [
  { icon: "📅", tip: "Visit mid-week (Tuesday–Thursday) for the shortest lines at Disney", highlight: true },
  { icon: "🍪", tip: "Bring your own snacks — Disney allows outside food and drinks", highlight: false },
  { icon: "🗓️", tip: "Book dining reservations 60 days in advance for popular restaurants", highlight: false },
  { icon: "💳", tip: "Use a credit card with no foreign transaction fees if buying international tickets", highlight: false },
  { icon: "🌡️", tip: "Summer visitors: rent a locker for a cooling towel and water bottle", highlight: false },
  { icon: "🎒", tip: "Order park accessories on Amazon before your trip — often 40% cheaper than park gift shops", highlight: false },
];

const attractionTickets = [
  {
    name: "SeaWorld Orlando",
    description: "Experience incredible marine life shows, up-close animal encounters, and thrilling rides.",
    icon: "🐬",
    link: AFFILIATE_LINKS.seaworld,
    linkText: "Get SeaWorld Tickets",
  },
  {
    name: "LEGOLAND Florida",
    description: "A kid-focused theme park built entirely with LEGO bricks — perfect for families with young children.",
    icon: "🧱",
    link: AFFILIATE_LINKS.legoland,
    linkText: "Get LEGOLAND Tickets",
  },
  {
    name: "Discovery Cove",
    description: "An all-inclusive day resort where you can swim with dolphins, snorkel with rays, and relax in paradise.",
    icon: "🐠",
    link: AFFILIATE_LINKS.discoveryCove,
    linkText: "Get Discovery Cove Tickets",
  },
  {
    name: "Gatorland",
    description: "The 'Alligator Capital of the World' — budget-friendly Florida wildlife park with shows and encounters.",
    icon: "🐊",
    link: AFFILIATE_LINKS.gatorland,
    linkText: "Get Gatorland Tickets",
  },
];

export default function DealsPage() {
  return (
    <div className="deals-page">
      <header className="deals-header">
        <h1>Orlando Park Deals</h1>
        <p className="deals-subtitle">
          Verified discounts and money-saving strategies for your Orlando theme park vacation.
        </p>
      </header>

      {/* Full-width Undercover Tourist Banner */}
      <a
        href={AFFILIATE_LINKS.ucDealsPage}
        target="_blank"
        rel="noopener noreferrer"
        className="uc-banner"
      >
        <div className="uc-banner-inner">
          <div className="uc-banner-icon">🎢</div>
          <div className="uc-banner-content">
            <span className="uc-banner-tag">Limited Time</span>
            <span className="uc-banner-title">Save up to 20% on theme park tickets</span>
            <span className="uc-banner-sub">Disney, Universal, SeaWorld & more — via Undercover Tourist</span>
          </div>
          <span className="uc-banner-cta">
            Get Tickets
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </span>
        </div>
      </a>

      {/* Orlando Attraction Tickets Section */}
      <section className="attractions-section">
        <div className="attractions-header">
          <h2>Orlando Attraction Tickets</h2>
          <p>Great parks beyond Disney and Universal — book direct and save.</p>
        </div>
        <div className="attractions-grid">
          {attractionTickets.map(ticket => (
            <a
              key={ticket.name}
              href={ticket.link}
              target="_blank"
              rel="noopener noreferrer"
              className="attraction-card"
            >
              <div className="attraction-icon">{ticket.icon}</div>
              <div className="attraction-info">
                <h3>{ticket.name}</h3>
                <p>{ticket.description}</p>
              </div>
              <span className="attraction-cta">{ticket.linkText} →</span>
            </a>
          ))}
        </div>
      </section>

      {/* Amazon Gear Section */}
      <section className="gear-section">
        <div className="gear-header">
          <h2>Park-Ready Gear</h2>
          <p>Order ahead and save — delivered to your hotel or home before your trip.</p>
        </div>
        <div className="gear-grid">
          {gearItems.map(item => (
            <a
              key={item.id}
              href={`https://www.amazon.com/dp/${item.asin}?tag=planyourpark-20`}
              target="_blank"
              rel="noopener"
              className="gear-card"
            >
              <div className="gear-icon">{item.icon}</div>
              <div className="gear-info">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <span className="gear-cta">View on Amazon →</span>
            </a>
          ))}
        </div>
      </section>

      {/* Money-Saving Tips */}
      <section className="deals-tips">
        <h2>Money-Saving Tips</h2>
        <div className="tips-grid">
          {tips.map((tip, i) => (
            <div key={i} className={`tip-item ${tip.highlight ? 'tip-item--highlight' : ''}`}>
              <span className="tip-icon">{tip.icon}</span>
              <p>{tip.tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Email Signup */}
      <section className="deals-email">
        <div className="deals-email-icon">🏰</div>
        <h2>Get Weekly Disney Tips</h2>
        <p>Closures, new rides, and money-saving tips — delivered every Tuesday.</p>
        <TallyNewsletter />
      </section>

      <style>{`
        .deals-page {
          max-width: 960px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }

        .deals-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .deals-header h1 {
          font-family: var(--font-heading);
          font-size: clamp(1.75rem, 5vw, 2.5rem);
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 1rem;
        }

        .deals-subtitle {
          font-size: 1.125rem;
          color: var(--text-medium);
          max-width: 600px;
          margin: 0 auto;
        }

        /* Undercover Tourist Banner */
        .uc-banner {
          display: block;
          background: linear-gradient(135deg, #F37021 0%, #E85A1A 100%);
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 3rem;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(243,112,33,0.3);
        }

        .uc-banner:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(243,112,33,0.4);
        }

        .uc-banner-inner {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .uc-banner-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .uc-banner-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
          min-width: 200px;
        }

        .uc-banner-tag {
          display: inline-block;
          background: rgba(255,255,255,0.25);
          color: white;
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 0.2rem 0.625rem;
          border-radius: 9999px;
          width: fit-content;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .uc-banner-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          color: white;
          line-height: 1.2;
        }

        .uc-banner-sub {
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.85);
        }

        .uc-banner-cta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          color: #E85A1A;
          font-weight: 700;
          font-size: 0.9375rem;
          padding: 0.625rem 1.25rem;
          border-radius: 8px;
          white-space: nowrap;
          transition: background 0.15s;
        }

        .uc-banner:hover .uc-banner-cta {
          background: #fff5f0;
        }

        /* Attractions Section */
        .attractions-section {
          margin-bottom: 3rem;
        }

        .attractions-header {
          margin-bottom: 1.5rem;
        }

        .attractions-header h2 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }

        .attractions-header p {
          font-size: 1rem;
          color: var(--text-medium);
        }

        .attractions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .attraction-card {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1.25rem;
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
        }

        .attraction-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .attraction-icon {
          font-size: 2rem;
        }

        .attraction-info h3 {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.375rem;
        }

        .attraction-info p {
          font-size: 0.8125rem;
          color: var(--text-medium);
          line-height: 1.5;
          margin: 0;
        }

        .attraction-cta {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--primary);
          margin-top: auto;
        }

        /* Gear Section */
        .gear-section {
          margin-bottom: 3rem;
        }

        .gear-header {
          margin-bottom: 1.5rem;
        }

        .gear-header h2 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }

        .gear-header p {
          font-size: 1rem;
          color: var(--text-medium);
        }

        .gear-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }

        .gear-card {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1.25rem;
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
        }

        .gear-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .gear-icon {
          font-size: 2rem;
        }

        .gear-info h3 {
          font-family: var(--font-heading);
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.375rem;
        }

        .gear-info p {
          font-size: 0.8125rem;
          color: var(--text-medium);
          line-height: 1.5;
          margin: 0;
        }

        .gear-cta {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--primary);
          margin-top: auto;
        }

        /* Tips Section */
        .deals-tips {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 2rem;
          margin-bottom: 3rem;
        }

        .deals-tips h2 {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 1.25rem;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .tip-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: var(--bg-light);
          border-radius: 10px;
        }

        .tip-item--highlight {
          background: #FFF7ED;
          border: 1px solid #FED7AA;
        }

        .tip-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .tip-item p {
          font-size: 0.875rem;
          color: var(--text-medium);
          line-height: 1.5;
          margin: 0;
        }

        .tip-item--highlight p {
          color: var(--text-dark);
          font-weight: 500;
        }

        /* Email Section */
        .deals-email {
          background: linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%);
          border: 1px solid #FED7AA;
          border-radius: 14px;
          padding: 2.5rem 2rem;
          text-align: center;
        }

        .deals-email-icon {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
        }

        .deals-email h2 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }

        .deals-email p {
          font-size: 1rem;
          color: var(--text-medium);
          margin-bottom: 1.5rem;
        }

        @media (max-width: 768px) {
          .tips-grid {
            grid-template-columns: 1fr;
          }
          .gear-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .attractions-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .deals-page { padding: 1.5rem 1rem 3rem; }
          .uc-banner-inner {
            flex-direction: column;
            text-align: center;
          }
          .uc-banner-cta {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
