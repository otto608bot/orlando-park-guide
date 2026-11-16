# Ride-data fixes + LEGOLAND closures (Sanity DRAFTS only), 2026-11-16

All values checked Nov 16, 2026 (~9:48-10:05 AM CT) on official pages; raw captures in `raw/`. Nothing published. Buffer untouched.
`apply.py` (dry run by default, `--apply` writes drafts.* via createOrReplace; none of the targets had a draft before), `manifest.json` (before/after/source), `apply-result.json`, `verify.py` (read-back), `revert.py` (deletes only the drafts.* created here).

## Rules applied
- isClosed only when the official source gives no reopening date or reopens after Jan 31, 2027. Short dated closures stay out of Sanity (post text only).
- Infinity Falls: SeaWorld "Closed for Annual Maintenance", no date -> isClosed true. Kid Power Towers: LEGOLAND "Starting 11/10", no end date -> isClosed true.
- Jurassic Park River Adventure: official ride page says it reopens Dec 17, 2026 (park-hours page: Jan 5-Dec 16, 2026) -> NOT marked closed; post text only (the Orlando post, parked, says "through December 16").
- NOT marked closed (short/dated or future): Monsters Unchained Dec 11-15, Fyre Drill Jan 25-Feb 4 2027 (also not closed yet), Popeye & Bluto's Jan 4-Feb 2 2027, Forbidden Journey Feb 8-19 2027, NINJAGO/The Dragon Nov 30-Dec 18, DUPLO Tractor, Technicycle.

## Conflicts / not verified
- Elmo's Choo Choo Train: listing + ride page headline say 36"; the page's accessibility paragraph separately says 42" with a companion. 36 written (matches the Orlando post).
- Sky Tower: ADDED (closure only, `apply_skytower.py`, result `apply-result-skytower.json`): `drafts.UzjbPEJ4gI65TQn8dT7zNC` isClosed true, closureNote "Temporarily closed; SeaWorld lists no reopening date (checked Nov 16, 2026)". HEIGHT CONFLICT, NOT written: SeaWorld's rides listing tags it 48" Min. Height, but its own ride page (seaworld.com/orlando/rides/sky-tower) says "HEIGHT REQUIREMENT: No Limit"; heightRequirement left at 0. Recheck captures: raw/sw-rides-recheck.txt, raw/sw-closure-schedule-recheck.txt, raw/sw-sky-tower.txt.
- Abby's Flower Tower: "Closed for Annual Maintenance", no ride doc exists; not added.
- Universal Studios Florida height list no longer includes Hollywood Rip Ride Rockit or Fast & Furious (Sanity 51 / 40). Not changed.
- New docs leave thrillLevel unset (no official numeric rating) and Expedition Odyssey / Penguin Trek / Ice Breaker land unset; rideType only where the official page implies one.
- The Orlando HEIGHT-MISMATCHES table lists 7 missing docs; the 8th added is Ice Breaker (48"), flagged in RIDE-FINDER-FLAGS.md.
