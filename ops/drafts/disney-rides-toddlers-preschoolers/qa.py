"""Dual QA for the toddlers/preschoolers hub draft (2026-11-16). Pass 1 = author (links/anchors/format/SEO/structure); pass 2 = independent facts/policy/brand vs saved official Disney pages in official/."""
import re,urllib.request,sys,os,json
t=open('post.md').read(); body=t.split('---',2)[2]
links=re.findall(r'\[([^\]]+)\]\(([^)]+)\)',body); R=[]
def chk(name,ok,info=''): R.append((name,bool(ok),info))
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
for a,h in dict.fromkeys(links):
    u=h if h.startswith('http') else 'https://planyourpark.com'+h
    try: s=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':UA}),timeout=60).status
    except Exception as e: s=getattr(e,'code',0)
    amazon='amazon.com' in h
    chk(f'link {h}', s==200 or (amazon and s in (200,503)), s); chk(f'anchor<=60 "{a[:30]}"', len(a)<=60)
chk('no empty headings', not re.search(r'^#+\s*$',body,re.M))
chk('no empty list items', not re.search(r'^\s*[-*]\s*$|^\d+\.\s*$',body,re.M))
H2=re.findall(r'^## (.+)$',body,re.M); chk('no duplicate H2', len(set(H2))==len(H2))
title=re.search(r'title: "(.+)"',t).group(1); exc=re.search(r'excerpt: "(.+)"',t).group(1)
chk('title <= 70 chars', len(title)<=70, len(title)); chk('excerpt <= 200 chars', len(exc)<=200, len(exc))
chk('title has toddlers+preschoolers+Disney World+rides', all(w in title.lower() for w in ['disney world rides','toddlers','preschoolers']))
chk('excerpt has primary words + date', 'disney world rides for toddlers and preschoolers' in exc.lower() and 'November 16, 2026' in exc)
chk('first block is affiliate disclosure', body.strip().startswith('> Heads up'))
aff=[i for i in [body.find('amazon.com'),body.find('/deals/')] if i>=0]
chk('disclosure before first affiliate link', body.find('affiliate disclosure')>=0 and body.find('affiliate disclosure')<min(aff))
chk('amazon links tagged planyourpark-20', all('tag=planyourpark-20' in h for a,h in links if 'amazon.com' in h))
chk('>=5 ride-finder links', sum('/rides/for/' in h for a,h in links)>=5, sum('/rides/for/' in h for a,h in links))
chk('links /rides/ /parks/ /deals/ + 4 park pages', all(any(h==x for a,h in links) for x in ['/rides/','/parks/','/deals/','/parks/magic-kingdom/','/parks/epcot/','/parks/hollywood-studios/','/parks/animal-kingdom/']))
rel=['magic-kingdom-with-kids-rides-by-height','animal-kingdom-with-kids-rides-by-height','epcot-with-kids-rides-by-height','best-magic-kingdom-rides-kids-under-40-inches','disney-world-with-baby-toddler','disney-vs-universal-with-kids-2026','disney-world-packing-list-kids','best-disney-world-character-dining-kids']
chk('links all 8 related posts', all(any(f'/blog/{s}/'==h for a,h in links) for s in rel))
chk('does not link parked/unpublished Orlando post', 'orlando-theme-parks-for-families' not in body)
faq=body.split('## FAQ')[1]; qs=re.findall(r'^\*\*(.+\?)\*\*',faq,re.M); chk('FAQ has >=8 questions', len(qs)>=8, len(qs))
for q in ['toddler go on','4-year-olds','no height requirement','Animal Kingdom rides for toddlers','preschoolers','under 40 inches','most rides for little kids']: chk(f'FAQ covers: {q}', any(q.lower() in x.lower() for x in qs))
chk('no first-person lore', not re.search(r"\b(I|I've|I'm|my kids|our kids|our son|our daughter|when we went|we visited|we rode|our trip)\b",body))
chk('no Genie+/Lightning Lane', not re.search(r'Genie\+|Lightning Lane',body))
chk('no prices / $', '$' not in body)
chk('no age-to-height mapping', not re.search(r'\d-year-olds? (is|are) (about|around|usually)|most \d',body))
d=body.count('November 16, 2026'); chk('facts dated Nov 16, 2026 (>=8x)', d>=8, d)
chk('no hype words', not re.search(r'\b(must-do|must-ride|ultimate|perfect|amazing|guaranteed|never miss)\b',body,re.I))
n1=len(R)
# ---- pass 2: facts vs official pages ----
def off(f): return open(f'official/{f}.txt').read()
def hts(f):
    x=off(f); return x
