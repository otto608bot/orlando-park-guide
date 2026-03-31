#!/usr/bin/env python3
import urllib.request
import json

TOKEN = "skQUXzNOvcWakM2LokLf7LCcxBI2ooAQwIo0r9zIIQWDrQqBhYniPpeRFWnVFfn2XdMAqWwyqgCMPaSzskCDCM43Q2g3ASzR5AxEap7ypBPFOdvko7ajkDBLmDBSIsvY6yfAUUzQHKeAMcOO2FhmJHPa5kraCuFjSuv06XuuqvAcJIb3lxuj"
PROJECT = "hd7qwtcq"
ENDPOINT = f"https://{PROJECT}.api.sanity.io/v2024-01-01/data/mutate/production"

def sanity_mutate(mutations):
    data = json.dumps({"mutations": mutations}).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN}"
        },
        method="POST"
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())

# Create categories first
print("Creating categories...")
cats = sanity_mutate([
    {"create": {"_type": "category", "title": "Disney World", "slug": {"_type": "slug", "current": "disney-world"}}},
    {"create": {"_type": "category", "title": "Universal Orlando", "slug": {"_type": "slug", "current": "universal-orlando"}}},
    {"create": {"_type": "category", "title": "General", "slug": {"_type": "slug", "current": "general"}}},
])
print(json.dumps(cats, indent=2))

# Get category IDs
req = urllib.request.Request(
    f"https://{PROJECT}.api.sanity.io/v2024-01-01/data/query/production?query=*%5B_type+%3D%3D+%27category%27%5D",
    headers={"Authorization": f"Bearer {TOKEN}"}
)
with urllib.request.urlopen(req) as resp:
    cat_result = json.loads(resp.read())

cat_map = {}
for cat in cat_result["result"]:
    cat_map[cat["slug"]["current"]] = cat["_id"]
print(f"Category map: {cat_map}")

body_mk = [
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "Why 40 Inches Matters at Magic Kingdom"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "At 40 inches (about 3'4\"), kids can ride nearly everything at Magic Kingdom except for the tallest coasters. Our oldest was exactly 40 inches at our last trip, and suddenly the entire park opened up. But here's what nobody tells you: there are amazing rides at Magic Kingdom specifically designed for kids under 40 inches that older kids and adults love too. This guide is what I wish I'd had before that trip."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "Rides Your Kids CAN Ride at 40 Inches and Under"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Here's the thing about Magic Kingdom's height requirements: most of the classics—Pirates of the Caribbean, It's a Small World, The Haunted Mansion, Peter Pan's Flight—are completely open to all heights. But some of the best rides have a 40-inch threshold that catches parents off guard. I organized these by what I call the 'Short-Kid Sweet Spot'—rides where your 40-inch-or-under child will have an absolute blast."}]},
    {"_type": "block", "style": "h3", "children": [{"_type": "span", "text": "No Height Requirement (Ride Everything)"}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "It's a Small World – Classic, gentle boat ride through animatronic scenes of children from around the world. A must-do."}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "Pirates of the Caribbean – Boat ride with animatronic pirates, cannon fire, and a splash. Slightly scary but no big drops."}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "The Haunted Mansion – Atmospheric ride-through with 'ghosts.' Mild spooky but not scary for most kids."}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "Peter Pan's Flight – Gentle boat ride that floats through Peter Pan scenes. Pure magic."}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "The Many Adventures of Winnie the Pooh – Bouncing car ride through Hundred Acre Wood. Excellent for Pooh fans."}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "Jungle Cruise – Guided boat tour with terrible jokes. Kids love the 'wild animals.'"}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "Country Bear Jamboree – Animated bears singing. Weirdly beloved by a certain age group."}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "The Magic Carpets of Aladdin – Spinning carpet ride. You can make it go up and down."}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "Dumbo the Flying Elephant – Classic spinning ride. Long queues—use Genie+."}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "The Barnstormer – Small coaster at 35\"+. Great first 'big kid' coaster."}]},
    {"_type": "block", "style": "h3", "children": [{"_type": "span", "text": "Rides at 38-40 Inches"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "These rides require kids between 38-40 inches:"}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "Seven Dwarfs Mine Train – 38\" required. Family coaster with a dip. Our 40\" kids rate this their #1 ride."}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "Tomorrowland Speedway – 32\" to ride alone. Disney's go-karts—a unique experience."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "My Touring Plan for Short Kids at Magic Kingdom"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Arrive at opening and head straight to Fantasyland—that's where the highest concentration of no-height-limit rides lives. Do Peter Pan's Flight first (it books up fast on Genie+), then It's a Small World, followed by Winnie the Pooh. By then you'll have hit the core Fantasyland classics before the crowd really builds. After Fantasyland, move to Adventureland for Pirates of the Caribbean and Jungle Cruise. Save The Haunted Mansion for early afternoon when the Florida heat peaks."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "What About the Rides My Child Can't Ride Yet?"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "If your child is under 38 inches, they can't do Big Thunder Mountain Railroad (40\"), Splash Mountain (40\"), TRON Lightcycle Run (48\"), or Space Mountain (44\"). Use Rider Switch—one parent rides while the other does Fantasyland rides with your child, then switch. Both kids feel like they got the full experience."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "Pro Tips for Parents of Short Kids"}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "Measure your child before you go in the shoes they'll wear at the parks."}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "Use Rider Switch for tall rides—your non-riding parent gets Lightning Lane access."}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "The 'any height' rides are often better than the restricted ones. Your 40-inch kid will love It's a Small World just as much as their older sibling."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "The Bottom Line"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Magic Kingdom is designed for families with kids of all heights. At 40 inches, your child can ride nearly everything in the park. At under 38 inches, there's still more than enough to fill multiple days. The magic isn't about the height—it's about being there together."}]},
]

