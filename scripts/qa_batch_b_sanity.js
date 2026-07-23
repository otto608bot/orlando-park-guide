#!/usr/bin/env node
/** Batch B CMS QA: safe, source-aware Portable Text refreshes. Run with --apply to mutate. */
import { createClient } from '../web/node_modules/@sanity/client/dist/index.js';

const token = process.env.SANITY_API_TOKEN;
if (!token) throw new Error('SANITY_API_TOKEN is required.');
const client = createClient({ projectId: 'hd7qwtcq', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token });
const apply = process.argv.includes('--apply');
let n = 0;
const key = (prefix = 'b') => `${prefix}${(++n).toString(36)}qaB`;
const block = (text, options = {}) => ({ _key: key(options.style?.replace('h', 'h') || options.listItem || 'p'), _type: 'block', style: options.style || 'normal', ...(options.listItem ? { listItem: options.listItem, level: 1 } : {}), children: [{ _key: key('s'), _type: 'span', text, marks: [] }] });
const h2 = (text) => block(text, { style: 'h2' });
const h3 = (text) => block(text, { style: 'h3' });
const bullet = (text) => block(text, { listItem: 'bullet' });
const linkBlock = (parts) => {
  const markDefs = [];
  const children = parts.map((part) => {
    if (typeof part === 'string') return { _key: key('s'), _type: 'span', text: part, marks: [] };
    const mark = key('link');
    markDefs.push({ _key: mark, _type: 'link', href: part.href });
    return { _key: key('s'), _type: 'span', text: part.text, marks: [mark] };
  });
  return { _key: key('p'), _type: 'block', style: 'normal', markDefs, children };
};
const close = () => block('As an Amazon Associate and affiliate partner, Plan Your Park may earn from qualifying purchases at no extra cost to you.');
const heightNote = () => block('Height rules are enforced at the attraction entrance. Re-measure close to travel and confirm the official requirement on Universal or Disney’s site and in the park app; attractions and operating procedures can change.');

const guideBody = [
  h2('Epic Universe Rides for Families: Start With Height, Not Hype'),
  block('Epic Universe is big enough that a family can have a great day without doing every headliner. Start with the attractions each child can ride, choose two or three priorities, and leave room for shows, food and a reset.'),
  heightNote(),
  h2('Best First Picks by Family'),
  h3('Super Nintendo World'),
  block('Mario Kart: Bowser’s Challenge is the best-known family headliner, but it has a 40-inch requirement. Yoshi’s Adventure is the gentler choice for younger kids; Mine-Cart Madness is a more intense option for riders who meet its posted requirement. Confirm each requirement before promising a ride to a child.'),
  h3('How to Train Your Dragon — Isle of Berk'),
  block('This land is the easiest place to balance riders and non-riders. Hiccup’s Wing Gliders is a family coaster, while Fyre Drill and the land’s play and show options give younger kids something to do while taller riders take a turn.'),
  h3('Dark Universe'),
  block('Monsters Unchained: The Frankenstein Experiment is for taller, braver riders and can be intense because of darkness, loud effects and frightening imagery. Curse of the Werewolf is a lighter coaster option, but still check the posted height and each child’s comfort with spinning and dark scenes.'),
  h3('The Wizarding World of Harry Potter — Ministry of Magic'),
  block('Harry Potter and the Battle at the Ministry is a major priority for Harry Potter fans. It has a posted height requirement and may be too intense for kids who dislike motion, loud audio or villains. Put it on the plan only after checking the day’s status and your group’s height.'),
  h3('Celestial Park'),
  block('Celestial Park is the natural breather between lands. Constellation Carousel works well for all ages, while Stardust Racers is a high-thrill coaster for eligible riders. Use the hub for a snack, a bathroom stop and a regroup before committing to the next long queue.'),
  h2('A Practical Ride Order'),
  bullet('At park opening, head to the one family headliner your group cares about most instead of trying to cross the whole park.'),
  bullet('Before lunch, do one more height-eligible priority ride while everyone still has energy.'),
  bullet('Use midday for a show, a gentler attraction, a meal and land exploration rather than forcing another long outdoor queue.'),
  bullet('After a reset, return for anything missed and choose a final must-do based on the posted wait and your kids’ energy.'),
  block('Use the Universal Orlando app for the current attraction status, posted waits, mobile food ordering and any available Universal Express options. It is not a promise that a line will stay short, so keep a backup attraction in each land.'),
  h2('Related Planning'),
  linkBlock(['Build the rest of your day with the ', { text: 'Epic Universe 1-day plan', href: '/blog/epic-universe-1-day-plan/' }, ', compare dates in the ', { text: 'Epic Universe tickets guide', href: '/blog/epic-universe-tickets-guide/' }, ', and use our ', { text: 'Universal height requirements guide', href: '/blog/universal-orlando-height-requirements/' }, ' before locking in must-dos.']),
  close(),
];

