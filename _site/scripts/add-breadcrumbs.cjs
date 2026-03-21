const fs = require('fs');
const path = require('path');

const baseDir = '/Users/rufusbot/.openclaw/workspace/orlando-park-guide';
const blogDir = path.join(baseDir, 'blog');

// Define breadcrumbs for specific pages
const breadcrumbData = {
  'index.html': [
    { name: 'Home', item: 'https://planyourpark.com/' }
  ],
  'rides.html': [
    { name: 'Home', item: 'https://planyourpark.com/' },
    { name: 'Rides', item: 'https://planyourpark.com/rides.html' }
  ],
  'character-dining.html': [
    { name: 'Home', item: 'https://planyourpark.com/' },
    { name: 'Character Dining', item: 'https://planyourpark.com/character-dining.html' }
  ],
  'deals.html': [
    { name: 'Home', item: 'https://planyourpark.com/' },
    { name: 'Deals', item: 'https://planyourpark.com/deals.html' }
  ],
  'park.html': [
    { name: 'Home', item: 'https://planyourpark.com/' },
    { name: 'Parks', item: 'https://planyourpark.com/' }
  ],
  'blog/index.html': [
    { name: 'Home', item: 'https://planyourpark.com/' },
    { name: 'Blog', item: 'https://planyourpark.com/blog/' }
  ]
};

function getBreadcrumbsForBlog(filename, title) {
  return [
    { name: 'Home', item: 'https://planyourpark.com/' },
    { name: 'Blog', item: 'https://planyourpark.com/blog/' },
    { name: title, item: `https://planyourpark.com/blog/${filename}` }
  ];
}

function generateBreadcrumbSchema(items) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  };
  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

function updateFile(filePath, schema) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove existing BreadcrumbList if any
  content = content.replace(/<script type="application\/ld\+json">\s*{\s*"@context":\s*"https:\/\/schema\.org",\s*"@type":\s*"BreadcrumbList"[\s\S]*?<\/script>/g, '');
  
  // Add before </head>
  if (content.includes('</head>')) {
    content = content.replace('</head>', `${schema}\n</head>`);
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

// Update top-level pages
['index.html', 'rides.html', 'character-dining.html', 'deals.html', 'park.html'].forEach(file => {
  const filePath = path.join(baseDir, file);
  if (fs.existsSync(filePath)) {
    updateFile(filePath, generateBreadcrumbSchema(breadcrumbData[file]));
  }
});

// Update blog pages
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
blogFiles.forEach(file => {
  const filePath = path.join(blogDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  let titleMatch = content.match(/<title>(.*?)<\/title>/);
  let title = titleMatch ? titleMatch[1].split('|')[0].trim() : 'Blog Post';
  
  let breadcrumbs;
  if (file === 'index.html') {
    breadcrumbs = breadcrumbData['blog/index.html'];
  } else {
    breadcrumbs = getBreadcrumbsForBlog(file, title);
  }
  
  updateFile(filePath, generateBreadcrumbSchema(breadcrumbs));
});
