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
  // Family coaster band (44") at top commercial parks — park chips link here
  definePreset({
    slug: "epic-universe-44",
    label: 'Epic + 44"',
    blurb: "Epic Universe family coaster band",
    seoTitle: 'Epic Universe Rides at 44" for Families',
    seoDescription:
      "Epic Universe rides around the 44-inch family coaster band — plan Super Nintendo World and Berk with real height gates.",
    height: 44,
    parks: ["Epic Universe"],
  }),
  definePreset({
    slug: "magic-kingdom-44",
    label: 'MK + 44"',
    blurb: "Magic Kingdom family coaster band",
    seoTitle: 'Magic Kingdom Rides at 44" for Families',
    seoDescription:
      "Magic Kingdom rides around the 44-inch family coaster band — classics plus what unlocks before big thrills.",
    height: 44,
    parks: ["Magic Kingdom"],
  }),
  definePreset({
    slug: "islands-of-adventure-44",
    label: 'IOA + 44"',
    blurb: "Islands of Adventure family coaster band",
    seoTitle: 'Islands of Adventure Rides at 44" for Families',
    seoDescription:
      "Islands of Adventure rides around 44 inches — Hogsmeade family options before taller thrills unlock.",
    height: 44,
    parks: ["Islands of Adventure"],
  }),
  definePreset({
    slug: "universal-studios-44",
    label: 'USF + 44"',
    blurb: "Universal Studios Florida family coaster band",
    seoTitle: 'Universal Studios Florida Rides at 44" for Families',
    seoDescription:
      "Universal Studios Florida rides around the 44-inch band — family coasters and backups before 48\" thrills.",
    height: 44,
    parks: ["Universal Studios Florida"],
  }),
  // Remaining Disney 44″ park chips (HS / EPCOT) — park pages already call rideLinkFor(44)
  definePreset({
    slug: "hollywood-studios-44",
    label: 'HS + 44"',
    blurb: "Hollywood Studios family coaster band",
    seoTitle: 'Hollywood Studios Rides at 44" for Families',
    seoDescription:
      "Hollywood Studios rides around the 44-inch family coaster band — Toy Story, shows, and what unlocks before taller thrills.",
    height: 44,
    parks: ["Hollywood Studios"],
  }),
  definePreset({
    slug: "epcot-44",
    label: 'EPCOT + 44"',
    blurb: "EPCOT family coaster band",
    seoTitle: 'EPCOT Rides at 44" for Families',
    seoDescription:
      "EPCOT rides around the 44-inch family coaster band — Guardians-adjacent planning with calmer backups for mixed-height kids.",
    height: 44,
    parks: ["EPCOT"],
  }),
  // Remaining park chips: AK 48″ + SeaWorld/LEGOLAND 44″ & 48″ (park pages link via rideLinkFor)
  definePreset({
    slug: "animal-kingdom-48",
    label: 'AK + 48"',
    blurb: "Animal Kingdom thrills unlock",
    seoTitle: 'Animal Kingdom Rides at 48" Height',
    seoDescription:
      "Animal Kingdom rides that open around 48 inches — thrills unlocked plus Safari-day family backups for taller kids.",
    height: 48,
    parks: ["Animal Kingdom"],
  }),
  definePreset({
    slug: "seaworld-44",
    label: 'SeaWorld + 44"',
    blurb: "SeaWorld family coaster band",
    seoTitle: 'SeaWorld Orlando Rides at 44" for Families',
    seoDescription:
      "SeaWorld Orlando rides around the 44-inch family coaster band — shows-first pacing with what unlocks before bigger thrills.",
    height: 44,
    parks: ["SeaWorld Orlando"],
  }),
  definePreset({
    slug: "seaworld-48",
    label: 'SeaWorld + 48"',
    blurb: "SeaWorld thrills unlock",
    seoTitle: 'SeaWorld Orlando Rides at 48" Height',
    seoDescription:
      "SeaWorld Orlando rides that open around 48 inches — when more thrills unlock alongside shows and animal experiences.",
    height: 48,
    parks: ["SeaWorld Orlando"],
  }),
  definePreset({
    slug: "legoland-44",
    label: 'LEGOLAND + 44"',
    blurb: "LEGOLAND family coaster band",
    seoTitle: 'LEGOLAND Florida Rides at 44" for Families',
    seoDescription:
      "LEGOLAND Florida rides around 44 inches — built-for-kids thrills and backups when LEGOLAND beats a big Orlando park day.",
    height: 44,
    parks: ["LEGOLAND Florida"],
  }),
  definePreset({
    slug: "legoland-48",
    label: 'LEGOLAND + 48"',
    blurb: "LEGOLAND thrills unlock",
    seoTitle: 'LEGOLAND Florida Rides at 48" Height',
    seoDescription:
      "LEGOLAND Florida rides that open around 48 inches — fuller access for taller kids on a LEGOLAND-focused park day.",
    height: 48,
    parks: ["LEGOLAND Florida"],
  }),
  // Calm + under ~40″ for every park (park pages ship a calm chip via rideLinkFor)
  definePreset({
    slug: "epic-universe-calm-under-40",
    label: 'Epic calm + under 40"',
    blurb: "Epic Universe gentler short-rider day",
    seoTitle: 'Epic Universe Calm Rides Under 40" for Kids',
    seoDescription:
      "Gentler Epic Universe rides for shorter kids (~40\") — a calmer Super Nintendo World / Berk start before thrills.",
    height: 40,
    parks: ["Epic Universe"],
    calm: true,
  }),
  definePreset({
    slug: "universal-studios-calm-under-40",
    label: 'USF calm + under 40"',
    blurb: "Universal Studios Florida gentler short-rider day",
    seoTitle: 'Universal Studios Florida Calm Rides Under 40"',
    seoDescription:
      "Gentler Universal Studios Florida rides for shorter kids (~40\") — calmer backups before bigger thrills.",
    height: 40,
    parks: ["Universal Studios Florida"],
    calm: true,
  }),
  definePreset({
    slug: "islands-of-adventure-calm-under-40",
    label: 'IOA calm + under 40"',
    blurb: "Islands of Adventure gentler short-rider day",
    seoTitle: 'Islands of Adventure Calm Rides Under 40"',
    seoDescription:
      "Gentler Islands of Adventure rides for shorter kids (~40\") — calmer Hogsmeade-day backups before coasters.",
    height: 40,
    parks: ["Islands of Adventure"],
    calm: true,
  }),
  definePreset({
    slug: "epcot-calm-under-40",
    label: 'EPCOT calm + under 40"',
    blurb: "EPCOT gentler short-rider day",
    seoTitle: 'EPCOT Calm Rides Under 40" for Kids',
    seoDescription:
      "Gentler EPCOT rides for shorter kids (~40\") — World Showcase pacing and calmer attractions first.",
    height: 40,
    parks: ["EPCOT"],
    calm: true,
  }),
  definePreset({
    slug: "hollywood-studios-calm-under-40",
    label: 'HS calm + under 40"',
    blurb: "Hollywood Studios gentler short-rider day",
    seoTitle: 'Hollywood Studios Calm Rides Under 40"',
    seoDescription:
      "Gentler Hollywood Studios rides for shorter kids (~40\") — shows and calmer picks before height-gated thrills.",
    height: 40,
    parks: ["Hollywood Studios"],
    calm: true,
  }),
  definePreset({
    slug: "animal-kingdom-calm-under-40",
    label: 'AK calm + under 40"',
    blurb: "Animal Kingdom gentler short-rider day",
    seoTitle: 'Animal Kingdom Calm Rides Under 40" for Kids',
    seoDescription:
      "Gentler Animal Kingdom rides for shorter kids (~40\") — Safari-day calm picks and short-rider backups.",
    height: 40,
    parks: ["Animal Kingdom"],
    calm: true,
  }),
  definePreset({
    slug: "seaworld-calm-under-40",
    label: 'SeaWorld calm + under 40"',
    blurb: "SeaWorld gentler short-rider day",
    seoTitle: 'SeaWorld Orlando Calm Rides Under 40"',
    seoDescription:
      "Gentler SeaWorld Orlando rides and shows-first options for shorter kids (~40\") — calmer family pacing.",
    height: 40,
    parks: ["SeaWorld Orlando"],
    calm: true,
  }),
  definePreset({
    slug: "legoland-calm-under-40",
    label: 'LEGOLAND calm + under 40"',
    blurb: "LEGOLAND gentler short-rider day",
    seoTitle: 'LEGOLAND Florida Calm Rides Under 40" for Kids',
    seoDescription:
      "Gentler LEGOLAND Florida rides for shorter / younger kids (~40\") — soft-start options on a kids-first park day.",
    height: 40,
    parks: ["LEGOLAND Florida"],
    calm: true,
  }),
  // Park-only “all heights” landings — park pages’ All heights chip was query-only fallback
  definePreset({
    slug: "magic-kingdom-all",
    label: "MK all heights",
    blurb: "Full Magic Kingdom ride list for families",
    seoTitle: "Magic Kingdom Rides for Kids — Full List",
    seoDescription:
      "Browse every Magic Kingdom ride for families, then filter by your kids’ heights — a crawlable full-park list before you lock tickets.",
    parks: ["Magic Kingdom"],
  }),
  definePreset({
    slug: "epcot-all",
    label: "EPCOT all heights",
    blurb: "Full EPCOT ride list for families",
    seoTitle: "EPCOT Rides for Kids — Full List",
    seoDescription:
      "Browse every EPCOT ride for families, then jump into height filters — World Showcase pacing with real ride gates.",
    parks: ["EPCOT"],
  }),
  definePreset({
    slug: "hollywood-studios-all",
    label: "HS all heights",
    blurb: "Full Hollywood Studios ride list for families",
    seoTitle: "Hollywood Studios Rides for Kids — Full List",
    seoDescription:
      "Browse every Hollywood Studios ride for families — Toy Story, shows, and thrills — then filter by kids’ heights.",
    parks: ["Hollywood Studios"],
  }),
  definePreset({
    slug: "animal-kingdom-all",
    label: "AK all heights",
    blurb: "Full Animal Kingdom ride list for families",
    seoTitle: "Animal Kingdom Rides for Kids — Full List",
    seoDescription:
      "Browse every Animal Kingdom ride for families — Safari-day planning with height clarity before you pick tickets.",
    parks: ["Animal Kingdom"],
  }),
  definePreset({
    slug: "universal-studios-all",
    label: "USF all heights",
    blurb: "Full Universal Studios Florida ride list",
    seoTitle: "Universal Studios Florida Rides for Kids — Full List",
    seoDescription:
      "Browse every Universal Studios Florida ride for families, then filter by height — park name matches the live ride list.",
    parks: ["Universal Studios Florida"],
  }),
  definePreset({
    slug: "islands-of-adventure-all",
    label: "IOA all heights",
    blurb: "Full Islands of Adventure ride list",
    seoTitle: "Islands of Adventure Rides for Kids — Full List",
    seoDescription:
      "Browse every Islands of Adventure ride for families — Hogsmeade thrills and family backups — then filter by kids’ heights.",
    parks: ["Islands of Adventure"],
  }),
  definePreset({
    slug: "epic-universe-all",
    label: "Epic all heights",
    blurb: "Full Epic Universe ride list for families",
    seoTitle: "Epic Universe Rides for Kids — Full List",
    seoDescription:
      "Browse every Epic Universe ride for families across Super Nintendo World, Berk, and more — then filter by real height gates.",
    parks: ["Epic Universe"],
  }),
  definePreset({
    slug: "seaworld-all",
    label: "SeaWorld all heights",
    blurb: "Full SeaWorld Orlando ride list for families",
    seoTitle: "SeaWorld Orlando Rides for Kids — Full List",
    seoDescription:
      "Browse every SeaWorld Orlando ride and family attraction, then filter by height — shows-first pacing with thrills side by side.",
    parks: ["SeaWorld Orlando"],
  }),
  definePreset({
    slug: "legoland-all",
    label: "LEGOLAND all heights",
    blurb: "Full LEGOLAND Florida ride list for families",
    seoTitle: "LEGOLAND Florida Rides for Kids — Full List",
    seoDescription:
      "Browse every LEGOLAND Florida ride for families — when LEGOLAND beats a big Orlando park day — then filter by kids’ heights.",
    parks: ["LEGOLAND Florida"],
  }),
  // Multi-resort bundles (high-intent “Disney World / Universal Orlando” queries)
  definePreset({
    slug: "disney-world-under-40",
    label: 'Disney World + under 40"',
    blurb: "All 4 Disney parks — short riders",
    seoTitle: 'Disney World Rides Under 40" for Kids — All 4 Parks',
    seoDescription:
      "Magic Kingdom, EPCOT, Hollywood Studios, and Animal Kingdom rides shorter kids (~40\") can board — one crawlable Disney World short-rider list.",
    height: 40,
    parks: ["Magic Kingdom", "EPCOT", "Hollywood Studios", "Animal Kingdom"],
  }),
  definePreset({
    slug: "disney-world-48",
    label: 'Disney World + 48"',
    blurb: "All 4 Disney parks when thrills unlock",
    seoTitle: 'Disney World Rides at 48" — All 4 Parks',
    seoDescription:
      "Disney World rides that open around 48 inches across Magic Kingdom, EPCOT, Hollywood Studios, and Animal Kingdom — thrills unlocked for taller kids.",
    height: 48,
    parks: ["Magic Kingdom", "EPCOT", "Hollywood Studios", "Animal Kingdom"],
  }),
  definePreset({
    slug: "disney-world-all",
    label: "Disney World all heights",
    blurb: "Full 4-park Disney World ride list",
    seoTitle: "Disney World Rides for Kids — All 4 Parks List",
    seoDescription:
      "Browse Disney World rides across Magic Kingdom, EPCOT, Hollywood Studios, and Animal Kingdom — then filter by your kids’ heights before you lock tickets.",
    parks: ["Magic Kingdom", "EPCOT", "Hollywood Studios", "Animal Kingdom"],
  }),
  definePreset({
    slug: "universal-orlando-under-40",
    label: 'Universal Orlando + under 40"',
    blurb: "USF + IOA + Epic — short riders",
    seoTitle: 'Universal Orlando Rides Under 40" — USF, Islands & Epic',
    seoDescription:
      "Universal Studios Florida, Islands of Adventure, and Epic Universe rides shorter kids (~40\") can board — one short-rider list across the Universal Orlando complex.",
    height: 40,
    parks: ["Universal Studios Florida", "Islands of Adventure", "Epic Universe"],
  }),
  definePreset({
    slug: "universal-orlando-48",
    label: 'Universal Orlando + 48"',
    blurb: "USF + IOA + Epic when thrills unlock",
    seoTitle: 'Universal Orlando Rides at 48" — USF, Islands & Epic',
    seoDescription:
      "Universal Orlando rides that open around 48 inches across Universal Studios Florida, Islands of Adventure, and Epic Universe — thrills unlocked for taller kids.",
    height: 48,
    parks: ["Universal Studios Florida", "Islands of Adventure", "Epic Universe"],
  }),
  definePreset({
    slug: "universal-orlando-all",
    label: "Universal Orlando all heights",
    blurb: "Full USF + IOA + Epic ride list",
    seoTitle: "Universal Orlando Rides for Kids — USF, Islands & Epic",
    seoDescription:
      "Browse Universal Orlando rides across Universal Studios Florida, Islands of Adventure, and Epic Universe — then filter by kids’ heights before you pick tickets.",
    parks: ["Universal Studios Florida", "Islands of Adventure", "Epic Universe"],
  }),
  // Complete the high-intent multi-resort matrix: family-coaster and gentler short-rider paths.
  definePreset({
    slug: "disney-world-44",
    label: 'Disney World + 44"',
    blurb: "All 4 Disney parks — family coaster band",
    seoTitle: 'Disney World Rides at 44" — All 4 Parks',
    seoDescription:
      "Disney World rides that open around 44 inches across Magic Kingdom, EPCOT, Hollywood Studios, and Animal Kingdom — a shareable family-coaster list.",
    height: 44,
    parks: ["Magic Kingdom", "EPCOT", "Hollywood Studios", "Animal Kingdom"],
  }),
  definePreset({
    slug: "universal-orlando-44",
    label: 'Universal Orlando + 44"',
    blurb: "USF + Islands + Epic — family coaster band",
    seoTitle: 'Universal Orlando Rides at 44" — USF, Islands & Epic',
    seoDescription:
      "Universal Orlando rides that open around 44 inches across Universal Studios Florida, Islands of Adventure, and Epic Universe — a family-coaster planning list.",
    height: 44,
    parks: ["Universal Studios Florida", "Islands of Adventure", "Epic Universe"],
  }),
  definePreset({
    slug: "disney-world-calm-under-40",
    label: 'Disney World calm + under 40"',
    blurb: "All 4 Disney parks — gentler short-rider list",
    seoTitle: 'Disney World Calm Rides Under 40" — All 4 Parks',
    seoDescription:
      "Gentler Disney World rides shorter kids (~40 inches) can board across all four parks — a calmer short-rider list before you add thrills.",
    height: 40,
    parks: ["Magic Kingdom", "EPCOT", "Hollywood Studios", "Animal Kingdom"],
    calm: true,
  }),
  definePreset({
    slug: "universal-orlando-calm-under-40",
    label: 'Universal Orlando calm + under 40"',
    blurb: "USF + Islands + Epic — gentler short-rider list",
    seoTitle: 'Universal Orlando Calm Rides Under 40" — USF, Islands & Epic',
    seoDescription:
      "Gentler Universal Orlando rides shorter kids (~40 inches) can board across Universal Studios Florida, Islands of Adventure, and Epic Universe.",
    height: 40,
    parks: ["Universal Studios Florida", "Islands of Adventure", "Epic Universe"],
    calm: true,
  }),
  // Near-full access multi-resort band (52″) — taller kids / near-full park access queries
  definePreset({
    slug: "disney-world-52",
    label: 'Disney World + 52"+',
    blurb: "All 4 Disney parks — near-full access",
    seoTitle: 'Disney World Rides at 52"+ — All 4 Parks',
    seoDescription:
      "Disney World rides open around 52 inches and up across Magic Kingdom, EPCOT, Hollywood Studios, and Animal Kingdom — near-full access for taller kids.",
    height: 52,
    parks: ["Magic Kingdom", "EPCOT", "Hollywood Studios", "Animal Kingdom"],
  }),
  definePreset({
    slug: "universal-orlando-52",
    label: 'Universal Orlando + 52"+',
    blurb: "USF + Islands + Epic — near-full access",
    seoTitle: 'Universal Orlando Rides at 52"+ — USF, Islands & Epic',
    seoDescription:
      "Universal Orlando rides open around 52 inches and up across Universal Studios Florida, Islands of Adventure, and Epic Universe — near-full access for taller kids.",
    height: 52,
    parks: ["Universal Studios Florida", "Islands of Adventure", "Epic Universe"],
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
  const isMultiDisney =
    hay.includes("disney-world") ||
    (parks.has("Magic Kingdom") &&
      parks.has("EPCOT") &&
      parks.has("Hollywood Studios") &&
      parks.has("Animal Kingdom"));
  const isMultiUniversal =
    hay.includes("universal-orlando") ||
    (parks.has("Universal Studios Florida") &&
      parks.has("Islands of Adventure") &&
      parks.has("Epic Universe"));
  const isUniversal =
    parks.has("Universal Studios Florida") ||
    parks.has("Islands of Adventure") ||
    isMultiUniversal ||
    hay.includes("universal") ||
    hay.includes("islands");
  const isDisneyPark =
    isMk ||
    isMultiDisney ||
    parks.has("EPCOT") ||
    parks.has("Hollywood Studios") ||
    parks.has("Animal Kingdom") ||
    hay.includes("epcot") ||
    hay.includes("hollywood") ||
    hay.includes("animal") ||
    hay.includes("disney");

  const isHs = parks.has("Hollywood Studios") || hay.includes("hollywood");
  const isEpcot = parks.has("EPCOT") || hay.includes("epcot");
  const isAk = parks.has("Animal Kingdom") || hay.includes("animal");
  const isSeaWorld = parks.has("SeaWorld Orlando") || hay.includes("seaworld");
  const isLegoland = parks.has("LEGOLAND Florida") || hay.includes("legoland");
  const shortRider = !preset.height || preset.height <= 44;

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

  if (isDisneyPark && shortRider) {
    push({
      href: "/blog/disney-world-with-baby-toddler/",
      label: "Disney World with a baby or toddler",
      description: "Stroller pacing and park-day reality for the littlest riders.",
    });
  }

  if (isHs || isEpcot || isAk) {
    push({
      href: "/blog/beat-disney-world-crowds/",
      label: "Beat Disney World crowds",
      description: "Rope-drop and midday breaks after heights are sorted.",
    });
  }

  if (isSeaWorld || isLegoland) {
    push({
      href: "/parks/",
      label: "Compare all Orlando parks",
      description: "See when SeaWorld or LEGOLAND beats a big Disney/Universal day.",
    });
    push({
      href: "/blog/free-things-disney-world/",
      label: "Free things at Disney World",
      description: "Budget-friendly backups if you mix park brands on one trip.",
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
