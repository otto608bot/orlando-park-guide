# Template: Bi-weekly ops review (Telegram)

Keep under ~40 short lines. Always include clickable HTTPS links.

## Structure

1. **Scorecard** — clicks, sessions, revenue signal vs last period  
2. **Shipped** — what went live  
3. **In review** — items needing Bennett decision (each with Approve/Reject + link)  
4. **Next 14 days** — max 5 bullets  
5. **Blockers / spend** — only if any  

## Commands the job should run

```bash
cd /Users/bennett/Hermes/planyourpark
env -u PYTHONPATH .venv-analytics/bin/python scripts/seo_analytics_review.py --days 28
# read ops/scorecard.md, ops/content-pipeline.md, ops/backlog.md
# update ops/weekly/YYYY-WXX-ops.md
```

## Approval item format

```
NEED APPROVAL: Publish refresh — Epic Universe rides ranked
Why: 497 impr / 0 CTR
Live: https://planyourpark.com/blog/epic-universe-rides-ranked-guide/
Preview/PR: <link>
Reply: APPROVE / REJECT / EDIT <notes>
```
