const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');

const outputDir = '/root/.openclaw/workspace/orlando-park-guide/images/rides';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    // Handle both http and https
    const client = url.startsWith('https') ? https : require('http');
    const file = fs.createWriteStream(outputPath);
    
    const request = client.get(url, { timeout: 30000 }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        downloadImage(response.headers.location, outputPath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(outputPath);
      });
    });
    
    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function scrapeWikimediaCommons(rideName, rideId, browser) {
  console.log(`\n[WIKIMEDIA] ${rideName}...`);
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  
  try {
    // Search Wikimedia Commons
    const searchQuery = encodeURIComponent(rideName);
    const searchUrl = `https://commons.wikimedia.org/w/index.php?search=${searchQuery}&title=Special:MediaSearch&go=Go&type=image`;
    
    await sleep(2000 + Math.random() * 3000);
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(1500);
    
    // Click on first result to get full image
    const firstResult = await page.locator('.sd-image a, .results-info a').first();
    if (await firstResult.isVisible().catch(() => false)) {
      await firstResult.click();
      await sleep(2000);
      
      // Look for original/full resolution link
      const originalLink = await page.locator('a:has-text("Original file"), .fullImageLink a').first();
      if (await originalLink.isVisible().catch(() => false)) {
        const imageUrl = await originalLink.getAttribute('href');
        if (imageUrl) {
          const fullUrl = imageUrl.startsWith('http') ? imageUrl : `https://commons.wikimedia.org${imageUrl}`;
          console.log(`  Downloading: ${fullUrl.substring(0, 60)}...`);
          
          const outputPath = path.join(outputDir, `${rideId}.jpg`);
          await downloadImage(fullUrl, outputPath);
          
          // Check file size
          const stats = fs.statSync(outputPath);
          console.log(`  ✓ Downloaded: ${rideId}.jpg (${(stats.size / 1024).toFixed(1)} KB)`);
          
          await context.close();
          await sleep(3000 + Math.random() * 2000);
          return { success: true, source: fullUrl };
        }
      }
    }
    
    await context.close();
    return { success: false, error: 'No image found' };
    
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    await context.close();
    await sleep(2000);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('=== Downloading Real Ride Images from Wikimedia Commons ===\n');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const rides = [
    { name: 'Space Mountain Magic Kingdom', id: 'space-mountain' },
    { name: 'Big Thunder Mountain Railroad', id: 'big-thunder-mountain' },
    { name: 'Haunted Mansion Magic Kingdom', id: 'haunted-mansion' },
    { name: 'Pirates of the Caribbean Magic Kingdom', id: 'pirates-caribbean' },
    { name: 'Seven Dwarfs Mine Train', id: 'seven-dwarfs' },
    { name: 'Guardians of the Galaxy Cosmic Rewind', id: 'guardians-galaxy' },
    { name: 'Remy Ratatouille Adventure', id: 'remy' },
    { name: 'Test Track EPCOT', id: 'test-track' },
    { name: 'Soarin EPCOT', id: 'soarin' },
    { name: 'Star Wars Rise of the Resistance', id: 'rise-resistance' },
    { name: 'Slinky Dog Dash', id: 'slinky-dog' },
    { name: 'Tower of Terror Hollywood Studios', id: 'tower-terror' },
    { name: 'Millennium Falcon Smugglers Run', id: 'millennium-falcon' },
    { name: 'Avatar Flight of Passage', id: 'avatar-flight' },
    { name: 'Expedition Everest', id: 'expedition-everest' },
    { name: 'Kilimanjaro Safaris', id: 'kilimanjaro-safaris' },
    { name: 'Harry Potter Escape from Gringotts', id: 'gringotts' },
    { name: 'Revenge of the Mummy Universal', id: 'revenge-mummy' },
    { name: 'Transformers The Ride 3D', id: 'transformers' },
    { name: 'Hagrids Magical Creatures Motorbike Adventure', id: 'hagrids' },
    { name: 'Jurassic World VelociCoaster', id: 'velocicoaster' },
    { name: 'Spider-Man Islands of Adventure', id: 'spiderman' },
    { name: 'Mako SeaWorld', id: 'mako' },
    { name: 'Kraken SeaWorld', id: 'kraken' },
    { name: 'Journey to Atlantis SeaWorld', id: 'journey-atlantis' },
    { name: 'The Dragon LEGOLAND Florida', id: 'the-dragon' },
    { name: 'Coastersaurus LEGOLAND', id: 'coastersaurus' }
  ];
  
  const results = { success: [], failed: [] };
  
  for (const ride of rides) {
    const result = await scrapeWikimediaCommons(ride.name, ride.id, browser);
    if (result.success) {
      results.success.push({ ...ride, ...result });
    } else {
      results.failed.push({ ...ride, ...result });
    }
  }
  
  await browser.close();
  
  console.log('\n=== Report ===');
  console.log(`Total: ${rides.length}`);
  console.log(`Success: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log('\nFailed rides:');
    results.failed.forEach(r => console.log(`  - ${r.name}: ${r.error}`));
  }
  
  return results;
}

main().catch(console.error);
