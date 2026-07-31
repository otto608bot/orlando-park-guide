# Scorecard

Updated: 2026-07-31 (daily workforce)

## North star
Families with kids → choose the right park/rides → return + convert (tickets/gear/email).

## Baseline (28d — last successful pull ending ~2026-07-22 GSC / GA4)
*Analytics still blocked 2026-07-31 — Google SEO OAuth `invalid_grant` on `.hermes/google_seo_token.json`. Numbers below are last successful pull (not refreshed this run). Attempted `scripts/seo_analytics_review.py --days 28` → same refresh error.*

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
- Integrity: **14/14 clean** (2026-07-31 recheck)
- Full blog product-naming QA **14/14 PASS** (Lightning Lane Multi/Single; Genie+ historical only)
- Live blog QA script: **14/14 PASS** (2026-07-31)
- Buffer channels connected: FB / IG / Pinterest (not disconnected)
- **Staged (awaiting deploy — pack extended 2026-07-31):** utility SEO pack + short-path redirects (incl. **hs/mk/ak/ioa**) + blog hub earner amplify + home/rides/dining/about conversion paths + helpful noindex 404 + deals FTC disclosure + park height chips / deals CTA / ticket disclosure + **park JSON-LD + sponsored rel on blog/home ticket CTAs + local smoke gate** — live still has bare park titles / generic blog title / `/epic-universe` **404** / `/universal` **404** / `/parks/epic` **404**
- Local pre-deploy smoke: `python3 scripts/post_deploy_smoke.py --local-out web/out --fail-on high` → **PASS 2026-07-31**
- Post-deploy smoke: `scripts/post_deploy_smoke.py` (prod baseline still ~14 high — expected)
- Buffer: product idea packs 2026-07-31 (HS / SeaWorld / LEGOLAND / rides height=40) + prior 07-24→30 packs — review only
- **Owner P0:** re-auth Google SEO OAuth so GSC/GA4 resume (`scripts/seo_analytics_auth.py`)
- **Owner P0:** **APPROVE DEPLOY** utility SEO + conversion pack (local `main` ahead of origin)

## Last review
- Ops review 2026-07-24 — `weekly/2026-W30-ops.md`; analytics blocked; Phase 1 live measuring window open once GSC returns
- Deploy 2026-07-22 — CTR v2 + Amazon renderer (`60dc2d9`); 15 Buffer posts queued FB/IG/Pinterest
- Deploy 2026-07-23 — height SEO + Amazon list wiring + MK amplify (`b23b2af`)
- Full blog Sanity QA + list/Amazon renderer fixes + Netlify rebuilds 2026-07-23 (`831482b` … `b337725`)
- **Daily 2026-07-24→30** — utility SEO pack staged + Buffer idea packs (review only); **deploy still pending approval**
- **Ops review 2026-07-28 (W31)** — still blind on GSC/GA4; production blog clean; deploy + OAuth are the two gates
- **Daily 2026-07-31** — extra short aliases (hs/mk/ak/ioa) + smoke coverage + 4 more product Buffer ideas; local smoke PASS; deploy still pending
