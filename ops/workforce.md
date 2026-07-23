# Plan Your Park — Daily Workforce

## Intent
Hermes runs Plan Your Park **continuously without waiting for Bennett to ping** and **without artificial day-pacing**.  
If cleanup or high-ROI work is unfinished, **keep going in the same session until the batch is done** (or blocked on approval/secrets).  
Bennett only acts on **approvals** (publish / public social / spend / DNS-legal) and the **4-day ops review**.

## Cadence

| Job | When | Channel | Purpose |
|---|---|---|---|
| **Continuous work** | Any session / cron / chat | Repo + Telegram when needed | Drain cleanup + backlog; do not stop after “one unit” if more cleanup remains |
| **Daily workforce cron** | ~10:45 CT daily | Telegram (short) | Catch-up if no active session; still allowed to ship **multiple** units per run |
| **Ops review** | Every 4 days | Telegram (full scorecard) | KPI + strategy + approval batch |

## Stage A autonomy (default)
**Do freely:** research, scoring, Sanity drafts, dual QA, local code, analytics, backlog hygiene, Buffer *ideas* / review-queue drafts, affiliate research, partnership drafts, content integrity checks, repo cleanup, security hygiene (remove hardcoded secrets from scripts), internal linking, conversion wiring that completes an already-approved rail.

**Never without approval:** live publish/deploy of **net-new public claims**, Buffer `shareNow`, Reddit/Quora/outreach posts, new paid tools, partner emails, DNS/legal, **new** affiliate program applications needing founder login.

**Standing deploy exception:** after Bennett says **APPROVE DEPLOY** for a named batch (or Stage B unlock), complete that batch end-to-end (commit → push → Netlify ready → live verify). Completing a **already-approved** incomplete fix (e.g. Amazon wiring that still misses list bodies) may ship without re-asking when scope is clearly the same rail.

## Continuous cleanup rule
When the founder says cleanup / “don’t wait for days” / full automation pressure:
1. Inventory remaining cleanup (integrity, secrets, junk files, broken conversion paths, stale ops, redirects, dead drafts).
2. Execute **all** non-blocked items in one run.
3. Only stop for true blockers (approval, missing secret, external account action).
4. Do **not** schedule leftover cleanup for “tomorrow’s daily” if it can finish now.

## Daily / session loop (ordered)
1. **Read state:** `HERMES.md`, `ops/scorecard.md`, `ops/content-pipeline.md`, `ops/backlog.md`, latest `ops/weekly/*`
2. **Intelligence:** run  
   `env -u PYTHONPATH .venv-analytics/bin/python scripts/seo_analytics_review.py --days 28`  
   (if venv/token missing, note and continue)
3. **Integrity (CMS):** `python3 scripts/content_integrity_check.py`  
   **Live format QA (required after any content change):** `python3 scripts/live_blog_qa.py --fail-on high`  
   Live QA audits **rendered HTML** (overlong Amazon anchors, empty headings/lis, dead internal links, Genie+ framing). CMS-only QA is **not sufficient**.  
4. **Drain work** (highest ROI unfinished items first; multiple units OK):
   - Content integrity + **live HTML QA failures** first  
   - Conversion/affiliate wiring completeness (no whole-paragraph links; no junk mid-sentence Amazon spam)  
   - CTR meta/title/excerpt on high-impr low-CTR URLs  
   - Utility hub / internal links into ride filters  
   - Dual-QA drafts to `awaiting_approval`  
   - Buffer idea/queue packs for live high-value URLs (queue only with approval / Stage B)  
   - Repo hygiene (gitignore, token removal, tmp junk)  
   - Product SEO (shareable height/filter surfaces) — not greenfield rebuilds
5. **Write artifacts:** update pipeline/backlog/scorecard + `ops/weekly/YYYY-MM-DD-*.md`
6. **Telegram / chat:**  
   - If **no approvals needed:** short “done / still working / No action needed”  
   - If **approvals needed:** full mobile links + exact `APPROVE / REJECT / EDIT`  
   - Never wait for a human to start the next unit of offline work

## Content QA definition of done
A blog content batch is **not done** until:
1. Sanity integrity clean  
2. `scripts/live_blog_qa.py --fail-on high` exits 0 against **production** (or local `out/` after build)  
3. Spot-check at least one commercial post in a real browser path (or browser tool snapshot) for orange whole-paragraph links / broken lists  
4. Netlify deploy verified with string checks on fixed URLs
## Definition of a good session
At least one of: cleanup batch closed, publish-ready draft, live conversion/SEO fix shipped or staged, integrity fix, Buffer pack drafted/queued (per policy), analytics insight that changes backlog order, or a revenue-setup step completed — **and** no known cleanup left idle purely to “save for tomorrow.”

## Stage B unlock criteria
Propose Stage B when **4 consecutive** dual-QA content packages need only minor/no edits. Stage B allows standing auto-queue Buffer templates + auto-publish low-risk packages per `HERMES.md`.
