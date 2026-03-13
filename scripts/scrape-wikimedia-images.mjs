#!/usr/bin/env node
/**
 * Wikimedia Commons Image Scraper for Orlando Park Guide
 * 
 * Scrapes ride images from Wikimedia Commons using Playwright
 * Saves 800px thumbnails to /images/rides/[ride-id].jpg
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rides configuration
const rides = [
  { id: 'mk-space-mountain', name: 'Space Mountain', park: 'Magic Kingdom' },
  { id: 'mk-big-thunder', name: 'Big Thunder Mountain Railroad', park: 'Magic Kingdom' },
  { id: 'mk-haunted-mansion', name: 'Haunted Mansion', park: 'Magic Kingdom' },
  { id: 'mk-pirates', name: 'Pirates of the Caribbean', park: 'Magic Kingdom' },
  { id: 'mk-seven-dwarfs', name: 'Seven Dwarfs Mine Train', park: 'Magic Kingdom' },
  { id: 'epcot-guardians', name: 'Guardians of the Galaxy Cosmic Rewind', park: 'EPCOT' },
  { id: 'epcot-remy', name: 'Remy Ratatouille Adventure', park: 'EPCOT' },
  { id: 'epcot-test-track', name: 'Test Track', park: 'EPCOT' },
  { id: 'epcot-soarin', name: 'Soarin Around the World', park: 'EPCOT' },
  { id: 'hs-rise-resistance', name: 'Star Wars Rise of the Resistance', park: 'Hollywood Studios' },
  { id: 'hs-slinky', name: 'Slinky Dog Dash', park: 'Hollywood Studios' },
  { id: 'hs-tower-terror', name: 'Tower of Terror', park: 'Hollywood Studios' },
  { id: 'hs-smugglers-run', name: 'Millennium Falcon Smugglers Run', park: 'Hollywood Studios' },
  { id: 'ak-avatar', name: 'Avatar Flight of Passage', park: 'Animal Kingdom' },
  { id: 'ak-everest', name: 'Expedition Everest', park: 'Animal Kingdom' },
  { id: 'ak-safari', name: 'Kilimanjaro Safaris', park: 'Animal Kingdom' },
  { id: 'usf-gringotts', name: 'Harry Potter Escape from Gringotts', park: 'Universal Studios' },
  { id: 'usf-mummy', name: 'Revenge of the Mummy', park: 'Universal Studios' },
  { id: 'usf-transformers', name: 'Transformers The Ride', park: 'Universal Studios' },
  { id: 'ioa-hagrids', name: 'Hagrid Magical Creatures Motorbike Adventure', park: 'Islands of Adventure' },
  { id: 'ioa-velocicoaster', name: 'Jurassic World VelociCoaster', park: 'Islands of Adventure' },
  { id: 'ioa-spiderman', name: 'Amazing Adventures of Spider-Man', park: 'Islands of Adventure' },
  { id: 'sw-mako', name: 'Mako', park: 'SeaWorld' },
  { id: 'sw-kraken', name: 'Kraken', park: 'SeaWorld' },
  { id: 'sw-atlantis', name: 'Journey to Atlantis', park: 'SeaWorld' },
  { id: 'll-dragon', name: 'The Dragon', park: 'LEGOLAND' },
  { id: 'll-coastersaurus', name: 'Coastersaurus', park: 'LEGOLAND' }
];

// Configuration
const OUTPUT_DIR = path.join(__dirname, '..', 'images', 'rides');
const WIKIMEDIA_SEARCH_URL = 'https://commons.wikimedia.org/wiki/Special:Search';
const DELAY_BETWEEN_RIDES_MS = 5000; // 5 seconds rate limiting
const RETRY_DELAY_MS = 2000;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created output directory: ${OUTPUT_DIR}`);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Download image from URL and save to file
 */
async function downloadImage(imageUrl, outputPath) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    return true;
  } catch (error) {
    throw new Error(`Download failed: ${error.message}`);
  }
}

/**
 * Scrape image for a single ride
 */
