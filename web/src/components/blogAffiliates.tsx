import React from 'react';
/**
 * Keyword-based affiliate link injection for blog post text.
 * Amazon search links (/s?k=) — stable, tag=planyourpark-20.
 *
 * Rules (2026-07-23):
 * - Prefer long, specific product phrases only
 * - At most ONE affiliate link per text node
 * - Never auto-link medical drug names
 * - Never auto-link ultra-generic single words (snacks, poncho, …)
 * - Callers should NOT run this on description/note spans
 */

export interface AffiliateLink {
  keywords: string[];
  url: string;
}

// Longer / more specific phrases first within each entry.
export const blogAffiliateLinks: AffiliateLink[] = [
  {
    keywords: ['comfortable walking shoes', 'walking shoes', 'athletic shoes'],
    url: 'https://www.amazon.com/s?k=comfortable+walking+shoes+for+theme+park&tag=planyourpark-20',
  },
  {
    keywords: ['sunscreen spf 70+', 'sunscreen spf 70', 'sunscreen lotion', 'sunscreen'],
    url: 'https://www.amazon.com/s?k=sunscreen+spf+70+lotion+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['stroller fan with clip', 'usb stroller fan', 'stroller fan'],
    url: 'https://www.amazon.com/s?k=usb+stroller+fan+clip+disney&tag=planyourpark-20',
  },
  {
    keywords: ['portable phone charger', 'portable charger', 'phone charger', 'power bank'],
    url: 'https://www.amazon.com/s?k=portable+phone+charger+20000mah+disney&tag=planyourpark-20',
  },
  {
    keywords: ['lightweight rain poncho', 'full-coverage rain poncho', 'rain poncho', 'disposable poncho'],
    url: 'https://www.amazon.com/s?k=rain+poncho+20+pack+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['cooling towel', 'cooling neck gaiter'],
    url: 'https://www.amazon.com/s?k=cooling+towel+disney+world+hot+weather&tag=planyourpark-20',
  },
  {
    keywords: ['baby carrier', 'ergonomic carrier'],
    url: 'https://www.amazon.com/s?k=baby+carrier+for+theme+park+disney&tag=planyourpark-20',
  },
  {
    keywords: ['white noise machine', 'travel white noise', 'sound machine'],
    url: 'https://www.amazon.com/s?k=white+noise+machine+travel+portable&tag=planyourpark-20',
  },
  {
    keywords: ['insulated water bottle', 'reusable water bottle', 'water bottle'],
    url: 'https://www.amazon.com/s?k=insulated+water+bottle+32oz+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['disney princess dress', 'princess dress'],
    url: 'https://www.amazon.com/s?k=disney+princess+dress+costume+for+girl&tag=planyourpark-20',
  },
  {
    keywords: ['autograph book for kids', 'autograph book', 'disney autograph'],
    url: 'https://www.amazon.com/s?k=disney+autograph+book+for+kids&tag=planyourpark-20',
  },
  {
    keywords: ['disney magic band', 'magic band', 'magicband'],
    url: 'https://www.amazon.com/s?k=disney+magic+band+plus&tag=planyourpark-20',
  },
  {
    keywords: ['blister prevention', 'blister pads', 'moleskin'],
    url: 'https://www.amazon.com/s?k=moleskin+blister+pads+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['travel snacks', 'granola bars', 'protein bars', 'snack bars'],
    url: 'https://www.amazon.com/s?k=travel+snacks+granola+bars+for+disney&tag=planyourpark-20',
  },
  {
    keywords: ['packing cubes or compression sacks', 'packing cubes', 'packing organizers', 'compression sacks'],
    url: 'https://www.amazon.com/s?k=packing+cubes+travel+organizers&tag=planyourpark-20',
  },
  {
    keywords: ['waterproof phone pouch or dry bag', 'waterproof phone pouch', 'waterproof phone case'],
    url: 'https://www.amazon.com/s?k=waterproof+phone+pouch+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['portable bluetooth speaker', 'portable speaker', 'travel speaker'],
    url: 'https://www.amazon.com/s?k=portable+bluetooth+speaker+travel&tag=planyourpark-20',
  },
  {
    keywords: ['lip balm with spf', 'spf lip balm', 'lip balm spf'],
    url: 'https://www.amazon.com/s?k=lip+balm+with+spf+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['travel compression socks', 'compression socks'],
    url: 'https://www.amazon.com/s?k=compression+socks+travel+disney&tag=planyourpark-20',
  },
  {
    keywords: ['usb handheld fan', 'handheld fan', 'travel fan'],
    url: 'https://www.amazon.com/s?k=usb+handheld+fan+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['wide-brim hat', 'sun hat for women', 'sun hat'],
    url: 'https://www.amazon.com/s?k=wide+brim+sun+hat+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['motion sickness wristband', 'motion sickness bands', 'sea bands'],
    url: 'https://www.amazon.com/s?k=motion+sickness+wristband+disney&tag=planyourpark-20',
  },
  {
    keywords: ['travel hand sanitizer', 'hand sanitizer'],
    url: 'https://www.amazon.com/s?k=hand+sanitizer+travel+size+disney&tag=planyourpark-20',
  },
  {
    keywords: ['small backpack or diaper bag', 'small personal backpack', 'small backpack', 'crossbody bag'],
    url: 'https://www.amazon.com/s?k=small+backpack+for+disney+world+park&tag=planyourpark-20',
  },
  {
    keywords: ['ziplock bags', 'storage bags'],
    url: 'https://www.amazon.com/s?k=ziplock+bags+travel+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['usb car charger', 'car charger adapter'],
    url: 'https://www.amazon.com/s?k=usb+car+charger+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['lightweight rain jacket', 'packable rain jacket', 'travel rain jacket'],
    url: 'https://www.amazon.com/s?k=lightweight+rain+jacket+travel+disney&tag=planyourpark-20',
  },
  {
    keywords: ['stroller rain cover', 'umbrella stroller rain cover'],
    url: 'https://www.amazon.com/s?k=stroller+rain+cover+disney+world&tag=planyourpark-20',
  },
];

