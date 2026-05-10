#!/usr/bin/env node
/**
 * Restructure disney-world-packing-list-kids — merge descriptions INTO listItem blocks.
 * Uses client.patch() which we confirmed works.
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
  
  const result = [];
  let i = 0;
  
  while (i < blocks.length) {
    const block = blocks[i];
    
    if (block.listItem) {
      const listItemGroups = [];
      const descriptions = [];
      
      while (i < blocks.length && blocks[i].listItem) {
        listItemGroups.push(blocks[i]);
        i++;
      }
      
      while (i < blocks.length && blocks[i].style === 'normal' && !blocks[i].listItem) {
        const text = (blocks[i].children?.[0]?.text || '').trim();
        if (text !== '---' && !text.match(/^\[ Buy /)) {
          descriptions.push(blocks[i]);
        }
        i++;
      }
      
      if (listItemGroups.length > 0 && descriptions.length > 0) {
        const lastItem = listItemGroups[listItemGroups.length - 1];
        const descSpans = descriptions.map((d) => ({
          _type: 'span',
          text: '\n' + (d.children?.[0]?.text || ''),
          marks: ['description']
        }));
        lastItem.children = [...lastItem.children, ...descSpans];
      }
      
      result.push(...listItemGroups);
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
  
  let single = 0, multi = 0;
  for (const b of grouped) {
    if (b.listItem) {
      if (b.children?.length > 1) multi++;
      else single++;
    }
  }
  console.log(`Single-item groups: ${single}, Multi-item groups: ${multi}`);
  
  if (patch) {
    console.log('\nPatching Sanity (client.patch approach)...');
    try {
      const result = await client.patch(doc._id, { set: { body: grouped } }).commit();
      console.log(`Success! New rev: ${result._rev}`);
    } catch(e) {
      console.log('Error:', e.message);
    }
  } else {
    console.log('\nDry run. Use --patch to apply to Sanity (triggers one rebuild on PR merge).');
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });