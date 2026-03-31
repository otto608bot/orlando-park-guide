import type { Metadata } from "next";
import Link from "next/link";
import EmailForm from "@/components/EmailForm";

export const metadata: Metadata = {
  title: "Orlando Theme Park Deals & Discounts",
  description: "Save money on your Orlando vacation with exclusive ticket discounts and package deals.",
};

const deals = [
  {
    id: "undercover-tourist",
    category: "Tickets",
    title: "Undercover Tourist",
    description: "Official Disney & Universal ticket reseller with competitive prices and instant e-ticket delivery. Save up to 20% vs. gate prices on multi-day tickets.",
    icon: "🎢",
    ctaText: "Get Tickets",
    ctaUrl: "https://www.dpbolvw.net/click-101693488-5527150",
    badge: "Best Savings",
    featured: true,
  },
  {
    id: "amazon-gear",
    category: "Gear & Accessories",
    title: "Amazon Park Gear",
    description: "Skip the park shops — order ahead and save. Backpacks, ponchos, cooling towels, and more delivered to your hotel or home.",
    icon: "🎒",
    ctaText: "Shop Amazon",
    ctaUrl: "https://www.amazon.com/s?k=disney+world+accessories&tag=planyourpark-20",
    badge: "Quick Delivery",
    featured: false,
  },
  {
    id: "hotel-deals",
    category: "Hotels",
    title: "Orlando Hotel Deals",
    description: "Stay off-property and save hundreds. Many hotels near Disney offer free shuttles, complimentary breakfast, and significantly lower costs than Disney resorts.",
    icon: "🏨",
    ctaText: "Compare Hotels",
    ctaUrl: "https://www.amazon.com/s?k=orlando+florida+hotel&tag=planyourpark-20",
    badge: "Save Big",
    featured: false,
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

export default function DealsPage() {
  return (
    <div className="deals-page">
      <header className="deals-header">
        <h1>Orlando Park Deals</h1>
        <p className="deals-subtitle">
          Verified discounts and money-saving strategies for your Orlando theme park vacation.
        </p>
      </header>

      {/* Deals Grid */}
      <section className="deals-grid">
        {deals.map(deal => (
          <div key={deal.id} className={`deal-card ${deal.featured ? 'deal-card--featured' : ''}`}>
            {deal.featured && <div className="deal-card-featured-badge">{deal.badge}</div>}
            <div className="deal-card-icon">{deal.icon}</div>
            <div className="deal-card-category">{deal.category}</div>
            <h2 className="deal-card-title">{deal.title}</h2>
            <p className="deal-card-desc">{deal.description}</p>
            <a
              href={deal.ctaUrl}
              target="_blank"
              rel="noopener"
              className={`deal-card-cta ${deal.featured ? 'deal-card-cta--primary' : ''}`}
            >
              {deal.ctaText} →
            </a>
          </div>
        ))}
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
        <EmailForm buttonText="Subscribe — It's Free" />
      </section>

      <style>{`
        .deals-page {
          max-width: 960px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }

        .deals-header {
          text-align: center;
          margin-bottom: 3rem;
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

        /* Deals Grid */
        .deals-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-bottom: 3rem;
        }

        .deal-card {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          position: relative;
          transition: all 0.2s ease;
        }

        .deal-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .deal-card--featured {
          background: linear-gradient(145deg, #FFF7ED 0%, #FFFFFF 100%);
          border: 2px solid var(--primary);
        }

        .deal-card-featured-badge {
          display: inline-block;
          background: var(--primary);
          color: white;
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 0.25rem 0.625rem;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          width: fit-content;
          margin-bottom: 0.25rem;
        }

        .deal-card-icon {
          font-size: 2.25rem;
          margin-bottom: 0.25rem;
        }

        .deal-card-category {
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .deal-card-title {
          font-family: var(--font-heading);
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-dark);
          line-height: 1.3;
          margin-bottom: 0.25rem;
        }

        .deal-card-desc {
          font-size: 0.875rem;
          color: var(--text-medium);
          line-height: 1.55;
          flex: 1;
          margin-bottom: 0.5rem;
        }

        .deal-card-cta {
          display: block;
          width: 100%;
          padding: 0.75rem;
          text-align: center;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.875rem;
          transition: all 0.2s;
          background: var(--bg-light);
          color: var(--text-dark);
          border: 1.5px solid var(--border);
          margin-top: auto;
        }

        .deal-card-cta:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .deal-card-cta--primary {
          background: linear-gradient(135deg, var(--primary) 0%, #e85a1a 100%);
          color: white !important;
          border: none !important;
        }

        .deal-card-cta--primary:hover {
          opacity: 0.9;
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
          .deals-grid {
            grid-template-columns: 1fr;
          }
          .tips-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .deals-page { padding: 1.5rem 1rem 3rem; }
        }
      `}</style>
    </div>
  );
}
