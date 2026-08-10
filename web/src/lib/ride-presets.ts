/**
 * Shareable ride-finder deep links (FiltersContext reads ?height=&parks=&calm=).
 * Park query values MUST match FilterSidebar PARKS[].name exactly.
 * Used by /rides UI + static SEO landings `/rides/for/[slug]/` + sitemap.
 */
export type RidePreset = {
  /** Stable SEO path segment under /rides/for/ */
  slug: string;
  /** Interactive finder path + query starting with /rides/ */
  href: string;
  /** Canonical crawlable SEO landing (static export). */
  seoPath: string;
  label: string;
  blurb: string;
  /** SERP title (site name appended by createPageMetadata template if configured). */
  seoTitle: string;
  seoDescription: string;
  height?: number;
  /** Park names must match ride.park + FilterSidebar exactly. */
  parks?: readonly string[];
  calm?: boolean;
};

function finderHref(opts: { height?: number; parks?: readonly string[]; calm?: boolean }): string {
  const params = new URLSearchParams();
  if (opts.height && opts.height > 0) params.set("height", String(opts.height));
  if (opts.parks && opts.parks.length > 0) {
    // Keep spaces as %20 to match existing share links / smoke needles
    params.set("parks", opts.parks.join(","));
  }
  if (opts.calm) params.set("calm", "true");
  const qs = params.toString().replace(/\+/g, "%20");
  return qs ? `/rides/?${qs}` : "/rides/";
}

function definePreset(
  partial: Omit<RidePreset, "href" | "seoPath"> & {
    height?: number;
    parks?: readonly string[];
    calm?: boolean;
  },
): RidePreset {
  const href = finderHref({
    height: partial.height,
    parks: partial.parks,
    calm: partial.calm,
  });
  return {
    ...partial,
    href,
    seoPath: `/rides/for/${partial.slug}/`,
  };
}