const planBody = [
  h2('Can You Do Epic Universe in One Day?'),
  block('Yes—if “do it” means a thoughtful family day rather than every attraction. Pick a short must-do list by height and comfort level, then protect a midday reset. The goal is happy kids at dinner, not a perfect checklist.'),
  h2('Before You Leave Home'),
  bullet('Confirm park hours, early-admission eligibility and the official height requirements for your group.'),
  bullet('Download the Universal Orlando app, add tickets, and bring a charged phone plus a backup battery.'),
  bullet('Choose two morning priorities and one low-key backup in each land in case an attraction is unavailable.'),
  bullet('Agree on a Rider Switch plan before park day if someone is below a height requirement.'),
  h2('Morning: Do One Headliner First'),
  block('Arrive in time for park opening, then go directly to your group’s top priority. Super Nintendo World is a sensible first choice for many families, but Ministry of Magic, Isle of Berk or Dark Universe may be the better choice if that is where your eligible kids’ must-do ride is located. Check the app that morning instead of relying on a fixed wait-time prediction.'),
  h2('Midday: Slow the Plan Down'),
  block('Plan an early lunch, then use the hottest and most crowded part of the day for a show, a gentler attraction, a snack, shopping or a hotel break if that works for your location. This is the part of the day where a family plan usually succeeds or fails.'),
  h2('Afternoon and Evening: Finish the Priorities'),
  bullet('Return to the second priority ride you did not reach in the morning.'),
  bullet('Use a carousel, play area or show as the non-rider activity during a Rider Switch.'),
  bullet('Save one flexible re-ride or photo stop for the final stretch instead of scheduling every minute.'),
  h2('Sample Family Schedule'),
  bullet('Park opening: one height-eligible headliner in the land your family cares about most.'),
  bullet('Late morning: a second priority ride, then a low-intensity attraction or land exploration.'),
  bullet('Early lunch: mobile order if available, then reset indoors or return to the hotel if practical.'),
  bullet('Mid-afternoon: a show, a no-height attraction, or a Rider Switch rotation.'),
  bullet('Evening: one remaining must-do, then dinner and a calm walk through Celestial Park.'),
  h2('If Someone Is Under 40 Inches'),
  block('Do not plan the day around a restricted ride. Pair each taller-rider priority with a nearby activity the younger child will enjoy, then use Rider Switch where offered. The best day is one where every kid has a “my favorite thing” moment.'),
  h2('Next Steps'),
  linkBlock(['Use the ', { text: 'Epic Universe rides ranked guide', href: '/blog/epic-universe-rides-ranked-guide/' }, ' to pick family priorities, verify heights in our ', { text: 'Universal height requirements guide', href: '/blog/universal-orlando-height-requirements/' }, ', then compare current dates in the ', { text: 'Epic Universe tickets guide', href: '/blog/epic-universe-tickets-guide/' }, '.']),
  close(),
];

