# Blog full QA deploy — 2026-07-23

## Scope
Full quality pass on **all 14** published Sanity blog posts (author batches A/B/C + integrity).

### Product naming (authoritative)
- **Retired:** Genie+ / Disney Genie+ (July 24, 2024)
- **Current Disney paid skip-the-line:** Lightning Lane Multi Pass + Lightning Lane Single Pass
- **Universal:** Express / Express Unlimited (not Lightning Lane)

### Batches
- A: `ops/weekly/2026-07-23-blog-qa-batch-a.md`
- B: `ops/weekly/2026-07-23-blog-qa-batch-b.md`
- C: `ops/weekly/2026-07-23-blog-qa-batch-c.md`

### Pre-deploy checks
- content_integrity_check.py: **14/14 clean**
- Local `npm run build`: 39 pages; sample HTML shows Multi Pass / Express / packing start=16

### Residual risks
- Ticket/hotel prices and LL selection sets remain date-volatile — copy uses confirm-for-your-dates language
- Height boards can change; charts say verify at park/app
- One historical Genie+ mention may remain per a few posts (intentional retirement context)
