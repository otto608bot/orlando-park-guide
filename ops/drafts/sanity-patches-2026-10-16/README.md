# Sanity draft patches — finder/chooser links + in-post affiliate disclosure (2026-10-16)

Status: **prepared locally, NOT applied.** Post content lives only in Sanity (project `hd7qwtcq`, dataset `production`), so there's no repo file to edit. Nothing was written to Sanity.

Files:
- `build_patches.py` regenerates `mutations.json` and `preview.md`.
- `mutations.json` holds 19 insert mutations targeting `drafts.<id>`.
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
- disney-world-guide intro says "I've been to Disney World more times than I can count with young kids". That conflicts with the brand-voice family-lore policy and needs review.

## To apply (after approval)
1. Create the `drafts.<id>` docs from the published versions (e.g. open each in Studio).
2. POST `mutations.json` `.mutations` to the `/data/mutate/production` endpoint with an editor token.
3. Review in Studio, then run `scripts/content_integrity_check.py` and, after any publish, `scripts/live_blog_qa.py --fail-on high`.
