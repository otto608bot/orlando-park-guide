import type { Metadata } from "next";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
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
    url: "https://www.amazon.com/s?k=universal+travel+adapter+international&tag=planyourpark-20",
    icon: "🔌",
  },
  {
    id: "phone-charger",
    name: "Portable Phone Charger",
    description: "20000mAh power bank to keep your phone charged all day in the parks.",
    url: "https://www.amazon.com/s?k=portable+phone+charger+20000mah+disney&tag=planyourpark-20",
    icon: "🔋",
  },
  {
    id: "sunscreen-spray",
    name: "Sunscreen Spray",
    description: "Easy spray-on SPF 50 sunscreen — Florida sun is no joke at the parks.",
    url: "https://www.amazon.com/s?k=sunscreen+spf+50+spray+disney&tag=planyourpark-20",
    icon: "☀️",
  },
  {
    id: "water-bottle",
    name: "Insulated Water Bottle",
    description: "Keeps water ice-cold for hours. Disney allows reusable bottles — fill up for free.",
    url: "https://www.amazon.com/s?k=insulated+water+bottle+32oz+disney&tag=planyourpark-20",
    icon: "💧",
  },
  {
    id: "mini-fan",
    name: "Mini Fan",
    description: "USB rechargeable handheld fan — a lifesaver in the Florida summer heat.",
    url: "https://www.amazon.com/s?k=usb+handheld+fan+disney+world&tag=planyourpark-20",
    icon: "🌀",
  },
  {
    id: "cooling-towel",
    name: "Cooling Towel",
    description: "Soak in cold water and drape around your neck. Magic in the Florida heat.",
    url: "https://www.amazon.com/s?k=cooling+towel+disney+world&tag=planyourpark-20",
    icon: "❄️",
  },
  {
    id: "poncho",
    name: "Rain Ponchos (20-Pack)",
    description: "Pack 20 so the whole family stays dry when Florida thunderstorms roll through.",
    url: "https://www.amazon.com/s?k=rain+poncho+20+pack+disney&tag=planyourpark-20",
    icon: "🌧️",
  },
  {
    id: "stroller-fan",
    name: "Stroller Fan",
    description: "Clip-on USB rechargeable fan for your stroller. Keeps little ones comfortable.",
    url: "https://www.amazon.com/s?k=stroller+fan+usb+disney&tag=planyourpark-20",
    icon: "👶",
  },
  {
    id: "waterproof-pouch",
    name: "Waterproof Phone Pouch",
    description: "Keep your phone dry on water rides and in the rain. Floats if dropped in water.",
    url: "https://www.amazon.com/s?k=waterproof+phone+pouch+disney&tag=planyourpark-20",
    icon: "📱",
  },
  {
    id: "backpack",
    name: "Lightweight Daypack",
    description: "Compact backpack for park essentials. Folds into its own pocket for travel.",
    url: "https://www.amazon.com/s?k=lightweight+daypack+travel+disney&tag=planyourpark-20",
    icon: "🎒",
  },
];

const tips = [
  { icon: "📅", tip: "Visit mid-week (Tuesday–Thursday) for the shortest lines at Disney", highlight: false },
  { icon: "🍪", tip: "Bring your own snacks — Disney allows outside food and drinks", highlight: false },
  { icon: "🗓️", tip: "Book dining reservations 60 days in advance for popular restaurants", highlight: false },
  { icon: "💳", tip: "Use a credit card with no foreign transaction fees if buying international tickets", highlight: false },
  { icon: "🌡️", tip: "Summer visitors: rent a locker for a cooling towel and water bottle", highlight: false },
  { icon: "🎒", tip: "Order park accessories on Amazon before your trip — often 40% cheaper than park gift shops", highlight: false },
];

const disneyTickets = [
  {
    name: "Magic Kingdom",
    description: "Iconic castle, fireworks, and the most beloved rides in Walt Disney World.",
    icon: "🏰",
    link: AFFILIATE_LINKS.disney4DayParkHopper,
    linkText: "Get Magic Kingdom Tickets",
  },
  {
    name: "EPCOT",
    description: "Future World innovations and World Showcase — food, drinks, and culture from 11 countries.",
    icon: "🌍",
    link: AFFILIATE_LINKS.disney4DayParkHopper,
    linkText: "Get EPCOT Tickets",
  },
  {
    name: "Hollywood Studios",
    description: "Star Wars: Galaxy's Edge, Toy Story Land, and live-action show experiences.",
    icon: "🎬",
    link: AFFILIATE_LINKS.disney4DayParkHopper,
    linkText: "Get Hollywood Studios Tickets",
  },
  {
    name: "Animal Kingdom",
    description: "Wildlife encounters, Avatar Flight of Passage, and the Tree of Life at dusk.",
    icon: "🦁",
    link: AFFILIATE_LINKS.disney4DayParkHopper,
    linkText: "Get Animal Kingdom Tickets",
  },
];

