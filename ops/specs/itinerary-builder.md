# Spec — Itinerary builder (one-pager)

Status: draft spec only (not scheduled to build)  
Owner: Hermes / Bennett  
Updated: 2026-07-22

## Problem
Families know a park name but still ask: “What can we actually ride with *our* kids in one day?” Ride filters answer eligibility; itineraries answer sequencing + energy.

## ICP
Primary: families with kids (mixed heights/ages) planning a **single park day** in Orlando.  
Secondary: first-timers choosing between parks after using `/parks/` + ride finder.

## Job to be done
Given kid height(s), park, energy/tolerance, and optional must-dos → produce a **shareable 1-day plan** with morning/mid/afternoon blocks, snack/rest notes, and a ticket CTA.

## Inputs (v1)
| Input | Source | Notes |
|---|---|---|
| Park | park slug | Start with Magic Kingdom, Epic Universe, Islands of Adventure |
| Kid height (inches) | number or multi-kid max of shortest | Reuse filter semantics: ride OK if `heightRequirement` empty/0 or ≤ kid height |
| Thrill ceiling | 1–5 or family/medium/high | Cap thrillLevel |
| Must-ride list | optional multi-select from filtered rides | Soft constraint |
| Nap / low-energy mode | boolean | Prefer calm / lower thrill midday |

## Outputs (v1)
- Shareable URL, e.g. `/plans/{park}?h=40&thrill=3` (static-export friendly query string) **or** `/plans/magic-kingdom/under-40/` curated landings for top intents
- Ordered blocks: rope-drop / late morning / afternoon / evening wind-down
- Each stop: ride name, height gate, thrill badge, why it’s in the slot
- “Not eligible for your height” callout with swap suggestions
- Primary CTA: Undercover Tourist ticket deal (existing affiliate rail)
- Secondary: link back to live `/rides/?height=` filter + related blog guides

## Algorithm (simple, shippable)
1. Filter park rides by height + thrill ceiling + not closed.
2. Score: must-ride boost, lower wait proxy via thrill/type heuristics (no live wait API in v1), land clustering if land field exists else name/park order.
3. Greedy pack into 3–4 dayparts with max N attractions per part; insert 1 rest/snack slot midday when low-energy.
4. If must-rides don’t fit, list “if you skip X, add Y”.

## Content / SEO
- Do **not** invent official wait times or policy claims.
- Prefer evergreen copy + “verify height boards on the day.”
- Programmatic landings only for proven intents (under 40″ MK already earns clicks — extend carefully).
- Internal links from parks hub, ride finder presets, Epic 1-day plan, MK under-40 guide.

## Monetization
- Ticket affiliate on plan page (disclosure).
- Optional Amazon “day bag” module only on packing-adjacent plans later.
- Email capture deferred until traffic warrants.

## Non-goals (v1)
- Multi-park touring plans
- Live wait times / Lightning Lane inventory
- Account/login, drag-drop editor
- Native apps

## Build sketch
- Data: existing Sanity `ride` docs
- UI: server-generated plan from searchParams + client tweak controls
- Static export: prebuild top presets (MK 40/44/48, Epic 40/44/48) + dynamic query on `/rides` style client where needed
- Analytics: `plan_generated`, `plan_ticket_click`, share copy

## Success metrics
- Assist GSC clicks on plan URLs or uplift on linked guides within 30d
- Ticket CTA CTR > blog baseline on commercial posts
- Qualitative: parents can answer “can we do this day?” without a spreadsheet

## Decision needed before build
1. URL model: query-string tool vs a few SEO landings first  
2. Park order for v1 (recommend: Magic Kingdom → Epic Universe → IOA)  
3. Ship after height-filter SEO package is live and CTR v2 has ≥2 weeks data

## Next implementation step (when unlocked)
Write `web` route stub + scoring module tests with fixture rides; no public nav link until dual QA.
