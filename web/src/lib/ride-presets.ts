/**
 * Shareable ride-finder deep links (FiltersContext reads ?height=&parks=&calm=).
 * Park query values MUST match FilterSidebar PARKS[].name exactly.
 * Used by /rides UI + sitemap so product SEO surfaces stay in sync.
 */
export type RidePreset = {
  /** Path + query starting with /rides/ */
  href: string;
  label: string;
  blurb: string;
};

export const RIDE_HEIGHT_PRESETS: readonly RidePreset[] = [
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
    label: 'MK + under 40"',
    blurb: "Magic Kingdom short-rider start",
  },
  {
    href: "/rides/?height=40&parks=EPCOT",
    label: 'EPCOT + under 40"',
    blurb: "World Showcase + family rides",
  },
  {
    // Park query MUST match ride.park + FilterSidebar PARKS[].name exactly
    // (Sanity stores "Universal Studios Florida", not "Universal Studios").
    href: "/rides/?height=40&parks=Universal%20Studios%20Florida",
    label: 'USF + under 40"',
    blurb: "Universal Studios Florida short-rider filter",
  },
  {
    href: "/rides/?height=40&parks=Islands%20of%20Adventure",
    label: 'IOA + under 40"',
    blurb: "Islands of Adventure short riders",
  },
  {
    href: "/rides/?height=48&parks=Epic%20Universe",
    label: 'Epic + 48"',
    blurb: "Epic Universe when thrills unlock",
  },
  {
    href: "/rides/?height=40&parks=Epic%20Universe",
    label: 'Epic + under 40"',
    blurb: "What shorter kids can ride at Epic",
  },
  {
    href: "/rides/?height=44&parks=Animal%20Kingdom",
    label: 'AK + 44"',
    blurb: "Animal Kingdom family coaster band",
  },
  {
    href: "/rides/?height=40&parks=Hollywood%20Studios",
    label: 'HS + under 40"',
    blurb: "Hollywood Studios short-rider filter",
  },
  {
    href: "/rides/?height=48&parks=Hollywood%20Studios",
    label: 'HS + 48"',
    blurb: "Hollywood Studios when thrills unlock",
  },
  {
    href: "/rides/?height=40&parks=SeaWorld%20Orlando",
    label: 'SeaWorld + under 40"',
    blurb: "SeaWorld shows + gentler rides first",
  },
  {
    href: "/rides/?height=40&parks=LEGOLAND%20Florida",
    label: 'LEGOLAND + under 40"',
    blurb: "LEGOLAND built for younger kids",
  },
  {
    href: "/rides/?height=48&parks=EPCOT",
    label: 'EPCOT + 48"',
    blurb: "EPCOT thrills when height unlocks",
  },
  {
    href: "/rides/?height=40&parks=Magic%20Kingdom&calm=true",
    label: 'MK calm + under 40"',
    blurb: "Magic Kingdom gentler short-rider day",
  },
] as const;

/** Paths (with query) for sitemap / internal linking. */
export function ridePresetSitemapPaths(): string[] {
  return RIDE_HEIGHT_PRESETS.map((p) => p.href);
}
