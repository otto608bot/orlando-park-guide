// Sanity Schema Types

export interface SanitySlug {
  current: string;
}

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
    url?: string;
  };
  alt?: string;
}

export interface BlogPost {
  _id: string;
  _type: 'blogPost';
  title: string;
  slug: SanitySlug;
  body: PortableTextBlock[];
  excerpt?: string;
  heroImage?: SanityImage & { alt?: string };
  author?: { name: string };
  categories?: Array<{ title: string; slug: SanitySlug }>;
  tags?: string[];
  publishedAt?: string;
  readTime?: number;
}

export interface Ride {
  _id: string;
  _type: 'ride';
  name: string;
  park: string;
  land?: string;
  description?: string;
  heightRequirement?: number; // inches
  thrillLevel?: number; // 1-5
  rideType?: string;
  accessibility?: string[]; // tags like 'wheelchair', 'sensory', etc.
  slug?: SanitySlug;
  image?: SanityImage & { alt?: string };
  waitTimeAvg?: number; // minutes
  rating?: number; // 1-5
  isClosed?: boolean;
  closureNote?: string;
}

export interface Park {
  _id: string;
  _type: 'park';
  name: string;
  slug: SanitySlug;
  description?: string;
  image?: SanityImage & { alt?: string };
  rides?: Array<{ _ref: string; _type: 'reference' }>;
}

export interface CharacterDining {
  _id: string;
  _type: 'characterDining';
  name: string;
  park?: string;
  characters?: string[];
  mealType?: string[]; // 'breakfast', 'lunch', 'dinner'
  priceRange?: string; // '$, $$, $$$'
  description?: string;
  image?: SanityImage & { alt?: string };
  bookingUrl?: string;
}

export interface Deal {
  _id: string;
  _type: 'deal';
  title: string;
  description?: string;
  url?: string;
  provider?: string;
  discountPercent?: number;
  validUntil?: string;
  image?: SanityImage & { alt?: string };
}

// PortableText block type (simplified)
export interface PortableTextBlock {
  _type: string;
  _key?: string;
  style?: string;
  children?: Array<{
    _type: 'span';
    _key?: string;
    text?: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _type: string;
    _key?: string;
    href?: string;
    blank?: boolean;
  }>;
}
