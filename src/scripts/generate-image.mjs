#!/usr/bin/env node
/**
 * Generate blog hero images using Google Imagen 3
 * Usage: node generate-image.mjs "prompt" --output "filename.webp"
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const BLOG_DIR = '/root/.openclaw/workspace/orlando-park-guide/blog';

// Parse arguments
const args = process.argv.slice(2);
const promptIndex = args.findIndex(arg => !arg.startsWith('--'));
const prompt = args[promptIndex] || 'A magical Disney castle at sunset with fireworks';
const outputArg = args.find(arg => arg.startsWith('--output='));
const outputFile = outputArg ? outputArg.split('=')[1] : 'hero-image.webp';

// Get API key from environment
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error('❌ Error: GOOGLE_API_KEY environment variable not set');
  console.error('   Get one at: https://aistudio.google.com/app/apikey');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function generateImage() {
  console.log('🎨 Generating image with Imagen 3...');
  console.log(`   Prompt: "${prompt}"`);
  console.log('');

  try {
    const response = await ai.models.generateContent({
      model: 'imagen-3.0-generate-002',
      contents: prompt,
      config: {
        responseModalities: ['image'],
        aspectRatio: '16:9',  // Good for blog hero images
        numberOfImages: 1,
      },
    });

    // Check for image in response
    if (response.candidates && response.candidates[0]?.content?.parts) {
      const parts = response.candidates[0].content.parts;
      const imagePart = parts.find(part => part.inlineData);
      
      if (imagePart && imagePart.inlineData) {
        const imageData = imagePart.inlineData.data;
        const buffer = Buffer.from(imageData, 'base64');
        
        const outputPath = path.join(BLOG_DIR, outputFile);
        fs.writeFileSync(outputPath, buffer);
        
        const sizeKB = Math.round(buffer.length / 1024);
        console.log(`✅ Image saved: ${outputPath}`);
        console.log(`   Size: ${sizeKB} KB`);
        console.log(`   Aspect ratio: 16:9`);
        return outputPath;
      }
    }
    
    console.error('❌ No image data in response');
    console.error('Response:', JSON.stringify(response, null, 2));
    process.exit(1);
    
  } catch (error) {
    console.error('❌ Error generating image:', error.message);
    if (error.message.includes('API key')) {
      console.error('   Check your GOOGLE_API_KEY is valid');
    }
    process.exit(1);
  }
}

generateImage();
