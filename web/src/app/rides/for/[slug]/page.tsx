import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getParkTicketLink } from "@/config/affiliate-links";
import { filterRides, groupRidesByPark, PARK_SLUG_MAP } from "@/lib/ride-filter";
import {
  getRidePresetBySlug,
  heightLandingGuides,
  relatedRidePresets,
  RIDE_HEIGHT_PRESETS,
  type RidePreset,
} from "@/lib/ride-presets";
import { sanityClient } from "@/lib/sanity";
import type { Ride } from "@/lib/sanity-types";
import { createPageMetadata, getRidePresetLandingJsonLd } from "@/lib/seo";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getAllRides(): Promise<Ride[]> {
  return sanityClient.fetch(`
    *[_type == "ride"] | order(park asc, name asc) {
      _id,
      name,
      park,
      slug,
      description,
      heightRequirement,
      thrillLevel,
      rideType,
      accessibility,
      isClosed,
      closureNote
    }
  `);
}

function filterSummary(preset: RidePreset): string {
  const bits: string[] = [];
  if (preset.height) bits.push(`height ≤ ~${preset.height}" (or no minimum)`);
  if (preset.parks?.length) bits.push(preset.parks.join(", "));
  if (preset.calm) bits.push("calm / gentler tags");
  return bits.join(" · ") || "all rides";
}

export async function generateStaticParams() {
  return RIDE_HEIGHT_PRESETS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const preset = getRidePresetBySlug(slug);
  if (!preset) {
    return createPageMetadata({
      title: "Ride height preset",
      description: "Orlando ride finder height preset for families.",
      path: `/rides/for/${slug}`,
    });
  }
  return createPageMetadata({
    title: preset.seoTitle,
    description: preset.seoDescription,
    path: preset.seoPath,
    keywords: [
      "orlando rides by height",
      preset.label,
      ...(preset.parks || []),
      "kids height requirements",
      "theme park ride filter",
    ],
  });
}

