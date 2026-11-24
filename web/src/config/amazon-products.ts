/**
 * Plan Your Park Amazon product catalog.
 *
 * Single source for packing-list pick modules, post gear boxes, and /deals/
 * cards. Monthly link checks should walk AMAZON_PRODUCTS and hit each
 * https://www.amazon.com/dp/{asin} URL.
 *
 * Verified on November 24, 2026. Do not put prices or live star ratings
 * on the site. Page-type tracking IDs (pyp-pack-20 and the rest) were
 * created the same day; planyourpar0a-20 stays the fallback for the
 * footer, the disclosure page, and hrefs stored in Sanity.
 *
 * Swaps vs the November 23 plan:
 * - Kept AMACOOL B085L71L9R. Newer metal-clip fans (JISULIFE) were either
 *   4.0/142 or had too few reviews to replace a long-running pick.
 * - Kept 3Dlite B00O20OCVC (in stock, 6 left). The newer Jet Black
 *   listing (B07N16CCQC) was quoting a 1–2 month ship time.
 * - Replaced Band-Aid Hydro Seal pack-of-3 B0D14VV1JL (unavailable) with
 *   Band-Aid Pro Heal hydrocolloid blister bandages B077TKLJ8T (in stock).
 * - Included PROHEAR 032 kids muffs B07YRPX74G on the kids list only
 *   after confirming the page was in stock.
 * - Added BAGSMART compression packing cubes, 6-set B08Z7SLGMF (in
 *   stock, 4 left, 4.6 / 13,645) for leftover in-body links. Not added
 *   to the approved pick-list modules.
 */

export const AMAZON_ASSOCIATE_TAG = "planyourpar0a-20";

/** Exact Amazon Associates disclosure sentence. Show this near every module. */
export const AMAZON_DISCLOSURE =
  "As an Amazon Associate I earn from qualifying purchases.";

export const AMAZON_LINK_REL = "sponsored nofollow noopener" as const;

export type AmazonProductId =
  | "stroller-3dlite"
  | "stroller-fan-amacool"
  | "anker-zolo-20k"
  | "frogg-toggs-chilly-pad"
  | "cloudten-ponchos-4pk"
  | "hydroflask-32oz"
  | "thinkbaby-spf50"
  | "hiearcool-pouch-2pk"
  | "bandaid-proheal"
  | "autograph-castle"
  | "prohear-032-kids"
  | "bagsmart-cubes-6";

export type AmazonProduct = {
  id: AmazonProductId;
  name: string;
  /** One-line why-it-fits for a Disney family. No prices, ratings, or "cheaper" claims. */
  why: string;
  asin: string;
};

export type AmazonModuleVariant = "compact" | "deals-group";

export type AmazonModule = {
  /** Stable id for React keys and preview checks. */
  id: string;
  slug: string;
  /**
   * Place the box after the article section whose heading matches
   * this string (normalized). Omit on /deals groups, which are
   * rendered mid-page in a fixed slot.
   */
  afterHeading?: string;
  variant: AmazonModuleVariant;
  title: string;
  intro?: string;
  productIds: AmazonProductId[];
};

