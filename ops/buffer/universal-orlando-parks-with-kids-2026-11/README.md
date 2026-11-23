# Image specs + prompts: Universal Orlando Parks with Kids: Which of the 4 to Pick (2026)
Slug: `universal-orlando-parks-with-kids` · Pack written 2026-11-23 · Status: **images generated 2026-11-23** (parent bot), saved at the paths below; hero set on the Sanity draft (asset `image-d5e270f9e8cd17bd6cef832de55de15c52813ac1-1376x768-jpg`).
All art must be **new and original for this post**: never reused or cropped from another post's art (Bennett, Nov 2). Follow `ops/hero-image-style.md`.

## Exact target files (worktree `/workspace/pyp-wt-2026-11-23`)
| Use | Generate at | Final file (exact path) | Final size |
|---|---|---|---|
| Blog hero (`heroImage` on `drafts.blogPost-universal-orlando-parks-with-kids`) | 16:9 | `ops/buffer/universal-orlando-parks-with-kids-2026-11/images/hero-1376x768.jpg` | **1376×768 JPG, q85–90** (resize from 16:9; ~1.79:1, a slight center crop) |
| Instagram (+ FB if an image post is used) | 1:1 | `ops/buffer/universal-orlando-parks-with-kids-2026-11/images/instagram-1x1.jpg` | **1080×1080 JPG** |
| Pinterest pin | 9:16, then center-crop to 2:3 | `ops/buffer/universal-orlando-parks-with-kids-2026-11/images/pin-1000x1500.jpg` | **1000×1500 JPG** (don't commit the uncropped 9:16) |
Delete `images/.gitkeep` once the files are in.

## Rules for every image (from ops/hero-image-style.md + Bennett's rules)
- Photorealistic travel-photo look with AI-illustrated polish. Not flat, vector or cartoon.
- **No text, signs, readable words, logos or brand marks.** No real likenesses.
- **No trademarked characters or costumed characters** (no Minions, Grinch, Shrek, Mario/Yoshi, Harry Potter, dinosaurs from Jurassic Park branding, Seuss characters, Macy's balloons of real characters).
- **No copies of trademarked landmarks:** no Hogwarts-style castle (no dark gothic castle on a cliff), no Universal globe with lettering, no Seuss-style curvy buildings, no Nintendo pipes or blocks, no Epic Universe "Chronos" tower or planets. Use the ORIGINAL designs given in the prompts.
- Generic families seen from behind or in profile, faces not prominent (hero). Social images may show happy, generic kids' faces.
- Check each output at full size and at card size (~16:9 crop). Redo anything with garbled text, extra limbs, logos or a landmark that looks like a real one.

## 1) HERO — 16:9 → 1376×768 JPG. Site look: castle + globe + palms + family, with a light holiday touch
```
Photorealistic travel photo with a polished illustrated look, warm golden-hour light, vivid saturated colors.
A generic family of four (two parents and two young kids, about stroller-age and early-grade-school-age, seen from behind, faces not visible) walking hand in hand along a warm brick promenade beside a calm turquoise lagoon toward a theme-park skyline.
Center of frame: a large ORIGINAL open bronze armillary-sphere globe sculpture (interlocking rings, no lettering, no continents text) in a round fountain, with water jets sparkling in the sun.
Upper/middle frame across the lagoon: an ORIGINAL fairytale hilltop castle in warm sandstone with terracotta and teal turret roofs (not any known castle, not gothic, not dark), plus a few distant colorful roller-coaster track curves among palms.
Tall palm trees wrapped in warm string lights and a few red-and-gold holiday garlands on lamp posts for a subtle Christmas-season feel; pink and purple flower beds along the path.
Sky: peach and soft orange sunset glow with light clouds, horizon in the upper third, family in the lower third, globe as the clean focal point near center so a 16:9 card crop keeps it.
Wide establishing shot, 16:9. No text, no signs, no logos, no brand marks, no cartoon characters, no costumed characters, no readable words anywhere.
```
**Alt text (final, matches the image):** A family of four walks hand in hand along a lagoon promenade toward a bronze ring-globe fountain, with palm trees, holiday garlands on lamp posts, and a sandstone fairytale castle and coaster track at sunset.

## 2) SOCIAL — Instagram/Facebook 1:1 → 1080×1080 JPG. More fun: a holiday-parade moment of kids' delight
```
Photorealistic close-up travel photo with a polished illustrated look, late-afternoon golden sun, extra-vivid saturated colors, shallow depth of field.
A delighted young child (generic, not a real person) riding on a parent's shoulders with both arms thrown up and mouth open in a joyful laugh, an older sibling beside them pointing up and grinning, watching a festive theme-park street parade go by.
Above the crowd: giant ORIGINAL parade balloons shaped like a puffy white snowflake, a golden star and a red-and-white striped candy cane (no faces, no characters, no logos), plus floating confetti and tinsel catching the light.
Background: palm trees wrapped in warm string lights, a decorated holiday tree in soft focus, colorful generic storefront facades with no signs.
Square 1:1 composition, the child's raised arms and face in the upper-center, safe margins on all sides.
No text, no signs, no logos, no brand marks, no cartoon characters, no costumed characters, no readable words.
```
**Alt text (final, matches the image):** A laughing child on a parent's shoulders throws both arms up while a sibling points at giant snowflake, star and candy-cane balloons, with palm trees in string lights and a decorated holiday tree behind.

## 3) SOCIAL — Pinterest pin, 9:16 → center-crop to 1000×1500 JPG. A ride-in-motion moment
```
Photorealistic travel photo with a polished illustrated look, bright sunny day, extra-vivid saturated colors, vertical 9:16 composition.
Two young kids (generic children, not real people) squealing with laughter in a round pastel-teal ride car on an ORIGINAL whimsical flying-boat spinning ride, one kid with hands in the air, a parent beside them grinning and holding on; motion blur on the spinning arms and the background.
Background: tall palm trees, bright pink and purple flower beds, a small ORIGINAL sandstone fairytale tower with a teal roof, a bronze ring-globe sculpture in the distance, and a deep blue sky with soft clouds. A few red-and-gold holiday garlands on the ride's canopy.
Keep the kids and ride car in the center two-thirds so a 2:3 center-crop loses nothing important; leave the top 15% as calm sky.
No text, no signs, no logos, no brand marks, no cartoon characters, no costumed characters, no fish or Seuss-style shapes, no readable words.
```
**Alt text (final, matches the image):** A boy with both hands up and a laughing girl ride a spinning teal ride car beside a grinning parent, with palm trees, flowers, a sandstone tower with a teal roof, a bronze ring globe and holiday garlands under a blue sky.

## After generating (parent resumes the executor)
1. Save the three files at the exact paths above (hero resized to 1376×768).
2. Upload the hero to Sanity as an image asset and set `heroImage` (+ `alt`) on `drafts.blogPost-universal-orlando-parks-with-kids` **only**. Never publish.
3. Update alt text in `social-pack.md` to match the actual images, commit, push once, open the PR (never merge), get the Netlify deploy preview URL.
