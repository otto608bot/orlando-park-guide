# QA notes: How to Book Disney World Character Dining (2026-11-02)
- Sanity: **`drafts.blogPost-how-to-book-disney-character-dining`**, NEW draft, 75 blocks, ~1,710 body words (readTime 7), category ref `q5bQv6QFqWcAZeLNacathw`, `publishedAt` unset. Hero asset `image-46eee22ac5b2219e2956cd40848104f19aae0550-1376x768-jpg`. Nothing published. (An earlier hero upload, `image-d6d36b16…-jpg`, is an unused orphan asset.)
- Also: **`drafts.blogPost-best-disney-world-character-dining-kids`** (draft patch of Post 1; see `../character-dining-kids-patch-2026-11-02/CHANGES.md`). Publish it only with or after the new post (it links to it).
- Cluster: Post 2 of `ops/drafts/briefs-2026-10-26/character-dining.md` ("How to Book Disney Dining Reservations (60-Day Window Explained)"). Post 1 covers picks/ages/prices; this one covers booking, so no duplicate.

## Demand
**GSC** (sc-domain:planyourpark.com, read-only; `ops/weekly/gsc-review-2026-11-02.txt`, `ops/weekly/gsc-character-dining-queries-2026-11-02.json`):
- Site, 28 days ending 2026-10-31: 13 clicks, 3,054 impressions, CTR 0.43%, avg position 18.1.
- Dining-related queries (filter: character, dining, breakfast, reservation, chef mickey, cinderella, ohana, toddler): only "character dining experiences near theme parks" → /character-dining/: **16 impressions, 0 clicks, pos 62.5** (2026-08-04 → 10-31); 5 impressions, pos 47 in the last 28 days.
- **0 impressions** so far for /blog/best-disney-world-character-dining-kids/. No booking/reservation/cancellation queries yet. GSC has no demand data for this topic, so autocomplete was used.

**Google autocomplete** (pulled 2026-11-02; shows demand exists, not volumes): "how to book character dining at disney world", "how to book disney dining 60 days out", "disney dining reservations 60 days / time / window / calculator / phone number / rules / cancellation policy / open time", "when can you book disney dining if staying on property", "how soon can you book disney dining", "disney dining cancellation policy 2026 / fee", "cinderella's royal table reservations / cancellation policy", "disney character dining reservations", "character breakfast disney world not in park".

## Official sources (accessed 2026-11-02)
- Advance reservations FAQ: https://disneyworld.disney.go.com/faq/reservation-window/advance-reservations/ (60 days; resort guests whole stay up to a 10-night stay; ~6:00 AM daily; party count regardless of age; admission required in-park; cancelled times released immediately). JS-rendered; read with headless Chrome.
- Cancellation FAQ: https://disneyworld.disney.go.com/faq/dining-reservations/restaurant-reservation-cancellation/ ($10/person within 2 hours or no-show; no modifications within 2 hours; Cinderella's Royal Table no modifications once confirmed, full cost/person unless cancelled ≥2 hours prior; (407) WDW-DINE).
- 12 character restaurant pages: meal periods + notices in `official-restaurant-extract-2026-11-02.txt`. **No restaurant shows a closure.** Notices: Grand Floridian renovations through early 2027 (1900 Park Fare); ʻOhana exterior maintenance may block lagoon views; Skyliner refurb Jan 24–30, 2027 (Topolino's, Cape May pages).

## Heights and status (official attraction pages vs Sanity `heightRequirement`, 2026-11-02)
| Ride | Official | Sanity | Status |
|---|---|---|---|
| Seven Dwarfs Mine Train | 38 in | 38 ✅ | Open |
| Tiana's Bayou Adventure | 40 in | 40 ✅ | **Closed for refurb from Nov 2, reopening expected Dec 2026** — disclosed, not recommended. Published doc isClosed null; draft `drafts.q5bQv6QFqWcAZeLNaYZj56` sets isClosed true (from earlier today). |
| Frozen Ever After | Any | 0 ✅ | Open |
| Star Tours | 40 in | 40 ✅ | Open |
| Toy Story Mania! | Any | 0 ✅ | Open |
| Kilimanjaro Safaris | Any | 0 ✅ | Open |
**No height mismatches.**

## QA
- `qa.py` → `qa-output.txt`: **pass 1: 0 fails, pass 2: 0 fails** (79 checks). All links 200 (internal + Disney); anchors ≤60; disclosure before first affiliate link (/deals/); 4 ride-finder links + /rides/ + /parks/; hub + Post 1 linked; no Genie+/Lightning Lane; heights and closure dated; fee/window wording matches the FAQs; meal times match the official extract.
- Lore check: reader-voice FAQ questions ("Do I need…?") are excluded; no first-person anecdotes in the body.
- Manual claim pass fixed: "same pavilion as Akershus" → "in World Showcase like Akershus" (Disney only lists World Showcase); phone line reworded (Disney says book dining online; WDW-DINE is "for additional assistance"); "Orlando time" → "Disney World is on Eastern time".
- Deliberately NOT claimed (not on today's official pages): Cinderella's Royal Table prepayment; "no tickets needed to book".
- `content_integrity_check.analyze_post` on the draft: severity ok, 0 flags.
- `live_blog_qa.py`: not applicable until published.

## Hero
- No image generator/API key was available in this run. Hero is a 1376×768 crop of the existing original photo-style image `/workspace/character-dining-square-photo-style-2026-10-26.png` (original lavender mouse character, no logos/text/real likenesses), upscaled ~1.27×. That image also sits in Post 1's social pack folder. Swap for a fresh generation if the CEO prefers unique art.