export const AMAZON_PRODUCTS: Record<AmazonProductId, AmazonProduct> = {
  "stroller-3dlite": {
    id: "stroller-3dlite",
    name: "Summer Infant 3Dlite Convenience Stroller, Black",
    why: "A light umbrella stroller that folds compact for the trip and fits typical Disney park size limits.",
    asin: "B00O20OCVC",
  },
  "stroller-fan-amacool": {
    id: "stroller-fan-amacool",
    name: "AMACOOL clip-on stroller fan",
    why: "Clips onto a stroller or wagon so little ones get a breeze in the Florida heat.",
    asin: "B085L71L9R",
  },
  "anker-zolo-20k": {
    id: "anker-zolo-20k",
    name: "Anker Zolo 20,000mAh 45W power bank with built-in USB-C cables",
    why: "Covers a full park day of photos and wait times, with built-in cables so you do not forget a cord.",
    asin: "B0DT12DNVF",
  },
  "frogg-toggs-chilly-pad": {
    id: "frogg-toggs-chilly-pad",
    name: "FROGG TOGGS Chilly Pad cooling towels, 2-pack",
    why: "Wet it at a fountain, wring it out, and wear it on the neck when the afternoon heat hits.",
    asin: "B08L5LXKGW",
  },
  "cloudten-ponchos-4pk": {
    id: "cloudten-ponchos-4pk",
    name: "CloudTen clear rain ponchos, 4-pack",
    why: "A compact family pack you can toss in the park bag for Florida afternoon storms.",
    asin: "B0CP74JJ3Z",
  },
  "hydroflask-32oz": {
    id: "hydroflask-32oz",
    name: "Hydro Flask 32 oz Wide Mouth with Flex Straw Cap",
    why: "Keeps water cold through a long park day, with a leakproof straw you can use while walking.",
    asin: "B0BG6NRL86",
  },
  "thinkbaby-spf50": {
    id: "thinkbaby-spf50",
    name: "Thinkbaby SPF 50+ mineral sunscreen, 3 oz",
    why: "A mineral SPF 50+ lotion that works for kids and adults in the Florida sun.",
    asin: "B004CDQ73K",
  },
  "hiearcool-pouch-2pk": {
    id: "hiearcool-pouch-2pk",
    name: "Hiearcool waterproof phone pouch, 2-pack",
    why: "Keeps phones dry on water rides and in the rain; a 2-pack covers two adults.",
    asin: "B0BTHVCV49",
  },
  "bandaid-proheal": {
    id: "bandaid-proheal",
    name: "BAND-AID Pro Heal hydrocolloid blister bandages, 6 ct",
    why: "Hydrocolloid pads to pack before a long park day starts to raise blisters.",
    asin: "B077TKLJ8T",
  },
  "autograph-castle": {
    id: "autograph-castle",
    name: "Castle hardcover autograph book",
    why: "A compact hardcover book for character signatures and photos, ready before you get to the park.",
    asin: "B0FZYMW236",
  },
  "prohear-032-kids": {
    id: "prohear-032-kids",
    name: "PROHEAR 032 kids ear muffs",
    why: "Soft kids' muffs for fireworks, parades, and loud shows, sized for about ages 3 to 12.",
    asin: "B07YRPX74G",
  },
  "bagsmart-cubes-6": {
    id: "bagsmart-cubes-6",
    name: "BAGSMART compression packing cubes, 6-set",
    why: "Compression cubes to keep clothes organized in a suitcase and free up space for a park week.",
    asin: "B08Z7SLGMF",
  },
};

export const FAMILY_PACK_IDS: AmazonProductId[] = [
  "stroller-3dlite",
  "stroller-fan-amacool",
  "anker-zolo-20k",
  "frogg-toggs-chilly-pad",
  "cloudten-ponchos-4pk",
  "hydroflask-32oz",
  "thinkbaby-spf50",
  "hiearcool-pouch-2pk",
  "bandaid-proheal",
  "autograph-castle",
];

export const KIDS_PACK_IDS: AmazonProductId[] = [
  ...FAMILY_PACK_IDS,
  "prohear-032-kids",
];

