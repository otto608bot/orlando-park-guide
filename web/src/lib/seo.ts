import type { Metadata } from "next";

export const SITE_NAME = "Plan Your Park";
export const SITE_URL = "https://planyourpark.com";

/** Public brand handles for Organization sameAs (no X channel yet). */
export const SITE_SAME_AS = [
  "https://www.facebook.com/people/Plan-Your-Park/61582020494983/",
  "https://www.instagram.com/planyourparknow/",
  "https://www.pinterest.com/PlanYourPark/",
] as const;

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

/**
 * Sitewide Organization + WebSite JSON-LD for knowledge panel / brand entity.
 * Inject once in root layout (home had zero ld+json on production before this pack).
 */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SITE_LOGO_URL = `${SITE_URL}/logo-full.png`;

export function getOrganizationRef(): Record<string, unknown> {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: SITE_LOGO_URL,
    },
  };
}

export function getSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...getOrganizationRef(),
        description:
          "Family planning tools for Orlando theme parks — filter rides by kid height and thrill, compare parks, and book with trusted partner pricing.",
        sameAs: [...SITE_SAME_AS],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "Orlando parks ride finder for kids: Disney, Universal, Epic Universe, SeaWorld & LEGOLAND by height and thrill.",
        publisher: { "@id": ORG_ID },
        inLanguage: "en-US",
      },
    ],
  };
}

/** Parks hub: CollectionPage + park ItemList + FAQ (matches on-page FAQ copy). */
export function getParksHubJsonLd(
  parks: Array<{ name?: string | null; slug?: { current?: string | null } | string | null }>,
): Record<string, unknown> {
  const pageUrl = `${SITE_URL}/parks/`;
  const items = parks
    .map((park, index) => {
      const slug =
        typeof park.slug === "string" ? park.slug : park.slug?.current?.trim() || "";
      const name = park.name?.trim();
      if (!slug || !name) return null;
      return {
        "@type": "ListItem",
        position: index + 1,
        name,
        url: `${SITE_URL}/parks/${slug}/`,
      };
    })
    .filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "All Parks in Orlando for Families",
        description:
          "Compare Disney World, Universal Orlando (including Epic Universe), SeaWorld, and LEGOLAND for kids — then jump into height-filtered rides.",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORG_ID },
        mainEntity: { "@id": `${pageUrl}#itemlist` },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#itemlist`,
        name: "Orlando theme parks for families",
        numberOfItems: items.length,
        itemListElement: items,
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "How many theme parks are in Orlando?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Families usually plan around four Walt Disney World parks, three Universal Orlando parks (Universal Studios Florida, Islands of Adventure, and Epic Universe), plus SeaWorld Orlando and LEGOLAND Florida. That is the core set most multi-day trips choose from.",
            },
          },
          {
            "@type": "Question",
            name: "Disney or Universal with kids?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Disney (especially Magic Kingdom) is usually easier with younger kids and classic characters. Universal wins for older kids who want coasters, Super Nintendo World, and Epic Universe lands — if they meet height requirements. Many families do both on longer trips.",
            },
          },
          {
            "@type": "Question",
            name: "How do I know which rides my kids can ride?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Use the Plan Your Park ride finder and filter by your child's height (for example ~40 inches), then open park pages for Magic Kingdom, Epic Universe, and the rest. Share the filtered link with your group before you buy tickets.",
            },
          },
        ],
      },
    ],
  };
}

