#!/usr/bin/env node
/**
 * Restructure disney-world-packing-list-kids — merge descriptions INTO listItem blocks.
 * 
 * Strategy: Attach each description paragraph (the explanatory text between numbered
 * items) as a trailing span inside the listItem block that precedes it.
 * This makes listItem blocks truly consecutive → they group into one <ol> → counter works.
 * 
 * Before: [listItem "Sunscreen"] [description "Florida sun is no joke..."] [listItem "Water"]
 * After:  [listItem "Sunscreen\n[desc: Florida sun is no joke...]"] [listItem "Water"]
 * 
 * The description spans get special styling in the renderer (smaller font, indented, italic).
 * 
 * Usage:
 *   node scripts/restructure-packing-list.mjs --dry
 *   node scripts/restructure-packing-list.mjs --patch
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

function restructure(body) {
  // Pass 1: fix malformed blocks
  let blocks = body.map((block, idx) => {
    const text = (block.children?.[0]?.text || '').trim();
    if (text === '---') return block;
    
    const numMatch = text.match(/^(\d+)\.\s+(.+)/);
    if (numMatch && block.style === 'normal' && !block.listItem) {
      return { _type: 'block', style: 'normal', listItem: 'number', _key: `r-${idx}`, children: [{ _type: 'span', text: numMatch[2], marks: [] }] };
    }
    
    const notMatch = text.match(/^❌\s+(.+)/);
    if (notMatch && block.style === 'normal' && !block.listItem) {
      return { _type: 'block', style: 'normal', listItem: 'bullet', _key: `r-${idx}`, children: [{ _type: 'span', text: notMatch[1], marks: [] }] };
    }
    
    if (block.style === 'bullet' && !block.listItem) {
      return { _type: 'block', style: 'normal', listItem: 'bullet', _key: block._key || `r-${idx}`, children: block.children || [] };
    }
    
    return block;
  });
  
  // Pass 2: merge description paragraphs into preceding listItem blocks
  // A description = normal paragraph block that follows a listItem block
  const result = [];
  let i = 0;
  
  while (i < blocks.length) {
    const block = blocks[i];
    
    if (block.listItem) {
      // Collect this listItem and any descriptions that follow
      const listItemGroups = [];
      const descriptions = [];
      
      // Collect listItem blocks
      while (i < blocks.length && blocks[i].listItem) {
        listItemGroups.push(blocks[i]);
        i++;
      }
      
      // Collect description paragraphs (normal style, not h2/h3, not separator)
      while (i < blocks.length && blocks[i].style === 'normal' && !blocks[i].listItem) {
        const text = (blocks[i].children?.[0]?.text || '').trim();
        if (text !== '---' && !text.match(/^\[ Buy /)) {
          descriptions.push(blocks[i]);
        }
        i++;
      }
      
      // Merge descriptions into the LAST listItem block of this group
      if (listItemGroups.length > 0 && descriptions.length > 0) {
        const lastItem = listItemGroups[listItemGroups.length - 1];
        // Convert description blocks to span children added to the last listItem
        const descSpans = descriptions.map((d, idx) => ({
          _type: 'span',
          text: '\n' + (d.children?.[0]?.text || ''),
          marks: ['description']  // special mark for styling
        }));
        lastItem.children = [...lastItem.children, ...descSpans];
      }
      
      // Emit listItem blocks (last one now has descriptions merged in)
      result.push(...listItemGroups);
      
      // Any non-description paragraphs that weren't merged go back as regular paragraphs
      // Actually they were consumed. Descriptions are now in the listItem.
      // The loop already advanced i past them.
    } else {
      result.push(block);
      i++;
    }
  }
  
  return result;
}

function groupConsecutiveLists(blocks) {
  const result = [];
  let i = 0;
  
  while (i < blocks.length) {
    const block = blocks[i];
    if (!block.listItem) {
      result.push(block);
      i++;
      continue;
    }
    
    const groupChildren = [];
    const groupKey = block._key;
    
    while (i < blocks.length && blocks[i].listItem === block.listItem) {
      groupChildren.push(...(blocks[i].children || []));
      i++;
    }
    
    result.push({
      _type: 'block',
      style: 'normal',
      listItem: block.listItem,
      _key: groupKey,
      children: groupChildren
    });
  }
  
  return result;
}

async function main() {
  const slug = process.argv[2] || 'disney-world-packing-list-kids';
  const dryRun = process.argv.includes('--dry');
  const patch = process.argv.includes('--patch');
  
  console.log(`Fetching ${slug}...`);
  const doc = await client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0]{_id, _rev, body, title}`,
    { slug }
  );
  
  if (!doc) { console.log('Not found'); return; }
  console.log(`Post: ${doc.title}`);
  console.log(`Original blocks: ${doc.body.length}`);
  
  const restructured = restructure(doc.body);
  const grouped = groupConsecutiveLists(restructured);
  console.log(`After restructure+group: ${grouped.length}`);
  
  // Show merged groups
  for (const b of grouped) {
    if (b.listItem && b.children?.length > 1) {
      console.log(`\nMERGED: listItem=${b.listItem}, ${b.children.length} children`);
      for (let c = 0; c < Math.min(b.children.length, 4); c++) {
        const text = (b.children[c].text || '').slice(0, 70);
        const hasDesc = b.children[c].marks?.includes('description');
        console.log(`  [${c}] ${hasDesc ? '(desc) ' : ''}${text}`);
      }
      if (b.children.length > 4) console.log(`  ... +${b.children.length - 4} more`);
    }
  }
  
  let singleItem = 0;
  let multiItem = 0;
  for (const b of grouped) {
    if (b.listItem) {
      if (b.children?.length > 1) multiItem++;
      else singleItem++;
    }
  }
  console.log(`\nSingle-item groups: ${singleItem}`);
  console.log(`Multi-item groups: ${multiItem}`);
  
  if (patch) {
    console.log('\nPatching Sanity...');
    const result = await client.patch(doc._id, { body: grouped }).commit();
    console.log(`Done. New rev: ${result._rev}`);
  } else {
    console.log('\nDry run. Add --patch to apply.');
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });