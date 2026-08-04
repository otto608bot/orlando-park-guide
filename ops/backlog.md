# Backlog

## P0 — this sprint
- [x] Refresh meta/H1/intro/CTAs: Epic Universe rides ranked (titles + body integrity)  
- [x] Refresh `/parks/` for “all parks in Orlando” intent  
- [x] CTR pass: packing list kids + Universal height requirements (titles/excerpts)  
- [x] Dual-QA content SOP dry run on Phase 1 refresh  
- [x] Post-deploy: Buffer social packs for Phase 1 URLs (ideas → **queued 2026-07-22**)  
- [x] Content integrity script (flag cliffhanger bodies before publish) — `scripts/content_integrity_check.py`  
- [x] Fix/reduce `/404` traffic — redirects deployed 2026-07-17 (`web/public/_redirects` short/alias park + epic-universe paths)  
- [x] Amplify epic-universe-1-day-plan (best CTR) — parks hub, rides-ranked guide, and tickets guide inbound links live  
- [x] **DEPLOY** Sanity integrity patches + redirects rebuild — **APPROVED 2026-07-17**  
- [x] CTR package v2 + Amazon renderer — **APPROVED + DEPLOYED 2026-07-22** (`60dc2d9`)  
- [x] **DEPLOY** Height-filter SEO + homepage CTR meta + Amazon list-body + helpful-links MK amplify + Sanity MK inbound rebuild — **APPROVED + DEPLOYED 2026-07-23** (`b23b2af`) — see `ops/weekly/2026-07-23-deploy.md`
- [ ] **Re-auth Google SEO token** — analytics still blocked 2026-08-04 (`invalid_grant`) — ops P0 owner action (W31 ops)
- [ ] **DEPLOY** Utility SEO + conversion pack 2026-07-24→08-04 — park SERP/OG + preferred guide cards + height-filter CTA + blog/deals/dining meta + **short-path redirects** (`/epic-universe` live 404) + blog hub earner amplify + **home/rides/dining/about conversion paths + helpful noindex 404 + deals FTC disclosure + park height chips / deals CTA / ticket disclosure + park JSON-LD + sponsored blog/home/deals CTAs + local smoke gate + hs/mk/ak/ioa/tickets/dining aliases + ride preset expansion (12) + sitemap preset URLs + park-aware blog helpful links + sitewide Organization/WebSite JSON-LD + blog earner aliases + parks/rides/blog/deals/dining hub CollectionPage+ItemList+FAQ JSON-LD + BlogPosting publisher logo + epic-1-day/tickets-epic aliases + Disney/Universal helpful amplify** (local ahead of origin; pack extended 2026-08-04 — see `ops/weekly/2026-08-04-daily.md` + W31 ops)
- [x] Deals page FTC disclosure (header + affiliate-disclosure link) — staged 2026-07-28
- [x] Buffer idea packs Epic tickets / baby-toddler / beat crowds / character dining — **created 2026-07-28** (review only)
- [x] Park page height chips + deals CTA + ticket disclosure — staged 2026-07-29
- [x] Post-deploy smoke script — `scripts/post_deploy_smoke.py` (2026-07-29; **`--local-out` 2026-07-30**)
- [x] Buffer product idea packs MK/Epic park + height=40 + parks hub — **created 2026-07-29** (review only)
- [x] Park JSON-LD (TouristAttraction/FAQ/Breadcrumb) + sponsored CTA compliance — staged 2026-07-30
- [x] Buffer product idea packs IOA / USF / EPCOT / AK — **created 2026-07-30** (review only)
- [x] Local smoke PASS on staged pack — 2026-07-30 / **reconfirmed 2026-07-31 / 2026-08-01 / 2026-08-02 / 2026-08-03 / 2026-08-04** (`--local-out web/out`)
- [x] Extra short aliases hs/mk/ak/ioa + smoke coverage — staged 2026-07-31
- [x] Buffer product idea packs HS / SeaWorld / LEGOLAND / rides height=40 — **created 2026-07-31** (review only)
- [x] Ride preset expansion (12 deep links) + sitemap presets + park-aware helpful links — staged 2026-08-01
- [x] Buffer product idea packs home / dining / Epic 1-day+height / park×height share pack — **created 2026-08-01** (review only)
- [x] Sitewide Organization/WebSite JSON-LD + root family meta + blog earner aliases + home smoke gate — staged 2026-08-02
- [x] Buffer product idea packs free things / beat crowds / Epic tickets / Universal heights — **created 2026-08-02** (review only)
- [x] Parks/rides hub CollectionPage+ItemList+FAQ JSON-LD + BlogPosting publisher logo + epic-1-day/tickets-epic aliases — staged 2026-08-03
- [x] Buffer product idea packs parks hub / rides height=40 / MK under-40 / Epic 1-day+tickets — **created 2026-08-03** (review only)
- [x] Blog/deals/dining hub JSON-LD+FAQ + H1 alignment + sponsored deals CTAs + tickets/dining aliases + Disney/Universal helpful amplify — staged 2026-08-04
- [x] Buffer product idea packs deals/tickets / character dining / blog hub / free-things→height — **created 2026-08-04** (review only)
- [ ] Queue 2026-07-28 + 2026-07-29 + 2026-07-30 + 2026-07-31 + 2026-08-01 + 2026-08-02 + 2026-08-03 + 2026-08-04 Buffer idea packs when ready
- [ ] After utility deploy: `python3 scripts/post_deploy_smoke.py --fail-on high` → exit 0

