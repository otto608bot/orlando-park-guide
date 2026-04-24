#!/usr/bin/env node
/**
 * Upload a hero image to Sanity and return the asset URL.
 * Usage: node scripts/upload-hero-image.mjs <image-path> [image-alt]
 * 
 * Example: node scripts/upload-hero-image.mjs /path/to/hero.webp "Family at Magic Kingdom"
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Sanity config from environment / config
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'hd7qwtcq',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

async function uploadImage(imagePath, alt = 'Plan Your Park hero image') {
  if (!fs.existsSync(imagePath)) {
    console.error(`❌ File not found: ${imagePath}`);
    process.exit(1);
  }

  const imageBuffer = fs.readFileSync(imagePath);
  const ext = path.extname(imagePath).slice(1).toLowerCase();
  
  // Map extension to Sanity asset type
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    png: 'image/png',
    gif: 'image/gif',
  };
  const mimeType = mimeTypes[ext] || 'image/jpeg';

  console.log(`📤 Uploading ${path.basename(imagePath)} to Sanity...`);

  // Use the Sanity assets API to upload
  const response = await fetch(
    `https://${process.env.SANITY_PROJECT_ID || 'hd7qwtcq'}.sanity.io/v1/assets/images/${process.env.SANITY_DATASET || 'production'}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': mimeType,
        'Authorization': `Bearer ${process.env.SANITY_TOKEN}`,
      },
      body: imageBuffer,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sanity upload failed: ${response.status} - ${errorText}`);
  }

  const asset = await response.json();
  console.log(`✅ Uploaded: ${asset.url}`);
  
  // Output the full asset reference for use in Sanity documents
  // The format is: { "_type": "image", "asset": { "_ref": "image-xxx-1920x1080-jpg", "_type": "reference" } }
  const assetRef = asset.url.replace(/^https:\/\/cdn\.sanity\.io\//, '').replace(/-(\w+)$/, '-$1');
  
  return {
    url: asset.url,
    assetId: asset._id,
    dimensions: asset.dimensions,
    // Return the Sanity image object format for embedding in documents
    sanityImage: {
      _type: 'image',
      asset: {
        _ref: assetRef,
        _type: 'reference',
      },
      alt: alt,
    }
  };
}

// CLI entry point
const imagePath = process.argv[2];
if (!imagePath) {
  console.error('Usage: node scripts/upload-hero-image.mjs <image-path> [alt-text]');
  console.error('Example: node scripts/upload-hero-image.mjs /tmp/my-hero.webp "Family at Magic Kingdom"');
  process.exit(1);
}

const alt = process.argv[3] || 'Plan Your Park hero image';

uploadImage(imagePath, alt)
  .then(result => {
    console.log('\n📋 Asset reference for Sanity:');
    console.log(JSON.stringify(result.sanityImage, null, 2));
    console.log('\n🔗 CDN URL:');
    console.log(result.url);
  })
  .catch(err => {
    console.error('❌ Upload failed:', err.message);
    process.exit(1);
  });