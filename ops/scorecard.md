# Scorecard

Updated: 2026-09-01 (ride-preset + 71 height landings LIVE; OAuth restored)

## North star
Families with kids → choose the right park/rides → return + convert (tickets/gear/email).

## Baseline vs latest (28d)

| Metric | Baseline ~2026-07-22 | Latest 2026-09-01 pull | 30d target | 90d target |
|---|---:|---:|---:|---:|
| GSC clicks | 3 | **1** (GSC end 2026-08-30) | 50 | 300 |
| GSC impressions | 1,403 | **634** | 3,000 | 10,000 |
| GSC CTR | 0.21% | **0.16%** | 1.5% | 2.5%+ |
| GSC avg position | 38.7 | **22.8** (better) | 30 | 20 |
| GA4 sessions | 35 | **66** (2026-08-04→09-01) | 200 | 1,000 |
| GA4 users | 29 | **59** | 180 | 900 |
| Email subs (Tally) | unknown/low | unknown/low | 50 | 500 |
| Affiliate revenue | ~$0 tracked | ~$0 tracked | first real $ | meaningful (not tip jar) |

*OAuth restored 2026-09-01 → `.hermes/google_seo_token.json`. Analytics no longer blocked.*

## Leading indicators this sprint
- **Watch 14d CTR (utility 2026-08-05 + height landings 2026-09-01):** [height landings hub](https://planyourpark.com/rides/for/under-40/), [MK under-40 landing](https://planyourpark.com/rides/for/magic-kingdom-under-40/), [Disney under-40](https://planyourpark.com/rides/for/disney-world-under-40/), [Epic under-40](https://planyourpark.com/rides/for/epic-universe-under-40/), [Epic ranked](https://planyourpark.com/blog/epic-universe-rides-ranked-guide/), [parks](https://planyourpark.com/parks/), [packing kids](https://planyourpark.com/blog/disney-world-packing-list-kids/), [Universal heights](https://planyourpark.com/blog/universal-orlando-height-requirements/), [home](https://planyourpark.com/), [rides](https://planyourpark.com/rides/), [deals](https://planyourpark.com/deals/)
- Preserve earners: [Epic 1-day plan](https://planyourpark.com/blog/epic-universe-1-day-plan/), [MK rides under 40"](https://planyourpark.com/blog/best-magic-kingdom-rides-kids-under-40-inches/)
- Amazon live on packing paths (`tag=planyourpark-20`); Undercover Tourist ticket CTAs on commercial pages
- Integrity: **14/14 clean** (2026-09-01 deploy)
- Live blog QA: **14/14 PASS** (2026-09-01 deploy)
- Buffer channels connected: FB / IG / Pinterest
- **Utility SEO pack LIVE 2026-08-05** — tip `d6365ea` · Netlify `6a735cc1`
- **Ride presets + 71 height landings LIVE 2026-09-01** — tip `c6868a6` · Netlify `6a970db3` · live smoke 0 · sitemap 71 `/rides/for/*` — `ops/weekly/2026-09-01-deploy.md`
- Buffer: product idea packs 2026-07-24→08-23 (review only) — not queued; Ideas board **still at limit**; offline packs `ops/buffer/ideas-offline-2026-08-*.md`
- **Owner P0 done 2026-09-01:** Google SEO OAuth re-auth — GSC/GA4 live again
- Optional: **APPROVE QUEUE BUFFER** (post-deploy OK now — height URLs resolve) + prune Ideas board

## Last review
- **Deploy 2026-09-01** — ride presets + 71 height landings LIVE (`c6868a6` / Netlify `6a970db3`) — `weekly/2026-09-01-deploy.md`
- OAuth restored 2026-09-01; fresh GSC/GA4 pull on scorecard
- Ops review 2026-08-29 W35 #2 — `weekly/2026-W35-ops-2.md`
- Deploy 2026-07-22 — CTR v2 + Amazon renderer (`60dc2d9`); 15 Buffer posts queued FB/IG/Pinterest
- Deploy 2026-07-23 — height SEO + Amazon list wiring + MK amplify (`b23b2af`)
- Full blog Sanity QA + list/Amazon renderer fixes + Netlify rebuilds 2026-07-23 (`831482b` … `b337725`)
- **Daily 2026-07-24→08-05** — utility SEO pack staged + Buffer idea packs (review only)
- **Ops review 2026-08-05 (W32)** — still blind; deploy + OAuth gates — `weekly/2026-W32-ops.md`
- **Deploy 2026-08-05** — utility SEO + conversion pack **LIVE** (`d6365ea` / Netlify `6a735cc1`); live smoke exit 0 — `ops/weekly/2026-08-05-deploy.md`
- **Daily 2026-08-06** — integrity/live/smoke green; ride preset v2 + aliases staged; 4 Buffer idea packs
- **Daily 2026-08-07** — integrity/live green; **USF park-name filter bug fixed** (local); more aliases + Buffer packs; local smoke 0
- **Daily 2026-08-08** — integrity/live green; **static height SEO landings** + **calm filter fix**; Buffer packs; local smoke 0 (57 pages)
- **Ops review 2026-08-09 (W32 #2)** — analytics still blocked; utility live confirmed; ride-preset batch awaiting approve — `weekly/2026-W32-ops-2.md`
- **Daily 2026-08-09** — SEO-link amplify home/parks/blog → `/rides/for/*` + 4 presets (61 pages); Buffer packs; local smoke 0 — `weekly/2026-08-09-daily.md`
- **Daily 2026-08-10** — height-landing guides/FAQ/BreadcrumbList + ranked related; Buffer live-safe packs; local smoke 0 — `weekly/2026-08-10-daily.md`
- **Daily 2026-08-11** — **+4× 44″ landings**, mid-list ticket CTA, park calm chips, short height aliases; Buffer live-safe packs; local smoke 0 (65 pages) — `weekly/2026-08-11-daily.md`
- **Daily 2026-08-21** — **HS/EPCOT 44″ landings** + height aliases expand + blog hub amplify; Buffer live-safe packs; local smoke 0 (**67 pages / 28 landings**) — `weekly/2026-08-21-daily.md`
- **Ops review 2026-08-21 (W34)** — analytics still blocked; ride-preset batch gated; no new approvals cleared since W32 #2 — `weekly/2026-W34-ops.md`
- **Daily 2026-08-22** — **AK 48 + SeaWorld/LEGOLAND 44/48 landings** + short aliases + park-chip smoke; Buffer live-safe packs; local smoke 0 (**72 pages / 33 landings**) — `weekly/2026-08-22-daily.md`
- **Daily 2026-08-23** — **park calm-under-40 landings (8)** + short aliases + park-chip smoke; Buffer live-safe packs (3; Ideas limit); local smoke 0 (**80 pages / 41 landings**) — `weekly/2026-08-23-daily.md`
- **Daily 2026-08-25** — **park-all landings (9)** + short aliases + park-chip All heights SEO hrefs; Buffer Ideas still at limit; local smoke 0 (**89 pages / 50 landings**) — `weekly/2026-08-25-daily.md`
- **Ops review 2026-08-25 (W35)** — analytics still blocked; batch **13 commits / 50 landings** gated; Buffer Ideas full — `weekly/2026-W35-ops.md`
- **Daily 2026-08-26** — **multi-resort Disney World + Universal Orlando landings (6)** + home/parks/blog amplify + short aliases; Buffer offline packs; local smoke 0 (**95 pages / 56 landings**) — `weekly/2026-08-26-daily.md`
- **Daily 2026-08-28** — **multi-resort 44″ + calm-under-40 landings (4)** + rides-hub links + aliases; local smoke 0 (**99 pages / 60 landings**) — `weekly/2026-08-28-daily.md`
- **Daily 2026-08-29** — **multi-resort 52″ landings (2)** + blog helpful amplify to multi-resort SEO paths + hub links; local smoke 0 (**101 pages / 62 landings**) — `weekly/2026-08-29-daily.md`
- **Ops review 2026-08-29 (W35 #2)** — analytics still blocked; batch **17 commits / 62 landings** gated; multi-resort matrix complete — `weekly/2026-W35-ops-2.md`
- **Daily 2026-08-30** — **park-level 52″ landings (7)** + park chips 52″+ + rides hub amplify + short aliases; Buffer offline packs; local smoke 0 (**108 pages / 69 landings**) — `weekly/2026-08-30-daily.md`
- **Daily 2026-08-31** — **SeaWorld + LEGOLAND 52″ (+2)** + smoke park-52 overwrite fix + rides hub amplify; Buffer offline packs; local smoke 0 (**110 pages / 71 landings**) — `weekly/2026-08-31-daily.md`
