# Brief: Disney World character dining with kids (best meals, prices, how to book)
Stage: **brief** · Owner: blog lead · Date: 2026-10-26 · Requested by Bennett via CEO

## Demand evidence
**GSC validation: PENDING.** Analytics script is on hold until the token/script fix (PR #72) merges. Re-run then and fill in the table below.

Saved GSC export (`ops/weekly/gsc-query-page-2026-09-17_2026-10-14.json`), only character-dining match:
| Query | Page | Impr | Clicks | Pos |
|---|---|---:|---:|---:|
| character dining experiences near theme parks | /character-dining/ | 6 | 0 | 60.8 |
So we have almost no visibility yet. The topic is new demand for us, not a quick fix to an existing ranking.

Google autocomplete (suggestqueries.google.com, pulled 2026-10-26). Autocomplete shows that people search these terms but gives no volumes:
- Head: **character dining disney world**, disney character dining, character breakfast disney world, best character dining disney world
- Price intent: character dining disney world prices, disney character dining prices, character breakfast disney world cost, chef mickeys cost, cinderella's royal table cost
- Booking intent: how to book character dining at disney world, disney character dining reservations, cinderella's royal table reservations / cancellation policy
- List/compare intent: disney character dining list, disney character dining chart, character dining disney world 2026
- Location modifiers: character dining magic kingdom / epcot / hollywood studios / animal kingdom, character dining disney world resorts / not in parks / outside of park
- Kid intent: **best character dining for toddlers at disney world**
- Adjacent: character dining universal orlando, character breakfast universal orlando
- Google Trends: not pulled (no reliable access from the box). Seasonality is still unverified.

People Also Ask–style questions (web search plus planDisney Q&A):
- When can you book Disney character dining? (60 days out, 6 AM ET)
- Can you book without a hotel or tickets? (planDisney says yes, 2026-10-13)
- How much is character dining? Is it worth it?
- Which character meal is best for toddlers?
- Do you need park admission? (Yes for in-park locations like Cinderella's Royal Table. Resort restaurants don't need it.)
- Cancellation fees and prepayment (Cinderella's Royal Table requires full prepayment).

## Overlap and cannibalization check (Sanity production, read-only, 2026-10-26)
- **Existing hub page `/character-dining/`** (Next route plus 13 `characterDining` docs, last updated 2026-04-07). Title is "Disney & Universal Character Dining with Kids". It is the natural ranking page for the head term. **Risk:** a blog post on "character dining disney world" would compete with it.
- These blog posts mention character dining in passing only: best-time-visit-disney-world-2026, disney-world-packing-list-kids, beat-disney-world-crowds, disney-world-guide and others. None of them targets the topic. No cannibalization.
- **Data problems in the hub docs (need fixing either way):**
  - Be Our Guest is listed as character dining with priceRange `$`. Verify whether it still has character appearances. It is not a `$` meal.
  - 'Ohana is `$$`, but the official page shows breakfast at $$$ ($35–59.99/adult). Its dinner is **not** character dining.
  - Cape May Cafe is tagged park "EPCOT", but it is at the Beach Club Resort.
  - Cinderella's Royal Table is `$$$`, but the official page says $$$$ (over $60/adult).
  - Check 1900 Park Fare, Topolino's, Story Book Dining and the rest against the official pages. Also check which Universal options are missing, since the page title mentions Universal.

## Recommended plan: a small cluster with the hub as pillar
1. **Optimize the `/character-dining/` hub** to target "disney character dining / character dining disney world / list / chart / prices". Correct the doc data, add a dated price-tier column and booking FAQ, and keep Universal. (This is code plus Sanity drafts, so the CEO decides.)
2. **Post 1 (write first):** "Best Disney World Character Dining for Kids (2026): Prices, Ages, and How to Book". Targets "best character dining disney world", "…for toddlers", "character breakfast disney world" and "character dining prices". The angle is picks by kid age and park day, which is different from the hub's full list.
3. **Post 2 (later, if GSC shows impressions):** "How to Book Disney Dining Reservations (60-Day Window Explained)", targeting booking and cancellation queries.
4. **Optional:** character dining outside the parks (resorts) or Universal character breakfast, depending on GSC.
A single post would leave the hub weak and split the head term, so the cluster is the better fit.

## Post 1 spec
- **Primary:** best character dining disney world
- **Secondary:** best character dining for toddlers at disney world; character breakfast disney world; character dining disney world prices; how to book character dining at disney world; character dining magic kingdom
- **Title / H1:** Best Disney World Character Dining for Kids (2026): Prices, Ages, and How to Book
- **Slug:** /blog/best-disney-world-character-dining-kids/
- **Meta (excerpt):** Which Disney World character meals are worth it with kids, what they cost per adult, and how to book at the 60-day mark. Picks by age and park day.

### Outline
1. Quick answer: top 3 picks by situation (toddlers / princess fans / best value). Link to the `/character-dining/` hub for the full list.
2. How character dining works: buffet vs family-style vs prix fixe, characters visit your table, and whether you need park admission.
3. Prices: official Disney $–$$$$ tiers per location, dated. Note that the tier is the average adult price for the whole meal and excludes tax and tip. No invented exact prices.
4. Best picks by kid age: toddlers, ages 4–7, older kids. Pick from the officially listed character-dining locations only.
5. Best picks by park day: Magic Kingdom / EPCOT / Hollywood Studios / Animal Kingdom / resort, linking each park to the park chooser and ride finder.
6. How to book: 60 days at 6 AM ET; resort guests book the length of stay (up to 10 days); off-site guests book one day at a time; no hotel or tickets needed to book; credit card guarantee, cancellation fees and Cinderella's Royal Table prepayment.
7. Planning tips: breakfast before rope-drop rides vs a midday break, rider swap. These are general claims only, with no invented experiences.
8. FAQ (5–6 items, FAQ schema): Is character dining worth it? When to book? How much? Do kids under 3 eat free? (verify official child pricing age) Do you need park tickets? Which is best for toddlers?
9. Closing link to the park chooser.

### Required sourced facts (official pages, record access date)
- Booking window and length-of-stay rule: disneyworld.disney.go.com/faq/dining-reservations/advance-reservations/
- Cancellation and modification policy per location (Cinderella's Royal Table: cancel 2 hours ahead or pay full price; no modifications; full prepayment)
- Price tier per location from each dining page (as of 2026-10-26: Cinderella's Royal Table $$$$; 'Ohana breakfast $$$; Story Book Dining $$$$). Re-check on draft day.
- Which meal periods include characters (for example, 'Ohana dinner has none)
- Current character lineups, with the "subject to change" caveat
- Refurb or closure status of each restaurant and of any ride we recommend; heightRequirement values from Sanity ride docs
- Child price age (3–9) from official Disney pages

### Internal links
- Ride finder: /rides/ and park filters such as /rides/for/magic-kingdom-under-40/
- Park chooser: /parks/, /parks/magic-kingdom/, /parks/epcot/, /parks/animal-kingdom/
- Hub: /character-dining/
- Blog: /blog/disney-world-with-baby-toddler/, /blog/magic-kingdom-with-kids-rides-by-height/, EPCOT with kids post (once live), /blog/beat-disney-world-crowds/

### Affiliate disclosure (verbatim, near the top)
"Heads up: some ticket and gear links in this guide are affiliate links. If you book or buy through them, we may earn a commission at no extra cost to you. See our affiliate disclosure." The last sentence links to /affiliate-disclosure/.
Affiliate slots: Undercover Tourist tickets (/deals/); Amazon `planyourpark-20` autograph book and pen.

## Open questions
- GSC volumes and positions are pending the PR #72 fix.
- Should the hub be optimized first? It needs code and doc changes, so this is the CEO's call.
- Should Universal character dining stay in this cluster or get its own post?
- Be Our Guest's current character status needs checking.
