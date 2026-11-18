"""Compare Sanity ride docs (published, WDW 4 parks) with official Disney pages saved in official/ (2026-11-16). Report only; never writes Sanity."""
import json,re,os
S=json.load(open('sanity-wdw-rides-snapshot-2026-11-16.json'))
MAP={ # sanity name -> official file stem
"Astro Orbiter":"magic-kingdom__astro-orbiter","Buzz Lightyear's Space Ranger Spin":"magic-kingdom__buzz-lightyear-space-ranger-spin","Country Bear Musical Jamboree":"magic-kingdom__country-bear-jamboree","Dumbo the Flying Elephant":"magic-kingdom__dumbo-the-flying-elephant","Enchanted Tales with Belle":"magic-kingdom__enchanted-tales-with-belle","Haunted Mansion":"magic-kingdom__haunted-mansion","It's a Small World":"magic-kingdom__its-a-small-world","Jungle Cruise":"magic-kingdom__jungle-cruise","Liberty Square Riverboat":"magic-kingdom__liberty-square-riverboat","Mad Tea Party":"magic-kingdom__mad-tea-party","Mickey's PhilharMagic":"magic-kingdom__mickeys-philharmagic","Peter Pan's Flight":"magic-kingdom__peter-pan-flight","Pirates of the Caribbean":"magic-kingdom__pirates-of-the-caribbean","Prince Charming Regal Carrousel":"magic-kingdom__prince-charming-regal-carrousel","Swiss Family Treehouse":"magic-kingdom__swiss-family-treehouse","The Magic Carpets of Aladdin":"magic-kingdom__magic-carpets-of-aladdin","The Many Adventures of Winnie the Pooh":"magic-kingdom__many-adventures-of-winnie-the-pooh","Tomorrowland Transit Authority PeopleMover":"magic-kingdom__tomorrowland-transit-authority-peoplemover","Under the Sea ~ Journey of The Little Mermaid":"magic-kingdom__under-the-sea-journey-of-the-little-mermaid","Walt Disney World Railroad":"magic-kingdom__walt-disney-world-railroad","Tomorrowland Speedway":"magic-kingdom__tomorrowland-speedway","The Barnstormer":"magic-kingdom__barnstormer-starring-great-goofini","Big Thunder Mountain Railroad":"magic-kingdom__big-thunder-mountain-railroad","Seven Dwarfs Mine Train":"magic-kingdom__seven-dwarfs-mine-train","Tiana's Bayou Adventure":"magic-kingdom__tianas-bayou-adventure","Space Mountain":"magic-kingdom__space-mountain","TRON Lightcycle / Run":"magic-kingdom__tron-lightcycle-run",
"Kilimanjaro Safaris":"animal-kingdom__kilimanjaro-safaris","Na'vi River Journey":"animal-kingdom__navi-river-journey","Wildlife Express Train":"animal-kingdom__wildlife-express-train","Kali River Rapids":"animal-kingdom__kali-river-rapids","Avatar Flight of Passage":"animal-kingdom__avatar-flight-of-passage","Expedition Everest":"animal-kingdom__expedition-everest","DINOSAUR":"animal-kingdom__dinosaur","It's Tough to be a Bug!":None,"TriceraTop Spin":None,
"Disney and Pixar Short Film Festival":"epcot__disney-pixar-short-film-festival","Frozen Ever After":"epcot__frozen-ever-after","Gran Fiesta Tour":"epcot__gran-fiesta-tour-starring-three-caballeros","Journey into Imagination with Figment":"epcot__journey-into-imagination-with-figment","Journey of Water, Inspired by Moana":"epcot__journey-of-water","Living with the Land":"epcot__living-with-the-land","Remy's Ratatouille Adventure":"epcot__remys-ratatouille-adventure","Spaceship Earth":"epcot__spaceship-earth","The Seas with Nemo & Friends":"epcot__seas-with-nemo-and-friends","Turtle Talk with Crush":"epcot__turtle-talk-with-crush","Mission: SPACE (Green)":"epcot__mission-space","Soarin' Across America":"epcot__soarin-across-america","Test Track":"epcot__test-track","Guardians of the Galaxy: Cosmic Rewind":"epcot__guardians-of-the-galaxy-cosmic-rewind","Mission: SPACE (Orange)":"epcot__mission-space",
"Mickey & Minnie's Runaway Railway":"hollywood-studios__mickey-minnies-runaway-railway","Muppet*Vision 3D":"hollywood-studios__muppet-vision-3d","Toy Story Mania!":"hollywood-studios__toy-story-mania","Alien Swirling Saucers":"hollywood-studios__alien-swirling-saucers","Millennium Falcon: Smugglers Run":"hollywood-studios__millennium-falcon-smugglers-run","Slinky Dog Dash":"hollywood-studios__slinky-dog-dash","Star Tours":"hollywood-studios__star-tours","Star Wars: Rise of the Resistance":"hollywood-studios__star-wars-rise-of-the-resistance","The Twilight Zone Tower of Terror":"hollywood-studios__twilight-zone-tower-of-terror","Rock 'n' Roller Coaster":"hollywood-studios__rock-and-roller-coaster-starring-muppets"}
def official(stem):
    if not stem: return ('n/a (no page; DinoLand-era closure)',None)
    t=open(f'official/{stem}.txt').read()
    if 'final=' in t.split('\n')[1] and t.split('\n')[1].split('final=')[1].rstrip('/').rsplit('/',1)[-1] in ('magic-kingdom','epcot','hollywood-studios','animal-kingdom') : return ('PAGE REDIRECTS TO PARK LIST (attraction no longer listed)',None)
    if '404' in t.split('\n')[1].split()[1]: return ('404',None)
    lines=[l.strip() for l in t.split('\n')]
    if stem.endswith('dinosaur'): return ('generic park page (DINOSAUR not listed)',None)
    if stem.endswith('liberty-square-riverboat'): return ('generic park page (not listed)',None)
    if stem.endswith('mission-space') and 'ORANGE' in os.environ.get('MS',''): return ('44” and taller (Orange Mission)',44)
    m=[l for l in lines if re.match(r'^\d+ ?(in|")\s?\(\d+ ?cm\)',l,re.I)]
    if m: return (m[0],int(re.match(r'\d+',m[0]).group(0)))
    if any(l=='Any Height' for l in lines): return ('Any Height',0)
    return ('not shown',None)
rows=[];mism=[]
for r in S:
    name=r['name']
    if r['_id'].startswith('drafts.'): continue
    stem=MAP.get(name,'?')
    if stem=='?': rows.append((r['park'],name,r['heightRequirement'],'NO MAPPING',r.get('isClosed')));continue
    os.environ['MS']='ORANGE' if 'Orange' in name else ''
    txt,h=official(stem)
    flag=''
    if h is not None and h!=r['heightRequirement']: flag='HEIGHT MISMATCH'
    if h is None and 'REDIRECT' in txt and not r.get('isClosed'): flag='NOT LISTED OFFICIALLY BUT OPEN IN SANITY'
    rows.append((r['park'],name,r['heightRequirement'],txt,r.get('isClosed'),flag))
print('| Park | Sanity ride | Sanity height | Official (2026-11-16) | Sanity isClosed | Flag |\n|---|---|---|---|---|---|')
for x in rows: print('|',' | '.join(str(i) if i is not None else '' for i in (list(x)+[''])[:6]),'|')
