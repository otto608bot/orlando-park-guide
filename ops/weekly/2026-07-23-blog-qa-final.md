# Blog QA Final — 2026-07-23

Independent post-batch QA of all **14** Sanity `blogPost` documents (`hd7qwtcq` / `production`) after author batches A/B/C.

## Executive result

| Gate | Result |
|---|---|
| `python3 scripts/content_integrity_check.py` | **14/14 clean** (0 issues, 0 high) |
| Genie+ as current product | **PASS** — remaining Genie+ only historical (retired July 2024) |
| Lightning Lane = Multi / Single Pass (paid Disney) | **PASS** after final fix on packing FAQ |
| Universal Express ≠ Lightning Lane | **PASS** (Epic tickets guide correctly distinguishes) |
| Collapsed list items (3+ children + multi `description`) | **PASS** — none found |
| Cliffhangers / empty sections | **PASS** |
| Same-post height contradictions | **PASS** — none flagged |
| Deploy readiness | **YES** for CMS content; trigger site rebuild/refresh if any edge CDN still stale |

**Final CMS scorecard: 14/14 PASS** (one proximity false-positive only — see notes).

---

## Scorecard by slug

| Slug | Integrity | Naming / product | Structure | Final |
|---|---|---|---|---|
| `beat-disney-world-crowds` | OK | OK (Genie historical; wording cleaned in final QA) | OK | **PASS** |
| `best-magic-kingdom-rides-kids-under-40-inches` | OK | OK (LL Multi/Single) | OK | **PASS** |
| `best-time-visit-disney-world-2026` | OK | OK (Genie only as “shift from”) | OK | **PASS** |
| `disney-world-guide` | OK | OK (Genie retired July 2024; Splash residual cleaned) | OK | **PASS** |
| `disney-world-packing-list` | OK | OK after FAQ rewrite | OK | **PASS** |
| `disney-world-packing-list-kids` | OK | OK (Multi/Single in 2026 section) | OK | **PASS** |
| `disney-world-with-baby-toddler` | OK | N/A (no LL product pitch) | OK (`level:1` backfilled) | **PASS** |
| `epic-universe-1-day-plan` | OK | OK (Universal product language) | OK | **PASS** |
| `epic-universe-rides-ranked-guide` | OK | OK (Express mentioned correctly) | OK | **PASS** |
| `epic-universe-tickets-guide` | OK | OK — **intentional** “Universal Express Is Separate From Disney Lightning Lane” | OK | **PASS** |
| `free-things-disney-world` | OK | OK (title count 19) | OK (`level:1` backfilled) | **PASS** |
| `orlando-closures-march-2026` | OK | OK (dated historical frame) | OK | **PASS** |
| `universal-orlando-height-requirements` | OK | OK (Express, not LL) | OK (`level:1` backfilled) | **PASS** |
| `universal-orlando-summer-2026` | OK | OK (Express Unlimited wording) | OK | **PASS** |

---

## Critical fixes applied in final QA

Script: `scripts/qa-final-fix.mjs` (`--apply`).

| Doc | Mutation | Why critical |
|---|---|---|
| `disney-world-packing-list` | FAQ “Is Lightning Lane still worth it…” rewritten to **Multi Pass + Single Pass**, removed hard **$15–$25**/day | Treated LL as one current product with fixed price |
| `beat-disney-world-crowds` | “Genie+/individual Lightning Lane Genie era” → “Genie+ (retired July 2024)” | Broken product mash wording |
| `disney-world-guide` | Fireworks tip “Splash Mountain/Tiana's” → “Tiana's Bayou Adventure (former Splash Mountain area)” | Implied current Splash Mountain location |
| `disney-world-with-baby-toddler` | `level: 1` on 4 list items | List level hygiene (renderer consistency) |
| `free-things-disney-world` | `level: 1` on 15 list items | Same |
| `universal-orlando-height-requirements` | `level: 1` on 3 list items | Same |

Mutation transaction IDs (from apply run):  
`yXET3SHVid8KwVG5S1fzIR`, `yXET3SHVid8KwVG5S1fzhq`, `U6AF1sJtP5T3lkx9aaXHyt`, `U6AF1sJtP5T3lkx9aaXIAf`, `U6AF1sJtP5T3lkx9aaXIIu`, `qA3myj3wioIqOqUk24bNRK`.

**Did not reverse Genie+ → Lightning Lane.** Historical Genie+ mentions retained only where framed as retired / replaced.