export const RIDE_HEIGHT_PRESETS: readonly RidePreset[] = [
  definePreset({
    slug: "under-40",
    label: 'Under ~40"',
    blurb: "Preschool / shorter riders",
    seoTitle: 'Orlando Rides Under 40" for Kids — All Parks',
    seoDescription:
      "See which Orlando theme park rides shorter kids (~40\") can board across Disney, Universal, Epic Universe, SeaWorld, and LEGOLAND — then open the interactive height filter.",
    height: 40,
  }),
  definePreset({
    slug: "height-44",
    label: '44"',
    blurb: "Many family coasters open",
    seoTitle: 'Orlando Rides at 44" Height — Family Coaster Band',
    seoDescription:
      "Filter Orlando rides for kids around 44 inches — when many family coasters open at Disney, Universal, Epic Universe, and more.",
    height: 44,
  }),
  definePreset({
    slug: "height-48",
    label: '48"',
    blurb: "Most big thrills unlock",
    seoTitle: 'Orlando Rides at 48" — Big Thrills Unlock',
    seoDescription:
      "See Orlando rides that open around 48 inches — when most big thrills unlock across Disney, Universal, and Epic Universe.",
    height: 48,
  }),
  definePreset({
    slug: "height-52",
    label: '52"+',
    blurb: "Nearly full park access",
    seoTitle: 'Orlando Rides at 52"+ — Near-Full Park Access',
    seoDescription:
      "Rides open to kids around 52 inches and up across Orlando’s major theme parks — nearly full access for taller kids.",
    height: 52,
  }),
  definePreset({
    slug: "calm",
    label: "Calm rides",
    blurb: "Gentler experiences",
    seoTitle: "Calm Orlando Theme Park Rides for Sensitive Kids",
    seoDescription:
      "Gentler Orlando park rides tagged calm/slow — a softer start for younger or sensory-sensitive kids before you add thrills.",
    calm: true,
  }),
  definePreset({
    slug: "magic-kingdom-under-40",
    label: 'MK + under 40"',
    blurb: "Magic Kingdom short-rider start",
    seoTitle: 'Magic Kingdom Rides Under 40" for Kids',
    seoDescription:
      "Magic Kingdom rides shorter kids (~40\") can board — a shareable short-rider list plus the interactive height filter.",
    height: 40,
    parks: ["Magic Kingdom"],
  }),
  definePreset({
    slug: "epcot-under-40",
    label: 'EPCOT + under 40"',
    blurb: "World Showcase + family rides",
    seoTitle: 'EPCOT Rides Under 40" for Kids',
    seoDescription:
      "EPCOT rides for shorter kids (~40\") — family-friendly picks and height notes before you lock a park day.",
    height: 40,
    parks: ["EPCOT"],
  }),
  definePreset({
    // Park query MUST match ride.park + FilterSidebar PARKS[].name exactly
    // (Sanity stores "Universal Studios Florida", not "Universal Studios").
    slug: "universal-studios-under-40",
    label: 'USF + under 40"',
    blurb: "Universal Studios Florida short-rider filter",
    seoTitle: 'Universal Studios Florida Rides Under 40"',
    seoDescription:
      "Universal Studios Florida rides shorter kids (~40\") can board — filter matches the live ride list park name.",
    height: 40,
    parks: ["Universal Studios Florida"],
  }),
  definePreset({
    slug: "islands-of-adventure-under-40",
    label: 'IOA + under 40"',
    blurb: "Islands of Adventure short riders",
    seoTitle: 'Islands of Adventure Rides Under 40" for Kids',
    seoDescription:
      "Islands of Adventure rides for shorter kids (~40\") — plan around height gates before Hagrid’s and big coasters.",
    height: 40,
    parks: ["Islands of Adventure"],
  }),
  definePreset({
    slug: "epic-universe-48",
    label: 'Epic + 48"',
    blurb: "Epic Universe when thrills unlock",
    seoTitle: 'Epic Universe Rides at 48" Height',
    seoDescription:
      "Epic Universe rides that open around 48 inches — when more thrills unlock across Super Nintendo World, Berk, and more.",
    height: 48,
    parks: ["Epic Universe"],
  }),
  definePreset({
    slug: "epic-universe-under-40",
    label: 'Epic + under 40"',
    blurb: "What shorter kids can ride at Epic",
    seoTitle: 'Epic Universe Rides Under 40" for Kids',
    seoDescription:
      "What shorter kids (~40\") can ride at Epic Universe — plan the day around real height gates, not guesswork.",
    height: 40,
    parks: ["Epic Universe"],
  }),
  definePreset({
    slug: "animal-kingdom-44",
    label: 'AK + 44"',
    blurb: "Animal Kingdom family coaster band",
    seoTitle: 'Animal Kingdom Rides at 44" for Families',
    seoDescription:
      "Animal Kingdom rides around the 44-inch family coaster band — Safari-day planning with height clarity.",
    height: 44,
    parks: ["Animal Kingdom"],
  }),
  definePreset({
    slug: "hollywood-studios-under-40",
    label: 'HS + under 40"',
    blurb: "Hollywood Studios short-rider filter",
    seoTitle: 'Hollywood Studios Rides Under 40" for Kids',
    seoDescription:
      "Hollywood Studios rides shorter kids (~40\") can board — Toy Story, shows, and height-gated thrills sorted.",
    height: 40,
    parks: ["Hollywood Studios"],
  }),
  definePreset({
    slug: "hollywood-studios-48",
    label: 'HS + 48"',
    blurb: "Hollywood Studios when thrills unlock",
    seoTitle: 'Hollywood Studios Rides at 48" Height',
    seoDescription:
      "Hollywood Studios rides that open around 48 inches — when more thrills unlock for taller kids.",
    height: 48,
    parks: ["Hollywood Studios"],
  }),
  definePreset({
    slug: "seaworld-under-40",
    label: 'SeaWorld + under 40"',
    blurb: "SeaWorld shows + gentler rides first",
    seoTitle: 'SeaWorld Orlando Rides Under 40" for Kids',
    seoDescription:
      "SeaWorld Orlando rides and gentler options for shorter kids (~40\") — shows-first family pacing.",
    height: 40,
    parks: ["SeaWorld Orlando"],
  }),
  definePreset({
    slug: "legoland-under-40",
    label: 'LEGOLAND + under 40"',
    blurb: "LEGOLAND built for younger kids",
    seoTitle: 'LEGOLAND Florida Rides Under 40" for Kids',
    seoDescription:
      "LEGOLAND Florida rides for shorter / younger kids (~40\") — when LEGOLAND beats a big Orlando park day.",
    height: 40,
    parks: ["LEGOLAND Florida"],
  }),
  definePreset({
    slug: "epcot-48",
    label: 'EPCOT + 48"',
    blurb: "EPCOT thrills when height unlocks",
    seoTitle: 'EPCOT Rides at 48" Height for Families',
    seoDescription:
      "EPCOT rides that open around 48 inches — thrills unlocked plus family backups for a full park day.",
    height: 48,
    parks: ["EPCOT"],
  }),
  definePreset({
    slug: "magic-kingdom-calm-under-40",
    label: 'MK calm + under 40"',
    blurb: "Magic Kingdom gentler short-rider day",
    seoTitle: 'Magic Kingdom Calm Rides Under 40"',
    seoDescription:
      "Gentler Magic Kingdom rides for shorter kids (~40\") — a calmer short-rider day plan you can share.",
    height: 40,
    parks: ["Magic Kingdom"],
    calm: true,
  }),
  definePreset({
    slug: "animal-kingdom-under-40",
    label: 'AK + under 40"',
    blurb: "Animal Kingdom short-rider start",
    seoTitle: 'Animal Kingdom Rides Under 40" for Kids',
    seoDescription:
      "Animal Kingdom rides shorter kids (~40\") can board — Safari-day planning with real height gates.",
    height: 40,
    parks: ["Animal Kingdom"],
  }),
  definePreset({
    slug: "magic-kingdom-48",
    label: 'MK + 48"',
    blurb: "Magic Kingdom when thrills unlock",
    seoTitle: 'Magic Kingdom Rides at 48" Height',
    seoDescription:
      "Magic Kingdom rides that open around 48 inches — thrills unlocked plus family classics for taller kids.",
    height: 48,
    parks: ["Magic Kingdom"],
  }),
  definePreset({
    slug: "islands-of-adventure-48",
    label: 'IOA + 48"',
    blurb: "Islands of Adventure thrills unlock",
    seoTitle: 'Islands of Adventure Rides at 48" Height',
    seoDescription:
      "Islands of Adventure rides that open around 48 inches — Hogsmeade thrills and family backups side by side.",
    height: 48,
    parks: ["Islands of Adventure"],
  }),
  definePreset({
    slug: "universal-studios-48",
    label: 'USF + 48"',
    blurb: "Universal Studios Florida thrills unlock",
    seoTitle: 'Universal Studios Florida Rides at 48" Height',
    seoDescription:
      "Universal Studios Florida rides that open around 48 inches — when more thrills unlock for taller kids.",
    height: 48,
    parks: ["Universal Studios Florida"],
  }),
] as const;