export const AMAZON_MODULES: AmazonModule[] = [
  // Family packing list: 3 compact boxes, mid-article, no top-of-page list.
  {
    id: "pack-power",
    slug: "disney-world-packing-list",
    afterHeading: "Electronics and Chargers",
    variant: "compact",
    title: "Power and phone picks",
    intro: "A charger that lasts a park day, and a pouch for water rides and rain.",
    productIds: ["anker-zolo-20k", "hiearcool-pouch-2pk"],
  },
  {
    id: "pack-heat",
    slug: "disney-world-packing-list",
    afterHeading: "Sun Protection and Hydration",
    variant: "compact",
    title: "Heat and sun picks",
    intro: "What we would actually put in the bag for a hot Orlando day.",
    productIds: [
      "stroller-fan-amacool",
      "frogg-toggs-chilly-pad",
      "thinkbaby-spf50",
      "hydroflask-32oz",
    ],
  },
  {
    id: "pack-kids",
    slug: "disney-world-packing-list",
    afterHeading: "Essentials for Babies and Toddlers",
    variant: "compact",
    title: "Little-kid picks",
    intro: "A compact stroller and an autograph book for character stops.",
    productIds: ["stroller-3dlite", "autograph-castle"],
  },
  // Kids packing list: 3 compact boxes after the matching checklist sections.
  {
    id: "pack-kids-essentials",
    slug: "disney-world-packing-list-kids",
    afterHeading: "Essentials Every Kid Needs at Disney World",
    variant: "compact",
    title: "Heat, rain, and water picks",
    intro: "The kid-list items we would actually order ahead.",
    productIds: [
      "thinkbaby-spf50",
      "frogg-toggs-chilly-pad",
      "cloudten-ponchos-4pk",
      "hydroflask-32oz",
    ],
  },
  {
    id: "pack-kids-toddler",
    slug: "disney-world-packing-list-kids",
    afterHeading: "Packing for Kids Ages 2-4",
    variant: "compact",
    title: "Picks for ages 2 to 4",
    intro: "A stroller, a clip-on fan, and muffs for loud shows.",
    productIds: ["stroller-3dlite", "stroller-fan-amacool", "prohear-032-kids"],
  },
  {
    id: "pack-kids-school",
    slug: "disney-world-packing-list-kids",
    afterHeading: "Packing for Kids Ages 5-8",
    variant: "compact",
    title: "Picks for ages 5 to 8",
    intro: "A charger, a dry bag for splash rides, and an autograph book.",
    productIds: ["anker-zolo-20k", "hiearcool-pouch-2pk", "autograph-castle"],
  },
  // /deals: mid-page, three compact groups instead of one large grid.
  {
    id: "deals-heat",
    slug: "deals",
    variant: "deals-group",
    title: "Heat and sun",
    intro: "Gear we recommend on our packing lists for hot park days.",
    productIds: [
      "stroller-fan-amacool",
      "frogg-toggs-chilly-pad",
      "thinkbaby-spf50",
      "hydroflask-32oz",
    ],
  },
  {
    id: "deals-rain",
    slug: "deals",
    variant: "deals-group",
    title: "Rain and water rides",
    intro: "A family poncho pack and a phone pouch for storms and splash rides.",
    productIds: ["cloudten-ponchos-4pk", "hiearcool-pouch-2pk"],
  },
  {
    id: "deals-park",
    slug: "deals",
    variant: "deals-group",
    title: "Park-day basics",
    intro: "The stroller, charger, blister kit, and autograph book from our lists.",
    productIds: [
      "stroller-3dlite",
      "anker-zolo-20k",
      "bandaid-proheal",
      "autograph-castle",
    ],
  },
  // Other posts: one compact box mid-article, next to a practical section.
  {
    id: "toddler-tips",
    slug: "disney-world-rides-for-toddlers-and-preschoolers",
    afterHeading: "Practical Tips for Riding With Little Kids",
    variant: "compact",
    title: "Worth packing for a toddler park day",
    productIds: [
      "stroller-3dlite",
      "stroller-fan-amacool",
      "prohear-032-kids",
      "thinkbaby-spf50",
    ],
  },
  {
    id: "baby-stroller",
    slug: "disney-world-with-baby-toddler",
    afterHeading: "The Stroller Question: Bring Your Own",
    variant: "compact",
    title: "Stroller picks",
    productIds: ["stroller-3dlite", "stroller-fan-amacool"],
  },
  {
    id: "baby-dressing",
    slug: "disney-world-with-baby-toddler",
    afterHeading: "Dressing Your Toddler for Disney",
    variant: "compact",
    title: "Sun and rain picks",
    productIds: ["thinkbaby-spf50", "cloudten-ponchos-4pk"],
  },
  {
    id: "mk-heat",
    slug: "magic-kingdom-with-kids-rides-by-height",
    afterHeading: "Heat, Crowds, and Safety Tips",
    variant: "compact",
    title: "Worth packing for a Magic Kingdom day",
    productIds: [
      "stroller-fan-amacool",
      "frogg-toggs-chilly-pad",
      "cloudten-ponchos-4pk",
      "anker-zolo-20k",
    ],
  },
  {
    id: "epcot-weather",
    slug: "epcot-with-kids-rides-by-height",
    afterHeading: "Walking, Weather and Safety Tips",
    variant: "compact",
    title: "Worth packing for an EPCOT day",
    productIds: [
      "stroller-fan-amacool",
      "frogg-toggs-chilly-pad",
      "cloudten-ponchos-4pk",
      "anker-zolo-20k",
    ],
  },
  {
    id: "ak-heat",
    slug: "animal-kingdom-with-kids-rides-by-height",
    afterHeading: "Heat, Shade and Safety Tips",
    variant: "compact",
    title: "Worth packing for an Animal Kingdom day",
    productIds: [
      "stroller-fan-amacool",
      "frogg-toggs-chilly-pad",
      "cloudten-ponchos-4pk",
      "anker-zolo-20k",
    ],
  },
  {
    id: "universal-tips",
    slug: "universal-orlando-parks-with-kids",
    afterHeading: "Practical Tips for Universal with Little Kids",
    variant: "compact",
    title: "Worth packing for a Universal day",
    productIds: [
      "stroller-3dlite",
      "cloudten-ponchos-4pk",
      "hiearcool-pouch-2pk",
      "anker-zolo-20k",
    ],
  },
  {
    id: "universal-bring",
    slug: "universal-orlando-height-requirements",
    afterHeading: "What to Bring to Universal Orlando",
    variant: "compact",
    title: "Worth packing for a Universal park day",
    productIds: ["anker-zolo-20k", "frogg-toggs-chilly-pad", "cloudten-ponchos-4pk"],
  },
];

function normalizeHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const MODULES_BY_SLUG: Record<string, AmazonModule[]> = AMAZON_MODULES.reduce(
  (acc, module) => {
    (acc[module.slug] ||= []).push(module);
    return acc;
  },
  {} as Record<string, AmazonModule[]>,
);

export function getAmazonModulesForSlug(slug: string): AmazonModule[] {
  return MODULES_BY_SLUG[slug] ?? [];
}

export function findAmazonModuleAfterHeading(
  slug: string,
  heading: string,
): AmazonModule | undefined {
  const needle = normalizeHeading(heading);
  if (!needle) return undefined;
  return getAmazonModulesForSlug(slug).find((module) => {
    if (!module.afterHeading) return false;
    const target = normalizeHeading(module.afterHeading);
    return needle === target || needle.startsWith(target);
  });
}

export function getAmazonProduct(id: AmazonProductId): AmazonProduct {
  return AMAZON_PRODUCTS[id];
}

export function amazonProductUrl(asin: string, tag: string = AMAZON_ASSOCIATE_TAG): string {
  return `https://www.amazon.com/dp/${asin}?tag=${tag}`;
}

export function productsForModule(module: AmazonModule): AmazonProduct[] {
  return module.productIds.map(getAmazonProduct);
}

/** Page-type tracking IDs inside the same Associates account. */
export const AMAZON_TAG_BY_SLUG: Record<string, string> = {
  "disney-world-packing-list": "pyp-pack-20",
  "disney-world-packing-list-kids": "pyp-pack-kids-20",
  deals: "pyp-deals-20",
  "disney-world-rides-for-toddlers-and-preschoolers": "pyp-toddler-20",
  "disney-world-with-baby-toddler": "pyp-toddler-20",
  "magic-kingdom-with-kids-rides-by-height": "pyp-heights-20",
  "epcot-with-kids-rides-by-height": "pyp-heights-20",
  "animal-kingdom-with-kids-rides-by-height": "pyp-heights-20",
  "universal-orlando-height-requirements": "pyp-heights-20",
  "universal-orlando-parks-with-kids": "pyp-gear-20",
};

export function getAmazonTagForSlug(slug?: string | null): string {
  if (!slug) return AMAZON_ASSOCIATE_TAG;
  return AMAZON_TAG_BY_SLUG[slug] ?? AMAZON_ASSOCIATE_TAG;
}

/** Former product ASINs that should resolve to a current catalog pick. */
const ASIN_ALIASES: Record<string, AmazonProductId> = {
  B005IHT94S: "thinkbaby-spf50",
  B09KV1QTQ8: "hydroflask-32oz",
  B08866RDYK: "stroller-fan-amacool",
  B0D14VV1JL: "bandaid-proheal",
  B077TQL1WG: "bandaid-proheal",
  B077TQL1WL: "bandaid-proheal",
  B077TQRHC3: "bandaid-proheal",
  B09HRW7ZHB: "frogg-toggs-chilly-pad",
  B0D7GCYHD5: "cloudten-ponchos-4pk",
};

