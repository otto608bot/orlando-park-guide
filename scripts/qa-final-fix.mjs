#!/usr/bin/env node
/**
 * Final QA critical fixes — 2026-07-23
 * Dry-run by default. Pass --apply to mutate production.
 */
import { createClient } from '../web/node_modules/@sanity/client/dist/index.js';
import crypto from 'node:crypto';

const token = process.env.SANITY_API_TOKEN;
if (!token) throw new Error('SANITY_API_TOKEN must be set.');

const client = createClient({
  projectId: 'hd7qwtcq',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
});

const apply = process.argv.includes('--apply');
const key = () => crypto.randomBytes(6).toString('hex');

const textOf = (b) => (b?.children || []).map((c) => c.text || '').join('');

function setPlainText(block, text) {
  return {
    ...block,
    children: [
      {
        _key: block.children?.[0]?._key || key(),
        _type: 'span',
        marks: [],
        text,
      },
    ],
    markDefs: block.markDefs || [],
  };
}

function ensureListLevels(body) {
  let n = 0;
  const next = body.map((b) => {
    if (b?._type === 'block' && b.listItem && (b.level === null || b.level === undefined)) {
      n += 1;
      return { ...b, level: 1 };
    }
    return b;
  });
  return { body: next, fixed: n };
}

async function patchDoc(id, body, note) {
  console.log(`\n→ ${id}: ${note}`);
  if (!apply) {
    console.log('  (dry-run)');
    return;
  }
  const res = await client.patch(id).set({ body }).commit({ autoGenerateArrayKeys: false });
  console.log('  mutated', res._id, res._rev);
}

async function fixPackingList() {
  const doc = await client.fetch(
    `*[_type=="blogPost" && slug.current==$slug][0]{_id,body}`,
    { slug: 'disney-world-packing-list' },
  );
  if (!doc) throw new Error('packing list not found');
  const body = structuredClone(doc.body);
  const old =
    "Lightning Lane remains one of the best value purchases at Disney World in 2026, especially for families with kids who can't handle long standby lines. It allows you to book Lightning Lane entrances at most attractions, dramatically reducing wait times. The service works exclusively through the My Disney Experience app — this is why a working, charged phone is non-negotiable. At $15–$25 per person per day, it pays for itself after two or three Lightning Lane uses versus standby lines.";
  const neu =
    "Lightning Lane Multi Pass and Lightning Lane Single Pass remain useful paid skip-the-line options for families in 2026, especially with kids who struggle in long standby lines. Multi Pass covers a menu of attractions for a per-person daily price that varies by date and park; Single Pass is sold separately for select premium headliners. Both book through the My Disney Experience app — so a working, charged phone is non-negotiable. Confirm current pricing and return-time availability for your travel dates rather than budgeting a fixed dollar amount.";
  const i = body.findIndex((b) => textOf(b) === old);
  if (i < 0) {
    // try partial
    const j = body.findIndex((b) => textOf(b).includes('$15–$25 per person per day'));
    if (j < 0) {
      console.log('packing FAQ already fixed or text changed; skip body rewrite');
    } else {
      body[j] = setPlainText(body[j], neu);
      await patchDoc(doc._id, body, `rewrite FAQ LL answer @${j}`);
    }
  } else {
    body[i] = setPlainText(body[i], neu);
    await patchDoc(doc._id, body, `rewrite FAQ LL answer @${i}`);
  }
}

async function fixBeatCrowds() {
  const doc = await client.fetch(
    `*[_type=="blogPost" && slug.current==$slug][0]{_id,body}`,
    { slug: 'beat-disney-world-crowds' },
  );
  if (!doc) throw new Error('beat crowds not found');
  const body = structuredClone(doc.body);
  const i = body.findIndex((b) => textOf(b).includes('Lightning Lane Genie era'));
  if (i < 0) {
    console.log('beat-crowds: no Genie-era mash found; skip');
    return;
  }
  const old = textOf(body[i]);
  const neu = old.replace(
    'replaced the old Genie+/individual Lightning Lane Genie era in July 2024',
    'replaced Genie+ (retired July 2024)',
  );
  if (neu === old) throw new Error('beat-crowds replace failed');
  body[i] = setPlainText(body[i], neu);
  // preserve multi-span if any? original is single span plain - OK
  await patchDoc(doc._id, body, `clean Genie wording @${i}`);
}

async function fixGuideSplash() {
  const doc = await client.fetch(
    `*[_type=="blogPost" && slug.current==$slug][0]{_id,body}`,
    { slug: 'disney-world-guide' },
  );
  if (!doc) throw new Error('guide not found');
  const body = structuredClone(doc.body);
  let changed = 0;
  for (let i = 0; i < body.length; i++) {
    const t = textOf(body[i]);
    if (t.includes("near Splash Mountain/Tiana's")) {
      const neu = t.replace(
        "near Splash Mountain/Tiana's",
        "near Tiana's Bayou Adventure (former Splash Mountain area)",
      );
      body[i] = setPlainText(body[i], neu);
      changed += 1;
      console.log('  splash residual @', i);
    }
  }
  if (!changed) {
    console.log('guide: no Splash residual needing fix');
    return;
  }
  await patchDoc(doc._id, body, `fix Splash residual x${changed}`);
}

async function fixMissingLevels(slug) {
  const doc = await client.fetch(
    `*[_type=="blogPost" && slug.current==$slug][0]{_id,body}`,
    { slug },
  );
  if (!doc) throw new Error(`${slug} not found`);
  const { body, fixed } = ensureListLevels(structuredClone(doc.body));
  if (!fixed) {
    console.log(`${slug}: list levels already set`);
    return;
  }
  await patchDoc(doc._id, body, `set level:1 on ${fixed} list items`);
}

async function main() {
  console.log(apply ? 'APPLY MODE' : 'DRY-RUN MODE (pass --apply to mutate)');
  await fixPackingList();
  await fixBeatCrowds();
  await fixGuideSplash();
  for (const slug of [
    'disney-world-with-baby-toddler',
    'free-things-disney-world',
    'universal-orlando-height-requirements',
  ]) {
    await fixMissingLevels(slug);
  }
  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
