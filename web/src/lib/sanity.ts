import { createClient } from '@sanity/client';

// rebuild-stamp: 2026-07-23-blog-qa-final — force Netlify static regen after CMS QA

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'hd7qwtcq';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

// Static export builds should not use the Sanity CDN — CDN can lag behind
// mutations and bake stale bodies into Netlify HTML.
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Server-side client with token for write operations
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
