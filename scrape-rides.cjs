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
  // Random mouse movements to appear human-like
  const moves = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < moves; i++) {
    const x = 100 + Math.floor(Math.random() * 800);
    const y = 100 + Math.floor(Math.random() * 500);
    await page.mouse.move(x, y);
    await sleep(500 + Math.floor(Math.random() * 1000));
  }
}

async function scrapeDisneyRide(rideName, rideId, parkPath, browser) {
  console.log(`\n[DISNEY] Scraping ${rideName}...`);
  
  const context = await browser.newContext({
    userAgent: getRandomUserAgent(),
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  
  try {
    // Delay before navigation
    await sleep(5000 + Math.random() * 5000);
    
    // Navigate to Disney attractions page
    const searchUrl = `https://disneyworld.disney.go.com/attractions/${parkPath}/`;
    console.log(`  Navigating to: ${searchUrl}`);
    
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await randomMouseMovement(page);
    
    // Try to find the ride link
    const rideSelectors = [
      `a[href*="${rideId}"]`,
      `a:has-text("${rideName}")`,
      `a:has-text("${rideName.split(' ')[0]}")`,
      `[data-testid*="${rideId}"]`,
      `[class*="card"]:has-text("${rideName}")`
    ];
    
    let rideLink = null;
    for (const selector of rideSelectors) {
      try {
        rideLink = await page.locator(selector).first();
        if (await rideLink.isVisible().catch(() => false)) {
          console.log(`  Found ride link with selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!rideLink) {
      // Try searching on page
      console.log('  Trying to find ride by scrolling...');
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await sleep(2000);
      
      // Look for any link containing ride name
      const links = await page.locator('a').all();
      for (const link of links) {
        const text = await link.textContent().catch(() => '');
        if (text.toLowerCase().includes(rideName.toLowerCase().split(' ')[0])) {
          rideLink = link;
          console.log(`  Found ride by text search: ${text.trim()}`);
          break;
        }
      }
    }
    
    if (rideLink) {
      await sleep(2000 + Math.random() * 2000);
      await rideLink.click();
      console.log('  Clicked ride link, waiting for page load...');
      await sleep(5000 + Math.random() * 3000);
      await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    } else {
      console.log('  Could not find ride link, using search page screenshot');
    }
    
    // Take screenshot
    await randomMouseMovement(page);
    const outputPath = path.join(outputDir, `${rideId}.jpg`);
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`  ✓ Screenshot saved: ${outputPath}`);
    
    await context.close();
    
    // Delay between rides
    await sleep(10000 + Math.random() * 5000);
    
    return { success: true, source: page.url(), path: outputPath };
    
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    await context.close();
    await sleep(10000);
    return { success: false, error: error.message };
  }
}

async function scrapeUniversalRide(rideName, rideId, browser) {
  console.log(`\n[UNIVERSAL] Scraping ${rideName}...`);
  
  const context = await browser.newContext({
    userAgent: getRandomUserAgent(),
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  
  try {
    await sleep(5000 + Math.random() * 5000);
    
    const url = 'https://www.universalorlando.com/web/en/us/things-to-do/rides-attractions';
    console.log(`  Navigating to: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await randomMouseMovement(page);
    
    // Search for ride
    const searchInput = await page.locator('input[type="search"], input[placeholder*="search" i], [data-testid*="search"]').first();
    if (searchInput) {
      await sleep(1000);
      await searchInput.fill(rideName.split(' ')[0]);
      await sleep(2000);
      await page.keyboard.press('Enter');
      await sleep(3000);
    }
    
    // Try to find and click ride
    const rideLink = await page.locator(`a:has-text("${rideName}"), a:has-text("${rideName.split(' ')[0]}")`).first();
    if (await rideLink.isVisible().catch(() => false)) {
      await sleep(2000);
      await rideLink.click();
      await sleep(5000);
      await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    }
    
    await randomMouseMovement(page);
    const outputPath = path.join(outputDir, `${rideId}.jpg`);
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`  ✓ Screenshot saved: ${outputPath}`);
    
    await context.close();
    await sleep(10000 + Math.random() * 5000);
    
    return { success: true, source: page.url(), path: outputPath };
    
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    await context.close();
    await sleep(10000);
    return { success: false, error: error.message };
  }
}

async function scrapeSeaWorldRide(rideName, rideId, browser) {
  console.log(`\n[SEAWORLD] Scraping ${rideName}...`);
  
  const context = await browser.newContext({
    userAgent: getRandomUserAgent(),
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  
  try {
    await sleep(5000 + Math.random() * 5000);
    
    const url = 'https://seaworld.com/orlando/rides/';
    console.log(`  Navigating to: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await randomMouseMovement(page);
    
    // Find ride link
    const rideLink = await page.locator(`a:has-text("${rideName}"), a:has-text("${rideName.split(' ')[0]}")`).first();
    if (await rideLink.isVisible().catch(() => false)) {
      await sleep(2000);
      await rideLink.click();
      await sleep(5000);
      await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    }
    
    await randomMouseMovement(page);
    const outputPath = path.join(outputDir, `${rideId}.jpg`);
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`  ✓ Screenshot saved: ${outputPath}`);
    
    await context.close();
    await sleep(10000 + Math.random() * 5000);
    
    return { success: true, source: page.url(), path: outputPath };
    
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    await context.close();
    await sleep(10000);
    return { success: false, error: error.message };
  }
}

async function scrapeLegolandRide(rideName, rideId, browser) {
  console.log(`\n[LEGOLAND] Scraping ${rideName}...`);
  
  const context = await browser.newContext({
    userAgent: getRandomUserAgent(),
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  
  try {
    await sleep(5000 + Math.random() * 5000);
    
    const url = 'https://www.florida.legoland.com/rides/';
    console.log(`  Navigating to: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await randomMouseMovement(page);
    
    // Find ride link
    const rideLink = await page.locator(`a:has-text("${rideName}"), a:has-text("${rideName.split(' ')[0]}")`).first();
    if (await rideLink.isVisible().catch(() => false)) {
      await sleep(2000);
      await rideLink.click();
      await sleep(5000);
      await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    }
    
    await randomMouseMovement(page);
    const outputPath = path.join(outputDir, `${rideId}.jpg`);
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`  ✓ Screenshot saved: ${outputPath}`);
    
    await context.close();
    await sleep(10000 + Math.random() * 5000);
    
    return { success: true, source: page.url(), path: outputPath };
    
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    await context.close();
    await sleep(10000);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('=== Orlando Park Ride Image Scraper ===');
  console.log('Starting with human-like delays...\n');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const results = {
    success: [],
    failed: []
  };
  
  // Disney rides
  const disneyRides = [
    // Magic Kingdom
    { name: 'Space Mountain', id: 'space-mountain', park: 'magic-kingdom' },
    { name: 'Big Thunder Mountain Railroad', id: 'big-thunder-mountain', park: 'magic-kingdom' },
    { name: 'Haunted Mansion', id: 'haunted-mansion', park: 'magic-kingdom' },
    { name: "Pirates of the Caribbean", id: 'pirates-caribbean', park: 'magic-kingdom' },
    { name: 'Seven Dwarfs Mine Train', id: 'seven-dwarfs', park: 'magic-kingdom' },
    // EPCOT
    { name: 'Guardians of the Galaxy', id: 'guardians-galaxy', park: 'epcot' },
    { name: 'Remy\'s Ratatouille Adventure', id: 'remy-ratatouille', park: 'epcot' },
    { name: 'Test Track', id: 'test-track', park: 'epcot' },
    { name: 'Soarin\' Around the World', id: 'soarin', park: 'epcot' },
    // Hollywood Studios
    { name: 'Star Wars: Rise of the Resistance', id: 'rise-resistance', park: 'hollywood-studios' },
    { name: 'Slinky Dog Dash', id: 'slinky-dog', park: 'hollywood-studios' },
    { name: 'The Twilight Zone Tower of Terror', id: 'tower-terror', park: 'hollywood-studios' },
    { name: 'Millennium Falcon: Smugglers Run', id: 'millennium-falcon', park: 'hollywood-studios' },
    // Animal Kingdom
    { name: 'Avatar Flight of Passage', id: 'avatar-flight', park: 'animal-kingdom' },
    { name: 'Expedition Everest', id: 'expedition-everest', park: 'animal-kingdom' },
    { name: 'Kilimanjaro Safaris', id: 'kilimanjaro-safaris', park: 'animal-kingdom' }
  ];
  
  // Universal rides
  const universalRides = [
    { name: 'Harry Potter and the Escape from Gringotts', id: 'gringotts' },
    { name: 'Revenge of the Mummy', id: 'revenge-mummy' },
    { name: 'Transformers: The Ride-3D', id: 'transformers' },
    { name: 'Hagrid\'s Magical Creatures Motorbike Adventure', id: 'hagrids' },
    { name: 'Jurassic World VelociCoaster', id: 'velocicoaster' },
    { name: 'The Amazing Adventures of Spider-Man', id: 'spiderman' }
  ];
  
  // SeaWorld rides
  const seaworldRides = [
    { name: 'Mako', id: 'mako' },
    { name: 'Kraken', id: 'kraken' },
    { name: 'Journey to Atlantis', id: 'journey-atlantis' }
  ];
  
  // LEGOLAND rides
  const legolandRides = [
    { name: 'The Dragon', id: 'the-dragon' },
    { name: 'Coastersaurus', id: 'coastersaurus' }
  ];
  
  // Process Disney rides
  console.log('\n--- DISNEY WORLD RIDES ---');
  for (const ride of disneyRides) {
    const result = await scrapeDisneyRide(ride.name, ride.id, ride.park, browser);
    if (result.success) {
      results.success.push({ ...ride, park: 'Disney', ...result });
    } else {
      results.failed.push({ ...ride, park: 'Disney', ...result });
    }
  }
  
  // Process Universal rides
  console.log('\n--- UNIVERSAL ORLANDO RIDES ---');
  for (const ride of universalRides) {
    const result = await scrapeUniversalRide(ride.name, ride.id, browser);
    if (result.success) {
      results.success.push({ ...ride, park: 'Universal', ...result });
    } else {
      results.failed.push({ ...ride, park: 'Universal', ...result });
    }
  }
  
  // Process SeaWorld rides
  console.log('\n--- SEAWORLD RIDES ---');
  for (const ride of seaworldRides) {
    const result = await scrapeSeaWorldRide(ride.name, ride.id, browser);
    if (result.success) {
      results.success.push({ ...ride, park: 'SeaWorld', ...result });
    } else {
      results.failed.push({ ...ride, park: 'SeaWorld', ...result });
    }
  }
  
  // Process LEGOLAND rides
  console.log('\n--- LEGOLAND RIDES ---');
  for (const ride of legolandRides) {
    const result = await scrapeLegolandRide(ride.name, ride.id, browser);
    if (result.success) {
      results.success.push({ ...ride, park: 'LEGOLAND', ...result });
    } else {
      results.failed.push({ ...ride, park: 'LEGOLAND', ...result });
    }
  }
  
  await browser.close();
  
  // Report
  console.log('\n\n=== SCRAPING REPORT ===');
  console.log(`Total rides: ${disneyRides.length + universalRides.length + seaworldRides.length + legolandRides.length}`);
  console.log(`Successful: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log('\n--- Failed Rides ---');
    results.failed.forEach(r => {
      console.log(`  - ${r.name} (${r.park}): ${r.error}`);
    });
  }
  
  // Save report
  const reportPath = path.join(outputDir, '..', 'scrape-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nReport saved to: ${reportPath}`);
  
  return results;
}

main().catch(console.error);
