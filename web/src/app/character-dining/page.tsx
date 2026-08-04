import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import type { CharacterDining } from "@/lib/sanity-types";
import CharacterDiningClient from "./CharacterDiningClient";
import { createPageMetadata, getCharacterDiningJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Disney & Universal Character Dining with Kids",
  description:
    "Compare character dining at Disney World and Universal Orlando — meals, parks, and kid-friendly meet-and-greet options in one list.",
  path: "/character-dining",
});

async function getAllCharacterDining(): Promise<CharacterDining[]> {
  return sanityClient.fetch(`
    *[_type == "characterDining"] | order(park asc, name asc) {
      _id,
      _type,
      name,
      park,
      characters,
      mealType,
      priceRange,
      description
    }
  `);
}

export default async function CharacterDiningPage() {
  const diningList = await getAllCharacterDining();
  const diningLd = getCharacterDiningJsonLd(diningList || []);

  return (
    <div className="dining-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(diningLd) }} />

      <header className="dining-header">
        <h1>Character Dining with Kids</h1>
        <p className="dining-subtitle">
          Meet your favorite Disney and Universal characters over meals — then match the reservation to rides your kids can actually enjoy.
        </p>
      </header>

      <CharacterDiningClient diningList={diningList} />

      <section className="dining-faq" aria-label="Character dining FAQ">
        <h2>Quick answers before you book</h2>
        <div className="dining-faq-grid">
          <div>
            <h3>Is character dining worth it with kids?</h3>
            <p>
              Often yes for younger kids who want guaranteed character time without standing in a separate meet-and-greet
              line. Book early, match the meal to your park day, and leave buffer time for height-restricted rides after
              breakfast or dinner.
            </p>
          </div>
          <div>
            <h3>Should we book character dining before tickets?</h3>
            <p>
              Decide which parks fit your kids first (height filters help), then book dining reservations for those park
              days. Ticket deals and the ride finder are useful before you lock a pricey character meal.
            </p>
          </div>
        </div>
      </section>

      <section className="dining-next-steps" aria-label="Plan the rest of your park day">
        <h2>Plan the rest of your park day</h2>
        <p>
          A character meal is only one piece of the plan. Check what your child can ride before
          booking, then compare ticket options when your park days are set.
        </p>
        <div className="dining-next-steps-links">
          <Link href="/rides/?height=40">Find rides for your child&apos;s height</Link>
          <Link href="/parks/">Compare Orlando parks for families</Link>
          <Link href="/deals/">Compare family ticket deals</Link>
          <Link href="/blog/best-magic-kingdom-rides-kids-under-40-inches/">MK rides under 40″</Link>
        </div>
        <p className="dining-disclosure">
          Some ticket links may be affiliate links, which may earn Plan Your Park a commission at
          no extra cost to you. <Link href="/affiliate-disclosure/">Learn more</Link>.
        </p>
      </section>

      <style>{`
        .dining-page { max-width: 1200px; margin: 0 auto; }
        .dining-header {
          text-align: center;
          padding: 2rem 1.5rem 1rem;
        }
        .dining-header h1 {
          font-family: var(--font-heading);
          font-size: clamp(1.75rem, 5vw, 2.5rem);
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 1rem;
        }
        .dining-subtitle {
          font-size: 1.0625rem;
          color: var(--text-medium);
          max-width: 640px;
          margin: 0 auto;
          line-height: 1.65;
        }
        .dining-faq,
        .dining-next-steps {
          max-width: 1200px;
          margin: 1rem auto 2rem;
          padding: 1.25rem 1.5rem;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: var(--bg-light, #fff7ed);
        }
        .dining-faq h2,
        .dining-next-steps h2 {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          margin: 0 0 0.75rem;
          color: var(--text-dark);
        }
        .dining-faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1rem;
        }
        .dining-faq-grid h3 {
          font-size: 1rem;
          margin: 0 0 0.35rem;
          color: var(--text-dark);
        }
        .dining-faq-grid p,
        .dining-next-steps p {
          color: var(--text-medium);
          line-height: 1.6;
          margin: 0;
        }
        .dining-next-steps-links { display: flex; flex-wrap: wrap; gap: 0.65rem; margin: 1rem 0; }
        .dining-next-steps-links a {
          color: var(--primary);
          font-weight: 700;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: white;
          padding: 0.55rem 0.75rem;
          text-decoration: none;
        }
        .dining-disclosure { font-size: 0.82rem; }
        .dining-disclosure a { color: var(--primary); }
        @media (max-width: 640px) {
          .dining-faq,
          .dining-next-steps { margin: 1rem 1rem 2rem; padding: 1.1rem; }
        }
      `}</style>
    </div>
  );
}
