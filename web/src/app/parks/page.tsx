import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import ParkCard from "@/components/ParkCard";
import { createPageMetadata } from "@/lib/seo";
import { AFFILIATE_LINKS } from "@/config/affiliate-links";

export const metadata: Metadata = createPageMetadata({
  title: "All Parks in Orlando for Families (2026) — Disney, Universal & More",
  description:
    "Full list of Orlando theme parks for families: Disney World, Universal (Epic Universe), SeaWorld, and LEGOLAND. Compare by kid age, height, thrills, and tickets.",
  path: "/parks",
  keywords: [
    "all parks in orlando",
    "all orlando theme parks",
    "orlando parks",
    "best orlando park for kids",
    "disney vs universal with kids",
    "epic universe families",
  ],
});

async function getAllParks() {
  return sanityClient.fetch(`
    *[_type == "park"] | order(name asc) {
      _id,
      name,
      slug,
      description,
      image { asset-> { url }, alt }
    }
  `);
}

export default async function ParksPage() {
  const parks = await getAllParks();

  return (
    <div className="parks-page-container">
      <header className="parks-header">
        <h1>All Parks in Orlando — Which One Fits Your Kids?</h1>
        <p className="parks-subtitle">
          Looking for all parks in Orlando in one place? Use this hub to compare Disney World,
          Universal Orlando (including Epic Universe), SeaWorld, and LEGOLAND — then jump into ride
          lists filtered by height, thrills, and accessibility.
        </p>
      </header>

      <section className="parks-decision" aria-label="Quick family picks">
        <h2>Quick picks for families</h2>
        <ul>
          <li>
            <strong>Preschoolers / under ~40&quot;:</strong> Magic Kingdom, LEGOLAND, parts of Animal Kingdom
            — start with our{" "}
            <Link href="/blog/best-magic-kingdom-rides-kids-under-40-inches/">
              Magic Kingdom rides under 40 inches
            </Link>
            .
          </li>
          <li>
            <strong>Mixed ages / first Universal trip:</strong> Islands of Adventure + Universal Studios;
            check{" "}
            <Link href="/blog/universal-orlando-height-requirements/">
              Universal height requirements
            </Link>{" "}
            before you buy.
          </li>
          <li>
            <strong>Big thrills + newest lands:</strong>{" "}
            <Link href="/parks/epic-universe/">Epic Universe</Link> — see our{" "}
            <Link href="/blog/epic-universe-rides-ranked-guide/">rides ranked</Link> and{" "}
            <Link href="/blog/epic-universe-1-day-plan/">1-day plan</Link>.
          </li>
          <li>
            <strong>Not sure yet?</strong> Browse all rides with filters on the{" "}
            <Link href="/rides/">ride finder</Link> (height, thrill, accessibility).
          </li>
        </ul>
        <p className="parks-cta-row">
          <a className="parks-cta" href={AFFILIATE_LINKS.ucDealsPage} rel="nofollow sponsored">
            Compare Orlando ticket deals
          </a>
          <Link className="parks-cta secondary" href="/rides/">
            Open ride height filters
          </Link>
        </p>
        <p className="parks-affiliate-note">
          Ticket links may be affiliate partnerships. We may earn a commission at no extra cost to you.{" "}
          <Link href="/affiliate-disclosure/">Disclosure</Link>
        </p>
      </section>

      <h2 className="parks-grid-heading">Every major Orlando park</h2>
      <div className="parks-grid-full">
        {parks.map((park: any) => (
          <ParkCard key={park._id} park={park} />
        ))}
      </div>

      <section className="parks-faq">
        <h2>How many theme parks are in Orlando?</h2>
        <p>
          Families usually plan around four Walt Disney World parks, three Universal Orlando parks
          (Universal Studios Florida, Islands of Adventure, and Epic Universe), plus SeaWorld Orlando
          and LEGOLAND Florida. That&apos;s the core set most multi-day trips choose from — and what we
          cover below.
        </p>
        <h2>Disney or Universal with kids?</h2>
        <p>
          Disney (especially Magic Kingdom) is usually easier with younger kids and classic characters.
          Universal wins for older kids who want coasters, Super Nintendo World, and Epic Universe lands
          — if they meet height requirements. Many families do both on longer trips.
        </p>
      </section>

      <style>{`
        .parks-page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }

        .parks-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .parks-header h1 {
          font-family: var(--font-heading);
          font-size: clamp(1.75rem, 5vw, 2.5rem);
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 1rem;
        }

        .parks-subtitle {
          font-size: 1.125rem;
          color: var(--text-medium);
          max-width: 720px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .parks-decision {
          background: var(--bg-light);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem 1.75rem;
          margin-bottom: 2.5rem;
        }

        .parks-decision h2,
        .parks-grid-heading,
        .parks-faq h2 {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-dark);
          margin: 0 0 0.75rem;
        }

        .parks-decision ul {
          margin: 0 0 1.25rem;
          padding-left: 1.2rem;
          color: var(--text-medium);
          line-height: 1.7;
        }

        .parks-decision li {
          margin-bottom: 0.65rem;
        }

        .parks-decision a,
        .parks-faq a {
          color: var(--primary);
          font-weight: 600;
        }

        .parks-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin: 0 0 0.75rem;
        }

        .parks-cta {
          display: inline-block;
          background: var(--primary);
          color: #fff !important;
          text-decoration: none;
          font-weight: 700;
          padding: 0.7rem 1.1rem;
          border-radius: 10px;
        }

        .parks-cta.secondary {
          background: transparent;
          color: var(--primary) !important;
          border: 2px solid var(--primary);
        }

        .parks-affiliate-note {
          font-size: 0.85rem;
          color: var(--text-medium);
          margin: 0;
          line-height: 1.5;
        }

        .parks-grid-heading {
          margin-bottom: 1.25rem;
        }

        .parks-grid-full {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .parks-faq p {
          color: var(--text-medium);
          line-height: 1.7;
          margin: 0 0 1.5rem;
          max-width: 800px;
        }

        @media (max-width: 900px) {
          .parks-grid-full { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .parks-page-container { padding: 1.5rem 1rem 3rem; }
          .parks-grid-full { grid-template-columns: 1fr; }
          .parks-decision { padding: 1.15rem 1rem; }
        }
      `}</style>
    </div>
  );
}