async function scrapeRideImage(browser, ride, index, total) {
  const searchQuery = `"${ride.name}" "${ride.park}"`;
  const outputPath = path.join(OUTPUT_DIR, `${ride.id}.jpg`);
  
  console.log(`\n[${index + 1}/${total}] Processing: ${ride.name} (${ride.park})`);
  console.log(`  Search query: ${searchQuery}`);
  
  // Skip if already exists
  if (fs.existsSync(outputPath)) {
    console.log(`  ⏭️  Already exists, skipping`);
    return { success: true, skipped: true, ride };
  }
  
  const page = await browser.newPage();
  
  try {
    // Navigate to Wikimedia Commons search
    await page.goto(WIKIMEDIA_SEARCH_URL, { waitUntil: 'networkidle' });
    
    // Enter search query
    const searchInput = await page.locator('input[name="search"]').first();
    await searchInput.fill(searchQuery);
    await searchInput.press('Enter');
    
    // Wait for search results
    await page.waitForLoadState('networkidle');
    await sleep(1000);
    
    // Look for image results - try different selectors
    const imageLinkSelectors = [
      '.searchResultImage a',
      '.gallerybox a',
      '.filethumb a',
      '.searchresults a[href^="/wiki/File:"]',
      'a[href*="File:"]'
    ];
    
    let imageLink = null;
    for (const selector of imageLinkSelectors) {
      const links = await page.locator(selector).all();
      if (links.length > 0) {
        // Get the first actual image result
        for (const link of links) {
          const href = await link.getAttribute('href');
          if (href && href.includes('File:')) {
            imageLink = link;
            break;
          }
        }
        if (imageLink) break;
      }
    }
    
    if (!imageLink) {
      console.log(`  ❌ No image results found`);
      return { success: false, error: 'No image results found', ride };
    }
    
    // Click on the first image result
    await imageLink.click();
    await page.waitForLoadState('networkidle');
    await sleep(1000);
    
    // Try to find the 800px thumbnail URL
    let imageUrl = null;
    
    // Method 1: Look for "800px" link in the file page
    const eightHundredLinks = await page.locator('a:has-text("800px")').all();
    for (const link of eightHundredLinks) {
      const href = await link.getAttribute('href');
      if (href && (href.endsWith('.jpg') || href.endsWith('.jpeg') || href.endsWith('.png'))) {
        imageUrl = href.startsWith('http') ? href : `https:${href}`;
        break;
      }
    }
    
    // Method 2: Look for download links or direct image URLs
    if (!imageUrl) {
      const downloadLinks = await page.locator('a[download], a:has-text("Download")').all();
      for (const link of downloadLinks) {
        const href = await link.getAttribute('href');
        if (href && (href.includes('.jpg') || href.includes('.jpeg') || href.includes('.png'))) {
          imageUrl = href.startsWith('http') ? href : `https:${href}`;
          break;
        }
      }
    }
    
    // Method 3: Extract from the main image on the page
    if (!imageUrl) {
      const mainImage = await page.locator('.fullImageLink img, .mw-file-element, #file img').first();
      if (mainImage) {
        const src = await mainImage.getAttribute('src');
        if (src) {
          // Try to get 800px version by modifying the URL
          // Wikimedia URLs often have /thumb/ and size parameters
          imageUrl = src.startsWith('http') ? src : `https:${src}`;
          
          // Convert to 800px thumbnail if it's a thumb URL
          if (imageUrl.includes('/thumb/')) {
            // Replace the last size segment with 800px
            imageUrl = imageUrl.replace(/\/\d+px-/, '/800px-');
          }
        }
      }
    }
    
    // Method 4: Construct 800px URL from the file page
    if (!imageUrl) {
      const currentUrl = page.url();
      const fileMatch = currentUrl.match(/File:([^\/]+)$/);
      if (fileMatch) {
        const filename = decodeURIComponent(fileMatch[1]);
        const encodedFilename = encodeURIComponent(filename);
        imageUrl = `https://upload.wikimedia.org/wikipedia/commons/thumb/${encodedFilename.charAt(0)}/${encodedFilename.substring(0, 2)}/${encodedFilename}/800px-${encodedFilename}`;
      }
    }
    
    if (!imageUrl) {
      console.log(`  ❌ Could not find image URL`);
      return { success: false, error: 'Could not find image URL', ride };
    }
    
    console.log(`  📥 Downloading: ${imageUrl.substring(0, 80)}...`);
    
    // Download the image with retry
    let downloadSuccess = false;
    try {
      await downloadImage(imageUrl, outputPath);
      downloadSuccess = true;
    } catch (error) {
      console.log(`  ⚠️  First download attempt failed, retrying...`);
      await sleep(RETRY_DELAY_MS);
      try {
        await downloadImage(imageUrl, outputPath);
        downloadSuccess = true;
      } catch (retryError) {
        console.log(`  ❌ Download failed after retry: ${retryError.message}`);
        return { success: false, error: retryError.message, ride };
      }
    }
    
    if (downloadSuccess) {
      const stats = fs.statSync(outputPath);
      console.log(`  ✅ Saved: ${ride.id}.jpg (${(stats.size / 1024).toFixed(1)} KB)`);
      return { success: true, ride, size: stats.size };
    }
    
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return { success: false, error: error.message, ride };
  } finally {
    await page.close();
  }
}

/**
 * Main scraping function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Wikimedia Commons Image Scraper');
  console.log('Orlando Park Guide - Ride Images');
  console.log('='.repeat(60));
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Total rides to process: ${rides.length}`);
  console.log(`Rate limit: ${DELAY_BETWEEN_RIDES_MS / 1000}s between requests`);
  console.log('');
  
  const browser = await chromium.launch({ headless: true });
  const results = {
    success: [],
    failed: [],
    skipped: []
  };
  
  try {
    for (let i = 0; i < rides.length; i++) {
      const ride = rides[i];
      const result = await scrapeRideImage(browser, ride, i, rides.length);
      
      if (result.skipped) {
        results.skipped.push(result);
      } else if (result.success) {
        results.success.push(result);
      } else {
        results.failed.push(result);
      }
      
      // Rate limiting - wait before next request
      if (i < rides.length - 1) {
        process.stdout.write(`  ⏳ Waiting ${DELAY_BETWEEN_RIDES_MS / 1000}s...`);
        await sleep(DELAY_BETWEEN_RIDES_MS);
        console.log(' done');
      }
    }
  } finally {
    await browser.close();
  }
  
  // Print summary report
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY REPORT');
  console.log('='.repeat(60));
  console.log(`✅ Successfully downloaded: ${results.success.length}`);
  console.log(`⏭️  Skipped (already exists): ${results.skipped.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`📊 Total: ${rides.length}`);
  console.log('');
  
  if (results.failed.length > 0) {
    console.log('Failed rides:');
    for (const fail of results.failed) {
      console.log(`  - ${fail.ride.name} (${fail.ride.park}): ${fail.error}`);
    }
  }
  
  if (results.success.length > 0) {
    console.log('\nDownloaded images:');
    for (const success of results.success) {
      const sizeKB = success.size ? `(${(success.size / 1024).toFixed(1)} KB)` : '';
      console.log(`  ✅ ${success.ride.id}.jpg ${sizeKB}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Scraping complete!');
  console.log('='.repeat(60));
}

// Run the scraper
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
