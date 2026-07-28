import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import CharacterDiningClient from "./CharacterDiningClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Disney & Universal Character Dining with Kids",
  description:
    "Compare character dining at Disney World and Universal Orlando — meals, parks, and kid-friendly meet-and-greet options in one list.",
  path: "/character-dining",
});

async function getAllCharacterDining() {
  return sanityClient.fetch(`
    *[_type == "characterDining"] | order(park asc, name asc) {
      _id,
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

  return (
    <div className="dining-page">
      <header className="dining-header">
        <h1>Character Dining</h1>
        <p className="dining-subtitle">
          Meet your favorite Disney and Universal characters over delicious meals.
        </p>
      </header>
      
      <CharacterDiningClient diningList={diningList} />

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
          max-width: 600px;
          margin: 0 auto;
        }
        .dining-next-steps {
          max-width: 1200px;
          margin: 1rem auto 3rem;
          padding: 1.25rem 1.5rem;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: var(--bg-light, #fff7ed);
        }
        .dining-next-steps h2 { font-family: var(--font-heading); font-size: 1.3rem; margin: 0 0 0.5rem; color: var(--text-dark); }
        .dining-next-steps p { color: var(--text-medium); line-height: 1.6; margin: 0; }
        .dining-next-steps-links { display: flex; flex-wrap: wrap; gap: 0.65rem; margin: 1rem 0; }
        .dining-next-steps-links a { color: var(--primary); font-weight: 700; border: 1px solid var(--border); border-radius: 999px; background: white; padding: 0.55rem 0.75rem; text-decoration: none; }
        .dining-disclosure { font-size: 0.82rem; }
        .dining-disclosure a { color: var(--primary); }
        @media (max-width: 640px) { .dining-next-steps { margin: 1rem 1rem 2rem; padding: 1.1rem; } }
      `}</style>
    </div>
  );
}
