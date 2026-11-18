# Ride data check: Sanity `heightRequirement` vs official Disney pages (2026-11-16)
Official source: `https://disneyworld.disney.go.com/attractions/<park>/<slug>/` (public HTML, accessed 2026-11-16; saved text in `official/`). Script: `compare_heights.py`. **Report only — no ride docs were changed.**

## Result: 0 height mismatches
All 56 published WDW ride docs that have an official page with a height line match the official minimum height (Any Height = 0). Full table: `ride-compare-2026-11-16.md`.

## Other data issues found (not fixed — need approval)
1. **Muppet\*Vision 3D (Hollywood Studios)** — Sanity: open, height 0, `isClosed` unset. Official: `/attractions/hollywood-studios/muppet-vision-3d/` now redirects to the park list, and it is not on Disney's Hollywood Studios list. Permanently closed: final public show June 7, 2025 (WDW News Today, Jun 8, 2025 — https://wdwnt.com/2025/06/video-final-muppetvision-3d-show-at-disneys-hollywood-studios/); theater is being converted for a Monsters, Inc. land. The ride finder (e.g. /rides/for/hollywood-studios-calm-under-40/) likely still lists it.
2. **Walt Disney World Railroad (Magic Kingdom) — pending draft is stale.** `drafts.r5PBb5Nahg2bY9oktfqOej` has `isClosed: true`, "temporarily closed Sep 28, 2026; expected to reopen Nov 2026 (checked Oct 19)". Official page on Nov 16 shows it **operating** on a modified route (Main Street ↔ Fantasyland shuttle only, skipping Frontierland, until the Magic Kingdom expansion is done). Publishing that draft would wrongly show it closed. Recommend discarding or rewriting the draft (published doc is open, height 0).
3. **Jungle Cruise** — published doc has no note. Official: "Jingle Cruise" holiday version operating (any height), Jungle Cruise returns early next year; Jungle Cruise page shows "No times available". Dated short change, so per the no-short-closure rule, no `isClosed`; post mentions it only.
4. **Rock 'n' Roller Coaster** — Sanity name is outdated; official name is "Rock 'n' Roller Coaster Starring The Muppets" (height 48 still correct).
5. **Walt Disney's Carousel of Progress** — Sanity: `isClosed`, reopens late spring 2027 (checked Oct 19). It is not on Disney's Magic Kingdom list on Nov 16 and the attraction page slug I tried 404s, so I could not re-verify the date today.
6. **Tiana's Bayou Adventure** — Sanity `isClosed` + note matches official (temporary refurb from Nov 2, expected to reopen December 2026). Already covered by the December revert routine.
7. **DINOSAUR, TriceraTop Spin, It's Tough to be a Bug!, Liberty Square Riverboat** — Sanity `isClosed`; none appear on Disney's current attraction lists (consistent).
8. **Official, no Sanity ride doc** (post covers them, ride finder does not): Casey Jr. Splash 'N' Soak Station (any height), Monsters, Inc. Laugh Floor (any), Walt Disney's Enchanted Tiki Room (any), The Hall of Presidents (any), A Pirate's Adventure (any), Jingle Cruise (holiday overlay), Zootopia: Better Zoogether! (any), Gorilla Falls / Maharajah Jungle Trek / Discovery Island Trails (any), Jumping Junction + Bluey's Wild World (Conservation Station), Wilderness Explorers, EPCOT DuckTales World Showcase Adventure (under refurbishment, limited format), ImageWorks, Bruce's Shark World, Kidcot Fun Stops, Hollywood Studios shows (Disney Jr. Mickey Mouse Clubhouse Live!, Frozen Sing-Along, The Little Mermaid musical, Beauty and the Beast Live on Stage, Vacation Fun, Walt Disney Presents).

## Official-page notes used in the post
- Soarin' Around the World: "currently unavailable"; Soarin' Across America (40 in) is the replacement. Sanity already has the Across America doc at 40.
- DuckTales World Showcase Adventure: "currently under refurbishment and may be available in a limited format."
