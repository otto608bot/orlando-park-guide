const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Output directory
const outputDir = '/root/.openclaw/workspace/orlando-park-guide/images/rides';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function randomMouseMovement(page) {
  const moves = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < moves; i++) {
    const x = 100 + Math.floor(Math.random() * 800);
    const y = 100 + Math.floor(Math.random() * 500);
    await page.mouse.move(x, y);
    await sleep(300 + Math.floor(Math.random() * 700));
  }
}

async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, { timeout: 30000 }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(outputPath);
      });
    }).on('error', reject);
  });
}

async function scrapeWikipedia(rideName, rideId, browser) {
  console.log(`\n[WIKIPEDIA] Scraping ${rideName}...`);
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  
  try {
    // Build Wikipedia search URL
    const searchQuery = encodeURIComponent(rideName + ' Disney World ride');
    const searchUrl = `https://en.wikipedia.org/w/index.php?search=${searchQuery}`;
    
    console.log(`  Searching: ${rideName}`);
    await sleep(3000 + Math.random() * 4000);
    
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(2000);
    await randomMouseMovement(page);
    
    // Look for infobox image
    const imageSelectors = [
      '.infobox img',
      '.thumbinner img',
      '.mw-parser-output > div img',
      'figure img'
    ];
    
    let imageUrl = null;
    for (const selector of imageSelectors) {
      try {
        const img = await page.locator(selector).first();
        if (await img.isVisible().catch(() => false)) {
          imageUrl = await img.getAttribute('src');
          if (imageUrl) {
            // Convert to full URL if needed
            if (imageUrl.startsWith('//')) {
              imageUrl = 'https:' + imageUrl;
            } else if (imageUrl.startsWith('/')) {
              imageUrl = 'https://en.wikipedia.org' + imageUrl;
            }
            console.log(`  Found image: ${imageUrl.substring(0, 80)}...`);
            break;
          }
        }
      } catch (e) {
        continue;
      }
    }
    
    if (imageUrl) {
      // Download the image
      const outputPath = path.join(outputDir, `${rideId}.jpg`);
      try {
        await downloadImage(imageUrl, outputPath);
        console.log(`  ✓ Downloaded: ${outputPath}`);
        await context.close();
        await sleep(5000 + Math.random() * 5000);
        return { success: true, source: page.url(), imageUrl };
      } catch (downloadErr) {
        console.log(`  Download failed, taking screenshot instead...`);
      }
    }
    
    // Fallback to screenshot
    const outputPath = path.join(outputDir, `${rideId}.jpg`);
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`  ✓ Screenshot saved: ${outputPath}`);
    
    await context.close();
    await sleep(5000 + Math.random() * 5000);
    return { success: true, source: page.url(), path: outputPath };
    
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    await context.close();
    await sleep(5000);
    return { success: false, error: error.message };
  }
}

