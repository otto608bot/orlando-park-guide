const fs = require('fs');
const path = require('path');

const ridesDir = '/root/.openclaw/workspace/orlando-park-guide/images/rides';

// Target ride IDs as specified in the task
const targetRides = [
  // Magic Kingdom
  'space-mountain',
  'big-thunder-mountain',
  'haunted-mansion',
  'pirates-caribbean',
  'seven-dwarfs',
  // EPCOT
  'guardians-galaxy',
  'remy',
  'test-track',
  'soarin',
  // Hollywood Studios
  'rise-resistance',
  'slinky-dog',
  'tower-terror',
  'millennium-falcon',
  // Animal Kingdom
  'avatar-flight',
  'expedition-everest',
  'kilimanjaro-safaris',
  // Universal Studios
  'gringotts',
  'revenge-mummy',
  'transformers',
  // Islands of Adventure
  'hagrids',
  'velocicoaster',
  'spiderman',
  // SeaWorld
  'mako',
  'kraken',
  'journey-atlantis',
  // LEGOLAND
  'the-dragon',
  'coastersaurus'
];

console.log('=== Final Ride Image Verification ===\n');

const results = {
  found: [],
  missing: []
};

for (const rideId of targetRides) {
  const filePath = path.join(ridesDir, `${rideId}.jpg`);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    results.found.push({
      id: rideId,
      size: `${(stats.size / 1024).toFixed(1)} KB`,
      path: filePath
    });
  } else {
    results.missing.push(rideId);
  }
}

console.log(`Target rides: ${targetRides.length}`);
console.log(`Found: ${results.found.length}`);
console.log(`Missing: ${results.missing.length}\n`);

console.log('--- Found Rides ---');
results.found.forEach(r => {
  console.log(`  ✓ ${r.id} (${r.size})`);
});

if (results.missing.length > 0) {
  console.log('\n--- Missing Rides ---');
  results.missing.forEach(id => {
    console.log(`  ✗ ${id}`);
  });
}

// Save final report
const report = {
  timestamp: new Date().toISOString(),
  totalTarget: targetRides.length,
  found: results.found.length,
  missing: results.missing.length,
  rides: results.found.map(r => ({
    id: r.id,
    filename: `${r.id}.jpg`,
    size: r.size,
    source: 'Wikipedia/Wikimedia Commons'
  }))
};

const reportPath = path.join(ridesDir, '..', 'final-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\nReport saved to: ${reportPath}`);

// Also create a markdown summary
const mdReport = `# Orlando Park Ride Images - Scraping Report

**Date:** ${new Date().toISOString().split('T')[0]}  
**Total Rides:** ${targetRides.length}  
**Successfully Collected:** ${results.found.length}  
**Missing:** ${results.missing.length}

## Ride Images

### Magic Kingdom
${['space-mountain', 'big-thunder-mountain', 'haunted-mansion', 'pirates-caribbean', 'seven-dwarfs'].map(id => `- ${id}: ${results.found.find(r => r.id === id) ? '✓' : '✗'}`).join('\n')}

### EPCOT
${['guardians-galaxy', 'remy', 'test-track', 'soarin'].map(id => `- ${id}: ${results.found.find(r => r.id === id) ? '✓' : '✗'}`).join('\n')}

### Hollywood Studios
${['rise-resistance', 'slinky-dog', 'tower-terror', 'millennium-falcon'].map(id => `- ${id}: ${results.found.find(r => r.id === id) ? '✓' : '✗'}`).join('\n')}

### Animal Kingdom
${['avatar-flight', 'expedition-everest', 'kilimanjaro-safaris'].map(id => `- ${id}: ${results.found.find(r => r.id === id) ? '✓' : '✗'}`).join('\n')}

### Universal Studios
${['gringotts', 'revenge-mummy', 'transformers'].map(id => `- ${id}: ${results.found.find(r => r.id === id) ? '✓' : '✗'}`).join('\n')}

### Islands of Adventure
${['hagrids', 'velocicoaster', 'spiderman'].map(id => `- ${id}: ${results.found.find(r => r.id === id) ? '✓' : '✗'}`).join('\n')}

### SeaWorld
${['mako', 'kraken', 'journey-atlantis'].map(id => `- ${id}: ${results.found.find(r => r.id === id) ? '✓' : '✗'}`).join('\n')}

### LEGOLAND
${['the-dragon', 'coastersaurus'].map(id => `- ${id}: ${results.found.find(r => r.id === id) ? '✓' : '✗'}`).join('\n')}

## Source
All images sourced from Wikipedia/Wikimedia Commons.
`;

const mdPath = path.join(ridesDir, '..', 'SCRAPING_REPORT.md');
fs.writeFileSync(mdPath, mdReport);
console.log(`Markdown report saved to: ${mdPath}`);
