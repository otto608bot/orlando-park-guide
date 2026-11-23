# QA notes: universal-orlando-parks-with-kids (2026-11-23)

## Results
- **Pass 1 (author: links, anchors, format, SEO, disclosure, brand) + Pass 2 (independent facts vs saved official Universal pages):** `python3 qa.py` → **157 checks, 0 fails** (`qa-output.txt`). All 24 unique links return 200 (Amazon allowed 503); every anchor ≤ 60 chars.
- **Content integrity** (`scripts/content_integrity_check.py` `analyze_post` run on the Sanity draft via token): severity **ok**, 0 flags, 106 blocks, 14,160 body chars (`integrity-output.txt`).
- **Live blog QA** (`scripts/live_blog_qa.py`) can't run until the post renders. Run it on the Netlify deploy preview after push, and on production after publish.
- **Heights:** 40 rides in the post checked against Universal's height page/ride pages and Sanity `heightRequirement`: **0 mismatches**, 2 missing ride docs (see `HEIGHT-MISMATCHES.md`).

## Fixes made during QA
- First pass flagged "If I Ran the Zoo" / "The Amazing Adventures of Spider-Man" as lore/hype words (official names; regex now excludes them) and two height-parser misses (nav text; Pteranodon "designed for" wording). No post changes needed for those.
- Removed unverified wording: "family coaster" for Flight of the Hippogriff; "easiest" park → "an easy first park"; "fewer no-minimum rides" → "only two"; Minion Mayhem stationary seat wording tightened to Universal's text; water-ride tip now quotes Universal's ride pages; Hogwarts Express wording now says Universal's height page lists no minimum.
- Deliberately NOT included (unverifiable or off-policy): crowd predictions for Christmas week, prices, Express Pass claims, Animal Actors on Location (news reports it closed Nov 2, 2026; not recommended), age-to-height mapping.

## Open issues for the reviewer
1. **Images generated** 2026-11-23 (new, original); hero set on the draft (asset `image-d5e270f9e8cd17bd6cef832de55de15c52813ac1-1376x768-jpg`).
2. **Ride finder data (not fixed; needs approval):** Sanity still shows Fast & Furious (Supercharged) and Hollywood Rip Ride Rockit as open (neither is on Universal's height page); Jurassic Park River Adventure isClosed null while closed until Dec 16, 2026; Caro-Seuss-el and Kang & Kodos' Twirl 'n' Hurl have no ride docs. The `/rides/for/universal-*` pages this post links to show that stale data.
3. **Dated facts to re-check on publish day:** Volcano Bay reopening (on or before Apr 1, 2027), Jurassic Park River Adventure (to Dec 16), Monsters Unchained (Dec 11–15), 2027 refurb dates, Holidays dates.
4. Supercharged/Rip Ride Rockit are described only as "no longer on Universal's ride height page" (official), not with closure dates (those come from news sites).
5. Holiday-specific queries have no GSC demand for the site; the holiday section is there for timeliness, not as the target.
