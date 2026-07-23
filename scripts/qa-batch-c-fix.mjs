import { createClient } from '../web/node_modules/@sanity/client/dist/index.js';
import crypto from 'node:crypto';

const token = process.env.SANITY_API_TOKEN;
if (!token) throw new Error('SANITY_API_TOKEN must be set.');

const client = createClient({
  projectId: 'hd7qwtcq',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
});

const slugs = [
  'disney-world-with-baby-toddler',
  'free-things-disney-world',
  'universal-orlando-height-requirements',
  'universal-orlando-summer-2026',
];

const key = () => crypto.randomBytes(6).toString('hex');
const block = (style, text, extra = {}) => ({
  _key: key(),
  _type: 'block',
  style,
  markDefs: [],
  children: [{ _key: key(), _type: 'span', marks: [], text }],
  ...extra,
});
const list = (text, type = 'bullet') => block('normal', text, { listItem: type, level: 1 });
const textOf = (b) => (b?.children || []).map((c) => c.text || '').join('');

function replaceExact(body, oldText, replacements) {
  const i = body.findIndex((b) => textOf(b) === oldText);
  if (i < 0) throw new Error(`Could not find block: ${oldText.slice(0, 100)}`);
  body.splice(i, 1, ...replacements);
}
function insertAfter(body, anchorText, additions) {
  const i = body.findIndex((b) => textOf(b) === anchorText);
  if (i < 0) throw new Error(`Could not find insertion anchor: ${anchorText.slice(0, 100)}`);
  body.splice(i + 1, 0, ...additions);
}
function internalLinkBlock(prefix, label, href, suffix = '') {
  const mark = `link-${key()}`;
  return {
    _key: key(), _type: 'block', style: 'normal',
    markDefs: [{ _key: mark, _type: 'link', href }],
    children: [
      { _key: key(), _type: 'span', marks: [], text: prefix },
      { _key: key(), _type: 'span', marks: [mark], text: label },
      { _key: key(), _type: 'span', marks: [], text: suffix },
    ],
  };
}

function fixBaby(doc) {
  const body = structuredClone(doc.body);
  replaceExact(body,
    'The great news: babies and toddlers can ride most of the best rides at Disney World. Height requirements start at 35 inches, which means most kids under 3 are going to be under the requirement for major coasters. But the dark rides, boat rides, and gentle attractions are almost entirely open to all ages.',
    [block('normal', 'The good news: babies and toddlers have plenty of options at Disney World. Many classic dark rides, boat rides, and gentle attractions have no minimum height, while several coasters and thrill rides have posted height requirements. Check Disney’s official attraction page and the sign at the entrance on the day you visit, since eligibility is always determined there.')]);
  replaceExact(body,
    "The rides your baby or toddler can ride without restriction: It's a Small World, Jungle Cruise, Pirates of the Caribbean (no height req), The Magic Carpets of Aladdin, Dumbo the Flying Elephant, The Barnstormer (35 inch minimum — some toddlers qualify), Peter Pan's Flight (35 inch min), The Many Adventures of Winnie the Pooh (no min), Buzz Lightyear's Space Ranger Spin (38 inch min), and Tiana's Bayou Adventure (38 inch min).",
    [block('normal', "Examples with no posted minimum height include it’s a small world, Jungle Cruise, Pirates of the Caribbean, The Magic Carpets of Aladdin, Dumbo the Flying Elephant, Peter Pan’s Flight, The Many Adventures of Winnie the Pooh, and Buzz Lightyear’s Space Ranger Spin. The Barnstormer has a 35-inch minimum; Tiana’s Bayou Adventure, Seven Dwarfs Mine Train, and Big Thunder Mountain Railroad each have a 38-inch minimum. A child who is tall enough still needs to be comfortable with the ride’s motion and theme.")]);
  replaceExact(body,
    "The rides your baby can't ride (yet): Seven Dwarfs Mine Train (38 inch min), Big Thunder Mountain Railroad (38 inch min), Space Mountain (44 inch min), Tron Lightcycle Run (48 inch min), Splash Mountain (38 inch min). Plan accordingly.",
    [block('normal', 'For now, plan to skip the height-restricted thrill rides if your child does not meet the posted minimum: Seven Dwarfs Mine Train, Big Thunder Mountain Railroad, and Tiana’s Bayou Adventure are 38 inches; Space Mountain is 44 inches; and TRON Lightcycle / Run is 48 inches. Splash Mountain is no longer an operating Magic Kingdom attraction; its replacement is Tiana’s Bayou Adventure.')]);
  replaceExact(body,
    'Whatever stroller you bring, make sure it has a clip-on stroller fan. Florida heat is no joke for little ones and a stroller fan moving a gentle breeze makes the difference between a sleeping baby and a screaming one. Attach it to the stroller hood and point it at your child\'s face.',
    [block('normal', 'For hot days, a stroller fan can be a comfort item if you use it safely: choose a model with a protective cover, secure it where little fingers cannot reach it, and follow the manufacturer’s instructions. Use shade, breaks in air-conditioned spaces, water, and your child’s cues as your primary heat-management plan; ask a pediatric clinician for individualized advice.')]);
  replaceExact(body,
    'Here\'s the truth about Disney World with toddlers: most kids will not nap in the park. The stimulation is too high, the environment is too novel. Fighting the nap is a mistake. The correct strategy is to build midday breaks into your schedule every single day.',
    [block('normal', 'Naps are unpredictable in a theme-park setting. Some toddlers will nap in a familiar reclined stroller; others will need a hotel or other quiet break. Build a flexible midday reset into your plan rather than treating a park nap as guaranteed.')]);
  replaceExact(body,
    'Toddlers have a finite tolerance for new, loud, and overwhelming experiences. Disney World is specifically designed to be the maximum possible version of all three. The result is that most toddlers have a hard limit of about 3-4 hours in the parks before they start to shut down — crying, melting down, refusing to walk, refusing the stroller, refusing everything.',
    [block('normal', 'A long, loud, busy day can be a lot for a toddler, but every child’s limit is different. Watch for your own child’s cues—fatigue, frustration, hunger, or a need for quiet—and build in shade, snacks, water, and a break before the day unravels.')]);
  return body;
}

