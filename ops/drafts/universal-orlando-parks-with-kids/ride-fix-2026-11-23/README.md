# Universal ride-finder fixes (Sanity DRAFTS only), 2026-11-23 — PR 83, Universal bundle step 1

Approved by Bennett (relayed by CEO, Nov 23, 8:17 AM CT): ride-finder fixes in the same deploy as the Universal post.
Nothing published, merged or deployed. Applied ~8:40 AM CT Nov 23 (transaction in `apply-result.json`).

Files: `apply.py` (dry run by default; `--apply` writes drafts.* via createOrReplace, asserts no draft existed), `mutations.json`,
`manifest.json` (before/after/source), `apply-result.json`, `verify.py` (read-back; output in `verify-output.txt`, ALL OK),
`revert.py` (deletes only the 4 drafts created here), `backup/` (published docs BEFORE + blog post draft BEFORE), `raw/` (official page captures, Nov 23).

## Drafts to publish (5)
| Draft | Change | Source |
|---|---|---|
| `drafts.q5bQv6QFqWcAZeLNaYa8Up` Fast & Furious | isClosed true + dated closureNote (last day Aug 16, 2026) | Universal ride page redirects to homepage; not on height page; Universal press release Jan 20, 2026 ("will permanently close in 2027"); final date from Universal passholder notice via Inside Universal (Jul 15 / Aug 17, 2026) |
| `drafts.q5bQv6QFqWcAZeLNaYa8qq` Hollywood Rip Ride Rockit | isClosed true + dated closureNote (last day Aug 17, 2025) | Universal press release Jan 20, 2026 ("Replacing the former Hollywood Rip Ride Rockit"); ride page redirects; not on height page; date from WDWNT / Inside Universal (Aug 18, 2025) |
| `drafts.ride-ioa-caro-seuss-el` Caro-Seuss-el (NEW) | IOA, Seuss Landing, heightRequirement 0, Carousel, thrill 1, slug ioa-caro-seuss-el | universalorlando.com ride page: No Minimum Height, under 48" needs companion |
| `drafts.ride-usf-kang-kodos-twirl-n-hurl` Kang & Kodos' Twirl 'n' Hurl (NEW) | USF, Springfield, U.S.A.: Home of The Simpsons, heightRequirement 0, Spinner, thrill 1, slug usf-kang-kodos | universalorlando.com ride page: No Minimum Height, under 48" needs companion |
| `drafts.blogPost-universal-orlando-parks-with-kids` | unchanged by this step (rev bHXamdrlLTlbFGrX8Ok7G6) | rechecks below all still match |

## Skipped (per approval)
Jurassic Park River Adventure temporary closure (reopens Dec 17, 2026); optional name tweaks (Fast & Furious name left as is).

## Publish-day rechecks (Nov 23, 2026, official pages, captures in raw/) — no change needed
- Volcano Bay: park hours page "temporarily closed for maintenance and has a planned reopening on or before April 1, 2027" (raw/uo-park-hours-recheck.txt).
- Jurassic Park River Adventure: park hours "January 5, 2026 - December 16, 2026"; ride page "will now reopen on December 17, 2026" (raw/ride-jurassic-park-river-adventure.txt).
- Monsters Unchained: park hours "December 11, 2026 - December 15, 2026"; ride page lists 48" and no closure text.
- Holidays at Universal: "Nov. 14, 2026-Jan. 3, 2027", included with ticket/pass (blockouts apply); Holiday Tour select dates Nov 14, 2026-Jan 2, 2027 (raw/uo-holidays-recheck.txt).
- Other park-hours closures unchanged (Popeye Jan 9-Feb 2, Fyre Drill Jan 25-Feb 4, Forbidden Journey Feb 8-19 2027, Po Live! from Oct 3, 2026).
- Height page: no change vs. the 07:24 capture; still no Fast & Furious or Rip Ride Rockit.

## Notes
- New docs: accessibility [] and no rideDuration (no checkable official value; same as PR 80 new docs). thrillLevel 1 per the site's migrate rule (height < 35 -> 1), matching One Fish, Two Fish / Storm Force.
- No Universal-hosted page states Fast & Furious's exact final date; the official Jan 2026 release said "2027", and the Aug 16, 2026 date comes from Universal's passholder notice/social posts as reported by several outlets. The closure note says so.
