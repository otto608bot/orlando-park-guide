#!/usr/bin/env node
/**
 * Add missing ride strategy content to epic-universe-rides-ranked-guide
 * Content was missing after "How To Epic Universe — Ride Strategy" section
 * 
 * Writes to PR branch only — does NOT push to production.
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

const TOKEN = readFileSync('/Users/rufusbot/.sanity_token', 'utf8').trim();

const client = createClient({
  projectId: 'hd7qwtcq',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: TOKEN,
});

const strategyContent = [
  "Arrive at Epic Universe 45 minutes before park opening to position for rope drop. Prioritize Super Nintendo World first — dash to Mario Kart: Bowser's Challenge, the park's most popular interactive dark ride, which builds massive lines by 10 AM.",
  "Immediately after Mario Kart, ride Donkey Kong Mine-Cart Madness in the adjacent Donkey Kong Country area. This family coaster will have shorter waits early, letting you knock out Super Nintendo World's headliners before crowds flood in.",
  "If Super Nintendo World is too packed at rope drop, pivot to Celestial Park for Stardust Racers. This dual-launch racing coaster offers thrilling back-to-back seats and minimal morning lines — ride it twice if possible.",
  "Next, head to The Wizarding World of Harry Potter — Ministry of Magic for Harry Potter and the Battle at the Ministry. This innovative battle simulator is a must-do, but save it for mid-morning after Nintendo to avoid peak wizarding crowds.",
  "Tour How to Train Your Dragon — Isle of Berk around 11 AM. Hit Hiccup's Wing Gliders or Dragon Racers Rally — these scenic spinners and racers have moderate waits midday and appeal to all ages.",
  "Plan lunch between 12:30 and 1:30 PM at a quick-service spot like the Three Broomsticks in Ministry of Magic or Celestial Park's food court. Ride queues peak then — eating lets you skip 60+ minute lines.",
  "In the afternoon, target Dark Universe for Curse of the Werewolf, the park's intense spinning coaster. Post-lunch crowds thin here, making it ideal for repeats or pairing with Monsters Unchained: The Frankenstein Experiment.",
  "Use Universal Express Pass for Mario Kart, Battle at the Ministry, and Stardust Racers — these consistently exceed 90-minute waits. Skip it on family rides like Constellation Carousel to save skips for thrillers.",
  "End your day with low-demand fillers: ride Constellation Carousel in Celestial Park at dusk for magical views, then re-ride favorites via Express or single-rider lines as the park empties.",
  "For a full-day one-park ticket, aim to complete all major rides by 4 PM, then catch a Celestial Park show or parade. This order minimizes walking and backtracking between lands.",
];

async function main() {
  const slug = 'epic-universe-rides-ranked-guide';
  
  const doc = await client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0]{_id, _rev, body, title}`,
    { slug }
  );
  
  if (!doc) { console.log('Post not found'); return; }
  console.log(`Post: ${doc.title}`);
  console.log(`Current blocks: ${doc.body.length}`);
  
  // Find the "How To Epic Universe — Ride Strategy" section and the blockquote after it
  // We want to insert numbered list items AFTER the intro paragraph (block 46) and BEFORE the blockquote (block 47)
  // But we need to check the current structure
  const h2Index = doc.body.findIndex((b, i) => 
    b.style === 'h2' && b.children?.[0]?.text?.includes('How To Epic Universe')
  );
  console.log(`"How To Epic Universe" h2 at block index: ${h2Index}`);
  
  if (h2Index === -1) { console.log('Section not found'); return; }
  
  // Find the blockquote that follows
  // Strategy items go after the intro paragraph, before the blockquote
  let insertAfter = h2Index + 1;
  // Find the blockquote
  while (insertAfter < doc.body.length && 
         !(doc.body[insertAfter].style === 'blockquote' || doc.body[insertAfter]._type === 'blockquote')) {
    insertAfter++;
  }
  // Now insert BEFORE the blockquote (insertAfter is the blockquote index)
  insertAfter = h2Index + 1; // Reset to insert right after the h2 intro paragraph
  
  // Verify block at insertAfter is the intro paragraph
  const introBlock = doc.body[insertAfter];
  const introText = introBlock?.children?.[0]?.text || '';
  console.log(`Insert after block ${insertAfter}: "${introText.slice(0,60)}"`);
  
  // Build the new blocks
  const newBlocks = strategyContent.map((text, i) => ({
    _type: 'block',
    style: 'normal',
    listItem: 'number',
    _key: `strategy-item-${i}`,
    children: [{
      _type: 'span',
      text: text,
      marks: []
    }]
  }));
  
  console.log(`New blocks to insert: ${newBlocks.length}`);
  
  // Build new body: insert new blocks after insertAfter
  const newBody = [
    ...doc.body.slice(0, insertAfter),
    ...newBlocks,
    ...doc.body.slice(insertAfter)
  ];
  
  console.log(`New body length: ${newBody.length}`);
  
  // Print what we'll add
  console.log('\nContent to add:');
  strategyContent.forEach((text, i) => console.log(`  ${i+1}. ${text.slice(0,60)}...`));
  
  if (process.argv.includes('--patch')) {
    console.log('\nPatching Sanity (PR only — no production push)...');
    const result = await client.patch(doc._id, { set: { body: newBody } }).commit();
    console.log(`Done. New rev: ${result._rev}`);
  } else {
    console.log('\nDry run. Use --patch to apply (writes to PR).');
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });