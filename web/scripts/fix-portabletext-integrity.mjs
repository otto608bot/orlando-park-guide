#!/usr/bin/env node
/**
 * Audit and optionally repair common malformed PortableText issues in blog posts.
 *
 * Dry-run by default:
 *   node scripts/fix-portabletext-integrity.mjs
 *   node scripts/fix-portabletext-integrity.mjs --slug universal-orlando-summer-2026
 *
 * Apply changes:
 *   node scripts/fix-portabletext-integrity.mjs --patch --slug universal-orlando-summer-2026
 *
 * Repairs:
 * - Converts blocks with style="bullet" or style="number" into valid listItem blocks.
 * - Converts inline mark objects like {_type:"link", href:"..."} into markDefs + mark keys.
 * - Removes dangling mark keys that have no matching markDef and are not known decorators.
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

const token = process.env.SANITY_TOKEN || readFileSync('/Users/rufusbot/.sanity_token', 'utf8').trim();
const args = process.argv.slice(2);
const shouldPatch = args.includes('--patch');
const slugArgIndex = args.indexOf('--slug');
const slug = slugArgIndex >= 0 ? args[slugArgIndex + 1] : null;

const client = createClient({
  projectId: 'hd7qwtcq',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
});

const KNOWN_DECORATORS = new Set([
  'strong',
  'em',
  'code',
  'underline',
  'strike-through',
  'description',
]);

function newKey(prefix, index, nestedIndex) {
  return `${prefix}-${index}-${nestedIndex}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeBlock(block, index) {
  let changed = false;
  const notes = [];

  if (!block || typeof block !== 'object') return { block, changed, notes };

  const next = { ...block };

  if (next._type === 'block' && (next.style === 'bullet' || next.style === 'number') && !next.listItem) {
    next.listItem = next.style;
    next.style = 'normal';
    changed = true;
    notes.push(`style->listItem:${next.listItem}`);
  }

  const markDefs = Array.isArray(next.markDefs) ? [...next.markDefs] : [];
  const markDefKeys = new Set(markDefs.map((def) => def?._key).filter(Boolean));

  if (Array.isArray(next.children)) {
    next.children = next.children.map((child, childIndex) => {
      if (!child || typeof child !== 'object' || !Array.isArray(child.marks)) return child;

      const normalizedMarks = [];
      for (const mark of child.marks) {
        if (typeof mark === 'string') {
          if (KNOWN_DECORATORS.has(mark) || markDefKeys.has(mark)) {
            normalizedMarks.push(mark);
          } else {
            changed = true;
            notes.push(`removed-dangling-mark:${mark}`);
          }
          continue;
        }

        if (mark && typeof mark === 'object' && mark._type === 'link' && typeof mark.href === 'string') {
          const key = mark._key || newKey('link', index, childIndex);
          markDefs.push({ _key: key, _type: 'link', href: mark.href, blank: mark.blank ?? true });
          markDefKeys.add(key);
          normalizedMarks.push(key);
          changed = true;
          notes.push('object-link-mark->markDef');
        }
      }

      return { ...child, marks: normalizedMarks };
    });
  }

  if (markDefs.length > 0) next.markDefs = markDefs;

  return { block: next, changed, notes };
}

function normalizeBody(body) {
  if (!Array.isArray(body)) return { body, changed: false, notes: [] };

  let changed = false;
  const notes = [];
  const normalized = body.map((block, index) => {
    const result = normalizeBlock(block, index);
    if (result.changed) {
      changed = true;
      notes.push({ index, notes: result.notes, text: result.block?.children?.[0]?.text || result.block?.text || '' });
    }
    return result.block;
  });

  return { body: normalized, changed, notes };
}

async function main() {
  const query = slug
    ? '*[_type == "blogPost" && slug.current == $slug]{_id, _rev, title, "slug": slug.current, body}'
    : '*[_type == "blogPost"]{_id, _rev, title, "slug": slug.current, body}';
  const posts = await client.fetch(query, { slug });

  if (slug && posts.length === 0) {
    console.log(`No blog post found for slug: ${slug}`);
    return;
  }

  const changedPosts = [];
  for (const post of posts) {
    const result = normalizeBody(post.body);
    if (!result.changed) continue;
    changedPosts.push({ post, result });
  }

  console.log(`Scanned ${posts.length} post(s). ${changedPosts.length} need PortableText repair.`);
  for (const { post, result } of changedPosts) {
    console.log(`\n${post.title} (${post.slug})`);
    console.log(`  Changes: ${result.notes.length}`);
    result.notes.slice(0, 10).forEach((note) => {
      console.log(`  [${note.index}] ${note.notes.join(', ')} :: ${note.text.slice(0, 90)}`);
    });
    if (result.notes.length > 10) console.log(`  ...and ${result.notes.length - 10} more`);
  }

  if (!shouldPatch) {
    console.log('\nDry run complete. Re-run with --patch after review to apply changes to Sanity.');
    return;
  }

  for (const { post, result } of changedPosts) {
    const patched = await client.patch(post._id).set({ body: result.body }).commit();
    console.log(`Patched ${post.slug}: ${patched._rev}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
