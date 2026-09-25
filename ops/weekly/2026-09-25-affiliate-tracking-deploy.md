# Deploy — 2026-09-25 affiliate-click tracking

## Approval
- Founder (desktop chat, 2026-09-25): “Yeah lets deploy.”
- Scope: production deploy of the previously staged GA4 sponsored-outbound-click tracker only.
- Buffer/public social not included.

## Ship
- Repo: `otto608bot/orlando-park-guide`
- Branch: `main`
- Tip SHA: `408cc2c2c0a480852dc669bd57734894cb9cde8e` (`408cc2c`)
- Netlify deploy id: `6ab67243c35a3a0008e66abc`
- Netlify state: **ready**
- Published: 2026-09-25T13:09:03Z
- Site: https://planyourpark.com

## What shipped
- `affiliate_click` GA4 event on sponsored outbound links.
- Captures `page_path`, `destination_type` (tickets, Amazon, marketplace, or sponsored external), `link_text`, and `link_url`.
- Existing affiliate destinations and page copy were unchanged.

## Pre-deploy gates
| Check | Result |
|---|---|
| `npm run build` | PASS — 110 static pages |
| `content_integrity_check.py` | PASS — 14/14; 0 issues |
| `live_blog_qa.py --fail-on high` | PASS — 14/14 |
| `post_deploy_smoke.py --local-out web/out --fail-on high` | PASS — 0 findings |
| secrets in deployed web diff | none |

## Post-deploy verify
| Check | Result |
|---|---|
| Matched Netlify commit state | READY for `408cc2c` |
| `post_deploy_smoke.py --fail-on high` | PASS — 0 findings |
| Live production JavaScript | `affiliate_click`, `destination_type`, `page_path`, and `link_text` present |

## Measurement baseline
- Fresh GA4, 2026-08-28→2026-09-25: 114 sessions, 92 users, 60 organic-search sessions.
- Fresh GSC, through 2026-09-23: 10 clicks, 1,296 impressions, 0.77% CTR, average position 18.8.
- The tracker measures new outbound affiliate behavior prospectively; historic 10 clicks are Google Search clicks, not affiliate-click events.

## Next
1. Monitor `affiliate_click` events, beginning with the Disney packing-list-for-kids and Epic ticket-guide paths.
2. Use the first 7–14 days of event data to target CTA and CTR improvements.
3. Optionally reconcile events to CJ / Undercover Tourist commission reporting once commercial clicks arrive.
