const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Output directory
const outputDir = '/root/.openclaw/workspace/orlando-park-guide/images/rides';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Random user agents
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'
];

function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function randomMouseMovement(page) {
  const moves = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < moves; i++) {
    const x = 100 + Math.floor(Math.random() * 800);
    const y = 100 + Math.floor(Math.random() * 500);
    await page.mouse.move(x, y);
    await sleep(500 + Math.floor(Math.random() * 1000));
  }
}

async function scrapeWithRetry(scrapeFn, ride, browser, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`  Attempt ${attempt}/${maxRetries}...`);
    const result = await scrapeFn(ride, browser);
    if (result.success) {
      return result;
    }
    if (attempt < maxRetries) {
      console.log(`  Waiting 60s before retry...`);
      await sleep(60000);
    }
  }
  return { success: false, error: 'Max retries exceeded' };
}

async function scrapeDisneyRide(ride, browser) {
  console.log(`\n[DISNEY] Scraping ${ride.name}...`);
  
  const context = await browser.newContext({
    userAgent: getRandomUserAgent(),
    viewport: { width: 1280, height: 800 },
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    }
  });
  
  const page = await context.newPage();
  
  try {
    await sleep(8000 + Math.random() * 7000);
    
    // Try direct ride URL first
    const rideUrl = `https://disneyworld.disney.go.com/attractions/${ride.park}/${ride.id}/`;
    console.log(`  Trying direct URL: ${rideUrl}`);
    
    try {
      await page.goto(rideUrl, { 
        waitUntil: 'domcontentloaded', 
        timeout: 45000 
      });
    } catch (e) {
      // Fallback to search
      console.log(`  Direct URL failed, trying search page...`);
      const searchUrl = `https://disneyworld.disney.go.com/search/?q=${encodeURIComponent(ride.name)}`;
      await page.goto(searchUrl, { 
        waitUntil: 'domcontentloaded', 
        timeout: 45000 
      });
    }
    
    await sleep(5000);
    await randomMouseMovement(page);
    
    // Take screenshot
    const outputPath = path.join(outputDir, `${ride.id}.jpg`);
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`  ✓ Screenshot saved: ${outputPath}`);
    
    const currentUrl = page.url();
    await context.close();
    await sleep(15000 + Math.random() * 10000);
    
    return { success: true, source: currentUrl, path: outputPath };
    
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    await context.close();
    await sleep(15000);
    return { success: false, error: error.message };
  }
}

