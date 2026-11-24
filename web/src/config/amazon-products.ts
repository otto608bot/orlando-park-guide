/**
 * Plan Your Park Amazon product catalog.
 *
 * Single source for packing-list pick modules, post gear boxes, and /deals/
 * cards. Monthly link checks should walk AMAZON_PRODUCTS and hit each
 * https://www.amazon.com/dp/{asin} URL.
 *
 * Verified on November 24, 2026. Do not put prices or live star ratings
 * on the site. Tag stays planyourpar0a-20 until Bennett creates page-type
 * tracking IDs.
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
  | "prohear-032-kids";

export type AmazonProduct = {
  id: AmazonProductId;
  name: string;
  /** One-line why-it-fits for a Disney family. No prices, ratings, or "cheaper" claims. */
  why: string;
  asin: string;
};

export type AmazonModuleVariant = "pick-list" | "gear-box" | "deals-grid";

export type AmazonModule = {
  slug: string;
  variant: AmazonModuleVariant;
  title: string;
  intro: string;
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
  {
    slug: "disney-world-packing-list",
    variant: "pick-list",
    title: "What we'd actually pack",
    intro: "A short list of specific products we would put in the bag for a Disney World trip with kids. The full checklist follows.",
    productIds: FAMILY_PACK_IDS,
  },
  {
    slug: "disney-world-packing-list-kids",
    variant: "pick-list",
    title: "What we'd actually pack",
    intro: "Specific products we would pack for a Disney World trip with kids, including ear muffs for fireworks and loud shows. The full checklist follows.",
    productIds: KIDS_PACK_IDS,
  },
  {
    slug: "deals",
    variant: "deals-grid",
    title: "Park-ready gear",
    intro: "The same products we recommend on our packing lists, so you can order ahead and have them at home or at your hotel before you go.",
    productIds: FAMILY_PACK_IDS,
  },
  {
    slug: "disney-world-rides-for-toddlers-and-preschoolers",
    variant: "gear-box",
    title: "Worth packing for a toddler park day",
    intro: "A short list of gear that makes a Disney day with a toddler or preschooler easier.",
    productIds: [
      "stroller-3dlite",
      "stroller-fan-amacool",
      "prohear-032-kids",
      "thinkbaby-spf50",
      "autograph-castle",
    ],
  },
  {
    slug: "disney-world-with-baby-toddler",
    variant: "gear-box",
    title: "Worth packing with a baby or toddler",
    intro: "A few specific items that help on long, hot park days with little ones.",
    productIds: [
      "stroller-3dlite",
      "stroller-fan-amacool",
      "thinkbaby-spf50",
      "cloudten-ponchos-4pk",
    ],
  },
  {
    slug: "magic-kingdom-with-kids-rides-by-height",
    variant: "gear-box",
    title: "Worth packing for a Magic Kingdom day",
    intro: "Heat, afternoon storms, and water rides show up on a typical Magic Kingdom itinerary.",
    productIds: [
      "stroller-fan-amacool",
      "frogg-toggs-chilly-pad",
      "cloudten-ponchos-4pk",
      "anker-zolo-20k",
      "hiearcool-pouch-2pk",
    ],
  },
  {
    slug: "epcot-with-kids-rides-by-height",
    variant: "gear-box",
    title: "Worth packing for an EPCOT day",
    intro: "A short park-day kit for heat, storms, and a phone that needs to last.",
    productIds: [
      "stroller-fan-amacool",
      "frogg-toggs-chilly-pad",
      "cloudten-ponchos-4pk",
      "anker-zolo-20k",
    ],
  },
  {
    slug: "animal-kingdom-with-kids-rides-by-height",
    variant: "gear-box",
    title: "Worth packing for an Animal Kingdom day",
    intro: "Animal Kingdom is a walking park with little shade in places. These help.",
    productIds: [
      "stroller-fan-amacool",
      "frogg-toggs-chilly-pad",
      "cloudten-ponchos-4pk",
      "anker-zolo-20k",
    ],
  },
  {
    slug: "universal-orlando-parks-with-kids",
    variant: "gear-box",
    title: "Worth packing for a Universal day",
    intro: "A short list for heat, storms, and the water rides at Universal Orlando.",
    productIds: [
      "stroller-3dlite",
      "cloudten-ponchos-4pk",
      "hiearcool-pouch-2pk",
      "anker-zolo-20k",
    ],
  },
  {
    slug: "universal-orlando-height-requirements",
    variant: "gear-box",
    title: "Worth packing for a Universal park day",
    intro: "A few items that help on a long day moving between Universal's parks.",
    productIds: [
      "anker-zolo-20k",
      "frogg-toggs-chilly-pad",
      "cloudten-ponchos-4pk",
    ],
  },
];

const MODULES_BY_SLUG: Record<string, AmazonModule> = Object.fromEntries(
  AMAZON_MODULES.map((module) => [module.slug, module]),
);

export function getAmazonModule(slug: string): AmazonModule | undefined {
  return MODULES_BY_SLUG[slug];
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
