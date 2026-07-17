# PYP Kickoff Ops Memo — 2026-W29

**Date:** 2026-07-16  
**Audience:** Bennett (Telegram-first)  
**Status:** Phase 0 complete · Phase 1 ready

## Decisions locked
- ICP: families with kids (park fit + ride fit)  
- Users first, **real revenue in 90 days**  
- Draft freely + dual QA; approve publish/public/spend via Telegram (full links)  
- Move to fuller automation ASAP after quality proof  
- Amazon tag `planyourpark-20` already in blog inject; tickets via Undercover Tourist  
- Keep Tally email for now  
- Bi-weekly ops reviews  
- Height finder exists — don’t rebuild; consider itinerary builder next product  

## Baseline
- GSC 28d: **5 clicks · 1,538 impr · 0.33% CTR · pos 38.7**  
- GA4 28d: **29 sessions · 28 users** · bounce ~66%  
- 404 page is #2 in GA views — fix  

## Phase 1 targets (click these on phone)

| Priority | Issue | Link |
|---|---|---|
| 1 | 497 impr, ~0 CTR | https://planyourpark.com/blog/epic-universe-rides-ranked-guide/ |
| 2 | 400 impr, 0 clicks (“all parks” queries) | https://planyourpark.com/parks/ |
| 3 | pos ~7.6, low CTR | https://planyourpark.com/blog/disney-world-packing-list-kids/ |
| 4 | pos ~11.8 | https://planyourpark.com/blog/universal-orlando-height-requirements/ |
| 5 | Already converting — amplify | https://planyourpark.com/blog/epic-universe-1-day-plan/ |
| 6 | ICP fit + clicks | https://planyourpark.com/blog/best-magic-kingdom-rides-kids-under-40-inches/ |

Analytics review command lives in repo; live dashboards:
- GA: https://analytics.google.com/  
- GSC: https://search.google.com/search-console  

## What Hermes will do next (no approval needed until publish)
1. Draft SEO refresh plans for targets 1–4  
2. Dual-QA first refresh offline  
3. Social pack drafts in Buffer ideas for best URLs  
4. Affiliate coverage check on those URLs  
5. Spec one-pager for itinerary builder (how it would work)

## Approvals needed from you soon
1. **Bi-weekly Telegram job** — confirm time (default Mon 9:45am CT every 14 days)  
2. **Distribution setup** — Pinterest domain claim? Reddit handle to use?  
3. When first refresh is ready: **Approve publish** (will send links)

## Itinerary builder (quick concept)
Not a rebuild of height filters. Flow:
1. Pick park + kids’ heights/ages + thrills OK + hours available  
2. Rank rides from existing Sanity ride data (height-OK, thrill cap, must-do flags)  
3. Output a **1-day sequence** (morning/mid/afternoon) + map-ish order heuristic  
4. Sharable results URL for SEO later  
5. CTA: tickets (Undercover Tourist) + related guides  

MVP = single-park, no live wait times. Differentiator = kid constraints baked into plan.

## Revenue path (90 days)
1. Win clicks on commercial/family pages  
2. Ticket CTAs + Amazon packing on relevant posts  
3. Expand programs once pages exist  
4. Email only after traffic justifies it  
