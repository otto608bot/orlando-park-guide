# Plan Your Park — Automated AI Business Operating Plan

> **For Hermes:** This is an operating-system + phased build plan, not a single feature PR. Implement in phases; require Bennett approval on any public/external action.

**Goal:** Run Plan Your Park as a mostly automated content + product + revenue business where Hermes researches, drafts, builds, and measures continuously, and Bennett only reviews/approves critical actions.

**Architecture:** One Hermes “company OS” for Plan Your Park with five functional loops (Intelligence → Content → Distribution → Product → Revenue), shared source-of-truth files in-repo, cron-driven cadences, and hard approval gates for anything public, paid, or partner-facing.

**Tech Stack (current):** Next.js site (`web/`), Sanity CMS, Netlify, GA4 `G-SJHPEWNBLS` + Search Console `sc-domain:planyourpark.com`, Buffer (IG/FB/Pinterest), Undercover Tourist affiliates, Tally newsletter embed, existing marketing playbooks under `marketing/`.

---

## 0. Current baseline (what’s already working)

| Capability | Status | Notes |
|---|---|---|
| Site + blog | Live | Next.js + Sanity; Netlify deploy |
| SEO measurement | Live API | GA4 property `525883145`, GSC domain property |
| Social posting plumbing | Live | Buffer API for IG / FB / Pinterest |
| Affiliates | Partial | Undercover Tourist wired; hotels/Amazon/etc. not fully online |
| Email | Partial | Tally embed; no lead-magnet funnel automation |
| Marketing playbooks | Written, not automated | Reddit / Pinterest / Quora / revenue docs |
| Content factory | Manual | Scripts exist (`create-sanity-post.js`, hero upload, etc.) |
| Product roadmap loop | Ad hoc | Ride filters/tools exist; no automated opportunity pipeline |

**Early signal from live data (Jul 2026 window):** ~29 sessions / 1.5k GSC impressions / 5 clicks. High-impression low-click pages (`epic-universe-rides-ranked-guide`, `/parks/`) are the first automated growth targets — not more random content volume.

---

## 1. North star & success metrics

### North star (proposed — confirm with Bennett)
**Become the default “plan Orlando parks with kids / accessibility / smart sequencing” site that earns affiliate + email revenue with near-zero daily founder time.**

### 90-day scorecard (proposed targets)

| Metric | Now (approx) | 30 days | 90 days |
|---|---:|---:|---:|
| Organic clicks / 28d (GSC) | 5 | 50 | 300 |
| Sessions / 28d (GA4) | 29 | 200 | 1,000 |
| Email subs | low | 100 | 500 |
| Affiliate revenue | ~$0–low | first tracked $ | $300+/mo path |
| Published posts / mo | sporadic | 8 draft→publish | 12–16 sustainable |
| Founder review time | high | <45 min/week | <30 min/week |

### Decision rule
Every automation must improve **one of:** organic clicks, email capture, affiliate conversion, product usefulness, or founder-time reduction. Kill vanity work.

---

## 2. Org model (virtual company)

Do **not** start with many Hermes profiles. Start with **one Plan Your Park profile/workspace** + role prompts + cron jobs. Split profiles only when autonomy/tooling conflicts appear.

### Roles (functions, not headcount)

| Role | Job | Autonomy | Approval needed |
|---|---|---|---|
| **CEO / Ops** (Hermes weekly) | Prioritize, scorecard, kill weak work | High (internal) | Strategy pivots, spend |
| **SEO Intelligence** | GSC/GA + trends → opportunity list | High | None for research |
| **Editor-in-Chief** | Briefs, outlines, draft posts in Sanity | High drafts | Publish |
| **Social Manager** | Buffer captions/pins/queues | Queue drafts freely | First publish per channel week / any risky claim |
| **Product Manager** | Site UX + conversion features | Specs + local PRs | Production deploy merge |
| **Revenue Lead** | Affiliates, offers, partnerships | Research + drafts | Applications, contracts, public outreach |
| **QA / Trust** | Fact check park rules, heights, links | Blocking | Cannot be skipped on publish |

### Approval matrix (critical needs only)

**Auto-OK (no ping):**
- Research, scoring, internal memos
- Sanity **drafts**, Buffer **ideas/queue drafts** if marked “pending review”
- Local code branches, tests, docs
- Analytics pulls, opportunity boards
- Updating private backlog / scorecards

**Needs Bennett approval:**
- Publish blog live / Netlify production deploy
- Public social **share now** (queued with review window can be auto after policy)
- Reddit/Quora/outreach posts under personal accounts
- New affiliate program applications
- Partnership emails
- Spending money / new paid tools
- DNS / domain / legal page changes
- Anything claiming real-time wait times / official park policy without citation

