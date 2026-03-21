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
  'mk-space-mountain': '/images/rides/mk-space-mountain.jpg',
  'mk-treehouse': '/images/rides/mk-treehouse.jpg',
  'mk-tiana': '/images/rides/mk-tiana.jpg',
  'mk-speedway': '/images/rides/mk-speedway.jpg',
  'mk-peoplemover': '/images/rides/mk-peoplemover.jpg',
  'mk-tron': '/images/rides/mk-tron.jpg',
  'mk-mermaid': '/images/rides/mk-mermaid.jpg',
  'mk-railroad': '/images/rides/mk-railroad.jpg',
  'mk-carousel-progress': '/images/rides/mk-carousel-progress.jpg',
  
  // EPCOT (14 rides - all with unique images)
  'epcot-film-festival': '/images/rides/epcot-film-festival.jpg',
  'epcot-frozen': '/images/rides/epcot-frozen.jpg',
  'epcot-gran-fiesta': '/images/rides/epcot-gran-fiesta.jpg',
  'epcot-guardians': '/images/rides/epcot-guardians.jpg',
  'epcot-figment': '/images/rides/epcot-figment.jpg',
  'epcot-living-land': '/images/rides/epcot-living-land.jpg',
  'epcot-mission-green': '/images/rides/epcot-mission-green.jpg',
  'epcot-mission-orange': '/images/rides/epcot-mission-orange.jpg',
  'epcot-remy': '/images/rides/epcot-remy.jpg',
  'epcot-nemo': '/images/rides/epcot-nemo.jpg',
  'epcot-soarin': '/images/rides/epcot-soarin.jpg',
  'epcot-spaceship-earth': '/images/rides/epcot-spaceship-earth.jpg',
  'epcot-test-track': '/images/rides/epcot-test-track.jpg',
  'epcot-turtle-talk': '/images/rides/epcot-turtle-talk.jpg',
  
  // HOLLYWOOD STUDIOS (10 rides - all with unique images)
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
  
  // ANIMAL KINGDOM (9 rides - all with unique images)
  'ak-flight-passage': '/images/rides/ak-flight-passage.jpg',
  'ak-dinosaur': '/images/rides/ak-dinosaur.jpg',
  'ak-everest': '/images/rides/ak-everest.jpg',
  'ak-bug': '/images/rides/ak-bug.jpg',
  'ak-river-rapids': '/images/rides/ak-river-rapids.jpg',
  'ak-safari': '/images/rides/ak-safari.jpg',
  'ak-navi': '/images/rides/ak-navi.jpg',
  'ak-triceratop': '/images/rides/ak-triceratop.jpg',
  'ak-wildlife-train': '/images/rides/ak-wildlife-train.jpg',
  
  // UNIVERSAL STUDIOS FLORIDA (11 rides - all with unique images)
  'usf-minion': '/images/rides/usf-minion.jpg',
  'usf-et': '/images/rides/usf-et.jpg',
  'usf-fast-furious': '/images/rides/usf-fast-furious.jpg',
  'usf-gringotts': '/images/rides/usf-gringotts.jpg',
  'usf-hogwarts-express': '/images/rides/usf-hogwarts-express.jpg',
  'usf-rockit': '/images/rides/usf-rockit.jpg',
  'usf-mib': '/images/rides/usf-mib.jpg',
  'usf-jimmy-fallon': '/images/rides/usf-jimmy-fallon.jpg',
  'usf-mummy': '/images/rides/usf-mummy.jpg',
  'usf-simpsons': '/images/rides/usf-simpsons.jpg',
  'usf-transformers': '/images/rides/usf-transformers.jpg',
  
  // ISLANDS OF ADVENTURE (16 rides - all with unique images)
  'ioa-cat-hat': '/images/rides/ioa-cat-hat.jpg',
  'ioa-doom': '/images/rides/ioa-doom.jpg',
  'ioa-dudley': '/images/rides/ioa-dudley.jpg',
  'ioa-hagrid': '/images/rides/ioa-hagrid.jpg',
  'ioa-forbidden-journey': '/images/rides/ioa-forbidden-journey.jpg',
  'ioa-seuss-trolley': '/images/rides/ioa-seuss-trolley.jpg',
  'ioa-hogwarts-express': '/images/rides/ioa-hogwarts-express.jpg',
  'ioa-hulk': '/images/rides/ioa-hulk.jpg',
  'ioa-jurassic-river': '/images/rides/ioa-jurassic-river.jpg',
  'ioa-velocicoaster': '/images/rides/ioa-velocicoaster.jpg',
  'ioa-one-fish': '/images/rides/ioa-one-fish.jpg',
  'ioa-popeye': '/images/rides/ioa-popeye.jpg',
  'ioa-pteranodon': '/images/rides/ioa-pteranodon.jpg',
  'ioa-kong': '/images/rides/ioa-kong.jpg',
  'ioa-spiderman': '/images/rides/ioa-spiderman.jpg',
  'ioa-storm': '/images/rides/ioa-storm.jpg',
  
  // SEAWORLD ORLANDO (8 rides - all with unique images)
  'sw-mako': '/images/rides/sw-mako.jpg',
  'sw-kraken': '/images/rides/sw-kraken.jpg',
  'sw-manta': '/images/rides/sw-manta.jpg',
  'sw-pipeline': '/images/rides/sw-pipeline.jpg',
  'sw-infinity': '/images/rides/sw-infinity.jpg',
  'sw-journey-atlantis': '/images/rides/sw-journey-atlantis.jpg',
  'sw-antarctica': '/images/rides/sw-antarctica.jpg',
  'sw-sky-tower': '/images/rides/sw-sky-tower.jpg',
  
  // LEGOLAND FLORIDA (12 rides - all with unique images)
  'll-coastersaurus': '/images/rides/ll-coastersaurus.jpg',
  'll-dragon': '/images/rides/ll-dragon.jpg',
  'll-flying-school': '/images/rides/ll-flying-school.jpg',
  'll-duplo-express': '/images/rides/ll-duplo-express.jpg',
  'll-drivingschool': '/images/rides/ll-drivingschool.jpg',
  'll-juniordriving': '/images/rides/ll-juniordriving.jpg',
  'll-boating': '/images/rides/ll-boating.jpg',
  'll-beetle-bounce': '/images/rides/ll-beetle-bounce.jpg',
  'll-fairy-tale-brook': '/images/rides/ll-fairy-tale-brook.jpg',
  'll-merlin': '/images/rides/ll-merlin.jpg',
  'll-lost-kingdom': '/images/rides/ll-lost-kingdom.jpg',
  'll-ninjago': '/images/rides/ll-ninjago.jpg',
  
  // EPIC UNIVERSE (10 rides)
  'eu-stardust': '/images/rides/eu-stardust.jpg',
  'eu-constellation': '/images/rides/eu-constellation.jpg',
  'eu-battle-ministry': '/images/rides/eu-battle-ministry.jpg',
  'eu-monsters': '/images/rides/eu-monsters.jpg',
  'eu-werewolf': '/images/rides/eu-werewolf.jpg',
  'eu-mario-kart': '/images/rides/eu-mario-kart.jpg',
  'eu-mine-cart': '/images/rides/eu-mine-cart.jpg',
  'eu-hiccup': '/images/rides/eu-hiccup.jpg',
  'eu-fyre-drill': '/images/rides/eu-fyre-drill.jpg',
  'eu-yoshi': '/images/rides/eu-yoshi.jpg'
};

// Default image for rides without specific images
const defaultRideImage = '/images/rides/mk-space-mountain.jpg';

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
