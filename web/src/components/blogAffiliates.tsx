import React from 'react';
/**
 * Keyword-based affiliate link injection for blog post text.
 * Uses Amazon search links — never 404, credits full cart.
 * This runs at render time, so it works regardless of Sanity CDN cache state.
 */

export interface AffiliateLink {
  keywords: string[];
  url: string;
}

// Amazon Associates search links — all use /s?k= format (never 404, credits full cart)
export const blogAffiliateLinks: AffiliateLink[] = [
  {
    keywords: ['comfortable walking shoes', 'walking shoes', 'running shoes', 'tennis shoes', 'athletic shoes'],
    url: 'https://www.amazon.com/s?k=comfortable+walking+shoes+for+theme+park&tag=planyourpark-20',
  },
  {
    keywords: ['sunscreen', 'spf 50', 'spf 70', 'suncreen', 'sunscreen lotion'],
    url: 'https://www.amazon.com/s?k=sunscreen+spf+70+lotion+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['stroller fan', 'clip fan', 'usb stroller fan'],
    url: 'https://www.amazon.com/s?k=usb+stroller+fan+clip+disney&tag=planyourpark-20',
  },
  {
    keywords: ['phone charger', 'power bank', 'portable charger', 'usb charger', '20000mah'],
    url: 'https://www.amazon.com/s?k=portable+phone+charger+20000mah+disney&tag=planyourpark-20',
  },
  {
    keywords: ['rain poncho', 'poncho', 'disposable poncho', 'rain jackets'],
    url: 'https://www.amazon.com/s?k=rain+poncho+20+pack+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['cooling towel', 'cool towel', 'cooling neck gaiter'],
    url: 'https://www.amazon.com/s?k=cooling+towel+disney+world+hot+weather&tag=planyourpark-20',
  },
  {
    keywords: ['baby carrier', 'child carrier', 'ergonomic carrier', 'baby wrap'],
    url: 'https://www.amazon.com/s?k=baby+carrier+for+theme+park+disney&tag=planyourpark-20',
  },
  {
    keywords: ['white noise', 'noise machine', 'sound machine', 'travel white noise'],
    url: 'https://www.amazon.com/s?k=white+noise+machine+travel+portable&tag=planyourpark-20',
  },
  {
    keywords: ['water bottle', 'insulated bottle', 'hydro flask', 'reusable water bottle'],
    url: 'https://www.amazon.com/s?k=insulated+water+bottle+32oz+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['princess dress', 'costume', 'disney princess dress'],
    url: 'https://www.amazon.com/s?k=disney+princess+dress+costume+for+girl&tag=planyourpark-20',
  },
  {
    keywords: ['autograph book', 'disney autograph', 'autograph book for kids'],
    url: 'https://www.amazon.com/s?k=disney+autograph+book+for+kids&tag=planyourpark-20',
  },
  {
    keywords: ['magic band', 'magicband', 'disney magic band'],
    url: 'https://www.amazon.com/s?k=disney+magic+band+plus&tag=planyourpark-20',
  },
  {
    keywords: ['blister bandaids', 'moleskin', 'blister prevention', ' blister pads'],
    url: 'https://www.amazon.com/s?k=moleskin+blister+pads+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['snacks', 'granola bars', 'protein bars', 'travel snacks', 'snack bars'],
    url: 'https://www.amazon.com/s?k=travel+snacks+granola+bars+for+disney&tag=planyourpark-20',
  },
  {
    keywords: ['packing cubes', 'packing organizers', 'travel cubes'],
    url: 'https://www.amazon.com/s?k=packing+cubes+travel+organizers&tag=planyourpark-20',
  },
  {
    keywords: ['waterproof phone pouch', 'waterproof phone case', 'phone pouch'],
    url: 'https://www.amazon.com/s?k=waterproof+phone+pouch+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['portable speaker', 'travel speaker', 'bluetooth speaker'],
    url: 'https://www.amazon.com/s?k=portable+bluetooth+speaker+travel&tag=planyourpark-20',
  },
  {
    keywords: ['lip balm with spf', 'lip balm spf', 'spf lip balm'],
    url: 'https://www.amazon.com/s?k=lip+balm+with+spf+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['compression socks', 'travel compression socks'],
    url: 'https://www.amazon.com/s?k=compression+socks+travel+disney&tag=planyourpark-20',
  },
  {
    keywords: ['handheld fan', 'mini fan', 'travel fan', 'usb handheld fan'],
    url: 'https://www.amazon.com/s?k=usb+handheld+fan+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['wide-brim hat', 'sun hat', 'visors', 'sun hat for women'],
    url: 'https://www.amazon.com/s?k=wide+brim+sun+hat+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['motion sickness bands', 'sea bands', 'motion sickness wristband'],
    url: 'https://www.amazon.com/s?k=motion+sickness+wristband+disney&tag=planyourpark-20',
  },
  {
    keywords: ['anti-nausea medication', 'dramamine', 'motion sickness medicine'],
    url: 'https://www.amazon.com/s?k=motion+sickness+medication+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['hand sanitizer', 'travel hand sanitizer'],
    url: 'https://www.amazon.com/s?k=hand+sanitizer+travel+size+disney&tag=planyourpark-20',
  },
  {
    keywords: ['allergy medication', 'benadryl', 'zyrtec', 'claritin'],
    url: 'https://www.amazon.com/s?k=allergy+medication+travel+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['pain relievers', 'ibuprofen', 'acetaminophen', 'tylenol'],
    url: 'https://www.amazon.com/s?k=pain+relievers+travel+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['small backpack', 'daypack', 'park bag', 'crossbody bag'],
    url: 'https://www.amazon.com/s?k=small+backpack+for+disney+world+park&tag=planyourpark-20',
  },
  {
    keywords: ['ziplock bags', 'plastic bags', 'storage bags'],
    url: 'https://www.amazon.com/s?k=ziplock+bags+travel+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['usb car charger', 'car charger adapter'],
    url: 'https://www.amazon.com/s?k=usb+car+charger+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['extra socks', 'athletic socks', 'socks for walking'],
    url: 'https://www.amazon.com/s?k=extra+socks+disney+world+walking&tag=planyourpark-20',
  },
  {
    keywords: ['lightweight rain jacket', 'travel rain jacket', 'packable rain jacket'],
    url: 'https://www.amazon.com/s?k=lightweight+rain+jacket+travel+disney&tag=planyourpark-20',
  },
  {
    keywords: ['stroller rain cover', 'umbrella stroller rain cover'],
    url: 'https://www.amazon.com/s?k=stroller+rain+cover+disney+world&tag=planyourpark-20',
  },
  {
    keywords: ['change of clothes', 'travel clothes'],
    url: 'https://www.amazon.com/s?k=travel+clothes+disney+world&tag=planyourpark-20',
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
