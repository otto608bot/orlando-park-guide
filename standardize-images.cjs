const fs = require('fs');
const path = require('path');

const ridesDir = '/root/.openclaw/workspace/orlando-park-guide/images/rides';

// Map existing files to target ride IDs
const rideMapping = {
  // Magic Kingdom
  'mk-space-mountain.jpg': 'space-mountain.jpg',
  'mk-big-thunder.jpg': 'big-thunder-mountain.jpg',
  'mk-haunted-mansion.jpg': 'haunted-mansion.jpg',
  'mk-pirates.jpg': 'pirates-caribbean.jpg',
  'mk-seven-dwarfs.jpg': 'seven-dwarfs.jpg',
  // EPCOT
  'epcot-guardians.jpg': 'guardians-galaxy.jpg',
  'epcot-remy.jpg': 'remy.jpg',
  'epcot-test-track.jpg': 'test-track.jpg',
  'epcot-soarin.jpg': 'soarin.jpg',
  // Hollywood Studios
  'hs-rise-resistance.jpg': 'rise-resistance.jpg',
  'hs-slinky.jpg': 'slinky-dog.jpg',
  'hs-tower-terror.jpg': 'tower-terror.jpg',
  'hs-smugglers-run.jpg': 'millennium-falcon.jpg',
  // Animal Kingdom
  'ak-flight-passage.jpg': 'avatar-flight.jpg',
  'ak-everest.jpg': 'expedition-everest.jpg',
  'ak-safari.jpg': 'kilimanjaro-safaris.jpg',
  // Universal Studios
  'usf-gringotts.jpg': 'gringotts.jpg',
  'usf-mummy.jpg': 'revenge-mummy.jpg',
  'usf-transformers.jpg': 'transformers.jpg',
  // Islands of Adventure
  'ioa-hagrid.jpg': 'hagrids.jpg',
  'ioa-velocicoaster.jpg': 'velocicoaster.jpg',
  'ioa-spiderman.jpg': 'spiderman.jpg',
  // SeaWorld
  'sw-mako.jpg': 'mako.jpg',
  'sw-kraken.jpg': 'kraken.jpg',
  'sw-journey-atlantis.jpg': 'journey-atlantis.jpg',
  // LEGOLAND
  'll-dragon.jpg': 'the-dragon.jpg',
  'll-coastersaurus.jpg': 'coastersaurus.jpg'
};

console.log('=== Standardizing Ride Image Names ===\n');

// Check which files exist and copy/rename them
const existingFiles = fs.readdirSync(ridesDir);
const results = {
  copied: [],
  alreadyCorrect: [],
  missing: []
};

for (const [sourceName, targetName] of Object.entries(rideMapping)) {
  const sourcePath = path.join(ridesDir, sourceName);
  const targetPath = path.join(ridesDir, targetName);
  
  if (fs.existsSync(sourcePath)) {
    if (sourceName !== targetName) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✓ Copied: ${sourceName} → ${targetName}`);
      results.copied.push({ from: sourceName, to: targetName });
    } else {
      console.log(`✓ Already correct: ${targetName}`);
      results.alreadyCorrect.push(targetName);
    }
  } else if (fs.existsSync(targetPath)) {
    console.log(`✓ Already exists: ${targetName}`);
    results.alreadyCorrect.push(targetName);
  } else {
    console.log(`✗ Missing: ${targetName} (source: ${sourceName})`);
    results.missing.push(targetName);
  }
}

// Also check for the two new files we just scraped
if (fs.existsSync(path.join(ridesDir, 'space-mountain.jpg'))) {
  console.log(`✓ New scrape: space-mountain.jpg`);
}
if (fs.existsSync(path.join(ridesDir, 'big-thunder-mountain.jpg'))) {
  console.log(`✓ New scrape: big-thunder-mountain.jpg`);
}

console.log('\n=== Summary ===');
console.log(`Copied: ${results.copied.length}`);
console.log(`Already correct: ${results.alreadyCorrect.length}`);
console.log(`Missing: ${results.missing.length}`);

// List all final images
console.log('\n=== Final Images ===');
const allImages = fs.readdirSync(ridesDir).filter(f => f.endsWith('.jpg') && !f.startsWith('.'));
allImages.sort().forEach(f => {
  const stats = fs.statSync(path.join(ridesDir, f));
  console.log(`  ${f} (${(stats.size / 1024).toFixed(1)} KB)`);
});

console.log(`\nTotal images: ${allImages.length}`);