/** Rides hub: CollectionPage + shareable height-preset ItemList + FAQ. */
export function getRidesHubJsonLd(
  presets: Array<{ href: string; label: string; blurb: string }>,
  rideCount: number,
): Record<string, unknown> {
  const pageUrl = `${SITE_URL}/rides/`;
  const items = presets.map((preset, index) => {
    const href = preset.href.startsWith("http") ? preset.href : `${SITE_URL}${preset.href}`;
    return {
      "@type": "ListItem",
      position: index + 1,
      name: preset.label,
      description: preset.blurb,
      url: href,
    };
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Orlando Ride Finder by Height",
        description: `Filter ${rideCount} rides across Disney, Universal, Epic Universe, SeaWorld, and LEGOLAND by kid height and thrill. Shareable presets for under 40", 44", 48", and calm rides.`,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORG_ID },
        mainEntity: { "@id": `${pageUrl}#presets` },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#presets`,
        name: "Shareable ride height presets",
        numberOfItems: items.length,
        itemListElement: items,
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I filter Orlando rides by my child's height?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Open the Plan Your Park ride finder and set your child's height (for example ~40 inches). Use a shareable preset, or pick a park plus height so your group only sees rides that kid can board.",
            },
          },
          {
            "@type": "Question",
            name: "Which height presets should families start with?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Start with under ~40 inches for preschoolers, then 44 inches and 48 inches as thrills unlock. Park-specific presets (Magic Kingdom, Hollywood Studios, Epic Universe, Islands of Adventure, SeaWorld, LEGOLAND) help when you already know which park day you are building.",
            },
          },
          {
            "@type": "Question",
            name: "Do height filters replace official park rules?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Filters help you plan from published height bands, but cast members enforce the park's current posted requirements at the ride. Recheck official signs on trip day, especially for new or refurbished attractions.",
            },
          },
        ],
      },
    ],
  };
}

/** About page: AboutPage + trust FAQ for families. */
export function getAboutJsonLd(): Record<string, unknown> {
  const pageUrl = `${SITE_URL}/about/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "About Plan Your Park — Family Orlando Park Planning",
        description:
          "Plan Your Park helps families choose Orlando parks and rides by kid height, thrill, and trip fit — then compare tickets through trusted partners.",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORG_ID },
        mainEntity: { "@id": ORG_ID },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What is Plan Your Park?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Plan Your Park is a free family planning site for Orlando theme parks. Filter rides by kid height and thrill, compare Disney, Universal, Epic Universe, SeaWorld, and LEGOLAND, and open trusted ticket or packing links when you are ready.",
            },
          },
          {
            "@type": "Question",
            name: "How does Plan Your Park make money?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Some ticket and product links are affiliate links (including ticket partners and Amazon). If you buy through them, we may earn a commission at no extra cost to you. See the affiliate disclosure for details.",
            },
          },
        ],
      },
    ],
  };
}

/** Affiliate disclosure: WebPage + clear commercial FAQ. */
export function getAffiliateDisclosureJsonLd(): Record<string, unknown> {
  const pageUrl = `${SITE_URL}/affiliate-disclosure/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Affiliate Disclosure — Plan Your Park",
        description:
          "How Plan Your Park earns commissions from ticket and product links, and how that relates to family trip recommendations.",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORG_ID },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Does Plan Your Park use affiliate links?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Ticket links (for example Undercover Tourist via CJ) and some packing or gear links (Amazon Associates tag planyourpark-20) may earn a commission if you buy after clicking. There is no extra cost to you.",
            },
          },
          {
            "@type": "Question",
            name: "Do affiliate links change ride height advice?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Height filters and park-fit guides are product features first. Affiliate links support maintaining the tools and guides; they should not replace kid-height or park-fit recommendations.",
            },
          },
        ],
      },
    ],
  };
}

/** Blog hub: CollectionPage + featured guide ItemList + planning FAQ. */
export function getBlogHubJsonLd(
  posts: Array<{ title?: string | null; slug?: { current?: string | null } | string | null; excerpt?: string | null }>,
): Record<string, unknown> {
  const pageUrl = `${SITE_URL}/blog/`;
  const items = posts
    .map((post, index) => {
      const slug = typeof post.slug === "string" ? post.slug : post.slug?.current?.trim() || "";
      const title = post.title?.trim();
      if (!slug || !title) return null;
      return {
        "@type": "ListItem",
        position: index + 1,
        name: title,
        description: post.excerpt?.trim() || undefined,
        url: `${SITE_URL}/blog/${slug}/`,
      };
    })
    .filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Orlando Theme Park Guides for Families with Kids",
        description:
          "Family guides for Disney, Universal, and Epic Universe: kid ride heights, 1-day plans, packing lists, and which Orlando park fits your kids.",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORG_ID },
        mainEntity: { "@id": `${pageUrl}#itemlist` },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#itemlist`,
        name: "Featured family park guides",
        numberOfItems: items.length,
        itemListElement: items,
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Where should families start planning an Orlando park trip?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Start by comparing parks, filter rides by your child's height (for example ~40 inches), then follow a proven day plan like Epic Universe or Magic Kingdom under 40 inches before you buy tickets.",
            },
          },
          {
            "@type": "Question",
            name: "Which Plan Your Park guides help most with kids?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Families use the ride finder by height, Magic Kingdom rides under 40 inches, Epic Universe 1-day plan, kids packing list, and Universal height requirements the most when choosing parks and rides.",
            },
          },
        ],
      },
    ],
  };
}

