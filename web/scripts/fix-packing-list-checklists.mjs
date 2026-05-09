#!/usr/bin/env node
/**
 * Fix list rendering in blog posts: group consecutive listItem blocks into
 * single blocks so PortableText renders them as one <ol>/<ul> with proper numbering.
 * 
 * Problem: Each listItem block renders as its own <ol> with one <li> → all show "1."
 * Fix: Merge consecutive blocks with same listItem type into one block with
 *       children = concatenated children array. The PortableText renderer then
 *       receives all items as children of a single <ol> → proper numbering.
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

function groupConsecutiveListItems(blocks) {
  const result = [];
  let i = 0;
  
  while (i < blocks.length) {
    const block = blocks[i];
    const listItem = block.listItem;
    
    // Not a list item — emit as-is
    if (!listItem) {
      result.push(block);
      i++;
      continue;
    }
    
    // Collect ALL consecutive blocks with the same listItem type
    const groupChildren = [];
    const groupKey = block._key;
    
    while (i < blocks.length && blocks[i].listItem === listItem) {
      // Append all children from this block to the group's children array
      const children = blocks[i].children || [];
      groupChildren.push(...children);
      i++;
    }
    
    // Emit one block representing the entire group
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

function fixPackingListKids(body) {
  // First pass: fix malformed blocks (style="normal" paragraphs with "1. text" pattern)
  let blocks = body.map(block => {
    const text = (block.children?.[0]?.text || '').trim();
    
    // Skip separator
    if (text === '---') return block;
    
    const numMatch = text.match(/^(\d+)\.\s+(.+)/);
    const notMatch = text.match(/^❌\s+(.+)/);
    
    if (numMatch && block.style === 'normal' && !block.listItem) {
      return { _type: 'block', style: 'normal', listItem: 'number', _key: block._key, children: [{ _type: 'span', text: numMatch[2], marks: [] }] };
    } else if (notMatch && block.style === 'normal' && !block.listItem) {
      return { _type: 'block', style: 'normal', listItem: 'bullet', _key: block._key, children: [{ _type: 'span', text: notMatch[1], marks: [] }] };
    } else if (block.style === 'bullet' && !block.listItem) {
      return { _type: 'block', style: 'normal', listItem: 'bullet', _key: block._key, children: block.children || [] };
    }
    return block;
  });
  
  // Second pass: group consecutive listItem blocks of the same type
  blocks = groupConsecutiveListItems(blocks);
  
  return blocks;
}

async function main() {
  const slug = process.argv[2] || 'disney-world-packing-list-kids';
  const dryRun = process.argv.includes('--dry');
  const patch = process.argv.includes('--patch');
  
  console.log(`Fetching post: ${slug}...`);
  
  const doc = await client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0]{_id, _rev, body, title}`,
    { slug }
  );
  
  if (!doc) {
    console.log('Post not found');
    return;
  }
  
  console.log(`Post: ${doc.title}`);
  console.log(`Original block count: ${doc.body.length}`);
  
  const fixed = fixPackingListKids(doc.body);
  console.log(`Fixed block count: ${fixed.length}`);
  
  if (dryRun || !patch) {
    // Show what changed
    const changes = [];
    let prevListItem = null;
    for (let i = 0; i < fixed.length; i++) {
      const orig = doc.body[i];
      const newb = fixed[i];
      if (JSON.stringify(orig) !== JSON.stringify(newb)) {
        const origText = (orig?.children?.[0]?.text || '').slice(0, 40);
        const newChildCount = newb.children?.length || 0;
        const origChildCount = orig?.children?.length || 0;
        changes.push(`[${i}] listItem=${newb.listItem || '-'}, children: ${origChildCount} → ${newChildCount} ("${origText}")`);
      }
    }
    console.log(`\n${changes.length} blocks changed. First 15:`);
    changes.slice(0, 15).forEach(c => console.log(' ', c));
    
    // Show which list groups were formed
    let groups = 0;
    let mergedItems = 0;
    for (const b of fixed) {
      if (b.listItem && b.children?.length > 1) {
        groups++;
        mergedItems += b.children.length;
      }
    }
    console.log(`\nList groups formed: ${groups}`);
    console.log(`Total list items in groups: ${mergedItems}`);
  }
  
  if (patch) {
    console.log('\nApplying patch to Sanity...');
    const result = await client
      .patch(doc._id, { body: fixed })
      .commit();
    console.log(`Patched. New rev: ${result._rev}`);
    console.log('Commit the PR to trigger Netlify rebuild.');
  } else if (!dryRun) {
    console.log('\nDry run complete. Run with --patch to apply to Sanity.');
  }
}

main().catch(console.error);