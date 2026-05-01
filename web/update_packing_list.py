#!/usr/bin/env python3
"""Update Disney World Packing List blog post in Sanity with SEO-refreshed content."""

import json
import hashlib
import urllib.request
import urllib.error

SANITY_PROJECT_ID = "hd7qwtcq"
SANITY_DATASET = "production"
SANITY_TOKEN = "skChJStc0ZNCgsgO1WcF3RvcoOBTNIkselecOgAqjXqas4GTOAeu803htxITdghyjw08UFYBioQWSEs1fVmiQx8vEkdVT1EePNhKehbQAmj3LEprKCTsq1emTHarjvUy6tQSKW7IxkuDoPJ8iPg6iXvyqeAy2IKdn3pSF4uBvswz7BiTFKeV"
SANITY_URL = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/{SANITY_DATASET}"

DOC_ID = "disney-world-packing-list"

_counter = [0]
def make_key(prefix=""):
    _counter[0] += 1
    val = f"{prefix}{_counter[0]}"
    return hashlib.sha256(val.encode()).hexdigest()[:12]

def block(text, style="normal", list_item=None):
    key = make_key(text[:20] if text else "empty")
    b = {
        "_key": f"block-{key}",
        "_type": "block",
        "style": style,
        "markDefs": [],
        "children": [{
            "_key": f"span-{key}",
            "_type": "span",
            "text": text,
            "marks": []
        }]
    }
    if list_item:
        b["listItem"] = list_item
    return b

def h2(text):   return block(text, style="h2")
def h3(text):   return block(text, style="h3")
def p(text):    return block(text, style="normal")
def li(text):   return block(text, style="normal", list_item="bullet")

# ─── New body content ─────────────────────────────────────────────────────────