type Segment = { text: string; url?: string };

function isWordBoundary(text: string, start: number, end: number): boolean {
  const before = start === 0 ? ' ' : text[start - 1];
  const after = end >= text.length ? ' ' : text[end];
  // Allow boundaries at whitespace / punctuation / string edges
  const boundary = /[\s,.;:!?()[\]"'“”‘’\/+\-]/
  return boundary.test(before) && boundary.test(after);
}

/**
 * Split text into segments based on affiliate link keywords.
 * At most one link per text node. Longest keyword wins at the earliest index.
 */
function segmentize(text: string): Segment[] {
  let best: { idx: number; len: number; url: string; matched: string } | null = null;

  for (const link of blogAffiliateLinks) {
    for (const kw of link.keywords) {
      if (kw.length < 8 && !kw.includes(' ')) continue; // skip short single-tokens
      const lower = text.toLowerCase();
      const needle = kw.toLowerCase();
      let from = 0;
      while (from < lower.length) {
        const idx = lower.indexOf(needle, from);
        if (idx === -1) break;
        const end = idx + kw.length;
        if (isWordBoundary(text, idx, end)) {
          const matched = text.substring(idx, end);
          if (
            !best ||
            idx < best.idx ||
            (idx === best.idx && kw.length > best.len)
          ) {
            best = { idx, len: kw.length, url: link.url, matched };
          }
          break; // first occurrence of this kw is enough
        }
        from = idx + 1;
      }
    }
  }

  if (!best) {
    return [{ text }];
  }

  const segments: Segment[] = [];
  if (best.idx > 0) {
    segments.push({ text: text.substring(0, best.idx) });
  }
  segments.push({ text: best.matched, url: best.url });
  if (best.idx + best.len < text.length) {
    segments.push({ text: text.substring(best.idx + best.len) });
  }
  return segments;
}

/**
 * Process text content and return React nodes with at most one affiliate link.
 * Does not recurse into already-built React elements (avoids double-linking).
 */
export function processTextWithAffiliates(
  children: React.ReactNode
): React.ReactNode {
  if (Array.isArray(children)) {
    return children.map((child, index) => (
      <React.Fragment key={index}>{processTextWithAffiliates(child)}</React.Fragment>
    ));
  }

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
          rel="noopener noreferrer sponsored"
          className="affiliate-link"
        >
          {seg.text}
        </a>
      ) : (
        <React.Fragment key={i}>{seg.text}</React.Fragment>
      )
    );
  }

  // Leave nested React nodes alone (already-rendered marks, links, etc.)
  return children;
}
