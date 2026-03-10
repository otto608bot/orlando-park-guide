#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Global nav header HTML
const globalNavHTML = `  <header class="global-header">
    <div class="global-header-content">
      <button class="global-mobile-menu-btn" onclick="GlobalNav.openNav()" aria-label="Open menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <a href="/" class="global-logo">
        <img src="/logo-full.png" alt="Plan Your Park">
      </a>
      <nav class="global-nav">
        <a href="/" id="nav-rides">Rides</a>
        <a href="/character-dining.html" id="nav-dining">Character Dining</a>
        <a href="/blog/" id="nav-blog">Blog</a>
        <a href="/deals.html" id="nav-deals">Deals</a>
      </nav>
    </div>
  </header>

  <div class="global-mobile-nav-sheet" id="global-mobile-nav-sheet" onclick="GlobalNav.closeNav(event)">
    <div class="global-mobile-nav-content" onclick="event.stopPropagation()">
      <div class="global-mobile-nav-header">
        <h3>Menu</h3>
        <button class="global-close-nav-btn" onclick="GlobalNav.closeNav()">&times;</button>
      </div>
      <nav class="global-mobile-nav-links">
        <a href="/" id="mobile-nav-rides">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Rides
        </a>
        <a href="/character-dining.html" id="mobile-nav-dining">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="8" r="4"></circle>
            <path d="M12 14v7"></path>
            <path d="M9 18h6"></path>
          </svg>
          Character Dining
        </a>
        <a href="/blog/" id="mobile-nav-blog">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          Blog
        </a>
        <a href="/deals.html" id="mobile-nav-deals">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Deals
        </a>
      </nav>
    </div>
  </div>

`;

// Files to process with their page types
const files = [
  { file: 'animal-kingdom.html', type: 'rides' },
  { file: 'character-dining.html', type: 'dining' },
  { file: 'epcot.html', type: 'rides' },
  { file: 'hollywood-studios.html', type: 'rides' },
  { file: 'islands-of-adventure.html', type: 'rides' },
  { file: 'legoland-florida.html', type: 'rides' },
  { file: 'magic-kingdom.html', type: 'rides' },
  { file: 'park.html', type: 'rides' },
  { file: 'seaworld-orlando.html', type: 'rides' },
  { file: 'universal-studios-florida.html', type: 'rides' },
  { file: 'blog/best-character-dining-disney-world-2026.html', type: 'blog' },
  { file: 'blog/best-rides-5-year-olds-disney-world.html', type: 'blog' },
  { file: 'blog/best-rides-teens-islands-of-adventure.html', type: 'blog' },
  { file: 'blog/best-shows-disney-world-ranked.html', type: 'blog' },
  { file: 'blog/best-strollers-disney-world.html', type: 'blog' },
  { file: 'blog/disney-vs-universal-adults.html', type: 'blog' },
  { file: 'blog/disney-world-packing-list.html', type: 'blog' },
  { file: 'blog/hollywood-studios-worth-it-kids-under-five.html', type: 'blog' },
  { file: 'blog/how-to-use-genie-plus-disney-world-2026.html', type: 'blog' },
  { file: 'blog/pregnant-moms-guide-magic-kingdom.html', type: 'blog' },
  { file: 'blog/spring-break-disney-world-2026.html', type: 'blog' },
  { file: 'blog/toddler-rides-disney-world.html', type: 'blog' },
  { file: 'blog/universal-vs-disney-comparison.html', type: 'blog' },
];

const baseDir = '/root/.openclaw/workspace/orlando-park-guide';

for (const { file, type } of files) {
  const filePath = path.join(baseDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP: ${file} - file not found`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // 1. Add global-nav.css link in <head> if not present
  if (!content.includes('global-nav.css')) {
    content = content.replace(
      /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter[^"]+" rel="stylesheet">/,
      match => `${match}\n  <link rel="stylesheet" href="/styles/global-nav.css">`
    );
    modified = true;
  }
  
  // 2. Remove old header if present (various patterns)
  const oldHeaderPatterns = [
    /<header class="header">[\s\S]*?<\/header>\s*/,
    /<header class="global-header">[\s\S]*?<\/header>\s*/,
  ];
  
  for (const pattern of oldHeaderPatterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, '');
      modified = true;
    }
  }
  
  // 3. Add global nav after <body>
  if (!content.includes('class="global-header"')) {
    content = content.replace(
      /<body>\s*/,
      `<body>\n${globalNavHTML}`
    );
    modified = true;
  }
  
  // 4. Add global nav script before </body> if not present
  const scriptTag = `<script src="/scripts/global-nav.js"></script>\n<script>GlobalNav.init('${type}');</script>`;
  
  if (!content.includes('global-nav.js')) {
    // Check if there's already a </body> tag
    if (content.includes('</body>')) {
      content = content.replace(
        /<\/body>\s*<\/html>/,
        `${scriptTag}\n</body>\n</html>`
      );
      modified = true;
    }
  }
  
  // 5. Remove old mobile nav sheets if present
  const oldMobileNavPatterns = [
    /<div class="mobile-nav-sheet"[\s\S]*?<\/div>\s*<\/div>\s*/,
    /<div class="global-mobile-nav-sheet"[\s\S]*?<\/div>\s*<\/div>\s*/,
  ];
  
  // Only remove duplicates - keep the one we just added
  const globalNavCount = (content.match(/class="global-mobile-nav-sheet"/g) || []).length;
  if (globalNavCount > 1) {
    // Remove all but the first one
    let foundFirst = false;
    content = content.replace(/<div class="global-mobile-nav-sheet"[\s\S]*?<\/div>\s*<\/div>\s*/g, (match) => {
      if (!foundFirst) {
        foundFirst = true;
        return match;
      }
      return '';
    });
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`UPDATED: ${file}`);
  } else {
    console.log(`UNCHANGED: ${file}`);
  }
}

console.log('\nDone!');