async function scrapeWikimediaDirect(rideName, rideId, browser) {
  console.log(`\n[WIKIMEDIA] Scraping ${rideName}...`);
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  
  try {
    // Try Wikimedia Commons directly
    const searchQuery = encodeURIComponent(rideName.replace(/\s+/g, '_'));
    const commonsUrl = `https://commons.wikimedia.org/w/index.php?search=${searchQuery}+disney&title=Special:MediaSearch&go=Go&type=image`;
    
    console.log(`  Searching Wikimedia Commons...`);
    await sleep(3000 + Math.random() * 4000);
    
    await page.goto(commonsUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(2000);
    await randomMouseMovement(page);
    
    // Look for first image result
    const firstImage = await page.locator('.sd-image a img, .image img').first();
    if (await firstImage.isVisible().catch(() => false)) {
      let imageUrl = await firstImage.getAttribute('src');
      if (imageUrl) {
        if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
        
        // Get full resolution version
        imageUrl = imageUrl.replace(/\/thumb\//, '/').replace(/\/\d+px-.*$/, '');
        
        console.log(`  Found image: ${imageUrl.substring(0, 80)}...`);
        const outputPath = path.join(outputDir, `${rideId}.jpg`);
        
        try {
          await downloadImage(imageUrl, outputPath);
          console.log(`  ✓ Downloaded: ${outputPath}`);
          await context.close();
          await sleep(5000 + Math.random() * 5000);
          return { success: true, source: page.url(), imageUrl };
        } catch (e) {
          console.log(`  Download failed: ${e.message}`);
        }
      }
    }
    
    await context.close();
    return { success: false, error: 'No image found' };
    
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    await context.close();
    await sleep(5000);
    return { success: false, error: error.message };
  }
}

async function scrapeOfficialSite(ride, browser, baseUrl, siteName) {
  console.log(`\n[${siteName}] Scraping ${ride.name}...`);
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  
  try {
    await sleep(5000 + Math.random() * 5000);
    
    const url = `${baseUrl}${ride.id}/`;
    console.log(`  Trying: ${url}`);
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await sleep(3000);
    await randomMouseMovement(page);
    
    const outputPath = path.join(outputDir, `${ride.id}.jpg`);
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`  ✓ Screenshot saved: ${outputPath}`);
    
    const currentUrl = page.url();
    await context.close();
    await sleep(8000 + Math.random() * 7000);
    
    return { success: true, source: currentUrl, path: outputPath };
    
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    await context.close();
    await sleep(5000);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('=== Orlando Park Ride Image Scraper ===');
  console.log('Using Wikipedia/Wikimedia as primary source...\n');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });
  
  const results = {
    success: [],
    failed: []
  };
  
  // All rides with their search names
  const rides = [
    // Magic Kingdom
    { name: 'Space Mountain', id: 'space-mountain', park: 'Magic Kingdom' },
    { name: 'Big Thunder Mountain Railroad', id: 'big-thunder-mountain', park: 'Magic Kingdom' },
    { name: 'Haunted Mansion', id: 'haunted-mansion', park: 'Magic Kingdom' },
    { name: 'Pirates of the Caribbean', id: 'pirates-caribbean', park: 'Magic Kingdom' },
    { name: 'Seven Dwarfs Mine Train', id: 'seven-dwarfs', park: 'Magic Kingdom' },
    // EPCOT
    { name: 'Guardians of the Galaxy Cosmic Rewind', id: 'guardians-galaxy', park: 'EPCOT' },
    { name: 'Remy Ratatouille Adventure', id: 'remy', park: 'EPCOT' },
    { name: 'Test Track', id: 'test-track', park: 'EPCOT' },
    { name: 'Soarin', id: 'soarin', park: 'EPCOT' },
    // Hollywood Studios
    { name: 'Star Wars Rise of the Resistance', id: 'rise-resistance', park: 'Hollywood Studios' },
    { name: 'Slinky Dog Dash', id: 'slinky-dog', park: 'Hollywood Studios' },
    { name: 'Tower of Terror', id: 'tower-terror', park: 'Hollywood Studios' },
    { name: 'Millennium Falcon Smugglers Run', id: 'millennium-falcon', park: 'Hollywood Studios' },
    // Animal Kingdom
    { name: 'Avatar Flight of Passage', id: 'avatar-flight', park: 'Animal Kingdom' },
    { name: 'Expedition Everest', id: 'expedition-everest', park: 'Animal Kingdom' },
    { name: 'Kilimanjaro Safaris', id: 'kilimanjaro-safaris', park: 'Animal Kingdom' },
    // Universal Studios
    { name: 'Harry Potter Escape from Gringotts', id: 'gringotts', park: 'Universal Studios' },
    { name: 'Revenge of the Mummy', id: 'revenge-mummy', park: 'Universal Studios' },
    { name: 'Transformers The Ride', id: 'transformers', park: 'Universal Studios' },
    // Islands of Adventure
    { name: 'Hagrids Magical Creatures Motorbike Adventure', id: 'hagrids', park: 'Islands of Adventure' },
    { name: 'Jurassic World VelociCoaster', id: 'velocicoaster', park: 'Islands of Adventure' },
    { name: 'Amazing Adventures of Spider-Man', id: 'spiderman', park: 'Islands of Adventure' },
    // SeaWorld
    { name: 'Mako roller coaster', id: 'mako', park: 'SeaWorld' },
    { name: 'Kraken roller coaster', id: 'kraken', park: 'SeaWorld' },
    { name: 'Journey to Atlantis', id: 'journey-atlantis', park: 'SeaWorld' },
    // LEGOLAND
    { name: 'The Dragon LEGOLAND', id: 'the-dragon', park: 'LEGOLAND' },
    { name: 'Coastersaurus', id: 'coastersaurus', park: 'LEGOLAND' }
  ];
  
  // Process rides one at a time
  for (const ride of rides) {
    let result;
    
    // Try Wikipedia first
    result = await scrapeWikipedia(ride.name, ride.id, browser);
    
    if (!result.success) {
      // Try Wikimedia Commons
      result = await scrapeWikimediaDirect(ride.name, ride.id, browser);
    }
    
    if (result.success) {
      results.success.push({ ...ride, ...result });
    } else {
      results.failed.push({ ...ride, ...result });
    }
  }
  
  await browser.close();
  
  // Report
  console.log('\n\n=== SCRAPING REPORT ===');
  console.log(`Total rides: ${rides.length}`);
  console.log(`Successful: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);
  
  if (results.success.length > 0) {
    console.log('\n--- Successful Rides ---');
    results.success.forEach(r => {
      console.log(`  ✓ ${r.name} (${r.park})`);
    });
  }
  
  if (results.failed.length > 0) {
    console.log('\n--- Failed Rides ---');
    results.failed.forEach(r => {
      console.log(`  ✗ ${r.name} (${r.park}): ${r.error}`);
    });
  }
  
  // Save report
  const reportPath = path.join(outputDir, '..', 'scrape-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nReport saved to: ${reportPath}`);
  
  // List saved images
  const files = fs.readdirSync(outputDir);
  console.log(`\n--- Saved Images (${files.length}) ---`);
  files.forEach(f => console.log(`  - ${f}`));
  
  return results;
}

main().catch(console.error);