const ticketsBody = [
  h2('Epic Universe Tickets: What to Compare'),
  block('Epic Universe ticket products, availability and prices are date-based and change often. Rather than relying on a static dollar figure, compare the exact date, number of park days, park-to-park access and any restrictions before checkout.'),
  h2('Choose the Ticket Shape Before the Deal'),
  h3('Epic-only day'),
  block('An Epic-only ticket may fit a short trip or a family that wants to give the new park a full day. Compare it with multi-day options before deciding: the cheapest-looking single day is not always the best total value.'),
  h3('Multi-park and multi-day tickets'),
  block('For a Universal-focused trip, compare the total price and usable days—not just the headline discount. Check which parks are included, whether the ticket requires park-to-park access, and the expiration or use window.'),
  h2('Universal Express Is Separate From Disney Lightning Lane'),
  block('Universal Express is Universal Orlando’s paid queue-access product. It is separate from admission, its participating-attraction list can vary, and Epic Universe eligibility should be confirmed for your date. Disney’s current paid line-skip products are Lightning Lane Multi Pass and Lightning Lane Single Pass; they are not Universal Express and are not included with Universal tickets.'),
  bullet('Universal Express: typically allows one Express entry per participating attraction.'),
  bullet('Universal Express Unlimited: allows repeat Express entries at participating attractions.'),
  bullet('Hotel benefits and Epic Universe coverage can change; confirm the current terms for your stay before booking around them.'),
  h2('Where to Buy'),
  block('Buy direct when you need the official site’s package options or its current change terms. Compare reputable authorized sellers when the exact same ticket and dates are available. Read the ticket’s use-by date, change policy and inclusions before paying.'),
  h2('Ways to Save Without Guessing'),
  bullet('Choose dates first, then compare the same ticket across direct and authorized sellers.'),
  bullet('Price the whole trip: ticket days, parking, hotel, meals and any Express add-on.'),
  bullet('Avoid buying park-to-park access unless your itinerary actually uses it.'),
  bullet('Bring a refillable water bottle and check current park rules; bottled-drink prices and policies change.'),
  h2('What Admission Usually Does Not Include'),
  bullet('Universal Express or Universal Express Unlimited.'),
  bullet('Parking unless your package or hotel benefit says otherwise.'),
  bullet('Special-ticket events, merchandise, lockers where required, and most photo products.'),
  h2('Bottom Line for Families'),
  block('A multi-day ticket can be good value, but only when it matches the number of park days your kids can realistically enjoy. Confirm current pricing and terms on the day you buy, and treat Express as a peak-day convenience decision—not a default.'),
  linkBlock(['Use the ', { text: 'Epic Universe 1-day plan', href: '/blog/epic-universe-1-day-plan/' }, ' to estimate your park time, check heights in our ', { text: 'Universal height requirements guide', href: '/blog/universal-orlando-height-requirements/' }, ', and compare current options on our ', { text: 'partner deals page', href: '/deals/' }, '.']),
  close(),
];

const mkBody = [
  h2('Magic Kingdom Rides for Kids Under 40 Inches'),
  block('A child who is just under 40 inches can still have a full Magic Kingdom day. The important part is to build the plan around rides they can actually board, rather than promising the coasters that require 40 inches or more.'),
  heightNote(),
  h2('The Key Height Breaks'),
  bullet('No height requirement: many Fantasyland, Adventureland and classic Tomorrowland rides are available to the whole family.'),
  bullet('32 inches: Tomorrowland Speedway is an option for eligible children.'),
  bullet('35 inches: The Barnstormer becomes available.'),
  bullet('38 inches: Seven Dwarfs Mine Train becomes available.'),
  bullet('40 inches: Big Thunder Mountain Railroad and Tiana’s Bayou Adventure become available, so they are not options for a child below 40 inches.'),
  h2('Best Picks Below 40 Inches'),
  h3('Peter Pan’s Flight'),
  block('A classic family dark ride with no height requirement. It is a strong early priority if it matters to your group, but use the official app on the day rather than assuming a particular wait.'),
  h3('The Many Adventures of Winnie the Pooh'),
  block('A gentle dark ride with no height requirement and a good fit for preschoolers who need a break from louder attractions.'),
  h3('“it’s a small world”'),
  block('A no-height boat ride and a useful cool-down stop when little legs need a seated attraction.'),
  h3('Jungle Cruise, Dumbo and The Magic Carpets of Aladdin'),
  block('All are no-height options with distinct appeal: a slow boat ride, a classic spinner and a family-favorite flying ride. Choose by interest and energy rather than forcing every one.'),
  h3('The Barnstormer and Seven Dwarfs Mine Train'),
  block('For children who meet the posted threshold, The Barnstormer (35 inches) and Seven Dwarfs Mine Train (38 inches) are the coaster choices in this guide. Both can feel bigger than their height rule suggests, so judge the child—not only the measurement.'),
  h2('Rides to Save for 40 Inches or Taller'),
  block('Big Thunder Mountain Railroad and Tiana’s Bayou Adventure each require 40 inches. Space Mountain has a higher requirement, and TRON Lightcycle / Run requires 48 inches. Do not treat a near-miss as negotiable; Disney measures at the entrance.'),
  h2('A Low-Stress One-Day Plan'),
  bullet('At opening, choose one high-priority no-height ride and one 35- or 38-inch ride if your child qualifies.'),
  bullet('Use late morning for nearby classics rather than zig-zagging across the park.'),
  bullet('Schedule a real midday break: a seated attraction, a meal or a hotel/pool reset.'),
  bullet('For Disney’s current paid line-skip service, consider Lightning Lane Multi Pass and Lightning Lane Single Pass only after checking the attractions and return windows available for your date.'),
  h2('Use the Live Filter Before Park Day'),
  linkBlock(['Open our ', { text: 'Magic Kingdom ride finder preset for 40 inches', href: '/rides/?height=40&parks=Magic%20Kingdom' }, ' to see the current ride list, then pair it with the ', { text: 'Disney World kids packing list', href: '/blog/disney-world-packing-list-kids/' }, '. Planning Universal too? Read the ', { text: 'Universal height requirements guide', href: '/blog/universal-orlando-height-requirements/' }, '.']),
  block('A great Magic Kingdom day with a shorter child is about realistic priorities, shade and breaks. The classics are classics for a reason—let them be the main event.'),
  close(),
];

