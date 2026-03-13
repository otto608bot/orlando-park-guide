const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const outputDir = '/root/.openclaw/workspace/orlando-park-guide/images/rides';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Ride data with official URLs
const rides = [
  // Magic Kingdom
  { id: 'mk-space-mountain', name: 'Space Mountain', url: 'https://disneyworld.disney.go.com/attractions/magic-kingdom/space-mountain/' },
  { id: 'mk-big-thunder', name: 'Big Thunder Mountain Railroad', url: 'https://disneyworld.disney.go.com/attractions/magic-kingdom/big-thunder-mountain-railroad/' },
  { id: 'mk-haunted-mansion', name: 'Haunted Mansion', url: 'https://disneyworld.disney.go.com/attractions/magic-kingdom/haunted-mansion/' },
  { id: 'mk-pirates', name: 'Pirates of the Caribbean', url: 'https://disneyworld.disney.go.com/attractions/magic-kingdom/pirates-of-the-caribbean/' },
  { id: 'mk-seven-dwarfs', name: 'Seven Dwarfs Mine Train', url: 'https://disneyworld.disney.go.com/attractions/magic-kingdom/seven-dwarfs-mine-train/' },
  
  // EPCOT
  { id: 'epcot-guardians', name: 'Guardians of the Galaxy: Cosmic Rewind', url: 'https://disneyworld.disney.go.com/attractions/epcot/guardians-of-the-galaxy-cosmic-rewind/' },
  { id: 'epcot-remy', name: "Remy's Ratatouille Adventure", url: 'https://disneyworld.disney.go.com/attractions/epcot/remys-ratatouille-adventure/' },
  { id: 'epcot-test-track', name: 'Test Track', url: 'https://disneyworld.disney.go.com/attractions/epcot/test-track/' },
  { id: 'epcot-soarin', name: "Soarin' Around the World", url: 'https://disneyworld.disney.go.com/attractions/epcot/soarin-around-world/' },
  
  // Hollywood Studios
  { id: 'hs-rise-resistance', name: 'Star Wars: Rise of the Resistance', url: 'https://disneyworld.disney.go.com/attractions/hollywood-studios/star-wars-rise-of-the-resistance/' },
  { id: 'hs-slinky', name: 'Slinky Dog Dash', url: 'https://disneyworld.disney.go.com/attractions/hollywood-studios/slinky-dog-dash/' },
  { id: 'hs-tower-terror', name: 'Tower of Terror', url: 'https://disneyworld.disney.go.com/attractions/hollywood-studios/twilight-zone-tower-of-terror/' },
  { id: 'hs-smugglers-run', name: 'Millennium Falcon: Smugglers Run', url: 'https://disneyworld.disney.go.com/attractions/hollywood-studios/millennium-falcon-smugglers-run/' },
  
  // Animal Kingdom
  { id: 'ak-flight-passage', name: 'Avatar Flight of Passage', url: 'https://disneyworld.disney.go.com/attractions/animal-kingdom/avatar-flight-of-passage/' },
  { id: 'ak-everest', name: 'Expedition Everest', url: 'https://disneyworld.disney.go.com/attractions/animal-kingdom/expedition-everest/' },
  { id: 'ak-safari', name: 'Kilimanjaro Safaris', url: 'https://disneyworld.disney.go.com/attractions/animal-kingdom/kilimanjaro-safaris/' },
  
  // Universal Studios Florida
  { id: 'usf-gringotts', name: 'Harry Potter: Escape from Gringotts', url: 'https://www.universalorlando.com/web/en/us/things-to-do/rides-attractions/harry-potter-and-the-escape-from-gringotts' },
  { id: 'usf-mummy', name: 'Revenge of the Mummy', url: 'https://www.universalorlando.com/web/en/us/things-to-do/rides-attractions/revenge-of-the-mummy' },
  { id: 'usf-transformers', name: 'TRANSFORMERS: The Ride-3D', url: 'https://www.universalorlando.com/web/en/us/things-to-do/rides-attractions/transformers-ride-3d' },
  
  // Islands of Adventure
  { id: 'ioa-hagrid', name: "Hagrid's Magical Creatures Motorbike Adventure", url: 'https://www.universalorlando.com/web/en/us/things-to-do/rides-attractions/hagrids-magical-creatures-motorbike-adventure' },
  { id: 'ioa-velocicoaster', name: 'Jurassic World VelociCoaster', url: 'https://www.universalorlando.com/web/en/us/things-to-do/rides-attractions/jurassic-world-velocicoaster' },
  { id: 'ioa-spiderman', name: 'The Amazing Adventures of Spider-Man', url: 'https://www.universalorlando.com/web/en/us/things-to-do/rides-attractions/the-amazing-adventures-of-spider-man' },
  
  // SeaWorld Orlando
  { id: 'sw-mako', name: 'Mako', url: 'https://seaworld.com/orlando/roller-coasters/mako/' },
  { id: 'sw-kraken', name: 'Kraken', url: 'https://seaworld.com/orlando/roller-coasters/kraken/' },
  { id: 'sw-journey-atlantis', name: 'Journey to Atlantis', url: 'https://seaworld.com/orlando/rides/journey-to-atlantis/' },
  
  // LEGOLAND Florida
  { id: 'll-dragon', name: 'The Dragon', url: 'https://www.legoland.com/florida/things-to-do/theme-park/rides-attractions/the-dragon/' },
  { id: 'll-coastersaurus', name: 'Coastersaurus', url: 'https://www.legoland.com/florida/things-to-do/theme-park/rides-attractions/coastersaurus/' },
];

