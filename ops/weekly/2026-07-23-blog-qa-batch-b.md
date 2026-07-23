# Blog QA — Batch B — 2026-07-23

## Scope
Sanity project `hd7qwtcq`, dataset `production`.

## Completed
All five target documents were mutated in Sanity and rechecked with `scripts/content_integrity_check.py --fail-on any` (0 issues for every target). Portable Text verification found **0 broken mark references** and **0 inline-object link marks** after the refresh.

| Slug | QA / content changes |
|---|---|
| `epic-universe-rides-ranked-guide` | Replaced invented/outdated attraction descriptions with a family-first guide using current Epic lands and attraction names; removed numeric wait-time promises; added a height-confirmation caveat, Universal app guidance, and links to the 1-day plan, ticket guide and Universal height guide. |
| `epic-universe-1-day-plan` | Rebuilt the schedule as a flexible, no-real-time-waits plan; removed unsupported entry/account claims and fixed collapsed pseudo-lists into actual bullets; added height/Rider Switch guidance and links to ranked rides, tickets and the height guide. |
| `epic-universe-tickets-guide` | Removed stale/invented price figures and volatile savings claims; corrected the product distinction: **Universal Express** is Universal’s product, while Disney uses **Lightning Lane Multi Pass** and **Lightning Lane Single Pass**; added current-price confirmation language, structured saving checks, and links to planning/deals/height tools. |
| `best-magic-kingdom-rides-kids-under-40-inches` | Corrected height breakpoints (including Big Thunder and Tiana at 40 inches; Seven Dwarfs at 38 inches); removed stale Genie+ framing and uses current Lightning Lane naming; fixed the broken Amazon inline link representation by removing unsupported inline affiliate links; retained/strengthened ride-finder, packing and Universal-height internal links. |
| `orlando-closures-march-2026` | Reframed as a clearly dated **historical March 2026 reference** because the dates have passed; removed expired closure assertions, forecast wait claims and stale operational instructions; directs readers to official current calendars/apps and links to rides, parks and deals. |

## Local artifact
- Added `scripts/qa_batch_b_sanity.js`: repeatable Sanity QA mutation script. It defaults to a dry run; use `node scripts/qa_batch_b_sanity.js --apply` to apply its patches.

## Verification
```text
content_integrity_check.py --slug <each Batch B slug> --fail-on any
5/5 OK — 0 issues, 0 high

Portable Text post-mutation audit:
5/5 posts: broken marks [], inline-object marks [], Genie+ false
```

## Risks / follow-up
- The site is statically exported. The Sanity changes need the next Netlify rebuild/deploy before public HTML reflects them.
- Ticket prices, Express eligibility, Lightning Lane selections, attraction status and height rules remain operationally volatile; posts now tell readers to confirm them for their travel date rather than presenting fixed real-time claims.
- `orlando-closures-march-2026` remains a dated URL for historical/search continuity; it should be superseded by a newly researched current-month closures page rather than reused as a live calendar.
