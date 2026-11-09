# QA notes: LEGOLAND Florida Ride Heights 2026 (2026-11-09)
- Sanity: **`drafts.blogPost-legoland-florida-rides-by-height`**, NEW draft, 86 blocks, ~2,000 words (readTime 9), category General (`q5bQv6QFqWcAZeLNacatoE`), `publishedAt` unset, **no heroImage** (blocker below). Nothing published. No published doc with this slug exists.
- **Sanity-draft-only:** the post is NOT on the Netlify deploy preview (preview builds from published Sanity content). The PR only changes ops/ files.
- Brief + demand: `brief.md`. Official extract: `official-legoland-extract-2026-11-09.txt`. Heights vs Sanity: `HEIGHT-MISMATCHES.md`.

## QA pass 1 (author: links, anchors, format, SEO) and pass 2 (independent: facts vs official extract, closures, dates, disclosure, lore)
- `qa.py` → `qa-output.txt`: **pass 1: 0 fails · pass 2: 0 fails (79 checks)**. All 19 unique links 200; anchors ≤60; disclosure before first affiliate link; 6 ride-finder links + /rides/ + /parks/ + /parks/legoland-florida/; affiliate URL = config `legoland`; every height matches the official extract; closures and Bricktacular/drone/tree-lighting dates match; facts dated 2026-11-09.
- `content_integrity_check.analyze_post` → `integrity-output.txt`: severity ok, 0 flags.
- `live_blog_qa.py`: not applicable until published (rendered-site QA required after deploy per ops/content-qa.md).
- Manual claim pass fixes (pass 2): removed age-to-height mappings ("most 2- and 3-year-olds", etc.; unverifiable); removed Great LEGO Race VR 35-in mention (conflicts with 42-in ride; looked like an official-page error); Safari Trek + Lost Kingdom companion rules switched to the stricter ride-page wording; Rescue Academy/AQUAZONE/Dragon/Mia's descriptions rewritten to official wording; "no-wait" MINILAND and "event days run later" removed (unverified); "two dozen rides" → "about 25 by our count"; "ages 2 to 10" → LEGOLAND's own Little/Big Builders labels.
- Kept and disclosed to readers: Kid Power Towers 30 vs 38 in conflict (plan on 38); AQUAZONE 52-in wording ambiguity.

## Open issues
1. **Hero + social images: BLOCKED.** No GenerateImage tool in the cursor namespace and no image API/GPU on the box (2026-11-09). heroImage left unset; no art reused or cropped. Prompts in `ops/buffer/legoland-florida-rides-by-height-2026-11/social-pack.md`.
2. **Ride data:** Sanity LEGOLAND ride docs are stale (2 height mismatches, 1 likely renamed ride, 2 unverifiable rides, 16 rides missing). The ride-finder pages this post links to show that stale data. Fix (drafts only) before publish. Not applied.
