const fs = require('fs');
const path = require('path');

const blogDir = '/Users/rufusbot/.openclaw/workspace/orlando-park-guide/blog';

function generateFAQSchema(qaPairs) {
  if (qaPairs.length === 0) return '';
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": qaPairs.map(pair => ({
      "@type": "Question",
      "name": pair.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": pair.answer
      }
    }))
  };
  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

function extractQA(content) {
  const qaPairs = [];
  // Match the pattern used in the blog posts for QA items
  const regex = /<div class="qa-item">[\s\S]*?<div class="qa-question"><strong>Q:<\/strong>(.*?)<\/div>[\s\S]*?<div class="qa-answer"><strong>A:<\/strong>(.*?)<\/div>[\s\S]*?<\/div>/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    qaPairs.push({
      question: match[1].trim(),
      answer: match[2].trim().replace(/<[^>]*>?/gm, '') // Strip any nested tags in answer
    });
  }
  return qaPairs;
}

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove existing FAQPage if any
  content = content.replace(/<script type="application\/ld\+json">\s*{\s*"@context":\s*"https:\/\/schema\.org",\s*"@type":\s*"FAQPage"[\s\S]*?<\/script>/g, '');
  
  const qaPairs = extractQA(content);
  if (qaPairs.length > 0) {
    const schema = generateFAQSchema(qaPairs);
    if (content.includes('</head>')) {
      content = content.replace('</head>', `${schema}\n</head>`);
      fs.writeFileSync(filePath, content);
      console.log(`Added FAQ schema to ${filePath} (${qaPairs.length} questions)`);
    }
  } else {
    console.log(`No FAQ found in ${filePath}`);
  }
}

const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'index.html');
blogFiles.forEach(file => {
  updateFile(path.join(blogDir, file));
});
