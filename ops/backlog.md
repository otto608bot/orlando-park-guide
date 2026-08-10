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
- [ ] **Re-auth Google SEO token** — analytics still blocked 2026-08-08 (`invalid_grant`) — ops P0 owner action (W32 ops)
- [x] **DEPLOY** Utility SEO + conversion pack 2026-07-24→08-05 — **APPROVED + DEPLOYED 2026-08-05** tip `d6365ea` Netlify `6a735cc1` — live smoke 0 findings; aliases/titles/schema verified — `ops/weekly/2026-08-05-deploy.md`
- [x] Deals page FTC disclosure (header + affiliate-disclosure link) — staged 2026-07-28
- [x] Buffer idea packs Epic tickets / baby-toddler / beat crowds / character dining — **created 2026-07-28** (review only)
- [x] Park page height chips + deals CTA + ticket disclosure — staged 2026-07-29
- [x] Post-deploy smoke script — `scripts/post_deploy_smoke.py` (2026-07-29; **`--local-out` 2026-07-30**)
- [x] Buffer product idea packs MK/Epic park + height=40 + parks hub — **created 2026-07-29** (review only)
- [x] Park JSON-LD (TouristAttraction/FAQ/Breadcrumb) + sponsored CTA compliance — staged 2026-07-30
- [x] Buffer product idea packs IOA / USF / EPCOT / AK — **created 2026-07-30** (review only)
- [x] Local smoke PASS on staged pack — 2026-07-30 / **reconfirmed through 2026-08-08** (`--local-out web/out`)
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
- [x] Rides hub FAQ + about/contact/disclosure trust schema + height/ride-finder/packing-list/disclosure aliases + all-park title smoke — staged 2026-08-05
- [x] Buffer product idea packs IOA/USF heights / packing kids / ride-finder trust — **created 2026-08-05** (review only)
- [x] Ride preset expansion v2 (HS/SeaWorld/LEGOLAND/EPCOT48/MK-calm) + blog aliases baby/toddler/crowds/free/rides-ranked + SeaWorld guide cards — **staged 2026-08-06** (local smoke PASS)
- [x] Buffer product idea packs HS heights / LEGOLAND / short links / SeaWorld — **created 2026-08-06** (review only)
- [x] **USF filter park-name fix** — FilterSidebar/presets/blog/home use `Universal Studios Florida`; FiltersContext aliases legacy `Universal Studios`; typed aliases `/usf` `/compare` etc. — **staged 2026-08-07** (local smoke PASS)
- [x] Buffer product idea packs USF fixed filter / MK calm+40 / Epic tickets pack / compare short links — **created 2026-08-07** (review only)
- [x] **Static height SEO landings** `/rides/for/[slug]/` (18 pages) + sitemap + hub cards — **staged 2026-08-08** (local smoke PASS)
- [x] **Calm filter fix** (thrill≤2; was 0 matches on accessibility tags) — **staged 2026-08-08**
- [x] Buffer product idea packs height landings / MK calm / Epic heights / USF vs MK — **created 2026-08-08** (review only)
- [x] **SEO-link amplify** — home/parks/blog helpful → crawlable `/rides/for/*` via `rideLinkFor`; **+4 presets** (AK under-40, MK/IOA/USF 48) — **staged 2026-08-09** (local smoke PASS, 61 pages)
- [x] Buffer product idea packs crawlable heights / Epic+MK / park chips / packing+deals — **created 2026-08-09** (review only)
- [x] **Height landing conversion polish** — ranked related presets + park-aware next-step guides (Epic 1-day / MK under-40 / Universal heights / packing / deals) + expanded FAQ + BreadcrumbList JSON-LD — **staged 2026-08-10** (local smoke PASS)
- [x] Buffer product idea packs Epic 1-day / packing+deals / MK under-40 / parks hub — **created 2026-08-10** (review only; live-safe URLs)
- [ ] **DEPLOY** Ride preset expansion v2 + USF filter fix + static height landings + calm filter + SEO-link amplify + landing conversion polish + blog/typed aliases — awaiting **APPROVE DEPLOY RIDE PRESETS**
- [ ] Queue 2026-07-28 + 2026-07-29 + 2026-07-30 + 2026-07-31 + 2026-08-01 + 2026-08-02 + 2026-08-03 + 2026-08-04 + 2026-08-05 + 2026-08-06 + 2026-08-07 + 2026-08-08 + 2026-08-09 + 2026-08-10 Buffer idea packs when ready
- [x] After utility deploy: `python3 scripts/post_deploy_smoke.py --fail-on high` → **exit 0** (2026-08-05 live, 0 findings; reconfirmed 2026-08-06; production still utility-only through 2026-08-10 pending ride-preset batch)

## P1
- [x] Itinerary builder one-pager spec (uses ride DB + kid constraints) — `ops/specs/itinerary-builder.md`  
- [x] Height-filter SEO: shareable URLs or landing copy — **live** `/rides/` presets + meta (`b23b2af`); **static landings staged** 2026-08-08  
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
- [ ] Queue 2026-07-24 + 2026-07-25 + 2026-07-26 + 2026-07-28 + 2026-07-29 + 2026-07-30 + 2026-07-31 + 2026-08-01 + 2026-08-02 + 2026-08-03 + 2026-08-04 + 2026-08-05 + 2026-08-06 + 2026-08-07 + 2026-08-08 + 2026-08-09 + 2026-08-10 Buffer idea packs when ready
- [ ] Watch CTR v2 + height SEO 14d post-deploy (ranked guide, parks, packing, home, rides)
- [x] After utility SEO deploy: watch park landing CTR (esp. Magic Kingdom, Epic Universe) + verify `/epic-universe` 301 + home/dining conversion paths + helpful 404 + park height chips + JSON-LD + short aliases + sitemap height presets + home Organization/WebSite + blog earner aliases + parks/rides/blog/deals/dining hub FAQ/ItemList + BlogPosting publisher logo + `/tickets` `/dining` + about/disclosure trust schema + `/height` `/ride-finder` — **live verify PASS 2026-08-05** (`d6365ea`); CTR watch still needs GSC re-auth; **reconfirmed live smoke 0 on 2026-08-06**
- [ ] After ride preset v2 + USF fix + height landings + SEO-link amplify + landing conversion polish deploy: verify HS/LEGOLAND/SeaWorld presets on `/rides/` + USF preset uses `Universal Studios Florida` + filter checkbox selects rides + new aliases 301 (`/usf` `/compare` `/blog/epic-tickets` …) + sitemap includes SEO `/rides/for/*` (22) + calm filter returns rides + home/parks link to SEO paths + height landings show BreadcrumbList + park-aware guides + live smoke 0

## P2
- [ ] Lead magnet PDF + light email welcome (after traffic)  
- [ ] Reddit/Quora draft engine  
- [ ] X channel  
- [ ] Expand programmatic “rides for height X at park Y” beyond current 18 presets  
- [ ] Itinerary builder v1 after height SEO live + 2w CTR data (see spec)

## Parking lot
- Media kit, sponsorships, multi-language  
