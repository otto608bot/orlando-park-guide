# Content pipeline

Stages: `idea` → `brief` → `drafting` → `qa1` → `qa2` → `awaiting_approval` → `published` → `distributed` → `30d_review`

## Now

| slug / topic | Stage | Why | Monetization | Links |
|---|---|---|---|---|
| parks hub CTR v2 | published + distributed (queued) | SERP “all parks in orlando” live 2026-07-22 | tickets | https://planyourpark.com/parks/ |
| epic-universe-rides-ranked-guide CTR v2 | published + distributed (queued) | title/excerpt live | tickets | https://planyourpark.com/blog/epic-universe-rides-ranked-guide/ |
| disney-world-packing-list-kids CTR v2 | published + distributed (queued) | title/excerpt live; next-steps links fixed 2026-07-23 (CMS) | Amazon + tickets | https://planyourpark.com/blog/disney-world-packing-list-kids/ |
| universal-orlando-height-requirements CTR v2 | published + distributed (queued) | title/excerpt live; MK cross-link CMS 2026-07-23 | tool + tickets + Amazon | https://planyourpark.com/blog/universal-orlando-height-requirements/ |
| epic-universe-1-day-plan | published + distributed (queued) | best CTR amplifier; Amazon tag live | tickets + Amazon | https://planyourpark.com/blog/epic-universe-1-day-plan/ |
| epic-universe-tickets-guide | published | conversion trust; Amazon tag live | tickets + Amazon | https://planyourpark.com/blog/epic-universe-tickets-guide/ |
| best-magic-kingdom-rides-kids-under-40-inches | published + amplified (CMS) | core ICP; earning clicks; 6 inbound Sanity links + tool outbound 2026-07-23 | tickets | https://planyourpark.com/blog/best-magic-kingdom-rides-kids-under-40-inches/ |
| Phase 1 Buffer packs | queued (FB/IG/Pinterest) | 15 posts addToQueue 2026-07-22 | — | https://publish.buffer.com/ · `ops/weekly/2026-07-22-deploy-ctr-amazon-social.md` |
| MK amplify Buffer ideas | idea (review) | 3 ideas 2026-07-23 | — | Buffer ideas `6a6237e5…` / `6a6237e6…` |
| Height-filter SEO (`/rides/` + home + parks deep links) | qa2 → **awaiting_approval (deploy)** | product SEO; shareable `?height=` presets | tickets via finder → parks | local build; `ops/weekly/2026-07-22-daily.md` |
| Amazon list/heading keyword wiring | awaiting_approval (deploy) | complete approved Amazon rail on packing lists | Amazon | blog `[slug]` + `blogAffiliates.tsx` |
| Helpful-links MK/height priority | awaiting_approval (deploy) | surface best-CTR guides in post footers | tickets | `web/src/lib/blog.ts` |
| Itinerary builder | brief/spec | P1 closed as one-pager | tickets | `ops/specs/itinerary-builder.md` |
| blog affiliate renderer wiring | published | base Amazon component live 2026-07-22 | Amazon + tickets | `ops/affiliate-inventory-audit-2026-07-20.md` |

## Dual QA checklist (every draft)
- [x] Family-with-kids angle clear (CTR batch + height SEO + MK amplify)
- [x] Heights/policies not newly asserted without sources
- [x] Affiliate CTAs + disclosure on parks hub
- [x] Internal links to rides/parks tools
- [ ] Hero refresh (not in this batch)
- [x] Meta title/description CTR-oriented (2026-07-21 pass; live 2026-07-22; height/home staged 2026-07-22)
- [x] No contradictory family lore
- [x] Second QA pass on titles/excerpts + parks copy + rides landing + MK link pack
- [x] Content integrity script clean on all 14 posts (rechecked 2026-07-23)
