# Content pipeline

Stages: `idea` → `brief` → `drafting` → `qa1` → `qa2` → `awaiting_approval` → `published` → `distributed` → `30d_review`

## Now

| slug / topic | Stage | Why | Monetization | Links |
|---|---|---|---|---|
| parks hub CTR v2 | published + distributed | live; **watch 14d CTR**; hub FAQ/ItemList schema **staged** | tickets | https://planyourpark.com/parks/ |
| epic-universe-rides-ranked-guide CTR v2 | published + distributed | live; high-impr 0-click focus | tickets | https://planyourpark.com/blog/epic-universe-rides-ranked-guide/ |
| disney-world-packing-list-kids CTR v2 | published + distributed | live; Amazon tags verified | Amazon + tickets | https://planyourpark.com/blog/disney-world-packing-list-kids/ |
| universal-orlando-height-requirements CTR v2 | published + distributed | live + MK cross-link; Epic 1-day amplify **staged** | tool + tickets + Amazon | https://planyourpark.com/blog/universal-orlando-height-requirements/ |
| epic-universe-1-day-plan | published + distributed | best CTR amplifier; BlogPosting logo **staged** | tickets + Amazon | https://planyourpark.com/blog/epic-universe-1-day-plan/ |
| epic-universe-tickets-guide | published | conversion trust | tickets + Amazon | https://planyourpark.com/blog/epic-universe-tickets-guide/ |
| best-magic-kingdom-rides-kids-under-40-inches | published + amplified | inbound + height tool **live**; more Disney footers **staged** | tickets | https://planyourpark.com/blog/best-magic-kingdom-rides-kids-under-40-inches/ |
| Full catalog product-naming QA (14 posts) | **published** | LL Multi/Single; Genie historical only | trust | all blog URLs |
| Height-filter SEO (`/rides/` + home) | **published** | `?height=` presets live; hub ItemList+**FAQ staged** | tickets via finder | https://planyourpark.com/rides/ · https://planyourpark.com/ |
| Amazon list/heading keyword wiring | **published** | packing conversion | Amazon | blog renderer + `blogAffiliates.tsx` |
| Helpful-links MK/height priority | **published** + Disney amplify staged | footers prioritize earners | tickets | `web/src/lib/blog.ts` |
| Phase 1 Buffer packs | queued | 15 posts 2026-07-22 | — | https://publish.buffer.com/ |
| Utility SEO + conversion pack (park SERP/OG + guides + height CTA + hub/deals/dining meta + short redirects incl. hs/mk/ak/ioa/**tickets/dining/height/ride-finder/disclosure** + blog earner amplify + home/rides/dining/about routes + helpful noindex 404 + deals FTC + park height chips / deals CTA / ticket disclosure + park JSON-LD + sponsored CTAs + local smoke + **ride preset expansion 12 deep links + sitemap presets + park-aware blog helpful links + sitewide Organization/WebSite JSON-LD + blog earner aliases + parks/rides/**blog/deals/dining** hub CollectionPage+ItemList+FAQ JSON-LD + BlogPosting publisher logo + epic-1-day/tickets-epic aliases + Disney/Universal helpful amplify + rides FAQ + about/contact/disclosure trust schema**) | **published** | **DEPLOYED 2026-08-05** `d6365ea` Netlify `6a735cc1` — live smoke **0 findings**; aliases 301; family titles + hub/home schema verified | tickets via parks/home/deals/rides | `ops/weekly/2026-08-05-deploy.md` |
| Buffer ideas 2026-07-24 (Epic 1-day / packing / heights / parks) | idea (review) | 4 packs — not queued | tickets + Amazon | https://publish.buffer.com/ |
| Buffer ideas 2026-07-25 (MK under-40 / Epic tickets / height=40) | idea (review) | 3 packs — not queued | tickets | https://publish.buffer.com/ |
| Buffer ideas 2026-07-26 (rides ranked / free things / deals / Disney guide) | idea (review) | 4 packs — not queued | tickets + Amazon | https://publish.buffer.com/ |
| Buffer ideas 2026-07-28 (Epic tickets / baby-toddler / beat crowds / character dining) | idea (review) | 4 packs — not queued | tickets | https://publish.buffer.com/ |
| Buffer ideas 2026-07-29 (MK park / Epic park / height=40 / parks hub) | idea (review) | 4 product packs — not queued | tickets | https://publish.buffer.com/ |
| Buffer ideas 2026-07-30 (IOA / USF / EPCOT / AK park pages) | idea (review) | 4 product packs — not queued | tickets | https://publish.buffer.com/ |
| Buffer ideas 2026-07-31 (HS / SeaWorld / LEGOLAND / rides height=40) | idea (review) | 4 product packs — not queued | tickets | https://publish.buffer.com/ |
| Buffer ideas 2026-08-01 (home / dining / Epic 1-day+height / park×height presets) | idea (review) | 4 product packs — not queued | tickets | https://publish.buffer.com/ |
| Buffer ideas 2026-08-02 (free things / beat crowds / Epic tickets / Universal heights) | idea (review) | 4 product packs — not queued | tickets | https://publish.buffer.com/ |
| Buffer ideas 2026-08-03 (parks hub / rides height=40 / MK under-40 / Epic 1-day+tickets) | idea (review) | 4 product packs — not queued | tickets | https://publish.buffer.com/ |
| Buffer ideas 2026-08-04 (deals/tickets / character dining / blog hub / free-things→height) | idea (review) | 4 product packs — not queued | tickets | https://publish.buffer.com/ |
| Buffer ideas 2026-08-05 (IOA/USF heights / packing kids / ride-finder trust) | idea (review) | 4 product packs — not queued | tickets + Amazon | https://publish.buffer.com/ |
| Ride preset expansion v2 + **USF filter park-name fix** + typed aliases (`/usf` `/compare` `/blog/epic-tickets` …) + blog park-aware helpful links | **awaiting_approval** (bundled w/ 08-08 landings) | local smoke PASS 2026-08-07/08; **critical USF fix** (presets/sidebar matched 0 rides before) | tickets via finder | `ops/weekly/2026-08-07-daily.md` |
| Buffer ideas 2026-08-06 (HS heights / LEGOLAND / short links / SeaWorld) | idea (review) | 4 product packs — not queued | tickets | https://publish.buffer.com/ |
| Buffer ideas 2026-08-07 (USF fixed filter / MK calm+40 / Epic tickets / compare short links) | idea (review) | 4 product packs — not queued | tickets | https://publish.buffer.com/ |
| Static height SEO landings `/rides/for/[slug]/` (18→**22**) + **calm filter fix** (thrill≤2) | **awaiting_approval** | build **61** pages; local smoke PASS 2026-08-08/09; includes prior USF fix + preset v2 | tickets via finder | `ops/weekly/2026-08-08-daily.md` |
| Buffer ideas 2026-08-08 (height landings / MK calm / Epic heights / USF vs MK) | idea (review) | 4 product packs — not queued | tickets | https://publish.buffer.com/ |
| SEO-link amplify home/parks/blog helpful → `/rides/for/*` + 4 presets (AK40/MK48/IOA48/USF48) | **awaiting_approval** (bundled w/ ride presets) | local smoke PASS 2026-08-09; compounds landings via internal links | tickets via finder | `ops/weekly/2026-08-09-daily.md` |
| Buffer ideas 2026-08-09 (crawlable heights / Epic+MK / park chips / packing+deals) | idea (review) | 4 product packs — not queued | tickets + Amazon | https://publish.buffer.com/ |
| Post-deploy smoke script (+ `--local-out`) | tool ready | local PASS; live PASS post utility deploy | — | `scripts/post_deploy_smoke.py` |
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
- [x] Content integrity clean (14/14, 2026-08-06)
- [x] Live HTML verify after deploy / full QA (2026-08-06 production blog clean; utility pack live smoke 0; **ride preset v2 + USF fix + height landings + SEO-link amplify local smoke PASS 2026-08-09** — awaiting deploy)
- [x] Deals commercial disclosure staged (2026-07-28)
- [x] Park page height chips + ticket disclosure staged (2026-07-29)
- [x] Park JSON-LD + sponsored ticket CTAs staged (2026-07-30)
- [x] Extra short aliases hs/mk/ak/ioa staged (2026-07-31)
- [x] Ride preset expansion + sitemap presets + park-aware helpful links staged (2026-08-01)
- [x] Sitewide Organization/WebSite JSON-LD + blog earner aliases staged (2026-08-02)
- [x] Parks/rides hub CollectionPage+ItemList+FAQ JSON-LD + BlogPosting publisher logo staged (2026-08-03)
- [x] Blog/deals/dining hub schema+FAQ + tickets/dining aliases + Disney/Universal helpful amplify + deals sponsored CTAs staged (2026-08-04)
- [x] Rides FAQ + about/contact/disclosure trust schema + height/ride-finder/packing-list/disclosure aliases staged (2026-08-05)
- [x] Ride preset expansion v2 (HS/SeaWorld/LEGOLAND/EPCOT48/MK-calm) + blog aliases + SeaWorld guides staged (2026-08-06)
- [x] USF filter park-name fix + FiltersContext aliases + home USF card + typed aliases + smoke needles staged (2026-08-07)
- [x] Static `/rides/for/[slug]/` SEO landings (18) + calm filter thrill≤2 fix + sitemap/smoke staged (2026-08-08)
- [x] Content integrity reconfirmed 14/14 (2026-08-08); live blog QA 14/14 PASS
- [x] SEO-link amplify home/parks/blog → `/rides/for/*` + 4 presets (22 landings, 61 pages) + smoke needles staged (2026-08-09)
- [x] Content integrity + live blog QA reconfirmed 14/14 (2026-08-09)
