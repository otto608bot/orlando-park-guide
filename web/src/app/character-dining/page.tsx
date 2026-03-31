import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity";
import CharacterDiningClient from "./CharacterDiningClient";

export const metadata: Metadata = {
  title: "Character Dining",
  description: "Find the best character dining experiences at Disney World and Universal Orlando.",
};

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
      `}</style>
    </div>
  );
}
