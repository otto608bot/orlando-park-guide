#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const baseDir = '/root/.openclaw/workspace/orlando-park-guide';

// Files to clean up
const files = [
  'blog/best-strollers-disney-world.html',
  'blog/disney-vs-universal-adults.html',
  'blog/disney-world-packing-list.html',
  'blog/index.html',
];

for (const file of files) {
  const filePath = path.join(baseDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP: ${file} - file not found`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Remove inline global nav styles (from /* Global Navigation */ to the closing })
  // This pattern matches the inline styles that were added before we had the external CSS
  const inlineStylePattern = /\/\* Global Navigation \*\/[\s\S]*?\.global-mobile-menu-btn \{[\s\S]*?\}[\s\S]*?\}[\s\S]*?\}[\s\S]*?\}[\s\S]*?\}/;
  
  if (inlineStylePattern.test(content)) {
    content = content.replace(inlineStylePattern, '');
    modified = true;
    console.log(`Removed inline styles from: ${file}`);
  }
  
  // Also remove the media query that often follows
  const mediaQueryPattern = /@media \(max-width: 1024px\) \{[\s\S]*?\.global-mobile-menu-btn \{ display: flex; \}[\s\S]*?\.global-nav \{ display: none; \}[\s\S]*?\}/;
  if (mediaQueryPattern.test(content)) {
    content = content.replace(mediaQueryPattern, '');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`CLEANED: ${file}`);
  } else {
    console.log(`NO CHANGES: ${file}`);
  }
}

console.log('\nDone!');
