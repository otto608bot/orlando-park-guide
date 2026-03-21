const fs = require('fs');
const path = require('path');

const blogDir = '/Users/rufusbot/.openclaw/workspace/orlando-park-guide/blog';

const linksToAdd = [
  { text: 'view all Orlando rides', url: '/rides.html' },
  { text: 'Disney World park guides', url: '/park.html?park=magic-kingdom' },
  { text: 'Universal Orlando guides', url: '/park.html?park=universal-studios' }
];

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Check if it already links to rides.html
  if (!content.includes('rides.html')) {
    console.log(`Adding rides.html link to ${filePath}`);
    // Add a link before the related-posts section or at the end of the article
    const insertLink = `\n<p>Planning your day? You can <a href="/rides.html">view all Orlando rides</a> and filter by height or accessibility to find the perfect fit for your family.</p>\n`;
    
    if (content.includes('<section class="related-posts">')) {
      content = content.replace('<section class="related-posts">', `${insertLink}<section class="related-posts">`);
      updated = true;
    } else if (content.includes('</article>')) {
      content = content.replace('</article>', `${insertLink}</article>`);
      updated = true;
    }
  }

  // Ensure it links to some park pages if relevant
  if (content.toLowerCase().includes('disney world') && !content.includes('park.html?park=')) {
    console.log(`Adding park guide link to ${filePath}`);
    const parkLink = `\n<p>For more detailed planning, check out our <a href="/park.html?park=magic-kingdom">Disney World park guides</a>.</p>\n`;
    if (content.includes('<section class="related-posts">')) {
      content = content.replace('<section class="related-posts">', `${parkLink}<section class="related-posts">`);
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`Added internal links to ${filePath}`);
  }
}

const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'index.html');
blogFiles.forEach(file => {
  updateFile(path.join(blogDir, file));
});
