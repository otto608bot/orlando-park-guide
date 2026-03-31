#!/usr/bin/env node
/**
 * Add slug field to existing ride documents in Sanity
 * Run with: node add-slugs-to-rides.mjs
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectId = 'hd7qwtcq';
const dataset = 'production';
const token = 'skQUXzNOvcWakM2LokLf7LCcxBI2ooAQwIo0r9zIIQWDrQqBhYniPpeRFWnVFfn2XdMAqWwyqgCMPaSzskCDCM43Q2g3ASzR5AxEap7ypBPFOdvko7ajkDBLmDBSIsvY6yfAUUzQHKeAMcOO2FhmJHPa5kraCuFjSuv06XuuqvAcJIb3lxuj';

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
});

function deriveSlug(rideName, parkName) {
  // Map parks to their abbreviation prefix
  const parkPrefixMap = {
    'Magic Kingdom': 'mk',
    'EPCOT': 'epcot',
    'Hollywood Studios': 'hs',
    'Animal Kingdom': 'ak',
    'Universal Studios Florida': 'usf',
    'Islands of Adventure': 'ioa',
    'Epic Universe': 'eu',
    'SeaWorld Orlando': 'sw',
    'LEGOLAND Florida': 'll',
  };

  const prefix = parkPrefixMap[parkName] || parkName.toLowerCase().replace(/[^a-z]/g, '').substring(0, 4);
  
  // Derive slug from name
  const nameSlug = rideName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 40);

  return `${prefix}-${nameSlug}`;
}

async function addSlugsToRides() {
  console.log('Fetching all rides from Sanity...');
  
  const rides = await client.fetch(`
    *[_type == "ride" && !defined(slug)] {
      _id,
      name,
      park
    }
  `);

  console.log(`Found ${rides.length} rides without slug field`);

  let updated = 0;
  for (const ride of rides) {
    const slugValue = deriveSlug(ride.name, ride.park);
    
    try {
      await client.patch(ride._id).set({
        slug: { _type: 'slug', current: slugValue }
      }).commit();
      
      console.log(`  Updated: ${ride.name} (${ride.park}) → ${slugValue}`);
      updated++;
    } catch (err) {
      console.error(`  Error updating ${ride.name}: ${err.message}`);
    }
  }

  console.log(`\nUpdated ${updated} rides with slug fields`);
}

async function main() {
  try {
    await client.fetch('*[_type == "ride"][0]._id');
    console.log('✓ Sanity connection verified\n');
    await addSlugsToRides();
    console.log('\n✅ Done!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