ANY={ # name as in post -> official file; must say Any Height
 'Dumbo the Flying Elephant':'magic-kingdom__dumbo-the-flying-elephant','Prince Charming Regal Carrousel':'magic-kingdom__prince-charming-regal-carrousel','The Magic Carpets of Aladdin':'magic-kingdom__magic-carpets-of-aladdin','Mad Tea Party':'magic-kingdom__mad-tea-party','Astro Orbiter':'magic-kingdom__astro-orbiter','Tomorrowland Transit Authority PeopleMover':'magic-kingdom__tomorrowland-transit-authority-peoplemover','Peter Pan\'s Flight':'magic-kingdom__peter-pan-flight','The Many Adventures of Winnie the Pooh':'magic-kingdom__many-adventures-of-winnie-the-pooh','"it\'s a small world"':'magic-kingdom__its-a-small-world','Under the Sea - Journey of The Little Mermaid':'magic-kingdom__under-the-sea-journey-of-the-little-mermaid','Buzz Lightyear\'s Space Ranger Spin':'magic-kingdom__buzz-lightyear-space-ranger-spin','Haunted Mansion':'magic-kingdom__haunted-mansion','Pirates of the Caribbean':'magic-kingdom__pirates-of-the-caribbean','Jingle Cruise':'magic-kingdom__jingle-cruise','Walt Disney World Railroad':'magic-kingdom__walt-disney-world-railroad','Mickey\'s PhilharMagic':'magic-kingdom__mickeys-philharmagic','Enchanted Tales with Belle':'magic-kingdom__enchanted-tales-with-belle','Monsters, Inc. Laugh Floor':'magic-kingdom__monsters-inc-laugh-floor','Casey Jr. Splash \'N\' Soak Station':'magic-kingdom__casey-jr-splash-n-soak-station','Swiss Family Treehouse':'magic-kingdom__swiss-family-treehouse',
 'Frozen Ever After':'epcot__frozen-ever-after','The Seas with Nemo & Friends':'epcot__seas-with-nemo-and-friends','Journey Into Imagination With Figment':'epcot__journey-into-imagination-with-figment','Gran Fiesta Tour':'epcot__gran-fiesta-tour-starring-three-caballeros','Living with the Land':'epcot__living-with-the-land','Remy\'s Ratatouille Adventure':'epcot__remys-ratatouille-adventure','Spaceship Earth':'epcot__spaceship-earth','Journey of Water, Inspired by Moana':'epcot__journey-of-water','ImageWorks':'epcot__imageworks','Turtle Talk With Crush':'epcot__turtle-talk-with-crush','Disney and Pixar Short Film Festival':'epcot__disney-pixar-short-film-festival','Bruce\'s Shark World':'epcot__bruces-shark-world','Kidcot Fun Stops':'epcot__kidcot-fun-stops',
 'Toy Story Mania!':'hollywood-studios__toy-story-mania','Mickey & Minnie\'s Runaway Railway':'hollywood-studios__mickey-minnies-runaway-railway','Vacation Fun':'hollywood-studios__vacation-fun',
 'Kilimanjaro Safaris':'animal-kingdom__kilimanjaro-safaris','Na\'vi River Journey':'animal-kingdom__navi-river-journey','Wildlife Express Train':'animal-kingdom__wildlife-express-train','Gorilla Falls Exploration Trail':'animal-kingdom__gorilla-falls-forest-exploration-trail','Maharajah Jungle Trek':'animal-kingdom__maharajah-jungle-trek','Discovery Island Trails':'animal-kingdom__discovery-island-trails','Zootopia: Better Zoogether!':'animal-kingdom__zootopia-better-zoogether','Wilderness Explorers':'animal-kingdom__wilderness-explorers','Animal Care at Conservation Station':'animal-kingdom__conservation-station'}
for n,f in ANY.items():
    chk(f'any height official: {n}', n in body and 'Any Height' in off(f), f)
