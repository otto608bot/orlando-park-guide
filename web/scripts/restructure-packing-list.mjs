#!/usr/bin/env node
/**
 * Restructure disney-world-packing-list-kids body:
 * Move description paragraphs AFTER the list blocks they follow.
 * This keeps all listItem blocks consecutive so they render in ONE <ol>.
 * 
 * Before: [paragraph] [listItem] [description] [listItem] [description] [listItem]
 * After:  [paragraph] [listItem] [listItem] [listItem] [description] [description]
 * 
 * The groupConsecutiveLists() function then merges them into single grouped blocks.
 * 
 * Usage:
 *   node scripts/restructure-packing-list.mjs disney-world-packing-list-kids --dry
 *   node scripts/restructure-packing-list.mjs disney-world-packing-list-kids --patch
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
  // First pass: fix any malformed paragraphs into proper listItem blocks
  let blocks = body.map((block, idx) => {
    const text = (block.children?.[0]?.text || '').trim();
    if (text === '---') return block;
    
    // "1. Some text" stored as plain paragraph → convert to listItem
    const numMatch = text.match(/^(\d+)\.\s+(.+)/);
    if (numMatch && block.style === 'normal' && !block.listItem) {
      return { _type: 'block', style: 'normal', listItem: 'number', _key: `restructured-${idx}`, children: [{ _type: 'span', text: numMatch[2], marks: [] }] };
    }
    
    // "❌ X" → bullet item
    const notMatch = text.match(/^❌\s+(.+)/);
    if (notMatch && block.style === 'normal' && !block.listItem) {
      return { _type: 'block', style: 'normal', listItem: 'bullet', _key: `restructured-${idx}`, children: [{ _type: 'span', text: notMatch[1], marks: [] }] };
    }
    
    // style="bullet" without listItem → listItem="bullet"
    if (block.style === 'bullet' && !block.listItem) {
      return { _type: 'block', style: 'normal', listItem: 'bullet', _key: block._key || `restructured-${idx}`, children: block.children || [] };
    }
    
    return block;
  });
  
  // Second pass: move description paragraphs AFTER their preceding listItem blocks
  // A "description" = a normal paragraph that follows a listItem block
  const result = [];
  let i = 0;
  
  while (i < blocks.length) {
    const block = blocks[i];
    
    if (block.listItem) {
      // Collect all consecutive listItem blocks (of any type)
      const group = [block];
      i++;
      while (i < blocks.length && blocks[i].listItem) {
        group.push(blocks[i]);
        i++;
      }
      // Emit all listItem blocks consecutively
      result.push(...group);
      // Now collect descriptions that belong to this group
      // A description is a normal paragraph that immediately follows the last listItem
      // and describes it (not another listItem)
      while (i < blocks.length && !blocks[i].listItem && blocks[i].style === 'normal') {
        result.push(blocks[i]);
        i++;
      }
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
    const listItem = block.listItem;
    
    if (!listItem) {
      result.push(block);
      i++;
      continue;
    }
    
    // Collect ALL consecutive blocks with same listItem type
    const groupChildren = [];
    const groupKey = block._key;
    
    while (i < blocks.length && blocks[i].listItem === listItem) {
      groupChildren.push(...(blocks[i].children || []));
      i++;
    }
    
    result.push({
      _type: 'block',
      style: 'normal',
      listItem: listItem,
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
  
  // Count groups
  let groups = 0;
  let itemsInGroups = 0;
  for (const b of grouped) {
    if (b.listItem && b.children?.length > 0) {
      groups++;
      itemsInGroups += b.children.length;
    }
  }
  console.log(`List groups: ${groups}, total items: ${itemsInGroups}`);
  
  if (dryRun) {
    // Show first few grouped blocks
    for (const b of grouped.slice(0, 20)) {
      if (b.listItem) {
        console.log(`  GROUP listItem=${b.listItem} items=${b.children.length}`);
      } else {
        const text = (b.children?.[0]?.text || '').slice(0, 60);
        console.log(`  PARAGRAPH: ${text}`);
      }
    }
  }
  
  if (patch) {
    console.log('\nPatching Sanity...');
    const result = await client.patch(doc._id, { body: grouped }).commit();
    console.log(`Done. New rev: ${result._rev}`);
  } else {
    console.log('\nDry run. Add --patch to apply.');
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });