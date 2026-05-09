#!/usr/bin/env node
/**
 * Patch script: Fix remaining 9 bullet list blocks in disney-world-packing-list-kids
 * These blocks have style="bullet" but missing listItem="bullet"
 * 
 * These are the Toddler Checklist (blocks 90-102) and Early Elementary Checklist (blocks 104-117)
 * that were NOT fixed in the earlier patch (which only fixed "1. text" pattern paragraphs)
 * 
 * IMPORTANT: This script is for the PR only. DO NOT run directly against production.
 * The actual patch will be reviewed and merged via PR to trigger one rebuild.
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

function fixQuickChecklists(body) {
  return body.map(block => {
    if (block.style === 'bullet' && !block.listItem) {
      return {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        _key: block._key,
        children: block.children || []
      };
    }
    return block;
  });
}

async function main() {
  const doc = await client.fetch(
    `*[_type == "blogPost" && slug.current == "disney-world-packing-list-kids"][0]{_id, _rev, body}`,
    {}
  );
  
  if (!doc) {
    console.log('Post not found');
    return;
  }
  
  const fixed = fixQuickChecklists(doc.body);
  
  // Count changes
  let changes = 0;
  for (let i = 0; i < doc.body.length; i++) {
    if (doc.body[i].style === 'bullet' && !doc.body[i].listItem) {
      changes++;
    }
  }
  
  console.log(`Found ${changes} blocks to fix`);
  console.log(`Post _id: ${doc._id}`);
  console.log(`Current _rev: ${doc._rev}`);
  
  // Apply patch
  const result = await client
    .patch(doc._id, { body: fixed })
    .commit();
  
  console.log(`Patched. New _rev: ${result._rev}`);
  console.log('Now trigger Netlify rebuild from the PR merge.');
}

main().catch(console.error);