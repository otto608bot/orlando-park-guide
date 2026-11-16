# Ride-finder / Sanity flags found while checking official pages (2026-11-16)

Nothing below was changed in Sanity. All are proposals for drafts.* fixes, pending CEO/Bennett approval.

## Height data (see HEIGHT-MISMATCHES.md)
- 2 mismatches: Mine-Cart Madness (Sanity 36, official 40); Monsters Unchained (Sanity 40, official 48).
- 4 null `heightRequirement` on Epic Universe rides the post names: Yoshi's Adventure (34), Mario Kart (40), Battle at the Ministry (40), plus Constellation Carousel and Fyre Drill (no minimum, set 0). The `/rides/for/epic-universe-under-40/` page the post links to may show these wrongly until fixed.
- Missing ride docs: Trolls Trollercoaster (36), Illumination's Villain-Con Minion Blast (no min), Flight of the Hippogriff (36), SeaWorld Penguin Trek (42), Expedition Odyssey: Fire & Ice (39), Ice Breaker (48), Super Grover's Box Car Derby (38), Elmo's Choo Choo Train (36), other Sesame Street Land rides.

## Closures / status (official pages, 2026-11-16)
- Universal park-hours page "Temporary Closures": Jurassic Park River Adventure Jan 5–Dec 16, 2026 (Sanity not closed); Monsters Unchained Dec 11–15, 2026; Fyre Drill Jan 25–Feb 4, 2027; Popeye & Bluto's Jan 4–Feb 2, 2027; Forbidden Journey Feb 8–19, 2027; Volcano Bay closed, reopening on or before Apr 1, 2027.
- SeaWorld rides page: Infinity Falls and Abby's Flower Tower "Closed for Annual Maintenance"; Sky Tower "Temporarily Closed" (and listed 48" min; Sanity has 0).
- SeaWorld: "Antarctica: Empire of the Penguin" (Sanity `UzjbPEJ4gI65TQn8dT7z98`) no longer appears on the official rides page; Expedition Odyssey: Fire & Ice is listed "Now Open" (39"). Likely replacement — verify before changing.
- Universal Studios Florida official height list no longer includes Hollywood Rip Ride Rockit (Sanity 51) or Fast & Furious - Supercharged (Sanity 40). Undercover Tourist (third party, Nov 3) says Rip Ride Rockit closed permanently for Fast & Furious — Hollywood Drift (2027). Verify on Universal and mark closed.
- Disney: Tiana's Bayou Adventure refurb from Nov 2, reopening expected December 2026 (Sanity isClosed true — OK; revert on reopening). Living with the Land replaced by Glimmering Greenhouses Nov 27–Dec 30, 2026. Rock 'n' Roller Coaster is now "Rock 'n' Roller Coaster Starring The Muppets" (Sanity name stale). DINOSAUR URL now redirects to the AK listing (Sanity isClosed true — OK).
- **LEGOLAND (affects the live LEGOLAND post, PR #77):** closures page now lists Pirate River Quest; Battle of Bricksburg (starting 11/2); **DUPLO Tractor (starting 11/2, no end date — the Nov 9 post says Nov 2–11)**; Technicycle 11/2–11/20; Imagination Zone 11/2–11/20; **Kid Power Towers (starting 11/10 — new)**; Cypress Gardens 11/10–11/20; **LEGO NINJAGO The Ride 11/30–12/18 and The Dragon 11/30–12/18 (new)**. DUPLO Train is no longer listed. The live post `/blog/legoland-florida-rides-by-height/` "Closed Right Now" section is out of date; Sanity Kid Power Towers / DUPLO Tractor `isClosed` should be updated.
