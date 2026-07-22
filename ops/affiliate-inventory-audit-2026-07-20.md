# Affiliate inventory audit — 2026-07-20

## Scope and method
Reviewed the five highest-value commercial/family pages identified in the 28-day GSC report. Downloaded the current production HTML on 2026-07-20 and checked each page for a tracked ticket partner destination and the on-page commission disclosure. Source/rendering paths were then reviewed locally.

| Live URL | GSC opportunity | Ticket partner CTA in production | On-page commission disclosure | Result |
|---|---:|---|---|---|
| https://planyourpark.com/blog/epic-universe-rides-ranked-guide/ | 491 impressions, 0 clicks | Yes — CJ Universal 1-Park Epic link | Yes | Healthy ticket conversion path |
| https://planyourpark.com/parks/ | 350 impressions, 0 clicks | Yes — CJ Orlando deals link | Yes | Healthy ticket conversion path |
| https://planyourpark.com/blog/epic-universe-tickets-guide/ | 34 impressions, position 14.2 | Yes — CJ Universal 1-Park Epic link | Yes | Healthy ticket conversion path |
| https://planyourpark.com/blog/epic-universe-1-day-plan/ | 2 clicks / 50 impressions (4.00% CTR) | Yes — CJ Universal 1-Park Epic link | Yes | Healthy ticket conversion path |
| https://planyourpark.com/blog/disney-world-packing-list-kids/ | 11 impressions, position 6.5 | Yes — CJ Disney link | Yes | Healthy ticket conversion path |

## Finding
Ticket CTAs and disclosures are present across the audited live set. The source also contains an Amazon Associates keyword-link component, but it was not imported by the blog renderer, so it was dormant. None of the five downloaded production documents contained the `planyourpark-20` Amazon tag.

## Staged low-risk fix (not deployed)
- Imported `processTextWithAffiliates` in `web/src/app/blog/[slug]/page.tsx` so normal Portable Text paragraphs can render existing Amazon keyword links.
- Updated the component to process Portable Text child arrays, not just a single string.
- No new affiliate destination, pricing claim, recommendation, or disclosure language was added. The existing post-level disclosure remains adjacent to the primary ticket CTA.

## Validation
- `cd web && npm run build` passed: TypeScript compile and 39 static pages.
- `git diff --check` passed.
- In the fresh static output, existing Amazon URLs with `tag=planyourpark-20` appeared where matching plain-text keywords existed: Epic 1-day plan (1) and Epic tickets guide (1). They did not appear on the packing-list page because its current Portable Text did not expose a configured keyword as a plain text child.
- `npm test -- --runInBand` could not run because this package has no `test` script.

## Recommendation
Keep this narrowly scoped staged fix for review/deploy. Separately audit the packing-list Portable Text structure before adding bespoke gear CTAs; that would require a new content-level change and review.
