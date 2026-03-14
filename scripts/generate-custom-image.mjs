#!/usr/bin/env node
/**
 * Generate blog hero images using Google Imagen 4
 * Usage: node generate-custom-image.mjs "your custom prompt here"
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const BLOG_DIR = '/root/.openclaw/workspace/orlando-park-guide/blog';

// Parse arguments
const args = process.argv.slice(2);
const customPrompt = args[0];
const outputName = args[1] || 'custom-image.webp';

if (!customPrompt) {
  console.error('❌ Error: Please provide a custom prompt');
  console.error('   Usage: node generate-custom-image.mjs "your prompt" [output-filename.webp]');
  process.exit(1);
}

// Get API key from environment
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error('❌ Error: GOOGLE_API_KEY environment variable not set');
  process.exit(1);
}

const baseStyle = 'Digital illustration, bright and cheerful, family-friendly, soft lighting, clean composition, professional blog header image style, vibrant colors. No text, no words, no letters.';
const prompt = `${customPrompt}. ${baseStyle}`;

const ai = new GoogleGenAI({ apiKey });

async function generateImage() {
  console.log('🎨 Generating image with Imagen 4...');
  console.log(`   Prompt: "${customPrompt}"`);
  console.log(`   Output: ${outputName}`);
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
      
      // Support absolute/relative paths directly, or fall back to BLOG_DIR
      const outputPath = path.isAbsolute(outputName) || outputName.includes('/') 
        ? path.resolve(outputName) 
        : path.join(BLOG_DIR, outputName);
      // Ensure parent directory exists
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, buffer);
      
      const sizeKB = Math.round(buffer.length / 1024);
      console.log(`✅ Image saved: ${outputPath}`);
      console.log(`   Size: ${sizeKB} KB`);
      return outputPath;
    }
    
    console.error('❌ No image data in response');
    process.exit(1);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

generateImage();
