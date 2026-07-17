# Plan Your Park — Daily Workforce

## Intent
Hermes runs Plan Your Park **every day without waiting for Bennett to ping**.  
Bennett only acts on **approvals** (publish / public social / spend / DNS-legal) and the **4-day ops review**.

## Cadence

| Job | When | Channel | Purpose |
|---|---|---|---|
| **Daily workforce** | ~10:45 CT daily | Telegram (short) | Ship offline work; batch approvals |
| **Ops review** | Every 4 days | Telegram (full scorecard) | KPI + strategy + approval batch |

## Stage A autonomy (default)
**Do freely every day:** research, scoring, Sanity drafts, dual QA, local code on branch if needed, analytics, backlog hygiene, Buffer *ideas* / review-queue drafts, affiliate research, partnership drafts, content integrity checks.

**Never without approval:** live publish/deploy of net-new public claims, Buffer `shareNow`, Reddit/Quora/outreach posts, new paid tools, partner emails, DNS/legal.

**Standing deploy exception:** after Bennett says **APPROVE DEPLOY** for a named batch (or Stage B unlock), complete that batch. Do not invent new deploys beyond the approved scope.

## Daily loop (ordered)
1. **Read state:** `HERMES.md`, `ops/scorecard.md`, `ops/content-pipeline.md`, `ops/backlog.md`, latest `ops/weekly/*`
2. **Intelligence:** run  
   `env -u PYTHONPATH .venv-analytics/bin/python scripts/seo_analytics_review.py --days 28`  
   (if venv/token missing, note and continue with GSC/GA via available tools)
3. **Integrity:** scan top commercial/family posts for incomplete Sanity bodies (cliffhanger “strategy:”, mid-sentence cuts)
4. **Ship one unit of work** (pick highest ROI unfinished P0):
   - CTR meta/title/excerpt on high-impr low-CTR URLs  
   - Utility hub / internal links into ride filters  
   - Dual-QA a draft to `awaiting_approval`  
   - Buffer idea pack for a live high-value URL  
   - Conversion/affiliate placement fix  
   - Product SEO (shareable height/filter surfaces) — not greenfield rebuilds
5. **Write artifacts:** update pipeline/backlog/scorecard notes + `ops/weekly/YYYY-MM-DD-daily.md`
6. **Telegram:**  
   - If **no approvals needed:** 5–8 line “silent work done” summary (what changed, links)  
   - If **approvals needed:** full mobile links + exact `APPROVE / REJECT / EDIT` line  
   - Never wait for a human to start tomorrow’s work

## Definition of a good day
At least one of: publish-ready draft, live conversion/SEO fix staged, integrity fix, Buffer pack drafted, analytics insight that changes backlog order, or a revenue-setup step completed.

## Stage B unlock criteria
Propose Stage B when **4 consecutive** dual-QA content packages need only minor/no edits. Stage B allows standing auto-queue Buffer templates + auto-publish low-risk packages per `HERMES.md`.
