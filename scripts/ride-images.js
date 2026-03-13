// Ride image mapping - comprehensive mapping for all rides
// This file is used by both park.html and ride-modal.js

const rideImages = {
  // MAGIC KINGDOM (28 rides - all with unique images)
  'mk-astro-orbiter': '/images/rides/mk-astro-orbiter.jpg',
  'mk-barnstormer': '/images/rides/mk-barnstormer.jpg',
  'mk-big-thunder': '/images/rides/mk-big-thunder.jpg',
  'mk-buzz': '/images/rides/mk-buzz.jpg',
  'mk-country-bears': '/images/rides/mk-country-bears.jpg',
  'mk-dumbo': '/images/rides/mk-dumbo.jpg',
  'mk-enchanted-tales': '/images/rides/mk-enchanted-tales.jpg',
  'mk-haunted-mansion': '/images/rides/mk-haunted-mansion.jpg',
  'mk-small-world': '/images/rides/mk-small-world.jpg',
  'mk-jungle-cruise': '/images/rides/mk-jungle-cruise.jpg',
  'mk-riverboat': '/images/rides/mk-riverboat.jpg',
  'mk-magic-carpets': '/images/rides/mk-magic-carpets.jpg',
  'mk-peter-pan': '/images/rides/mk-peter-pan.jpg',
  'mk-pirates': '/images/rides/mk-pirates.jpg',
  'mk-pooh': '/images/rides/mk-pooh.jpg',
  'mk-philharmagic': '/images/rides/mk-philharmagic.jpg',
  'mk-tea-cups': '/images/rides/mk-tea-cups.jpg',
  'mk-carousel': '/images/rides/mk-carousel.jpg',
  'mk-seven-dwarfs': '/images/rides/mk-seven-dwarfs.jpg',
  'mk-space-mountain': '/images/rides/space-mountain.jpg',
  'mk-treehouse': '/images/rides/mk-treehouse.jpg',
  'mk-tiana': '/images/rides/mk-tiana.jpg',
  'mk-speedway': '/images/rides/mk-speedway.jpg',
  'mk-peoplemover': '/images/rides/mk-peoplemover.jpg',
  'mk-tron': '/images/rides/mk-tron.jpg',
  'mk-mermaid': '/images/rides/mk-mermaid.jpg',
  'mk-railroad': '/images/rides/mk-railroad.jpg',
  'mk-carousel-progress': '/images/rides/mk-carousel-progress.jpg',
  
  // EPCOT
  'epcot-film-festival': '/images/rides/epcot-film-festival.jpg',
  'epcot-frozen': '/images/rides/epcot-frozen.jpg',
  'epcot-gran-fiesta': '/images/rides/epcot-gran-fiesta.jpg',
  'epcot-guardians': '/images/rides/epcot-guardians.jpg',
  'epcot-figment': '/images/rides/epcot-figment.jpg',
  'epcot-living-land': '/images/rides/epcot-living-land.jpg',
  'epcot-mission-green': '/images/rides/epcot-mission-green.jpg',
  'epcot-mission-orange': '/images/rides/epcot-mission-orange.jpg',
  'epcot-remy': '/images/rides/epcot-remy.jpg',
  'epcot-nemo': '/images/rides/epcot-soarin.jpg',
  'epcot-soarin': '/images/rides/epcot-soarin.jpg',
  'epcot-spaceship-earth': '/images/rides/epcot-spaceship-earth.jpg',
  'epcot-test-track': '/images/rides/epcot-test-track.jpg',
  'epcot-turtle-talk': '/images/rides/epcot-turtle-talk.jpg',
  
  // HOLLYWOOD STUDIOS
  'hs-alien-saucers': '/images/rides/hs-alien-saucers.jpg',
  'hs-runaway-railway': '/images/rides/hs-runaway-railway.jpg',
  'hs-smugglers-run': '/images/rides/hs-smugglers-run.jpg',
  'hs-rock-roller': '/images/rides/hs-rock-roller.jpg',
  'hs-slinky': '/images/rides/hs-slinky.jpg',
  'hs-star-tours': '/images/rides/hs-star-tours.jpg',
  'hs-rise-resistance': '/images/rides/hs-rise-resistance.jpg',
  'hs-toy-story-mania': '/images/rides/hs-toy-story-mania.jpg',
  'hs-tower-terror': '/images/rides/hs-tower-terror.jpg',
  'hs-muppet-vision': '/images/rides/hs-muppet-vision.jpg',
  
  // ANIMAL KINGDOM
  'ak-flight-passage': '/images/rides/ak-avatar.jpg',
  'ak-dinosaur': '/images/rides/ak-everest.jpg',
  'ak-everest': '/images/rides/ak-everest.jpg',
  'ak-bug': '/images/rides/ak-everest.jpg',
  'ak-river-rapids': '/images/rides/ak-safari.jpg',
  'ak-safari': '/images/rides/ak-safari.jpg',
  'ak-navi': '/images/rides/ak-avatar.jpg',
  'ak-triceratop': '/images/rides/ak-safari.jpg',
  'ak-wildlife-train': '/images/rides/ak-safari.jpg',
  
  // UNIVERSAL STUDIOS FLORIDA
  'usf-minion': '/images/rides/uo-transformers.jpg',
  'usf-et': '/images/rides/uo-gringotts.jpg',
  'usf-fast-furious': '/images/rides/uo-transformers.jpg',
  'usf-gringotts': '/images/rides/uo-gringotts.jpg',
  'usf-hogwarts-express': '/images/rides/uo-gringotts.jpg',
  'usf-rockit': '/images/rides/uo-mummy.jpg',
  'usf-mib': '/images/rides/uo-transformers.jpg',
  'usf-jimmy-fallon': '/images/rides/uo-transformers.jpg',
  'usf-mummy': '/images/rides/uo-mummy.jpg',
  'usf-simpsons': '/images/rides/uo-transformers.jpg',
  'usf-transformers': '/images/rides/uo-transformers.jpg',
  
  // ISLANDS OF ADVENTURE
  'ioa-cat-hat': '/images/rides/ioa-spiderman.jpg',
  'ioa-doom': '/images/rides/ioa-velocicoaster.jpg',
  'ioa-dudley': '/images/rides/ioa-velocicoaster.jpg',
  'ioa-hagrid': '/images/rides/ioa-hagrids.jpg',
  'ioa-forbidden-journey': '/images/rides/ioa-hagrids.jpg',
  'ioa-seuss-trolley': '/images/rides/ioa-spiderman.jpg',
  'ioa-hogwarts-express': '/images/rides/ioa-hagrids.jpg',
  'ioa-hulk': '/images/rides/ioa-velocicoaster.jpg',
  'ioa-jurassic-river': '/images/rides/ioa-velocicoaster.jpg',
  'ioa-velocicoaster': '/images/rides/ioa-velocicoaster.jpg',
  'ioa-one-fish': '/images/rides/ioa-spiderman.jpg',
  'ioa-popeye': '/images/rides/ioa-velocicoaster.jpg',
  'ioa-pteranodon': '/images/rides/ioa-velocicoaster.jpg',
  'ioa-kong': '/images/rides/ioa-velocicoaster.jpg',
  'ioa-spiderman': '/images/rides/ioa-spiderman.jpg',
  'ioa-storm': '/images/rides/ioa-spiderman.jpg',
  
  // SEAWORLD ORLANDO
  'sw-mako': '/images/rides/sw-mako.jpg',
  'sw-kraken': '/images/rides/sw-kraken.jpg',
  'sw-manta': '/images/rides/sw-mako.jpg',
  'sw-pipeline': '/images/rides/sw-mako.jpg',
  'sw-infinity': '/images/rides/sw-atlantis.jpg',
  'sw-journey-atlantis': '/images/rides/sw-atlantis.jpg',
  'sw-antarctica': '/images/rides/sw-atlantis.jpg',
  'sw-sky-tower': '/images/rides/sw-mako.jpg',
  
  // LEGOLAND FLORIDA
  'll-coastersaurus': '/images/rides/ll-coastersaurus.jpg',
  'll-dragon': '/images/rides/ll-dragon.jpg',
  'll-flying-school': '/images/rides/ll-dragon.jpg',
  'll-duplo-express': '/images/rides/ll-coastersaurus.jpg',
  'll-drivingschool': '/images/rides/ll-coastersaurus.jpg',
  'll-juniordriving': '/images/rides/ll-coastersaurus.jpg',
  'll-boating': '/images/rides/ll-dragon.jpg',
  'll-beetle-bounce': '/images/rides/ll-dragon.jpg',
  'll-fairy-tale-brook': '/images/rides/ll-dragon.jpg',
  'll-merlin': '/images/rides/ll-dragon.jpg',
  'll-lost-kingdom': '/images/rides/ll-dragon.jpg',
  'll-ninjago': '/images/rides/ll-dragon.jpg'
};

// Default image for rides without specific images
const defaultRideImage = '/images/rides/space-mountain.jpg';

// Helper function to get image for a ride
function getRideImage(rideId) {
  return rideImages[rideId] || defaultRideImage;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.rideImages = rideImages;
  window.getRideImage = getRideImage;
  window.defaultRideImage = defaultRideImage;
}
