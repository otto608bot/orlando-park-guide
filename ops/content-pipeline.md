# Content pipeline

Stages: `idea` → `brief` → `drafting` → `qa1` → `qa2` → `awaiting_approval` → `published` → `distributed` → `30d_review`

## Now

| slug / topic | Stage | Why | Monetization | Links |
|---|---|---|---|---|
| parks hub CTR v2 | published + distributed | live; **watch 14d CTR** | tickets | https://planyourpark.com/parks/ |
| epic-universe-rides-ranked-guide CTR v2 | published + distributed | live; high-impr 0-click focus | tickets | https://planyourpark.com/blog/epic-universe-rides-ranked-guide/ |
| disney-world-packing-list-kids CTR v2 | published + distributed | live; Amazon tags verified | Amazon + tickets | https://planyourpark.com/blog/disney-world-packing-list-kids/ |
| universal-orlando-height-requirements CTR v2 | published + distributed | live + MK cross-link | tool + tickets + Amazon | https://planyourpark.com/blog/universal-orlando-height-requirements/ |
| epic-universe-1-day-plan | published + distributed | best CTR amplifier | tickets + Amazon | https://planyourpark.com/blog/epic-universe-1-day-plan/ |
| epic-universe-tickets-guide | published | conversion trust | tickets + Amazon | https://planyourpark.com/blog/epic-universe-tickets-guide/ |
| best-magic-kingdom-rides-kids-under-40-inches | published + amplified | inbound + height tool **live** | tickets | https://planyourpark.com/blog/best-magic-kingdom-rides-kids-under-40-inches/ |
| Full catalog product-naming QA (14 posts) | **published** | LL Multi/Single; Genie historical only | trust | all blog URLs |
| Height-filter SEO (`/rides/` + home) | **published** | `?height=` presets live | tickets via finder | https://planyourpark.com/rides/ · https://planyourpark.com/ |
| Amazon list/heading keyword wiring | **published** | packing conversion | Amazon | blog renderer + `blogAffiliates.tsx` |
| Helpful-links MK/height priority | **published** | footers prioritize earners | tickets | `web/src/lib/blog.ts` |
| Phase 1 Buffer packs | queued | 15 posts 2026-07-22 | — | https://publish.buffer.com/ |
| Utility SEO + conversion pack (park SERP/OG + guides + height CTA + hub/deals/dining meta + short redirects + blog earner amplify + **home/rides/dining/about routes + helpful noindex 404 + deals FTC disclosure + park height chips / deals CTA / ticket disclosure**) | **awaiting_approval** | pack extended + build PASS 2026-07-29; live `/epic-universe` still 404 | tickets via parks/home/deals | see `ops/weekly/2026-07-29-daily.md` |
| Buffer ideas 2026-07-24 (Epic 1-day / packing / heights / parks) | idea (review) | 4 packs — not queued | tickets + Amazon | https://publish.buffer.com/ |
| Buffer ideas 2026-07-25 (MK under-40 / Epic tickets / height=40) | idea (review) | 3 packs — not queued | tickets | https://publish.buffer.com/ |
| Buffer ideas 2026-07-26 (rides ranked / free things / deals / Disney guide) | idea (review) | 4 packs — not queued | tickets + Amazon | https://publish.buffer.com/ |
| Buffer ideas 2026-07-28 (Epic tickets / baby-toddler / beat crowds / character dining) | idea (review) | 4 packs — not queued | tickets | https://publish.buffer.com/ |
| Buffer ideas 2026-07-29 (MK park / Epic park / height=40 / parks hub) | idea (review) | 4 product packs — not queued | tickets | https://publish.buffer.com/ |
| Post-deploy smoke script | tool ready | run after utility deploy | — | `scripts/post_deploy_smoke.py` |
| Itinerary builder | brief/spec | parked until CTR data | tickets | `ops/specs/itinerary-builder.md` |

## Dual QA checklist (every draft)
- [x] Family-with-kids angle clear
- [x] Heights/policies not newly asserted without sources
- [x] Affiliate CTAs + disclosure on parks hub
- [x] Internal links to rides/parks tools
- [ ] Hero refresh (not in this batch)
- [x] Meta title/description CTR-oriented
- [x] No contradictory family lore
- [x] Second QA pass
- [x] Content integrity clean (14/14, 2026-07-29)
- [x] Live HTML verify after deploy / full QA (2026-07-29 production blog clean; utility pack post-deploy pending — use `post_deploy_smoke.py`)
- [x] Deals commercial disclosure staged (2026-07-28)
- [x] Park page height chips + ticket disclosure staged (2026-07-29)
