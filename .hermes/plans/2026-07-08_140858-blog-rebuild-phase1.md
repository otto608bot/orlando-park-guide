# Plan Your Park Blog Rebuild Phase 1 Implementation Plan

> **For Hermes:** execute this locally first; do not push or deploy until Bennett approves because Netlify token usage is intentionally being minimized.

**Goal:** Turn the blog from a generic article pile into a smaller, cleaner family-planning support layer for the product.

**Architecture:** Keep Sanity as the source of truth for now, but tighten the frontend template and the content model assumptions. Separate three workstreams: frontend template cleanup, Sanity data normalization, and article rewrites. Do them in that order so we do not polish content inside a broken shell.

**Tech Stack:** Next.js App Router, Sanity content API, PortableText, local static export via `npm run build`.

---

## Current context
- Local low-hanging SEO/trust fixes are already implemented on branch `fix/seo-foundation-and-trust-pages`.
- Verified locally: `npm run build` passes in `web/`.
- Blog backend is Sanity (`web/src/lib/sanity.ts`) with no local Sanity Studio config in this repo.
- Current article template is overloaded in `web/src/app/blog/[slug]/page.tsx`.
- Current post inventory and scorecard live in:
  - `/Users/bennett/Hermes/bennett-ai-lab/planyourpark-blog-audit-2026-07-08.md`
  - `/Users/bennett/Hermes/bennett-ai-lab/planyourpark-blog-inventory-2026-07-08.csv`
  - `/Users/bennett/Hermes/bennett-ai-lab/planyourpark-blog-scorecard-2026-07-08.md`

---

## Phase 1 — Frontend template cleanup (local code only)

### Objective
Make the article template cleaner, more trustworthy, and more contextual before touching production content.

### Files likely to change
- `web/src/app/blog/[slug]/page.tsx`
- `web/src/app/blog/page.tsx`
- `web/src/components/BlogPostCard.tsx`
- create `web/src/lib/blog.ts` or `web/src/lib/blog-helpers.ts`
- maybe create `web/src/components/blog/ContextualCta.tsx`

### Changes
1. Remove the one-size-fits-all FAQ block from every article.
2. Replace the generic bottom CTA with 2-3 contextual CTA variants:
   - family planning CTA
   - ticket CTA
   - rides/height-planning CTA
3. Make related posts actually related by category/topic when possible.
4. Tighten fallback hero logic so it is less random and less category-dependent.
5. Reduce template bloat so the article body feels like the primary content.

### Validation
- `npm run build` in `web/`
- inspect built output for 3-4 sample posts
- confirm no broken routes or missing metadata

---

## Phase 2 — Sanity data normalization

### Objective
Fix the dataset so the frontend is not constantly compensating for broken content records.

### Required access
We likely need sanctioned Sanity write access or the separate Studio/workflow repo.

### Sanity issues to fix first
1. Add missing categories:
   - `disney-world-packing-list-kids`
   - `universal-orlando-summer-2026`
   - `best-time-visit-disney-world-2026`
   - one `disney-world-packing-list` duplicate
2. Fix wrong category:
   - `universal-orlando-height-requirements` should not be under Disney World
3. Resolve duplicate slug:
   - `disney-world-packing-list`
   - `disney-world-packing-list-v2`
4. Add/fix hero images and read times on incomplete posts
5. Correct malformed PortableText styles on `universal-orlando-summer-2026`

### Validation
- re-run local build
- confirm PortableText warnings are reduced
- confirm scorecard CSV no longer flags missing categories / duplicates / malformed styles

---

## Phase 3 — Article rewrite pass

### Objective
Only rewrite the posts worth keeping.

### Tier 1 rewrite order
1. `best-magic-kingdom-rides-kids-under-40-inches`
2. `universal-orlando-height-requirements`
3. `disney-world-with-baby-toddler`
4. `disney-world-packing-list-kids`
5. `best-time-visit-disney-world-2026`

### Rewrite rules
- every post must support a real planning decision
- every post must point back into the product/utility layer
- every post must have a single primary CTA
- remove generic filler, fake authority tone, and repetitive sitewide blocks

---

## Phase 4 — Archive / merge / remove

### Objective
Shrink the blog to a higher-quality library.

### Candidates
- archive/remove: `orlando-closures-march-2026`
- archive/remove: `universal-orlando-summer-2026` unless seasonal content becomes a repeatable lane
- merge: duplicate `disney-world-packing-list`
- rewrite or convert to hub: `disney-world-guide`
- rewrite/deprioritize: `beat-disney-world-crowds`, `free-things-disney-world`

---

## Risks / tradeoffs
- Without Sanity write access, data cleanup is partially blocked.
- If we push before template/content cleanup is coherent, we will spend Netlify usage on avoidable iterations.
- Some traffic pages may need to be preserved carefully even if content quality is weak; we should make those decisions with Search Console data later.

---

## Best immediate next step
Start with **Phase 1 frontend template cleanup locally**. It improves trust without spending Netlify deploy budget and gives us the right shell for later content cleanup.
