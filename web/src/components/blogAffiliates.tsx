import React from 'react';
import {
  AMAZON_LINK_REL,
  amazonProductUrl,
  getAmazonProduct,
  getAmazonTagForSlug,
  type AmazonProductId,
} from '@/config/amazon-products';

/**
 * Keyword-based affiliate link injection for blog post text.
 * Every Amazon href is a catalog /dp/ASIN with the page's tracking tag.
 * Keywords without a verified pick are left as plain text.
 *
 * Rules (2026-07-23, updated 2026-11-24):
 * - Prefer long, specific product phrases only
 * - At most ONE affiliate link per text node
 * - Never auto-link medical drug names
 * - Never auto-link ultra-generic single words (snacks, poncho, …)
 * - Callers should NOT run this on description/note spans
 */

export interface AffiliateLink {
  keywords: string[];
  productId: AmazonProductId;
}

// Longer / more specific phrases first within each entry.
export const blogAffiliateLinks: AffiliateLink[] = [
  {
    keywords: ['sunscreen spf 70+', 'sunscreen spf 70', 'sunscreen lotion', 'sunscreen'],
    productId: 'thinkbaby-spf50',
  },
  {
    keywords: ['stroller fan with clip', 'usb stroller fan', 'stroller fan'],
    productId: 'stroller-fan-amacool',
  },
  {
    keywords: ['portable phone charger', 'portable charger', 'phone charger', 'power bank'],
    productId: 'anker-zolo-20k',
  },
  {
    keywords: ['lightweight rain poncho', 'full-coverage rain poncho', 'kids rain poncho', 'rain poncho', 'disposable poncho'],
    productId: 'cloudten-ponchos-4pk',
  },
  {
    keywords: ['cooling towel', 'cooling neck gaiter'],
    productId: 'frogg-toggs-chilly-pad',
  },
  {
    keywords: ['insulated water bottle', 'reusable water bottle', 'water bottle'],
    productId: 'hydroflask-32oz',
  },
  {
    keywords: ['autograph book for kids', 'autograph book', 'disney autograph'],
    productId: 'autograph-castle',
  },
  {
    keywords: ['blister prevention', 'blister pads', 'moleskin'],
    productId: 'bandaid-proheal',
  },
  {
    keywords: ['packing cubes or compression sacks', 'packing cubes', 'packing organizers'],
    productId: 'bagsmart-cubes-6',
  },
  {
    keywords: ['waterproof phone pouch or dry bag', 'waterproof phone pouch', 'waterproof phone case'],
    productId: 'hiearcool-pouch-2pk',
  },
  {
    keywords: ['kids ear protection earmuffs', 'ear protection earmuffs', 'kids ear muffs'],
    productId: 'prohear-032-kids',
  },
  {
    keywords: ['lightweight travel stroller', 'travel stroller'],
    productId: 'stroller-3dlite',
  },
];

type Segment = { text: string; productId?: AmazonProductId };

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
  let best: { idx: number; len: number; productId: AmazonProductId; matched: string } | null = null;

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
            best = { idx, len: kw.length, productId: link.productId, matched };
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
  segments.push({ text: best.matched, productId: best.productId });
  if (best.idx + best.len < text.length) {
    segments.push({ text: text.substring(best.idx + best.len) });
  }
  return segments;
}

/**
 * Process text content and return React nodes with at most one affiliate link.
 * Does not recurse into already-built React elements (avoids double-linking).
 * The page slug selects the Associates tracking ID.
 */
export function processTextWithAffiliates(
  children: React.ReactNode,
  slug?: string,
): React.ReactNode {
  if (Array.isArray(children)) {
    return children.map((child, index) => (
      <React.Fragment key={index}>{processTextWithAffiliates(child, slug)}</React.Fragment>
    ));
  }

  if (typeof children === 'string') {
    const segments = segmentize(children);
    if (segments.length === 1 && !segments[0].productId) {
      return children;
    }
    const tag = getAmazonTagForSlug(slug);
    return segments.map((seg, i) =>
      seg.productId ? (
        <a
          key={i}
          href={amazonProductUrl(getAmazonProduct(seg.productId).asin, tag)}
          target="_blank"
          rel={AMAZON_LINK_REL}
          className="affiliate-link"
          data-amazon-tag={tag}
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
