# Blog hero image style guide

Every blog post hero (`heroImage` in Sanity) must match the site's photo-style park scenes on /blog/. Do not use text-chart heroes. Charts belong inside the post body or in social packs.

## Look (taken from the current good heroes, Oct 2026)
- **Medium:** photorealistic travel photo with an AI-illustrated polish. It should not look flat, vector or cartoon.
- **Light:** warm golden hour or sunset, with a soft sun glow. Bright midday blue sky also works. Never dark or moody, except fireworks at dusk.
- **Palette:** saturated sky blues, sunset orange and peach, tropical greens, and pink or purple flower beds. Use warm stone or brick paths.
- **Composition:** a wide establishing shot of a landmark-style scene (castle-like spires, a geodesic sphere, jungle, a lagoon or palms) in the upper and middle frame. A generic family walks away from or across the camera in the lower third. Leave a clean focal point near the center, since the card crops to roughly 16:9 and the edges may be trimmed.
- **People:** generic families with kids, seen from behind or in profile, with no prominent faces. They must never resemble real people.
- **Size:** export at **1376×768 JPG** (about 1.79:1, matching most current heroes) at quality 85 to 90. Generate at 16:9, then resize.

## Rules
1. No text, signs, readable words, logos, or park or brand marks. Blur or regenerate any garbled text, including small items like menus and notebooks.
2. No trademarked characters (Mickey, princesses and so on) or costumed characters as the subject. Hint at them instead, for example kids looking excitedly off-frame or an autograph book.
3. Evocative but generic scenery is fine: a fairytale castle, a sphere, jungle huts. Don't copy exact trademarked façades.
4. Look at every output at full size and at card size before uploading. Redo any image with artifacts, extra limbs, garbled text or logos.
5. Write alt text that describes the scene, not "text graphic."
6. Upload to Sanity as an asset. Set `heroImage` on a `drafts.*` document only, and never publish.

## Prompt template
```
Photorealistic travel photo, warm golden-hour light, vivid saturated colors.
A generic family of {N} ({who}, seen from behind/side, faces not prominent)
{action} {setting: generic, non-trademarked park scene for the topic},
{2-3 scenery details: palms, flower beds, lagoon, spires...}.
Wide establishing shot, horizon in upper third, people in lower third,
blue sky with soft clouds. No text, no signs, no logos, no cartoon characters.
```
Aspect ratio: 16:9. Examples are in `ops/drafts/hero-refresh-2026-10-26/` (AK jungle path, MK main street castle, EPCOT lagoon sphere, character dining breakfast).