const closuresBody = [
  h2('March 2026 Closure Notes — Historical Reference'),
  block('This article records planning notes that were relevant in March 2026. Those dates have passed. Do not use the list below as a current refurbishment calendar or as confirmation that an attraction is open or closed today.'),
  h2('What This Page Can Still Help With'),
  block('A dated closure list is useful as a reminder to build backup plans, but attraction maintenance schedules can change with little notice. For a current trip, check the official Disney, Universal Orlando and SeaWorld calendars and each park’s app on the day you visit.'),
  h2('How to Plan Around a Current Closure'),
  bullet('Choose two or three priorities, plus a nearby backup for each one.'),
  bullet('Confirm attraction status in the official app on the morning of your visit and again before crossing the park.'),
  bullet('Use the current Disney app for Lightning Lane Multi Pass or Lightning Lane Single Pass availability; do not rely on a prior month’s return-window advice.'),
  bullet('At Universal, review current Universal Express participation and terms for your ticket date; it is a separate product from Disney Lightning Lane.'),
  bullet('Keep meals, shows and low-intensity attractions in the plan so a closure does not derail the entire day.'),
  h2('A Note on March 2026'),
  block('The original March-specific closure entries and projected crowd advice have been removed rather than presented as current. Refurbishment, staffing, weather and operating-hour information is volatile and must be confirmed close to travel.'),
  h2('Useful Current Planning Tools'),
  linkBlock(['Use the ', { text: 'ride finder', href: '/rides/' }, ' to filter rides by height, start at the ', { text: 'Orlando parks hub', href: '/parks/' }, ' for park comparisons, and review ', { text: 'current deals', href: '/deals/' }, ' only after your travel dates are set.']),
  close(),
];

const updates = {
  'epic-universe-rides-ranked-guide': { body: guideBody, excerpt: 'Epic Universe rides for families: how to choose must-dos by height, comfort level and park-day energy. Updated 2026 planning guide.' },
  'epic-universe-1-day-plan': { body: planBody, excerpt: 'A realistic 1-day Epic Universe touring plan for families: priorities by height, a midday reset and flexible backups. Updated 2026.' },
  'epic-universe-tickets-guide': { body: ticketsBody, excerpt: 'How to compare current Epic Universe tickets, Universal Express and authorized-seller options without relying on stale price claims.' },
  'best-magic-kingdom-rides-kids-under-40-inches': { body: mkBody, excerpt: 'The best Magic Kingdom rides for kids under 40 inches, with accurate height breaks and a low-stress family plan.' },
  'orlando-closures-march-2026': { body: closuresBody, excerpt: 'Historical March 2026 closure notes, updated with clear guidance for checking today’s official Orlando park refurbishment calendars.' },
};

async function main() {
  const slugs = Object.keys(updates);
  const posts = await client.fetch('*[_type == "blogPost" && slug.current in $slugs]{_id, "slug": slug.current, title}', { slugs });
  if (posts.length !== slugs.length) throw new Error(`Expected ${slugs.length} posts, found ${posts.length}.`);
  for (const post of posts) {
    const patch = { set: updates[post.slug] };
    console.log(`${apply ? 'Updating' : 'Would update'} ${post.slug} (${post._id}): ${updates[post.slug].body.length} blocks`);
    if (apply) await client.patch(post._id).set(patch.set).commit({ autoGenerateArrayKeys: true });
  }
}
main().catch((error) => { console.error(error); process.exit(1); });
