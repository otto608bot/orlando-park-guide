# Sanity draft patches — finder/chooser links + in-post affiliate disclosure (2026-10-16)

Status: **prepared locally, NOT applied.** Post content lives only in Sanity (project `hd7qwtcq`, dataset `production`), so there's no repo file to edit. Nothing was written to Sanity.

Files:
- `build_patches.py` regenerates `mutations.json` and `preview.md`.
- `mutations.json` holds 20 mutations (19 inserts + 1 targeted span replace) targeting `drafts.<id>`.
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
