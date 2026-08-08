/**
 * Shared ride filtering (matches HomepageRides / RidesTable client logic).
 * Used by static SEO landings under /rides/for/[slug]/.
 */
import type { Ride } from "@/lib/sanity-types";

export type RideFilterInput = {
  height?: number;
  parks?: string[];
  calm?: boolean;
  pregnancySafe?: boolean;
  wheelchairAccessible?: boolean;
};

function isPregnancySafe(ride: Ride): boolean {
  if (!ride.accessibility) return true;
  return !ride.accessibility.some(
    (a) => a?.toLowerCase().includes("pregnancy") || a?.toLowerCase().includes("expectant"),
  );
}

function isWheelchairAccessible(ride: Ride): boolean {
  if (!ride.accessibility) return false;
  return ride.accessibility.some(
    (a) =>
      a?.toLowerCase().includes("wheelchair") ||
      a?.toLowerCase().includes("wav") ||
      a?.toLowerCase().includes("ecv"),
  );
}

/**
 * Calm / gentler rides.
 * Sanity accessibility tags do not currently include "calm" keywords (0 matches),
 * so we fall back to thrillLevel ≤ 2 (family/low) and gentle ride types.
 */
export function isCalmExperience(ride: Ride): boolean {
  if (ride.accessibility?.length) {
    const calmIndicators = ["calm", "gentle", "slow", "peaceful", "no sudden"];
    if (
      ride.accessibility.some((a) =>
        calmIndicators.some((ci) => a?.toLowerCase().includes(ci)),
      )
    ) {
      return true;
    }
  }
  if (typeof ride.thrillLevel === "number") {
    return ride.thrillLevel > 0 && ride.thrillLevel <= 2;
  }
  const type = (ride.rideType || "").toLowerCase();
  const calmTypes = [
    "show",
    "train",
    "walkthrough",
    "transit",
    "playground",
    "meet",
    "parade",
    "carousel",
    "boat",
    "dark ride",
  ];
  return calmTypes.some((ct) => type.includes(ct));
}

/** True when the kid at `height` inches can board (no min, or min <= height). */
export function rideMatchesHeight(ride: Ride, height: number): boolean {
  if (!height || height <= 0) return true;
  if (!ride.heightRequirement || ride.heightRequirement === 0) return true;
  return ride.heightRequirement <= height;
}

export function filterRides(rides: Ride[], input: RideFilterInput): Ride[] {
  let out = rides;
  if (input.parks && input.parks.length > 0) {
    const set = new Set(input.parks);
    out = out.filter((r) => r.park && set.has(r.park));
  }
  if (input.height && input.height > 0) {
    out = out.filter((r) => rideMatchesHeight(r, input.height!));
  }
  if (input.pregnancySafe) {
    out = out.filter(isPregnancySafe);
  }
  if (input.wheelchairAccessible) {
    out = out.filter(isWheelchairAccessible);
  }
  if (input.calm) {
    out = out.filter(isCalmExperience);
  }
  return out;
}

export function groupRidesByPark(rides: Ride[]): Array<{ park: string; rides: Ride[] }> {
  const order = [
    "Magic Kingdom",
    "EPCOT",
    "Hollywood Studios",
    "Animal Kingdom",
    "Universal Studios Florida",
    "Islands of Adventure",
    "Epic Universe",
    "SeaWorld Orlando",
    "LEGOLAND Florida",
  ];
  const map = new Map<string, Ride[]>();
  for (const ride of rides) {
    const park = ride.park || "Other";
    const list = map.get(park) || [];
    list.push(ride);
    map.set(park, list);
  }
  const ordered: Array<{ park: string; rides: Ride[] }> = [];
  for (const park of order) {
    const list = map.get(park);
    if (list?.length) {
      ordered.push({
        park,
        rides: [...list].sort((a, b) => (a.name || "").localeCompare(b.name || "")),
      });
      map.delete(park);
    }
  }
  for (const [park, list] of map) {
    ordered.push({
      park,
      rides: [...list].sort((a, b) => (a.name || "").localeCompare(b.name || "")),
    });
  }
  return ordered;
}

export const PARK_SLUG_MAP: Record<string, string> = {
  "Magic Kingdom": "magic-kingdom",
  EPCOT: "epcot",
  "Hollywood Studios": "hollywood-studios",
  "Animal Kingdom": "animal-kingdom",
  "Universal Studios Florida": "universal-studios-florida",
  "Islands of Adventure": "islands-of-adventure",
  "Epic Universe": "epic-universe",
  "SeaWorld Orlando": "seaworld-orlando",
  "LEGOLAND Florida": "legoland-florida",
};
