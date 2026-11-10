# LEGOLAND Florida: Sanity ride docs (`heightRequirement`) vs official (2026-11-09)
Sanity query: `*[_type=="ride" && park match "LEGOLAND*"]` → 12 docs (snapshot `sanity-legoland-rides-2026-11-09.json`). `height` field is null on all; compared `heightRequirement`.
Official: https://www.legoland.com/florida/plan-your-visit/know-before-you-go/attraction-height-restrictions/ + ride pages (accessed 2026-11-09; extract `official-legoland-extract-2026-11-09.txt`).

| Sanity doc | Sanity name | Sanity `heightRequirement` | Official | Result |
|---|---|---|---|---|
| 200HsSeCmp0rIIhq3n1hwQ | Lost Kingdom Adventure | 0 | **30 in** | ❌ MISMATCH |
| r5PBb5Nahg2bY9oktfrH4o | Beetle Bounce | 0 | **36 in** | ❌ MISMATCH |
| RLBxGAumPb4EPh1Y0BD12c | Boating School | 0 | Not on official list; official **Coast Guard Academy = 34 in** (same "captain your own boat" concept, likely renamed — unconfirmed) | ❌ MISMATCH / stale name |
| q5bQv6QFqWcAZeLNaYbW4i | Flying School | 44 | **Not listed** on official rides or height pages | ⚠️ UNVERIFIABLE (possibly removed). Drives `/rides/for/legoland-44/` |
| q5bQv6QFqWcAZeLNaYbnsf | Fairy Tale Brook | 0 | **Not listed** officially | ⚠️ UNVERIFIABLE (possibly removed) |
| q5bQv6QFqWcAZeLNaYblqr | DUPLO Express | 0 | DUPLO Train: no minimum (under 34 in rides w/ 48 in+ person) | ✅ value; stale name |
| q5bQv6QFqWcAZeLNaYbmc2 | Ford Driving School | 0 | Driving School: ages 6–13, no height | ✅ value; stale name |
| r5PBb5Nahg2bY9oktfrGtB | Ford Jr. Driving School | 0 | Jr. Driving School: ages 3–5 | ✅ value; stale name |
| 200HsSeCmp0rIIhq3n1i0D | LEGO NINJAGO The Ride | 0 | No minimum | ✅ |
| q5bQv6QFqWcAZeLNaYbo5F | Merlin's Challenge | 36 | 36 in | ✅ |
| q5bQv6QFqWcAZeLNaYbVfY | The Dragon | 40 | 40 in | ✅ |
| r5PBb5Nahg2bY9oktfr8z6 | Coastersaurus | 42 | 42 in | ✅ |

**Missing from Sanity entirely** (official, in the post): Galacticoaster 36, Kid Power Towers 30/38 (official pages conflict), Coast Guard Academy 34, Rescue Academy 34, Safari Trek 34, Royal Joust 36 (ages 4–12), Technicycle 36, Unikitty's Disco Drop 40, THE LEGO MOVIE Masters of Flight 40, The Great LEGO Race 42, Mia's Riding Adventure 48, AQUAZONE Wave Racers 52 (wording ambiguous), The Grand Carousel 0, DUPLO Tractor 0, Battle of Bricksburg 0 (closed), Pirate River Quest (closed).

**Official-page conflicts (flag to readers, done in post):** Kid Power Towers 30 in (chart) vs 38 in (ride page) → post says plan on 38. Lost Kingdom companion rule <42 (chart) vs 30–48 (ride page) → post uses ride page. Safari Trek companion <44/age 6 (chart) vs <48 (ride page) → post uses ride page. AQUAZONE "minimum 52" + "40–52 must be accompanied" → post tells readers to ask the ride host.

**Closures (official temporary-closures page, 2026-11-09):** Pirate River Quest (no date); Battle of Bricksburg (from 11/2, no end date); DUPLO Tractor + DUPLO Train 11/2–11/11; Technicycle 11/2–11/20; Imagination Zone 11/2–11/20; Water Park closed for the season. All disclosed in the post. Sanity `isClosed` is null on all 12 docs.

**Disney rides:** none recommended in this post, so Tiana's Bayou Adventure / Soarin' closure rechecks are N/A here.

**Not applied.** No ride docs were changed (not even as drafts). Impact: the LEGOLAND ride-finder pages the post links to show only 12 rides with the stale values above (e.g. Beetle Bounce/Lost Kingdom appear as "any height"; Flying School appears in the 44-inch list). Recommend a ride-data fix (drafts.* only) before or with publish.
