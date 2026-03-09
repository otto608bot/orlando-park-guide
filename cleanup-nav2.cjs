#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const baseDir = '/root/.openclaw/workspace/orlando-park-guide';

// Files to clean up
const files = [
  'blog/disney-vs-universal-adults.html',
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
  
  // Remove .global-mobile-nav-content styles
  const mobileNavContentPattern = /\.global-mobile-nav-content \{[\s\S]*?transform: translateX\(0\);\s*\}/;
  if (mobileNavContentPattern.test(content)) {
    content = content.replace(mobileNavContentPattern, '');
    modified = true;
  }
  
  // Remove .global-mobile-nav-header styles
  const mobileNavHeaderPattern = /\.global-mobile-nav-header \{[\s\S]*?border-bottom: 1px solid #E2E8F0;\s*\}/;
  if (mobileNavHeaderPattern.test(content)) {
    content = content.replace(mobileNavHeaderPattern, '');
    modified = true;
  }
  
  // Remove .global-mobile-nav-header h3 styles
  const mobileNavHeaderH3Pattern = /\.global-mobile-nav-header h3 \{[\s\S]*?margin: 0;\s*\}/;
  if (mobileNavHeaderH3Pattern.test(content)) {
    content = content.replace(mobileNavHeaderH3Pattern, '');
    modified = true;
  }
  
  // Remove .global-close-nav-btn styles
  const closeNavBtnPattern = /\.global-close-nav-btn \{[\s\S]*?line-height: 1;\s*\}/;
  if (closeNavBtnPattern.test(content)) {
    content = content.replace(closeNavBtnPattern, '');
    modified = true;
  }
  
  // Remove .global-mobile-nav-links styles
  const mobileNavLinksPattern = /\.global-mobile-nav-links \{[\s\S]*?gap: 0\.5rem;\s*\}/;
  if (mobileNavLinksPattern.test(content)) {
    content = content.replace(mobileNavLinksPattern, '');
    modified = true;
  }
  
  // Remove .global-mobile-nav-links a styles
  const mobileNavLinksAPattern = /\.global-mobile-nav-links a \{[\s\S]*?transition: background 0\.2s;\s*\}/;
  if (mobileNavLinksAPattern.test(content)) {
    content = content.replace(mobileNavLinksAPattern, '');
    modified = true;
  }
  
  // Remove .global-mobile-nav-links a:hover styles
  const mobileNavLinksAHoverPattern = /\.global-mobile-nav-links a:hover \{[\s\S]*?background: #F7FAFC;\s*\}/;
  if (mobileNavLinksAHoverPattern.test(content)) {
    content = content.replace(mobileNavLinksAHoverPattern, '');
    modified = true;
  }
  
  // Remove .global-mobile-nav-links a.active styles
  const mobileNavLinksAActivePattern = /\.global-mobile-nav-links a\.active \{[\s\S]*?background: #F7FAFC;\s*\}/;
  if (mobileNavLinksAActivePattern.test(content)) {
    content = content.replace(mobileNavLinksAActivePattern, '');
    modified = true;
  }
  
  // Remove @media (max-width: 1024px) { .global-header-content... } styles
  const mediaQueryPattern = /@media \(max-width: 1024px\) \{[\s\S]*?\.global-header-content \{[\s\S]*?\}[\s\S]*?\.global-mobile-menu-btn \{[\s\S]*?\}[\s\S]*?\.global-nav \{[\s\S]*?\}[\s\S]*?\.global-logo img \{[\s\S]*?\}[\s\S]*?\}/;
  if (mediaQueryPattern.test(content)) {
    content = content.replace(mediaQueryPattern, '');
    modified = true;
  }
  
  // Clean up extra blank lines
  content = content.replace(/\n\n\n+/g, '\n\n');
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`CLEANED: ${file}`);
  } else {
    console.log(`NO CHANGES: ${file}`);
  }
}

console.log('\nDone!');