/** Character dining hub: CollectionPage + sample ItemList + FAQ. */
export function getCharacterDiningJsonLd(
  venues: Array<{ name?: string | null; park?: string | null; description?: string | null }>,
): Record<string, unknown> {
  const pageUrl = `${SITE_URL}/character-dining/`;
  const items = venues
    .slice(0, 12)
    .map((venue, index) => {
      const name = venue.name?.trim();
      if (!name) return null;
      return {
        "@type": "ListItem",
        position: index + 1,
        name,
        description: [venue.park, venue.description].filter(Boolean).join(" — ") || undefined,
      };
    })
    .filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Disney & Universal Character Dining with Kids",
        description:
          "Compare character dining at Disney World and Universal Orlando — meals, parks, and kid-friendly meet-and-greet options in one list.",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORG_ID },
        mainEntity: { "@id": `${pageUrl}#itemlist` },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#itemlist`,
        name: "Character dining venues for families",
        numberOfItems: items.length,
        itemListElement: items,
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Is character dining worth it with kids?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Often yes for younger kids who want guaranteed character time without standing in a separate meet-and-greet line. Book early, match the meal to your park day, and leave buffer time for height-restricted rides after breakfast or dinner.",
            },
          },
          {
            "@type": "Question",
            name: "Should we book character dining before tickets?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Decide which parks fit your kids first (height filters help), then book dining reservations for those park days. Ticket deals and the ride finder are useful before you lock a pricey character meal.",
            },
          },
        ],
      },
    ],
  };
}

/** Deals hub: CollectionPage + ticket destination ItemList + FAQ. */
export function getDealsJsonLd(
  destinations: Array<{ name: string; description: string }>,
): Record<string, unknown> {
  const pageUrl = `${SITE_URL}/deals/`;
  const items = destinations.map((dest, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: dest.name,
    description: dest.description,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Orlando Theme Park Ticket Deals for Families",
        description:
          "Compare Disney, Universal, Epic Universe, and SeaWorld ticket deal options for family trips — plus packing gear parents actually use.",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORG_ID },
        mainEntity: { "@id": `${pageUrl}#itemlist` },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#itemlist`,
        name: "Family ticket deal destinations",
        numberOfItems: items.length,
        itemListElement: items,
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "How do families save on Orlando theme park tickets?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Compare multi-day Disney and Universal options through trusted partners, visit mid-week when possible, and only buy park days your kids can actually use — check height requirements first so you do not overbuy thrill parks.",
            },
          },
          {
            "@type": "Question",
            name: "Are these ticket links affiliate links?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Ticket and gear links may be affiliate links. If you buy through them, Plan Your Park may earn a commission at no extra cost to you. See the full affiliate disclosure on the site.",
            },
          },
        ],
      },
    ],
  };
}

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  keywords?: Metadata["keywords"];
  openGraphType?: "website" | "article";
  /** Absolute or site-relative image path for OG/Twitter. Defaults to Disney-World.webp. */
  image?: string;
  imageAlt?: string;
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords,
  openGraphType = "website",
  image,
  imageAlt,
}: PageMetadataInput): Metadata {
  const canonical = normalizePath(path);
  const imagePath = image || "/Disney-World.webp";
  const imageUrl = imagePath.startsWith("http") ? imagePath : `${SITE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  const alt = imageAlt || `${SITE_NAME} — Orlando parks for families`;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_US",
      type: openGraphType,
      images: [{ url: imageUrl, alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