## P1
- [x] Itinerary builder one-pager spec (uses ride DB + kid constraints) — `ops/specs/itinerary-builder.md`  
- [x] Height-filter SEO: shareable URLs or landing copy — **live** `/rides/` presets + meta (`b23b2af`)  
- [x] Queue Buffer posts from idea packs — 15 posts FB/IG/Pinterest queued 2026-07-22 (addToQueue)  
- [x] Affiliate inventory audit on top posts — 2026-07-20; Amazon wiring live 2026-07-22; list-body complete 2026-07-23  
- [x] Review packing-list Portable Charger Amazon gear path — list/heading processor **live** (57 tags on packing kids)  
- [ ] Apply remaining ticket/hotel programs  
- [x] Inbound internal links → epic-universe-1-day-plan from high-impr pages  
- [x] Rotate/revoke legacy Sanity token — **Rufus New deleted 2026-07-23** (kept Herman Editor); scripts env-only
- [x] Amplify MK under-40 (earning clicks) with inbound Sanity links + helpful-links routing + 3 Buffer ideas — **HTML live 2026-07-23**
- [ ] Queue MK under-40 Buffer ideas when ready (ideas created 2026-07-22 + 2026-07-23 + 2026-07-25)
- [x] Buffer idea packs for Epic 1-day / packing kids / Universal heights / parks hub — **created 2026-07-24** (review only; not queued)
- [x] Buffer idea packs MK under-40 / Epic tickets / height=40 product — **created 2026-07-25** (review only)
- [x] Buffer idea packs rides ranked / free things / deals / Disney guide — **created 2026-07-26** (review only)
- [ ] Queue 2026-07-24 + 2026-07-25 + 2026-07-26 + 2026-07-28 + 2026-07-29 + 2026-07-30 + 2026-07-31 + 2026-08-01 + 2026-08-02 + 2026-08-03 + 2026-08-04 Buffer idea packs when ready
- [ ] Watch CTR v2 + height SEO 14d post-deploy (ranked guide, parks, packing, home, rides)
- [ ] After utility SEO deploy: watch park landing CTR (esp. Magic Kingdom, Epic Universe) + verify `/epic-universe` 301 + home/dining conversion paths + helpful 404 + park height chips + JSON-LD + short aliases + sitemap height presets + home Organization/WebSite + blog earner aliases + parks/rides/blog/deals/dining hub FAQ/ItemList + BlogPosting publisher logo + `/tickets` `/dining`

## P2
- [ ] Lead magnet PDF + light email welcome (after traffic)  
- [ ] Reddit/Quora draft engine  
- [ ] X channel  
- [ ] Programmatic “rides for height X at park Y” pages  
- [ ] Itinerary builder v1 after height SEO live + 2w CTR data (see spec)

## Parking lot
- Media kit, sponsorships, multi-language  
