# Sanity draft patches — finder/chooser links + in-post affiliate disclosure (2026-10-16)

Status: **prepared locally, NOT applied.** Post content lives only in Sanity (project `hd7qwtcq`, dataset `production`), so there's no repo file to edit. Nothing was written to Sanity.

Files:
- `build_patches.py` regenerates `mutations.json` and `preview.md`.
- `mutations.json` holds 20 mutations (19 inserts + 18 targeted span replaces) targeting `drafts.<id>`.
- `preview.md` shows the inserted text.

Scope (12 posts):
- **Finder + chooser link paragraph (10):** universal-orlando-height-requirements (priority), epic-universe-rides-ranked-guide, epic-universe-1-day-plan, epic-universe-tickets-guide, universal-orlando-summer-2026, best-time-visit-disney-world-2026, disney-world-guide, free-things-disney-world, beat-disney-world-crowds, disney-world-packing-list.
- **In-post affiliate disclosure (9):** universal-orlando-height-requirements, disney-world-packing-list-kids, disney-world-packing-list, universal-orlando-summer-2026, best-time-visit-disney-world-2026, disney-world-guide, free-things-disney-world, beat-disney-world-crowds, disney-world-with-baby-toddler.
- The Epic posts already have disclosure text, so they get links only. The packing-kids and baby/toddler posts already have a /rides link, so they get disclosure only.

Every link target returned HTTP 200 live on 2026-10-16, and no anchor exceeds 60 characters (live QA `overlong_anchor` rule).

## ⚠️ UNVERIFIED — needs official check (not changed)
- universal-orlando-height-requirements, block `qA3myj3wioIqOqUk24ZE4q`: "The High in the Sky Seuss Trolley Train Ride — 36 inches." This may really be 34″.
- Verify on https://www.universalorlando.com/web/en/us/plan-your-visit/accessibility-information/rider-height-requirements in a real browser before editing. The text is intentionally left unchanged.

## Other flags (not changed)
- disney-world-guide family-lore line: now handled by the replace patch below.

## To apply (after approval)
1. Create the `drafts.<id>` docs from the published versions (e.g. open each in Studio).
2. POST `mutations.json` `.mutations` to the `/data/mutate/production` endpoint with an editor token.
3. Review in Studio, then run `scripts/content_integrity_check.py` and, after any publish, `scripts/live_blog_qa.py --fail-on high`.

## ⚠️ The ONE non-insert edit (targeted replace)
- **disney-world-guide**, block `blk720c5dce00c0`, span `s164cb485a680`. A single `set` on that span's `.text`. Nothing else in the post changes.
- Only the opening clause changes, to remove first-person family lore (brand-voice policy):
  - Before: "I've been to Disney World more times than I can count with young kids, and here's what I know for certain:"
  - After: "For families with young kids, one thing about Disney World holds true:"
- The rest of the sentence is unchanged.
- `build_patches.py` asserts the original text before building. Re-check the span text in the draft before you apply, because a `set` overwrites the whole span.

## Applied to DRAFTS 2026-10-16 ~11:25 CT (transaction `f1O3mfm9f6TgHfHlPz28kS`)
- Before applying, I re-fetched all 12 published docs. Every body was identical to the audit fetch: 0 drift, all 19 insert anchors present, and the replace span text matched exactly.
- No drafts existed beforehand. I created all 12 `drafts.<id>` docs from the published content (`createIfNotExists`) and applied the 20 mutations in one transaction, after a successful dryRun.
- Read-back:
  - All 12 drafts exist with every inserted block (+19 blocks total).
  - The disney-world-guide draft no longer contains "I've been to Disney".
  - All 12 **published** docs keep their pre-apply `_rev` and body, i.e. unchanged.
- Nothing was published.

## Packing posts — 7 more targeted span REPLACES (applied to drafts 2026-10-16 ~11:35 CT, txn `8zlLPwu11vTM6HR7vzZPPQ`)
These are non-insert edits. Old text is pinned in `packing_replaces.json`. Each edit was re-verified against the current drafts and guarded with `ifRevisionID`.

