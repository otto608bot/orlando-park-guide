#!/usr/bin/env node
/**
 * Generate blog hero images using Google Imagen 4
 * Usage: node generate-blog-image.mjs "Best Rides for Toddlers at Disney World"
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const BLOG_DIR = '/root/.openclaw/workspace/orlando-park-guide/blog';

// Parse arguments
const args = process.argv.slice(2);
const title = args[0];

if (!title) {
  console.error('❌ Error: Please provide a blog post title');
  console.error('   Usage: node generate-blog-image.mjs "Your Blog Post Title"');
  process.exit(1);
}

// Get API key from environment
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error('❌ Error: GOOGLE_API_KEY environment variable not set');
  console.error('   Get one at: https://aistudio.google.com/app/apikey');
  console.error('   Then run: export GOOGLE_API_KEY="your-key-here"');
  process.exit(1);
}

// Create filename from title
const filename = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .substring(0, 50) + '.webp';

// Generate prompt based on title
function generatePrompt(title) {
  const baseStyle = 'Digital illustration, bright and cheerful, family-friendly, soft lighting, clean composition, professional blog header image style, vibrant colors';
  
  // Extract key elements from title
  const hasDisney = /disney|magic kingdom|epcot|hollywood studios|animal kingdom/i.test(title);
  const hasUniversal = /universal|islands of adventure|studios/i.test(title);
  const hasKids = /toddler|kid|child|5-year|preschool|baby/i.test(title);
  const hasPregnancy = /pregnant|pregnancy|expecting/i.test(title);
  
  let scene = '';
  
  if (hasDisney) {
    scene = 'Disney World theme park with iconic castle in background, happy families enjoying rides, magical atmosphere';
  } else if (hasUniversal) {
    scene = 'Universal Orlando theme park with exciting attractions, adventurous atmosphere';
  } else {
    scene = 'Orlando theme park with colorful attractions and happy visitors';
  }
  
  if (hasKids) {
    scene += ', young children having fun with parents, whimsical and joyful';
  }
  
  if (hasPregnancy) {
    scene += ', comfortable and relaxed atmosphere, showing accessibility and ease';
  }
  
  return `${scene}. ${baseStyle}. No text, no words, no letters.`;
}

const prompt = generatePrompt(title);
const ai = new GoogleGenAI({ apiKey });

async function generateImage() {
  console.log('🎨 Generating blog hero image with Imagen 4...');
  console.log(`   Title: "${title}"`);
  console.log(`   Output: ${filename}`);
  console.log('');

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const generatedImage = response.generatedImages[0];
      const imageBytes = generatedImage.image.imageBytes;
      const buffer = Buffer.from(imageBytes, 'base64');
      
      const outputPath = path.join(BLOG_DIR, filename);
      fs.writeFileSync(outputPath, buffer);
      
      const sizeKB = Math.round(buffer.length / 1024);
      console.log(`✅ Image saved: ${outputPath}`);
      console.log(`   Size: ${sizeKB} KB`);
      console.log(`   Aspect ratio: 16:9`);
      console.log('');
      console.log('📋 To use in your blog post:');
      console.log(`   <picture>`);
      console.log(`     <source srcset="${filename}" type="image/webp">`);
      console.log(`     <img src="${filename.replace('.webp', '.png')}" alt="${title}">`);
      console.log(`   </picture>`);
      return outputPath;
    }
    
    console.error('❌ No image data in response');
    console.error('Response:', JSON.stringify(response, null, 2));
    process.exit(1);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('API key')) {
      console.error('   Check your GOOGLE_API_KEY is valid at https://aistudio.google.com/app/apikey');
    }
    process.exit(1);
  }
}

generateImage();
