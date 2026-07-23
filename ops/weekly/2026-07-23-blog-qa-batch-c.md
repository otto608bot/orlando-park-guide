# Blog QA — Batch C — 2026-07-23

## Scope and result
Audited and updated the four remaining Batch C posts directly in Sanity production (`hd7qwtcq`). All four pass the local content-integrity check after the edits. The Next.js production build also completed successfully (39 static pages).

**Important deployment note:** the currently fetched public HTML still reflects the pre-QA copy for the CMS body changes. A normal site rebuild/deploy is required for the changes below to reach `planyourpark.com`.

## Per-post changes

### `disney-world-with-baby-toddler`
- Corrected the Magic Kingdom ride-height copy:
  - Removed incorrect minimums for Peter Pan and Buzz Lightyear.
  - Corrected the Tiana / Seven Dwarfs / Big Thunder 38-inch group, Space Mountain (44 inches), and TRON (48 inches).
  - Removed the misleading active-reference treatment of the retired Splash Mountain and clearly identified Tiana as its replacement.
- Reworked the stroller-fan, nap, and overstimulation language into individualized, non-medical planning guidance; removed prescriptive claims about toddler limits and outcomes.
- Retained the existing Magic Kingdom-under-40 and ride-finder internal links.

### `free-things-disney-world`
- Reframed and retitled to **“19 No-Extra-Cost Things…”** so the count and promise match the vetted list.
- Clarified the central distinction between activities included after paid park admission and genuine no-ticket resort/Disney Springs ideas.
- Removed duplicates, retired-show content (Harmonious), and unverified/misleading claims (guaranteed resort access, character boat, UK flag ritual, blanket “free” PhotoPass downloads, etc.).
- Updated resort/PhotoPass wording to require current access and schedule checks.
- Added a relevant internal link to the kids’ packing list.

### `universal-orlando-height-requirements`
- Corrected substantial outdated/inaccurate ride-chart copy using current known Universal threshold consistency:
  - VelociCoaster **51 in**, Hulk **54 in**, Forbidden Journey and Mummy **48 in**, Gringotts **42 in**, Minion Mayhem and TRANSFORMERS **40 in**, Dudley Do-Right **44 in**, Skull Island: Reign of Kong **36 in**.
  - Removed defunct Dragon Challenge and corrected the defunct Kongfrontation reference.
  - Removed the inaccurate “44 inches = almost everything” / “40 inches = almost everything” framing.
- Replaced shoe-height gaming advice with entrance-sign / Team Member-final guidance.
- Kept Universal terminology correct: **Universal Express Pass**, not Lightning Lane.
- Added an at-a-glance current-threshold note and clearer Child Swap / official-app verification guidance.

### `universal-orlando-summer-2026`
- Normalized all malformed Portable Text list styles into real `bullet` / `number` list items; this addresses the collapsed/non-list semantic formatting in the CMS body.
- Reframed the post for the still-active **May 23–August 10, 2026** seasonal window as of July 23, rather than “just dropped” / future-tense event copy.
- Removed stale pre-release claims (including “not yet in theaters”), hard-coded ticket-deal and Express price claims, and unverified exhibit/character specificity; directed readers to the official app/calendar for current availability.
- Corrected **Aventi → Aventura** and **“Unlimited Express Unlimited” → “Universal Express Unlimited.”**
- Added a contextual internal link to the Universal height-requirements guide.

## Shared quality work
- Confirmed no Genie+ wording remains in these four posts. Disney content uses current Lightning Lane terminology where it is relevant; Universal content uses Express terminology only.
- Preserved / added contextual internal links without introducing external policy or medical claims.
- Built a reusable patch script: `scripts/qa-batch-c-fix.mjs`.

## Verification
- `python3 scripts/content_integrity_check.py --slug <each Batch C slug> --min-chars 800` → **0 issues** for all four posts.
- `web && npm run build` → **passed**; 39 pages generated.
- Build emitted only the pre-existing multiple-lockfile workspace-root warning.

## Follow-up
- Trigger the normal Netlify/site rebuild so the Sanity edits replace the still-stale live static HTML.