- **disney-world-packing-list:**
  - intro (`span-9b3c8e9ed1cc`): removes "verified by Orlando locals who've done this dozens of times" and the "people who've never navigated…" claim.
  - heat (`span-33a91940982d`): "regularly hit 95°F with 80%+ humidity" → NOAA normals (Jun–Aug highs ~91–92°F; Dec–Feb highs ~72–75°F).
  - summer FAQ (`s879be0cfbb33`): same NOAA fix.
  - winter FAQ (`span-df13f26c389e`): "60–75°F" → NOAA highs ~72–75°F / lows ~50–53°F.
  - "five things most first-time visitors wish they had brought" (`span-d9d46275df0d`) → neutral priority list.
  - closing "four things most first-time visitors wish…" (`span-af4834551c09`) → neutral.
- **disney-world-packing-list-kids:**
  - intro (`e531a32a974e`): removes "items that actual families… used… tested in real heat".
- **Source (dated):** NOAA NCEI 1991–2020 monthly normals, Orlando Intl AP (USW00012815), https://www.ncei.noaa.gov/data/normals-monthly/1991-2020/access/USW00012815.csv, accessed 2026-10-16.
  - Values (°F): Jun 90.8 / Jul 92.0 / Aug 91.6 highs; Dec 73.8 / Jan 71.8 / Feb 74.9 highs; lows 52.9 / 49.5 / 52.4.
  - Humidity percentages were removed; the text now says only "humid", because these normals don't include humidity.
  - The citation is inline text, not a link. Add a link in Studio if wanted.
- **Not changed (flag for later review):**
  - packing-kids "heat index hits 95°F+" and stroller-fan "10–15 degrees" claims.
  - "Kids feel heat more" medical-adjacent lines elsewhere.
- Read-back: all 7 spans show the new text, no flagged phrases remain, and both **published** docs keep their `_rev` (unchanged).

## Packing posts — 7 more span REPLACES (heat/medical-adjacent softening), applied to drafts 2026-10-16 ~11:40 CT, txn `k0VJ6AV1kAo5HVBfuck8S9`
Old text is pinned in `packing_replaces_2.json`. Each edit was re-verified against the current drafts and guarded with `ifRevisionID`.

**Numeric claims removed, not sourced:** I found no authoritative, dated source for "heat index hits 95°F+" as a threshold or for "fan drops perceived temp 10–15 degrees".

- **packing-kids:**
  - cooling towel (`93ba542451d8`): removes the heat-index and "prevent heat exhaustion" claims. Adds a First Aid/doctor pointer.
  - stroller fan (`3aee82b2d791`): removes "10–15 degrees". Adds "follow maker's safety guidance; don't rely on a fan alone".
  - water (`9318dabb0d4f`): removes "Dehydration is the #1 reason…".
  - frozen bottles (`0e47173321ee`): removes "already dehydrated".
- **packing:**
  - electrolytes (`se90f50839437`): removes "prevent cramping and fatigue". Adds a pediatrician + First Aid pointer.
  - stomach (`s631502cc3438`): general wording + First Aid/doctor pointer.
  - medical kit intro (`span-22cdf86bac9a`): removes "handles 90% of what comes up".
- Read-back: all applied, flagged phrases gone, published `_rev`s unchanged.
- **Still flagged (not changed):**
  - packing-kids motion-sickness line naming Bonine/Dramamine with timing advice (`a1c15bfa0227`).
  - FAQ "First Aid staffed by registered nurses" (`e84dc79687f5`) needs an official Disney citation.

## Packing posts — 3 more span REPLACES (motion sickness + First Aid FAQ), applied to drafts 2026-10-16 ~11:45 CT, txn `f1O3mfm9f6TgHfHlPz4ATI`
- **packing-kids** `a1c15bfa0227`:
  - Bonine/Dramamine timing advice and the unverified "rides have spins" list removed.
  - Now: "If your child is prone to motion sickness, ask your pediatrician about motion-sickness options before your trip."
- **packing-kids** `e84dc79687f5` (FAQ):
  - Disney's official First Aid page (https://disneyworld.disney.go.com/guest-services/first-aid/, accessed 2026-10-16) confirms "First aid is available in every Walt Disney World theme park". Its fetched text does **not** mention nurses.
  - "Registered nurses" → "staffed by medical professionals". The unverified OTC-meds/urgent-care claims were removed.
- **packing** `s76b01292884f` (Anti-Nausea Medication item): replaced with the same "ask your pediatrician or doctor about motion-sickness options" wording.
- Read-back: applied; Bonine, Dramamine and "registered nurses" are gone; published `_rev`s are unchanged.
