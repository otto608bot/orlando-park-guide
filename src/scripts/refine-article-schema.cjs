const fs = require('fs');
const path = require('path');

const blogDir = '/Users/rufusbot/.openclaw/workspace/orlando-park-guide/blog';

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find Article schema
  const articleRegex = /<script type="application\/ld\+json">\s*{\s*"@context":\s*"https:\/\/schema\.org",\s*"@type":\s*"Article"[\s\S]*?<\/script>/;
  const match = content.match(articleRegex);
  
  if (match) {
    try {
      const jsonStr = match[0].replace(/<script type="application\/ld\+json">/, '').replace(/<\/script>/, '');
      const schema = JSON.parse(jsonStr);
      
      // Update dateModified to now (ISO date)
      const now = new Date().toISOString().split('T')[0];
      schema.dateModified = now;
      
      // Ensure organization details are robust
      schema.author = {
        "@type": "Organization",
        "name": "Plan Your Park",
        "url": "https://planyourpark.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://planyourpark.com/logo-full.png"
        }
      };
      
      schema.publisher = {
        "@type": "Organization",
        "name": "Plan Your Park",
        "url": "https://planyourpark.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://planyourpark.com/logo-full.png"
        }
      };

      const newSchemaStr = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
      content = content.replace(match[0], newSchemaStr);
      fs.writeFileSync(filePath, content);
      console.log(`Refined Article schema in ${filePath}`);
    } catch (e) {
      console.error(`Error parsing schema in ${filePath}: ${e.message}`);
    }
  } else {
    console.log(`No Article schema found in ${filePath}`);
  }
}

const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'index.html');
blogFiles.forEach(file => {
  updateFile(path.join(blogDir, file));
});