/** Interactive finder paths (with query) — still listed for share discovery. */
export function ridePresetSitemapPaths(): string[] {
  return RIDE_HEIGHT_PRESETS.map((p) => p.href);
}

/** Crawlable static SEO landings (preferred over query-only URLs). */
export function ridePresetSeoPaths(): string[] {
  return RIDE_HEIGHT_PRESETS.map((p) => p.seoPath);
}

export function getRidePresetBySlug(slug: string): RidePreset | undefined {
  return RIDE_HEIGHT_PRESETS.find((p) => p.slug === slug);
}

function sameParkSet(a: readonly string[] | undefined, b: readonly string[] | undefined): boolean {
  const left = [...(a ?? [])].sort();
  const right = [...(b ?? [])].sort();
  if (left.length !== right.length) return false;
  return left.every((name, i) => name === right[i]);
}

/**
 * Best matching SEO landing for a height/park/calm combo.
 * Prefer exact park+height+calm; then all-parks height; then finder href fallback via caller.
 */
export function findRidePreset(opts: {
  height?: number;
  parks?: readonly string[];
  calm?: boolean;
}): RidePreset | undefined {
  const height = opts.height;
  const parks = opts.parks;
  const calm = Boolean(opts.calm);

  const exact = RIDE_HEIGHT_PRESETS.find(
    (p) =>
      Boolean(p.calm) === calm &&
      (p.height ?? undefined) === (height ?? undefined) &&
      sameParkSet(p.parks, parks),
  );
  if (exact) return exact;

  // Park-scoped without calm → drop calm requirement only if caller didn't ask for calm
  if (!calm && parks && parks.length > 0 && height) {
    const parkHeight = RIDE_HEIGHT_PRESETS.find(
      (p) => !p.calm && p.height === height && sameParkSet(p.parks, parks),
    );
    if (parkHeight) return parkHeight;
  }

  // All-parks height (or calm-only) landing
  if (!parks || parks.length === 0) {
    return RIDE_HEIGHT_PRESETS.find(
      (p) =>
        Boolean(p.calm) === calm &&
        (p.height ?? undefined) === (height ?? undefined) &&
        (!p.parks || p.parks.length === 0),
    );
  }

  return undefined;
}