**Default social policy (proposed):**
- Create Buffer queue items as `addToQueue` with clear “REVIEW” tag in text or idea first
- Auto-publish only after Bennett enables a standing rule (e.g. “approved evergreen templates OK”)

---

## 3. Operating loops (the business machine)

```
Trend + Search demand
        ↓
Topic scorecard (revenue × demand × fit × effort)
        ↓
Content brief → draft → SEO/affiliate pass → QA
        ↓
Approve → publish
        ↓
Distribution pack (Buffer + Pinterest + internal links)
        ↓
Measure (GSC/GA) → refresh winners / kill losers
        ↓
Product + revenue experiments from friction + money pages
```

### Loop A — Weekly Intelligence (Mon)
**Inputs:** `scripts/seo_analytics_review.py`, Search trends, park news, competitor SERPs, Buffer performance if available  
**Outputs:** `ops/weekly/YYYY-WW-intel.md` with:
1. Top traffic/revenue movers
2. High-impression zero-click pages (refresh list)
3. 5 ranked content opportunities
4. 3 product ideas
5. 3 partnership/revenue ideas
6. Ask-Bennett list (only true blockers)

### Loop B — Content Factory (2–3×/week)
Pipeline stages in `ops/content-pipeline.md` (Kanban-style markdown or real Kanban):
1. **Ideas** (scored)
2. **Briefed**
3. **Drafting** (Sanity draft)
4. **QA**
5. **Ready for approval**
6. **Published**
7. **Distributed**
8. **30-day review**

**Topic scoring formula (simple, explicit):**
```
Score = 0.30*Demand + 0.25*CommercialIntent + 0.20*SERPWinability
      + 0.15*ExistingAssetLeverage + 0.10*SeasonalUrgency
      - EffortPenalty
```
Prefer:
- Epic Universe / family height / packing / tickets / 1-day plans (already showing signal)
- “Kids under X inches”, accessibility, sensory, pregnancy-safe (site moat)

Avoid:
- Generic “Disney tips” where Undercover Tourist / major blogs dominate page 1 with no angle

**Content package definition of done:**
- SEO title/meta, hero, outline H2s, FAQ, internal links, 2–4 affiliate CTAs, email CTA, social blurbs (FB/IG/Pinterest), schema-ready structure
- Accuracy notes for height/policy claims with sources
- Related posts linked

### Loop C — Distribution (same day as publish + weekly batch)
| Channel | Automation level | Notes |
|---|---|---|
| Buffer IG/FB/Pinterest | High | Use `scripts/buffer_api.py` |
| Pinterest SEO pins | High | Follow `marketing/pinterest-strategy.md` |
| Reddit | Medium (drafts) | Approval required; karma-safe value-first |
| Quora | Medium (drafts) | Approval required |
| Email | Medium | After lead magnet live |
| X/Twitter | Later | Not in Buffer org yet |

### Loop D — Product enhancements (biweekly)
Pick from measured friction:
- `/parks/` high impressions / zero clicks → better SERP title/meta + above-fold value
- 404 traffic in GA → fix redirects/internal links
- Ride filters / itinerary tools that convert to affiliate + email
- Lead magnet landing page + toolkit delivery
- CTR experiments on high-impr pages

Ship as small PRs with before/after metric hypothesis.

### Loop E — Revenue & partnerships (weekly)
**Near-term revenue stack:**
1. Ticket affiliates (Undercover Tourist) — improve placement + money pages
2. Packing/Amazon (if approved) on packing content
3. Hotels/cars later
4. Email sequences with soft ticket CTAs
5. Partnerships: hotels, stroller rental, photo, tour operators, local kid services

**Partnership machine:**
- Maintain `ops/partnerships.csv` (target, angle, status, contact, next action)
- Hermes drafts outreach; Bennett approves sends
- Offer inventory: sponsored guide, comparison placement, newsletter feature, co-branded checklist

---

## 4. Source-of-truth file layout (create in Phase 0)

```
planyourpark/
  HERMES.md                          # agent rules + approval gates for this product
  ops/
    README.md                        # how the company runs
    scorecard.md                     # live KPIs
    backlog.md                       # ideas inbox
    content-pipeline.md              # stage board
    partnerships.md                  # targets + status
    experiments.md                   # A/B and product bets
    weekly/                          # dated intel + CEO memos
    templates/
      content-brief.md
      weekly-ceo-memo.md
      social-pack.md
      partnership-outreach.md
  scripts/
    seo_analytics_*.py               # exists
    buffer_api.py                    # exists
    # add: topic_scout.py, publish_checklist.py, weekly_brief.py
  marketing/                         # strategy docs (exists)
```

