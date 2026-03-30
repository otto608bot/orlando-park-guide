/**
 * seed-sanity-test.js
 * 
 * Seeds 2 test blog posts into the Sanity dataset (hd7qwtcq, production)
 * for testing the Next.js + Sanity migration.
 * 
 * Usage: node scripts/seed-sanity-test.js
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Load token
const tokenPath = '/Users/rufusbot/.openclaw/credentials/sanity-token.txt';
const token = fs.readFileSync(tokenPath, 'utf8').trim();

const client = createClient({
  projectId: 'hd7qwtcq',
  dataset: 'production',
  token,
  apiVersion: '2024-01-01',
  useCdn: false, // needed for write operations
});

async function createAuthorIfNotExists() {
  // Check for existing author
  const existing = await client.fetch(`*[_type == "author" && name == "Plan Your Park"][0]{_id}`);
  if (existing) return existing._id;

  const result = await client.create({
    _type: 'author',
    name: 'Plan Your Park',
    slug: { current: 'plan-your-park' },
    bio: 'Your go-to source for Orlando theme park planning, tips, and money-saving strategies.',
    email: 'hello@planyourpark.com',
  });
  console.log('Created author:', result._id);
  return result._id;
}

async function createCategoryIfNotExists(title, slugStr) {
  const existing = await client.fetch(`*[_type == "category" && slug.current == $slug][0]{_id}`, { slug: slugStr });
  if (existing) return existing._id;

  const result = await client.create({
    _type: 'category',
    title,
    slug: { current: slugStr },
    description: `Articles about ${title.toLowerCase()} at Orlando theme parks.`,
  });
  console.log(`Created category "${title}":`, result._id);
  return result._id;
}

// ===================== POST 1: Free Things at Disney World =====================

const freeThingsPost = {
  _type: 'post',
  title: '25 Free Things to Do at Disney World (That Are Actually Good)',
  slug: { current: 'free-things-disney-world' },
  publishedAt: '2026-03-16T00:00:00Z',
  originalPublishedAt: '2026-03-16T00:00:00Z',
  author: undefined, // set after creation
  readTime: 12,
  excerpt: 'Discover 25 free things to do at Disney World! From fireworks and parades to free souvenirs and resort activities—save money without sacrificing the magic.',
  heroImage: undefined, // images not available in seed, but we'll handle with fallback
  categories: [],
  tags: ['disney-world', 'free-activities', 'money-saving', 'family-tips'],
  seo: {
    seoTitle: '25 Free Things to Do at Disney World (That Are Actually Good)',
    metaDescription: 'Discover 25 free things to do at Disney World! From fireworks and parades to free souvenirs and resort activities—save money without sacrificing the magic.',
    canonicalUrl: 'https://planyourpark.com/blog/free-things-disney-world.html',
  },
  body: [
    // Opening
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Let me be honest with you: when I saw the total cost for our family\'s Disney World vacation last year, I nearly choked on my Mickey-shaped pretzel. Between park tickets, hotels, meals, and souvenirs, we were looking at a small fortune. But here\'s what I discovered after three trips with kids in tow—some of the best Disney memories don\'t cost a single penny.' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'I\'m talking about the moments that make your kids\' eyes light up. The hidden adventures they still talk about months later. The experiences that feel magical because they are magical—not because you swiped your credit card.' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'After countless park days, I\'ve compiled the 25 best free things to do at Disney World. These aren\'t filler activities to kill time. These are genuinely good experiences that rival the paid attractions. Let\'s dive in.' }] },

    // Affiliate CTA block
    {
      _type: 'affiliateBlock',
      productName: 'Disney World Tickets - Undercover Tourist',
      description: 'Save up to $50 on Disney World tickets through our trusted partner Undercover Tourist.',
      price: 'From $119',
      rating: 4.8,
      highlight: 'Best Value',
      placement: 'cta-button',
      partnerLink: {
        url: 'https://www.dpbolvw.net/click-101693488-5527150',
        partner: 'Undercover Tourist',
        cta: 'Get Discounted Tickets',
      },
    },

    // H2: Free Entertainment
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Free Entertainment' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Disney\'s entertainment is world-class, and much of it is completely free with park admission. Here are the must-see shows and performances:' }] },

    // H3: 1. Happily Ever After
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '1. Happily Ever After Fireworks (Magic Kingdom)' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'The crown jewel of free Disney entertainment. This nighttime spectacular combines fireworks, projections on Cinderella Castle, and an emotional soundtrack that gets me every time. Arrive 45-60 minutes early for a good spot on Main Street.' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', marks: ['strong'], text: 'Parent tip:' }, { _type: 'span', text: ' For little ones who can\'t handle the crowds, watch from behind the castle near the carousel. Fewer people, easier exit, and you still get the full fireworks experience.' }] },

    // H3: 2. Festival of the Lion King
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '2. Festival of the Lion King (Animal Kingdom)' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'A Broadway-quality show featuring acrobats, singers, and those iconic Lion King songs. It\'s 30 minutes of pure joy, and the theater is air-conditioned—a major plus on hot Florida days.' }] },

    // H3: 3. Street Performers at EPCOT
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '3. Street Performers at EPCOT' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'EPCOT\'s World Showcase is filled with impromptu performances. From the acrobatic Jeweled Dragon in China to the hilarious improv actors in the UK Pavilion, these performers are Disney-caliber talent performing for tips (which are optional).' }] },

    // H3: 4. Finding Nemo
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '4. Finding Nemo: The Big Blue... and Beyond! (Animal Kingdom)' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'This puppet-based musical brings the beloved Pixar story to life with incredible creativity. The puppets are operated by visible performers who become part of the magic. My kids were mesmerized.' }] },

    // H3: 5. Indiana Jones
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '5. Indiana Jones Epic Stunt Spectacular (Hollywood Studios)' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Watch stunt performers recreate scenes from the Indiana Jones films with live explosions, fight choreography, and audience participation. It\'s educational (they explain how stunts work) and genuinely exciting.' }] },

    // H3: 6. Projection Shows
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '6. Disney Movie Magic & Wonderful World of Animation (Hollywood Studios)' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'These projection shows on the Chinese Theatre transform the building into scenes from classic and modern Disney films. They\'re short (10-15 minutes), making them perfect for antsy little ones.' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', marks: ['strong'], text: 'Parent tip:' }, { _type: 'span', text: ' Check the My Disney Experience app daily—showtimes change, and some entertainment (like the Dapper Dans on Main Street) only performs at specific times.' }] },

    // H2: Free Activities & Adventures
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Free Activities & Adventures' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'These interactive experiences will keep kids engaged for hours without costing extra:' }] },

    // H3: 7. Pirate's Adventure
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '7. A Pirate\'s Adventure ~ Treasures of the Seven Seas (Magic Kingdom)' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Pick up a magic talisman at the booth near Pirates of the Caribbean and embark on an interactive treasure hunt through Adventureland. Complete all five missions, and you\'ll trigger a special effect in the area. My 6-year-old declared this "better than some rides."' }] },

    // H3: 8. Sorcerers
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '8. Sorcerers of the Magic Kingdom (Magic Kingdom)' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Defend the Magic Kingdom from Disney villains using spell cards at magic portals hidden throughout the park. Pick up your free card pack and map at the Firehouse on Main Street. It\'s like Pokémon Go meets Disney magic.' }] },

    // H3: 9. Wilderness Explorers
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '9. Wilderness Explorers (Animal Kingdom)' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Based on the movie Up, kids earn sticker badges by completing nature-themed challenges throughout the park. It\'s educational, encourages exploration of overlooked areas, and gives kids a sense of accomplishment. Perfect for ages 4-10.' }] },

    // H3: 10. Kidcot
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '10. Kidcot Fun Stops (EPCOT)' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'At each World Showcase pavilion, kids can collect activity cards and stamps while learning about different cultures. The cast members at each stop are actually from those countries and love sharing stories. It\'s like a free world tour for kids.' }] },

    // H3: 11-14
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '11. DuckTales World Showcase Adventure (EPCOT)' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Use the Play Disney Parks app to help Scrooge McDuck and the gang solve mysteries around World Showcase. It\'s a high-tech scavenger hunt that gets kids excited about exploring each country\'s pavilion.' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '12. Agent P\'s World Showcase Adventure (EPCOT)' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Similar to DuckTales but with Phineas and Ferb characters. If one adventure isn\'t enough, you can do both—each offers unique experiences in different pavilions.' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '13. Jedi Training: Trials of the Temple (Hollywood Studios)' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Young padawans (ages 4-12) learn lightsaber moves and face Darth Vader or Kylo Ren in this live show. Registration opens early and fills fast, but the experience is completely free and absolutely unforgettable for Star Wars fans.' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', marks: ['strong'], text: 'Parent tip:' }, { _type: 'span', text: ' For Jedi Training, head straight to the registration area near Star Wars Launch Bay at rope drop. Spots fill within an hour of park opening on busy days.' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '14. Enchanted Tales with Belle (Magic Kingdom)' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Kids participate in a live retelling of Beauty and the Beast, with some getting cast as characters. Every child receives a special bookmark at the end. It\'s interactive storytelling at its finest.' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '15. Animation Experience at Conservation Station (Animal Kingdom)' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Learn to draw Disney characters from actual Disney animators. Classes run throughout the day, and you keep your artwork. It\'s surprisingly relaxing and a great break from the Florida heat.' }] },

    // H2: Free Souvenirs
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Free Souvenirs & Keepsakes' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Skip the gift shop—these free mementos are often more meaningful than purchased souvenirs:' }] },
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '16. Celebration Buttons' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Visiting for a birthday, anniversary, first visit, or "just because"? Stop by Guest Relations at any park and request a free celebration button. Cast members (and sometimes other guests) will acknowledge your special occasion all day long.' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', marks: ['strong'], text: 'Parent tip:' }, { _type: 'span', text: ' First Visit buttons are magical for kids—cast members often sprinkle extra pixie dust (free stickers, special attention) on button-wearers.' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '17. Stickers at Various Locations' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Many cast members carry Disney character stickers to hand out to kids. Ride exits, character meet areas, and even some restaurant hosts have them. My kids have amassed impressive collections over the years.' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '18. Activity Books & Maps' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Sorcerers of the Magic Kingdom comes with free spell cards. Wilderness Explorers provides a field guide. Kidcot gives out activity cards. These become treasured keepsakes and cost nothing.' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '19. Transportation Cards' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Ask bus, monorail, or boat drivers for transportation collector cards. These limited-edition cards feature Disney characters and vehicles. Not all drivers have them, but when you find one, it\'s like striking gold.' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '20. Pressed Penny Designs (bring your own pennies)' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'While the machines charge 51 cents if you use their pennies, bring your own pennies and quarters to create flat souvenirs for just 50 cents each. Okay, technically not free—but close enough when you bring your own change.' }] },

    // H2: Free Transportation
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Free Transportation Experiences' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Disney\'s transportation system is an attraction in itself:' }] },
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '21. Monorail Resort Loop' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'You don\'t need a park ticket to ride the monorail. Take the resort loop through the Contemporary, Polynesian, and Grand Floridian resorts. It\'s a scenic tour with great photo opportunities of the parks from above.' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '22. Disney Skyliner' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'This gondola system connects EPCOT, Hollywood Studios, and several resorts. The views are spectacular, especially at sunset. Kids love the ride, and it\'s completely free for anyone to use.' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '23. Friendship Boats' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'These boats connect EPCOT and Hollywood Studios to nearby resorts and the BoardWalk. It\'s a relaxing way to travel, and you get unique views of the parks from the water.' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', marks: ['strong'], text: 'Parent tip:' }, { _type: 'span', text: ' Take the monorail to the Contemporary Resort and watch the Magic Kingdom fireworks from the observation deck on the 4th floor. Free parking, no park ticket required, and a spectacular view.' }] },

    // H2: Free Resort Fun
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Free Resort Fun' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'You don\'t need to be a resort guest to enjoy these activities:' }] },
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '24. Resort Lobby Hopping' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Each Disney resort has a uniquely themed lobby with incredible details. The Grand Floridian has live piano music. The Animal Kingdom Lodge has views of the savanna. Wilderness Lodge feels like a national park lodge. All are free to explore and offer a nice break from the parks.' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '25. Animal Viewing at Animal Kingdom Lodge' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'The Animal Kingdom Lodge has viewing areas where you can see zebras, giraffes, and other African animals on the resort\'s savanna. Night vision goggles are available after dark. It\'s like a free safari, and you don\'t need to be staying at the hotel to enjoy it.' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', marks: ['strong'], text: 'Parent tip:' }, { _type: 'span', text: ' Combine resort hopping with a meal at a quick-service location. The food courts at Polynesian (Capt. Cook\'s) and Wilderness Lodge (Roaring Fork) offer unique, affordable options away from the park crowds.' }] },

    // Final Thoughts
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Final Thoughts: The Best Things Are Free' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'After multiple Disney trips, I\'ve learned that the memories my kids treasure most aren\'t always the expensive ones. It\'s the moment they defeated a villain in Sorcerers of the Magic Kingdom. The cast member who spent ten minutes teaching them about African animals at the Animal Kingdom Lodge. The fireworks that made them gasp with wonder.' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Disney World will always be an investment. But with these 25 free activities, you can stretch your vacation dollars while creating magical moments that last a lifetime.' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'What free Disney activities have you discovered? Drop a comment below—I\'d love to hear your favorites!' }] },

    // TearAway block for the 25 activities
    {
      _type: 'tearAway',
      blockType: 'checklist',
      title: '25 Free Disney Activities Checklist',
      subtitle: 'Mark off each one as you complete it on your trip!',
      items: [
        { text: 'Happily Ever After Fireworks at Magic Kingdom' },
        { text: 'Festival of the Lion King at Animal Kingdom' },
        { text: 'EPCOT Street Performers at World Showcase' },
        { text: 'Finding Nemo: The Big Blue... and Beyond!' },
        { text: 'Indiana Jones Epic Stunt Spectacular' },
        { text: 'Projection shows at Hollywood Studios' },
        { text: "A Pirate's Adventure ~ Treasures of the Seven Seas" },
        { text: 'Sorcerers of the Magic Kingdom' },
        { text: 'Wilderness Explorers at Animal Kingdom' },
        { text: 'Kidcot Fun Stops at EPCOT World Showcase' },
        { text: 'DuckTales World Showcase Adventure' },
        { text: 'Agent P\'s World Showcase Adventure' },
        { text: 'Jedi Training: Trials of the Temple' },
        { text: 'Enchanted Tales with Belle' },
        { text: 'Animation Experience at Conservation Station' },
        { text: 'Celebration Buttons at Guest Relations' },
        { text: 'Free stickers from cast members' },
        { text: 'Activity Books & Maps' },
        { text: 'Transportation Collector Cards' },
        { text: 'Pressed Pennies (bring your own coins!)' },
        { text: 'Monorail Resort Loop' },
        { text: 'Disney Skyliner' },
        { text: 'Friendship Boats' },
        { text: 'Resort Lobby Hopping' },
        { text: 'Animal Viewing at Animal Kingdom Lodge' },
      ],
      note: 'Created by Plan Your Park | planyourpark.com',
      mobileCollapsed: true,
    },
  ],
  engagement: {
    enableNewsletter: true,
    enableQA: true,
    qaSection: [
      {
        question: 'Do you need park tickets to do the free activities at Disney resorts?',
        answer: 'No! Resort activities like animal viewing at Animal Kingdom Lodge, lobby hopping, and riding the monorail or Skyliner are completely free and don\'t require park tickets or resort reservations. You can even park for free at resorts for up to 3 hours with a dining reservation, or use Disney\'s free resort-to-resort transportation.',
      },
      {
        question: "What's the best free activity for toddlers at Disney World?",
        answer: "Wilderness Explorers at Animal Kingdom is perfect for ages 4-7, but for younger toddlers, I'd recommend the Kidcot Fun Stops at EPCOT. They can collect stamps and stickers at each country, and the cast members are incredibly patient with little ones. The free celebration buttons are also a huge hit—cast members give extra attention to kids wearing them!",
      },
    ],
    newsletterConfig: {
      heading: 'Get Disney Tips in Your Inbox',
      subheading: 'Weekly park guides, money-saving hacks, and insider secrets—no spam, unsubscribe anytime.',
      ctaLabel: 'Get Tips →',
      privacyText: 'Join 2,000+ parents planning magical trips.',
      variant: 'inline',
    },
  },
};

// ===================== POST 2: Orlando Closures March 2026 =====================

const closuresPost = {
  _type: 'post',
  title: 'Orlando Ride Closures & Refurbishments: March 2026',
  slug: { current: 'orlando-closures-march-2026' },
  publishedAt: '2026-03-01T00:00:00Z',
  originalPublishedAt: '2026-03-01T00:00:00Z',
  updatedAt: '2026-03-29T00:00:00Z',
  author: undefined,
  readTime: 5,
  excerpt: 'Spring Break is one of the busiest times of year in Orlando. Check our updated list of closures for Disney World and Universal Orlando before you go!',
  categories: [],
  tags: ['closures', 'refurbishments', 'disney-world', 'universal-orlando', 'march-2026'],
  seo: {
    seoTitle: 'Orlando Ride Closures & Refurbishments: March 2026',
    metaDescription: 'Spring Break is one of the busiest times of year in Orlando. Check our updated list of closures for Disney World and Universal Orlando before you go!',
    canonicalUrl: 'https://planyourpark.com/blog/orlando-closures-march-2026.html',
  },
  body: [
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Spring Break is one of the busiest times of year in Orlando, but it\'s also a key time for routine maintenance. Before you head to the gates, check our updated list of closures for Disney World and Universal Orlando Resort.' }] },

    // Affiliate CTA
    {
      _type: 'affiliateBlock',
      productName: 'Disney World Tickets - Undercover Tourist',
      description: 'Save up to $50 on Disney World tickets through our trusted partner Undercover Tourist.',
      price: 'From $119',
      rating: 4.8,
      highlight: 'Best Value',
      placement: 'cta-button',
      partnerLink: {
        url: 'https://www.dpbolvw.net/click-101693488-5527150',
        partner: 'Undercover Tourist',
        cta: 'Get Discounted Tickets',
      },
    },

    // Major Alert
    {
      _type: 'tearAway',
      blockType: 'quickStats',
      title: '⚠️ Major Closures Alert',
      subtitle: 'March 2026 Headlines',
      items: [
        { text: 'Rock \'n\' Roller Coaster closing for Muppets retheme (March 2)' },
        { text: 'Big Thunder Mountain Railroad closed through Spring 2026' },
        { text: 'Buzz Lightyear\'s Space Ranger Spin closed through Spring 2026' },
        { text: 'Jurassic Park River Adventure closed through Nov 2026' },
        { text: 'Wildlife Express Train replaced by Bluey Experience' },
      ],
      note: 'Check the official park apps on the morning of your visit for the most up-to-date status.',
      mobileCollapsed: false,
    },

    // Disney World H2
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Walt Disney World Closures' }] },

    // Magic Kingdom
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Magic Kingdom' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Big Thunder Mountain Railroad — Closed through Spring 2026' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Buzz Lightyear\'s Space Ranger Spin — Closed through Spring 2026' }] },

    // Hollywood Studios
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Disney\'s Hollywood Studios' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', marks: ['strong'], text: 'Rock \'n\' Roller Coaster Starring Aerosmith ' }, { _type: 'span', text: '— New Closure — Closing March 2, 2026' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', marks: ['em'], text: 'Note: This attraction is being rethemed to the Muppets and is expected to reopen in Summer 2026.' }] },

    // Animal Kingdom
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Disney\'s Animal Kingdom' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Wildlife Express Train / Rafiki\'s Planet Watch — Closed (Replaced by Bluey Experience)' }] },

    // Universal H2
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Universal Orlando Resort Closures' }] },

    // Islands of Adventure
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Universal Islands of Adventure' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Popeye & Bluto\'s Bilge-Rat Barges — Closed March 2026 (Seasonal)' }] },

    // Universal Studios Florida
    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Universal Studios Florida' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Jurassic Park River Adventure — Closed through Nov 19, 2026' }] },

    // Closing advice
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Refurbishment schedules can change without notice. We recommend checking the official park apps on the morning of your visit for the most up-to-the-minute status.' }] },
  ],
  engagement: {
    enableNewsletter: true,
    enableQA: false,
    newsletterConfig: {
      heading: 'Get Disney Tips in Your Inbox',
      subheading: 'Weekly park guides, money-saving hacks, and insider secrets—no spam, unsubscribe anytime.',
      ctaLabel: 'Get Tips →',
      privacyText: 'Join 2,000+ parents planning magical trips.',
      variant: 'inline',
    },
  },
};

async function seed() {
  console.log('🚀 Starting Sanity seed...');
  console.log('Project: hd7qwtcq | Dataset: production\n');

  // Create/get author
  const authorId = await createAuthorIfNotExists();
  console.log('Author ID:', authorId);

  // Create/get categories
  const moneySavingCatId = await createCategoryIfNotExists('Money-Saving', 'money-saving');
  const closuresCatId = await createCategoryIfNotExists('Closures', 'closures');

  // Check for existing posts (avoid duplicates)
  const existing1 = await client.fetch(`*[_type == "post" && slug.current == "free-things-disney-world"][0]{_id, title}`);
  const existing2 = await client.fetch(`*[_type == "post" && slug.current == "orlando-closures-march-2026"][0]{_id, title}`);

  // Finalize post 1 with author and categories
  freeThingsPost.author = { _type: 'reference', _ref: authorId };
  freeThingsPost.categories = [
    { _type: 'reference', _ref: moneySavingCatId },
  ];

  // Finalize post 2
  closuresPost.author = { _type: 'reference', _ref: authorId };
  closuresPost.categories = [
    { _type: 'reference', _ref: closuresCatId },
  ];

  let post1Id, post2Id;

  if (existing1) {
    console.log('\n⚠️  Post "free-things-disney-world" already exists. Updating it...');
    post1Id = existing1._id;
    await client.delete(existing1._id);
    const result1 = await client.create(freeThingsPost);
    post1Id = result1._id;
    console.log('✅ Updated post 1:', post1Id);
  } else {
    const result1 = await client.create(freeThingsPost);
    post1Id = result1._id;
    console.log('✅ Created post 1:', post1Id);
  }

  if (existing2) {
    console.log('\n⚠️  Post "orlando-closures-march-2026" already exists. Updating it...');
    await client.delete(existing2._id);
    const result2 = await client.create(closuresPost);
    post2Id = result2._id;
    console.log('✅ Updated post 2:', post2Id);
  } else {
    const result2 = await client.create(closuresPost);
    post2Id = result2._id;
    console.log('✅ Created post 2:', post2Id);
  }

  console.log('\n✅ Seeding complete!');
  console.log('\nPost 1: https://planyourpark.com/blog/free-things-disney-world');
  console.log('Post 2: https://planyourpark.com/blog/orlando-closures-march-2026');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});