const universalTickets = [
  {
    name: "Universal Studios Florida",
    description: "Hogwarts Express, Revenge of the Mummy, and immersive movie-themed attractions.",
    icon: "🎥",
    link: AFFILIATE_LINKS.universal2Park2Day,
    linkText: "Get Universal Studios Tickets",
  },
  {
    name: "Islands of Adventure",
    description: "Jurassic World VelociCoaster, Hagrid's Magical Creatures, and Marvel superhero lands.",
    icon: "🦖",
    link: AFFILIATE_LINKS.universal2Park2Day,
    linkText: "Get Islands of Adventure Tickets",
  },
  {
    name: "Epic Universe",
    description: "Universal's newest park — Super Nintendo World, How to Train Your Dragon, and Dark Universe.",
    icon: "🪄",
    link: AFFILIATE_LINKS.universal3Park3Day,
    linkText: "Get Epic Universe Tickets",
  },
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

      {/* Disney World Ticket Deals */}
      <section className="ticket-deals-section">
        <div className="ticket-deals-header">
          <h2>Disney World Tickets</h2>
          <p>Park-hopper and base ticket options — verified current pricing via Undercover Tourist.</p>
        </div>
        <div className="ticket-deals-grid">
          {disneyTickets.map(ticket => (
            <a
              key={ticket.name}
              href={ticket.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ticket-deal-card"
            >
              <div className="ticket-deal-icon">{ticket.icon}</div>
              <div className="ticket-deal-info">
                <h3>{ticket.name}</h3>
                <p>{ticket.description}</p>
              </div>
              <span className="ticket-deal-cta">{ticket.linkText} →</span>
            </a>
          ))}
        </div>
        <p className="ticket-deals-note">
          💳 Save up to <strong>$30 per ticket</strong> vs. gate pricing — Park Hopper upgrades available at checkout.
        </p>
      </section>

      {/* Universal Orlando Ticket Deals */}
      <section className="ticket-deals-section">
        <div className="ticket-deals-header">
          <h2>Universal Orlando Tickets</h2>
          <p>Two-park, three-park, and four-park base tickets — includes Volcano Bay at select tiers.</p>
        </div>
        <div className="ticket-deals-grid">
          {universalTickets.map(ticket => (
            <a
              key={ticket.name}
              href={ticket.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ticket-deal-card"
            >
              <div className="ticket-deal-icon">{ticket.icon}</div>
              <div className="ticket-deal-info">
                <h3>{ticket.name}</h3>
                <p>{ticket.description}</p>
              </div>
              <span className="ticket-deal-cta">{ticket.linkText} →</span>
            </a>
          ))}
        </div>
        <p className="ticket-deals-note">
          🎢 <strong>Epic Universe</strong> is Universal's newest park — book multi-day tickets early for the best availability.
        </p>
      </section>

      {/* Viator Comparison CTA */}
      <div className="viator-cta">
        <div className="viator-cta-icon">🔍</div>
        <div className="viator-cta-text">
          <strong>Compare prices across multiple sellers</strong>
          <span>Check Viator, GetYourGuide, and other marketplaces before you buy.</span>
        </div>
        <a
          href={AFFILIATE_LINKS.viator}
          target="_blank"
          rel="noopener noreferrer"
          className="viator-cta-btn"
        >
          Compare Tickets →
        </a>
      </div>

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
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="gear-card"
            >
              <div className="gear-icon">{item.icon}</div>
              <div className="gear-info">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <span className="gear-cta">Order on Amazon →</span>
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
        <NewsletterForm />
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

        /* Ticket Deals Section */
        .ticket-deals-section {
          margin-bottom: 3rem;
        }

        .ticket-deals-header {
          margin-bottom: 1.25rem;
        }

        .ticket-deals-header h2 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.375rem;
        }

        .ticket-deals-header p {
          font-size: 0.9375rem;
          color: var(--text-medium);
        }

        .ticket-deals-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .ticket-deal-card {
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

        .ticket-deal-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .ticket-deal-icon {
          font-size: 2rem;
        }

        .ticket-deal-info h3 {
          font-family: var(--font-heading);
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.375rem;
        }

        .ticket-deal-info p {
          font-size: 0.8125rem;
          color: var(--text-medium);
          line-height: 1.5;
          margin: 0;
        }

        .ticket-deal-cta {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--primary);
          margin-top: auto;
        }

        .ticket-deals-note {
          margin-top: 0.875rem;
          font-size: 0.875rem;
          color: var(--text-medium);
          text-align: center;
          background: var(--bg-light);
          border-radius: 8px;
          padding: 0.75rem 1rem;
        }

        /* Viator CTA */
        .viator-cta {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #F0F4FF;
          border: 1px solid #DDE6FF;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          margin-bottom: 3rem;
        }

        .viator-cta-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .viator-cta-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .viator-cta-text strong {
          font-size: 0.9375rem;
          color: var(--text-dark);
        }

        .viator-cta-text span {
          font-size: 0.8125rem;
          color: var(--text-medium);
        }

        .viator-cta-btn {
          background: #4B63FF;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 0.625rem 1.125rem;
          border-radius: 8px;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.15s;
          flex-shrink: 0;
        }

        .viator-cta-btn:hover {
          background: #3A52CC;
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
          .ticket-deals-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .viator-cta {
            flex-direction: column;
            text-align: center;
          }
          .viator-cta-btn {
            width: 100%;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .ticket-deals-grid {
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
