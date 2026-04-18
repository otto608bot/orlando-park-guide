/**
 * Central affiliate link configuration for Plan Your Park
 * Source: Undercover Tourist official partner links
 */

export const AFFILIATE_LINKS = {
  // Disney World
  disneyGeneral: 'https://www.dpbolvw.net/click-101693488-5527150',
  disney4DayParkHopper: 'https://www.tkqlhce.com/click-101693488-12783539',

  // Universal Orlando
  universal2Park2Day: 'https://www.tkqlhce.com/click-101693488-12834895',
  universal3Park3Day: 'https://www.dpbolvw.net/click-101693488-12983229',
  universal3DayBaseVolcanoBay: 'https://www.tkqlhce.com/click-101693488-12834933',
  universal4DayBase: 'https://www.tkqlhce.com/click-101693488-12983232',
  universal1Park1DayEpic: 'https://www.tkqlhce.com/click-101693488-12834895',
  universalOrlandoDirect: 'https://www.universalorlando.com',

  // Individual parks
  seaworld: 'https://www.tkqlhce.com/click-101693488-12540778',
  legoland: 'https://www.anrdoezrs.net/click-101693488-12540781',
  discoveryCove: 'https://www.anrdoezrs.net/click-101693488-13370812',
  gatorland: 'https://www.tkqlhce.com/click-101693488-2331765',

  // Entertainment
  blueManGroup: 'https://www.kqzyfj.com/click-101693488-12755980',

  // General deals page
  ucDealsPage: 'https://www.dpbolvw.net/click-101693488-10723176',

  // Viator (comparison/marketplace — add affiliate tag when available)
  viator: 'https://www.viator.com',
} as const;

/**
 * Park-specific ticket link mapping
 * Used for "Buy Tickets" buttons on park cards and park detail pages
 */
export const PARK_TICKET_LINKS: Record<string, string> = {
  'Magic Kingdom': AFFILIATE_LINKS.disney4DayParkHopper,
  'EPCOT': AFFILIATE_LINKS.disney4DayParkHopper,
  'Hollywood Studios': AFFILIATE_LINKS.disney4DayParkHopper,
  'Animal Kingdom': AFFILIATE_LINKS.disney4DayParkHopper,
  'Universal Studios Florida': AFFILIATE_LINKS.universal2Park2Day,
  'Islands of Adventure': AFFILIATE_LINKS.universal2Park2Day,
  'Epic Universe': AFFILIATE_LINKS.universal3Park3Day,
  'SeaWorld Orlando': AFFILIATE_LINKS.seaworld,
  'LEGOLAND Florida': AFFILIATE_LINKS.legoland,
  // Slug-based fallbacks
  'magic-kingdom': AFFILIATE_LINKS.disney4DayParkHopper,
  'epcot': AFFILIATE_LINKS.disney4DayParkHopper,
  'hollywood-studios': AFFILIATE_LINKS.disney4DayParkHopper,
  'animal-kingdom': AFFILIATE_LINKS.disney4DayParkHopper,
  'universal-studios-florida': AFFILIATE_LINKS.universal2Park2Day,
  'islands-of-adventure': AFFILIATE_LINKS.universal2Park2Day,
  'epic-universe': AFFILIATE_LINKS.universal3Park3Day,
  'seaworld-orlando': AFFILIATE_LINKS.seaworld,
  'legoland-florida': AFFILIATE_LINKS.legoland,
};

/**
 * Get the correct ticket affiliate link for a park by name or slug
 */
export function getParkTicketLink(parkNameOrSlug: string): string {
  return PARK_TICKET_LINKS[parkNameOrSlug] ?? AFFILIATE_LINKS.ucDealsPage;
}
