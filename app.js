// Ride data with full accessibility information
const rideData = [
  // MAGIC KINGDOM
  {
    id: "mk-astro-orbiter",
    name: "Astro Orbiter",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "TAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Spinner",
    duration: "2 min",
    description: "Pilot your own rocket ship high above Tomorrowland"
  },
  {
    id: "mk-barnstormer",
    name: "The Barnstormer",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 35,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: false, loud: false, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Coaster",
    duration: "2 min",
    description: "A gentle coaster perfect for young children"
  },
  {
    id: "mk-big-thunder",
    name: "Big Thunder Mountain Railroad",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 40,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Coaster",
    duration: "4 min",
    description: "A runaway mine train through the Old West"
  },
  {
    id: "mk-buzz",
    name: "Buzz Lightyear's Space Ranger Spin",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: false, fog: false, sudden: false, enclosed: false, strobe: true },
    type: "Interactive Dark Ride",
    duration: "5 min",
    description: "Help Buzz defeat Emperor Zurg in this interactive shooting game"
  },
  {
    id: "mk-country-bears",
    name: "Country Bear Musical Jamboree",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Show",
    duration: "16 min",
    description: "A musical revue featuring animatronic bears"
  },
  {
    id: "mk-dumbo",
    name: "Dumbo the Flying Elephant",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "TAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Spinner",
    duration: "2 min",
    description: "Fly high with Dumbo on this classic carnival ride"
  },
  {
    id: "mk-enchanted-tales",
    name: "Enchanted Tales with Belle",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Interactive Story",
    duration: "20 min",
    description: "An interactive retelling of Beauty and the Beast"
  },
  {
    id: "mk-haunted-mansion",
    name: "Haunted Mansion",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: true, fog: true, sudden: false, enclosed: true, strobe: true },
    type: "Dark Ride",
    duration: "8 min",
    description: "A spooky tour through a ghost-filled estate"
  },
  {
    id: "mk-small-world",
    name: "It's a Small World",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: true, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Boat Ride",
    duration: "15 min",
    description: "A gentle boat ride through scenes of world peace"
  },
  {
    id: "mk-jungle-cruise",
    name: "Jungle Cruise",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "TAV",
    sensory: { dark: false, loud: true, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Boat Ride",
    duration: "10 min",
    description: "A humorous riverboat tour through exotic rivers"
  },
  {
    id: "mk-riverboat",
    name: "Liberty Square Riverboat",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Boat",
    duration: "20 min",
    description: "A scenic cruise aboard a steam-powered paddle wheeler"
  },
  {
    id: "mk-tea-cups",
    name: "Mad Tea Party",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "TAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Spinner",
    duration: "2 min",
    description: "Spin wildly in giant teacups"
  },
  {
    id: "mk-magic-carpets",
    name: "The Magic Carpets of Aladdin",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "TAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Spinner",
    duration: "2 min",
    description: "Fly on a magic carpet over Adventureland"
  },
  {
    id: "mk-pooh",
    name: "The Many Adventures of Winnie the Pooh",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Dark Ride",
    duration: "4 min",
    description: "Join Pooh on a blustery day in the Hundred Acre Wood"
  },
  {
    id: "mk-philharmagic",
    name: "Mickey's PhilharMagic",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: true, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "4D Show",
    duration: "12 min",
    description: "A 4D musical adventure with Mickey and Donald"
  },
  {
    id: "mk-peter-pan",
    name: "Peter Pan's Flight",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: false, fog: false, sudden: false, enclosed: true, strobe: false },
    type: "Dark Ride",
    duration: "3 min",
    description: "Fly over London to Neverland in a pirate ship"
  },
  {
    id: "mk-pirates",
    name: "Pirates of the Caribbean",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: true, fog: true, sudden: true, enclosed: false, strobe: false },
    type: "Boat Ride",
    duration: "9 min",
    description: "A swashbuckling voyage with Captain Jack Sparrow"
  },
  {
    id: "mk-carousel",
    name: "Prince Charming Regal Carrousel",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "TAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Carousel",
    duration: "2 min",
    description: "A classic fairytale carousel"
  },
  {
    id: "mk-seven-dwarfs",
    name: "Seven Dwarfs Mine Train",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 38,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Coaster",
    duration: "3 min",
    description: "A family-friendly coaster through the diamond mine"
  },
  {
    id: "mk-space-mountain",
    name: "Space Mountain",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 44,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: true, strobe: true },
    type: "Coaster",
    duration: "3 min",
    description: "A high-speed indoor roller coaster through space"
  },
  {
    id: "mk-treehouse",
    name: "Swiss Family Treehouse",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "NO",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Walkthrough",
    duration: "Self-guided",
    description: "Climb through the Robinson family's treehouse"
  },
  {
    id: "mk-tiana",
    name: "Tiana's Bayou Adventure",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 40,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Log Flume",
    duration: "10 min",
    description: "A musical bayou adventure with a splash"
  },
  {
    id: "mk-speedway",
    name: "Tomorrowland Speedway",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 32,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: false, loud: true, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Driving",
    duration: "5 min",
    description: "Drive your own race car on a guided track"
  },
  {
    id: "mk-peoplemover",
    name: "Tomorrowland Transit Authority PeopleMover",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Transit",
    duration: "10 min",
    description: "A relaxing elevated tour of Tomorrowland"
  },
  {
    id: "mk-tron",
    name: "TRON Lightcycle / Run",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 48,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: true, strobe: true },
    type: "Coaster",
    duration: "2 min",
    description: "A high-speed launch coaster on a lightcycle"
  },
  {
    id: "mk-mermaid",
    name: "Under the Sea ~ Journey of The Little Mermaid",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: true, fog: false, sudden: false, enclosed: false, strobe: true },
    type: "Dark Ride",
    duration: "7 min",
    description: "Relive the classic story of The Little Mermaid"
  },
  {
    id: "mk-railroad",
    name: "Walt Disney World Railroad",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: false, loud: true, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Train",
    duration: "20 min",
    description: "A scenic train tour around the park"
  },
  {
    id: "mk-carousel-progress",
    name: "Walt Disney's Carousel of Progress",
    park: "Magic Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Show",
    duration: "21 min",
    description: "A rotating theater show about progress through the ages"
  },

  // EPCOT
  {
    id: "epcot-film-festival",
    name: "Disney and Pixar Short Film Festival",
    park: "EPCOT",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: true, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "4D Show",
    duration: "18 min",
    description: "3D shorts with in-theater effects"
  },
  {
    id: "epcot-frozen",
    name: "Frozen Ever After",
    park: "EPCOT",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Boat Ride",
    duration: "5 min",
    description: "A musical boat tour through Arendelle"
  },
  {
    id: "epcot-gran-fiesta",
    name: "Gran Fiesta Tour",
    park: "EPCOT",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Boat Ride",
    duration: "7 min",
    description: "Join the Three Caballeros on a Mexican adventure"
  },
  {
    id: "epcot-guardians",
    name: "Guardians of the Galaxy: Cosmic Rewind",
    park: "EPCOT",
    resort: "Walt Disney World",
    height: 42,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: true, strobe: true },
    type: "Coaster",
    duration: "4 min",
    description: "A reverse-launch indoor coaster with rotating vehicles"
  },
  {
    id: "epcot-figment",
    name: "Journey into Imagination with Figment",
    park: "EPCOT",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: true, fog: true, sudden: false, enclosed: false, strobe: false },
    type: "Dark Ride",
    duration: "6 min",
    description: "Explore the senses with Figment the dragon"
  },
  {
    id: "epcot-living-land",
    name: "Living with the Land",
    park: "EPCOT",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Boat Ride",
    duration: "14 min",
    description: "A gentle boat tour through greenhouses and aquaculture"
  },
  {
    id: "epcot-mission-green",
    name: "Mission: SPACE (Green)",
    park: "EPCOT",
    resort: "Walt Disney World",
    height: 40,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: true, strobe: false },
    type: "Simulator",
    duration: "5 min",
    description: "A gentler space mission simulation"
  },
  {
    id: "epcot-mission-orange",
    name: "Mission: SPACE (Orange)",
    park: "EPCOT",
    resort: "Walt Disney World",
    height: 44,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: true, strobe: false },
    type: "Simulator",
    duration: "5 min",
    description: "An intense centrifuge space simulation"
  },
  {
    id: "epcot-remy",
    name: "Remy's Ratatouille Adventure",
    park: "EPCOT",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Trackless Dark Ride",
    duration: "4 min",
    description: "Shrink to rat size and race through Gusteau's kitchen"
  },
  {
    id: "epcot-nemo",
    name: "The Seas with Nemo & Friends",
    park: "EPCOT",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Dark Ride",
    duration: "4 min",
    description: "Clam-mobiles take you on an undersea adventure"
  },
  {
    id: "epcot-soarin",
    name: "Soarin' Around the World",
    park: "EPCOT",
    resort: "Walt Disney World",
    height: 40,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: true, sudden: true, enclosed: false, strobe: false },
    type: "Simulator",
    duration: "5 min",
    description: "A hang-gliding flight over world landmarks"
  },
  {
    id: "epcot-spaceship-earth",
    name: "Spaceship Earth",
    park: "EPCOT",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: false, fog: false, sudden: false, enclosed: true, strobe: false },
    type: "Dark Ride",
    duration: "16 min",
    description: "A journey through the history of communication"
  },
  {
    id: "epcot-test-track",
    name: "Test Track",
    park: "EPCOT",
    resort: "Walt Disney World",
    height: 40,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: false, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Slot Car",
    duration: "5 min",
    description: "Design and test your own concept vehicle"
  },
  {
    id: "epcot-turtle-talk",
    name: "Turtle Talk with Crush",
    park: "EPCOT",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Interactive Show",
    duration: "15 min",
    description: "An interactive chat with Crush from Finding Nemo"
  },

  // HOLLYWOOD STUDIOS
  {
    id: "hs-alien-saucers",
    name: "Alien Swirling Saucers",
    park: "Hollywood Studios",
    resort: "Walt Disney World",
    height: 32,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Spinner",
    duration: "2 min",
    description: "Spin with toy aliens in Andy's backyard"
  },
  {
    id: "hs-runaway-railway",
    name: "Mickey & Minnie's Runaway Railway",
    park: "Hollywood Studios",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Trackless Dark Ride",
    duration: "5 min",
    description: "A zany adventure through a Mickey Mouse cartoon"
  },
  {
    id: "hs-smugglers-run",
    name: "Millennium Falcon: Smugglers Run",
    park: "Hollywood Studios",
    resort: "Walt Disney World",
    height: 38,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: true, sudden: true, enclosed: true, strobe: false },
    type: "Simulator",
    duration: "5 min",
    description: "Pilot the Millennium Falcon on a mission"
  },
  {
    id: "hs-rock-roller",
    name: "Rock 'n' Roller Coaster",
    park: "Hollywood Studios",
    resort: "Walt Disney World",
    height: 48,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: true, sudden: true, enclosed: true, strobe: true },
    type: "Coaster",
    duration: "2 min",
    description: "A high-speed launch coaster with Aerosmith soundtrack"
  },
  {
    id: "hs-slinky",
    name: "Slinky Dog Dash",
    park: "Hollywood Studios",
    resort: "Walt Disney World",
    height: 38,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: false, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Coaster",
    duration: "2 min",
    description: "A family coaster in Andy's backyard"
  },
  {
    id: "hs-star-tours",
    name: "Star Tours",
    park: "Hollywood Studios",
    resort: "Walt Disney World",
    height: 40,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Simulator",
    duration: "5 min",
    description: "A 3D motion simulator through the Star Wars galaxy"
  },
  {
    id: "hs-rise-resistance",
    name: "Star Wars: Rise of the Resistance",
    park: "Hollywood Studios",
    resort: "Walt Disney World",
    height: 40,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: true, sudden: true, enclosed: true, strobe: true },
    type: "Dark Ride",
    duration: "18 min",
    description: "An immersive battle against the First Order"
  },
  {
    id: "hs-toy-story-mania",
    name: "Toy Story Mania!",
    park: "Hollywood Studios",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: false, loud: true, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Interactive",
    duration: "8 min",
    description: "4D carnival games with Toy Story characters"
  },
  {
    id: "hs-tower-terror",
    name: "The Twilight Zone Tower of Terror",
    park: "Hollywood Studios",
    resort: "Walt Disney World",
    height: 40,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: true, sudden: true, enclosed: true, strobe: true },
    type: "Drop Tower",
    duration: "5 min",
    description: "A haunted elevator with random drops"
  },
  {
    id: "hs-muppet-vision",
    name: "Muppet*Vision 3D",
    park: "Hollywood Studios",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: true, fog: true, sudden: false, enclosed: false, strobe: false },
    type: "4D Show",
    duration: "17 min",
    description: "A hilarious 3D show with the Muppets"
  },

  // ANIMAL KINGDOM
  {
    id: "ak-flight-passage",
    name: "Avatar Flight of Passage",
    park: "Animal Kingdom",
    resort: "Walt Disney World",
    height: 44,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: true, strobe: false },
    type: "Simulator",
    duration: "5 min",
    description: "Fly on a banshee over Pandora"
  },
  {
    id: "ak-dinosaur",
    name: "DINOSAUR",
    park: "Animal Kingdom",
    resort: "Walt Disney World",
    height: 40,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: true, sudden: true, enclosed: true, strobe: true },
    type: "Dark Ride",
    duration: "4 min",
    description: "A turbulent time rover mission to save a dinosaur"
  },
  {
    id: "ak-everest",
    name: "Expedition Everest",
    park: "Animal Kingdom",
    resort: "Walt Disney World",
    height: 44,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: true, strobe: false },
    type: "Coaster",
    duration: "3 min",
    description: "A high-speed train adventure to encounter the Yeti"
  },
  {
    id: "ak-bug",
    name: "It's Tough to be a Bug!",
    park: "Animal Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: true, fog: true, sudden: true, enclosed: true, strobe: false },
    type: "4D Show",
    duration: "9 min",
    description: "A 3D show inside the Tree of Life"
  },
  {
    id: "ak-river-rapids",
    name: "Kali River Rapids",
    park: "Animal Kingdom",
    resort: "Walt Disney World",
    height: 38,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: false, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Raft Ride",
    duration: "5 min",
    description: "A whitewater raft ride through the jungle"
  },
  {
    id: "ak-safari",
    name: "Kilimanjaro Safaris",
    park: "Animal Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Safari",
    duration: "18 min",
    description: "An open-air safari through African wildlife"
  },
  {
    id: "ak-navi",
    name: "Na'vi River Journey",
    park: "Animal Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: true, loud: true, fog: true, sudden: false, enclosed: false, strobe: false },
    type: "Boat Ride",
    duration: "5 min",
    description: "A gentle boat ride through Pandora's bioluminescent forest"
  },
  {
    id: "ak-triceratop",
    name: "TriceraTop Spin",
    park: "Animal Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "TAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Spinner",
    duration: "2 min",
    description: "Fly on a friendly dinosaur"
  },
  {
    id: "ak-wildlife-train",
    name: "Wildlife Express Train",
    park: "Animal Kingdom",
    resort: "Walt Disney World",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Train",
    duration: "7 min",
    description: "A train ride to Rafiki's Planet Watch"
  },

  // UNIVERSAL STUDIOS FLORIDA
  {
    id: "usf-minion",
    name: "Despicable Me Minion Mayhem",
    park: "Universal Studios Florida",
    resort: "Universal Orlando",
    height: 40,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Simulator",
    duration: "5 min",
    description: "Become a Minion in this 3D motion simulator"
  },
  {
    id: "usf-et",
    name: "E.T. Adventure",
    park: "Universal Studios Florida",
    resort: "Universal Orlando",
    height: 34,
    pregnant: true,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: true, sudden: false, enclosed: false, strobe: false },
    type: "Dark Ride",
    duration: "5 min",
    description: "Help E.T. save his home planet"
  },
  {
    id: "usf-fast-furious",
    name: "Fast & Furious",
    park: "Universal Studios Florida",
    resort: "Universal Orlando",
    height: 40,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: true, sudden: true, enclosed: false, strobe: false },
    type: "Simulator",
    duration: "5 min",
    description: "A high-speed chase with the Fast crew"
  },
  {
    id: "usf-gringotts",
    name: "Harry Potter: Escape from Gringotts",
    park: "Universal Studios Florida",
    resort: "Universal Orlando",
    height: 42,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: true, strobe: false },
    type: "Coaster",
    duration: "5 min",
    description: "A multi-dimensional thrill ride through Gringotts Bank"
  },
  {
    id: "usf-hogwarts-express",
    name: "Hogwarts Express (King's Cross)",
    park: "Universal Studios Florida",
    resort: "Universal Orlando",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Train",
    duration: "4 min",
    description: "Travel to Hogsmeade with scenic views"
  },
  {
    id: "usf-rockit",
    name: "Hollywood Rip Ride Rockit",
    park: "Universal Studios Florida",
    resort: "Universal Orlando",
    height: 51,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: false, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Coaster",
    duration: "2 min",
    description: "A vertical lift hill coaster with onboard music"
  },
  {
    id: "usf-mib",
    name: "MEN IN BLACK Alien Attack",
    park: "Universal Studios Florida",
    resort: "Universal Orlando",
    height: 42,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: false, strobe: true },
    type: "Shooter",
    duration: "5 min",
    description: "An interactive alien shooting adventure"
  },
  {
    id: "usf-jimmy-fallon",
    name: "Race Through New York",
    park: "Universal Studios Florida",
    resort: "Universal Orlando",
    height: 40,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: true, sudden: true, enclosed: false, strobe: false },
    type: "Simulator",
    duration: "5 min",
    description: "A wild race through NYC with Jimmy Fallon"
  },
  {
    id: "usf-mummy",
    name: "Revenge of the Mummy",
    park: "Universal Studios Florida",
    resort: "Universal Orlando",
    height: 48,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: true, sudden: true, enclosed: true, strobe: true },
    type: "Coaster",
    duration: "3 min",
    description: "An indoor coaster through ancient Egypt"
  },
  {
    id: "usf-simpsons",
    name: "The Simpsons Ride",
    park: "Universal Studios Florida",
    resort: "Universal Orlando",
    height: 40,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Simulator",
    duration: "5 min",
    description: "A chaotic simulator ride through Krustyland"
  },
  {
    id: "usf-transformers",
    name: "TRANSFORMERS: The Ride-3D",
    park: "Universal Studios Florida",
    resort: "Universal Orlando",
    height: 40,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: true, sudden: true, enclosed: false, strobe: true },
    type: "Simulator",
    duration: "5 min",
    description: "Join the Autobots in this 3D battle"
  },

  // ISLANDS OF ADVENTURE
  {
    id: "ioa-cat-hat",
    name: "The Cat in the Hat",
    park: "Islands of Adventure",
    resort: "Universal Orlando",
    height: 36,
    pregnant: true,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Dark Ride",
    duration: "4 min",
    description: "A whimsical ride through Dr. Seuss's classic story"
  },
  {
    id: "ioa-doom",
    name: "Doctor Doom's Fearfall",
    park: "Islands of Adventure",
    resort: "Universal Orlando",
    height: 52,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: false, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Drop Tower",
    duration: "2 min",
    description: "A sudden launch up and drop down"
  },
  {
    id: "ioa-dudley",
    name: "Dudley Do-Right's Ripsaw Falls",
    park: "Islands of Adventure",
    resort: "Universal Orlando",
    height: 44,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: false, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Log Flume",
    duration: "5 min",
    description: "A log flume with a big splash"
  },
  {
    id: "ioa-hagrid",
    name: "Hagrid's Magical Creatures",
    park: "Islands of Adventure",
    resort: "Universal Orlando",
    height: 48,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Coaster",
    duration: "3 min",
    description: "A multi-launch coaster through the Forbidden Forest"
  },
  {
    id: "ioa-forbidden-journey",
    name: "Harry Potter: Forbidden Journey",
    park: "Islands of Adventure",
    resort: "Universal Orlando",
    height: 48,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: true, sudden: true, enclosed: true, strobe: true },
    type: "Dark Ride",
    duration: "5 min",
    description: "A robotic arm adventure through Hogwarts"
  },
  {
    id: "ioa-seuss-trolley",
    name: "The High in the Sky Seuss Trolley",
    park: "Islands of Adventure",
    resort: "Universal Orlando",
    height: 36,
    pregnant: true,
    wheelchair: "TAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Trolley",
    duration: "3 min",
    description: "An elevated tour through Seuss Landing"
  },
  {
    id: "ioa-hogwarts-express",
    name: "Hogwarts Express (Hogsmeade)",
    park: "Islands of Adventure",
    resort: "Universal Orlando",
    height: 0,
    pregnant: true,
    wheelchair: "WAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Train",
    duration: "4 min",
    description: "Travel to King's Cross with scenic views"
  },
  {
    id: "ioa-hulk",
    name: "The Incredible Hulk Coaster",
    park: "Islands of Adventure",
    resort: "Universal Orlando",
    height: 54,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: false, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Coaster",
    duration: "2 min",
    description: "A high-speed launch coaster"
  },
  {
    id: "ioa-jurassic-river",
    name: "Jurassic Park River Adventure",
    park: "Islands of Adventure",
    resort: "Universal Orlando",
    height: 42,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: false, loud: true, fog: true, sudden: true, enclosed: false, strobe: false },
    type: "Boat Ride",
    duration: "7 min",
    description: "A boat tour with an 85-foot drop"
  },
  {
    id: "ioa-velocicoaster",
    name: "Jurassic World VelociCoaster",
    park: "Islands of Adventure",
    resort: "Universal Orlando",
    height: 51,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: false, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Coaster",
    duration: "2 min",
    description: "A high-speed launch coaster with inversions"
  },
  {
    id: "ioa-one-fish",
    name: "One Fish, Two Fish",
    park: "Islands of Adventure",
    resort: "Universal Orlando",
    height: 0,
    pregnant: true,
    wheelchair: "TAV",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Spinner",
    duration: "2 min",
    description: "Fly on fish that squirt water"
  },
  {
    id: "ioa-popeye",
    name: "Popeye & Bluto's Bilge-Rat Barges",
    park: "Islands of Adventure",
    resort: "Universal Orlando",
    height: 42,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: false, loud: true, fog: false, sudden: true, enclosed: false, strobe: false },
    type: "Raft Ride",
    duration: "5 min",
    description: "A rough whitewater raft ride"
  },
  {
    id: "ioa-pteranodon",
    name: "Pteranodon Flyers",
    park: "Islands of Adventure",
    resort: "Universal Orlando",
    height: 36,
    pregnant: false,
    wheelchair: "NO",
    sensory: { dark: false, loud: false, fog: false, sudden: false, enclosed: false, strobe: false },
    type: "Suspended",
    duration: "2 min",
    description: "A gentle glide over Camp Jurassic"
  },
  {
    id: "ioa-kong",
    name: "Skull Island: Reign of Kong",
    park: "Islands of Adventure",
    resort: "Universal Orlando",
    height: 36,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: true, sudden: true, enclosed: false, strobe: true },
    type: "Trackless",
    duration: "6 min",
    description: "A trackless expedition to encounter King Kong"
  },
  {
    id: "ioa-spiderman",
    name: "The Amazing Adventures of Spider-Man",
    park: "Islands of Adventure",
    resort: "Universal Orlando",
    height: 40,
    pregnant: false,
    wheelchair: "TAV",
    sensory: { dark: true, loud: true, fog: true, sudden: true, enclosed: false, strobe: true },
    type: "Dark Ride",
    duration: "5 min",
    description: "A 3D motion-based adventure with Spider-Man"
  },
  {
    id: "ioa-storm",
    name: "Storm Force Accelatron",
    park: "Islands of Adventure",
    resort: "Universal Orlando",
    height: 0,
    pregnant: true,
    wheelchair: "TAV",
    sensory: { dark: false, loud: true, fog: true, sudden: true, enclosed: false, strobe: true },
    type: "Spinner",
    duration: "2 min",
    description: "A spinning ride with X-Men theming"
  }
];

