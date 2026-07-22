# Deploy + social queue — 2026-07-22

**Approvals:** Bennett — APPROVE all (CTR deploy + Amazon renderer + Buffer queue)

## Deploy
- Commit: `60dc2d9` → `main` → Netlify **ready**
- Scope:
  - CTR v2 parks hub meta/H1/intro (`web/src/app/parks/page.tsx`)
  - Sanity titles/excerpts already in CMS; rebuild emitted new blog SERP tags
  - Amazon keyword renderer wiring (`blog/[slug]/page.tsx` + `blogAffiliates.tsx`)
  - Legacy Sanity token removed from write scripts (env-only)
  - Ops audit/daily notes

### Live verify
| URL | Check |
|---|---|
| https://planyourpark.com/parks/ | title contains “All Parks in Orlando for Families (2026)”; intro “Looking for all parks in Orlando” |
| https://planyourpark.com/blog/epic-universe-rides-ranked-guide/ | “All Epic Universe Rides Ranked for Kids (2026 Guide)” |
| https://planyourpark.com/blog/disney-world-packing-list-kids/ | “Disney World Kids Packing List (2026) — 25 Essentials” |
| https://planyourpark.com/blog/universal-orlando-height-requirements/ | “Universal Height Requirements 2026”; `tag=planyourpark-20` present |
| https://planyourpark.com/blog/epic-universe-1-day-plan/ | Amazon tag live |
| https://planyourpark.com/blog/epic-universe-tickets-guide/ | Amazon tag live |

## Buffer queue (addToQueue, not shareNow)
15 posts: 5 destinations × FB + IG + Pinterest. Review: https://publish.buffer.com/

| Pack | FB | IG | PIN |
|---|---|---|---|
| epic-1day | 6a60e05e18ef5a0d283bd47a | 6a60e05f2b77f9d2216cacaf | 6a60e05f4d7496e51b530b09 |
| epic-ranked | 6a60e06018ef5a0d283bd4bb | 6a60e0602b77f9d2216cacd9 | 6a60e0612b77f9d2216cad08 |
| parks | 6a60e062af791691c7f21a1d | 6a60e062342af0ddf31260d2 | 6a60e063af791691c7f21a60 |
| packing | 6a60e064342af0ddf31260f8 | 6a60e06418ef5a0d283bd4ec | 6a60e0654d7496e51b530b46 |
| heights | 6a60e065af791691c7f21a84 | 6a60e0662b77f9d2216cad37 | 6a60e066342af0ddf312611f |

### Buffer API fix (same day)
GraphQL schema drift: `assets.images[]` → `assets.image`; delete input `postId` → `id`. Fixed in `scripts/buffer_api.py`.

## Still Stage A
Public go-live is via Buffer’s automatic queue schedule (not shareNow). No Reddit/Quora posts.
