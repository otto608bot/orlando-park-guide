# Amazon leftover-link drafts, 2026-11-24

Sanity drafts only. Nothing in this folder publishes, merges, or deploys.

`apply.py --apply` copies nine published posts into `drafts.{id}` and routes every Amazon href through the product catalog:

- Body search links become `/dp/ASIN?tag=planyourpar0a-20`.
- Unused `affiliateCTA` HTML swaps stale ASINs for the current catalog picks.

The site applies the page tracking ID (`pyp-pack-20` and the rest) at render time, so these stored hrefs use the fallback tag on purpose.

Parked and left untouched:

- `drafts.disney-vs-universal-with-kids-2026`
- `drafts.blogPost-orlando-theme-parks-for-families`

`verify.py` checks the drafts, confirms published docs are unchanged, and confirms the parked drafts were not edited. `revert.py --apply` deletes only the nine drafts this kit created.