// State management
const state = {
  filters: {
    height: 40,
    pregnancy: false,
    wheelchair: false,
    sensory: false
  },
  currentView: 'leaderboard',
  selectedPark: null
};

// Park configuration with styling and metadata
const parkConfig = {
  'Magic Kingdom': {
    id: 'mk',
    resort: 'Walt Disney World',
    gradient: 'linear-gradient(135deg, #1a5fb4 0%, #3584e4 50%, #c01c28 100%)',
    accent: '#f5c211',
    description: 'Where fairy tales come true'
  },
  'EPCOT': {
    id: 'epcot',
    resort: 'Walt Disney World',
    gradient: 'linear-gradient(135deg, #613583 0%, #1c71d8 50%, #26a269 100%)',
    accent: '#e5a50a',
    description: 'Celebrate human achievement'
  },
  'Hollywood Studios': {
    id: 'hs',
    resort: 'Walt Disney World',
    gradient: 'linear-gradient(135deg, #a51d2d 0%, #e66100 50%, #b5835a 100%)',
    accent: '#f5c211',
    description: 'The magic of movies'
  },
  'Animal Kingdom': {
    id: 'ak',
    resort: 'Walt Disney World',
    gradient: 'linear-gradient(135deg, #26a269 0%, #5e9624 50%, #8f6e28 100%)',
    accent: '#e5a50a',
    description: 'A celebration of nature'
  },
  'Universal Studios Florida': {
    id: 'usf',
    resort: 'Universal Orlando',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #4a4a6a 50%, #e66100 100%)',
    accent: '#f5c211',
    description: 'Ride the movies'
  },
  'Islands of Adventure': {
    id: 'ioa',
    resort: 'Universal Orlando',
    gradient: 'linear-gradient(135deg, #c01c28 0%, #e66100 50%, #1c71d8 100%)',
    accent: '#f5c211',
    description: 'Live the adventure'
  }
};

