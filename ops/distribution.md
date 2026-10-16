# Distribution

## Connected now (Buffer)

| Platform | Account | Buffer channel | Posting mode now |
|---|---|---|---|
| Instagram | planyourparknow | connected | Queue for review |
| Facebook | Plan Your Park | connected | Queue for review |
| Pinterest | PlanYourPark | connected (confirmed) | Queue for review + SEO descriptions |

CLI: `python3 scripts/buffer_api.py`

## Not connected / manual

| Channel | Status | Plan |
|---|---|---|
| Reddit | No account yet | Create brand account → draft answers → Telegram approve → post |
| Quora | Playbook exists | Same draft→approve pattern |
| X/Twitter | Not in Buffer | Defer until Phase 2–3 unless easy Buffer connect |
| Email | Tally embed live | Keep; no sequence automation until traffic |

## Per-publish pack (required)

For each published/updated URL:
1. FB caption + link  
2. IG caption + image (required)  
3. Pinterest title/desc/board + image + destination URL  
4. Optional Reddit comment draft if thread-fit  

All go to Buffer queue or `ops/weekly` for approval with **full links**.

## Setup checklist for Bennett (one-time)

- [ ] Confirm Buffer channels still show green in Buffer UI  
- [ ] Pinterest: business account + domain claim for planyourpark.com  
- [ ] Reddit account(s) + which subs OK  
- [ ] Quora account  
- [ ] Optional: connect X to Buffer  

## UTM convention (approved 2026-10-16)

Tag every social link:
`utm_source={facebook|instagram|pinterest}&utm_medium=social&utm_campaign=evergreen-YYYY-MM&utm_content={post-slug}`

Example (October 2026, Pinterest):
`https://planyourpark.com/blog/disney-world-packing-list/?utm_source=pinterest&utm_medium=social&utm_campaign=evergreen-2026-10&utm_content=disney-world-packing-list`
