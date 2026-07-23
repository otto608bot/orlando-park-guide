# Content pipeline

Stages: `idea` → `brief` → `drafting` → `qa1` → `qa2` → `awaiting_approval` → `published` → `distributed` → `30d_review`

## Now

| slug / topic | Stage | Why | Monetization | Links |
|---|---|---|---|---|
| parks hub CTR v2 | published + distributed | live | tickets | https://planyourpark.com/parks/ |
| epic-universe-rides-ranked-guide CTR v2 | published + distributed | live | tickets | https://planyourpark.com/blog/epic-universe-rides-ranked-guide/ |
| disney-world-packing-list-kids CTR v2 | published + distributed | live; **57 Amazon tags** verified 2026-07-23 | Amazon + tickets | https://planyourpark.com/blog/disney-world-packing-list-kids/ |
| universal-orlando-height-requirements CTR v2 | published + distributed | live + MK cross-link | tool + tickets + Amazon | https://planyourpark.com/blog/universal-orlando-height-requirements/ |
| epic-universe-1-day-plan | published + distributed | best CTR amplifier | tickets + Amazon | https://planyourpark.com/blog/epic-universe-1-day-plan/ |
| epic-universe-tickets-guide | published | conversion trust | tickets + Amazon | https://planyourpark.com/blog/epic-universe-tickets-guide/ |
| best-magic-kingdom-rides-kids-under-40-inches | published + amplified | inbound CMS + helpful-links + height tool link **live** | tickets | https://planyourpark.com/blog/best-magic-kingdom-rides-kids-under-40-inches/ |
| Height-filter SEO (`/rides/` + home) | **published** | shareable `?height=` presets live `b23b2af` | tickets via finder | https://planyourpark.com/rides/ · https://planyourpark.com/ |
| Amazon list/heading keyword wiring | **published** | packing conversion complete | Amazon | blog renderer + `blogAffiliates.tsx` |
| Helpful-links MK/height priority | **published** | footers prioritize earning guides | tickets | `web/src/lib/blog.ts` |
| Phase 1 Buffer packs | queued | 15 posts 2026-07-22 | — | https://publish.buffer.com/ |
| MK amplify Buffer ideas | idea (review) | 3 ideas — not queued | — | Buffer ideas board |
| Itinerary builder | brief/spec | P1 closed as one-pager | tickets | `ops/specs/itinerary-builder.md` |

## Dual QA checklist (every draft)
- [x] Family-with-kids angle clear
- [x] Heights/policies not newly asserted without sources
- [x] Affiliate CTAs + disclosure on parks hub
- [x] Internal links to rides/parks tools
- [ ] Hero refresh (not in this batch)
- [x] Meta title/description CTR-oriented
- [x] No contradictory family lore
- [x] Second QA pass
- [x] Content integrity clean (14/14, 2026-07-23)
- [x] Live HTML verify after deploy 2026-07-23
