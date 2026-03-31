#!/usr/bin/env node
/**
 * Migration script: Import data from rides.js and character-meal-data.js into Sanity
 * Run with: node migrate-to-sanity.mjs
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sanity config
const projectId = 'hd7qwtcq';
const dataset = 'production';
const token = 'skQUXzNOvcWakM2LokLf7LCcxBI2ooAQwIo0r9zIIQWDrQqBhYniPpeRFWnVFfn2XdMAqWwyqgCMPaSzskCDCM43Q2g3ASzR5AxEap7ypBPFOdvko7ajkDBLmDBSIsvY6yfAUUzQHKeAMcOO2FhmJHPa5kraCuFjSuv06XuuqvAcJIb3lxuj';

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
});

// Helper to convert rides.js data to Sanity Ride document
function rideToSanity(ride) {
  // Determine thrill level (1-5) based on ride characteristics
  let thrillLevel = 1;
  if (ride.height >= 48) thrillLevel = 5;
  else if (ride.height >= 42) thrillLevel = 4;
  else if (ride.height >= 38) thrillLevel = 3;
  else if (ride.height >= 35 || ride.type === 'Coaster') thrillLevel = 2;

  // Build accessibility tags
  const accessibility = [];
  if (ride.wheelchair === 'WAV') accessibility.push('wheelchair-accessible');
  else if (ride.wheelchair === 'TAV') accessibility.push('transfer-accessible');
  else if (ride.wheelchair === 'NO') accessibility.push('not-accessible');

  if (ride.pregnant === false) accessibility.push('not-pregnant-safe');

  const sensory = ride.sensory || {};
  if (sensory.dark) accessibility.push('dark-ride');
  if (sensory.loud) accessibility.push('loud-audio');
  if (sensory.fog) accessibility.push('fog-effects');
  if (sensory.strobe) accessibility.push('strobe-lights');
  if (sensory.sudden) accessibility.push('sudden-movements');
  if (sensory.enclosed) accessibility.push('enclosed-space');

  // Derive slug from ride ID
  const slug = ride.id || ride.name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');

  return {
    _type: 'ride',
    name: ride.name,
    park: ride.park,
    slug: { _type: 'slug', current: slug },
    description: ride.description || '',
    heightRequirement: ride.height || 0,
    thrillLevel,
    rideType: ride.type || '',
    accessibility,
    rideDuration: ride.duration || '',
    // Images will be referenced via URL or uploaded later
    image: null,
  };
}

// Helper to convert character meal to Sanity CharacterDining document
function mealToSanity(meal) {
  // Get all unique characters across all meals
  const allChars = new Set();
  const mealTypes = [];
  
  for (const [mealType, details] of Object.entries(meal.meals || {})) {
    if (details.available && meal.characters?.[mealType]?.length > 0) {
      mealTypes.push(mealType);
      meal.characters[mealType].forEach(c => allChars.add(c));
    }
  }
  
  // Determine price range
  let priceRange = '$';
  const prices = [];
  for (const m of Object.values(meal.meals || {})) {
    if (m.price?.adult) prices.push(m.price.adult);
  }
  if (prices.length > 0) {
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    if (avg >= 60) priceRange = '$$$';
    else if (avg >= 45) priceRange = '$$';
  }
  
  // Determine park from location
  let park = meal.location?.park || '';
  if (!park && meal.location?.resort) {
    if (meal.location.resort.includes('Grand Floridian') || meal.location.resort.includes('Contemporary') || meal.location.resort.includes('Polynesian')) {
      park = 'Magic Kingdom Resort';
    } else if (meal.location.resort.includes('Beach Club') || meal.location.resort.includes('Yacht Club')) {
      park = 'Epcot Resort';
    } else {
      park = 'Other Disney Resort';
    }
  }
  
  return {
    _type: 'characterDining',
    name: meal.name,
    park,
    characters: Array.from(allChars),
    mealType: mealTypes,
    priceRange,
    description: meal.notes || '',
    image: null,
    bookingUrl: '',
  };
}

async function migrateRides() {
  console.log('\n=== Migrating Rides ===');
  
  // Dynamically import rides.js
  const ridesPath = join(__dirname, '../../data/rides.js');
  const ridesContent = readFileSync(ridesPath, 'utf-8');
  
  // Extract the rideData array using regex
  const match = ridesContent.match(/const rideData = (\[[\s\S]*?\]);/);
  if (!match) throw new Error('Could not parse rides.js');
  
  // Evaluate safely - rides.js only contains data
  const ridesData = eval(match[1]);
  
  console.log(`Found ${ridesData.length} rides`);
  
  // Create rides in batches
  const batchSize = 10;
  let created = 0;
  
  for (let i = 0; i < ridesData.length; i += batchSize) {
    const batch = ridesData.slice(i, i + batchSize);
    const mutations = batch.map((ride, idx) => ({
      _key: ride.id,
      ...rideToSanity(ride),
    }));
    
    try {
      // Check if ride already exists
      for (const ride of batch) {
        const existing = await client.fetch(`*[_type == "ride" && name == $name && park == $park][0]._id`, { 
          name: ride.name, 
          park: ride.park 
        });
        
        if (existing) {
          console.log(`  Skipping existing: ${ride.name}`);
          continue;
        }
        
        const result = await client.create({
          _type: 'ride',
          ...rideToSanity(ride),
        });
        console.log(`  Created: ${ride.name} (${ride.park})`);
        created++;
      }
    } catch (err) {
      console.error(`  Error on batch ${i}: ${err.message}`);
    }
  }
  
  console.log(`\nRides: Created ${created} documents`);
}

async function migrateCharacterDining() {
  console.log('\n=== Migrating Character Dining ===');
  
  const mealsPath = join(__dirname, '../../data/character-meal-data.js');
  const mealsContent = readFileSync(mealsPath, 'utf-8');
  
  // Extract the disneyCharacterMeals array
  const match = mealsContent.match(/const disneyCharacterMeals = (\[[\s\S]*?\]);/);
  if (!match) throw new Error('Could not parse character-meal-data.js');
  
  const mealsData = eval(match[1]);
  
  console.log(`Found ${mealsData.length} character dining locations`);
  
  let created = 0;
  for (const meal of mealsData) {
    try {
      // Check if already exists
      const existing = await client.fetch(`*[_type == "characterDining" && name == $name][0]._id`, { name: meal.name });
      if (existing) {
        console.log(`  Skipping existing: ${meal.name}`);
        continue;
      }
      
      const result = await client.create(mealToSanity(meal));
      console.log(`  Created: ${meal.name}`);
      created++;
    } catch (err) {
      console.error(`  Error creating ${meal.name}: ${err.message}`);
    }
  }
  
  console.log(`\nCharacter Dining: Created ${created} documents`);
}

async function migrateParks() {
  console.log('\n=== Migrating Parks ===');
  
  const parks = [
    {
      name: 'Magic Kingdom',
      slug: 'magic-kingdom',
      description: 'The iconic Disney park featuring Cinderella Castle, classic attractions like Space Mountain and Pirates of the Caribbean, and beloved character encounters.',
      imageUrl: 'https://planyourpark.com/Magic-Kingdom.webp',
    },
    {
      name: 'EPCOT',
      slug: 'epcot',
      description: 'A park of innovation and global culture featuring World Showcase with 11 country pavilions, thrilling rides like Guardians of the Galaxy, and the iconic Spaceship Earth.',
      imageUrl: 'https://planyourpark.com/epcot.jpeg',
    },
    {
      name: 'Hollywood Studios',
      slug: 'hollywood-studios',
      description: 'Step into the worlds of Disney and Pixar at this park featuring Star Wars: Galaxy\'s Edge, Toy Story Land, and the Tower of Terror.',
      imageUrl: 'https://planyourpark.com/Hollywood-Studios.jpeg',
    },
    {
      name: 'Animal Kingdom',
      slug: 'animal-kingdom',
      description: 'A fusion of nature and imagination featuring the iconic Tree of Life, Pandora: The World of Avatar, and real animal encounters.',
      imageUrl: 'https://planyourpark.com/animal-kingdom.jpeg',
    },
    {
      name: 'Universal Studios Florida',
      slug: 'universal-studios-florida',
      description: 'Experience your favorite movies at this immersive park featuring The Wizarding World of Harry Potter, Despicable Me, and the new Epic Universe.',
      imageUrl: 'https://planyourpark.com/Universal-Studios-Florida.jpeg',
    },
    {
      name: 'Islands of Adventure',
      slug: 'islands-of-adventure',
      description: 'Explore distinct themed islands featuring Marvel Super Heroes, Jurassic Park, and the Wizarding World of Harry Potter - Hogsmeade.',
      imageUrl: 'https://planyourpark.com/islands-of-adventure.webp',
    },
    {
      name: 'Epic Universe',
      slug: 'epic-universe',
      description: 'Universal\'s newest park featuring five incredible worlds: Celestial Park, Dark Universe, How to Train Your Dragon Isle of Berk, Super Nintendo World, and Wizarding World of Harry Potter.',
      imageUrl: 'https://planyourpark.com/epic-universe.jpeg',
    },
    {
      name: 'SeaWorld Orlando',
      slug: 'seaworld-orlando',
      description: 'Where marine life meets thrilling rides including Mako, Kraken, and Antarctica: Empire of the Penguin.',
      imageUrl: 'https://planyourpark.com/sea-world.jpeg',
    },
    {
      name: 'LEGOLAND Florida',
      slug: 'legoland-florida',
      description: 'A family-focused park built entirely with LEGO bricks featuring rides, shows, and attractions perfect for families with children ages 2-12.',
      imageUrl: 'https://planyourpark.com/legoland.jpeg',
    },
  ];
  
  let created = 0;
  for (const park of parks) {
    try {
      const existing = await client.fetch(`*[_type == "park" && slug.current == $slug][0]._id`, { slug: park.slug });
      if (existing) {
        console.log(`  Skipping existing: ${park.name}`);
        continue;
      }
      
      const result = await client.create({
        _type: 'park',
        name: park.name,
        slug: { _type: 'slug', current: park.slug },
        description: park.description,
      });
      console.log(`  Created: ${park.name}`);
      created++;
    } catch (err) {
      console.error(`  Error creating ${park.name}: ${err.message}`);
    }
  }
  
  console.log(`\nParks: Created ${created} documents`);
}

async function migrateBlogPosts() {
  console.log('\n=== Migrating Blog Posts ===');
  
  // Sample posts from sample-data.ts
  const samplePosts = {
    "orlando-closures-march-2026": {
      title: "Orlando Theme Park Closures & Refurbs: March 2026",
      excerpt: "Stay updated on all the temporary closures at Disney World, Universal Orlando, and SeaWorld for March 2026.",
      publishedAt: "2026-03-01T00:00:00Z",
      readTime: 5,
      categories: [{ title: "News", slug: { current: "news" } }],
      tags: ["closures", "orlando", "disney-world", "universal"],
      heroImage: { url: "https://planyourpark.com/orlando-theme-park-ride-closures-and-refurbishment.webp", alt: "Orlando theme park closures" },
      author: { name: "Plan Your Park Team" },
      body: [
        { _type: "block", style: "normal", children: [{ _type: "span", text: "Here's the latest on temporary closures and refurbishments across Orlando theme parks for March 2026. Always verify with official sources before your visit." }] },
        { _type: "block", style: "h2", children: [{ _type: "span", text: "🧀 Disney World" }] },
        { _type: "block", style: "h3", children: [{ _type: "span", text: "Magic Kingdom" }] },
        { _type: "block", style: "normal", children: [{ _type: "span", text: "The Enchanted Tiki Room is undergoing refurbishment through mid-March. The PeopleMover remains open for now." }] },
        { _type: "block", style: "h3", children: [{ _type: "span", text: "EPCOT" }] },
        { _type: "block", style: "normal", children: [{ _type: "span", text: "The International Gateway entrance may have limited capacity during peak hours. Plan accordingly if entering via the back of the park." }] },
        { _type: "block", style: "h3", children: [{ _type: "span", text: "Hollywood Studios" }] },
        { _type: "block", style: "normal", children: [{ _type: "span", text: "Lightning McQueen's Racing Academy is closed through March for seasonal maintenance." }] },
        { _type: "block", style: "h2", children: [{ _type: "span", text: "🎢 Universal Orlando" }] },
        { _type: "block", style: "h3", children: [{ _type: "span", text: "Universal Studios Florida" }] },
        { _type: "block", style: "normal", children: [{ _type: "span", text: "Hollywood Rip, Ride, Rockit is operating on a modified schedule through March. Check the app for real-time availability." }] },
        { _type: "block", style: "h3", children: [{ _type: "span", text: "Islands of Adventure" }] },
        { _type: "block", style: "normal", children: [{ _type: "span", text: "No significant closures reported this month. Pteranodon Wings remains open." }] },
        { _type: "block", style: "h2", children: [{ _type: "span", text: "🐬 SeaWorld Orlando" }] },
        { _type: "block", style: "normal", children: [{ _type: "span", text: "The Antarctica Empire of the Penguin is closed for annual maintenance through early April. All other attractions are operating normally." }] },
        { _type: "block", style: "h2", children: [{ _type: "span", text: "💡 Tips for Your Visit" }] },
        { _type: "block", style: "normal", children: [{ _type: "span", text: "Check the official park app the morning of your visit for the most accurate wait times and any last-minute changes. During refurbishment seasons, consider visiting on weekdays for shorter waits on operating attractions." }] }
      ]
    },
    "free-things-disney-world": {
      title: "25 Free Things to Do at Disney World (That Are Actually Good)",
      excerpt: "Disney World is expensive—but the magic doesn't have to cost a fortune. Here's how we found free fun on our last family trip.",
      publishedAt: "2026-03-15T00:00:00Z",
      readTime: 12,
      categories: [{ title: "Disney World", slug: { current: "disney-world" } }],
      tags: ["free", "disney-world", "orlando", "budget"],
      heroImage: { url: "https://planyourpark.com/disney-world.webp", alt: "Disney World Castle" },
      author: { name: "Plan Your Park Team" },
      body: [
        { _type: "block", style: "normal", children: [{ _type: "span", text: "Disney World is expensive—but the magic doesn't have to cost a fortune. Here's how we found free fun on our last family trip." }] },
        { _type: "block", style: "h2", children: [{ _type: "span", text: "🎭 Free Entertainment" }] },
        { _type: "block", style: "normal", children: [{ _type: "span", text: "Disney's entertainment is world-class, and much of it is completely free with park admission." }] },
        { _type: "block", style: "h2", children: [{ _type: "span", text: "🏰 Free Photo Opportunities" }] },
        { _type: "block", style: "normal", children: [{ _type: "span", text: "From Character meets to castle views, there are countless spots for memorable photos without any extra cost." }] },
        { _type: "block", style: "h2", children: [{ _type: "span", text: "🌳 Free Outdoor Activities" }] },
        { _type: "block", style: "normal", children: [{ _type: "span", text: "Explore nature trails, splash pads, and outdoor play areas scattered throughout all four parks." }] }
      ]
    },
    "disney-world-guide": {
      title: "Complete Disney World Planning Guide for Families",
      excerpt: "Everything you need to know to plan the perfect Disney World vacation with kids of all ages.",
      publishedAt: "2026-02-15T00:00:00Z",
      readTime: 18,
      categories: [{ title: "Guides", slug: { current: "guides" } }],
      tags: ["disney-world", "planning", "family", "kids"],
      heroImage: { url: "https://planyourpark.com/Magic-Kingdom.webp", alt: "Magic Kingdom" },
      author: { name: "Plan Your Park Team" },
      body: [
        { _type: "block", style: "normal", children: [{ _type: "span", text: "Planning a Disney World vacation can feel overwhelming. After dozens of trips, here's what we've learned." }] },
        { _type: "block", style: "h2", children: [{ _type: "span", text: "📅 When to Go" }] },
        { _type: "block", style: "normal", children: [{ _type: "span", text: "The best time to visit Disney World is typically January through early March, or September through mid-November." }] },
        { _type: "block", style: "h2", children: [{ _type: "span", text: "🏨 Where to Stay" }] },
        { _type: "block", style: "normal", children: [{ _type: "span", text: "On-property hotels offer extra magic hours and free transportation, but nearby options can save significant money." }] },
        { _type: "block", style: "h2", children: [{ _type: "span", text: "🎫 Tickets & Reservations" }] },
        { _type: "block", style: "normal", children: [{ _type: "span", text: "Book park reservations as early as possible, especially for Magic Kingdom on weekends." }] }
      ]
    }
  };
  
  let created = 0;
  for (const [slug, post] of Object.entries(samplePosts)) {
    try {
      const existing = await client.fetch(`*[_type == "blogPost" && slug.current == $slug][0]._id`, { slug });
      if (existing) {
        console.log(`  Skipping existing: ${post.title}`);
        continue;
      }
      
      const result = await client.create({
        _type: 'blogPost',
        title: post.title,
        slug: { _type: 'slug', current: slug },
        excerpt: post.excerpt,
        publishedAt: post.publishedAt,
        readTime: post.readTime,
        categories: post.categories,
        tags: post.tags,
        heroImage: null, // Will be set up separately
        author: post.author,
        body: post.body,
      });
      console.log(`  Created: ${post.title}`);
      created++;
    } catch (err) {
      console.error(`  Error creating ${post.title}: ${err.message}`);
    }
  }
  
  console.log(`\nBlog Posts: Created ${created} documents`);
}

async function main() {
  console.log('Starting migration to Sanity...');
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}`);
  
  try {
    // Test connection
    await client.fetch('*[_type == "blogPost"][0]._id');
    console.log('✓ Sanity connection verified');
    
    await migrateParks();
    await migrateRides();
    await migrateCharacterDining();
    await migrateBlogPosts();
    
    console.log('\n✅ Migration complete!');
  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
  }
}

main();
