# QA notes: Animal Kingdom with kids — rides by height (2026-10-16)
- Sanity: **`drafts.blogPost-animal-kingdom-with-kids-rides-by-height`**, a NEW draft (rev `aH4P37jXgV3EWZCGrBCBwG`, 46 blocks).
- No published doc exists, and nothing was published.
- Body is about 1,095 words (`post.md` with front matter: 1,168).
- Targets: "animal kingdom with kids" (GSC 34 impr, pos 28.8) and "animal kingdom rides for kids" (21 impr, pos 30.1), 2026-09-17 → 10-14.

## Heights and status (official = disneyworld.disney.go.com attraction pages, accessed 2026-10-16)
| Attraction | Requirement | Source |
|---|---|---|
| Avatar Flight of Passage | 44 in (112 cm) | official /attractions/animal-kingdom/avatar-flight-of-passage/ |
| Expedition Everest | 44 in (112 cm) | official /attractions/animal-kingdom/expedition-everest/ |
| Kali River Rapids | 38 in (97 cm) | official /attractions/animal-kingdom/kali-river-rapids/ |
| Kilimanjaro Safaris | Any height | official |
| Na'vi River Journey | Any height | official |
| Wildlife Express Train | Any height | official |
| Gorilla Falls Exploration Trail | Any height | official |
| Maharajah Jungle Trek | Any height | official |
| Conservation Station | Any height | official |
| Zootopia: Better Zoogether! | Any height | official |
| DINOSAUR | Closed (last day Feb 1, 2026) | Official page now redirects to the attractions list; date from WDWMagic (2025-09-02) and WDWNT (2026-02-02), secondary sources |
| TriceraTop Spin | Closed Jan 2025 | Official page 404; date from WDWMagic (secondary) |
| The Boneyard | Closed Sep 2, 2025 | WDWMagic (secondary) |
| Tropical Americas "2027" | Planned | Secondary (WDWMagic/WDWNT). **Needs official Disney Parks Blog citation.** |

## Other policies cited
- Rider Switch: official https://disneyworld.disney.go.com/guest-services/rider-switch/ (accessed 2026-10-16).
- First Aid in every WDW theme park: official https://disneyworld.disney.go.com/guest-services/first-aid/ (accessed 2026-10-16).
- **Ticket ages (child 3–9, under 3 free): NOT re-verified on an official page today. Verify before publish.**
- Finding Nemo: The Big Blue… and Beyond! status: not verified. The post only says to check the schedule.

## QA pass 1 (author: format, links, anchors) and pass 2 (independent: facts, policy, brand, disclosure)
- `qa.py`: **0 fails** (see `qa-output.txt`).
  - Every internal link returns 200.
  - Amazon search links return 503 to bots (expected) and all carry `tag=planyourpark-20`.
  - Anchors are ≤60 characters.
  - Disclosure sits before the first affiliate link.
  - 6 ride-finder links (AK under-40, 44, 48, calm-under-40, all) plus the park chooser `/parks/` and `/parks/animal-kingdom/`.
  - No first-person lore and no Genie+.
  - Heights match the table, and the heat line points to First Aid.
- Repo `content_integrity_check.analyze_post` on all drafts: 0 issues.
- `live_blog_qa.py`: not applicable until published (and blocked by the site-wide CSR issue).

## Open flags
1. Ride finder: closed AK rides fixed in Sanity ride **drafts** (`RIDE-FINDER-FIX.md`). They must be published + redeployed together with this post.
2. ~~Hero~~: text-only branded hero attached (see update). It is not an AI scene image; confirm it's acceptable per HERMES.md.
3. ~~Ticket-age / Tropical Americas~~: removed (see update).
4. `publishedAt` is unset (set at publish).

## Update 2026-10-16 ~11:55 CT (draft rev `f1O3mfm9f6TgHfHlPz4g5I`)
- **Ticket ages removed.**
  - Disney's ticket pages (admission/tickets, FAQ ticket-age-ranges) render client-side only, so the age text could not be read from the box (WebFetch failed too).
  - The post now says: "Check Disney's official ticket page for current child ticket ages and prices before you buy."
- **Tropical Americas year removed.**
  - The Disney Parks Blog (Apr 30, 2026) says 2027.
  - Disney's own "Coming to the Parks" page dropped "in 2027" on Sep 10, 2026, as reported by WDWMagic and WDW News Today (Sep 10, 2026).
  - Because the official sources conflict, the post now says "check Disney's official site for current opening timing".
- **Closure dates now attributed in text:**
  - "WDWMagic reported…" with article dates: Sep 2, 2025; Mar 14, 2025; plus WDW News Today, Feb 2, 2026.
  - Added the It's Tough to be a Bug! closure (Mar 16, 2025 final shows).
- **Hero:** text-only branded graphic `hero-1376x768.png` (no people, no Disney logos), uploaded as asset `image-243e0fc1ed84366f692b36c5cebae367ceebc850-1376x768-png` and attached as `heroImage`.
- **Ride finder fix:** see `RIDE-FINDER-FIX.md`.
- **QA re-run:**
  - `qa.py`: 0 fails, now also checking no ticket ages, no 2027, and attributed closures.
  - Integrity analyzer on all 14 blog drafts: 0 issues.
  - Repo integrity (published): 0 issues.
- Body is now about 1,151 words.
