/**
 * Blog Migration Script v2
 * 
 * Migrates HTML blog posts to Markdown with YAML frontmatter.
 * Uses cheerio for reliable DOM parsing to avoid truncation issues
 * that plague regex-based approaches.
 * 
 * Run: node scripts/migrate-blog-v2.cjs
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const BLOG_DIR = path.join(__dirname, '../src/blog');
const EXCLUDED = ['index.html']; // Don't migrate the blog index

// Map of filename stems to tags (based on content analysis)
const TAG_MAP = {
  'best-character-dining-disney-world-2026': ['Dining', 'Guide'],
  'best-rides-5-year-olds-disney-world': ['Rides', 'Tips'],
  'best-rides-teens-islands-of-adventure': ['Rides', 'Tips'],
  'best-shows-disney-world-ranked': ['Entertainment', 'Tips'],
  'best-strollers-disney-world': ['Planning', 'Tips'],
  'disney-vs-universal-adults': ['Planning', 'Comparison'],
  'disney-world-packing-list': ['Planning', 'Checklists'],
  'epic-universe-rides-guide-2026': ['Universal', 'Rides'],
  'free-things-disney-world': ['Money-Saving', 'Tips'],
  'hollywood-studios-worth-it-kids-under-five': ['Rides', 'Tips'],
  'how-to-use-genie-plus-disney-world-2026': ['Planning', 'Tips'],
  'orlando-closures-march-2026': ['News', 'Updates'],
  'pregnant-moms-guide-magic-kingdom': ['Tips', 'Special Needs'],
  'spring-break-disney-world-2026': ['Planning', 'Seasonal'],
  'toddler-rides-disney-world': ['Rides', 'Tips'],
  'universal-vs-disney-comparison': ['Comparison', 'Planning'],
};

function extractDate(metaText) {
  if (!metaText) return null;
  // Match patterns like "March 4, 2026" or "March 4, 2026 · Category"
  const dateMatch = metaText.match(/([A-Za-z]+ \d{1,2}, \d{4})/);
  if (dateMatch) return dateMatch[1];
  
  // Fallback: look for any 4-digit year sequence
  const yearMatch = metaText.match(/(\d{4})/);
  if (yearMatch) return yearMatch[1];
  
  return null;
}

function extractTagsFromMeta(metaText, defaultTags) {
  if (!metaText) return defaultTags;
  
  // Remove the date from meta text first
  const textWithoutDate = metaText.replace(/[A-Za-z]+ \d{1,2}, \d{4}/, '').trim();
  
  // Split by · or other separators
  const parts = textWithoutDate.split(/[·•—–-]/).map(s => s.trim()).filter(Boolean);
  
  if (parts.length > 0) {
    return parts;
  }
  
  return defaultTags;
}

function extractHeroImage($) {
  // Try picture source first (webp), then fallback to img src
  // Handle both <article>, <div.article-container>, and direct patterns
  const picture = $('picture source, article picture source, .article-container picture source').first();
  if (picture.length) {
    const srcset = picture.attr('srcset');
    if (srcset) return srcset.split(' ')[0];
  }
  const img = $('article picture img, .article-container picture img, picture img').first();
  if (img.length) {
    return img.attr('src') || img.attr('data-src') || '';
  }
  return '';
}

function convertToSlug(filename) {
  return filename.replace('.html', '');
}

async function migrateFile(htmlFile) {
  const filename = path.basename(htmlFile);
  const slug = filename.replace('.html', '');
  
  console.log(`\nProcessing: ${filename}`);
  
  const html = fs.readFileSync(htmlFile, 'utf-8');
  const $ = cheerio.load(html, { 
    decodeEntities: false,
    xmlMode: false
  });

  // Extract title from h1 (handle <article> or <div.article-container> patterns)
  const titleEl = $('article h1, .article-container h1').first();
  const title = titleEl.text().trim();
  if (!title) {
    console.error(`  ERROR: No title found in ${filename}`);
    return false;
  }
  
  // Extract meta div
  const metaEl = $('article .article-meta, .article-container .article-meta').first();
  const metaText = metaEl.text().trim();
  
  // Extract date and tags
  const date = extractDate(metaText);
  const defaultTags = TAG_MAP[slug] || ['Tips'];
  const tags = extractTagsFromMeta(metaText, defaultTags);
  
  // Extract description - first paragraph after h1
  const article = $('article, .article-container');
  const firstP = article.find('> p').first();
  const description = firstP.text().trim().substring(0, 200);
  
  // Extract hero image
  const heroImage = extractHeroImage($);
  
  // Extract article content - handle multiple patterns
  let contentHTML = '';
  
  // Pattern 1: Explicit div.article-content
  const articleContentDiv = $('div.article-content');
  if (articleContentDiv.length) {
    contentHTML = articleContentDiv.html();
    console.log(`  Content pattern: div.article-content (${contentHTML ? contentHTML.length : 0} chars)`);
  }
  
  // Pattern 2: Content inside <article> or <div.article-container> but before related-posts
  if (!contentHTML || contentHTML.length < 100) {
    // Find the related-posts section and get everything before it
    const relatedSection = $('section.related-posts, section.email-capture, div.bottom-cta, .related-posts, .email-capture, .qa-section, .bottom-cta').first();
    
    if (relatedSection.length) {
      // Clone the container and find content between header and first section
      const articleInner = article.clone();
      
      // Remove the header
      articleInner.find('header').remove();
      
      // Remove all sections that come after content
      articleInner.find('section.related-posts, section.email-capture, section.qa-section, .bottom-cta, .related-posts, .email-capture, .qa-section, .bottom-cta').remove();
      
      // Also remove the picture/hero image if it's at the start
      articleInner.find('picture').first().remove();
      
      contentHTML = articleInner.html();
      console.log(`  Content pattern: article/container children before sections (${contentHTML ? contentHTML.length : 0} chars)`);
    }
  }
  
  if (!contentHTML || contentHTML.length < 100) {
    console.error(`  ERROR: Content too short or empty in ${filename}`);
    console.error(`  Content found: "${contentHTML}"`);
    return false;
  }
  
  console.log(`  Title: ${title.substring(0, 50)}...`);
  console.log(`  Tags: ${tags.join(', ')}`);
  console.log(`  Date: ${date || 'not found'}`);
  console.log(`  Hero: ${heroImage || 'not found'}`);
  console.log(`  Content length: ${contentHTML.length} chars`);
  
  // Build YAML frontmatter
  const frontmatter = {
    title,
    description: description.substring(0, 160),
    tags,
    date,
    hero_image: heroImage || undefined,
    layout: 'blog-layout.njk'
  };
  
  // Filter out undefined values
  const fm = Object.fromEntries(
    Object.entries(frontmatter).filter(([_, v]) => v !== undefined)
  );
  
  const yaml = Object.entries(fm).map(([k, v]) => {
    if (Array.isArray(v)) {
      return `${k}:\n${v.map(item => `  - ${item}`).join('\n')}`;
    }
    // Escape quotes in string values
    const escaped = String(v).replace(/"/g, '\\"');
    return `${k}: "${escaped}"`;
  }).join('\n');
  
  // Build markdown file
  const mdContent = `---\n${yaml}\n---\n\n${contentHTML}\n`;
  
  const mdFilename = path.join(BLOG_DIR, `${slug}.md`);
  fs.writeFileSync(mdFilename, mdContent, 'utf-8');
  
  console.log(`  -> Created ${slug}.md (${mdContent.length} bytes)`);
  
  // Delete the original HTML
  fs.unlinkSync(htmlFile);
  console.log(`  -> Deleted ${filename}`);
  
  return true;
}

async function main() {
  console.log('=== Blog Migration v2 ===');
  console.log('Using cheerio for reliable HTML parsing...\n');
  
  // Check if cheerio is installed
  try {
    require.resolve('cheerio');
  } catch (e) {
    console.error('ERROR: cheerio is not installed.');
    console.error('Run: npm install cheerio');
    process.exit(1);
  }
  
  // Get all HTML files
  const files = fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.html') && !EXCLUDED.includes(f))
    .map(f => path.join(BLOG_DIR, f));
  
  if (files.length === 0) {
    console.log('No HTML files found to migrate.');
    return;
  }
  
  console.log(`Found ${files.length} HTML files to migrate.\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const file of files) {
    try {
      const result = await migrateFile(file);
      if (result) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (err) {
      console.error(`  EXCEPTION: ${err.message}`);
      failCount++;
    }
  }
  
  console.log(`\n=== Migration Complete ===`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}

main().catch(console.error);