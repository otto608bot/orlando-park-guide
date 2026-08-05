# Scorecard

Updated: 2026-08-05 (daily workforce after W32 ops)

## North star
Families with kids → choose the right park/rides → return + convert (tickets/gear/email).

## Baseline (28d — last successful pull ending ~2026-07-22 GSC / GA4)
*Analytics still blocked 2026-08-05 — Google SEO OAuth `invalid_grant` on `.hermes/google_seo_token.json`. Numbers below are last successful pull (not refreshed this run). Attempted `scripts/seo_analytics_review.py --days 28` → same refresh error.*

| Metric | Baseline | 30d target | 90d target |
|---|---:|---:|---:|
| GSC clicks | 3 | 50 | 300 |
| GSC impressions | 1,403 | 3,000 | 10,000 |
| GSC CTR | 0.21% | 1.5% | 2.5%+ |
| GSC avg position | 38.7 | 30 | 20 |
| GA4 sessions | 35 | 200 | 1,000 |
| GA4 users | 29 | 180 | 900 |
| Email subs (Tally) | unknown/low | 50 | 500 |
| Affiliate revenue | ~$0 tracked | first real $ | meaningful (not tip jar) |

## Leading indicators this sprint
- **Watch 14d CTR (post 2026-07-22/23 deploys):** [Epic Universe rides ranked](https://planyourpark.com/blog/epic-universe-rides-ranked-guide/), [parks hub](https://planyourpark.com/parks/), [packing list kids](https://planyourpark.com/blog/disney-world-packing-list-kids/), [Universal height requirements](https://planyourpark.com/blog/universal-orlando-height-requirements/), [home](https://planyourpark.com/), [rides finder](https://planyourpark.com/rides/)
- Preserve earners: [Epic 1-day plan](https://planyourpark.com/blog/epic-universe-1-day-plan/), [MK rides under 40"](https://planyourpark.com/blog/best-magic-kingdom-rides-kids-under-40-inches/) — MK inbound amplify **live**
- Amazon live on packing paths (`tag=planyourpark-20`); Undercover Tourist ticket CTAs on commercial pages
- Integrity: **14/14 clean** (2026-08-05 recheck)
- Full blog product-naming QA **14/14 PASS** (Lightning Lane Multi/Single; Genie+ historical only)
- Live blog QA script: **14/14 PASS** (2026-08-05)
- Buffer channels connected: FB / IG / Pinterest (not disconnected)
- **Staged (awaiting deploy — pack extended 2026-07-24→08-05; local `main` ahead of origin):** utility SEO pack + short-path redirects (incl. **hs/mk/ak/ioa/tickets/dining/height/ride-finder/disclosure/packing-list**) + blog hub earner amplify + home/rides/dining/about conversion paths + helpful noindex 404 + deals FTC disclosure + park height chips / deals CTA / ticket disclosure + **park JSON-LD + sponsored rel on blog/home/deals ticket CTAs + local smoke gate + ride preset expansion (12) + sitemap presets + park-aware blog helpful links + sitewide Organization/WebSite JSON-LD + blog earner aliases + parks/rides/blog/deals/dining hub CollectionPage+ItemList+FAQ JSON-LD + BlogPosting publisher logo + rides hub FAQ + about/contact/disclosure trust schema** — live still has bare park titles / generic blog title / short aliases **404** / home **no ld+json** / hubs **missing schema**
- Local pre-deploy smoke: `python3 scripts/post_deploy_smoke.py --local-out web/out --fail-on high` → **PASS 2026-08-05** (after trust pack)
- Live post-deploy smoke 2026-08-05: **high findings expected** until pack ships (gates expanded again)
- Buffer: product idea packs 2026-07-24→08-05 (review only) — not queued
- **Owner P0:** re-auth Google SEO OAuth so GSC/GA4 resume (`scripts/seo_analytics_auth.py`)
- **Owner P0:** **APPROVE DEPLOY** utility SEO + conversion pack (local `main` ahead of origin)

## Last review
- Ops review 2026-07-24 — `weekly/2026-W30-ops.md`; analytics blocked; Phase 1 live measuring window open once GSC returns
- Deploy 2026-07-22 — CTR v2 + Amazon renderer (`60dc2d9`); 15 Buffer posts queued FB/IG/Pinterest
- Deploy 2026-07-23 — height SEO + Amazon list wiring + MK amplify (`b23b2af`)
- Full blog Sanity QA + list/Amazon renderer fixes + Netlify rebuilds 2026-07-23 (`831482b` … `b337725`)
- **Daily 2026-07-24→31** — utility SEO pack staged + Buffer idea packs (review only); **deploy still pending approval**
- **Ops review 2026-07-28 (W31 first)** — still blind on GSC/GA4; production blog clean; deploy + OAuth are the two gates
- **Ops review 2026-08-01 (W31 second / +4d)** — still blind; live smoke **22 high**; blog QA 14/14; Buffer still review-only
- **Daily 2026-08-01** — ride preset expansion (12) + sitemap presets + park-aware helpful links + 4 Buffer product ideas; local smoke PASS; deploy still pending
- **Daily 2026-08-02** — sitewide Organization/WebSite JSON-LD + blog earner aliases + home smoke gate + 4 Buffer product ideas; local smoke PASS; deploy still pending
- **Daily 2026-08-03** — parks/rides hub JSON-LD + BlogPosting publisher logo + epic-1-day/tickets-epic aliases + 4 Buffer product ideas; local smoke PASS; deploy still pending
- **Daily 2026-08-04** — blog/deals/dining hub JSON-LD+FAQ + H1 alignment + sponsored deals CTAs + tickets/dining aliases + Disney/Universal helpful amplify + 4 Buffer product ideas; local smoke PASS; deploy still pending
- **Ops review 2026-08-05 (W32)** — still blind; live smoke high expected; blog QA 14/14; same two owner gates (OAuth + APPROVE DEPLOY)
- **Daily 2026-08-05** — rides FAQ + about/contact/disclosure trust schema + height/ride-finder/packing-list/disclosure aliases + all-park title smoke + 4 Buffer product ideas; local smoke PASS; deploy still pending