/** Prefer crawlable SEO path; fall back to interactive finder query URL. */
export function rideLinkFor(opts: {
  height?: number;
  parks?: readonly string[];
  calm?: boolean;
}): string {
  const preset = findRidePreset(opts);
  if (preset) return preset.seoPath;
  return finderHref(opts);
}

/**
 * Rank related SEO landings for internal linking (same park > same height > calm affinity).
 * Avoids the prior "first N in array" bias that always pushed global under-40 cards.
 */
export function relatedRidePresets(current: RidePreset, limit = 10): RidePreset[] {
  const currentParks = new Set(current.parks ?? []);
  const scored = RIDE_HEIGHT_PRESETS.filter((p) => p.slug !== current.slug).map((p) => {
    let score = 0;
    const parks = p.parks ?? [];
    for (const park of parks) {
      if (currentParks.has(park)) score += 8;
    }
    if ((current.parks?.length ?? 0) === 0 && parks.length === 0) score += 3;
    if (current.height && p.height === current.height) score += 5;
    if (Boolean(current.calm) === Boolean(p.calm) && (current.calm || p.calm)) score += 4;
    // Prefer park-scoped companions when current is park-scoped
    if ((current.parks?.length ?? 0) > 0 && parks.length > 0) score += 1;
    // Slight boost for popular short-rider / thrill-unlock bands
    if (p.height === 40 || p.height === 48) score += 1;
    return { p, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.p.label.localeCompare(b.p.label);
  });

  return scored.slice(0, limit).map(({ p }) => p);
}

/** Park-aware next-step guides (earners + conversion) for height landing footers. */
export type HeightLandingGuide = {
  href: string;
  label: string;
  description: string;
};

export function heightLandingGuides(preset: RidePreset): HeightLandingGuide[] {
  const parks = new Set(preset.parks ?? []);
  const hay = `${preset.slug} ${preset.label} ${[...(preset.parks ?? [])].join(" ")}`.toLowerCase();
  const guides: HeightLandingGuide[] = [];
  const push = (g: HeightLandingGuide) => {
    if (guides.some((x) => x.href === g.href)) return;
    guides.push(g);
  };

  const isEpic = parks.has("Epic Universe") || hay.includes("epic");
  const isMk = parks.has("Magic Kingdom") || hay.includes("magic-kingdom") || hay.includes("mk ");
  const isUniversal =
    parks.has("Universal Studios Florida") ||
    parks.has("Islands of Adventure") ||
    hay.includes("universal") ||
    hay.includes("islands");
  const isDisneyPark =
    isMk ||
    parks.has("EPCOT") ||
    parks.has("Hollywood Studios") ||
    parks.has("Animal Kingdom") ||
    hay.includes("epcot") ||
    hay.includes("hollywood") ||
    hay.includes("animal");

  if (isEpic) {
    push({
      href: "/blog/epic-universe-1-day-plan/",
      label: "Epic Universe 1-day plan",
      description: "Best-CTR touring plan after you know who can ride what.",
    });
    push({
      href: "/blog/epic-universe-tickets-guide/",
      label: "Epic Universe tickets guide",
      description: "Park-day ticket options before you lock dates.",
    });
    push({
      href: "/blog/epic-universe-rides-ranked-guide/",
      label: "Epic Universe rides ranked",
      description: "Family ranking once heights are clear.",
    });
  }

  if (isMk || (preset.height === 40 && isDisneyPark)) {
    push({
      href: "/blog/best-magic-kingdom-rides-kids-under-40-inches/",
      label: 'Magic Kingdom rides under 40"',
      description: "Our strongest short-rider earner for MK park days.",
    });
  }

  if (isUniversal || isEpic) {
    push({
      href: "/blog/universal-orlando-height-requirements/",
      label: "Universal Orlando height requirements",
      description: "Full chart across USF, Islands, and Epic Universe.",
    });
  }

  if (isDisneyPark || !preset.parks?.length) {
    push({
      href: "/blog/disney-world-packing-list-kids/",
      label: "Disney World kids packing list",
      description: "Gear families actually use — Amazon paths included.",
    });
  }

  push({
    href: "/deals/",
    label: "Family ticket deals",
    description: "Compare Orlando ticket options once the ride list is set.",
  });
  push({
    href: "/parks/",
    label: "Compare all Orlando parks",
    description: "Pick the right park day for your kids' heights and energy.",
  });

  return guides.slice(0, 6);
}