body_baby = [
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "Yes, You Can Do Disney World with a Baby or Toddler"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "When I tell people we took our then-18-month-old to Disney World, the reaction is always the same: 'Why? They won't remember it.' And my answer is always the same: because we're going to remember it. Watching our daughter face Cinderella Castle for the first time—in person, not just on a TV screen—is something I'll carry with me forever. Disney World with a baby or toddler isn't about what your kid will remember. It's about what your family experiences together. And here's the thing: Disney World is genuinely one of the most baby-friendly vacation destinations on the planet. Baby care centers, stroller parking, high chairs everywhere, and food that caters to every palate."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "The Stroller Strategy"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "You need a good stroller. You're going to be pushing it for 6, 8, sometimes 10+ miles a day. A flimsy umbrella stroller will fall apart by day two. The Baby Jogger City Mini or similar is the gold standard—lightweight but sturdy, large canopy, easy to fold. Rent a stroller if you don't want to travel with one—Disney-area rental companies deliver directly to your hotel and it's a legitimately great option."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "The Nap Problem—and How to Solve It"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Toddlers nap. It's non-negotiable. And if you've ever tried to keep a toddler awake past their nap time in 90-degree heat, you know what happens: full meltdown by 2pm. Option 1: go back to the hotel. If your hotel is on property, a 90-minute nap break is completely doable and the quality of afternoon time is so much better. Option 2: the stroller nap. Some kids will sleep anywhere. At Magic Kingdom, the walkway between Adventureland and Frontierland is gently sloped—basically a rocking motion. Our daughter was out within 5 minutes."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "Baby Care Centers Are Your Secret Weapon"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Every Disney World park has a Baby Care Center—most people walk right past them without knowing they exist. These aren't just changing stations. They're full-service facilities with nursing rooms, bottle warming, formula and baby food for purchase, high chairs, and quiet spaces. Magic Kingdom's is between the Crystal Palace and Tomorrowland. Epcot's is near the France pavilion. Find them on the app before you need them."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "What to Pack"}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "More diapers than you think—changes happen at the worst times"}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "A full change of clothes for baby AND parents (blowouts happen)"}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "Sunscreen—the park sells it but the brands are limited"}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "A light rain cover for the stroller—Florida rain comes fast"}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "Snacks—lots of them. Hangry toddlers are real."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "Genie+ Strategy with Toddlers"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Genie+ is absolutely worth it with a toddler. You're not racing between attractions—you're strategically moving through the park while your Lightning Lane times do the waiting for you. With a toddler, prioritize: any ride with a height requirement your child meets, character meet-and-greets (which fill up), and the big shows like Mickey's PhilharMagic. Book your first Lightning Lane at 7:00am sharp via the app before you've even left your hotel."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "The Bottom Line"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Disney World with a baby or toddler requires more planning, more stuff, and more patience. But the reward—watching your little one experience the magic for the first time—is worth every ounce of extra effort. You'll remember it long after they've forgotten. And honestly? They remember more than people think. Our then-18-month-old is now 4 and still talks about 'the castle.' The seed is planted. The magic is real."}]},
]

