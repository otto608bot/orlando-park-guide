# Amazon Associates tag swap (Sanity DRAFTS only), 2026-11-23

New Associate ID: `planyourpar0a-20` (zero after "par", not letter O). Replaces the closed tag `planyourpark-20`.

Nothing published, merged, or production-deployed. Code changes live on branch `amazon/new-tag-2026-11-23`. Sanity writes are `drafts.*` only. Applied transaction is in `apply-result.json`.

Files: `apply.py` (dry run by default; `--apply` writes drafts.* via createOrReplace, asserts no draft existed), `mutations.json`, `manifest.json`, `publish-ids.json` (exact draft IDs to publish), `apply-result.json`, `verify.py` (read-back; output in `verify-output.txt`, ALL OK), `revert.py` (deletes only the 8 drafts created here), `backup/` (published docs BEFORE + a read-only snapshot of the untouched Universal draft).

## Drafts to publish (8)

| Draft | Post | Field | Change |
|---|---|---|---|
| `drafts.blogPost-animal-kingdom-with-kids-rides-by-height` | Animal Kingdom with Kids | body (3 links) | tag swap |
| `drafts.blogPost-disney-world-rides-for-toddlers-and-preschoolers` | Best Disney World Rides for Toddlers and Preschoolers | body (3 links) | tag swap |
| `drafts.blogPost-epcot-with-kids-rides-by-height` | EPCOT with Kids | body (3 links) | tag swap |
| `drafts.blogPost-magic-kingdom-with-kids-rides-by-height` | Magic Kingdom with Kids | body (3 links) | tag swap |
| `drafts.q5bQv6QFqWcAZeLNacauDO` | Best Magic Kingdom Rides for Kids Under 40 Inches | affiliateCTA (3 links) | tag swap |
| `drafts.q5bQv6QFqWcAZeLNacaufh` | How to Beat Disney World Crowds in 2026 | affiliateCTA (3 links) | tag swap |
| `drafts.r5PBb5Nahg2bY9okthych9` | Disney World with a Baby or Toddler | affiliateCTA (3 links) | tag swap |
| `drafts.r5PBb5Nahg2bY9okthycnn` | Universal Height Requirements 2026 | affiliateCTA (3 links) | tag swap |

The four `affiliateCTA` fields are leftover HTML on older posts. Current web code does not appear to render `affiliateCTA`; the tag was still swapped so those documents are clean when the field is used or inspected.

Packing list posts (`disney-world-packing-list`, `disney-world-packing-list-kids`) have no stored Amazon tag in Sanity. Their links come from `web/src/components/blogAffiliates.tsx` at build time.

## Do not touch (left unchanged)

| Draft | Why | Notes |
|---|---|---|
| `drafts.blogPost-universal-orlando-parks-with-kids` | Pending publish of the Universal post (rev `bHXamdrlLTlbFGrX8Ok7G6`) | Body still has 3 `planyourpark-20` links (rain poncho, waterproof phone pouch, travel stroller). Needs a separate swap after that post is handled, or a coordinated edit. |
| `drafts.disney-vs-universal-with-kids-2026` | Parked | No old tag found. |
| `drafts.blogPost-orlando-theme-parks-for-families` | PR 79, parked | No old tag found. |

Published versions of the 8 posts above still carry the old tag until these drafts are published.

## Code / disclosure changes (same PR, not live until deploy)

- Replace `planyourpark-20` with `planyourpar0a-20` in affiliate link code, disclosure, SEO JSON-LD, smoke check, and packing-list update scripts.
- Footer and `/affiliate-disclosure/` now include the exact sentence: "As an Amazon Associate I earn from qualifying purchases."
- `/deals/` tip no longer claims accessories are "often 40% cheaper than park gift shops."
