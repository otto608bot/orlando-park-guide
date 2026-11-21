# Height check: post vs official vs Sanity `heightRequirement` (2026-11-16)

Official sources (accessed 2026-11-16): WDW = disneyworld.disney.go.com park listing + attraction pages; UO = universalorlando.com ride-height-requirements; SW = seaworld.com/orlando/rides/ (+ Expedition Odyssey page); LL = legoland.com/florida attraction-height-restrictions. Sanity = production published ride docs, field `heightRequirement` (not `height`). 0 = any height / no minimum.

| Ride (post) | Official | Sanity doc | Sanity heightRequirement | Result |
|---|---:|---|---:|---|
| Peter Pan's Flight | 0 (WDW) | `q5bQv6QFqWcAZeLNaYZhf2` | 0 | OK |
| Dumbo the Flying Elephant | 0 (WDW) | `r5PBb5Nahg2bY9oktfqLUh` | 0 | OK |
| Seven Dwarfs Mine Train | 38 (WDW) | `UzjbPEJ4gI65TQn8dT72zL` | 38 | OK |
| Big Thunder Mountain Railroad | 38 (WDW) | `UzjbPEJ4gI65TQn8dT70ny` | 38 | OK |
| Tiana's Bayou Adventure | 40 (WDW) | `q5bQv6QFqWcAZeLNaYZj56` | 40 | OK |
| Frozen Ever After | 0 (WDW) | `r5PBb5Nahg2bY9oktfqP0K` | 0 | OK |
| Remy's Ratatouille Adventure | 0 (WDW) | `r5PBb5Nahg2bY9oktfqQGP` | 0 | OK |
| Test Track | 40 (WDW) | `UzjbPEJ4gI65TQn8dT75xw` | 40 | OK |
| Toy Story Mania! | 0 (WDW) | `UzjbPEJ4gI65TQn8dT7842` | 0 | OK |
| Mickey & Minnie's Runaway Railway | 0 (WDW) | `r5PBb5Nahg2bY9oktfqRen` | 0 | OK |
| Alien Swirling Saucers | 32 (WDW) | `UzjbPEJ4gI65TQn8dT76Yr` | 32 | OK |
| Slinky Dog Dash | 38 (WDW) | `r5PBb5Nahg2bY9oktfqSFL` | 38 | OK |
| Millennium Falcon: Smugglers Run | 38 (WDW) | `UzjbPEJ4gI65TQn8dT76xT` | 38 | OK |
| Kilimanjaro Safaris | 0 (WDW) | `r5PBb5Nahg2bY9oktfqTr1` | 0 | OK |
| Na'vi River Journey | 0 (WDW) | `q5bQv6QFqWcAZeLNaYa60i` | 0 | OK |
| Kali River Rapids | 38 (WDW) | `UzjbPEJ4gI65TQn8dT7G95` | 38 | OK |
| Avatar Flight of Passage | 44 (WDW) | `q5bQv6QFqWcAZeLNaYZsPo` | 44 | OK |
| Illumination's Villain-Con Minion Blast | 0 (UO) | — | — | **MISSING DOC** |
| E.T. Adventure | 34 (UO) | `UzjbPEJ4gI65TQn8dT7HDt` | 34 | OK |
| Trolls Trollercoaster | 36 (UO) | — | — | **MISSING DOC** |
| Despicable Me Minion Mayhem | 40 (UO) | `r5PBb5Nahg2bY9oktfqUWY` | 40 | OK |
| The Cat in the Hat | 36 (UO) | `q5bQv6QFqWcAZeLNaYaBXX` | 36 | OK |
| Flight of the Hippogriff | 36 (UO) | — | — | **MISSING DOC** |
| Skull Island: Reign of Kong | 36 (UO) | `UzjbPEJ4gI65TQn8dT7xH6` | 36 | OK |
| The Amazing Adventures of Spider-Man | 40 (UO) | `UzjbPEJ4gI65TQn8dT7xO8` | 40 | OK |
| Jurassic World VelociCoaster | 51 (UO) | `q5bQv6QFqWcAZeLNaYaVz2` | 51 | OK |
| Constellation Carousel | 0 (UO) | `UzjbPEJ4gI65TQn8dVaSlm` | None | **NULL (set 0)** |
| Fyre Drill | 0 (UO) | `q5bQv6QFqWcAZeLNadCxqZ` | None | **NULL (set 0)** |
| Yoshi's Adventure | 34 (UO) | `r5PBb5Nahg2bY9oktiHnwC` | None | **NULL (set 34)** |
| Mario Kart: Bowser's Challenge | 40 (UO) | `q5bQv6QFqWcAZeLNadCzDU` | None | **NULL (set 40)** |
| Mine-Cart Madness | 40 (UO) | `r5PBb5Nahg2bY9oktiHnab` (Donkey Kong Mine Cart Madness) | 36 | **MISMATCH** |
| Hiccup's Wing Gliders | 40 (UO) | `UzjbPEJ4gI65TQn8dVaTsL` | 40 | OK |
| Harry Potter and the Battle at the Ministry | 40 (UO) | `UzjbPEJ4gI65TQn8dVaTDu` (Battle of the Ministry of Magic) | None | **NULL (set 40)** |
| Monsters Unchained: The Frankenstein Experiment | 48 (UO) | `UzjbPEJ4gI65TQn8dVaVm8` | 40 | **MISMATCH** |
| Elmo's Choo Choo Train | 36 (SW) | — | — | **MISSING DOC** |
| Super Grover's Box Car Derby | 38 (SW) | — | — | **MISSING DOC** |
| Expedition Odyssey: Fire & Ice | 39 (SW) | — | — | **MISSING DOC** |
| Penguin Trek | 42 (SW) | — | — | **MISSING DOC** |
| Mako | 54 (SW) | `UzjbPEJ4gI65TQn8dT7xs1` | 54 | OK |
| Manta | 54 (SW) | `r5PBb5Nahg2bY9oktfr59X` | 54 | OK |
| Lost Kingdom Adventure | 30 (LL) | `200HsSeCmp0rIIhq3n1hwQ` | 30 | OK |
| Galacticoaster | 36 (LL) | `ride-legoland-galacticoaster` | 36 | OK |
| The Dragon | 40 (LL) | `q5bQv6QFqWcAZeLNaYbVfY` | 40 | OK |
| Coastersaurus | 42 (LL) | `r5PBb5Nahg2bY9oktfr8z6` | 42 | OK |

14 rows need a Sanity fix (not applied: drafts only, needs approval).