function fixFree(doc) {
  const body = structuredClone(doc.body);
  replaceExact(body, '25 Free Things to Do at Disney World (That Are Actually Good)', [block('h2', '25 No-Extra-Cost Things to Do at Disney World (That Are Actually Good)')]);
  replaceExact(body,
    'One of the most common misconceptions about Disney World is that everything costs extra. Yes, park tickets are expensive. Yes, food inside the parks is overpriced. But Disney World itself — the resort property, the theming, the experience — offers a surprising number of genuinely good things that cost nothing at all. These are 25 of them.',
    [block('normal', 'Disney World has plenty of costs, and “free” needs a clear definition. The ideas below either require no park ticket (such as Disney Springs and resort exploration) or are included after you have paid for admission or a qualifying hotel stay. They do not replace a ticket, and resort access, entertainment, and schedules can change—confirm the day’s details before you travel.')]);
  replaceExact(body, 'Park Entry and Atmosphere', [block('h2', 'Included with Park Admission')]);
  // Culls duplicate / unverifiable / misleading entries and corrects the retired show.
  const removeStarts = [
    'Walk around the World Showcase lagoon at Epcot.',
    'Explore the train station at Magic Kingdom\'s entrance.',
    'Watch the Harmonious projection show',
    'Catch the Dapper Dans barbershop quartet',
    'Watch the street performers along the Epcot World Showcase promenade.',
    'The Disney\'s Caribbean Beach resort has a beautiful sunset view',
    'Visit the butterfly garden at Disney\'s Caribbean Beach resort.',
    'Meet characters at the entrance of Magic Kingdom.',
    'The character cruise that goes between Magic Kingdom',
    'Watch the flag ceremony at Epcot\'s United Kingdom pavilion.',
    'Catch the patriotic flag ceremony on Main Street, U.S.A.',
    'Browse the pin trading boards at Disney\'s Fort Wilderness',
  ];
  for (const start of removeStarts) {
    const i = body.findIndex((b) => textOf(b).startsWith(start));
    if (i >= 0) body.splice(i, 1);
  }
  replaceExact(body,
    'Watch fireworks from the beach at the Polynesian — you get a direct sightline to the Magic Kingdom fireworks across the water without any of the crowd.',
    [list('If you are already visiting the Polynesian Village Resort, ask Cast Members where to watch Magic Kingdom fireworks from the resort. Views, access, and music availability vary by location and event night.')]);
  replaceExact(body,
    'Walk the nature trail behind Disney\'s Animal Kingdom Lodge. It\'s a savanna ecosystem with zebras, giraffes, and other animals visible from a walking path — completely free and completely stunning.',
    [list('Visit Disney’s Animal Kingdom Lodge to view the savanna from designated public resort areas when access is available. Animals and viewing locations vary, so treat it as a resort stop rather than a guaranteed encounter.')]);
  replaceExact(body,
    'Visit Disney\'s Fort Wilderness — the resort\'s horse barn offers free tours where you can see the horses up close. It\'s completely free and one of the best-kept secrets on property.',
    [list('Visit Tri-Circle-D Ranch at Disney’s Fort Wilderness when it is open to guests. Check current transportation, access, and hours before making a special trip.')]);
  replaceExact(body,
    'The PhotoPass photographers stationed throughout the parks will take unlimited free photos at iconic locations — and many will hand you the camera to take your own shots too, making them a free photo op at every major landmark regardless of whether you buy the PhotoPass package.',
    [list('Ask a PhotoPass photographer whether they can take a picture with your own phone or camera. The digital PhotoPass downloads are a separate product unless included with your package.')]);
  insertAfter(body,
    'The bottom line: Disney World is expensive, but the resort itself — the theming, the atmosphere, the details — is largely free to experience. If you\'re staying on property, take at least one afternoon to just explore. Some of the best moments of any Disney trip are the ones you didn\'t pay for.',
    [internalLinkBlock('For practical ways to keep the rest of the trip in budget, pair this with our ', 'Disney World packing list for kids', '/blog/disney-world-packing-list-kids/', ' and compare ticket options on our deals page.')]);
  return body;
}

