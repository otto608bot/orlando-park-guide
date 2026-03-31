import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity";
import RidesClient from "./RidesClient";

export const metadata: Metadata = {
  title: "All Rides & Attractions",
  description: "Browse all Orlando theme park rides with filters for thrill level, height requirements, and more.",
};

async function getAllRides() {
  return sanityClient.fetch(`
    *[_type == "ride"] | order(park asc, thrillLevel desc, name asc) {
      _id,
      name,
      park,
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

export default async function RidesPage() {
  const rides = await getAllRides();

  return (
    <div className="rides-page-wrapper">
      <header className="rides-header">
        <h1>Rides & Attractions</h1>
        <p className="rides-subtitle">
          {rides.length} rides across all Orlando theme parks. Filter by park, thrill level, height requirement, and more.
        </p>
      </header>
      
      <RidesClient rides={rides} />
      
      <style>{`
        .rides-page-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .rides-header {
          text-align: center;
          padding: 2rem 1.5rem 1rem;
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
          max-width: 600px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}
