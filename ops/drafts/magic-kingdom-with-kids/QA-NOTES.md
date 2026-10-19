# QA notes: Magic Kingdom with kids — rides by height (2026-10-19)
- Sanity: **`drafts.blogPost-magic-kingdom-with-kids-rides-by-height`**, a NEW draft (rev `mhyEdxiDDd35ke8IQPcgCf`, 61 blocks). Hero asset `image-ab9faa7e5b614b24d5910fe033c302dba5464e75-1376x768-png`.
- No published doc exists, and nothing was published.
- Body is about 1,346 words.
- Targets (GSC 2026-09-20 → 2026-10-17): "magic kingdom with kids" (29 impr / 0 clicks / pos 34.2), "magic kingdom rides for kids" (21 impr / 0 clicks / pos 41.7); related "magic kingdom kids rides" 2 impr. Cluster ≈ 50 impr / 0 clicks.
- Complementary live post (linked, not duplicated): https://planyourpark.com/blog/best-magic-kingdom-rides-kids-under-40-inches/ (99 impr / 1 click / pos 6.2).
- Park page signal: /parks/magic-kingdom/ 54 impr / 0 clicks / pos 37.0.

## Heights and status (official = disneyworld.disney.go.com attraction pages, accessed 2026-10-19)
| Attraction | Requirement | Official URL |
|---|---|---|
| Tomorrowland Speedway | 32 in (81 cm) with 54 in (137 cm) companion; 54 in alone | /attractions/magic-kingdom/tomorrowland-speedway/ |
| The Barnstormer | 35 in (89 cm) | /attractions/magic-kingdom/barnstormer-starring-great-goofini/ |
| Seven Dwarfs Mine Train | 38 in (97 cm) | /attractions/magic-kingdom/seven-dwarfs-mine-train/ |
| Big Thunder Mountain Railroad | 38 in (97 cm) | /attractions/magic-kingdom/big-thunder-mountain-railroad/ |
| Tiana's Bayou Adventure | 40 in (102 cm); refurb Nov 2 → expected reopen Dec 2026 | /attractions/magic-kingdom/tianas-bayou-adventure/ |
| Space Mountain | 44 in (112 cm) | /attractions/magic-kingdom/space-mountain/ |
| TRON Lightcycle / Run | 48 in (122 cm) | /attractions/magic-kingdom/tron-lightcycle-run/ |
| Dumbo, small world, Pirates, Haunted Mansion (sample any-height) | Any Height | respective /attractions/magic-kingdom/… pages |

## Other policies cited
- Rider Switch: mentioned with pointer to Disney's Rider Switch page (rules not restated beyond the common pattern).
- First Aid in every WDW theme park: mentioned; aligns with Disney guest-services First Aid page pattern used in AK post.
- **Ticket ages: NOT asserted.** Post says check Disney's official ticket page.

## Data mismatch flag (ride finder / local DB)
- Local `data/rides.js` still lists Big Thunder at **40**. Official Disney page (accessed 2026-10-19) lists **38**.
- Sanity ride doc for Big Thunder (`UzjbPEJ4gI65TQn8dT70ny`) has `height: null` today.
- **Publish flag:** correct Big Thunder to 38 in ride data / Sanity rides before or with this post so the finder matches the article. Out of scope for this blog-only PR unless CEO asks.

## QA pass 1 (author) and pass 2 (independent)
- `qa.py`: **0 fails** (see `qa-output.txt`).
  - Internal links return 200; Amazon search links 503 to bots (expected) with `tag=planyourpark-20`.
  - Anchors ≤60; disclosure before first affiliate link.
  - Ride-finder MK landings (under-40, 44, 48, 52, calm-under-40, all) + `/parks/` + `/parks/magic-kingdom/` + under-40 complementary post + Disney vs Universal + `/deals/` + `/rides/`.
  - No first-person lore; no Genie+.
  - Heights match the table; Tiana refurb dated; heat line points to First Aid.
- `live_blog_qa.py`: not applicable until published.

## Open flags before publish
1. **Big Thunder height in ride finder / `rides.js` / Sanity ride** — update to 38" to match official (see above).
2. **Tiana's Bayou Adventure refurb** — re-verify open status on Disney's page at publish time (Nov 2–Dec 2026 window).
3. **Hero:** text-only branded graphic (no people, no Disney logos), same approach as AK. Confirm acceptable per HERMES.md.
4. `publishedAt` unset (set at publish).
5. Social pack is DRAFT only under `ops/buffer/magic-kingdom-with-kids-2026-10/` — never queued.

## CEO second review (2026-10-19)
- Big Thunder **38"** confirmed on Disney's official page (facet "38\" (97 cm) or Taller" and safety text "minimum height requirement of 38 inches"). The Sanity ride field the site uses is `heightRequirement` (was **40**, not null; `height` is an unused field). Saved draft `drafts.UzjbPEJ4gI65TQn8dT70ny` with heightRequirement 38. `data/rides.js` fixed in a separate ceo/ PR (not used by the web build).
- New closure found: **Walt Disney World Railroad** closed since Sep 28, 2026, expected back November 2026. **Carousel of Progress** closed Jul 6, 2026 to late spring 2027. Post now has a "Closures to Check Before You Go" section; railroad no longer recommended as a current seated break. Ride drafts saved with isClosed + closureNote: `drafts.r5PBb5Nahg2bY9oktfqOej`, `drafts.q5bQv6QFqWcAZeLNaYZkeb`.
- Tiana's refurb (Nov 2 to expected Dec 2026) confirmed on official page.
- Hero fixed: 32-40" row text ran past the card edge; now auto-fits. New asset `image-b593ecffa898bec88d0b9a66e33ebf46db531950-1376x768-png` attached to the draft.
- Excerpt (meta description) cut from 181 to 159 characters. Added official links for Tiana's, Rider Switch, First Aid, and the MK attraction list. Softened "longest list" claim; TRON speed claim now attributed to Disney.
- Consistency fixes in other posts (drafts only): under-40 MK post (Big Thunder 40 -> 38) and baby/toddler draft (Tiana's 38 -> 40).
