import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import ParkCard from "@/components/ParkCard";
import ParksDecisionTracker from "@/components/ParksDecisionTracker";
import { createPageMetadata, getParksHubJsonLd } from "@/lib/seo";
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
  const parksJsonLd = getParksHubJsonLd(parks || []);

  return (
    <div className="parks-page-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(parksJsonLd) }}
      />
      <header className="parks-header">
        <h1>All Parks in Orlando — Which One Fits Your Kids?</h1>
        <p className="parks-subtitle">
          Looking for all parks in Orlando in one place? Use this hub to compare Disney World,
          Universal Orlando (including Epic Universe), SeaWorld, and LEGOLAND — then jump into ride
          lists filtered by height, thrills, and accessibility.
        </p>
      </header>

      <section className="parks-decision" aria-label="Quick family picks">
        <ParksDecisionTracker />
        <h2>Start with what your kid can ride</h2>
        <p className="parks-decision-intro">
          The park cards below let you compare every option. If height is the decision-maker, start here
          and open the exact ride list first.
        </p>
        <div className="parks-decision-choices" aria-label="Choose a family ride starting point">
          <Link href="/rides/for/under-40/" className="parks-decision-choice" data-decision-cta data-decision-choice="under-40">
            <strong>Under ~40&quot;</strong>
            <span>Short-rider options across every park</span>
          </Link>
          <Link href="/rides/for/height-44/" className="parks-decision-choice" data-decision-cta data-decision-choice="height-44">
            <strong>Around 44&quot;</strong>
            <span>When more family coasters open</span>
          </Link>
          <Link href="/rides/for/height-52/" className="parks-decision-choice" data-decision-cta data-decision-choice="height-52">
            <strong>52&quot;+</strong>
            <span>Nearly full access to major rides</span>
          </Link>
          <Link href="/rides/for/calm/" className="parks-decision-choice" data-decision-cta data-decision-choice="calm">
            <strong>Calm rides</strong>
            <span>Gentler choices for sensitive kids</span>
          </Link>
        </div>
        <h3>Quick picks by trip type</h3>
        <ul>
          <li>
            <strong>Preschoolers / under ~40&quot;:</strong> Magic Kingdom, LEGOLAND, parts of Animal Kingdom
            — start with our{" "}
            <Link href="/rides/for/disney-world-under-40/">Disney World under ~40&quot; list</Link>{" "}
            or the{" "}
            <Link href="/blog/best-magic-kingdom-rides-kids-under-40-inches/">
              Magic Kingdom rides under 40 inches
            </Link>{" "}
            guide.
          </li>
          <li>
            <strong>Mixed ages / first Universal trip:</strong> Islands of Adventure + Universal Studios +
            Epic — check{" "}
            <Link href="/rides/for/universal-orlando-under-40/">
              Universal Orlando under ~40&quot;
            </Link>{" "}
            and{" "}
            <Link href="/blog/universal-orlando-height-requirements/">
              Universal height requirements
            </Link>{" "}
            before you buy.
          </li>
          <li>
            <strong>Big thrills + newest lands:</strong>{" "}
            <Link href="/parks/epic-universe/">Epic Universe</Link> — see our{" "}
            <Link href="/blog/epic-universe-rides-ranked-guide/">rides ranked</Link> and{" "}
            <Link href="/blog/epic-universe-1-day-plan/">1-day plan</Link>. Taller kids (~52&quot;+)?
            Open{" "}
            <Link href="/rides/for/disney-world-52/">Disney World 52&quot;+</Link> or{" "}
            <Link href="/rides/for/universal-orlando-52/">Universal Orlando 52&quot;+</Link>.
          </li>
          <li>
            <strong>Not sure yet?</strong> Browse all rides with filters on the{" "}
            <Link href="/rides/">ride finder</Link> (height, thrill, accessibility), or jump to{" "}
            <Link href="/rides/for/under-40/">rides under ~40&quot;</Link>.
          </li>
        </ul>
        <p className="parks-cta-row">
          <a className="parks-cta" href={AFFILIATE_LINKS.ucDealsPage} rel="nofollow sponsored">
            Compare Orlando ticket deals
          </a>
          <Link className="parks-cta secondary" href="/rides/for/under-40/">
            Open rides under ~40&quot;
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
        <h2>How do I know which rides my kids can ride?</h2>
        <p>
          Start with our crawlable{" "}
          <Link href="/rides/for/under-40/">rides under ~40&quot; list</Link>, multi-park{" "}
          <Link href="/rides/for/disney-world-under-40/">Disney World under ~40&quot;</Link> or{" "}
          <Link href="/rides/for/universal-orlando-under-40/">
            Universal Orlando under ~40&quot;
          </Link>
          , then narrow by single park or open the interactive{" "}
          <Link href="/rides/">ride finder</Link>. Share the URL with your group before you buy tickets
          so nobody walks into a line a kid cannot ride.
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

        .parks-decision h3 {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-dark);
          margin: 1.5rem 0 0.75rem;
        }

        .parks-decision-intro {
          color: var(--text-medium);
          line-height: 1.55;
          margin: 0 0 1rem;
        }

        .parks-decision-choices {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.65rem;
        }

        .parks-decision-choice {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-height: 88px;
          padding: 0.85rem;
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text-dark) !important;
          text-decoration: none;
        }

        .parks-decision-choice:hover,
        .parks-decision-choice:focus-visible {
          border-color: var(--primary);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .parks-decision-choice strong {
          color: var(--primary);
          font-size: 1rem;
        }

        .parks-decision-choice span {
          color: var(--text-medium);
          font-size: 0.82rem;
          font-weight: 400;
          line-height: 1.35;
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
          .parks-decision-choices { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .parks-decision-choice { min-height: 100px; padding: 0.8rem; }
        }
      `}</style>
    </div>
  );
}