// DOM Elements
const elements = {
  heightSlider: document.getElementById('height-slider'),
  heightValue: document.getElementById('height-value'),
  totalCount: document.getElementById('total-count'),
  leaderboard: document.getElementById('leaderboard'),
  leaderboardView: document.getElementById('leaderboard-view'),
  parkDetailView: document.getElementById('park-detail-view'),
  parkHero: document.getElementById('park-hero'),
  detailResort: document.getElementById('detail-resort'),
  detailParkName: document.getElementById('detail-park-name'),
  detailRideCount: document.getElementById('detail-ride-count'),
  detailHeightLimit: document.getElementById('detail-height-limit'),
  rideGrid: document.getElementById('ride-grid'),
  toggles: {
    pregnancy: document.getElementById('toggle-pregnancy'),
    wheelchair: document.getElementById('toggle-wheelchair'),
    sensory: document.getElementById('toggle-sensory')
  }
};

// Initialize
function init() {
  setupEventListeners();
  render();
}

// Event listeners
function setupEventListeners() {
  elements.heightSlider.addEventListener('input', handleHeightChange);
}

// Height change handler
function handleHeightChange(e) {
  state.filters.height = parseInt(e.target.value);
  elements.heightValue.textContent = state.filters.height + '"';
  elements.detailHeightLimit.textContent = state.filters.height + '"';
  render();
}