const results = [];

async function scrapeRide(browser, ride) {
  console.log(`\n📸 Processing: ${ride.name}`);
  const outputPath = path.join(outputDir, `${ride.id}.jpg`);
  
  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
    
    // Block unnecessary resources to speed up loading
    await page.route('**/*', (route) => {
      const resourceType = route.request().resourceType();
      if (resourceType === 'image' || resourceType === 'media' || resourceType === 'font') {
        route.continue();
      } else {
        route.continue();
      }
    });
    
    // Navigate to the ride page with more lenient settings
    const response = await page.goto(ride.url, { 
      waitUntil: 'domcontentloaded',
      timeout: 45000 
    });
    
    if (!response) {
      throw new Error('No response from server');
    }
    
    // Wait for page to stabilize
    await page.waitForTimeout(5000);
    
    // Take screenshot
    await page.screenshot({ 
      path: outputPath,
      fullPage: false,
      type: 'jpeg',
      quality: 90
    });
    
    // Check if file was created and has content
    const stats = fs.statSync(outputPath);
    if (stats.size > 5000) {
      console.log(`  ✅ Screenshot saved: ${ride.id}.jpg (${Math.round(stats.size/1024)}KB)`);
      results.push({
        id: ride.id,
        name: ride.name,
        status: 'success',
        source: ride.url,
        size: stats.size,
        path: outputPath
      });
    } else {
      throw new Error('Screenshot too small, likely failed');
    }
    
    await context.close();
    
  } catch (error) {
    console.log(`  ❌ Failed: ${error.message}`);
    results.push({
      id: ride.id,
      name: ride.name,
      status: 'failed',
      source: ride.url,
      error: error.message
    });
  }
}

async function main() {
  console.log('🎢 Starting ride image scraping...');
  console.log(`📁 Output directory: ${outputDir}`);
  console.log(`🎯 Target rides: ${rides.length}`);
  
  const browser = await chromium.launch({ 
    headless: true,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-http2',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });
  
  for (const ride of rides) {
    await scrapeRide(browser, ride);
    // Delay between requests
    await new Promise(r => setTimeout(r, 3000));
  }
  
  await browser.close();
  
  // Generate report
  const successCount = results.filter(r => r.status === 'success').length;
  const failCount = results.filter(r => r.status === 'failed').length;
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 SCRAPING SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total rides: ${rides.length}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  
  // Save results to JSON for report generation
  fs.writeFileSync(
    path.join(outputDir, 'scraping-results.json'),
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n✨ Done! Results saved to scraping-results.json');
}

main().catch(console.error);