async function scrapeUniversalRide(ride, browser) {
  console.log(`\n[UNIVERSAL] Scraping ${ride.name}...`);
  
  const context = await browser.newContext({
    userAgent: getRandomUserAgent(),
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  
  try {
    await sleep(8000 + Math.random() * 7000);
    
    // Try direct ride URL
    const rideUrl = `https://www.universalorlando.com/web/en/us/things-to-do/rides-attractions/${ride.id}`;
    console.log(`  Trying: ${rideUrl}`);
    
    await page.goto(rideUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await sleep(5000);
    await randomMouseMovement(page);
    
    const outputPath = path.join(outputDir, `${ride.id}.jpg`);
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`  ✓ Screenshot saved: ${outputPath}`);
    
    const currentUrl = page.url();
    await context.close();
    await sleep(15000 + Math.random() * 10000);
    
    return { success: true, source: currentUrl, path: outputPath };
    
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    await context.close();
    await sleep(15000);
    return { success: false, error: error.message };
  }
}

async function scrapeSeaWorldRide(ride, browser) {
  console.log(`\n[SEAWORLD] Scraping ${ride.name}...`);
  
  const context = await browser.newContext({
    userAgent: getRandomUserAgent(),
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  
  try {
    await sleep(8000 + Math.random() * 7000);
    
    const rideUrl = `https://seaworld.com/orlando/rides/${ride.id}/`;
    console.log(`  Trying: ${rideUrl}`);
    
    await page.goto(rideUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await sleep(5000);
    await randomMouseMovement(page);
    
    const outputPath = path.join(outputDir, `${ride.id}.jpg`);
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`  ✓ Screenshot saved: ${outputPath}`);
    
    const currentUrl = page.url();
    await context.close();
    await sleep(15000 + Math.random() * 10000);
    
    return { success: true, source: currentUrl, path: outputPath };
    
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    await context.close();
    await sleep(15000);
    return { success: false, error: error.message };
  }
}

async function scrapeLegolandRide(ride, browser) {
  console.log(`\n[LEGOLAND] Scraping ${ride.name}...`);
  
  const context = await browser.newContext({
    userAgent: getRandomUserAgent(),
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  
  try {
    await sleep(8000 + Math.random() * 7000);
    
    const rideUrl = `https://www.florida.legoland.com/rides/${ride.id}/`;
    console.log(`  Trying: ${rideUrl}`);
    
    await page.goto(rideUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await sleep(5000);
    await randomMouseMovement(page);
    
    const outputPath = path.join(outputDir, `${ride.id}.jpg`);
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`  ✓ Screenshot saved: ${outputPath}`);
    
    const currentUrl = page.url();
    await context.close();
    await sleep(15000 + Math.random() * 10000);
    
    return { success: true, source: currentUrl, path: outputPath };
    
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    await context.close();
    await sleep(15000);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('=== Orlando Park Ride Image Scraper ===');
  console.log('Using human-like delays and retry logic...\n');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });
  
  const results = {
    success: [],
    failed: []
  };
  
  // Disney rides - using simpler IDs
  const disneyRides = [
    { name: 'Space Mountain', id: 'space-mountain', park: 'magic-kingdom' },
    { name: 'Big Thunder Mountain', id: 'big-thunder-mountain', park: 'magic-kingdom' },
    { name: 'Haunted Mansion', id: 'haunted-mansion', park: 'magic-kingdom' },
    { name: 'Pirates of the Caribbean', id: 'pirates-of-the-caribbean', park: 'magic-kingdom' },
    { name: 'Seven Dwarfs Mine Train', id: 'seven-dwarfs-mine-train', park: 'magic-kingdom' },
    { name: 'Guardians of the Galaxy', id: 'guardians-of-the-galaxy-cosmic-rewind', park: 'epcot' },
    { name: 'Remy Ratatouille', id: 'remys-ratatouille-adventure', park: 'epcot' },
    { name: 'Test Track', id: 'test-track', park: 'epcot' },
    { name: 'Soarin', id: 'soarin', park: 'epcot' },
    { name: 'Rise of the Resistance', id: 'star-wars-rise-of-the-resistance', park: 'hollywood-studios' },
    { name: 'Slinky Dog Dash', id: 'slinky-dog-dash', park: 'hollywood-studios' },
    { name: 'Tower of Terror', id: 'the-twilight-zone-tower-of-terror', park: 'hollywood-studios' },
    { name: 'Millennium Falcon', id: 'millennium-falcon-smugglers-run', park: 'hollywood-studios' },
    { name: 'Avatar Flight of Passage', id: 'avatar-flight-of-passage', park: 'animal-kingdom' },
    { name: 'Expedition Everest', id: 'expedition-everest', park: 'animal-kingdom' },
    { name: 'Kilimanjaro Safaris', id: 'kilimanjaro-safaris', park: 'animal-kingdom' }
  ];
  
  const universalRides = [
    { name: 'Gringotts', id: 'harry-potter-and-the-escape-from-gringotts' },
    { name: 'Revenge of the Mummy', id: 'revenge-of-the-mummy' },
    { name: 'Transformers', id: 'transformers-the-ride-3d' },
    { name: 'Hagrids Motorbike', id: 'hagrids-magical-creatures-motorbike-adventure' },
    { name: 'VelociCoaster', id: 'jurassic-world-velocicoaster' },
    { name: 'Spider-Man', id: 'the-amazing-adventures-of-spider-man' }
  ];
  
  const seaworldRides = [
    { name: 'Mako', id: 'mako' },
    { name: 'Kraken', id: 'kraken' },
    { name: 'Journey to Atlantis', id: 'journey-to-atlantis' }
  ];
  
  const legolandRides = [
    { name: 'The Dragon', id: 'the-dragon' },
    { name: 'Coastersaurus', id: 'coastersaurus' }
  ];
  
  // Process rides one at a time with delays
  console.log('\n--- DISNEY WORLD RIDES ---');
  for (const ride of disneyRides) {
    const result = await scrapeWithRetry(scrapeDisneyRide, ride, browser);
    if (result.success) {
      results.success.push({ ...ride, park: 'Disney', ...result });
    } else {
      results.failed.push({ ...ride, park: 'Disney', ...result });
    }
  }
  
  console.log('\n--- UNIVERSAL ORLANDO RIDES ---');
  for (const ride of universalRides) {
    const result = await scrapeWithRetry(scrapeUniversalRide, ride, browser);
    if (result.success) {
      results.success.push({ ...ride, park: 'Universal', ...result });
    } else {
      results.failed.push({ ...ride, park: 'Universal', ...result });
    }
  }
  
  console.log('\n--- SEAWORLD RIDES ---');
  for (const ride of seaworldRides) {
    const result = await scrapeWithRetry(scrapeSeaWorldRide, ride, browser);
    if (result.success) {
      results.success.push({ ...ride, park: 'SeaWorld', ...result });
    } else {
      results.failed.push({ ...ride, park: 'SeaWorld', ...result });
    }
  }
  
  console.log('\n--- LEGOLAND RIDES ---');
  for (const ride of legolandRides) {
    const result = await scrapeWithRetry(scrapeLegolandRide, ride, browser);
    if (result.success) {
      results.success.push({ ...ride, park: 'LEGOLAND', ...result });
    } else {
      results.failed.push({ ...ride, park: 'LEGOLAND', ...result });
    }
  }
  
  await browser.close();
  
  // Report
  console.log('\n\n=== SCRAPING REPORT ===');
  const totalRides = disneyRides.length + universalRides.length + seaworldRides.length + legolandRides.length;
  console.log(`Total rides: ${totalRides}`);
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
  
  return results;
}

main().catch(console.error);