// Toggle filter handler
function toggleFilter(type) {
  state.filters[type] = !state.filters[type];
  
  const btn = elements.toggles[type];
  const isActive = state.filters[type];
  
  btn.classList.toggle('active', isActive);
  btn.setAttribute('aria-pressed', isActive);
  
  render();
}

// Show park detail view
function showParkDetail(parkName) {
  state.selectedPark = parkName;
  state.currentView = 'detail';
  
  elements.leaderboardView.style.display = 'none';
  elements.parkDetailView.classList.add('active');
  
  renderParkDetail(parkName);
}

// Show leaderboard view
function showLeaderboard() {
  state.currentView = 'leaderboard';
  state.selectedPark = null;
  
  elements.parkDetailView.classList.remove('active');
  elements.leaderboardView.style.display = 'block';
  
  render();
}

// Filter rides
function getFilteredRides() {
  return rideData.filter(function(ride) {
    // Height filter
    if (ride.height > state.filters.height) return false;
    
    // Pregnancy filter
    if (state.filters.pregnancy && !ride.pregnant) return false;
    
    // Wheelchair filter (WAV = no transfer required)
    if (state.filters.wheelchair && ride.wheelchair !== 'WAV') return false;
    
    // Sensory filter (no intense effects)
    if (state.filters.sensory) {
      var s = ride.sensory;
      if (s.dark || s.loud || s.fog || s.sudden || s.enclosed || s.strobe) {
        return false;
      }
    }
    
    return true;
  });
}