H={ # name -> (inches, file)
 'Tomorrowland Speedway':(32,'magic-kingdom__tomorrowland-speedway'),'The Barnstormer':(35,'magic-kingdom__barnstormer-starring-great-goofini'),'Seven Dwarfs Mine Train':(38,'magic-kingdom__seven-dwarfs-mine-train'),'Big Thunder Mountain Railroad':(38,'magic-kingdom__big-thunder-mountain-railroad'),"Tiana's Bayou Adventure":(40,'magic-kingdom__tianas-bayou-adventure'),'Space Mountain':(44,'magic-kingdom__space-mountain'),
 'Test Track':(40,'epcot__test-track'),"Soarin' Across America":(40,'epcot__soarin-across-america'),'Mission: SPACE (Green)':(40,'epcot__mission-space'),'Guardians of the Galaxy: Cosmic Rewind':(42,'epcot__guardians-of-the-galaxy-cosmic-rewind'),'Mission: SPACE (Orange)':(44,'epcot__mission-space'),
 'Alien Swirling Saucers':(32,'hollywood-studios__alien-swirling-saucers'),'Slinky Dog Dash':(38,'hollywood-studios__slinky-dog-dash'),'Millennium Falcon: Smugglers Run':(38,'hollywood-studios__millennium-falcon-smugglers-run'),'Star Tours':(40,'hollywood-studios__star-tours'),'Star Wars: Rise of the Resistance':(40,'hollywood-studios__star-wars-rise-of-the-resistance'),'The Twilight Zone Tower of Terror':(40,'hollywood-studios__twilight-zone-tower-of-terror'),"Rock 'n' Roller Coaster Starring The Muppets":(48,'hollywood-studios__rock-and-roller-coaster-starring-muppets'),
 'Kali River Rapids':(38,'animal-kingdom__kali-river-rapids'),'Avatar Flight of Passage':(44,'animal-kingdom__avatar-flight-of-passage'),'Expedition Everest':(44,'animal-kingdom__expedition-everest')}
for n,(inch,f) in H.items():
    x=off(f); base=n.split(' (')[0]; short=base.replace(' Starring The Muppets','').replace(' (Green)','')
    ok=bool(re.search(rf'\b{inch}\s?(in|"|”)',x))
    chk(f'height {inch}" official: {n}', ok, f)
# the body must state the height next to the ride in the at-a-glance list
glance=body.split('## Disney World Rides by Height at a Glance')[1].split('Source:')[0]
exp={'Any height':None,'32 inches':['Tomorrowland Speedway','Alien Swirling Saucers'],'35 inches':['The Barnstormer'],'38 inches':['Seven Dwarfs Mine Train','Big Thunder Mountain Railroad','Slinky Dog Dash','Millennium Falcon: Smugglers Run','Kali River Rapids'],'40 inches':['Test Track',"Soarin' Across America",'Mission: SPACE (Green)','Star Tours','Star Wars: Rise of the Resistance','The Twilight Zone Tower of Terror',"Tiana's Bayou Adventure"],'42 inches':['Guardians of the Galaxy: Cosmic Rewind'],'44 inches':['Space Mountain','Mission: SPACE (Orange)','Avatar Flight of Passage','Expedition Everest']}
for lab,names in exp.items():
    if not names: continue
    line=[l for l in glance.split('\n') if l.startswith(f'- **{lab}:**')]
    chk(f'glance line {lab}', bool(line) and all(n in line[0] for n in names), lab)
# counts of any-height rides (our definition) vs official pages
MK=['Dumbo the Flying Elephant','Prince Charming Regal Carrousel','The Magic Carpets of Aladdin','Mad Tea Party','Astro Orbiter','Tomorrowland Transit Authority PeopleMover',"Peter Pan's Flight",'The Many Adventures of Winnie the Pooh','"it\'s a small world"','Under the Sea - Journey of The Little Mermaid',"Buzz Lightyear's Space Ranger Spin",'Haunted Mansion','Pirates of the Caribbean','Jingle Cruise','Walt Disney World Railroad']
EP=['Frozen Ever After','The Seas with Nemo & Friends','Journey Into Imagination With Figment','Gran Fiesta Tour','Living with the Land',"Remy's Ratatouille Adventure",'Spaceship Earth']
HS=['Toy Story Mania!',"Mickey & Minnie's Runaway Railway"]; AK=['Kilimanjaro Safaris',"Na'vi River Journey",'Wildlife Express Train']
for nm,L,c in [('MK',MK,15),('EPCOT',EP,7),('HS',HS,2),('AK',AK,3)]:
    chk(f'{nm} any-height count = {c} (each Any Height officially + named in post)', len(L)==c and all('Any Height' in off(ANY[n]) and n in body for n in L), len(L))
