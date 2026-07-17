# Phase 1 refresh log — 2026-07-16

## Ops cadence
- Review cron set to **every 4 days** (next ~Jul 20 10:10 CT)
- Pinterest confirmed in Buffer
- Reddit: create brand account (pending)

## Shipped to CMS / code (needs deploy for code; Sanity titles live after rebuild)

### 1) `/parks/` code refresh
- New title/meta targeting “all Orlando parks / best for kids”
- Family quick-picks, ride finder CTA, ticket CTA + disclosure
- FAQ blocks for SERP queries
- File: `web/src/app/parks/page.tsx`
- **Requires Netlify deploy**

### 2) Sanity title + excerpt (SERP CTR)
| Slug | New title |
|---|---|
| epic-universe-rides-ranked-guide | Epic Universe Rides Ranked for Families (2026) — Kids, Heights & Must-Dos |
| disney-world-packing-list-kids | Disney World Packing List for Kids (2026) — What Parents Actually Need |
| universal-orlando-height-requirements | Universal Orlando Height Requirements by Ride (2026) — Can Your Kids Ride? |

Blog metadata uses `title` + `excerpt` in `web/src/app/blog/[slug]/page.tsx`.  
Static/SSG site → **rebuild required** for live SERP tags to update.

### Dual QA (author + second pass)
- Family ICP angle present in titles
- No new height numbers invented in this pass (titles/excerpts only for blogs)
- Affiliate disclosure on parks hub
- Internal links to height posts, epic ranked, 1-day plan, rides tool
- No contradictory kid-lore added
- Build: `npm run build` in `web/` passed

### Buffer
- Ideas created (not auto-published) for 3 Phase 1 URLs

## NEED APPROVAL
1. **Deploy** web/ parks page + rebuild so Sanity title/excerpts go live  
2. Optional: queue Pinterest/FB/IG packs after deploy  

Reply: **APPROVE DEPLOY** / **REJECT** / **EDIT …**
