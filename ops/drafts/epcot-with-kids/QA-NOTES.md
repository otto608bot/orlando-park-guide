# QA notes: EPCOT with kids — rides by height (2026-10-26)
- Sanity: **`drafts.blogPost-epcot-with-kids-rides-by-height`**, NEW draft (rev `cO5UITnAMNJhRlGSJ0DOtb`, 63 blocks, hero asset `image-f3d685a21707866be3a22262dc032139111dc752-1376x768-png`). No published doc exists; nothing was published.
- ~1,630 body words (readTime 7). Category ref `q5bQv6QFqWcAZeLNacathw` (same as AK/MK posts). `publishedAt` unset.

## Demand (GSC, sc-domain planyourpark.com, read-only)
- EPCOT kid cluster, 28d 2026-09-27 → 2026-10-24 (90d 2026-07-27 → 10-24 identical): **20 queries, 52 impressions, 0 clicks, 0% CTR, impression-weighted avg position 39.9.** Ranking page today: /parks/epcot/.
- Target "epcot for kids": 16 impr, 0 clicks, pos 34.4. Others: "how may rides are at epcot" 7 (27.9), "epcot for preschoolers" 4 (43.2), "epcot size" 4 (30.2), "epcot playground" 2, "playground at epcot" 2, "epcot rides for 4 year old" 2 (43), "epcot rides for kids" 2 (54), "spaceship earth height requirement" 2 (18), plus 1-impression tails ("epcot with kids", "epcot rides by height", "best epcot rides for kids", "indoor playground epcot", "things to do at epcot for kids").
- The post answers each: playground section, ride count FAQ, Spaceship Earth height FAQ, 4-year-old FAQ.

## Heights and status (official = disneyworld.disney.go.com/attractions/epcot/<slug>/, accessed 2026-10-26; schedules from Disney's public finder schedule endpoint, every day 2026-10-26 → 2027-01-04)
| Attraction | Official height | Sanity `heightRequirement` | Status |
|---|---|---|---|
| Test Track | 40 in (102 cm) | 40 ✅ | Operating all dates |
| Guardians of the Galaxy: Cosmic Rewind | 42 in (107 cm) | 42 ✅ | Operating |
| Mission: SPACE | 40 in page facet; page: Orange more intense | Green 40 / Orange 44 ✅ | Operating |
| Soarin' Across America | 40 in (102 cm) | **no ride doc** | Operating (limited-time, America 250) |
| Soarin' Around the World | 40 in (102 cm) | 40 ✅ | **Closed** — page: "currently unavailable. Guests can now experience Soarin' Across America" |
| Living with the Land | Any | 0 ✅ | Operating except **Closed 2026-11-27 → 2026-12-30** (reopens 12-31 per schedule) |
| Frozen Ever After, Remy, Spaceship Earth, Seas with Nemo, Turtle Talk, Figment, Gran Fiesta, Short Film Festival | Any | 0 ✅ | Operating all dates |
| Journey of Water Inspired by Moana | Any | **no ride doc** | Operating |
| Awesome Planet, Canada Far and Wide, B&B Sing-Along, Kidcot, Bruce's Shark World, ImageWorks | Any | n/a (shows/play) | Operating |
| DuckTales World Showcase Adventure | Any | n/a | Page: "currently under refurbishment and may be available in a limited format" — not recommended |

**No height mismatches** between official pages and Sanity `heightRequirement`.

## Events (official, accessed 2026-10-26)
- Festival of the Holidays Nov 27 – Dec 30, 2026; Candlelight Processional nightly 4:45/6:30/8:00 PM; Goofy as Santa at The Odyssey daily Nov 27–Dec 30; Meet Santa at CommuniCore Hall "daily through December 24" — /entertainment/epcot/candlelight-processional/ (the /events-tours/epcot/festival-of-the-holidays/ page still shows "TBD").
- Food & Wine Aug 27 – Nov 21, 2026, included with admission; Remy's Ratatouille Hide & Squeak — /events-tours/epcot/epcot-international-food-and-wine-festival/.
- Rider Switch / First Aid: generic pointers to Disney's pages (same wording as the AK post, verified 2026-10-16).

## QA pass 1 (author: links, anchors, format) and pass 2 (independent: facts, policy, brand, disclosure)
- `qa.py`: **pass 1 0 fails, pass 2 0 fails** (`qa-output.txt`). All 20 internal links 200; Amazon links tagged `planyourpark-20` (503 to bots expected); anchors ≤60; disclosure before first affiliate link; 5 EPCOT ride-finder links + `/parks/` + `/parks/epcot/`; no first-person lore; no Genie+; heights dated; closures disclosed; no ticket ages/prices.
- Manual claim pass: removed unverifiable ride mechanics (trackless/3D Remy, Soarin' feet dangle, Test Track "outdoor lap"/design-your-own, "many adults find Orange rough"); ride descriptions now track Disney page wording.
- `content_integrity_check.analyze_post` on the draft: severity ok, 0 flags.
- `live_blog_qa.py`: not applicable until published.

## Open flags (not changed — report only)
1. Ride finder lists closed **Soarin' Around the World** as available on /rides/for/epcot-all/, epcot-under-40/, epcot-44/. No ride doc for **Soarin' Across America** or **Journey of Water**. See `RIDE-FINDER-FLAGS.md`.
2. **Living with the Land** closed Nov 27 – Dec 30, 2026 on the official schedule; ride finder will still show it then (it uses `isClosed`, not dated closures).
3. Hero is a text-only branded card (same style as the AK hero).
