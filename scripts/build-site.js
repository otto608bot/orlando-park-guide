// build-site.js - Build script to refactor HTML files with common header and footer templates

const fs = require('fs');
const path = require('path');

// Define paths
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const HEADER_PATH = path.join(TEMPLATES_DIR, 'header.html');
const FOOTER_PATH = path.join(TEMPLATES_DIR, 'footer.html');
const CONTENT_DIR = path.join(__dirname, '..', 'content');
const OUTPUT_DIR = path.join(__dirname, '..', 'dist');

// Ensure output directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Read template files
function readTemplate(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Template file not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

// Process a single content file
function processContentFile(contentFilePath, headerContent, footerContent) {
  console.log(`Processing content file: ${contentFilePath}`);
  const content = fs.readFileSync(contentFilePath, 'utf8');
  
  // Extract the body content (or use the whole file if no body tags)
  let bodyContent = content;
  const bodyMatch = content.match(/<body[^>]*>(.*?)</body>/s);
  if (bodyMatch) {
    bodyContent = bodyMatch[1];
  }

  // Build the full HTML with header and footer
  const fullHtml = `${headerContent}
<body>
${bodyContent}
</body>
${footerContent}`;

  // Determine output path
  const relativePath = path.relative(CONTENT_DIR, contentFilePath);
  const outputPath = path.join(OUTPUT_DIR, relativePath);
  const outputDir = path.dirname(outputPath);

  ensureDir(outputDir);

  // Write the output file
  fs.writeFileSync(outputPath, fullHtml, 'utf8');
  console.log(`Wrote output file: ${outputPath}`);
}

// Process all content files in the directory
function processAllContentFiles(headerContent, footerContent) {
  console.log(`Processing content files from: ${CONTENT_DIR}`);
  
  function traverseDir(currentDir) {
    const files = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(currentDir, file.name);
      if (file.isDirectory()) {
        traverseDir(fullPath);
      } else if (file.isFile() && file.name.endsWith('.html')) {
        processContentFile(fullPath, headerContent, footerContent);
      }
    }
  }

  traverseDir(CONTENT_DIR);
}

// Main function
function main() {
  console.log('Starting site build process...');
  ensureDir(OUTPUT_DIR);

  // Read header and footer templates
  console.log(`Reading header template: ${HEADER_PATH}`);
  const headerContent = readTemplate(HEADER_PATH);
  console.log(`Reading footer template: ${FOOTER_PATH}`);
  const footerContent = readTemplate(FOOTER_PATH);

  // Process all content files
  processAllContentFiles(headerContent, footerContent);

  console.log('Site build process complete.');
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('Error during build process:', error);
    process.exit(1);
  }
}
