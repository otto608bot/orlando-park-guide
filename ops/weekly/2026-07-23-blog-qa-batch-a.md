# Blog QA Batch A — 2026-07-23

Sanity project `hd7qwtcq` / dataset `production`.  
Mutations: `U6AF1sJtP5T3lkx9aaWWzx` (batch of 5) + `U6AF1sJtP5T3lkx9aaWYus` (guide Multi Pass price polish).

**Integrity:** `python3 scripts/content_integrity_check.py` → **14 posts, 0 issues** (all Batch A clean).

**Deploy note:** Site is static Next export. CMS body fixes are live in Sanity but **Netlify rebuild required** for HTML to update. No renderer code changes required this batch (list `level`, `ol start`, `description` mark already in `web/src`).

---

## 1. `disney-world-guide`

**Before**
- Genie+ framed as current matured product (intro + H3 “Lightning Lane and Genie+” + “Genie app”)
- Fixed ~$49 Multi Pass as hard fact in tickets section
- Park reservations described as required for 4-day+ resort packages without 2026 nuance
- Weak cross-links to timing/crowds/packing guides at close

**After**
- Intro → Lightning Lane Multi Pass / Single Pass; Genie+ only as retired (July 2024) in LL section
- H3 retitled **Lightning Lane Multi Pass and Single Pass**; Multi/Single explained; prices “varies by date”
- Ticket budget line: Multi Pass no longer hard-coded $49
- Park entry: most standard tickets no longer need park reservations; still link tickets in MDE
- Closing internal links: best-time 2026, beat-crowds, packing list, MK under-40
- FTC Amazon disclosure kept

**Remaining risks**
- Ticket/hotel dollar ranges are approximate evergreen estimates — re-verify if SERP CTR rises
- Voice still first-person “I” heavy (acceptable; not contradictory kid ages)

---

## 2. `best-time-visit-disney-world-2026`

**Before**
- Multiple current-tense Genie+ mentions (intro, Sept tip, Dec, FAQ Q/A, packing charger bullet)
- FAQ questions as plain `normal` paragraphs (not h3)
- List items missing `level: 1`

**After**
- Genie+ → Lightning Lane Multi Pass / Single Pass throughout; historical “shift from Genie+” only in intro
- FAQ Qs → **h3**; answer rewritten for Multi vs Single + peak vs off-peak
- Packing bullets: Genie+ → Lightning Lane; `level: 1`
- Integrity OK

**Remaining risks**
- Month crowd scores are editorial 1–10 scores, not a live calendar product
- Event windows (MNSSHP, festivals) drift year to year — seasonal refresh later

---

## 3. `beat-disney-world-crowds`

**Before**
- “Genie+ and Lightning Lane have replaced FastPass+” outdated product stack
- Implied park reservation required for 7am LL booking
- Hard Multi Pass $49 framing
- List items missing `level`
- Few internal links

**After**
- Full Multi Pass vs Single Pass explanation; Genie+ only as replaced July 2024
- Booking window language (admission linked; on-site often earlier) without fake inventory claims
- Prices “varies by date”; value framed as kid energy + waits, not invented wait tables
- `level: 1` on crowd-tier bullets
- Closing links: best-time 2026, disney-world-guide, MK under-40
- FTC disclosure kept

**Remaining risks**
- Rope-drop target rides can rotate with refurbishments — keep generic priority language if boards change
- Park Hopper dollar figure (~$65+) is approximate

---

## 4. `disney-world-packing-list`

**Before**
- Raw `amazon.com` URLs embedded in list item text (duplicates keyword `blogAffiliates` inject; some ASIN/search URLs)
- All list items missing `level: 1`
- Title — description jammed as plain text (harder for affiliate keyword hits on titles)
- “Disney requires SPF 50+ and does not allow spray sunscreen” overstated
- Intro still leaned on park-reservation framing for packing relevance

**After**
- Stripped all body Amazon URLs (affiliates via renderer keywords only)
- Every list item `level: 1`; title/description split to `strong` + `description` mark where “ — ” pattern held
- Sunscreen: lotion default; **aerosol** spray restricted (not a fake SPF mandate)
- Intro tied to Lightning Lane Multi Pass + app/charging needs
- FAQ summer line: “not aerosol spray”
- Existing internal MK under-40 link + FTC disclosure kept

**Remaining risks**
- Melatonin 10mg kid mention in first-aid section is adult-leaning — families should follow pediatric guidance (not newly invented; left; not medical advice framing)
- Stroller rent price / gift-card discount tips can drift

---

## 5. `disney-world-packing-list-kids`

**Before** (already renumbered 1–25)
- Shipping hack cliffhanger: “Address packages as:” with no format
- Outside-food bullet truncated: “Ready to book tickets? See”
- Under-3s “need a park reservation” outdated for most tickets
- LL bullet blurred Multi vs Single with a single $15–$30/day band
- Rider Switch blurb put Frozen Ever After at Magic Kingdom with 38″

**After**
- Shipping address format completed (guest, resort, reservation #, hold-for date + call bell services)
- Outside food + deals CTA completed with `/deals/` link
- Under-3 free admission clarified; park reservations mostly not required for standard tickets
- Multi Pass vs Single Pass; price varies by date/product
- Frozen Ever After → **EPCOT**, typical 40″; confirm boards on day
- LL naming already current; left intact elsewhere
- Numbered list continues via existing blog `ol start` renderer

**Remaining risks**
- Height numbers still editorial; boards override
- “Diaper genies” string can false-positive Genie scans (not Genie+)

---

## Files touched
| Path | Change |
|---|---|
| Sanity bodies (5 slugs) | Content/format mutations only |
| `ops/weekly/2026-07-23-blog-qa-batch-a.md` | This report |
| Code | **None required** this batch |

## Deploy checklist
1. Netlify rebuild/deploy `web` so static blog HTML pulls fresh Sanity bodies  
2. Spot-check live:
   - https://planyourpark.com/blog/disney-world-guide/
   - https://planyourpark.com/blog/best-time-visit-disney-world-2026/
   - https://planyourpark.com/blog/beat-disney-world-crowds/
   - https://planyourpark.com/blog/disney-world-packing-list/
   - https://planyourpark.com/blog/disney-world-packing-list-kids/
3. Confirm packing list shows Amazon keyword links without raw URL strings; kids list numbers 1–25 continuous across h3 splits
