# LEGOLAND Florida ride-data fix (Sanity drafts only), 2026-11-09

All values checked Nov 9, 2026 (~9:25 AM CT) against legoland.com/florida. Per-ride source URLs are in `manifest.json`.
Script: `build_ride_drafts.py` (`--apply` writes drafts.* via createOrReplace; nothing is published). Result: `apply-result.json`.

## Existing docs changed (drafts)
| Draft ID | Ride | heightRequirement before → after | Other | Source |
|---|---|---|---|---|
| drafts.200HsSeCmp0rIIhq3n1hwQ | Lost Kingdom Adventure | 0 → 30 | | ride page + height chart |
| drafts.r5PBb5Nahg2bY9oktfrH4o | Beetle Bounce | 0 → 36 | | ride page + height chart |
| drafts.q5bQv6QFqWcAZeLNaYbW4i | Flying School | 44 → 44 | isClosed=true + closureNote (permanently closed Aug 16, 2023) | LEGOLAND Florida press release Jul 13, 2023 (reprinted by Mousesteps; ClickOrlando, The Ledger); official page 404; not on official lists |

Verified unchanged (no draft): NINJAGO 0, Merlin's Challenge 36, The Dragon 40, Coastersaurus 42, Ford Driving School 0 (ages 6–13), Ford Jr. Driving School 0 (ages 3–5), DUPLO Express 0.
Left untouched (can't verify): Boating School (0), Fairy Tale Brook (0).

## New ride docs (16), all drafts.ride-legoland-<slug>, slug ll-<slug>
Galacticoaster 36 · Kid Power Towers 38 · Coast Guard Academy 34 · Rescue Academy 34 · Safari Trek 34 · Royal Joust 36 · Technicycle 36 (closed Nov 2–20) · Unikitty's Disco Drop 40 · THE LEGO MOVIE Masters of Flight 40 · The Great LEGO Race 42 · Mia's Riding Adventure 48 · AQUAZONE Wave Racers 40 · The Grand Carousel 0 · DUPLO Tractor 0 (closed Nov 2–11) · Battle of Bricksburg 0 (closed from Nov 2) · Pirate River Quest 0 (officially closed, no date; NOT marked closed)

## Conflicts / open items
- Kid Power Towers: chart 30", ride page 38" → 38 used (matches post).
- AQUAZONE Wave Racers: ride page now says minimum 40" (under 52" accompanied); chart's first line says 52" but also allows 40–52" accompanied → 40 used. Post says 52": needs alignment.
- Pirate River Quest: officially "temporarily closed" (ride page + closures page) with no date → not marked isClosed per the dated-only rule; needs a call.
- DUPLO Express is likely the official "DUPLO Train" (closed Nov 2–11) but the rename isn't officially confirmed (old URL 404s) → untouched.
- Ford Driving School: official /ford-driving-school/ URL redirects to /driving-school/ (official name "Driving School"); name left as-is.
- Boating School → Coast Guard Academy rename: no official confirmation (old URL 404s) → Boating School untouched; Coast Guard Academy added as its own doc. Both will show in the finder unless decided.
- Fairy Tale Brook: no LEGOLAND Florida page; 2023 closure news is LEGOLAND California. Can't confirm it ever existed in Florida, so untouched.
- Short closures (DUPLO Tractor to 11/11, Technicycle to 11/20) need reverting after they reopen.
- Not added: water-park rides (Splash Out, Twin Chasers, Joker Soaker), The Great LEGO Race VR add-on (35"), play areas/shows.
