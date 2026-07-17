# Deploy — 2026-07-17 integrity + redirects (APPROVED)

## Approval
- Bennett: “I approve pyp plan” (Telegram 2026-07-17)
- Interpreted as: approve **Automated AI Business Operating Plan** + pending **DEPLOY** batch (Sanity integrity rebuild + `_redirects`)

## Scope of this deploy
- `web/public/_redirects` — short park aliases + `/blog/epic-universe` → 1-day plan
- Sanity body integrity already patched CMS-side (1-day plan checklist/evening; tickets guide lists) — rebuild picks up live HTML
- Ops tooling: `scripts/content_integrity_check.py`, Buffer GraphQL idea fix, scorecard/pipeline/backlog, daily note, plan status stamp

## Not in this deploy
- Buffer `shareNow` (ideas remain review-only)
- Net-new blog publishes
- Secrets under `.hermes/`

## Verify after Netlify ready
- `https://planyourpark.com/parks/legoland` → legoland-florida
- `https://planyourpark.com/blog/epic-universe/` → epic-universe-1-day-plan
- 1-day plan body contains pre-park checklist / evening content
