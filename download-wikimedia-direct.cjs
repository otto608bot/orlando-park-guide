const https = require('https');
const fs = require('fs');
const path = require('path');

const outputDir = '/root/.openclaw/workspace/orlando-park-guide/images/rides';

// Known Wikimedia Commons file names for each ride
const rideImages = {
  // Magic Kingdom
  'space-mountain': 'Space_Mountain_%28Magic_Kingdom%29_01.jpg',
  'big-thunder-mountain': 'Big_Thunder_Mountain_Railroad_%28Magic_Kingdom%29.jpg',
  'haunted-mansion': 'The_Haunted_Mansion_%28Magic_Kingdom%29.jpg',
  'pirates-caribbean': 'Pirates_of_the_Caribbean_%28Magic_Kingdom%29.jpg',
  'seven-dwarfs': 'Seven_Dwarfs_Mine_Train_%28Magic_Kingdom%29.jpg',
  // EPCOT
  'guardians-galaxy': 'Guardians_of_the_Galaxy_Cosmic_Rewind.jpg',
  'remy': 'Remy%27s_Ratatouille_Adventure.jpg',
  'test-track': 'Test_Track_%28Epcot%29.jpg',
  'soarin': 'Soarin%27_Around_the_World.jpg',
  // Hollywood Studios
  'rise-resistance': 'Star_Wars_Rise_of_the_Resistance.jpg',
  'slinky-dog': 'Slinky_Dog_Dash.jpg',
  'tower-terror': 'The_Twilight_Zone_Tower_of_Terror_%28Disney%27s_Hollywood_Studios%29.jpg',
  'millennium-falcon': 'Millennium_Falcon_Smugglers_Run.jpg',
  // Animal Kingdom
  'avatar-flight': 'Avatar_Flight_of_Passage.jpg',
  'expedition-everest': 'Expedition_Everest.jpg',
  'kilimanjaro-safaris': 'Kilimanjaro_Safaris.jpg',
  // Universal Studios
  'gringotts': 'Harry_Potter_and_the_Escape_from_Gringotts.jpg',
  'revenge-mummy': 'Revenge_of_the_Mummy_%28Universal_Studios_Florida%29.jpg',
  'transformers': 'Transformers_The_Ride_3D_%28Universal_Studios_Florida%29.jpg',
  // Islands of Adventure
  'hagrids': 'Hagrid%27s_Magical_Creatures_Motorbike_Adventure.jpg',
  'velocicoaster': 'Jurassic_World_VelociCoaster.jpg',
  'spiderman': 'The_Amazing_Adventures_of_Spider-Man.jpg',
  // SeaWorld
  'mako': 'Mako_%28SeaWorld_Orlando%29.jpg',
  'kraken': 'Kraken_%28SeaWorld_Orlando%29.jpg',
  'journey-atlantis': 'Journey_to_Atlantis_%28SeaWorld_Orlando%29.jpg',
  // LEGOLAND
  'the-dragon': 'The_Dragon_%28Legoland_Florida%29.jpg',
  'coastersaurus': 'Coastersaurus_%28Legoland_Florida%29.jpg'
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadFromWikimedia(filename, outputPath) {
  return new Promise((resolve, reject) => {
    // Try to get the file from Wikimedia Commons
    const url = `https://upload.wikimedia.org/wikipedia/commons/thumb/${filename.charAt(0)}/${filename.charAt(0)}${filename.charAt(1)}/${filename}/800px-${filename}`;
    
    console.log(`  Trying: ${url.substring(0, 80)}...`);
    
    const file = fs.createWriteStream(outputPath);
    https.get(url, { timeout: 30000 }, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(outputPath);
          resolve({ success: true, size: stats.size });
        });
      } else {
        file.close();
        fs.unlinkSync(outputPath);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      reject(err);
    });
  });
}

async function main() {
  console.log('=== Downloading Ride Images from Wikimedia Commons ===\n');
  
  const results = { success: [], failed: [] };
  
  for (const [rideId, filename] of Object.entries(rideImages)) {
    console.log(`[${rideId}]`);
    const outputPath = path.join(outputDir, `${rideId}.jpg`);
    
    try {
      const result = await downloadFromWikimedia(filename, outputPath);
      if (result.size > 1000) {
        console.log(`  ✓ Downloaded (${(result.size / 1024).toFixed(1)} KB)\n`);
        results.success.push({ id: rideId, size: result.size });
      } else {
        console.log(`  ✗ File too small\n`);
        results.failed.push({ id: rideId, error: 'File too small' });
      }
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}\n`);
      results.failed.push({ id: rideId, error: error.message });
    }
    
    // Delay between downloads
    await sleep(1000 + Math.random() * 2000);
  }
  
  console.log('=== Report ===');
  console.log(`Total: ${Object.keys(rideImages).length}`);
  console.log(`Success: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log('\nFailed:');
    results.failed.forEach(r => console.log(`  - ${r.id}: ${r.error}`));
  }
  
  return results;
}

main().catch(console.error);
