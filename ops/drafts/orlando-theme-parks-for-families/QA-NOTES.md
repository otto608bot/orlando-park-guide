# QA notes: Orlando Theme Parks for Families: Best Rides by Height 2026 (2026-11-16)
- Sanity: **`drafts.blogPost-orlando-theme-parks-for-families`**, NEW draft (createOrReplace on drafts.* only), 96 blocks, ~2,060 words (readTime 9), category General (`q5bQv6QFqWcAZeLNacatoE`), `publishedAt` unset, **no heroImage** (phase 2). Nothing published. No published doc with this slug exists.
- Sanity-draft-only: the post is not on a Netlify deploy preview until published (preview builds from published content). The PR only changes ops/ files.
- Brief + demand: `brief.md`, `demand-2026-11-16.md`. Official extract: `official-extract-2026-11-16.txt` (raw page text in `raw/`; full HTML kept off-repo in `/workspace/pyp-raw-2026-11-16/`). Heights vs Sanity: `HEIGHT-MISMATCHES.md`. Other ride-data/closure flags: `RIDE-FINDER-FLAGS.md`.
- Universal's site is bot-walled for curl/WebFetch; its height and park-hours pages were read with headless Chrome (`cdp_text.py`).

## QA pass 1 (author: links, anchors, format, SEO) and pass 2 (independent: facts vs official extract, closures, dates, disclosure, lore)
- `qa.py` → `qa-output.txt`: **pass 1: 0 fails · pass 2: 0 fails (148 checks)**. All internal/affiliate links 200 (Universal height page verified via headless Chrome); anchors ≤ 60 chars; no empty headings/list items; title 59 chars; excerpt 170; disclosure before first affiliate link; 4 affiliate URLs match `web/src/config/affiliate-links.ts` (mislabeled Epic link 12834895 not used); 12 ride-finder links; `/parks/` linked 3×; all 9 park pages linked; every height, closure and holiday date matches the official extract; no prices; no first-person lore; no Genie+/Lightning Lane.
- `content_integrity_check.analyze_post` → `integrity-output.txt`: severity ok, 0 flags.
- `live_blog_qa.py`: not applicable until published (rendered-site QA required after deploy per ops/content-qa.md).

## Manual claim pass (pass 2) — removed or reworded because unverifiable
- "LEGOLAND built for kids roughly 2 to 12" → "built for younger kids" (no age mapping).
- Peppa Pig Theme Park "next door, aimed at preschoolers" → just named (LEGOLAND site lists its hours).
- "holiday decor included with regular admission at most parks" → removed; kept only verified "included" claims (Universal parade, LEGOLAND Bricktacular).
- Jollywood Nights "separately ticketed" → "holiday night event on select nights" (Disney event page didn't render; holidays page doesn't say).
- "almost everything opens up at Disney at 40" → "most Disney rides"; "48 inches: every park fair game" → corrected (VelociCoaster 51, Mako 54).
- "Holiday weeks are popular", "many families use", "kids tire faster than adults expect" → removed.
- Living with the Land described exactly as Disney's alert (Glimmering Greenhouses offered Nov 27–Dec 30; regular version unavailable).
- SeaWorld Sesame Street rides with no posted height (Sunny Day Carousel etc.) not named with a height; Abby's Flower Tower and Infinity Falls listed as closed.
- Dropped The Barnstormer (attraction page couldn't be fetched to check closure alerts).
- Kept, warm/subjective (on-brand): "Your kids will love seeing the parks all lit up."

## Closures checked for every recommended ride (official pages, 2026-11-16)
- Disney attraction pages (alert banners): none on Peter Pan's Flight, Dumbo, Seven Dwarfs, Big Thunder, Frozen Ever After, Remy's, Test Track, Toy Story Mania!, Runaway Railway, Alien Swirling Saucers, Slinky Dog Dash, Millennium Falcon, Kilimanjaro Safaris, Na'vi River Journey, Kali River Rapids, Flight of Passage. Tiana's Bayou Adventure: refurb from Nov 2, reopening expected December 2026 (post says closed). Living with the Land: Glimmering Greenhouses Nov 27–Dec 30.
- Universal park-hours "Temporary Closures": Jurassic Park River Adventure to Dec 16; Monsters Unchained Dec 11–15 (both disclosed). No listed closures for the other Universal rides named.
- SeaWorld rides page: Infinity Falls, Abby's Flower Tower (annual maintenance), Sky Tower (temporarily closed) disclosed; named rides show no closure tag.
- LEGOLAND closures page: NINJAGO + The Dragon 11/30–12/18, Pirate River Quest, Battle of Bricksburg, DUPLO Tractor, Kid Power Towers disclosed. Lost Kingdom, Galacticoaster, Coastersaurus not listed as closed.

## Open issues
1. **Hero + social images:** phase 2 (parent generates). Prompts + target paths: `ops/buffer/orlando-theme-parks-for-families-2026-11/image-prompts.md`.
2. **Ride data (Sanity, not changed):** 2 height mismatches, 4 null heights, ~9 missing ride docs, stale closures — see `HEIGHT-MISMATCHES.md` and `RIDE-FINDER-FLAGS.md`. Epic Universe ride-finder pages linked from the post may display the null/mismatched heights until fixed.
3. **Live LEGOLAND post (PR #77) is out of date** on closures (Kid Power Towers, NINJAGO, The Dragon, DUPLO Tractor) — see `RIDE-FINDER-FLAGS.md`.
4. Cannibalization watch vs `/parks/` (see brief).
