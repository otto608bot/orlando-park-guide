import type { Metadata } from "next";
export const revalidate = 60;
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import RidesClient from "./RidesClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Orlando Ride Finder by Height — Kids & Families (2026)",
  description:
    "Filter every major Orlando theme park ride by your kid’s height, thrill level, and park. Shareable presets for under 40\", 44\", 48\", and calm rides — Disney, Universal, Epic Universe & more.",
  path: "/rides",
  keywords: [
    "orlando rides by height",
    "theme park height requirements kids",
    "which rides can my kid ride orlando",
    "disney height filter",
    "universal height filter",
    "rides under 40 inches",
  ],
});

/** Shareable filter deep-links (FiltersContext reads ?height=&parks=&calm=). */
const HEIGHT_PRESETS = [
  {
    href: "/rides/?height=40",
    label: 'Under ~40"',
    blurb: "Preschool / shorter riders",
  },
  {
    href: "/rides/?height=44",
    label: '44"',
    blurb: "Many family coasters open",
  },
  {
    href: "/rides/?height=48",
    label: '48"',
    blurb: "Most big thrills unlock",
  },
  {
    href: "/rides/?height=52",
    label: '52"+',
    blurb: "Nearly full park access",
  },
  {
    href: "/rides/?calm=true",
    label: "Calm rides",
    blurb: "Gentler experiences",
  },
  {
    href: "/rides/?height=40&parks=Magic%20Kingdom",
    label: "MK + under 40\"",
    blurb: "Magic Kingdom short-rider start",
  },
] as const;

async function getAllRides() {
  return sanityClient.fetch(`
    *[_type == "ride"] | order(park asc, thrillLevel desc, name asc) {
      _id,
      name,
      park,
      slug,
      description,
      heightRequirement,
      thrillLevel,
      rideType,
      accessibility,
      image { asset-> { url }, alt },
      isClosed,
      closureNote
    }
  `);
}

export default async function RidesPage() {
  const rides = await getAllRides();

  return (
    <div className="rides-page-wrapper">
      <header className="rides-header">
        <h1>Orlando Ride Finder — Filter by Your Kid&apos;s Height</h1>
        <p className="rides-subtitle">
          {rides.length} rides across Disney World, Universal Orlando (including Epic Universe),
          SeaWorld, and LEGOLAND. Set height once, then see what your kids can actually ride —
          share the filtered link with your group.
        </p>
      </header>

      <section className="rides-seo-panel" aria-label="Quick height filters">
        <h2>Quick height presets (shareable)</h2>
        <p className="rides-seo-lead">
          Tap a preset to open the finder with filters applied. URLs stay in the address bar so you
          can text them to a co-planner or pin them for trip day.
        </p>
        <ul className="rides-preset-grid">
          {HEIGHT_PRESETS.map((preset) => (
            <li key={preset.href}>
              <Link href={preset.href} className="rides-preset-card">
                <span className="rides-preset-label">{preset.label}</span>
                <span className="rides-preset-blurb">{preset.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="rides-guide-links">
          Prefer a guided list? See{" "}
          <Link href="/blog/best-magic-kingdom-rides-kids-under-40-inches/">
            Magic Kingdom rides under 40 inches
          </Link>
          ,{" "}
          <Link href="/blog/universal-orlando-height-requirements/">
            Universal height requirements
          </Link>
          , or our{" "}
          <Link href="/blog/epic-universe-rides-ranked-guide/">Epic Universe rides ranked</Link>{" "}
          guide. Comparing parks first? Start at the{" "}
          <Link href="/parks/">Orlando parks hub</Link>.
        </p>
      </section>

      <RidesClient rides={rides} />

      <style>{`
        .rides-page-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        .rides-header {
          text-align: center;
          padding: 2rem 1.5rem 0.75rem;
        }

        .rides-header h1 {
          font-family: var(--font-heading);
          font-size: clamp(1.75rem, 5vw, 2.5rem);
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 1rem;
        }

        .rides-subtitle {
          font-size: 1.0625rem;
          color: var(--text-medium);
          max-width: 720px;
          margin: 0 auto;
          line-height: 1.65;
        }

        .rides-seo-panel {
          max-width: 1200px;
          margin: 0 auto 0.5rem;
          padding: 0 1.5rem 0.5rem;
        }

        .rides-seo-panel h2 {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-dark);
          margin: 0 0 0.5rem;
        }

        .rides-seo-lead {
          color: var(--text-medium);
          font-size: 0.98rem;
          line-height: 1.6;
          margin: 0 0 1rem;
          max-width: 760px;
        }

        .rides-preset-grid {
          list-style: none;
          margin: 0 0 1rem;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.75rem;
        }

        .rides-preset-card {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          text-decoration: none;
          border: 1px solid var(--border);
          background: var(--bg-light, #fff7ed);
          border-radius: 12px;
          padding: 0.85rem 1rem;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .rides-preset-card:hover {
          border-color: var(--primary);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
        }

        .rides-preset-label {
          font-weight: 800;
          color: var(--text-dark);
          font-size: 1rem;
        }

        .rides-preset-blurb {
          font-size: 0.875rem;
          color: var(--text-medium);
          line-height: 1.4;
        }

        .rides-guide-links {
          color: var(--text-medium);
          font-size: 0.95rem;
          line-height: 1.65;
          margin: 0 0 0.5rem;
          max-width: 860px;
        }

        .rides-guide-links a {
          color: var(--primary);
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .rides-preset-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 520px) {
          .rides-preset-grid {
            grid-template-columns: 1fr;
          }
          .rides-seo-panel {
            padding: 0 1rem 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}
