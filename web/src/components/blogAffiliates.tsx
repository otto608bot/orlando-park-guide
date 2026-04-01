import React from 'react';
/**
 * Keyword-based affiliate link injection for blog post text.
 * This runs at render time, so it works regardless of Sanity CDN cache state.
 */

export interface AffiliateLink {
  keywords: string[];
  url: string;
}

// Amazon Associates links — add more as needed
export const blogAffiliateLinks: AffiliateLink[] = [
  {
    keywords: ['comfortable walking shoes', 'walking shoes', 'running shoes', 'tennis shoes'],
    url: 'https://www.amazon.com/dp/B07TS2HMH1?tag=planyourpark-20',
  },
  {
    keywords: ['sunscreen', 'spf 50', 'spf 70', 'suncreen'],
    url: 'https://www.amazon.com/dp/B005IHT94S?tag=planyourpark-20',
  },
  {
    keywords: ['stroller fan', 'clip fan'],
    url: 'https://www.amazon.com/dp/B08866RDYK?tag=planyourpark-20',
  },
  {
    keywords: ['phone charger', 'power bank', 'portable charger', 'usb charger'],
    url: 'https://www.amazon.com/dp/B07YNMW3CX?tag=planyourpark-20',
  },
  {
    keywords: ['rain poncho', 'poncho', 'disposable poncho'],
    url: 'https://www.amazon.com/dp/B018THPISO?tag=planyourpark-20',
  },
  {
    keywords: ['cooling towel', 'cool towel'],
    url: 'https://www.amazon.com/dp/B001B5I57I?tag=planyourpark-20',
  },
  {
    keywords: ['baby carrier', 'child carrier', 'ergonomic carrier'],
    url: 'https://www.amazon.com/dp/B00KC4VPNU?tag=planyourpark-20',
  },
  {
    keywords: ['white noise', 'noise machine', 'sound machine'],
    url: 'https://www.amazon.com/dp/B00E6RW2F0?tag=planyourpark-20',
  },
  {
    keywords: ['water bottle', 'insulated bottle', 'hydro flask'],
    url: 'https://www.amazon.com/dp/B09KV1QTQ8?tag=planyourpark-20',
  },
  {
    keywords: ['princess dress', 'costume'],
    url: 'https://www.amazon.com/dp/B07Q1OZ7ZY?tag=planyourpark-20',
  },
  {
    keywords: ['autograph book', 'disney autograph'],
    url: 'https://www.amazon.com/dp/B07TYSWSP3?tag=planyourpark-20',
  },
  {
    keywords: ['magic band', 'magicband'],
    url: 'https://www.amazon.com/dp/B07YP9X2WL?tag=planyourpark-20',
  },
  {
    keywords: ['blister bandaids', 'moleskin', 'blister prevention'],
    url: 'https://www.amazon.com/dp/B00VW2LHZK?tag=planyourpark-20',
  },
  {
    keywords: ['snacks', 'granola bars', 'protein bars', 'goldfish'],
    url: 'https://www.amazon.com/dp/B08XY2C1VW?tag=planyourpark-20',
  },
];

type Segment = { text: string; url?: string };

/**
 * Split text into segments based on affiliate link keywords.
 * Each segment is either plain text or a hyperlink.
 */
function segmentize(text: string): Segment[] {
  const result: Segment[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let earliestIdx = -1;
    let earliestUrl = '';
    let earliestKw = '';

    for (const link of blogAffiliateLinks) {
      for (const kw of link.keywords) {
        const idx = remaining.toLowerCase().indexOf(kw.toLowerCase());
        if (idx !== -1 && (earliestIdx === -1 || idx < earliestIdx)) {
          earliestIdx = idx;
          earliestUrl = link.url;
          earliestKw = remaining.substring(idx, idx + kw.length);
        }
      }
    }

    if (earliestIdx === -1) {
      result.push({ text: remaining });
      break;
    }

    if (earliestIdx > 0) {
      result.push({ text: remaining.substring(0, earliestIdx) });
    }

    result.push({ text: earliestKw, url: earliestUrl });
    remaining = remaining.substring(earliestIdx + earliestKw.length);
  }

  return result;
}

/**
 * Process text content and return React nodes with affiliate links injected.
 * Works with both plain strings and nested React elements (e.g., from marks).
 */
export function processTextWithAffiliates(
  children: React.ReactNode
): React.ReactNode {
  // If it's a string, process it directly
  if (typeof children === 'string') {
    const segments = segmentize(children);
    if (segments.length === 1 && !segments[0].url) {
      return children;
    }
    return segments.map((seg, i) =>
      seg.url ? (
        <a
          key={i}
          href={seg.url}
          target="_blank"
          rel="noopener noreferrer"
          className="affiliate-link"
        >
          {seg.text}
        </a>
      ) : (
        <React.Fragment key={i}>{seg.text}</React.Fragment>
      )
    );
  }

  // For non-string children (e.g., wrapped in strong, em, link marks), return as-is
  // The keyword injection only applies to plain text spans
  return children;
}
