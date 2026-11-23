"""Post vs official (Universal pages saved in official/, accessed 2026-11-23) vs Sanity ride `heightRequirement` (NOT `height`). Writes HEIGHT-MISMATCHES.md."""
import json
S={x['name']:x for x in json.load(open('sanity-rides-raw-2026-11-23.json'))['result']}
# post name, official min (0=no minimum), source file, sanity doc name (None = no doc)
ROWS=[
("Illumination's Villain-Con Minion Blast",0,"uo-heights","Illumination's Villain-Con Minion Blast"),
("Kang & Kodos' Twirl 'n' Hurl",0,"ride-kang-and-kodos-twirl-and-hurl",None),
("E.T. Adventure",34,"uo-heights","E.T. Adventure"),
("Trolls Trollercoaster",36,"uo-heights","Trolls Trollercoaster"),
("Despicable Me Minion Mayhem",40,"uo-heights","Despicable Me Minion Mayhem"),
("The Simpsons Ride",40,"uo-heights","The Simpsons Ride"),
("Race Through New York Starring Jimmy Fallon",40,"uo-heights","Race Through New York"),
("TRANSFORMERS: The Ride-3D",40,"uo-heights","TRANSFORMERS: The Ride-3D"),
("Harry Potter and the Escape from Gringotts",42,"uo-heights","Harry Potter: Escape from Gringotts"),
("MEN IN BLACK Alien Attack",42,"uo-heights","MEN IN BLACK Alien Attack"),
("Revenge of the Mummy",48,"uo-heights","Revenge of the Mummy"),
("Hogwarts Express (both stations)",0,"uo-rider-safety + ride-hogwarts-express-hogsmeade-station (no minimum listed)","Hogwarts Express (Hogsmeade)"),
("Caro-Seuss-el",0,"ride-caro-seuss-el",None),
("One Fish, Two Fish, Red Fish, Blue Fish",0,"ride-one-fish-two-fish-red-fish","One Fish, Two Fish"),
("Storm Force Accelatron",0,"ride-storm-force-accelatron","Storm Force Accelatron"),
("The Cat in the Hat",36,"uo-heights","The Cat in the Hat"),
("The High in the Sky Seuss Trolley Train Ride!",36,"uo-heights","The High in the Sky Seuss Trolley"),
("Flight of the Hippogriff",36,"uo-heights + ride-flight-of-the-hippogriff","Flight of the Hippogriff"),
("Skull Island: Reign of Kong",36,"uo-heights","Skull Island: Reign of Kong"),
("Pteranodon Flyers",36,"uo-heights (designed for 36–56\")","Pteranodon Flyers"),
("The Amazing Adventures of Spider-Man",40,"uo-heights","The Amazing Adventures of Spider-Man"),
("Popeye & Bluto's Bilge-Rat Barges",42,"uo-heights + ride page","Popeye & Bluto's Bilge-Rat Barges"),
("Jurassic Park River Adventure",42,"uo-heights","Jurassic Park River Adventure"),
("Dudley Do-Right's Ripsaw Falls",44,"uo-heights + ride page","Dudley Do-Right's Ripsaw Falls"),
("Hagrid's Magical Creatures Motorbike Adventure",48,"uo-heights","Hagrid's Magical Creatures"),
("Harry Potter and the Forbidden Journey",48,"uo-heights","Harry Potter: Forbidden Journey"),
("Jurassic World VelociCoaster",51,"uo-heights","Jurassic World VelociCoaster"),
("Doctor Doom's Fearfall",52,"uo-heights","Doctor Doom's Fearfall"),
("The Incredible Hulk Coaster",54,"uo-heights","The Incredible Hulk Coaster"),
("Constellation Carousel",0,"uo-heights + ride-constellation-carousel","Constellation Carousel"),
("Fyre Drill",0,"uo-heights + ride-fyre-drill","Fyre Drill"),
("Yoshi's Adventure",34,"uo-heights + ride-yoshis-adventure","Yoshi's Adventure"),
("Mario Kart: Bowser's Challenge",40,"uo-heights","Mario Kart: Bowser's Challenge"),
("Mine-Cart Madness",40,"uo-heights","Donkey Kong Mine Cart Madness"),
("Hiccup's Wing Gliders",40,"uo-heights","Hiccup's Wing Gliders"),
("Harry Potter and the Battle at the Ministry",40,"uo-heights","Battle of the Ministry of Magic"),
("Curse of the Werewolf",40,"uo-heights","Curse of the Werewolf"),
("Stardust Racers",48,"uo-heights","Stardust Racers"),
("Dragon Racer's Rally",48,"uo-heights","Dragon Racer's Rally"),
("Monsters Unchained: The Frankenstein Experiment",48,"uo-heights","Monsters Unchained: The Frankenstein Experiment"),
]
out=["# Height check: post vs official Universal vs Sanity `heightRequirement` (2026-11-23)","",
"Official = universalorlando.com ride-height-requirements page + individual ride pages, accessed 2026-11-23 (saved in `official/`). Sanity = production ride docs, field `heightRequirement` (not `height`). 0 = no minimum.","",
"| Ride (post) | Official | Source | Sanity doc | Sanity heightRequirement | Result |","|---|---:|---|---|---:|---|"]
bad=0
for n,o,src,sn in ROWS:
    d=S.get(sn) if sn else None
    if not d: res='**MISSING DOC**'; bad+=1; out.append(f"| {n} | {o} | {src} | — | — | {res} |"); continue
    h=d.get('heightRequirement')
    res='OK' if h==o else ('**NULL**' if h is None else '**MISMATCH**')
    if res!='OK': bad+=1
    nm='' if sn==n else f" (Sanity name: {sn})"
    out.append(f"| {n} | {o} | {src} | `{d['_id']}`{nm} | {h} | {res} |")
out.append(f"\n{bad} row(s) need attention. Height values: see table.")
open('HEIGHT-MISMATCHES.md','w').write('\n'.join(out)+'\n'); print('\n'.join(out[-45:]))
