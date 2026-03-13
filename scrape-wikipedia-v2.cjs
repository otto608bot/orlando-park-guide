const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const outputDir = '/root/.openclaw/workspace/orlando-park-guide/images/rides';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeImage(rideName, rideId, browser) {
  console.log(`\n[${rideId}] Searching: ${rideName}`);
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  
  try {
    // Go directly to Wikipedia page
    const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(rideName.replace(/\s+/g, '_'))}`;
    await page.goto(wikiUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(2000);
    
    // Look for infobox image
    const img = await page.locator('.infobox img').first();
    if (await img.isVisible().catch(() => false)) {
      // Get the image source
      let src = await img.getAttribute('src');
      if (src) {
        // Convert to full URL
        if (src.startsWith('//')) src = 'https:' + src;
        
        // Navigate to the image file page
        const fileLink = await page.locator('.infobox a.image').first();
        if (await fileLink.isVisible().catch(() => false)) {
          await fileLink.click();
          await sleep(2000);
          
          // Look for original file link
          const originalLink = await page.locator('a.internal[href*="/commons/"], .fullImageLink a').first();
          if (await originalLink.isVisible().catch(() => false)) {
            let fullSrc = await originalLink.getAttribute('href');
            if (fullSrc) {
              if (fullSrc.startsWith('//')) fullSrc = 'https:' + fullSrc;
              if (fullSrc.startsWith('/')) fullSrc = 'https://en.wikipedia.org' + fullSrc;
              
              // Download the image
              const outputPath = path.join(outputDir, `${rideId}.jpg`);
              const view = await page.viewportSize();
              
              // Use the browser to download
              await page.goto(fullSrc, { waitUntil: 'domcontentloaded', timeout: 30000 });
              await sleep(1000);
              
              // Take screenshot of the image
              await page.screenshot({ path: outputPath, fullPage: true });
              
              const stats = fs.statSync(outputPath);
              console.log(`  ✓ Saved: ${rideId}.jpg (${(stats.size / 1024).toFixed(1)} KB)`);
              
              await context.close();
              return { success: true };
            }
          }
        }
      }
    }
    
    // Fallback: screenshot the page
    const outputPath = path.join(outputDir, `${rideId}.jpg`);
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`  ⚠ Page screenshot: ${rideId}.jpg`);
    
    await context.close();
    return { success: true, fallback: true };
    
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    await context.close();
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('=== Scraping Ride Images from Wikipedia ===\n');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const rides = [
    { name: 'Space Mountain (Magic Kingdom)', id: 'space-mountain' },
    { name: 'Big Thunder Mountain Railroad', id: 'big-thunder-mountain' },
    { name: 'The Haunted Mansion', id: 'haunted-mansion' },
    { name: 'Pirates of the Caribbean (attraction)', id: 'pirates-caribbean' },
    { name: 'Seven Dwarfs Mine Train', id: 'seven-dwarfs' },
    { name: 'Guardians of the Galaxy: Cosmic Rewind', id: 'guardians-galaxy' },
    { name: "Remy's Ratatouille Adventure", id: 'remy' },
    { name: 'Test Track', id: 'test-track' },
    { name: "Soarin'", id: 'soarin' },
    { name: 'Star Wars: Rise of the Resistance', id: 'rise-resistance' },
    { name: 'Slinky Dog Dash', id: 'slinky-dog' },
    { name: 'The Twilight Zone Tower of Terror', id: 'tower-terror' },
    { name: 'Millennium Falcon: Smugglers Run', id: 'millennium-falcon' },
    { name: 'Avatar Flight of Passage', id: 'avatar-flight' },
    { name: 'Expedition Everest', id: 'expedition-everest' },
    { name: 'Kilimanjaro Safaris', id: 'kilimanjaro-safaris' },
    { name: 'Harry Potter and the Escape from Gringotts', id: 'gringotts' },
    { name: 'Revenge of the Mummy', id: 'revenge-mummy' },
    { name: 'Transformers: The Ride 3D', id: 'transformers' },
    { name: "Hagrid's Magical Creatures Motorbike Adventure", id: 'hagrids' },
    { name: 'Jurassic World VelociCoaster', id: 'velocicoaster' },
    { name: 'The Amazing Adventures of Spider-Man', id: 'spiderman' },
    { name: 'Mako (roller coaster)', id: 'mako' },
    { name: 'Kraken (roller coaster)', id: 'kraken' },
    { name: 'Journey to Atlantis', id: 'journey-atlantis' },
    { name: 'Legoland Florida', id: 'the-dragon' },
    { name: 'Legoland Florida', id: 'coastersaurus' }
  ];
  
  const results = { success: [], failed: [] };
  
  for (const ride of rides) {
    const result = await scrapeImage(ride.name, ride.id, browser);
    if (result.success) {
      results.success.push({ ...ride, ...result });
    } else {
      results.failed.push({ ...ride, ...result });
    }
    await sleep(3000 + Math.random() * 2000);
  }
  
  await browser.close();
  
  console.log('\n=== Report ===');
  console.log(`Total: ${rides.length}`);
  console.log(`Success: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);
  
  return results;
}

main().catch(console.error);
