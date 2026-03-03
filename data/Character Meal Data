// Disney World Character Meals Database
// Last Updated: March 2025

const disneyCharacterMeals = [
  {
    id: "1900-park-fare",
    name: "1900 Park Fare",
    location: {
      park: null,
      resort: "Disney's Grand Floridian Resort & Spa",
      area: "Magic Kingdom Resort Area",
      requiresParkEntry: false,
      transportation: "Monorail, Bus, Boat (from Magic Kingdom)"
    },
    characters: {
      breakfast: ["Aladdin (Prince Ali attire)", "Cinderella", "Mirabel", "Tiana"],
      dinner: ["Aladdin (Prince Ali attire)", "Cinderella", "Mirabel", "Tiana"]
    },
    meals: {
      breakfast: {
        available: true,
        type: "Buffet",
        price: { adult: 58, child: 37 },
        time: "Breakfast",
        description: "Character breakfast buffet",
        valueScore: 7,
        difficulty: "moderate"
      },
      lunch: {
        available: false
      },
      dinner: {
        available: true,
        type: "Buffet", 
        price: { adult: 69, child: 44 },
        time: "Dinner",
        description: "Character dinner buffet",
        valueScore: 6,
        difficulty: "moderate"
      }
    },
    cuisine: "American",
    diningPlan: true,
    credits: { breakfast: 1, dinner: 1 },
    specialFeatures: [
      "Recently reopened April 2024 after refurbishment",
      "Features characters who 'make wishes come true'",
      "Famous for Grand Floridian Strawberry Soup"
    ],
    notes: "Located in the Grand Floridian, easily accessible via monorail from Magic Kingdom"
  },
  
  {
    id: "akershus-royal-banquet",
    name: "Akershus Royal Banquet Hall",
    location: {
      park: "Epcot",
      land: "Norway Pavilion",
      resort: null,
      area: "World Showcase",
      requiresParkEntry: true,
      transportation: "Walk (from park entrance), Bus, Boat, Monorail to Epcot"
    },
    characters: {
      breakfast: ["Ariel", "Belle", "Aurora", "Jasmine", "Snow White", "Tiana"],
      lunch: ["Ariel", "Belle", "Aurora", "Jasmine", "Snow White", "Tiana"],
      dinner: ["Ariel", "Belle", "Aurora", "Jasmine", "Snow White", "Tiana"]
    },
    meals: {
      breakfast: {
        available: true,
        type: "Buffet",
        price: { adult: 59, child: 38 },
        time: "Breakfast",
        description: "Princess Storybook Dining"
      },
      lunch: {
        available: true,
        type: "Buffet",
        price: { adult: 69, child: 46 },
        time: "Lunch",
        description: "Princess Storybook Dining"
      },
      dinner: {
        available: true,
        type: "Buffet",
        price: { adult: 69, child: 46 },
        time: "Dinner",
        description: "Princess Storybook Dining"
      }
    },
    cuisine: "Norwegian/American",
    diningPlan: true,
    credits: { breakfast: 1, lunch: 2, dinner: 2 },
    specialFeatures: [
      "Meet 5 princesses per meal (combination varies)",
      "Norwegian-themed cuisine",
      "Less expensive alternative to Cinderella's Royal Table",
      "Princess processional during meal"
    ],
    notes: "Great for princess lovers; breakfast has more standard American food for picky eaters"
  },
  
  {
    id: "be-our-guest",
    name: "Be Our Guest Restaurant",
    location: {
      park: "Magic Kingdom",
      land: "Fantasyland",
      resort: null,
      area: "Beast's Castle",
      requiresParkEntry: true,
      transportation: "Walk (inside park)"
    },
    characters: {
      breakfast: [],
      lunch: ["Beast (walk-through only, no table visits)"],
      dinner: ["Beast (walk-through only, no table visits)"]
    },
    meals: {
      breakfast: {
        available: false
      },
      lunch: {
        available: true,
        type: "Prix-fixe",
        price: { adult: 70, child: 41 },
        time: "Lunch",
        description: "Quick service turned table service, Beast makes brief appearances"
      },
      dinner: {
        available: true,
        type: "Prix-fixe",
        price: { adult: 70, child: 41 },
        time: "Dinner",
        description: "Signature dining, Beast makes brief appearances"
      }
    },
    cuisine: "French",
    diningPlan: true,
    credits: { lunch: 2, dinner: 2 },
    specialFeatures: [
      "Dine inside Beast's Castle",
      "Three themed rooms: Grand Ballroom, West Wing, Castle Gallery",
      "Beast appears briefly - no autographs or individual photos",
      "High ceilings, elegant chandeliers, snow falling outside windows"
    ],
    notes: "NOT a traditional character meal; Beast does not visit tables. Very hard to get reservations"
  },
  
  {
    id: "cape-may-cafe",
    name: "Cape May Cafe",
    location: {
      park: null,
      resort: "Disney's Beach Club Resort",
      area: "Epcot Resort Area",
      requiresParkEntry: false,
      transportation: "Walk (from Epcot International Gateway), Boat, Bus"
    },
    characters: {
      breakfast: ["Minnie Mouse", "Goofy", "Daisy Duck", "Donald Duck"],
      dinner: []
    },
    meals: {
      breakfast: {
        available: true,
        type: "Buffet",
        price: { adult: 49, child: 33 },
        time: "Breakfast",
        description: "Minnie's Beach Bash Breakfast"
      },
      lunch: {
        available: false
      },
      dinner: {
        available: true,
        type: "Buffet",
        price: null,
        time: "Dinner",
        description: "Seafood buffet - NO CHARACTERS",
        charactersPresent: false
      }
    },
    cuisine: "American/Seafood",
    diningPlan: true,
    credits: { breakfast: 1, dinner: 1 },
    specialFeatures: [
      "Characters only at breakfast",
      "Beach-themed attire on characters",
      "Great location for Epcot mornings - walk to International Gateway",
      "Close to Hollywood Studios via Skyliner"
    ],
    notes: "Characters wear beach outfits; great pre-Epcot breakfast option"
  },
  
  {
    id: "chef-mickeys",
    name: "Chef Mickey's",
    location: {
      park: null,
      resort: "Disney's Contemporary Resort",
      area: "Magic Kingdom Resort Area",
      requiresParkEntry: false,
      transportation: "Monorail (resort loop), Bus, Walk (from Magic Kingdom)"
    },
    characters: {
      breakfast: ["Mickey Mouse", "Minnie Mouse", "Donald Duck", "Goofy", "Pluto"],
      dinner: ["Mickey Mouse", "Minnie Mouse", "Donald Duck", "Goofy", "Pluto"]
    },
    meals: {
      breakfast: {
        available: true,
        type: "Buffet",
        price: { adult: 59, child: 38 },
        time: "Breakfast",
        description: "Breakfast buffet with Fab Five"
      },
      lunch: {
        available: false
      },
      dinner: {
        available: true,
        type: "Buffet",
        price: { adult: 66, child: 44 },
        time: "Dinner",
        description: "Dinner buffet with Fab Five"
      }
    },
    cuisine: "American",
    diningPlan: true,
    credits: { breakfast: 1, dinner: 1 },
    specialFeatures: [
      "Classic Disney character dining experience",
      "Characters wear chef outfits",
      "Overlooks Bay Lake and Mary Blair mural",
      "Family photo with Minnie at end of meal (she doesn't table hop)"
    ],
    notes: "Very popular, loud atmosphere; food quality is average but experience is classic Disney"
  },
  
  {
    id: "cinderella-royal-table",
    name: "Cinderella's Royal Table",
    location: {
      park: "Magic Kingdom",
      land: "Fantasyland",
      resort: null,
      area: "Cinderella Castle",
      requiresParkEntry: true,
      transportation: "Walk (inside park)"
    },
    characters: {
      breakfast: ["Cinderella", "Ariel", "Jasmine", "Snow White", "Aurora"],
      lunch: ["Cinderella", "Ariel", "Jasmine", "Snow White", "Aurora"],
      dinner: ["Cinderella", "Ariel", "Jasmine", "Snow White", "Aurora"]
    },
    meals: {
      breakfast: {
        available: true,
        type: "Prix-fixe",
        price: { adult: 76, child: 47 },
        time: "Breakfast",
        description: "Fairytale Dining inside the castle"
      },
      lunch: {
        available: true,
        type: "Prix-fixe",
        price: { adult: 88, child: 52 },
        time: "Lunch",
        description: "Fairytale Dining inside the castle"
      },
      dinner: {
        available: true,
        type: "Prix-fixe",
        price: { adult: 88, child: 52 },
        time: "Dinner",
        description: "Fairytale Dining inside the castle"
      }
    },
    cuisine: "American/French",
    diningPlan: true,
    credits: { breakfast: 2, lunch: 2, dinner: 2 },
    specialFeatures: [
      "Dine inside Cinderella Castle",
      "Meet Cinderella in the lobby before ascending to dining room",
      "Most expensive character meal",
      "Signature dining experience",
      "Kids can decorate cupcakes at dessert"
    ],
    notes: "Ultimate princess experience; requires 2 dining credits; Cinderella greets you downstairs before meal"
  },
  
  {
    id: "crystal-palace",
    name: "The Crystal Palace",
    location: {
      park: "Magic Kingdom",
      land: "Main Street USA",
      resort: null,
      area: "Left of Hub near Adventureland",
      requiresParkEntry: true,
      transportation: "Walk (inside park)"
    },
    characters: {
      breakfast: ["Winnie the Pooh", "Tigger", "Piglet", "Eeyore"],
      lunch: ["Winnie the Pooh", "Tigger", "Piglet", "Eeyore"],
      dinner: ["Winnie the Pooh", "Tigger", "Piglet", "Eeyore"]
    },
    meals: {
      breakfast: {
        available: true,
        type: "Buffet",
        price: { adult: 54, child: 35 },
        time: "Breakfast",
        description: "Pooh's Friendship Day Celebration"
      },
      lunch: {
        available: true,
        type: "Buffet",
        price: { adult: 64, child: 44 },
        time: "Lunch",
        description: "Pooh's Friendship Day Celebration"
      },
      dinner: {
        available: true,
        type: "Buffet",
        price: { adult: 64, child: 44 },
        time: "Dinner",
        description: "Pooh's Friendship Day Celebration"
      }
    },
    cuisine: "American",
    diningPlan: true,
    credits: { breakfast: 1, lunch: 1, dinner: 1 },
    specialFeatures: [
      "Victorian greenhouse atmosphere",
      "Characters from Hundred Acre Wood",
      "Good food quality for a buffet",
      "Convenient location on Main Street"
    ],
    notes: "Great for Winnie the Pooh fans; characters are very interactive and sweet"
  },
  
  {
    id: "garden-grill",
    name: "Garden Grill Restaurant",
    location: {
      park: "Epcot",
      land: "The Land Pavilion",
      resort: null,
      area: "World Nature",
      requiresParkEntry: true,
      transportation: "Walk (inside park)"
    },
    characters: {
      breakfast: ["Mickey Mouse", "Pluto", "Chip", "Dale"],
      lunch: ["Mickey Mouse", "Pluto", "Chip", "Dale"],
      dinner: ["Mickey Mouse", "Pluto", "Chip", "Dale"]
    },
    meals: {
      breakfast: {
        available: true,
        type: "Family-style",
        price: { adult: 49, child: 33 },
        time: "Breakfast",
        description: "Chip 'n' Dale's Harvest Feast"
      },
      lunch: {
        available: true,
        type: "Family-style",
        price: { adult: 62, child: 42 },
        time: "Lunch",
        description: "Chip 'n' Dale's Harvest Feast"
      },
      dinner: {
        available: true,
        type: "Family-style",
        price: { adult: 62, child: 42 },
        time: "Dinner",
        description: "Chip 'n' Dale's Harvest Feast"
      }
    },
    cuisine: "American",
    diningPlan: true,
    credits: { breakfast: 1, lunch: 1, dinner: 1 },
    specialFeatures: [
      "Rotating restaurant with views of Living with the Land ride",
      "Characters wear farmer outfits",
      "Family-style service (not buffet)",
      "Often has availability when others don't",
      "Good for Candlelight Processional dining packages"
    ],
    notes: "Restaurant slowly rotates showing scenes from Living with the Land; great pre-Soarin breakfast option"
  },
  
  {
    id: "hollywood-vine",
    name: "Hollywood & Vine",
    location: {
      park: "Disney's Hollywood Studios",
      land: "Echo Lake",
      resort: null,
      area: "Near 50's Prime Time Cafe",
      requiresParkEntry: true,
      transportation: "Walk (inside park)"
    },
    characters: {
      breakfast: [],
      lunch: ["Minnie Mouse", "Mickey Mouse", "Goofy", "Pluto/Donald/Daisy (varies)"],
      dinner: ["Minnie Mouse", "Mickey Mouse", "Goofy", "Pluto/Donald/Daisy (varies)"]
    },
    meals: {
      breakfast: {
        available: false,
        note: "Previously offered Disney Junior characters but ended in 2025"
      },
      lunch: {
        available: true,
        type: "Buffet",
        price: { adult: 64, child: 44 },
        time: "Lunch",
        description: "Minnie's Seasonal Dining"
      },
      dinner: {
        available: true,
        type: "Buffet",
        price: { adult: 64, child: 44 },
        time: "Dinner",
        description: "Minnie's Seasonal Dining"
      }
    },
    cuisine: "American",
    diningPlan: true,
    credits: { lunch: 1, dinner: 1 },
    seasonalThemes: [
      "Minnie's Springtime Dine (March-May)",
      "Minnie's Summertime Dine (May-August)",
      "Minnie's Halloween Dine (August-November)",
      "Minnie's Holiday Dine (November-January)",
      "Minnie's Silver Screen Dine (January-February)"
    ],
    specialFeatures: [
      "Only character dining in Hollywood Studios",
      "Characters wear seasonal costumes",
      "Fantasmic dining packages available",
      "Seasonal themes rotate throughout the year"
    ],
    notes: "Characters change outfits based on season; can be loud and busy; only option for characters in this park"
  },
  
  {
    id: "ohana",
    name: "'Ohana",
    location: {
      park: null,
      resort: "Disney's Polynesian Village Resort",
      area: "Magic Kingdom Resort Area",
      requiresParkEntry: false,
      transportation: "Monorail, Bus, Boat (from Magic Kingdom)"
    },
    characters: {
      breakfast: ["Mickey Mouse", "Pluto", "Lilo", "Stitch"],
      dinner: []
    },
    meals: {
      breakfast: {
        available: true,
        type: "Family-style",
        price: { adult: 53, child: 33 },
        time: "Breakfast",
        description: "Best Friends Breakfast featuring Lilo & Stitch"
      },
      lunch: {
        available: false
      },
      dinner: {
        available: true,
        type: "Family-style",
        price: null,
        time: "Dinner",
        description: "Polynesian family-style dinner - NO CHARACTERS",
        charactersPresent: false,
        note: "Famous for noodles and bread pudding"
      }
    },
    cuisine: "Polynesian/American",
    diningPlan: true,
    credits: { breakfast: 1, dinner: 1 },
    specialFeatures: [
      "Characters only at breakfast",
      "Rare opportunity to meet Lilo and Stitch",
      "Mickey and Pluto wear Hawaiian shirts",
      "All-you-can-eat pineapple coconut bread",
      "View of monorail passing overhead"
    ],
    notes: "Very popular - book ASAP; breakfast served until 12pm; notorious for running behind schedule"
  },
  
  {
    id: "story-book-dining",
    name: "Story Book Dining at Artist Point with Snow White",
    location: {
      park: null,
      resort: "Disney's Wilderness Lodge",
      area: "Magic Kingdom Resort Area",
      requiresParkEntry: false,
      transportation: "Bus, Boat (from Magic Kingdom)"
    },
    characters: {
      breakfast: [],
      lunch: [],
      dinner: ["Snow White", "Dopey", "Grumpy", "Evil Queen"]
    },
    meals: {
      breakfast: {
        available: false
      },
      lunch: {
        available: false
      },
      dinner: {
        available: true,
        type: "Prix-fixe",
        price: { adult: 67, child: 41 },
        time: "Dinner",
        description: "Signature dining with Snow White and friends"
      }
    },
    cuisine: "American",
    diningPlan: true,
    credits: { dinner: 2 },
    specialFeatures: [
      "Signature dining experience",
      "Enchanted forest tavern atmosphere",
      "Evil Queen is particularly entertaining",
      "High-quality food for character dining",
      "Unique character interactions"
    ],
    notes: "Out of the way location unless staying at Wilderness Lodge; Evil Queen steals the show; excellent food quality"
  },
  
  {
    id: "topolinos-terrace",
    name: "Topolino's Terrace - Flavors of the Riviera",
    location: {
      park: null,
      resort: "Disney's Riviera Resort",
      area: "Epcot Resort Area",
      requiresParkEntry: false,
      transportation: "Disney Skyliner"
    },
    characters: {
      breakfast: ["Mickey Mouse", "Minnie Mouse", "Donald Duck", "Daisy Duck"],
      dinner: []
    },
    meals: {
      breakfast: {
        available: true,
        type: "Prix-fixe",
        price: { adult: 52, child: 33 },
        time: "Breakfast",
        description: "Breakfast à la Art with Mickey & Friends"
      },
      lunch: {
        available: false
      },
      dinner: {
        available: true,
        type: "A la carte",
        price: null,
        time: "Dinner",
        description: "Signature dining - NO CHARACTERS",
        charactersPresent: false
      }
    },
    cuisine: "French/Italian",
    diningPlan: true,
    credits: { breakfast: 1, dinner: 2 },
    specialFeatures: [
      "Rooftop terrace with beautiful views",
      "Characters dressed as artists (painter, poet, dancer, sculptor)",
      "High-quality food for character meal",
      "Accessible via Skyliner from Pop Century, Art of Animation, Caribbean Beach",
      "Not a buffet - more relaxed experience"
    ],
    notes: "Currently most popular character breakfast; hardest reservation to get; excellent food quality"
  },
  
  {
    id: "tusker-house",
    name: "Tusker House Restaurant",
    location: {
      park: "Disney's Animal Kingdom",
      land: "Africa",
      resort: null,
      area: "Harambe Village",
      requiresParkEntry: true,
      transportation: "Walk (inside park)"
    },
    characters: {
      breakfast: ["Mickey Mouse", "Donald Duck", "Goofy", "Daisy Duck"],
      lunch: ["Mickey Mouse", "Donald Duck", "Goofy", "Daisy Duck"],
      dinner: ["Mickey Mouse", "Donald Duck", "Goofy", "Daisy Duck"]
    },
    meals: {
      breakfast: {
        available: true,
        type: "Buffet",
        price: { adult: 52, child: 35 },
        time: "Breakfast",
        description: "Donald's Dining Safari"
      },
      lunch: {
        available: true,
        type: "Buffet",
        price: { adult: 64, child: 42 },
        time: "Lunch",
        description: "Safari-themed dining"
      },
      dinner: {
        available: true,
        type: "Buffet",
        price: { adult: 64, child: 42 },
        time: "Dinner",
        description: "Safari-themed dining"
      }
    },
    cuisine: "African/American",
    diningPlan: true,
    credits: { breakfast: 1, lunch: 1, dinner: 1 },
    specialFeatures: [
      "Characters wear safari gear",
      "African-inspired cuisine",
      "Characters lead dancing and clapping",
      "Great character interactions",
      "Good for picky eaters at breakfast"
    ],
    notes: "Breakfast is more standard American fare; lunch/dinner has African flavors; characters are very interactive with dancing"
  }
];

