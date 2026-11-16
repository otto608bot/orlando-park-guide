# Image prompts + pack notes: Best Disney World Rides for Toddlers and Preschoolers, Park by Park
Slug: `disney-world-rides-for-toddlers-and-preschoolers` · Pack written 2026-11-16 · Status: **images NOT generated** (the executor that built this pack can't generate images). All art must be **new and original**, never reused or cropped from another post (Bennett, Nov 2). Follow `ops/hero-image-style.md`.

Files in this folder: `social-pack.md` (captions, Pinterest fields, UTM links, alt text) · `images/` (drop the generated files here).

## Rules for every image (from ops/hero-image-style.md + Bennett's rules)
- Illustrated, photo-style park scene. Photorealistic travel-photo look with AI-illustrated polish, not flat or cartoon.
- **No text, signs, logos or readable words. No real likenesses. No Disney logos, no Disney/Pixar/Marvel/Star Wars characters, no costumed characters.**
- **No castle that resembles Cinderella Castle** (no white castle with blue conical roofs, no gold-topped spires). Use the original, non-Disney design given below.
- Generic families seen from behind or in profile, faces not prominent (hero). Social images may show happy kids' faces, but they must be generic and not resemble real people.
- Check each output at full size and at card size. Redo anything with garbled text, extra limbs, logos or a castle that looks like a real one.

## 1) HERO — 16:9, generate at 1280×720 JPG (quality 85–90). Set as `heroImage` on the draft only.
```
Photorealistic travel photo with a polished illustrated look, warm golden-hour light, vivid saturated colors.
A generic family of four, seen from behind, faces not prominent: two parents, one toddler riding on a parent's shoulders and one preschooler holding a parent's hand, plus a compact stroller, walking along a warm stone-and-brick promenade toward a sunlit theme-park plaza.
Wide establishing shot, horizon in the upper third, people in the lower third, clean focal point in the center for a 16:9 crop.
In the middle distance: an ORIGINAL fairytale pavilion-castle in warm sandstone and coral with one broad rounded copper-green dome flanked by two short lantern towers and a ring of arched windows (clearly not a tall white castle, no blue conical roofs, no pointed gold spires), a calm lagoon in front of it, and to one side a silvery geodesic sphere pavilion rising above palm trees.
On the other side, a lush jungle-covered rock spire with a small waterfall, tall palms, pink and purple flower beds, a pastel carousel canopy and a gentle boat ride on the lagoon.
Blue sky with soft peach clouds and a soft sun glow.
No text, no signs, no logos, no brand marks, no cartoon characters, no costumed characters.
```
**Alt text:** A family with a toddler on a parent's shoulders and a preschooler holding hands walks a warm stone path toward a sunny theme-park plaza with a rounded-dome fairytale pavilion, a silvery sphere, palm trees and a lagoon.

## 2) SOCIAL — FB/IG 1:1, generate at 1080×1080 (save as `images/instagram-1x1.jpg`; the same file works for the Facebook link card if needed)
More fun and captivating than the hero: brighter color, close-up, kids' delight, a dynamic moment.
```
Photorealistic close-up travel photo with a polished illustrated look, bright midday sun, extra-vivid saturated colors, shallow depth of field.
A joyful toddler (generic child, not a real person) laughing with both arms thrown up high while riding a pastel-painted carousel horse that is mid-spin, a parent beside the horse laughing and holding the child's hand, motion blur in the carousel lights behind them.
Behind: palm trees, pink flower beds and a blue sky. An original generic carousel with plain pastel poles and no signs, flags or marks.
Square 1:1 composition with the child's face and raised arms in the upper-center, plenty of safe margin on all sides.
No text, no signs, no logos, no brand marks, no cartoon characters, no costumed characters.
```
**Alt text:** A laughing toddler with arms raised rides a pastel carousel horse while a parent walks beside it holding a hand, with palm trees and a sunny blue sky behind them.

## 3) SOCIAL — Pinterest pin, generate at 9:16 then center-crop to 1000×1500 (2:3) (save as `images/pinterest-9x16.jpg`)
```
Photorealistic travel photo with a polished illustrated look, bright sunny day, extra-vivid saturated colors, vertical 9:16 composition.
Two young kids (generic children, not real people) laughing and holding on in a whirling pastel teacup-style spinning ride, one kid with hands in the air, a parent smiling and waving from just outside the ride rail.
Background: tall palms, bright pink and purple flower beds, a small original fairytale tower in warm coral stone, and a deep blue sky with soft clouds.
Keep the kids and the teacup in the center two-thirds of the frame so a 2:3 center-crop loses nothing important; leave the top 15% of the frame as calm sky.
No text, no signs, no logos, no brand marks, no cartoon characters, no costumed characters.
```
**Alt text:** Two young kids laugh and hold on in a whirling pastel teacup ride at a sunny theme park, with palm trees, flower beds and a fairytale tower in the background.

## After generating
1. Save the files in `images/` and delete `images/.gitkeep`.
2. Upload the hero to Sanity and set `heroImage` (+ alt) on `drafts.blogPost-disney-world-rides-for-toddlers-and-preschoolers` only; never publish.
3. Update the social-pack.md "Images generated" checkbox and, if the real image differs from the prompt, rewrite the alt text to match.
