const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/root/.openclaw/workspace/orlando-park-guide/images/rides';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const rides = [
  { id: 'mk-space-mountain', name: 'Space Mountain', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Magic_Kingdom_Space_Mountain.jpg/800px-Magic_Kingdom_Space_Mountain.jpg' },
  { id: 'mk-big-thunder', name: 'Big Thunder Mountain Railroad', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Big_Thunder_Mountain_Railroad_-_Magic_Kingdom.jpg/800px-Big_Thunder_Mountain_Railroad_-_Magic_Kingdom.jpg' },
  { id: 'mk-haunted-mansion', name: 'Haunted Mansion', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Haunted_Mansion_-_Magic_Kingdom.jpg/800px-Haunted_Mansion_-_Magic_Kingdom.jpg' },
  { id: 'mk-pirates', name: 'Pirates of the Caribbean', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Pirates_of_the_Caribbean_-_Magic_Kingdom.jpg/800px-Pirates_of_the_Caribbean_-_Magic_Kingdom.jpg' },
  { id: 'mk-seven-dwarfs', name: 'Seven Dwarfs Mine Train', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Seven_Dwarfs_Mine_Train_-_Magic_Kingdom.jpg/800px-Seven_Dwarfs_Mine_Train_-_Magic_Kingdom.jpg' },
  { id: 'ak-everest', name: 'Expedition Everest', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Expedition_Everest_-_Animal_Kingdom.jpg/800px-Expedition_Everest_-_Animal_Kingdom.jpg' },
  { id: 'hs-tower-terror', name: 'Tower of Terror', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tower_of_Terror_-_Hollywood_Studios.jpg/800px-Tower_of_Terror_-_Hollywood_Studios.jpg' },
];

const results = [];

function downloadImage(ride) {
  return new Promise((resolve) => {
    const outputPath = path.join(OUTPUT_DIR, `${ride.id}.jpg`);
    console.log(`\n📸 Processing: ${ride.name}`);
    
    const file = fs.createWriteStream(outputPath);
    
    const options = {
      hostname: 'upload.wikimedia.org',
      path: ride.url.replace('https://upload.wikimedia.org', ''),
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    };
    
    const request = https.request(options, (response) => {
      if (response.statusCode !== 200) {
        console.log(`  ✗ HTTP ${response.statusCode}`);
        file.close();
        fs.unlinkSync(outputPath);
        results.push({ id: ride.id, name: ride.name, status: 'failed', error: `HTTP ${response.statusCode}` });
        resolve();
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(outputPath);
        if (stats.size > 5000) {
          console.log(`  ✓ Success: ${ride.id}.jpg (${stats.size} bytes)`);
          results.push({ id: ride.id, name: ride.name, status: 'success', size: stats.size });
        } else {
          console.log(`  ✗ Too small: ${stats.size} bytes`);
          fs.unlinkSync(outputPath);
          results.push({ id: ride.id, name: ride.name, status: 'failed', error: 'File too small' });
        }
        resolve();
      });
    });
    
    request.on('error', (err) => {
      console.log(`  ✗ Error: ${err.message}`);
      file.close();
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      results.push({ id: ride.id, name: ride.name, status: 'failed', error: err.message });
      resolve();
    });
    
    request.on('timeout', () => {
      console.log(`  ✗ Timeout`);
      request.destroy();
      file.close();
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      results.push({ id: ride.id, name: ride.name, status: 'failed', error: 'Timeout' });
      resolve();
    });
    
    request.end();
  });
}

async function main() {
  console.log('🎢 Starting ride image downloads...');
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`🎯 Rides: ${rides.length}`);
  
  for (const ride of rides) {
    await downloadImage(ride);
    // Small delay between requests
    await new Promise(r => setTimeout(r, 1000));
  }
  
  const success = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'failed').length;
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total: ${rides.length}`);
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'scraping-results.json'), JSON.stringify(results, null, 2));
  console.log('\n✨ Done!');
}

main().catch(console.error);