body_universal = [
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "Why Universal's Height Requirements Are Different from Disney"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "If you're coming from Disney World to Universal Orlando, the first thing you'll notice is that Universal's height requirements aren't suggestions—they're enforced. Really enforced. At Disney, you might occasionally see a parent eyeballing their kid against a measuring stick. At Universal, every rider on every height-restricted ride gets measured. No exceptions. This is because Universal's thrill rides are in a different category from Disney's family attractions. The Hulk, Velocicoaster, and Rip Ride Rockit are legitimate roller coasters with forces that require a certain physical development. Your child will be measured in shoes. The official rule is measure-with-shoes-on, and they stick to it."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "Universal Studios Florida: Ride-by-Ride"}]},
    {"_type": "block", "style": "h3", "children": [{"_type": "span", "text": "No Height Requirement"}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "Despicable Me Minion Mayhem – 3D motion simulator. Gentle enough for anyone."}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "Transformers: The Ride-3D – Immersive 3D experience. Our 5-year-old was nervous but loved it."}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "E.T. Adventure – Classic dark ride. No height limit. Nostalgia for parents, novelty for kids."}]},
    {"_type": "block", "style": "h3", "children": [{"_type": "span", "text": "40+ Inches"}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "Revenge of the Mummy – Indoor roller coaster. No inversions, dark, fast. Our 40-inch kids handled it fine."}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "Harry Potter and the Escape from Gringotts – 3D roller coaster hybrid. 42\" minimum."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "Islands of Adventure: The Thrill Park"}]},
    {"_type": "block", "style": "h3", "children": [{"_type": "span", "text": "No Height Requirement"}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "The Amazing Adventures of Spider-Man – One of the best 3D rides ever built. No height limit. Pure magic."}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "Jurassic Park River Adventure – Gentle river rapids ride ending with an 85-foot drop. 42\" to ride."}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "Camp Jurassic – Kids play area. No height minimum."}]},
    {"_type": "block", "style": "h3", "children": [{"_type": "span", "text": "36-48 Inches"}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "Flight of the Hippogriff – Gentle family coaster in Hogsmeade. 36\" minimum."}]},
    {"_type": "block", "style": "normal", "listItem": "bullet", "children": [{"_type": "span", "text": "The Incredible Hulk Coaster – 44\" minimum for front row, 48\" for rows 3-7. Legitimately intense."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "Planning Around Height Restrictions with Kids"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Here's the honest truth: if your child is under 40 inches, Islands of Adventure will feel limited. Unlike Disney, where most major attractions have no height limit, Universal is genuinely thrill-focused. My advice: prioritize Universal Studios Florida for kids under 40 inches (more to do at that height), and Islands of Adventure for kids 44 inches and up. At 44 inches, the entire park opens up—the Hulk, Forbidden Journey, the Velocicoaster—all of it."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "What Happens at the Height Check"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "At every Universal ride with a height restriction, there's a measuring station before you board. If they're over, they get a wristband. If they're under, you get redirected to the non-rider exit. There's no negotiating. The rules are the rules and they're enforced consistently. This is actually a good thing—it means you can trust that every rider on the ride meets the physical requirements."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "The Bottom Line"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Universal Orlando isn't as forgiving as Disney World with height requirements. But for kids who ARE tall enough for the big rides, it's unforgettable. Our 46-inch 6-year-old rode Velocicoaster last summer and still talks about it as the best day of his life. For kids under 40 inches, focus on the simulator rides and save Universal for when they're a bit taller. The park isn't going anywhere."}]},
]

