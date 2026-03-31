import { sanityClient } from './sanity';
import type { BlogPost, Ride, Park, CharacterDining, Deal } from './sanity-types';

// Blog Posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return sanityClient.fetch(`
    *[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      heroImage {
        asset-> { url },
        alt
      },
      author,
      categories[] {
        title,
        slug
      },
      tags,
      publishedAt,
      readTime
    }
  `);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return sanityClient.fetch(`
    *[_type == "blogPost" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      body,
      excerpt,
      heroImage {
        asset-> { url },
        alt
      },
      author,
      categories[] {
        title,
        slug
      },
      tags,
      publishedAt,
      readTime
    }
  `, { slug });
}

export async function getBlogSlugs(): Promise<string[]> {
  return sanityClient.fetch(`
    *[_type == "blogPost"].slug.current
  `);
}

export async function getRecentBlogPosts(limit = 3): Promise<BlogPost[]> {
  return sanityClient.fetch(`
    *[_type == "blogPost"] | order(publishedAt desc) [0...$limit] {
      _id,
      title,
      slug,
      excerpt,
      heroImage {
        asset-> { url },
        alt
      },
      author,
      categories[] {
        title,
        slug
      },
      tags,
      publishedAt,
      readTime
    }
  `, { limit });
}

// Rides
export async function getAllRides(): Promise<Ride[]> {
  return sanityClient.fetch(`
    *[_type == "ride"] | order(park asc, name asc) {
      _id,
      name,
      park,
      land,
      description,
      heightRequirement,
      thrillLevel,
      rideType,
      accessibility,
      image {
        asset-> { url },
        alt
      },
      waitTimeAvg,
      rating,
      isClosed,
      closureNote
    }
  `);
}

export async function getRidesByPark(parkName: string): Promise<Ride[]> {
  return sanityClient.fetch(`
    *[_type == "ride" && park == $parkName] | order(name asc) {
      _id,
      name,
      park,
      land,
      description,
      heightRequirement,
      thrillLevel,
      rideType,
      accessibility,
      image {
        asset-> { url },
        alt
      },
      waitTimeAvg,
      rating,
      isClosed,
      closureNote
    }
  `, { parkName });
}

// Parks
export async function getAllParks(): Promise<Park[]> {
  return sanityClient.fetch(`
    *[_type == "park"] | order(name asc) {
      _id,
      name,
      slug,
      description,
      image {
        asset-> { url },
        alt
      }
    }
  `);
}

export async function getParkBySlug(slug: string): Promise<Park | null> {
  return sanityClient.fetch(`
    *[_type == "park" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      description,
      image {
        asset-> { url },
        alt
      }
    }
  `, { slug });
}

export async function getParkSlugs(): Promise<string[]> {
  return sanityClient.fetch(`
    *[_type == "park"].slug.current
  `);
}

// Character Dining
export async function getAllCharacterDining(): Promise<CharacterDining[]> {
  return sanityClient.fetch(`
    *[_type == "characterDining"] | order(park asc, name asc) {
      _id,
      name,
      park,
      characters,
      mealType,
      priceRange,
      description,
      image {
        asset-> { url },
        alt
      },
      bookingUrl
    }
  `);
}

// Deals
export async function getAllDeals(): Promise<Deal[]> {
  return sanityClient.fetch(`
    *[_type == "deal"] | order(validUntil asc) {
      _id,
      title,
      description,
      url,
      provider,
      discountPercent,
      validUntil,
      image {
        asset-> { url },
        alt
      }
    }
  `);
}