// Helper functions to work with the data

const CharacterMealAPI = {
  // Get all character meals
  getAll: () => disneyCharacterMeals,
  
  // Get by park (null for resort hotels)
  getByPark: (parkName) => {
    return disneyCharacterMeals.filter(meal => meal.location.park === parkName);
  },
  
  // Get by resort
  getByResort: (resortName) => {
    return disneyCharacterMeals.filter(meal => 
      meal.location.resort && meal.location.resort.includes(resortName)
    );
  },
  
  // Get all that don't require park entry (good for rest days)
  getNoParkEntryRequired: () => {
    return disneyCharacterMeals.filter(meal => !meal.location.requiresParkEntry);
  },
  
  // Get by specific character
  getByCharacter: (characterName) => {
    return disneyCharacterMeals.filter(meal => {
      const allChars = [
        ...(meal.characters.breakfast || []),
        ...(meal.characters.lunch || []),
        ...(meal.characters.dinner || [])
      ];
      return allChars.some(char => 
        char.toLowerCase().includes(characterName.toLowerCase())
      );
    });
  },
  
  // Get meals available at specific time (breakfast, lunch, dinner)
  getByMealTime: (time) => {
    return disneyCharacterMeals.filter(meal => 
      meal.meals[time] && meal.meals[time].available
    );
  },
  
  // Get by price range
  getByPriceRange: (min, max, mealTime = 'breakfast') => {
    return disneyCharacterMeals.filter(meal => {
      const mealData = meal.meals[mealTime];
      if (!mealData || !mealData.available || !mealData.price) return false;
      return mealData.price.adult >= min && mealData.price.adult <= max;
    });
  },
  
  // Get princess meals
  getPrincessMeals: () => {
    return disneyCharacterMeals.filter(meal => {
      const allChars = [
        ...(meal.characters.breakfast || []),
        ...(meal.characters.lunch || []),
        ...(meal.characters.dinner || [])
      ];
      const princesses = ['Cinderella', 'Ariel', 'Belle', 'Aurora', 'Jasmine', 'Snow White', 'Tiana', 'Rapunzel'];
      return allChars.some(char => 
        princesses.some(princess => char.includes(princess))
      );
    });
  },
  
  // Get Fab Five meals (Mickey, Minnie, Donald, Goofy, Pluto)
  getFabFiveMeals: () => {
    return disneyCharacterMeals.filter(meal => {
      const allChars = [
        ...(meal.characters.breakfast || []),
        ...(meal.characters.lunch || []),
        ...(meal.characters.dinner || [])
      ];
      return allChars.some(char => char.includes('Mickey')) && 
             allChars.some(char => char.includes('Minnie'));
    });
  },
  
  // Search by keyword
  search: (keyword) => {
    const lower = keyword.toLowerCase();
    return disneyCharacterMeals.filter(meal => 
      meal.name.toLowerCase().includes(lower) ||
      meal.location.area?.toLowerCase().includes(lower) ||
      meal.cuisine.toLowerCase().includes(lower) ||
      meal.specialFeatures.some(f => f.toLowerCase().includes(lower))
    );
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { disneyCharacterMeals, CharacterMealAPI };
}
