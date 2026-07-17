# Content breakage fix — 2026-07-16

## Root cause
Several Sanity blog bodies were **incomplete**, not a frontend render bug:
- Sections ended after “Here’s the optimal strategy:” with no steps
- Sample schedules promised then missing
- Ticket guide cut mid-sentence; some H3s had no body

Site is `output: "export"` → **Netlify rebuild required** for CMS body fixes to go live.

## Fixed in Sanity (awaiting deploy)
1. https://planyourpark.com/blog/epic-universe-rides-ranked-guide/ — completed ride strategy + closing CTAs  
2. https://planyourpark.com/blog/epic-universe-1-day-plan/ — priority ride list + full sample schedule  
3. https://planyourpark.com/blog/epic-universe-tickets-guide/ — completed truncations, empty section copy, closing CTA  

## Still watch
- `universal-orlando-summer-2026` had many mid-sentence fragments in an earlier audit; re-check after deploy  
- Add a content QA script: flag bodies ending with “:” or mid-clause before publish  

## NEED APPROVAL
**APPROVE DEPLOY** to push parks refresh + rebuilt blog HTML with completed bodies.