function fixHeights(doc) {
  const body = structuredClone(doc.body);
  const replacements = new Map([
    ['Universal Orlando has gotten serious about thrill rides. The days when Universal was \'the kids\' park\' and Disney was \'the big kid park\' are over. With the opening of Epic Universe in 2025 and the addition of coasters like VelociCoaster and the Incredible Hulk transformation, Universal Orlando now has some of the most intense thrill rides in the world. Height requirements have become one of the most important planning factors for any family visit. Here\'s the complete picture.', 'Universal Orlando has a wide range of family rides and serious thrill rides, especially after Epic Universe opened in 2025. That makes posted height requirements one of the most important planning details for a mixed-age visit. This is a planning guide, not a substitute for the sign at the attraction: requirements and operating status can change, and the Team Member at the entrance makes the final call.'],
    ["At 48 inches (122 cm), your child enters the full thrill ride territory at Universal Orlando. This is where things get serious.", 'At 48 inches (122 cm), several major thrill rides open up at Universal Orlando. A few headline coasters require more than 48 inches, so do not treat this as an “everything” threshold.'],
    ["Hagrids Magical Creatures Motorbike Adventure — 48 inches. The best coaster at Universal Orlando and one of the best in the world. Launches to 50mph in 2.4 seconds, goes upside down multiple times, features a motorbike-style seat. Absolutely not for beginners or anyone sensitive to intense motion. If your teen meets this requirement and wants one ride, this is it.", 'Hagrid’s Magical Creatures Motorbike Adventure — 48 inches. This launched coaster has a motorbike-style seat and several surprises, so use the test seat and consider your child’s comfort with speed, darkness, and sudden motion.'],
    ["Jurassic World VelociCoaster — 48 inches. The fastest coaster at Universal Florida — 76mph launch — with multiple inversions and an ejection seat sensation. Not for the faint of heart. Your 48-inch 9-year-old may be very excited about this; they may also be terrified. Prepare accordingly.", 'Jurassic World VelociCoaster — 51 inches. This high-intensity coaster has launches and inversions; it is a separate threshold above 48 inches.'],
    ["The Incredible Hulk Coaster — 48 inches (currently undergoing transformation; reopening 2026). When it reopens, expect it to be rebuilt from the ground up as a completely new experience. This was already one of the best launch coasters in the world; the 2026 version is expected to raise the bar significantly.", 'The Incredible Hulk Coaster — 54 inches. This is the resort’s highest posted height threshold; check the attraction’s current operating status and the entrance sign on your visit.'],
    ["Dragon Challenge — 48 inches. The twin inverted coaster at Islands of Adventure. Intense, with a hang-time sensation on the vertical loops. A real coaster for kids who are ready.", 'Do not plan around Dragon Challenge: that attraction closed in 2017. Use the current Universal Orlando ride list and the official app when choosing today’s coasters.'],
    ["At 44 inches, your child can ride almost everything at Universal Orlando. This includes the major Harry Potter rides, the big coasters at Universal Studios, and the intense motion simulator experiences.", 'At 44 inches, a child gains a few additional options, but many major rides are set at 48 inches or above. Do not assume a 44-inch child can ride all Harry Potter attractions or the biggest coasters.'],
    ["Harry Potter and the Forbidden Journey — 44 inches. The flagship dark ride at both Islands of Adventure (Hogsmeade) and Universal Studios (Diagon Alley). Motion simulator, complex effects, dragons overhead, Dementors. It's intense — some kids under 48 inches find it genuinely scary. Others love it. Know your child.", 'Harry Potter and the Forbidden Journey — 48 inches. This motion-heavy Hogwarts ride is at Islands of Adventure; Harry Potter and the Escape from Gringotts is a different attraction at Universal Studios Florida with a 42-inch minimum.'],
    ['Despicable Me Minion Mayhem — 44 inches. Motion simulator ride that\'s family-friendly in tone but has intense motion — sudden drops, spins, acceleration. One of the most popular rides at Universal Studios for families with kids 8+.', 'Despicable Me Minion Mayhem — 40 inches for the motion-simulator seating. A stationary seating option may have different eligibility; confirm at the attraction.'],
    ['Transformers: The Ride-3D — 44 inches. Another motion simulator, this time with 3D effects. Less intense than Forbidden Journey, very well-produced. A reliable family favorite at Universal Studios.', 'TRANSFORMERS: The Ride-3D — 40 inches. It is a 3D motion-based attraction, so consider whether your child enjoys screen-based motion.'],
    ['Revenge of the Mummy — 44 inches. An indoor roller coaster with a launch, drops, and darkness. Not the tallest coaster but surprisingly intense with its sudden stops and pitch-black sections.', 'Revenge of the Mummy — 48 inches. This indoor launched coaster includes darkness, speed, and sudden motion.'],
    ["At 40 inches, kids enter the 'almost everything' zone at Universal. Most rides beyond the most intense coasters are now accessible.", 'At 40 inches, a meaningful set of family attractions opens, but several major rides remain at 42, 44, 48, 51, 52, or 54 inches.'],
    ['Kongfrontation — 40 inches. The legendary \'king of the movies\' encounter — you\'re on a subway car when King Kong attacks. Excellent animatronics, real New York subway environment. A classic that\'s held up for 25+ years.', 'Skull Island: Reign of Kong — 36 inches. Kongfrontation was a former Universal Studios Florida attraction; the current Kong ride is at Islands of Adventure.'],
    ["Dudley Do-Right's Ripsaw Falls — 40 inches. A water flume ride with a major 40-foot drop. You will get soaked. It's unavoidable. Pack a Universal Orlando rain poncho — and this is the ride to wear them on. The water here comes up from below as well as above.", 'Dudley Do-Right’s Ripsaw Falls — 44 inches. This water ride includes a large drop; expect to get wet.'],
    ["Popeye & Bluto's Bilge-Rat Barges — 40 inches. A river rapids ride that soaks everyone. Less intense than Dudley Do-Right's but still a full-body water experience. Bring spare shoes or accept wet feet.", 'Popeye & Bluto’s Bilge-Rat Barges has a posted minimum height; confirm the current sign and app before relying on an older chart. Expect to get wet.'],
    ["At 36 inches, kids start accessing the kid-friendly thrill rides. Still no Walt Disney World-level intensity but a genuine step up from toddler rides.", 'At 36 inches, several family attractions open up. The mix varies by park, so use the official ride list instead of assuming every 36-inch ride is a coaster or a good fit for every child.'],
    ['Storm Force Accelatron — 36 inches. X-Men themed spinning ride. Not particularly thrilling but spinning machines are always a hit with kids in this age group.', 'Storm Force Accelatron has no posted minimum height, though a supervising companion may be required for young guests.'],
    ["Kids under 34 inches have limited but real options at Universal Orlando. The playgrounds (Caro-Seuss-el at Universal Studios, the Me Ship at Islands of Adventure) are genuinely excellent and often overlooked by families who push too hard for the rides. At this height group, the strategy is: let the kids play in the themed play areas while older siblings do thrill rides, then reconvene.", 'Kids under 34 inches still have real options, including attractions with no posted minimum and designated play areas. Caro-Seuss-el and the Me Ship are in Islands of Adventure; check current access and supervision rules before you go.'],
    ['Universal Orlando is serious about height measurements. Kids are measured in shoes at every ride entrance, and cast members are trained to be firm about it. If your child is even slightly under the requirement, they will not ride. No exceptions, no \'they\'re really close,\' no \'it\'s just an inch.\' This is a hard safety line.', 'Universal measures guests at the attraction and the posted minimum is a safety requirement. If a child does not meet it at the entrance, they cannot ride. Measurements, footwear policies, and companion requirements are handled by the Team Member at the attraction.'],
    ["Here's the practical tip: measure your child at home before you go. Not with a tape measure — take them to a wall, mark their height with a pencil, and compare to a ruler. Or take them to a doctor's office and get an accurate measurement. If they're borderline — say, 43 inches and the ride requires 44 — you need to know that before you're standing in line at Islands of Adventure. A crying child who can't ride Hagrid's because they're an inch short is a rough moment.", 'Measure your child at home as a planning aid, especially if they are close to a cutoff. Treat the park measurement as final; do not build the day around a borderline ride.'],
    ["Also: measure in the shoes your child will wear to the park. Universal measures in shoes, and some shoes add half an inch or more. If your child wears thick-soled sneakers to the park, they might clear a requirement that they wouldn't in thin shoes. Conversely, if they're wearing sandals, they might fall short of what they would clear in sneakers.", 'Do not rely on footwear to change eligibility. Use the shoes your child will comfortably wear, and let the attraction Team Member apply the current measurement procedure.'],
    ['The strategic approach for families: map your ride priorities by the shortest person in your group. Not the adults. The kids. Whatever the shortest person can ride determines your group\'s ride set. Then build your day around those rides.', 'For mixed-height families, map shared priorities by the shortest rider, then plan a few Child Swap or split-up windows for the taller riders.'],
    ["If you have mixed heights — say, a 44-inch 8-year-old and a 38-inch 5-year-old — the strategy is to split up for select rides. The older kid does Hagrid's or VelociCoaster while the younger kid does Flight of the Hippogriff or the play areas. Then you reconvene. This is completely normal at Universal — families do it regularly, and the rides have all been designed with this in mind. The single rider line is also available at most major rides for splitting up.", 'With mixed heights, use Child Swap where offered and split up for select rides. Check each attraction’s current policies; single-rider lines are not available at every ride and do not replace the height requirement.'],
    ['One thing many families overlook: the Universal Express Pass. At $50-80 per person per day during peak periods, it\'s expensive. But during spring break and summer, a day without Express Pass at Universal can mean 45-60 minute waits on every major ride. A family of four doing two park days can easily spend $400-600 on Express Pass — but the time savings (and reduced frustration) can make it genuinely worth it. Do the math for your specific dates.', 'One thing many families consider is Universal Express Pass. It can save standby time on eligible attractions, but pricing, eligible rides, and wait-time benefits vary by date and product. Compare the current official options for your dates; do not assume Express applies to every attraction.'],
  ]);
  for (const [oldText, newText] of replacements) replaceExact(body, oldText, [block('normal', newText)]);
  insertAfter(body, 'Universal Orlando Height Requirements: Everything You Need to Know', [block('normal', 'Quick chart note: the current major thresholds include 34, 36, 40, 42, 44, 48, 51, 52, and 54 inches. This guide highlights representative rides rather than every attraction; verify the official Universal Orlando app and entrance signage for your date.')]);
  return body;
}

