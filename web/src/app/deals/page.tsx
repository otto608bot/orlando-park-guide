import type { Metadata } from "next";
import Link from "next/link";
import EmailForm from "@/components/EmailForm";

export const metadata: Metadata = {
  title: "Orlando Theme Park Deals & Discounts",
  description: "Find the best deals on Orlando theme park tickets, hotel packages, and more.",
};

export default function DealsPage() {
  const deals = [
    {
      title: "Undercover Tourist",
      description: "Official Disney & Universal ticket reseller with competitive prices and instant confirmation.",
      url: "https://www.dpbolvw.net/click-101693488-5527150",
      badge: "Trusted Reseller",
      discount: "Save up to 20%",
    },
    {
      title: "Amazon Tickets",
      description: "Digital tickets delivered instantly to your Amazon account. Check for current promotions.",
      url: "https://www.amazon.com/shops/planyourpark-20",
      badge: "Quick Delivery",
      discount: "Check Current Prices",
    },
  ];

  return (
    <div className="deals-page">
      <header className="deals-header">
        <h1>Orlando Park Deals</h1>
        <p className="deals-subtitle">
          Save money on your Orlando vacation with exclusive ticket discounts and package deals.
        </p>
      </header>

      <section className="deals-main">
        <a 
          href="https://www.dpbolvw.net/click-101693488-5527150"
          target="_blank"
          rel="noopener"
          className="deal-card featured"
        >
          <div className="deal-badge">{deals[0].discount}</div>
          <h2>{deals[0].title}</h2>
          <p>{deals[0].description}</p>
          <span className="deal-cta">Get Tickets →</span>
        </a>

        <a 
          href="https://www.amazon.com/shops/planyourpark-20"
          target="_blank"
          rel="noopener"
          className="deal-card"
        >
          <div className="deal-badge">{deals[1].discount}</div>
          <h2>{deals[1].title}</h2>
          <p>{deals[1].description}</p>
          <span className="deal-cta">Shop Amazon →</span>
        </a>
      </section>

      <section className="deals-tips">
        <h2>Money-Saving Tips</h2>
        <ul>
          <li><strong>Buy park hopper tickets</strong> — Maximize your park time by visiting multiple parks in one day</li>
          <li><strong>Book accommodations off-property</strong> — Save hundreds on hotels with free airport shuttles</li>
          <li><strong>Visit during off-season</strong> — January through March typically has lower prices and shorter lines</li>
          <li><strong>Bring your own snacks</strong> — Disney allows outside food. Save big on counter service meals</li>
          <li><strong>Use reward points</strong> — Check if your credit card offers park ticket discounts or travel credits</li>
        </ul>
      </section>

      <section className="deals-email">
        <h2>Get Deal Alerts</h2>
        <p>Subscribe to get notified when new discounts become available.</p>
        <EmailForm buttonText="Subscribe for Deals" />
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
        
        .deals-main {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        
        .deal-card {
          display: block;
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 2rem;
          text-decoration: none;
          color: inherit;
          position: relative;
          transition: all 0.2s;
        }
        
        .deal-card.featured {
          background: linear-gradient(135deg, var(--primary) 0%, #e85a1a 100%);
          color: white;
          border: none;
        }
        
        .deal-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }
        
        .deal-badge {
          display: inline-block;
          background: rgba(255,255,255,0.2);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          margin-bottom: 1rem;
        }
        
        .deal-card:not(.featured) .deal-badge {
          background: var(--primary);
          color: white;
        }
        
        .deal-card h2 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }
        
        .deal-card p {
          font-size: 1rem;
          opacity: 0.9;
          margin-bottom: 1rem;
        }
        
        .deal-cta {
          font-weight: 600;
          font-size: 0.9375rem;
        }
        
        .deals-tips {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 12px;
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
        
        .deals-tips ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .deals-tips li {
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border);
          font-size: 0.9375rem;
          color: var(--text-medium);
        }
        
        .deals-tips li:last-child {
          border-bottom: none;
        }
        
        .deals-tips li strong {
          color: var(--text-dark);
        }
        
        .deals-email {
          background: var(--bg-light);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
        }
        
        .deals-email h2 {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }
        
        .deals-email p {
          font-size: 0.9375rem;
          color: var(--text-medium);
          margin-bottom: 1.25rem;
        }
        
        @media (max-width: 640px) {
          .deals-page { padding: 1.5rem 1rem 3rem; }
          .deal-card { padding: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