---

## 5. Cadence (founder-light)

| When | What | Bennett time |
|---|---|---|
| Daily (auto) | Light monitoring; queue safe drafts | 0 |
| Mon | Weekly intel + ranked work plan | 10 min skim |
| Wed | Content approval batch (1–3 posts) | 15–20 min |
| Fri | Social/outreach approval + product PR check | 10–15 min |
| Month-end | Kill/continue scorecard + affiliate review | 20 min |

**Standing Telegram/local delivery:** weekly CEO memo + “needs approval” digest only (no noise). Align with Bennett AI Lab preference: actionable, scored, approval-gated external actions.

---

## 6. Phased build plan

### Phase 0 — Company OS (1–2 days)
**Objective:** Make autonomy safe and measurable.

Tasks:
1. Write `HERMES.md` with approval matrix + brand voice + no-go claims
2. Create `ops/` structure + scorecard seeded with current GA/GSC baselines
3. Canonical backlog from marketing docs + GSC opportunities
4. Define publish checklist script (broken links, missing affiliate CTA, missing hero, missing meta)
5. Confirm Netlify/Sanity draft vs publish workflow for agents
6. Buffer key rotation if still concerned about historical exposure

**Exit criteria:** Hermes can produce a weekly intel memo end-to-end without asking process questions.

### Phase 1 — Growth from existing assets (1–2 weeks)
**Objective:** Turn current impressions into clicks/sessions before scaling content volume.

Priority work:
1. Refresh/optimize high-impr pages:
   - `/blog/epic-universe-rides-ranked-guide/` (~497 impr)
   - `/parks/` (~400 impr)
   - packing list pages with decent position, low CTR
2. Fix 404 traffic paths seen in GA
3. Title/meta CTR experiments
4. Internal linking pass from thin → money pages
5. Ensure every top post has strong ticket CTA + email CTA

**Exit criteria:** Measurable CTR or click lift on at least 2 target URLs.

### Phase 2 — Content factory automation (2–4 weeks)
**Objective:** Reliable draft pipeline with quality gates.

Tasks:
1. Topic scout combining GSC queries + seasonal calendar + Epic Universe demand
2. Brief generator → Sanity draft via existing `create-sanity-post.js` / APIs
3. Auto social pack → Buffer ideas or queued posts marked for review
4. QA checklist (heights, dates, affiliate links, uniqueness)
5. Approval digest: “3 drafts ready” with links + score + risks

Cadence target: **2 drafts/week** until quality stable, then **3–4**.

**Exit criteria:** 4 consecutive drafts pass QA with only minor human edits.

### Phase 3 — Distribution engine (parallel with Phase 2)
1. Pinterest pin generation for each publish (image + description + board)
2. FB/IG caption variants from post
3. Reddit/Quora **draft-only** helper from playbooks
4. Optional: connect X later

**Exit criteria:** Every published post gets same-day multi-channel pack without founder writing copy.

### Phase 4 — Email + conversion (2–3 weeks)
1. Finish Disney Planning Toolkit PDF from `marketing/lead-magnet-toolkit.md`
2. Landing page `/disney-planning-toolkit` (or similar)
3. Tally/email delivery automation
4. 5-email welcome sequence (drafts; send tool approval)
5. Affiliate-aware CTAs in sequence (compliance review)

**Exit criteria:** Email capture live + first 50 subs attributed.

### Phase 5 — Product enhancements that compound SEO/revenue
Candidate roadmap (score by impact/effort each biweekly):
1. Parks hub rewrite for intent matching “all parks in Orlando”
2. Dynamic “rides for my kid’s height” sharable results pages (programmatic SEO)
3. Itinerary builder MVP (1-day park plans) with affiliate CTA
4. Deals page weekly refresh automation
5. Comparison pages: ticket options, multi-park strategies

**Exit criteria:** At least one product surface drives organic landing sessions or email captures.

### Phase 6 — Partnerships & expanded revenue
1. Trackable affiliate expansion (Get Away Today, hotels, Amazon packing)
2. Outreach list + monthly partnership sprint (drafts only until approved)
3. Media kit page once traffic exists
4. Sponsored content policy

**Exit criteria:** 2 live revenue sources with tracking + 5 partnership conversations started (if approved).

---

## 7. First 14-day execution sprint (concrete)

