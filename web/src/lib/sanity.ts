import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'hd7qwtcq';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

// Public read-only client (uses CDN)
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
});

// Server-side client with token for write operations
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