---

## Sample live checks (3+ high-risk)

Fetched production HTML for:

1. `disney-world-guide` — Genie+ only in “retired in July 2024”; Multi/Single present  
2. `epic-universe-tickets-guide` — heading/body correctly separate Universal Express from Disney Lightning Lane Multi/Single  
3. `disney-world-packing-list` — still had pre-fix FAQ `$15–$25` in live HTML at sample time; **CMS now fixed** (rebuild/ISR refresh needed for that FAQ)  
4. `best-time-visit-disney-world-2026` — Genie+ only in “shift from Genie+ to Lightning Lane Multi Pass and Single Pass”  
5. `universal-orlando-height-requirements` — Universal Express only; no Lightning Lane  

Live stack appears to serve blog bodies from CMS/RSC payload (not purely frozen static forever), but packing FAQ lag shows **a deploy or cache refresh is still required** for final-QA edits to be universal on the edge.

---

## Residual risks (non-blocking)

1. **Operational volatility:** ticket dollars, Express eligibility, LL inventory windows, height signs, seasonal hours — posts correctly push “confirm for your date,” but SERP readers may still treat prose as live prices.  
2. **Umbrella “Lightning Lane” language:** packing and guide copy still use bare “Lightning Lane bookings” in battery/app tips. Acceptable as umbrella for app workflow; product FAQ/sections now name Multi/Single where price/value is claimed.  
3. **`orlando-closures-march-2026`:** intentionally historical. Supersede with a new dated closures piece rather than reusing the URL as a live calendar.  
4. **Epic guides are shorter** (~2.6–3.1k chars) after Batch B truth-trim — integrity OK; optional depth pass later if rankings demand more.  
5. **Voice / medical / kid-age tone** in baby and packing posts remains editorial first-person family advice — not a CMS integrity failure.  
6. **Affiliate / Amazon:** body Amazon URLs stripped in packing batch A; keyword affiliate inject still depends on renderer — not re-audited end-to-end here.

---

## Verification commands

```bash
python3 scripts/content_integrity_check.py          # 14 posts, 0 issues
python3 scripts/content_integrity_check.py --fail-on any
# optional re-scan helper used in final QA:
python3 scripts/_qa_final_scan.py
# final critical mutate (already applied):
# node scripts/qa-final-fix.mjs --apply
```

---

## Deploy readiness

**YES — CMS content ready.**

Ship checklist:

1. Confirm Netlify/site rebuild or ISR revalidation so packing FAQ + wording polish hit `planyourpark.com`.  
2. Spot-check live: packing FAQ has no `$15–$25`; guide fireworks line says Tiana’s (former Splash area); beat-crowds Genie line is clean.  
3. No renderer code changes required for these CMS fixes.

---

## Naming inventory (titles as of QA)

| Slug | Title |
|---|---|
| `beat-disney-world-crowds` | How to Beat Disney World Crowds in 2026 |
| `best-magic-kingdom-rides-kids-under-40-inches` | Best Magic Kingdom Rides for Kids Under 40 Inches |
| `best-time-visit-disney-world-2026` | Best Time to Visit Disney World in 2026 — Complete Month-by-Month Guide |
| `disney-world-guide` | Complete Disney World Planning Guide for Families |
| `disney-world-packing-list` | What to Pack for Disney World With Kids (2026) — 65+ Essentials for Families |
| `disney-world-packing-list-kids` | Disney World Kids Packing List (2026) — 25 Essentials |
| `disney-world-with-baby-toddler` | Disney World with a Baby or Toddler: The Complete Guide |
| `epic-universe-1-day-plan` | What to Do at Epic Universe: Complete 1-Day Touring Plan |
| `epic-universe-rides-ranked-guide` | All Epic Universe Rides Ranked for Kids (2026 Guide) |
| `epic-universe-tickets-guide` | Epic Universe Tickets: Pricing, Tiers, and Money-Saving Tips |
| `free-things-disney-world` | 19 No-Extra-Cost Things to Do at Disney World (That Are Actually Good) |
| `orlando-closures-march-2026` | Orlando Theme Park Closures & Refurbs: March 2026 |
| `universal-orlando-height-requirements` | Universal Height Requirements 2026 — Full Ride Chart |
| `universal-orlando-summer-2026` | Universal Orlando Summer 2026: The Complete Spielberg Summer Blockbuster Planning Guide |
