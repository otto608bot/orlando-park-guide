import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity";
import ParkCard from "@/components/ParkCard";

export const metadata: Metadata = {
  title: "All Orlando Parks",
  description: "Explore all Orlando theme parks - Disney World, Universal Orlando, SeaWorld, LEGOLAND, and more.",
};

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
        <h1>Orlando Theme Parks</h1>
        <p className="parks-subtitle">
          From Disney magic to Universal thrills, discover all the parks that make Orlando the world's vacation capital.
        </p>
      </header>
      
      <div className="parks-grid-full">
        {parks.map((park: any) => (
          <ParkCard key={park._id} park={park} />
        ))}
      </div>
      
      <style>{`
        .parks-page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }
        
        .parks-header {
          text-align: center;
          margin-bottom: 3rem;
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
          max-width: 600px;
          margin: 0 auto;
        }
        
        .parks-grid-full {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        @media (max-width: 640px) {
          .parks-page-container { padding: 1.5rem 1rem 3rem; }
          .parks-grid-full { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