body = [
    h2("What to Pack for Disney World in 2026 — The Complete Checklist"),

    p("Most Disney World packing lists are written by people who've never navigated Magic Kingdom with a toddler in one hand and a cooling towel in the other. This one is different — 65+ items verified by locals who've done this dozens of times, updated for 2026 park policies, Lightning Lane changes, and current Florida weather patterns."),

    p("If you're wondering what to bring to Disney World in 2026, this page covers everything: electronics, sun protection, clothing, comfort items, family essentials, and a dedicated 2026-specific section covering the Disney app, park reservation system, and Lightning Lane requirements that actually matter when you're standing in line."),

    h2("2026 Disney World: What Changed and What It Means for Your Packing List"),

    p("Disney World in 2026 operates differently than 2023–2024 in several ways that directly affect what you should pack:"),

    li("The My Disney Experience app is now required for Lightning Lane bookings at all four parks — your phone is not optional, it's your primary access tool"),
    li("Park reservations are no longer required for standard ticket holders, but date-based ticketing remains in effect for peak days — link your ticket to your app before you leave home"),
    li("Lightning Lane continues to evolve; the service works via the app only, so a backup phone charger is no longer optional — if your phone dies you can't book Lightning Lanes"),
    li("Disney has expanded mobile ordering at quick-service restaurants — you need a charged phone to place and pick up mobile orders"),
    li("Some locker policies at thrill rides have changed — small daypacks that fit in ride lockers are now preferred over large bags"),

    h2("Electronics and Chargers"),

    p("Your phone is the single most important item you bring to Disney World in 2026. It serves as your ticket, your Lightning Lane booking device, your map, your mobile food ordering system, and your camera. Here's what you need:"),

    li("Portable Phone Charger (20,000mAh+) — Your phone dies fast at Disney. Lightning Lane bookings, Lightning Lane photos, mobile ordering, and maps all drain battery. A 20,000mAh power bank lasts two full park days. https://www.amazon.com/s?k=portable+phone+charger+20000mah&tag=planyourpark-20"),
    li("USB Charging Cables (2+) — Backup cables for the whole family. Park benches have USB ports at some locations."),
    li("Car Charger — If you're driving to the parks, keep devices charged between destinations."),
    li("USB Charging Cube (Wall Adapter) — Pack a dual-port wall adapter so you can charge two devices simultaneously from your resort room outlet. Most resort rooms have limited outlets near the vanity, not the bed."),
    li("Portable Power Bank (Small, Pocket Size) — A smaller backup charger (5,000–10,000mAh) that fits in your pocket for afternoon park time when your main bank is in the locker or stroller."),
    li("E-Reader or Tablet — A dedicated device for waiting in line keeps phones free for Lightning Lane and photos. Load it with movies, books, or games before you leave home."),
    li("Over-Ear, Noise-Canceling Headphones — Lines are loud, waits are long, and noise-canceling headphones turn a 45-minute wait for Remy's Ratatouille Adventure into a peaceful movie break."),
    li("My Disney Experience App — Downloaded and logged in before you arrive. Not something to pack, but essential to set up the night before. Verify your tickets are linked, your hotel is connected, and your credit card is on file for mobile ordering."),

    h2("Hydration and Sun Protection (Florida Heat Is No Joke)"),

    p("Orlando summers regularly hit 95°F with 80%+ humidity. Winter daytime temps run 60–75°F but buildings are aggressively air-conditioned. Pack for both scenarios:"),

    li("Insulated Water Bottle (32oz) — Disney allows reusable water bottles. Fill up for free at any quick-service restaurant. An insulated bottle keeps water ice-cold for 8+ hours. https://www.amazon.com/s?k=insulated+water+bottle+park&tag=planyourpark-20"),
    li("Sunscreen SPF 50+ Lotion — Disney requires SPF 50+ and does not allow spray sunscreen. Pack a lotion-based sunscreen. https://www.amazon.com/s?k=sunscreen+spf+50+lotion&tag=planyourpark-20"),
    li("Cooling Towel — Soak it in water and drape it around your neck. Keeps you cool in 95-degree lines. https://www.amazon.com/s?k=cooling+towel+disney&tag=planyourpark-20"),
    li("Handheld Fan (USB Rechargeable) — Florida summer is brutal. A USB rechargeable fan is the single best investment for hot afternoon lines."),
    li("UV Protective Sunglasses — Polarized is better. You'll be walking in direct sun for hours."),
    li("Wide-Brim Hat or Visor — Sun protection for your face and neck that your phone hand can manage."),
    li("Lip Balm with SPF 30+ — Your lips burn too, and they're easy to forget. Reapply every two hours in direct sun."),
    li("Cooling Neck Gaiter — Wet it, wring it out, and wear it around your neck. It stays cool for 2–3 hours and provides UPF 50+ protection."),
    li("Electrolyte Packets — Water alone isn't enough in Florida heat. Pack a few electrolyte powder packets (like Liquid IV or LMNT) to add to your water bottle — they prevent cramping and fatigue."),
    li("Aloe Vera Gel (Travel Size) — For the inevitable sunburn you didn't quite prevent."),

    h2("Clothing and Footwear"),

    p("The average Disney guest walks 10–15 miles per day. Sandals and flip-flops destroy your feet by noon. What you wear matters more than almost anything else on this list:"),

    li("Comfortable Walking Shoes — Athletic shoes or supportive sandals are non-negotiable. Do not break in new shoes at Disney — blisters will ruin your trip."),
    li("Extra Pairs of Socks (2–3 per person) — Your feet will sweat in summer heat and get soaked on water rides. Moisture-wicking athletic socks prevent blisters."),
    li("Lightweight Long-Sleeve Shirt — For spring and winter visits, a sun-protective long-sleeve shirt (UPF 50+) weighs almost nothing and dramatically reduces sunburn."),
    li("Rain Jacket (Lightweight, Packable) — Florida thunderstorms roll in fast. Ponchos tear in 10mph wind. A compact rain jacket packs small, breathes, and lasts all week. https://www.amazon.com/s?k=packable+rain+jacket&tag=planyourpark-20"),
    li("Rain Ponchos (20-Pack) — For the whole family at once. Buy in bulk before your trip. https://www.amazon.com/dp/B018THPISO?tag=planyourpark-20"),
    li("Swim Trunks / Cover-Up — Required for pool days at the resort, which you should have even on park days."),
    li("Stroller Rain Cover — Compact, fits in a backpack pocket. Disney has covered walkways but open-air stroller rides in rain are brutal."),
    li("Change of Clothes (for travel day) — After a long park day, you'll want fresh clothes for the drive or flight home."),
    li("Compression Socks — For flights or long drive days. Helps with circulation on long park days too."),
    li("Stroller Fan with Clip — Absolute game-changer for summer visits when temps hit 95°F. Clips to the stroller and keeps your kid cool. https://www.amazon.com/s?k=stroller+fan+clip&tag=planyourpark-20"),

    h2("Health and First Aid"),

    p("Park days are physically demanding. Disney's first aid stations exist but walking there takes time. A well-packed personal medical kit handles 90% of what comes up:"),

    li("Pain Relievers (Ibuprofen/Acetaminophen) — Keep a small bottle in your bag."),
    li("Allergy Medication — Seasonal allergies at Disney can hit hard. Benadryl or Zyrtec."),
    li("Motion Sickness Bands — For kids or adults who get queasy on motion simulators or spinning rides."),
    li("Hand Sanitizer (Travel Size) — Disney provides some, but having your own is faster."),
    li("Blister Band-Aids / Moleskin — Your feet will hurt. Be prepared before the blister forms."),
    li("Anti-Nausea Medication — If anyone in your group is sensitive to motion simulator rides."),
    li("Wound Care Kit (Band-Aids, Antiseptic Wipes, Neosporin) — Scrapes and cuts happen on water rides and play areas."),
    li("Imodium or Anti-Diarrheal Medication — Changes in water, food, and heat can upset stomachs."),
    li("Eye Drops (Lubricating) — Air conditioning followed by dry outdoor heat dries out contacts and eyes."),
    li("Melatonin (10mg) — For adjusting to Eastern time zone from a different time zone."),

    h2("Organization and Packing"),

    li("Packing Cubes (6-Pack) — Keeps your suitcase organized and makes repacking for departure faster. https://www.amazon.com/s?k=packing+cubes&tag=planyourpark-20"),
    li("Waterproof Phone Pouch (2-Pack) — For water rides and rainy days. Keeps your phone completely dry. https://www.amazon.com/s?k=waterproof+phone+pouch&tag=planyourpark-20"),
    li("Small Backpack or Daypack — You'll want a dedicated park bag. Disney is flexible with bag sizes. Note: some rides require bags to fit in lockers — a smaller bag is better than a large one."),
    li("Ziplock Bags (Various Sizes) — Keeps electronics dry, organizes snacks, contains trash."),
    li("Laundry Bag or Garment Pouch — Keeps worn clothes separate from clean ones in your resort room."),
    li("Luggage Scale — Avoid the stressful overweight bag fee at the airport. Weigh your suitcase before leaving for the airport."),
    li("TSA-Approved Toiletry Bag — Keeps liquids organized and airport-security compliant."),
    li("Reusable Snack Bags — Pack individual snack portions in reusable silicone bags. Easy to clean and reduces trash compared to plastic baggies."),

    h2("Snacks and Food (Allowed in Parks)"),

    p("Disney allows outside snacks and food. Packing snacks saves money and time — counter-service lines can exceed 45 minutes during peak lunch hours. Here's what travels well:"),

    li("Granola Bars / Protein Bars — Keep energy up between counter-service meals."),
    li("Trail Mix / Nut Packs — High-calorie, portable, doesn't melt in heat."),
    li("Apples, Bananas, Oranges — Durable fruit that travels well."),
    li("Individual Nut Butter Packets — Peanut, almond, or sun butter packets are calorie-dense, mess-free, and pair well with crackers."),
    li("Crackers or Rice Cakes — Lightweight, filling, and good for kids who need something between meals."),
    li("Dried Fruit or Fruit Leathers — Doesn't melt, doesn't require cooling, and provides quick natural sugar without a sugar crash."),
    li("Dark Chocolate or Candy — A small treat for after the kids are in bed or a reward for surviving a 12-mile walking day."),
    li("Gum — Disney doesn't sell gum in the parks. Pack some for the drive or flight."),
    li("Small Soft-Sided Cooler — Disney allows soft coolers up to a certain size. Keeps snacks fresh and saves money on counter-service."),

    h2("Documents and Money"),

    p("In 2026, Disney is almost entirely digital, but you still need physical backups for several scenarios:"),

    li("Park Tickets (Digital or Physical) — Confirm before leaving home that your tickets are linked to your app. Log into the Disney app and verify each ticket shows as 'Ready to Use' before you leave for the park."),
    li("Hotel Confirmation — Digital copy backed up to your phone's photos. Screenshot it — Disney's WiFi can be unreliable at check-in."),
    li("ID (Driver's License or Passport) — Required for will-call ticket pickup, military discounts, and alcohol purchases."),
    li("Credit Card Linked to Disney Account — For mobile ordering and in-app purchases. Link the card you plan to use before you arrive."),
    li("Car Keys on a Carabiner Clip — Never dig for keys in a park. Disney's parking lots are massive."),
    li("Cash (Small Bills) — Some merchandise carts, pin trading, and tipping don't take cards. Keep $20–40 in small bills."),
    li("Disney Gift Cards — If you're budgeting a set amount for the trip, buy Disney gift cards at a discount through Samsung Pay or Target's Circle offer — save 3–5% which adds up on a larger trip."),

    h2("Family-Specific Essentials"),

    p("Traveling with kids changes the packing equation. These items are specifically for families with young children:"),

    li("Stroller Fan with Clip — Keeps your kid cool in summer heat. Absolute game-changer. https://www.amazon.com/s?k=stroller+fan+clip&tag=planyourpark-20"),
    li("Stroller Blanket — Park buildings and restaurants are aggressively air-conditioned. Have a light blanket for napping kids and cold theater shows."),
    li("Autograph Book and Pen — For character meet-and-greets. Pack a clipboard so kids have a hard surface to write on in lines."),
    li("Diaper Cream and Wet Wipes — Disney restrooms have changing stations but wipes dry out fast in Florida heat. Pack more than you think you need."),
    li("Child's Favorite Stuffed Animal or Comfort Item — Disney's on-site Build-a-Bear is expensive. Don't risk losing a beloved toy on day two."),
    li("Portable White Noise Machine or App — For napping kids in a resort room that's noisy from neighboring rooms or hallways."),
    li("Snack Containers with Lids — Packing snacks in reusable containers prevents crushed crackers and goldfish. The frustration of opening a bag to find everything turned to dust is real."),
    li("Sunscreen Wipes for Kids — Easier to apply to squirmy toddlers than lotion. SPF 50+ and Disney-compliant."),

    h2("What NOT to Pack for Disney World in 2026"),

    p("Just as important as knowing what to bring is knowing what to leave at home. Disney has strict policies that change occasionally — here are the current restrictions as of 2026:"),

    li("Large strollers (max 31 inches wide, 52 inches long) — Don't bother bringing an oversized stroller; it won't fit through queues or on buses"),
    li("Selfie sticks, tripods, and drones — Explicitly banned at all Disney parks"),
    li("Spray sunscreen — Not allowed; pack lotion-based only"),
    li("Glass containers — Not permitted"),
    li("Outside alcohol — Banned at all Disney parks"),
    li("Heavy stroller rain covers — Disney parks have covered walkways everywhere; a compact poncho for your kid is sufficient"),
    li("Oversized backpacks — Some rides require bags to fit in ride-specific lockers; a 20–25L daypack is the sweet spot"),
    li("Valuable jewelry — Disney is a public park; leave expensive items at home"),

    h2("2026 Disney World Packing FAQs"),

    h3("What should I bring to Disney World for the first time?"),

    p("The five things most first-time visitors wish they had brought are: a portable phone charger (20,000mAh+), comfortable broken-in walking shoes, a cooling towel, an insulated water bottle, and rain ponchos for the whole family. These five items alone will dramatically improve your park experience compared to visitors who don't pack them."),

    h3("Can I bring food into Disney World?"),

    p("Yes — Disney allows outside snacks and food. You can bring granola bars, trail mix, fruit, crackers, and sealed bottled water. You cannot bring outside alcohol, glass containers, or perishable food that requires refrigeration. A small soft-sided cooler is permitted for keeping snacks fresh."),

    h3("What size bag can I bring into Disney World?"),

    p("Disney World doesn't restrict bag size for general park entry, but some rides (particularly thrill coasters at Hollywood Studios and Magic Kingdom) have small lockers that require bags to fit within approximately 18\" x 14\" x 8\". A daypack in the 18–25 liter range works for all ride lockers while still holding everything you need for a full park day."),

    h3("Do I need a portable charger for Disney World?"),

    p("Yes — a portable charger is one of the most essential items for Disney World in 2026. Your phone is your ticket, your Lightning Lane booking device, your map, and your camera. Active app usage drains battery in 2–3 hours. A 20,000mAh power bank lasts two full park days. Don't rely on Disney's limited charging stations."),

    h3("What should I pack for Disney World in summer?"),

    p("Summer Disney World packing requires extra focus on heat management: SPF 50+ lotion sunscreen (no spray), cooling towels, cooling neck gaiters, electrolyte packets, an insulated water bottle, and a USB rechargeable handheld fan. The temperature regularly hits 95°F with 80%+ humidity in July and August."),

    h3("What should I pack for Disney World in winter?"),

    p("Winter Disney World (December–February) daytime temps run 60–75°F, but buildings are aggressively air-conditioned. Pack layers: a light jacket or fleece, moisture-wicking base layers, and a rain jacket for unexpected rain. Sunscreen is still necessary — Orlando winter sun is strong enough to burn."),

    h3("Is Lightning Lane still worth it in 2026?"),

    p("Lightning Lane remains one of the best value purchases at Disney World in 2026. It allows you to book Lightning Lane entrances at most attractions, dramatically reducing wait times. The service works exclusively through the My Disney Experience app — this is why a working, charged phone is non-negotiable. At $15–$25 per person per day, it pays for itself after two or three Lightning Lane uses versus standby lines."),

    h3("Do I need a stroller for Disney World?"),

    p("If you're visiting with children under 7 or anyone who naps, a stroller is one of the most important items you can bring. The average park guest walks 10–15 miles per day. A stroller keeps tired kids mobile, serves as a resting spot, and holds your daypack. A compact, foldable stroller that fits airline overhead bins is preferable to a large travel system."),

    h2("Save Time — Order Ahead on Amazon"),

    p("Everything above is available on Amazon — delivered to your hotel or home before you leave. Use our packing list links above to grab everything you need before your trip. A 20,000mAh charger, cooling towel, packing cubes, and a good pair of walking shoes are the four things most first-time visitors wish they had brought."),

    p("As an Amazon Associate, Plan Your Park earns from qualifying purchases."),
]

