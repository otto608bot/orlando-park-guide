# Deploy — 2026-09-25 parks mobile + Disney vs Universal kids post

## Approval
- Founder (desktop chat, 2026-09-25): “Do the correctly level of QA for all changes then I approve the deploy.”
- Scope: parks hub mobile decision chooser + park-card Best-for labels + GA4 `park_decision_click` + published Disney vs Universal kids decision post.
- Buffer / public social not included.

## Ship
- Repo: `otto608bot/orlando-park-guide`
- Branch: `main`
- Tip SHA: `cf74148cad655a470a495b3bbf8d8f40255c0eb1` (`cf74148`)
- Netlify deploy id: `6ab6f4b389ed7300089baf7a`
- Netlify state: **ready**
- Published: 2026-09-25T22:25:23.566Z
- Site: https://planyourpark.com

## What shipped
- `/parks/` now leads with existing height/calm-ride starting points (under ~40", around 44", 52"+, calm rides).
- Park cards include “Best for” labels and a clearer family-fit action.
- GA4 `park_decision_click` records which starting point families choose.
- Published post: [Disney vs. Universal With Kids: Pick the Right Orlando Park](https://planyourpark.com/blog/disney-vs-universal-with-kids-2026/)

## Pre-deploy gates
| Check | Result |
|---|---|
| `npm run build` | PASS — 111 static pages |
| `content_integrity_check.py` | PASS — 15/15; 0 issues |
| `live_blog_qa.py --base http://127.0.0.1:4173 --fail-on high` | PASS — 15/15 |
| `post_deploy_smoke.py --local-out web/out --fail-on high` | PASS — 0 findings |
| secrets in deployed web diff | none |

## Post-deploy verify
| Check | Result |
|---|---|
| Matched Netlify commit state | READY for `cf74148` |
| `post_deploy_smoke.py --fail-on high` | PASS — 0 findings |
| `live_blog_qa.py --fail-on high` | PASS — 15/15, including the new post |
| Live `/parks/` | chooser, Best-for labels, family-fit action present |
| Live blog | overlinked intro gone; height-list links, hero, sponsored CTA, commission disclosure present |

## Remaining owner actions
- Optional Buffer queue later; Ideas board may still be full.
- Watch `park_decision_click` and affiliate events after 7–14 days.
