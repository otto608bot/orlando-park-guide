#!/usr/bin/env node
/**
 * Add Google AdSense ads to all PlanYourPark pages
 * Usage: node add-ads-to-all-pages.cjs
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'blog');
const ROOT_DIR = path.join(__dirname, '..');

// AdSense configuration
const ADS = {
  sidebar: `
      <!-- Google AdSense Sidebar Ad -->
      <div class="sidebar-section ad-section">
        <h3 class="sidebar-title">Sponsored</h3>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-6349270729296966"
             data-ad-slot="1235956667"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </div>`,
  
  inlineArticle: `
      <!-- Inline Blog Ad -->
      <div class="blog-inline-ad">
        <div class="ad-label">Sponsored</div>
        <ins class="adsbygoogle"
             style="display:block; text-align:center;"
             data-ad-layout="in-article"
             data-ad-format="fluid"
             data-ad-client="ca-pub-6349270729296966"
             data-ad-slot="7932063231"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </div>`,
  
  footer: `
  <!-- Footer Ad -->
  <section class="footer-ad-section">
    <div class="footer-ad-container">
      <div class="inline-ad-label">Advertisement</div>
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-6349270729296966"
           data-ad-slot="4983629986"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>
           (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>
  </section>`,
  
  aboveFold: `
      <!-- Above Fold Ad -->
      <div class="above-fold-ad">
        <div class="ad-label">Advertisement</div>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-6349270729296966"
             data-ad-slot="7932063231"
             data-ad-format="horizontal"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </div>`
};

const AD_CSS = `
    /* AdSense Ad Styles */
    .ad-section {
      min-height: 250px;
    }
    
    .ad-section ins.adsbygoogle {
      display: block;
      width: 100%;
    }
    
    .blog-inline-ad {
      background: var(--white, #fff);
      border: 1px solid var(--gray-200, #e5e7eb);
      border-radius: 8px;
      padding: 1.5rem;
      margin: 2rem 0;
      text-align: center;
    }
    
    .blog-inline-ad .ad-label {
      font-size: 0.75rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 1rem;
    }
    
    .above-fold-ad {
      background: var(--white, #fff);
      border: 1px solid var(--gray-200, #e5e7eb);
      border-radius: 8px;
      padding: 1rem;
      margin: 1.5rem 0;
      text-align: center;
    }
    
    .above-fold-ad .ad-label {
      font-size: 0.75rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.75rem;
    }
    
    .footer-ad-section {
      background: #f9fafb;
      padding: 2rem;
      border-top: 1px solid #e5e7eb;
    }
    
    .footer-ad-container {
      max-width: 728px;
      margin: 0 auto;
      text-align: center;
    }
    
    .inline-ad-label {
      font-size: 0.75rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.75rem;
    }
`;

function addAdCSSToFile(content) {
  // Check if CSS already exists
  if (content.includes('.blog-inline-ad') || content.includes('.ad-section')) {
    return content;
  }
  
  // Find the closing </style> tag and insert before it
  const styleMatch = content.match(/(<\/style>)(?!.*<\/style>)/s);
  if (styleMatch) {
    return content.replace(styleMatch[0], AD_CSS + '\n' + styleMatch[0]);
  }
  
  return content;
}

function processBlogPost(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Add CSS
  const newContent = addAdCSSToFile(content);
  if (newContent !== content) {
    content = newContent;
    modified = true;
  }
  
  // Add inline ad after 2nd paragraph (if not already present)
  if (!content.includes('blog-inline-ad')) {
    const paragraphs = content.match(/<p>.*?<\/p>/gs);
    if (paragraphs && paragraphs.length >= 2) {
      const secondParagraph = paragraphs[1];
      content = content.replace(secondParagraph, secondParagraph + ADS.inlineArticle);
      modified = true;
    }
  }
  
  // Add footer ad before closing </body> (if not present)
  if (!content.includes('footer-ad-section') && content.includes('</body>')) {
    content = content.replace('</body>', ADS.footer + '\n</body>');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Updated: ${path.basename(filePath)}`);
    return true;
  }
  
  console.log(`○ Skipped: ${path.basename(filePath)} (already has ads)`);
  return false;
}

function processParkPage(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Add CSS
  const newContent = addAdCSSToFile(content);
  if (newContent !== content) {
    content = newContent;
    modified = true;
  }
  
  // Add sidebar ad if sidebar exists but no ad
  if (content.includes('sidebar') && !content.includes('ad-section')) {
    // Try to find a good spot in sidebar
    const sidebarMatch = content.match(/(<aside[^>]*class="[^"]*sidebar[^"]*"[^>]*>.*?)(<\/aside>)/s);
    if (sidebarMatch) {
      // Insert before closing </aside>
      content = content.replace(sidebarMatch[0], sidebarMatch[1] + ADS.sidebar + '\n      ' + sidebarMatch[2]);
      modified = true;
    }
  }
  
  // Add footer ad
  if (!content.includes('footer-ad-section') && content.includes('</body>')) {
    content = content.replace('</body>', ADS.footer + '\n</body>');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Updated: ${path.basename(filePath)}`);
    return true;
  }
  
  console.log(`○ Skipped: ${path.basename(filePath)}`);
  return false;
}

// Main execution
console.log('Adding AdSense ads to all PlanYourPark pages...\n');

let blogUpdated = 0;
let parkUpdated = 0;

// Process blog posts
if (fs.existsSync(BLOG_DIR)) {
  const blogFiles = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));
  console.log(`\n--- Blog Posts (${blogFiles.length} files) ---`);
  for (const file of blogFiles) {
    if (processBlogPost(path.join(BLOG_DIR, file))) {
      blogUpdated++;
    }
  }
}

// Process park pages (excluding index.html which already has ads)
const parkFiles = fs.readdirSync(ROOT_DIR)
  .filter(f => f.endsWith('.html') && f !== 'index.html' && f !== '404.html');
console.log(`\n--- Park Pages (${parkFiles.length} files) ---`);
for (const file of parkFiles) {
  if (processParkPage(path.join(ROOT_DIR, file))) {
    parkUpdated++;
  }
}

console.log(`\n=== Summary ===`);
console.log(`Blog posts updated: ${blogUpdated}`);
console.log(`Park pages updated: ${parkUpdated}`);
console.log(`Total pages modified: ${blogUpdated + parkUpdated}`);