const ASIN_TO_PRODUCT: Record<string, AmazonProductId> = {
  ...Object.fromEntries(
    Object.values(AMAZON_PRODUCTS).map((product) => [product.asin, product.id]),
  ),
  ...ASIN_ALIASES,
};

/**
 * Normalized Amazon search keys (spaces, lowercase) that have a clear
 * catalog pick. Unmapped searches are unlinked.
 */
const SEARCH_KEY_TO_PRODUCT: Record<string, AmazonProductId> = {
  "cooling towel kids": "frogg-toggs-chilly-pad",
  "cooling towel": "frogg-toggs-chilly-pad",
  "kids rain poncho": "cloudten-ponchos-4pk",
  "rain poncho": "cloudten-ponchos-4pk",
  "lightweight rain poncho": "cloudten-ponchos-4pk",
  "stroller fan": "stroller-fan-amacool",
  "usb stroller fan": "stroller-fan-amacool",
  "stroller fan with clip": "stroller-fan-amacool",
  "kids ear protection earmuffs": "prohear-032-kids",
  "kids ear muffs": "prohear-032-kids",
  "lightweight travel stroller": "stroller-3dlite",
  "travel stroller": "stroller-3dlite",
  "waterproof phone pouch": "hiearcool-pouch-2pk",
  "waterproof phone pouch or dry bag": "hiearcool-pouch-2pk",
  "packing cubes travel organizers": "bagsmart-cubes-6",
  "packing cubes": "bagsmart-cubes-6",
  "packing cubes or compression sacks": "bagsmart-cubes-6",
};

export function isAmazonUrl(href: string): boolean {
  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    return host === "amazon.com" || host.endsWith(".amazon.com") || host === "amzn.to" || host.endsWith(".amzn.to");
  } catch {
    return /amazon\.com|amzn\.to/i.test(href);
  }
}

export function extractAmazonAsin(href: string): string | null {
  const patterns = [
    /\/(?:dp|gp\/product|gp\/aw\/d|d)\/([A-Z0-9]{10})/i,
    /[?&]asin=([A-Z0-9]{10})/i,
  ];
  for (const pattern of patterns) {
    const match = href.match(pattern);
    if (match) return match[1].toUpperCase();
  }
  return null;
}

export function normalizeAmazonSearchKey(raw: string): string {
  let value = raw.replace(/\+/g, " ");
  try {
    value = decodeURIComponent(value);
  } catch {
    // keep the plus-normalized form
  }
  return value.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

export function extractAmazonSearchKey(href: string): string | null {
  try {
    const url = new URL(href);
    const key = url.searchParams.get("k") || url.searchParams.get("field-keywords");
    return key ? normalizeAmazonSearchKey(key) : null;
  } catch {
    const match = href.match(/[?&](?:k|field-keywords)=([^&]+)/i);
    return match ? normalizeAmazonSearchKey(match[1]) : null;
  }
}

export function productIdForAsin(asin: string): AmazonProductId | undefined {
  return ASIN_TO_PRODUCT[asin.toUpperCase()];
}

export function productIdForSearchKey(key: string): AmazonProductId | undefined {
  return SEARCH_KEY_TO_PRODUCT[normalizeAmazonSearchKey(key)];
}

/**
 * Route an Amazon href through the catalog.
 * Returns a /dp/ASIN?tag=PAGE_TAG URL, or null to unlink and keep the text.
 */
export function resolveAmazonHref(href: string, slug?: string | null): string | null {
  if (!isAmazonUrl(href)) return href;
  const tag = getAmazonTagForSlug(slug);
  const asin = extractAmazonAsin(href);
  if (asin) {
    const id = productIdForAsin(asin);
    return id ? amazonProductUrl(AMAZON_PRODUCTS[id].asin, tag) : null;
  }
  const key = extractAmazonSearchKey(href);
  if (key) {
    const id = productIdForSearchKey(key);
    return id ? amazonProductUrl(AMAZON_PRODUCTS[id].asin, tag) : null;
  }
  return null;
}
