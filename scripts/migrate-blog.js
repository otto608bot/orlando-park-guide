// migrate-blog.js
// Migrates static HTML blog posts to Markdown with frontmatter for Eleventy
import { readFile, writeFile, readdir, unlink } from 'fs/promises';
import { join } from 'path';

const BLOG_DIR = './src/blog';

function extractContent(html) {
  // Try multiple patterns for article content extraction
  const patterns = [
    // Pattern 1: <div class="article-content">...</div>
    { start: '<div class="article-content">', end: '</div>' },
    // Pattern 2: <div class="article-inner">...</div>
    { start: '<div class="article-inner">', end: '</div>' },
  ];
  
  for (const { start, end } of patterns) {
    const startIdx = html.indexOf(start);
    if (startIdx === -1) continue;
    const contentStart = startIdx + start.length;
    const endIdx = html.indexOf(end, contentStart);
    if (endIdx === -1 || endIdx <= contentStart) continue;
    const content = html.slice(contentStart, endIdx).trim();
    if (content.length > 100) return content;
  }
  
  // Pattern 3: <article ...>...</article> - strip header and related posts
  const articleMatch = html.match(/<article[^>]*>([\s\S]*)<\/article>/);
  if (articleMatch && articleMatch[1]) {
    let content = articleMatch[1];
    const headerEnd = content.match(/<\/picture>\s*/);
    if (headerEnd) {
      content = content.slice(headerEnd.index + headerEnd[0].length);
    }
    const relatedIdx = content.indexOf('<section class="related-posts"');
    if (relatedIdx > 0) {
      content = content.slice(0, relatedIdx).trim();
    }
    if (content.length > 100) return content;
  }
  
  // Pattern 4: <div class="article-container">...</div>  (ends just before <script>)
  const containerMatch = html.match(/<div class="article-container">([\s\S]*?)<\/div>\s*<script/);
  if (containerMatch && containerMatch[1]) {
    let content = containerMatch[1];
    // Strip picture and header from the beginning
    // header ends with </header>, then there's inline-cta or direct content
    const headerEndIdx = content.indexOf('</header>');
    if (headerEndIdx >= 0) {
      content = content.slice(headerEndIdx + '</header>'.length);
    } else {
      // Strip picture if no header found
      const picEndIdx = content.indexOf('</picture>');
      if (picEndIdx >= 0 && picEndIdx < content.length) {
        content = content.slice(picEndIdx + '</picture>'.length);
      }
    }
    // Strip related posts and email capture sections
    const relatedIdx = content.indexOf('<section class="related-posts"');
    if (relatedIdx > 0) {
      content = content.slice(0, relatedIdx).trim();
    }
    if (content.length > 100) return content;
  }
  
  return null;
}

function extractTitle(html) {
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (h1Match) return h1Match[1].replace(/<[^>]+>/g, '').trim();
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  if (titleMatch) return titleMatch[1].replace(/ \| Plan Your Park$/, '').trim();
  return null;
}

function extractDescription(html) {
  const match = html.match(/<meta name="description" content="([^"]+)"/);
  return match ? match[1] : null;
}

function extractHeroImage(html) {
  const pictureMatch = html.match(/<div class="hero-image"[\s\S]*?<picture>[\s\S]*?<source[^>]+srcset="([^"]+)"/);
  if (pictureMatch) return pictureMatch[1];
  const srcMatch = html.match(/srcset="(\/blog\/[^"]+\.webp)"/);
  if (srcMatch) return srcMatch[1];
  // Fallback: look for picture/source in article
  const articlePicMatch = html.match(/<article[^>]*>[\s\S]*?<picture>[\s\S]*?<source[^>]+srcset="([^"]+)"/);
  if (articlePicMatch) return articlePicMatch[1];
  return null;
}

function extractMetaTags(html) {
  // Pattern: <div class="article-meta">March 4, 2026 · Character Dining Guide</div>
  const match = html.match(/<div class="article-meta">([^<]+(?:·[^<]+)?)<\/div>/);
  if (match) {
    const text = match[1].trim();
    const dateMatch = text.match(/[A-Za-z]+ \d{1,2}, \d{4}/);
    if (dateMatch) {
      const date = dateMatch[0];
      const tag = text.replace(date, '').replace(/·/g, '').trim();
      return { tag: tag || 'Guide', date };
    }
    return { tag: text, date: null };
  }
  // Pattern: <div class="article-meta">Disney World • March 7, 2026</div>
  const altMatch = html.match(/<div class="article-meta">([^<]+) • ([^<]+)<\/div>/);
  if (altMatch) {
    return { tag: altMatch[1].trim(), date: altMatch[2].trim() };
  }
  return null;
}

async function processFiles() {
  const files = await readdir(BLOG_DIR);
  const htmlFiles = files.filter(f => f.endsWith('.html') && f !== 'index.html');
  
  console.log(`Found ${htmlFiles.length} HTML blog files to migrate.\n`);
  
  let successCount = 0;
  let skipCount = 0;
  
  for (const file of htmlFiles) {
    const filePath = join(BLOG_DIR, file);
    const html = await readFile(filePath, 'utf8');
    
    const title = extractTitle(html);
    const description = extractDescription(html);
    const heroImage = extractHeroImage(html);
    const metaInfo = extractMetaTags(html);
    const content = extractContent(html);
    
    if (!title) {
      console.warn(`⚠️  Skipping ${file} - missing title`);
      skipCount++;
      continue;
    }
    if (!description) {
      console.warn(`⚠️  Skipping ${file} - missing description`);
      skipCount++;
      continue;
    }
    if (!content) {
      console.warn(`⚠️  Skipping ${file} - could not extract article content`);
      skipCount++;
      continue;
    }
    
    // Build frontmatter
    const frontmatter = {
      layout: 'blog-layout.njk',
      title,
      description,
      hero_image: heroImage || ''
    };
    
    if (metaInfo) {
      if (metaInfo.tag) frontmatter.tags = [metaInfo.tag];
      if (metaInfo.date) frontmatter.date = metaInfo.date;
    }
    
    // Build the Markdown file
    const frontmatterYaml = Object.entries(frontmatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
        }
        return `${key}: "${value}"`;
      })
      .join('\n');
    
    const mdContent = `---\n${frontmatterYaml}\n---\n\n${content}`;
    
    // Write the new .md file
    const mdFileName = file.replace(/\.html$/, '.md');
    const mdPath = join(BLOG_DIR, mdFileName);
    await writeFile(mdPath, mdContent, 'utf8');
    
    console.log(`✅ Created ${mdFileName}`);
    
    // Delete the old HTML file
    await unlink(filePath);
    console.log(`🗑️  Deleted ${file}`);
    successCount++;
    console.log('');
  }
  
  console.log(`\n✨ Migration complete!`);
  console.log(`   ${successCount} migrated, ${skipCount} skipped`);
}

processFiles().catch(console.error);