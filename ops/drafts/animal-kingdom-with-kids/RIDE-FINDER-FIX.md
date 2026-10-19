# Ride finder: closed Animal Kingdom rides (Sanity ride DRAFTS, 2026-10-16, txn `8zlLPwu11vTM6HR7vzbAya`)

## How the finder gets its data
- The live finder reads Sanity `ride` docs via `web/src/lib/queries.ts` (`getAllRides`, `getRidesByPark`). Root `data/rides.js` is the legacy Eleventy dataset.
- `/rides/for/*` landings filter `!r.isClosed` (`web/src/app/rides/for/[slug]/page.tsx:87`).
- Other views show a CLOSED badge (`RideCard`, `RidesTable`, `RideModal`, `ParkRidesGrid`).
- The live `/rides/for/animal-kingdom-under-40/` currently includes DINOSAUR, TriceraTop Spin and It's Tough to be a Bug (checked 2026-10-16).

## What changed
- I created a `drafts.<id>` copy from each published doc, then set **`isClosed: true`** and a dated **`closureNote`**.
- Published docs were not deleted or modified: `_rev` unchanged, verified by read-back.
- The site builds from published content, so this takes effect only after these drafts are published and the site is redeployed.

| Ride | Draft ID | closureNote source |
|---|---|---|
| DINOSAUR | `drafts.r5PBb5Nahg2bY9oktfqTQR` | Last day Feb 1, 2026, as reported by WDWMagic (Sep 2, 2025) and WDW News Today (Feb 2, 2026). The official page now redirects to the attractions list. |
| TriceraTop Spin | `drafts.UzjbPEJ4gI65TQn8dT7GVw` | Closed Jan 2025, as reported by WDWMagic (Sep 2, 2025). The official page returns 404. |
| It's Tough to be a Bug! | `drafts.q5bQv6QFqWcAZeLNaYa5Ig` | Final shows Mar 16, 2025, as reported by WDWMagic (Feb 3 and Mar 14, 2025). The official URL redirects to the attractions list. |

The other 6 AK ride docs match Disney's current attraction list.

**Gap:** Zootopia: Better Zoogether! (official page, any height) has no `ride` doc. This was not added and needs a decision on whether shows belong in the finder.