export default async function RidePresetLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const preset = getRidePresetBySlug(slug);
  if (!preset) notFound();

  const allRides = await getAllRides();
  const matched = filterRides(allRides, {
    height: preset.height,
    parks: preset.parks ? [...preset.parks] : undefined,
    calm: preset.calm,
  }).filter((r) => !r.isClosed);

  const grouped = groupRidesByPark(matched);
  const primaryPark = preset.parks?.[0];
  const ticketHref = primaryPark
    ? getParkTicketLink(primaryPark)
    : "/deals/";
  const ticketIsExternal = ticketHref.startsWith("http");

  const jsonLd = getRidePresetLandingJsonLd({
    path: preset.seoPath,
    title: preset.seoTitle,
    description: preset.seoDescription,
    rides: matched.map((r) => ({ name: r.name, park: r.park })),
    finderHref: preset.href,
    parkLabel: primaryPark,
  });

  const related = relatedRidePresets(preset, 10);
  const guides = heightLandingGuides(preset);

  return (
    <div className="preset-landing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="preset-header">
        <p className="preset-kicker">
          <Link href="/rides/">Ride finder</Link>
          <span aria-hidden="true"> / </span>
          <span>{preset.label}</span>
        </p>
        <h1>{preset.seoTitle}</h1>
        <p className="preset-lead">{preset.seoDescription}</p>
        <p className="preset-meta">
          <strong>{matched.length}</strong> rides match this filter
          <span aria-hidden="true"> · </span>
          {filterSummary(preset)}
        </p>
        <div className="preset-actions">
          <Link href={preset.href} className="preset-btn preset-btn-primary">
            Open interactive filter
          </Link>
          {ticketIsExternal ? (
            <a
              href={ticketHref}
              className="preset-btn preset-btn-secondary"
              target="_blank"
              rel="noopener noreferrer sponsored"
            >
              Compare tickets
            </a>
          ) : (
            <Link href={ticketHref} className="preset-btn preset-btn-secondary">
              Family ticket deals
            </Link>
          )}
          <Link href="/parks/" className="preset-btn preset-btn-ghost">
            Compare parks
          </Link>
        </div>
        <p className="preset-disclosure">
          Ticket links may be affiliate partners. See our{" "}
          <Link href="/affiliate-disclosure/">affiliate disclosure</Link>. Height filters help you
          plan from published minimums — parks enforce current posted rules on ride day.
        </p>
      </header>

      <section className="preset-section" aria-label="Matching rides">
        <h2>Rides that match</h2>
        {matched.length === 0 ? (
          <p className="preset-empty">
            No open rides matched this filter in our database right now. Try the{" "}
            <Link href={preset.href}>interactive finder</Link> or a broader preset on the{" "}
            <Link href="/rides/">rides hub</Link>.
          </p>
        ) : (
          grouped.map(({ park, rides }) => {
            const parkSlug = PARK_SLUG_MAP[park];
            return (
              <div key={park} className="preset-park-block">
                <h3>
                  {parkSlug ? (
                    <Link href={`/parks/${parkSlug}/`}>{park}</Link>
                  ) : (
                    park
                  )}{" "}
                  <span className="preset-count">({rides.length})</span>
                </h3>
                <ul className="preset-ride-list">
                  {rides.map((ride) => (
                    <li key={ride._id}>
                      <span className="preset-ride-name">{ride.name}</span>
                      <span className="preset-ride-meta">
                        {ride.heightRequirement
                          ? `${ride.heightRequirement}" min`
                          : "No min"}
                        {ride.rideType ? ` · ${ride.rideType}` : ""}
                        {ride.thrillLevel ? ` · thrill ${ride.thrillLevel}/5` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        )}
      </section>

      <section className="preset-section preset-mid-cta" aria-label="Tickets after heights">
        <h2>Heights checked — ready for tickets?</h2>
        <p>
          Once you know who can ride what{primaryPark ? ` at ${primaryPark}` : ""}, compare family
          ticket options. Partner links may earn us a commission at no extra cost to you.
        </p>
        <div className="preset-actions">
          {ticketIsExternal ? (
            <a
              href={ticketHref}
              className="preset-btn preset-btn-primary"
              target="_blank"
              rel="noopener noreferrer sponsored"
            >
              Compare {primaryPark ? primaryPark : "park"} tickets
            </a>
          ) : (
            <Link href="/deals/" className="preset-btn preset-btn-primary">
              Compare family ticket deals
            </Link>
          )}
          <Link href="/deals/" className="preset-btn preset-btn-secondary">
            All Orlando ticket deals
          </Link>
          {primaryPark && PARK_SLUG_MAP[primaryPark] ? (
            <Link href={`/parks/${PARK_SLUG_MAP[primaryPark]}/`} className="preset-btn preset-btn-ghost">
              {primaryPark} park guide
            </Link>
          ) : (
            <Link href="/parks/" className="preset-btn preset-btn-ghost">
              Compare parks
            </Link>
          )}
        </div>
      </section>

      <section className="preset-section preset-faq" aria-label="Height list FAQ">
        <h2>FAQ</h2>
        <h3>How do these height lists work?</h3>
        <p>
          We filter published ride height minimums from our Orlando ride database. A ride appears
          when your child meets or exceeds the listed minimum (or the ride has no minimum). Always
          recheck official park signs on trip day.
        </p>
        <h3>Can I change the height or park?</h3>
        <p>
          Yes. Open the{" "}
          <Link href={preset.href}>interactive ride finder</Link> to adjust height, park, and calm
          filters, then share the filtered link with your group.
        </p>
        <h3>What if my kids are different heights?</h3>
        <p>
          Run this list once per child, or open the interactive finder and save a filtered link for
          each height. Many families start with the shortest rider, then add thrills the taller kids
          unlock.
        </p>
        <h3>When should we buy tickets?</h3>
        <p>
          After you know who can ride what
          {primaryPark ? ` at ${primaryPark}` : " across Orlando parks"}, compare family ticket
          options on our{" "}
          <Link href="/deals/">deals page</Link> or park pages — ticket links may be affiliate
          partners.
        </p>
      </section>

      {guides.length > 0 ? (
        <section className="preset-section" aria-label="Next planning steps">
          <h2>Next planning steps</h2>
          <ul className="preset-guides">
            {guides.map((g) => (
              <li key={g.href}>
                <Link href={g.href}>
                  <strong>{g.label}</strong>
                  <span>{g.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="preset-section" aria-label="More height presets">
        <h2>More shareable height presets</h2>
        <ul className="preset-related">
          {related.map((p) => (
            <li key={p.slug}>
              <Link href={p.seoPath}>
                <strong>{p.label}</strong>
                <span>{p.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="preset-more">
          Full interactive grid: <Link href="/rides/">Orlando ride finder by height</Link>
        </p>
      </section>

      <style>{`
        .preset-landing {
          max-width: 920px;
          margin: 0 auto;
          padding: 2rem 1.25rem 4rem;
        }
        .preset-kicker {
          font-size: 0.9rem;
          color: var(--text-medium, #64748b);
          margin: 0 0 0.75rem;
        }
        .preset-kicker a { color: var(--primary, #f37021); }
        .preset-header h1 {
          font-family: var(--font-heading);
          font-size: clamp(1.6rem, 4vw, 2.15rem);
          font-weight: 800;
          color: var(--text-dark, #0f172a);
          margin: 0 0 0.75rem;
          line-height: 1.2;
        }
        .preset-lead {
          font-size: 1.05rem;
          line-height: 1.65;
          color: var(--text-medium, #475569);
          margin: 0 0 0.75rem;
        }
        .preset-meta {
          font-size: 0.95rem;
          color: var(--text-dark, #0f172a);
          margin: 0 0 1.1rem;
        }
        .preset-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-bottom: 0.85rem;
        }
        .preset-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.65rem 1rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          border: 1px solid transparent;
        }
        .preset-btn-primary {
          background: var(--primary, #f37021);
          color: #fff;
        }
        .preset-btn-secondary {
          background: #fff7ed;
          color: var(--text-dark, #0f172a);
          border-color: #fed7aa;
        }
        .preset-btn-ghost {
          background: #fff;
          color: var(--text-dark, #0f172a);
          border-color: var(--border, #e2e8f0);
        }
        .preset-disclosure {
          font-size: 0.82rem;
          line-height: 1.5;
          color: var(--text-medium, #64748b);
          margin: 0 0 1.75rem;
        }
        .preset-disclosure a { color: var(--primary, #f37021); }
        .preset-section {
          margin-bottom: 2rem;
        }
        .preset-section h2 {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0 0 0.85rem;
          color: var(--text-dark, #0f172a);
        }
        .preset-mid-cta {
          padding: 1.15rem 1.1rem;
          border-radius: 14px;
          border: 1px solid #fed7aa;
          background: linear-gradient(180deg, #fff7ed 0%, #fff 100%);
        }
        .preset-mid-cta p {
          margin: 0 0 0.85rem;
          color: var(--text-medium, #475569);
          line-height: 1.6;
        }
        .preset-park-block {
          margin-bottom: 1.25rem;
          padding: 1rem 1rem 0.85rem;
          border: 1px solid var(--border, #e2e8f0);
          border-radius: 12px;
          background: #fff;
        }
        .preset-park-block h3 {
          font-size: 1.05rem;
          font-weight: 800;
          margin: 0 0 0.65rem;
        }
        .preset-park-block h3 a {
          color: var(--text-dark, #0f172a);
          text-decoration: none;
        }
        .preset-park-block h3 a:hover { color: var(--primary, #f37021); }
        .preset-count {
          font-weight: 600;
          color: var(--text-medium, #64748b);
          font-size: 0.9rem;
        }
        .preset-ride-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 0.45rem;
        }
        .preset-ride-list li {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem 0.75rem;
          justify-content: space-between;
          padding: 0.35rem 0;
          border-top: 1px solid #f1f5f9;
        }
        .preset-ride-list li:first-child { border-top: 0; }
        .preset-ride-name {
          font-weight: 600;
          color: var(--text-dark, #0f172a);
        }
        .preset-ride-meta {
          font-size: 0.85rem;
          color: var(--text-medium, #64748b);
        }
        .preset-empty {
          color: var(--text-medium, #475569);
          line-height: 1.6;
        }
        .preset-faq h3 {
          font-size: 1rem;
          font-weight: 700;
          margin: 0.85rem 0 0.35rem;
        }
        .preset-faq p {
          margin: 0;
          color: var(--text-medium, #475569);
          line-height: 1.6;
        }
        .preset-related,
        .preset-guides {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.6rem;
        }
        .preset-related a,
        .preset-guides a {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          text-decoration: none;
          border: 1px solid var(--border, #e2e8f0);
          border-radius: 10px;
          padding: 0.75rem 0.85rem;
          background: #fff7ed;
        }
        .preset-guides a {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }
        .preset-related strong,
        .preset-guides strong {
          color: var(--text-dark, #0f172a);
          font-size: 0.92rem;
        }
        .preset-related span,
        .preset-guides span {
          color: var(--text-medium, #64748b);
          font-size: 0.8rem;
          line-height: 1.35;
        }
        .preset-more {
          margin: 1rem 0 0;
          font-size: 0.92rem;
          line-height: 1.55;
          color: var(--text-medium, #475569);
        }
        .preset-more a { color: var(--primary, #f37021); }
      `}</style>
    </div>
  );
}
