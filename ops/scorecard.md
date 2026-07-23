# Scorecard

Updated: 2026-07-23

## North star
Families with kids → choose the right park/rides → return + convert (tickets/gear/email).

## Baseline (28d ending 2026-07-20 GSC / 2026-07-22 GA4)
*Analytics refresh blocked 2026-07-23 — Google SEO token revoked/expired. Numbers below are last successful pull.*

| Metric | Baseline | 30d target | 90d target |
|---|---:|---:|---:|
| GSC clicks | 3 | 50 | 300 |
| GSC impressions | 1,403 | 3,000 | 10,000 |
| GSC CTR | 0.21% | 1.5% | 2.5%+ |
| GSC avg position | 38.7 | 30 | 20 |
| GA4 sessions | 35 | 200 | 1,000 |
| GA4 users | 29 | 180 | 900 |
| Email subs (Tally) | unknown/low | 50 | 500 |
| Affiliate revenue | ~$0 tracked | first real $ | meaningful (not tip jar) |

## Leading indicators this sprint
- CTR lift on: [Epic Universe rides ranked](https://planyourpark.com/blog/epic-universe-rides-ranked-guide/) (494 impr), [parks hub](https://planyourpark.com/parks/) (325 impr), [packing list for kids](https://planyourpark.com/blog/disney-world-packing-list-kids/) (pos 6.5), and [Universal height requirements](https://planyourpark.com/blog/universal-orlando-height-requirements/) (pos 10.6) — **CTR v2 + Amazon live 2026-07-22**; measure 14d
- Homepage SERP (pos ~4, 0 CTR) — **height/family meta staged** awaiting deploy
- Preserve and amplify best converters: [Epic 1-day plan](https://planyourpark.com/blog/epic-universe-1-day-plan/) (2 / 56 / 3.57%) and [Magic Kingdom rides under 40 inches](https://planyourpark.com/blog/best-magic-kingdom-rides-kids-under-40-inches/) (1 / 29 / 3.45%) — **MK inbound amplify CMS 2026-07-23** (deploy for HTML)
- Product SEO: [ride finder height presets](https://planyourpark.com/rides/) staged 2026-07-22
- Reduce `/404` hits in GA (redirects live 2026-07-17)  
- # drafts dual-QA ready for publish / deploy  
- **Owner:** re-auth Google SEO OAuth so daily analytics resume

## Last review
- Kickoff 2026-07-16 — see `weekly/2026-W29-kickoff.md`
- Daily 2026-07-17 — Buffer packs + integrity script + Sanity cliffhanger fixes (deployed and live)
- Daily 2026-07-18 — analytics stable; staged explicit inbound links into the best-CTR Epic 1-day plan from two related Epic guides (awaiting rebuild/deploy)
- Daily 2026-07-19 — verified the parks hub plus both Epic guides expose their inbound 1-day-plan links in production HTML; closed the P0 amplification work.
- Ops review 2026-07-20 — 28d GSC held at 3 clicks as impressions eased to 1,433; GA4 rose to 32 sessions / 28 users. Phase 1 now shifts from completed internal-link amplification to CTR/conversion-CTA audit.
- Daily 2026-07-20 — analytics remained at 3 GSC clicks / 1,433 impressions and 32 GA4 sessions. Production affiliate audit verified ticket CTA + disclosure coverage on five priority pages; a build-verified Amazon-renderer wiring fix is staged, not deployed.
- Daily 2026-07-21 — GSC 3/1,399 / 0.21%; GA4 35 sessions. Shipped dual-QA CTR package (Sanity titles/excerpts + parks hub meta/H1) for the four highest-leverage URLs; 4 Buffer ideas; local build verified. Awaiting deploy approval.
- Deploy 2026-07-22 — CTR v2 + Amazon renderer live (`60dc2d9`); 15 Buffer posts queued (FB/IG/Pinterest). See `weekly/2026-07-22-deploy-ctr-amazon-social.md`.
- Daily 2026-07-22 (cron) — GSC 3/1,403 / 0.21%; integrity clean. Staged height-filter SEO + homepage CTR meta + Amazon list-body completion; 3 Buffer ideas; itinerary builder one-pager. Awaiting APPROVE DEPLOY.
- Daily 2026-07-23 (cron) — Analytics token expired. Integrity clean. MK under-40 amplified via 6 Sanity inbounds + helpful-links code + 3 Buffer ideas; packing-list-kids broken outro fixed. Build OK. Deploy still blocked on approval; Google re-auth needed.
- Deploy 2026-07-23 — height SEO + Amazon list wiring + MK amplify live (`b23b2af`). See `weekly/2026-07-23-deploy.md`.