chk('quick-answer counts text 15/7/3/2', 'Magic Kingdom has 15 rides open to any height, EPCOT has 7, Animal Kingdom has 3 and Hollywood Studios has 2' in body)
chk('FAQ counts text matches', 'Magic Kingdom has 15 by our count, EPCOT has 7, Animal Kingdom has 3 and Hollywood Studios has 2' in body)
chk('smallest posted minimum 32 in (no listed ride below 32)', not any(re.search(r'\b(3[01]|[12]\d)in \(',off(f)) for f in set(f for _,f in H.values())))
# closures / status
chk('Tiana: Nov 2 refurb, reopen December 2026 on official page', 'temporarily close for routine refurbishment on November 2' in off('magic-kingdom__tianas-bayou-adventure') and 'expected to reopen in December 2026' in off('magic-kingdom__tianas-bayou-adventure'))
chk('Jungle Cruise: No times available + Jingle Cruise + returns early next year', 'No times available' in off('magic-kingdom__jungle-cruise') and 'return early next year' in off('magic-kingdom__jungle-cruise') and 'Jingle Cruise' in off('magic-kingdom__jingle-cruise'))
rr=off('magic-kingdom__walt-disney-world-railroad'); chk('Railroad modified route (Main St <-> Fantasyland only)', 'modified route that excludes Frontierland' in rr and 'between Main Street station and Fantasyland station only' in rr)
sa=off('epcot__soarin-around-world'); chk('Soarin Around the World unavailable -> Across America', 'currently unavailable' in sa and 'Soarin’ Across America' in sa)
chk('DuckTales under refurbishment/limited', 'currently under refurbishment and may be available in a limited format' in off('epcot__ducktales-world-showcase'))
lst=open('official/_list_animal-kingdom.txt').read()
chk('AK list truly lacks DINOSAUR and TriceraTop', not re.search(r'>\s*DINOSAUR\s*<|TriceraTop',lst))
# quoted official wording
Q=[('Magic Kingdom','Dumbo','whimsical flight aboard Dumbo','magic-kingdom__dumbo-the-flying-elephant'),('','Carrousel','Ride atop a regal steed','magic-kingdom__prince-charming-regal-carrousel'),('','Buzz','dark, slow-moving and suitable for all ages','magic-kingdom__buzz-lightyear-space-ranger-spin'),('','Haunted','some mildly frightening scenes','magic-kingdom__haunted-mansion'),('','Haunted','no gore','magic-kingdom__haunted-mansion'),('','Haunted','slow-moving','magic-kingdom__haunted-mansion'),('','SmallWorld','gentle 10-minute journey','magic-kingdom__its-a-small-world'),('','PeopleMover','10-minute tour','magic-kingdom__tomorrowland-transit-authority-peoplemover'),('','PhilharMagic','12-minute','magic-kingdom__mickeys-philharmagic'),('','Barnstormer','junior roller coaster','magic-kingdom__barnstormer-starring-great-goofini'),('','Speedway','at least 54 inches','magic-kingdom__tomorrowland-speedway'),('','TeaParty','turn slowly, or not at all','magic-kingdom__mad-tea-party'),
 ('','Seas','gentle ride','epcot__seas-with-nemo-and-friends'),('','Gran','gentle boat ride','epcot__gran-fiesta-tour-starring-three-caballeros'),('','Gran','dark boat ride','epcot__gran-fiesta-tour-starring-three-caballeros'),('','Land','gentle boat tour','epcot__living-with-the-land'),('','ImageWorks','little ones can explore their senses','epcot__imageworks'),('','Mission','doesn’t spin','epcot__mission-space'),('','AlienSaucers','intergalactic spin','hollywood-studios__alien-swirling-saucers'),('','Kili','18-minute','animal-kingdom__kilimanjaro-safaris'),('','Train','7-minute, 1.2-mile','animal-kingdom__wildlife-express-train'),('','Explorers','over 20 badges','animal-kingdom__wilderness-explorers'),('','Kali','You will surely get splashed','animal-kingdom__kali-river-rapids')]
for _,k,q,f in Q:
    qq=q.replace('’',"'"); x=off(f).replace('’',"'").replace('“','"').replace('”','"')
    chk(f'official wording [{k}]: "{q}"', qq.lower() in x.lower(), f)
chk('Rider Switch page says adults take turns + skip standard queue', 'take turns' in open('official/_rider_switch.txt').read() and 'without having to wait in the standard queue' in open('official/_rider_switch.txt').read())
chk('First Aid page: theme parks and water parks', 'Theme Parks and Water Parks' in open('official/_first_aid.txt').read())
hl=open('official/_list_hollywood-studios.txt').read()
for s in ['Disney Jr. Mickey Mouse Clubhouse Live!','For the First Time in Forever: A Frozen Sing-Along Celebration','The Little Mermaid – A Musical Adventure','Beauty and the Beast – Live on Stage','Vacation Fun']: chk(f'HS list contains: {s}', s in hl, s)
chk('Muppet*Vision / Riverboat not recommended in post', not re.search(r'Muppet\*Vision|Riverboat',body))
chk('Tiana described closed + 40 in only (not recommended as toddler ride)', "Tiana's Bayou Adventure** — " not in body)
for i,(n,ok,inf) in enumerate(R):
    if i==n1: print('-- pass 2 --')
    print('PASS' if ok else 'FAIL',n,inf)
print('pass1 fails',sum(not ok for n,ok,i in R[:n1]),'| pass2 fails',sum(not ok for n,ok,i in R[n1:]),'| checks',len(R))
sys.exit(any(not ok for n,ok,i in R))
