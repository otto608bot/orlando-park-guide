#!/usr/bin/env node
/**
 * Update sitemap.xml with new blog post
 * Usage: node update-sitemap.mjs "blog-post-filename.html"
 */

import fs from 'fs';
import path from 'path';

const SITE_DIR = '/Users/rufusbot/.openclaw/workspace/orlando-park-guide';
const SITEMAP_PATH = path.join(SITE_DIR, 'sitemap.xml');

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function updateSitemap(filename) {
  // Read current sitemap
  let sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
  
  // Check if already exists
  if (sitemap.includes(filename)) {
    console.log(`⚠️ ${filename} already in sitemap`);
    return;
  }
  
  // Create new URL entry
  const newEntry = `  <url>
    <loc>https://planyourpark.com/blog/${filename}</loc>
    <lastmod>${getToday()}</lastmod>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>`;
  
  // Insert before closing </urlset>
  sitemap = sitemap.replace('</urlset>', `${newEntry}\n</urlset>`);
  
  // Write back
  fs.writeFileSync(SITEMAP_PATH, sitemap);
  console.log(`✅ Added ${filename} to sitemap`);
}

// Main
const filename = process.argv[2];
if (!filename) {
  console.error('❌ Usage: node update-sitemap.mjs "blog-post-filename.html"');
  process.exit(1);
}

updateSitemap(filename);