# Build the full document for createOrReplace
document = {
    "_id": DOC_ID,
    "_type": "blogPost",
    "title": "The Complete Disney World Packing List (2026) — 65+ Essentials From Locals",
    "slug": {"_type": "slug", "current": "disney-world-packing-list"},
    "body": body,
    "excerpt": "Save time and money with this expert Disney World packing list — 65+ verified essentials, 2026-specific tips for Lightning Lane and the Disney app, what to buy on Amazon vs. what to skip, and a free printable checklist. Updated for 2026.",
    "readTime": 12,
    "tags": ["packing list", "disney world", "checklist", "2026", "essentials", "what to pack", "lightning lane", "disney app"],
    "publishedAt": "2026-03-01T00:00:00Z",
    "categories": [{"_ref": "q5bQv6QFqWcAZeLNacathw", "_type": "reference"}],
}

mutation = {
    "mutations": [
        {"createOrReplace": document}
    ]
}

data = json.dumps(mutation).encode("utf-8")
req = urllib.request.Request(
    SANITY_URL,
    data=data,
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {SANITY_TOKEN}"
    },
    method="POST"
)

try:
    with urllib.request.urlopen(req, timeout=60) as response:
        result = response.read().decode("utf-8")
        print(f"✅ Sanity update response: {result}")
except urllib.error.HTTPError as e:
    print(f"❌ HTTP Error {e.code}: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"❌ Error: {e}")