body_crowds = [
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "The Myth of the Empty Disney World"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Let me start with the honest truth: there is no bad time to go to Disney World, only better and worse times. Disney World in 2026 is going to be busy. Really busy. The parks are operating at capacity almost every single day, and the idea that you can find a 'secret empty day' is a fantasy. What you CAN do is minimize your time in lines, maximize your park time, and use the strategies that experienced Disney planners use to get the most out of every day. This guide is about the tactics that actually work—not the 'go on a Tuesday in January' advice you've read a hundred times, but the specific, actionable strategies for beating the crowds in real conditions."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "Rope Drop Is Non-Negotiable"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "If you do nothing else in this guide, do this: be at your park's entrance 30 minutes before it opens. Not 15 minutes. Not 'when the parking lots open.' 30 minutes before official park opening. This is called rope drop, and it's the closest thing to an empty Disney World that exists. During that first 30-60 minutes of operation, the parks are genuinely less crowded. We did rope drop at Magic Kingdom on a Tuesday in early March and walked onto Big Thunder Mountain Railroad twice in a row. At 9:30am, that same ride had a 45-minute wait."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "The Touring Plan That Works"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Forget the hour-by-hour touring plans. The Disney touring plan that actually works is much simpler: do your priority attraction first, use Genie+ strategically second, and save the afternoon for shows, meet-and-greets, and indoor attractions. Morning (Park Open – 12pm): rope drop your #1 priority ride, then #2, then #3. By 10am, most people are still finishing breakfast. By noon, you'll have done 3-4 major attractions. Midday (12pm – 4pm): indoor attractions with A/C, character meets in shade, lunch, or a pool break. Evening (4pm – Close): lines drop as families leave. From 5pm to close, you can often hit 2-3 major rides in the time it would take to do one at midday."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "Genie+: The Strategy That Actually Works"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Genie+ at $15-30 per person per day is expensive, but for families with kids who want to ride specific coasters, it's worth it. Genie+ gives you access to Lightning Lanes at most attractions. You can hold one Lightning Lane at a time. The key is booking your first Lightning Lane as early as possible—7:00am when the park opens via the app, even before you've left your hotel. Don't wait. The return windows for popular rides (like Seven Dwarfs Mine Train or Remy's Ratatouille Adventure) disappear within the first 30 minutes."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "The Best Days to Visit Each Park"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "If your dates are flexible: Magic Kingdom is least busy Thursday and Saturday. Epcot is Tuesday through Thursday. Hollywood Studios is weekday mornings. Animal Kingdom is weekday afternoons. This is based on historical crowd patterns—always check the crowd calendar for your specific dates—but it gives you a statistical edge."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "The One Strategy Most People Miss: Park Hopper"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "Park hopper is discussed as a luxury, but for crowd management it's a weapon. Start at your most crowded park (usually Magic Kingdom) at rope drop, do your priorities, then after 2pm, hop to a less-crowded park for the afternoon. You effectively split your day across two parks, spending less total time in any single high-crowd environment. With Disney's park reservation system, this requires more planning, but it's one of the most effective crowd-beating tools available."}]},
    {"_type": "block", "style": "h2", "children": [{"_type": "span", "text": "The Bottom Line"}]},
    {"_type": "block", "style": "normal", "children": [{"_type": "span", "text": "You can't eliminate Disney World crowds. But you can outsmart them. Rope drop, strategic Genie+ use, park hopping, and a touring plan that respects the natural rhythm of the park day will get you more ride time than 90% of visitors. The crowds are real, but so is the magic. Go early, stay late, and remember that the best Disney day is one where your family had fun together—not where they rode everything."}]},
]

posts = [
    {
        "slug": "best-magic-kingdom-rides-kids-under-40-inches",
        "title": "Best Magic Kingdom Rides for Kids Under 40 Inches",
        "excerpt": "Worried your little one is too short for the big rides? Here's the complete guide to every Magic Kingdom ride your kids CAN ride, from It's a Small World to the Magic Carpets of Aladdin.",
        "readTime": 8,
        "category": "disney-world",
        "tags": ["magic-kingdom", "kids", "height-requirements", "family", "rides"],
        "body": body_mk
    },
    {
        "slug": "disney-world-with-baby-toddler",
        "title": "Disney World with a Baby or Toddler: The Complete Guide",
        "excerpt": "Disney World with a baby or toddler? It's absolutely doable—and honestly, magical. Here's everything you need to know about strollers, naps, feeding, and maximizing the magic when your little one is under 3.",
        "readTime": 11,
        "category": "disney-world",
        "tags": ["baby", "toddler", "planning", "kids", "genie-plus", "stroller"],
        "body": body_baby
    },
    {
        "slug": "universal-orlando-height-requirements",
        "title": "Universal Orlando Height Requirements: Everything You Need to Know",
        "excerpt": "From the Hulk to Flight of the Hippogriff, here's the complete guide to Universal Orlando's height requirements, including which rides your kids can actually ride and how to plan around restrictions.",
        "readTime": 9,
        "category": "universal-orlando",
        "tags": ["universal", "height-requirements", "thrill-rides", "kids", "safety"],
        "body": body_universal
    },
    {
        "slug": "beat-disney-world-crowds",
        "title": "How to Beat Disney World Crowds in 2026",
        "excerpt": "Crowd calendars, rope drop strategy, and the touring plan that actually works. Here's how to experience Disney World without the lines.",
        "readTime": 10,
        "category": "disney-world",
        "tags": ["crowds", "strategy", "rope-drop", "touring-plan", "genie-plus"],
        "body": body_crowds
    },
]

print("\nCreating blog posts...")
for post in posts:
    cat_ref = cat_map.get(post["category"])
    if not cat_ref:
        print(f"  Skipping {post['title']} - no category ref for {post['category']}")
        continue

    doc = {
        "_type": "blogPost",
        "title": post["title"],
        "slug": {"_type": "slug", "current": post["slug"]},
        "excerpt": post["excerpt"],
        "body": post["body"],
        "readTime": post["readTime"],
        "publishedAt": "2026-03-31T00:00:00Z",
        "categories": [{"_type": "reference", "_ref": cat_ref}],
        "tags": post["tags"],
        "author": {"name": "Plan Your Park Team"}
    }

    result = sanity_mutate([{"create": doc}])
    print(f"  Created: {post['title']}")
    print(f"  Result: {json.dumps(result)[:200]}")

print("\nDone!")
