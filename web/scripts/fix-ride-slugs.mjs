/**
 * fix-ride-slugs.mjs
 *
 * Reads ride IDs from data/rides.js, queries Sanity for current slugs,
 * and updates Sanity slugs to match the short IDs in rides.js so that
 * image paths like /images/rides/mk-big-thunder.jpg resolve correctly.
 *
 * Usage:
 *   cd web/
 *   node scripts/fix-ride-slugs.mjs          # interactive (asks for confirmation)
 *   node scripts/fix-ride-slugs.mjs --yes    # non-interactive, applies changes
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const autoConfirm = args.includes('--yes') || args.includes('-y');

async function main() {
  // ── Sanity client ──────────────────────────────────────────────────────────
  const client = createClient({
    projectId: 'hd7qwtcq',
    dataset: 'production',
    token: 'skQUXzNOvcWakM2LokLf7LCcxBI2ooAQwIo0r9zIIQWDrQqBhYniPpeRFWnVFfn2XdMAqWwyqgCMPaSzskCDCM43Q2g3ASzR5AxEap7ypBPFOdvko7ajkDBLmDBSIsvY6yfAUUzQHKeAMcOO2FhmJHPa5kraCuFjSuv06XuuqvAcJIb3lxuj',
    apiVersion: '2024-01-01',
    useCdn: false,
  });

  // ── Parse rides.js ─────────────────────────────────────────────────────────
  const ridesJsPath = resolve(__dirname, '../../data/rides.js');
  const fileContent = readFileSync(ridesJsPath, 'utf-8');

  // Extract { id, name } objects
  const rideEntryRegex = /\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g;
  const ridesJs = [];
  let m;
  while ((m = rideEntryRegex.exec(fileContent)) !== null) {
    ridesJs.push({ id: m[1], name: m[2] });
  }
  console.log(`Loaded ${ridesJs.length} rides from rides.js`);

  function normalize(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  const ridesJsByName = new Map();
  for (const ride of ridesJs) {
    ridesJsByName.set(normalize(ride.name), ride);
  }

  // ── Query Sanity ───────────────────────────────────────────────────────────
  const sanityRides = await client.fetch(
    `*[_type=="ride"]{_id, name, "slug": slug.current}`
  );
  console.log(`Loaded ${sanityRides.length} rides from Sanity`);

  // ── Find mismatches ────────────────────────────────────────────────────────
  const toUpdate = [];
  const noMatch = [];

  for (const sanityRide of sanityRides) {
    const sanityName = sanityRide.name || '';
    const normalizedName = normalize(sanityName);
    const ridesJsRide = ridesJsByName.get(normalizedName);

    if (!ridesJsRide) {
      noMatch.push(sanityRide);
      continue;
    }

    const currentSlug = sanityRide.slug || '';
    const targetSlug = ridesJsRide.id;

    if (currentSlug !== targetSlug) {
      toUpdate.push({
        _id: sanityRide._id,
        name: sanityName,
        currentSlug,
        targetSlug,
      });
    }
  }

  console.log(`\n${toUpdate.length} rides need slug updates`);
  console.log(`${noMatch.length} Sanity rides have no matching ride in rides.js`);

  if (noMatch.length > 0) {
    console.log('\nNo-match rides (first 10):');
    noMatch.slice(0, 10).forEach(r => console.log(' -', r.name, '→', r.slug));
  }

  if (toUpdate.length === 0) {
    console.log('\nAll slugs are already correct. Nothing to do.');
    process.exit(0);
  }

  // ── Dry-run preview ────────────────────────────────────────────────────────
  console.log('\nProposed changes:');
  toUpdate.forEach(r =>
    console.log(`  "${r.name}": "${r.currentSlug}" → "${r.targetSlug}"`)
  );

  if (!autoConfirm) {
    console.log('\nRe-run with --yes to apply changes automatically.');
    process.exit(0);
  }

  // ── Apply updates ─────────────────────────────────────────────────────────
  console.log('\nUpdating Sanity...');
  let success = 0;
  let failed = 0;

  for (const ride of toUpdate) {
    try {
      await client
        .patch(ride._id)
        .set({ slug: { current: ride.targetSlug } })
        .commit();
      console.log(`  ✓ ${ride.name}: "${ride.currentSlug}" → "${ride.targetSlug}"`);
      success++;
    } catch (err) {
      console.error(`  ✗ Failed to update "${ride.name}": ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} updated, ${failed} failed.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
