import type { MetadataRoute } from "next";
import { dedupePostsBySlug } from "@/lib/blog";
import { sanityClient } from "@/lib/sanity";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

type SitemapRecord = {
  slug?: string;
  publishedAt?: string;
  _updatedAt?: string;
};

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  },
  {
    url: `${SITE_URL}/parks/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/rides/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/character-dining/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/deals/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/blog/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/about/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.4,
  },
  {
    url: `${SITE_URL}/contact/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.4,
  },
  {
    url: `${SITE_URL}/affiliate-disclosure/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.3,
  },
  {
    url: `${SITE_URL}/privacy/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.3,
  },
  {
    url: `${SITE_URL}/terms/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.3,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [parks, posts] = await Promise.all([
    sanityClient.fetch<SitemapRecord[]>(`
      *[_type == "park" && defined(slug.current)] {
        "slug": slug.current,
        _updatedAt
      }
    `),
    sanityClient.fetch<SitemapRecord[]>(`
      *[_type == "blogPost" && defined(slug.current)] {
        "slug": slug.current,
        publishedAt,
        _updatedAt
      }
    `),
  ]);

  const parkRoutes: MetadataRoute.Sitemap = parks.map((park) => ({
    url: `${SITE_URL}/parks/${park.slug}/`,
    lastModified: park._updatedAt ? new Date(park._updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = dedupePostsBySlug(posts).map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}/`,
    lastModified: new Date(post.publishedAt || post._updatedAt || Date.now()),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...STATIC_ROUTES, ...parkRoutes, ...blogRoutes];
}