### Week 1
1. Stand up `HERMES.md` + `ops/` + scorecard
2. Full baseline report (GA + GSC + content inventory)
3. Optimize top 3 GSC opportunity URLs
4. Fix obvious 404/internal link waste
5. Produce 2 content briefs from scored opportunities
6. Draft 2 social packs for best existing posts (queue for approval)

### Week 2
1. Draft + QA 2 Sanity posts
2. Bennett publish approval batch
3. Distribute published/updated assets via Buffer (approved)
4. Ship one conversion improvement (CTA blocks / parks hub meta / packing affiliate)
5. First weekly CEO memo with keep/kill recommendations

---

## 8. Risk register

| Risk | Mitigation |
|---|---|
| Hallucinated park policies/heights | Source-required QA gate; cite official pages |
| Affiliate FTC issues | Disclosure pages + template language in every commercial post |
| Reddit bans | Draft-only; value-first; no link spam automation |
| Content spam / thin AI pages | Score quality; prefer refreshes + differentiated angles |
| Low traffic → overbuilding product | Phase 1–2 growth first |
| Secret leakage (Buffer key historically in repo) | Local secret file; rotate key |
| Founder bottleneck on approvals | Batch 2×/week; standing rules for low-risk templates later |
| Seasonal demand cliffs | Editorial calendar around school breaks / Epic Universe news |

---

## 9. Open questions for Bennett (decision-critical)

### Strategy
1. **Primary customer?** (families with young kids / first-timers / accessibility / budget / Universal-first?)  
2. **90-day revenue goal?** (first $100 vs path to $1k+/mo)  
3. **Brand voice non-negotiables?** (personal experience claims OK? “we visited” language rules?)

### Autonomy
4. Confirm approval matrix above — anything to tighten/loosen?  
5. After trust builds, allow auto-queue social from approved templates?  
6. Preferred approval channel: Telegram, desktop chat, email digest?

### Content & quality
7. Can we publish AI-drafted posts after QA without human line-edit every time, or always human edit once?  
8. Any parks/topics off-limits?  
9. Real-visit proof assets available (photos, notes) or stock/Sanity only?

### Revenue
10. Which programs are already approved/active beyond Undercover Tourist?  
11. OK to apply for Amazon Associates / hotel affiliates?  
12. Email tool of record: stay on Tally or move to Buttondown/ConvertKit/Beehiiv?

### Distribution
13. Reddit/Quora: use personal accounts or brand accounts? Any existing karma assets?  
14. Want X/Twitter in scope this quarter?  
15. Pinterest: business account already claimed for planyourpark.com?

### Product
16. Highest-value product bet if we only ship one in 30 days: height finder, itinerary builder, deals tracker, or toolkit funnel?  
17. Any hard constraint on Netlify/Sanity write credentials for automation?

### Ops
18. Weekly review time window (e.g., Sunday evening / Monday morning CT)?  
19. Budget for tools/images/boosts (monthly cap)?  
20. Legal entity / business name for partnerships & tax (personal vs LLC)?

---

## 10. Recommended decisions to unblock Phase 0 (defaults if silent)

If Bennett wants speed, use these defaults until overridden:

1. **Customer:** Families planning Orlando with kids (height, energy, one-day plans) + accessibility as secondary moat  
2. **Autonomy:** Draft everything freely; approve publish/social-public/outreach/spend  
3. **Next 30 days focus:** CTR/refresh winners + 2 posts/week + toolkit funnel start — not multi-agent sprawl  
4. **Primary KPI:** GSC clicks + email subs (leading); affiliate revenue (lagging)  
5. **Product bet #1:** Parks hub + height-intent pages (matches impressions + site strengths)  
6. **Social:** Buffer queue for review twice weekly; no Reddit auto-posting  
7. **Approvals:** Telegram digest if gateway available; else in this Hermes project chat  

---

## 11. What “fully automated” means here (honest definition)

**Automated:** research, scoring, drafting, QA checklists, social pack creation, analytics, backlog hygiene, experiment proposals, PR drafts.  
**Human-in-the-loop:** publish, public distribution of sensitive channels, money, partnerships, brand-risk claims.  
**Not promised:** zero involvement forever — promised **batch review only**, with a path to wider standing approvals as quality proves out.

---

## 12. Immediate next action after plan approval

1. Answer/confirm Section 9 questions (or accept Section 10 defaults)  
2. Implement Phase 0 OS files  
3. Run first real weekly intel from live GA/GSC  
4. Start Phase 1 refresh on top opportunity URLs  

**Do not** hire a complex multi-agent org chart before Phase 1 produces traffic lift.
