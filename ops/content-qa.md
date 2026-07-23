# Live blog QA process — mandatory after content work

## Why this exists
2026-07-23 failure: CMS-only dual QA passed while production showed **whole paragraphs as Amazon hyperlinks** on `/blog/beat-disney-world-crowds/`. Founder spot-check caught it. **Rendered-site QA is required.**

## Commands
```bash
# CMS structure / cliffhangers
python3 scripts/content_integrity_check.py

# LIVE rendered HTML (source of truth for format)
python3 scripts/live_blog_qa.py --fail-on high
# JSON: ops/weekly/live-blog-qa-latest.json
```

## What live QA must catch
| Code | Severity | Meaning |
|---|---|---|
| `overlong_amazon_anchor` | high | Amazon link text >60 chars (orange wall) |
| `overlong_anchor` | high/med | Non-blog external/internal sentence-links |
| `empty_heading` / `empty_list_item` | high | Broken format |
| `dead_internal_link` | high | 404 |
| `genie_plus_possibly_current` | medium | Naming regression |

## Definition of done for content batches
1. Integrity 14/14 (or current post count) clean  
2. Live QA `--fail-on high` exit 0  
3. After deploy: re-run live QA on production  
4. Do not claim “blog QA complete” from Sanity mutations alone  

## Related fixes shipped
- Unwrap CMS whole-paragraph Amazon marks (`scripts` one-shot + `normalizePortableTextBlocks` guard)  
- Affiliate auto-link tightened (`blogAffiliates.tsx`) — no description-note spam  
