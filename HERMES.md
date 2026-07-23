# Plan Your Park — Hermes Operating Rules

Product: **Plan Your Park** (`https://planyourpark.com`)  
Repo: `/Users/bennett/Hermes/planyourpark`  
Deploy: Netlify · CMS: Sanity · Analytics: GA4 + Search Console · Social: Buffer

## Mission

Help **families with kids** figure out **which Orlando park fits them** and **which rides their kids will actually like** (height, thrill, age, energy). Grow real users first; generate **meaningful revenue within 90 days** (not tip-jar cents).

## Customer priority

1. Families with kids choosing parks / rides  
2. First-timers, accessibility, budget, Universal-first — secondary angles when commercial + useful

## Autonomy ladder

### Stage A — now (default)
- **Do freely:** research, scoring, drafts (Sanity draft / local branch), dual QA, analytics, backlog, Buffer *ideas* or clearly labeled review queue drafts, affiliate research, partnership *drafts*
- **Ask Bennett (Telegram):** publish live, public social “share now”, Reddit/Quora/outreach posts, new tool spend, partner emails, DNS/legal, affiliate *applications* only if account access needed from him

### Stage B — after quality proves out (explicit unlock)
- Standing rules for: auto-queue Buffer from approved templates, auto-merge low-risk SEO meta, auto-publish content that passes dual QA + checklist with no brand-risk flags

**Goal:** move A → B quickly. Track QA pass rate; propose Stage B unlock when 4 consecutive posts need only minor/no edits.

## Approval UX (Telegram-first)

Every approval request **must include mobile-friendly links**:
- Live URL or draft preview
- GA/GSC or PR links when relevant
- Exact decision asked (Approve publish / Approve queue / Reject / Edit)
- Risk notes (policy claims, medical, affiliate)

Chat: Bennett Telegram DM (gateway). Ops review every 4 days is the standing scorecard; urgent approvals can interrupt. Work between reviews is continuous, not day-gated.

## Content rules

- Topics must serve site objectives **and** preferably monetize (tickets, packing Amazon, deals)
- **Dual QA:** author agent + separate QA pass (facts, heights, links, disclosure, uniqueness)
- Voice: **“we” OK**. Kid anecdotes only if consistent with a stable family voice — avoid contradictory ages/stories across posts. Prefer evergreen “with our kids” only when carefully tracked in `ops/brand-voice.md`
- Heroes/images: **AI-generated in existing blog visual style**, relevant to the post
- No reckless real-time wait times or official policy claims without citation
- FTC: affiliate disclosure where commercial links appear

## Monetization stack

| Rail | Status | Notes |
|---|---|---|
| Undercover Tourist (CJ) | Active | Primary ticket CTA |
| Amazon Associates `tag=planyourpark-20` | Active in blog inject | Packing/gear posts |
| Hotels / cars / more ticket programs | Apply / expand | Ask Bennett only if login/action required |
| Email (Tally) | Keep for now | Not critical until traffic; revisit after organic lift |
| Partnerships | Later | Draft outreach only until approved |

## Distribution channels

| Channel | Tool | Autonomy now |
|---|---|---|
| Instagram | Buffer `planyourparknow` | Draft/queue for review |
| Facebook | Buffer `Plan Your Park` | Draft/queue for review |
| Pinterest | Buffer `PlanYourPark` | Draft/queue for review |
| Reddit / Quora | Manual accounts | Draft only → approve |
| X/Twitter | Not connected | Optional later |
| Email | Tally embed | Keep; no heavy sequence until volume |

## Product notes

- **Height / ride finder:** already live via ride filters — improve SEO surfaces & shareable results rather than rebuild
- **Itinerary builder (future):** 1-day park plans from ride data + kid constraints → sharable page + affiliate CTA (spec before build)
- Prefer compounding SEO product pages over novel features

## Cadence

- **Continuous work (default):** when cleanup or high-ROI items are open, finish them in the active session — do **not** pace by calendar days. Daily cron is a **catch-up net**, not a speed limit. See `ops/workforce.md`.
- **Daily workforce (~10:45 CT, Telegram):** autonomous loop if no session is already draining the backlog — analytics → integrity → **as many units as fit** → update `ops/` → short Telegram note. Does **not** wait for Bennett to ping.
- **Ops review every 4 days (Telegram):** scorecard, wins, approvals batch, next 4 days plan — full links
- **Between reviews:** silent continuous work; ping only for blockers/approvals (or a brief “done / no action” note)
- Tools/spend: propose as needed with $ and why
- **Pinterest:** live in Buffer — use for every publish pack
- **Reddit:** create brand account when ready; draft-only until approved

## Key commands / paths

```bash
# Analytics
env -u PYTHONPATH .venv-analytics/bin/python scripts/seo_analytics_review.py --days 28

# Social
python3 scripts/buffer_api.py profiles
python3 scripts/buffer_api.py idea "..."

# Site
cd web && npm run build
```

Secrets (gitignored): `.hermes/google_seo_token.json`, `.hermes/buffer_api_key`, `.hermes/netlify_auth_token`, `.hermes/netlify_site_id`  
Also in `~/.hermes/.env`: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID` (planyourpark site)

## Definition of weekly success

At least one of: more GSC clicks, better CTR on target URLs, a publish-ready draft, a conversion fix shipped, or a revenue setup step completed — without requiring Bennett to drive the work.