function fixSummer(doc) {
  const body = structuredClone(doc.body);
  // Normalize malformed old style-based lists to genuine Portable Text lists.
  for (const b of body) {
    if (b._type === 'block' && (b.style === 'bullet' || b.style === 'number')) {
      b.listItem = b.style;
      b.level = 1;
      b.style = 'normal';
    }
  }
  replaceExact(body,
    'Universal Orlando just dropped its biggest limited-time event of the year — and it\'s all inspired by one of cinema\'s most legendary filmmakers. The Spielberg Summer Blockbuster Season runs May 23 through August 10, 2026, and transforms Universal Studios Florida into a living celebration of blockbuster filmmaking.',
    [block('normal', 'This guide covers Universal Orlando’s May 23–August 10, 2026 summer season. As of July 23, 2026, the seasonal window is still in progress, but individual entertainment, food, merchandise, and operating hours can change. Check the official Universal Orlando app and event calendar for the current schedule before making a special trip.')]);
  replaceExact(body,
    'We\'re talking exclusive exhibits, movie-inspired character meet-and-greets, themed food and merchandise, returning fan favorites like the Mega Movie Parade, and more. It\'s the resort\'s most ambitious summer programming to date, built around Steven Spielberg\'s iconic film catalog and tied to the release of a brand-new Universal Pictures film, Disclosure Day (in theaters June 12).',
    [block('normal', 'Treat the seasonal experiences below as a planning checklist, not a promise that every item will run on your exact date. If an experience is essential to your trip, verify it in the official app shortly before and during your visit.')]);
  replaceExact(body, 'If you\'re planning a Universal Orlando trip this summer, this is the event to build your visit around.', [block('normal', 'If you are visiting before the season ends, build your day around the experiences that are confirmed for your date and leave room for regular park priorities.')]);
  replaceExact(body, 'Spielberg "Disclosure Day" Exhibit', [block('h3', 'Seasonal Spielberg Exhibit')]);
  replaceExact(body, 'The centerpiece of the summer is this limited-time exhibit inside Universal Studios Florida. Guests can explore a curated collection of props, costumes, and behind-the-scenes stories drawn from Steven Spielberg\'s most iconic films — think Jaws, Jurassic Park, E.T., Raiders of the Lost Ark, and more. The exhibit is tied to the June 12 premiere of Disclosure Day, a new Universal Pictures thriller from Spielberg.', [block('normal', 'Universal Studios Florida has promoted a limited-time Spielberg-themed exhibit for the summer season. Confirm the current name, location, included materials, and availability in the official app before you go.')]);
  replaceExact(body, 'This is the kind of experience that makes you stop and look twice. Seeing actual props from films you\'ve watched a hundred times with your kids is a different kind of magic. If your family loves movie history — or if you just want something genuinely new at the parks — this is worth prioritizing.', [block('normal', 'For families interested in movie history, this can be a worthwhile lower-intensity stop between rides—if it is listed for your date.')]);
  replaceExact(body, 'Location: Universal Studios Florida', [block('normal', 'Location: Universal Studios Florida (verify in the app).')]);
  replaceExact(body, 'Dates: May 23 – August 10, 2026', [block('normal', 'Season dates: May 23–August 10, 2026 (subject to change).')]);
  replaceExact(body, 'Universal\'s Aventi Hotel: — Value-oriented, good option for families watching their budget', [list('Universal’s Aventura Hotel — a value-oriented option for families watching their budget. Confirm current benefits and transportation before booking.')]);
  replaceExact(body, 'Premier Level (Includes Unlimited Express Unlimited with stay):', [block('normal', 'Premier hotels (typically include Universal Express Unlimited for registered hotel guests):')]);
  replaceExact(body, 'Parent tip: The unlimited Express Unlimited pass alone at the Premier hotels can easily run $124–$139 per person per day if purchased separately. For families planning to hit Express-heavy attractions like Hagrid\'s or VelociCoaster, springing for Portofino Bay or Hard Rock Hotel can actually net out as a savings versus buying Express passes separately.', [block('blockquote', 'Parent tip: Premier-hotel Express benefits can change the comparison, but the value depends on your exact dates, party size, and which attractions accept the product. Price the hotel package and the current Express products side by side before booking.')]);
  replaceExact(body, 'Universal Express Passes start at $119.99 per person for a single-day pass (varies by date, up to $319.99). Epic Universe-specific Express Passes run $209–$309 per person depending on the date.', [block('normal', 'Universal Express Pass pricing and eligibility vary by date, park, and product. Check the official Universal Orlando site for the current options for your travel dates, including any Epic Universe-specific terms.')]);
  replaceExact(body, 'For the latest Express Pass pricing and availability, check our partner\'s ticket page.', [block('normal', 'For the latest Express Pass pricing and availability, check Universal Orlando’s official site and compare your eligible ticket options before purchase.')]);
  replaceExact(body, 'Is Minions & Monsters already out in theaters?', [block('normal', 'Is Minions & Monsters already in theaters?')]);
  replaceExact(body, 'Not yet. The film premieres at Annecy on June 21 and opens in U.S. theaters on July 1, 2026. The Universal Orlando activations are previews.', [block('normal', 'This article was first drafted before the summer release window. By late July 2026, confirm current film and park-promotion details through the official studio and Universal Orlando channels.')]);
  replaceExact(body, 'What\'s the new Spielberg film called?', [block('normal', 'What is the seasonal Spielberg exhibit called?')]);
  replaceExact(body, 'Disclosure Day, hitting theaters June 12, 2026.', [block('normal', 'Confirm the current exhibit title and contents in the official Universal Orlando app; seasonal branding and details can change.')]);
  replaceExact(body, 'What new Minions characters can I meet?', [block('normal', 'What Minions experiences are available?')]);
  replaceExact(body, 'Henry and James — two of the new Minions being introduced in Minions & Monsters.', [block('normal', 'Character appearances and photo opportunities are schedule-dependent. Check the app on the day of your visit.')]);
  replaceExact(body, 'The key decisions are:', [block('normal', 'For the remaining summer-season window, the key decisions are:')]);
  // Clean up dated claims without deleting the whole useful guide.
  const datedStarts = ['2026 ticket starting prices:', 'Buy a 1-Day Park-to-Park Ticket, get a 2nd day free', 'Up to 25% off select hotel stays', 'Buy a 3-Day Base or Park-to-Park Ticket, Get 2 Days Free:', 'This deal applies to both base tickets', 'The Buy 3 Get 2 Free deal is the strongest value'];
  for (const start of datedStarts) {
    const i = body.findIndex((b) => textOf(b).startsWith(start));
    if (i >= 0) body.splice(i, 1);
  }
  insertAfter(body, 'Universal is running multiple promotions specifically for summer 2026:', [block('normal', 'Promotions and hotel offers change frequently. Rather than relying on a static deal list, compare the official ticket and hotel offers available for your exact travel dates.')]);
  insertAfter(body, 'Ready to start comparing prices? Grab your tickets through our recommended partner below and lock in your summer trip before the best dates are gone.', [internalLinkBlock('Traveling with kids at different heights? Use our ', 'Universal Orlando height requirements guide', '/blog/universal-orlando-height-requirements/', ' to set realistic ride priorities before you buy tickets.')]);
  return body;
}

const transforms = {
  'disney-world-with-baby-toddler': fixBaby,
  'free-things-disney-world': fixFree,
  'universal-orlando-height-requirements': fixHeights,
  'universal-orlando-summer-2026': fixSummer,
};

const changes = [];
for (const slug of slugs) {
  const doc = await client.fetch(`*[_type == 'blogPost' && slug.current == $slug][0]{_id,_rev,slug,body}`, { slug });
  if (!doc) throw new Error(`Missing ${slug}`);
  const body = transforms[slug](doc);
  const result = await client.patch(doc._id).ifRevisionId(doc._rev).set({ body }).commit({ autoGenerateArrayKeys: true });
  changes.push({ slug, id: result._id, rev: result._rev, blocks: body.length });
}
console.log(JSON.stringify(changes, null, 2));