// Group rides by park
function groupByPark(rides) {
  var groups = {};
  
  rides.forEach(function(ride) {
    if (!groups[ride.park]) {
      groups[ride.park] = [];
    }
    groups[ride.park].push(ride);
  });
  
  return groups;
}

// Get sensory tags for display
function getSensoryTags(sensory) {
  var tags = [];
  if (sensory.dark) tags.push({ label: 'Dark', class: 'tag-sensory-dark' });
  if (sensory.loud) tags.push({ label: 'Loud', class: 'tag-sensory-loud' });
  if (sensory.sudden) tags.push({ label: 'Sudden', class: 'tag-sensory-sudden' });
  if (sensory.enclosed) tags.push({ label: 'Enclosed', class: 'tag-sensory-enclosed' });
  if (sensory.strobe) tags.push({ label: 'Strobe', class: 'tag-sensory-strobe' });
  return tags;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Render leaderboard
function renderLeaderboard() {
  var filtered = getFilteredRides();
  var grouped = groupByPark(filtered);
  
  // Update total count
  elements.totalCount.textContent = filtered.length;
  
  // Sort parks by ride count (descending)
  var sortedParks = Object.keys(grouped).sort(function(a, b) {
    return grouped[b].length - grouped[a].length;
  });
  
  // Render park cards
  elements.leaderboard.innerHTML = sortedParks.map(function(parkName) {
    var rides = grouped[parkName];
    var config = parkConfig[parkName];
    var previewRides = rides.slice(0, 4);
    var remainingCount = rides.length - previewRides.length;
    
    return `
      <div class="park-card ${config.id}" onclick="showParkDetail('${parkName}')">
        <div class="park-card-header">
          <div class="park-info">
            <div class="park-resort">${escapeHtml(config.resort)}</div>
            <h3>${escapeHtml(parkName)}</h3>
          </div>
          <div class="ride-count">
            <div class="number">${rides.length}</div>
            <div class="label">Rides</div>
          </div>
        </div>
        <div class="park-preview">
          <div class="ride-chips">
            ${previewRides.map(function(ride) {
              return '<span class="ride-chip">' + escapeHtml(ride.name) + '</span>';
            }).join('')}
            ${remainingCount > 0 ? '<span class="more-rides">+' + remainingCount + ' more</span>' : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Render park detail
function renderParkDetail(parkName) {
  var config = parkConfig[parkName];
  var filtered = getFilteredRides();
  var parkRides = filtered.filter(function(ride) { return ride.park === parkName; });
  
  // Update hero
  elements.parkHero.className = 'park-hero ' + config.id;
  elements.detailResort.textContent = config.resort;
  elements.detailParkName.textContent = parkName;
  elements.detailRideCount.textContent = parkRides.length;
  elements.detailHeightLimit.textContent = state.filters.height + '"';
  
  // Render ride cards
  if (parkRides.length === 0) {
    elements.rideGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">🔍</div>
        <h3>No rides match your filters</h3>
        <p>Try adjusting your height requirement or turning off some filters.</p>
      </div>
    `;
  } else {
    elements.rideGrid.innerHTML = parkRides.map(function(ride) {
      var sensoryTags = getSensoryTags(ride.sensory);
      var wheelchairText = ride.wheelchair === 'WAV' ? '♿ No Transfer' : 
                          ride.wheelchair === 'TAV' ? '♿ Transfer Required' : 
                          '♿ Not Accessible';
      
      return `
        <div class="ride-card">
          <div class="ride-header">
            <div class="ride-name">${escapeHtml(ride.name)}</div>
            <div class="ride-type">${escapeHtml(ride.type)}</div>
          </div>
          <p class="ride-description">${escapeHtml(ride.description)}</p>
          <div class="ride-meta">
            <div class="meta-item">⏱️ ${escapeHtml(ride.duration)}</div>
            <div class="meta-item">${wheelchairText}</div>
          </div>
          <div class="ride-tags">
            ${ride.height > 0 ? '<span class="tag tag-height">📏 ' + ride.height + '"</span>' : ''}
            ${ride.pregnant ? '<span class="tag tag-pregnancy">🤰 Pregnancy Safe</span>' : ''}
            ${sensoryTags.map(function(tag) {
              return '<span class="tag ' + tag.class + '">' + tag.label + '</span>';
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  }
}

// Main render function
function render() {
  if (state.currentView === 'leaderboard') {
    renderLeaderboard();
  } else if (state.currentView === 'detail' && state.selectedPark) {
    renderParkDetail(state.selectedPark);
  }
}

// Start the app
init();
