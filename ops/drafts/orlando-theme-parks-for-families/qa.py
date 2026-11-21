"""Dual QA for Orlando theme parks for families draft (2026-11-16). Pass 1 = author (links/anchors/format/SEO); pass 2 = independent facts/closures/policy/brand vs official-extract-2026-11-16.txt."""
import re,urllib.request,sys
t=open('post.md').read(); body=t.split('---',2)[2]
ext=re.sub(r'[ \xa0]+',' ',open('official-extract-2026-11-16.txt').read())
links=re.findall(r'\[([^\]]+)\]\(([^)]+)\)',body); R=[]
def chk(name,ok,info=''): R.append((name,bool(ok),info))
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
for a,h in dict.fromkeys(links):
    u=h if h.startswith('http') else 'https://planyourpark.com'+h
    if 'universalorlando.com' in u: chk(f'link {h}', 'ride-height-requirements' in u, 'bot-walled; verified via headless Chrome, see extract'); chk(f'anchor<=60 "{a[:30]}"', len(a)<=60); continue
    try: s=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':UA}),timeout=40).status
    except Exception as e: s=getattr(e,'code',0)
    chk(f'link {h}', s==200, s); chk(f'anchor<=60 "{a[:30]}"', len(a)<=60)
chk('no empty headings', not re.search(r'^#+\s*$',body,re.M))
chk('no empty list items', not re.search(r'^\s*[-*]\s*$|^\d+\.\s*$',body,re.M))
H2=re.findall(r'^## (.+)$',body,re.M); chk('no duplicate H2', len(set(H2))==len(H2))
title=re.search(r'title: "(.+)"',t).group(1); chk('title <= 60 chars', len(title)<=60, len(title))
chk('excerpt <= 200 chars', len(re.search(r'excerpt: "(.+)"',t).group(1))<=200)
chk('primary query words in title', 'orlando theme parks for families' in title.lower() and 'height' in title.lower())
chk('H2 answers "how many theme parks"', 'How Many Theme Parks Are in Orlando?' in body)
chk('FAQ answers "what are all the parks"', 'What are all the theme parks in Orlando?' in body)
chk('all 9 park pages linked', all(f'/parks/{p}/' in body for p in ['magic-kingdom','epcot','hollywood-studios','animal-kingdom','universal-studios-florida','islands-of-adventure','seaworld-orlando','legoland-florida']) and '/rides/for/epic-universe-under-40/' in body)
n1=len(R)
first_aff=min(i for i in [body.find('tkqlhce'),body.find('dpbolvw'),body.find('anrdoezrs'),body.find('/deals/')] if i>=0)
chk('disclosure before first affiliate link', 0<=body.find('affiliate disclosure') < first_aff)
for k,u in {'disney4DayParkHopper':'https://www.tkqlhce.com/click-101693488-12783539','universal3Park3Day':'https://www.dpbolvw.net/click-101693488-12983229','seaworld':'https://www.tkqlhce.com/click-101693488-12540778','legoland':'https://www.anrdoezrs.net/click-101693488-12540781'}.items():
    chk(f'affiliate = config {k}', u in body and u in open('../../../web/src/config/affiliate-links.ts').read())
chk('no mislabeled Epic affiliate (12834895)', '12834895' not in body)
chk('>=8 ride-finder links', sum('/rides/for/' in h for a,h in links)>=8, sum('/rides/for/' in h for a,h in links))
chk('park chooser /parks/ linked >=3x', sum(h=='/parks/' for a,h in links)>=3, sum(h=='/parks/' for a,h in links))
chk('no first-person lore', not re.search(r"\b(I|I've|I'm|my kids|our kids|our son|our daughter|when we went|we visited|we rode|our trip)\b",body))
chk('no Genie+/Lightning Lane', not re.search(r'Genie\+|Lightning Lane',body))
chk('no prices', not re.search(r'\$\d',body))
chk('no invented age ranges', not re.search(r'ages? \d+ to \d+|roughly \d',body))
# heights: (phrase in body, needle in official extract)
H={"Peter Pan's Flight and Dumbo the Flying Elephant at **any height**":["Peter Pan's Flight | All Ages","Dumbo the Flying Elephant | All Ages"],
"Seven Dwarfs Mine Train and Big Thunder Mountain Railroad, both **38 inches**":['Seven Dwarfs Mine Train | 38"','Big Thunder Mountain Railroad | 38"'],
"Frozen Ever After and Remy's Ratatouille Adventure are both open to **any height**":['Frozen Ever After | All Ages',"Remy's Ratatouille Adventure | All Ages"],
"Test Track needs **40 inches**":['Test Track | 40"'],
"Toy Story Mania! and Mickey & Minnie's Runaway Railway are open to **any height**":['toy-story-mania.html: heights=[\'Any Height\']',"mickey-minnies-runaway-railway.html: heights=['Any Height']"],
"Alien Swirling Saucers starts at **32 inches**":['Alien Swirling Saucers | 32"'],
"Slinky Dog Dash and Millennium Falcon: Smugglers Run both need **38 inches**":['Slinky Dog Dash | 38"','Millennium Falcon: Smugglers Run | 38"'],
"Kilimanjaro Safaris and Na'vi River Journey are open to **any height**":["kilimanjaro-safaris.html: heights=['Any Height']","navi-river-journey.html: heights=['Any Height']"],
"Kali River Rapids needs **38 inches** (Disney warns you will get wet)":['Kali River Rapids | 38"','You Will Get Wet'],
"Avatar Flight of Passage needs **44 inches**":['Avatar Flight of Passage | 44"'],
"Illumination's Villain-Con Minion Blast has **no minimum height**":['Villain-Con Minion Blast\nSupervising Companion required for children under 48'],
"E.T. Adventure starts at **34 inches**":['E.T. Adventure™\nMust be at least 34"'],
"Trolls Trollercoaster at **36 inches**":['Trolls Trollercoaster\nMust be at least 36"'],
"Despicable Me Minion Mayhem at **40 inches**":['Despicable Me Minion Mayhem™\nMust be at least 40"','must experience this attraction from an adjacent stationary seat'],
"The Cat in the Hat, Flight of the Hippogriff and Skull Island: Reign of Kong all start at **36 inches**":['Cat in the Hat™Must be at least 36"','Flight of the Hippogriff™Must be at least 36"','Skull Island: Reign of Kong™Must be at least 36"'],
"The Amazing Adventures of Spider-Man needs **40 inches**":['Spider-Man®Must be at least 40"'],
"Jurassic World VelociCoaster (51 inches)":['VelociCoaster*Must be at least 51'],
"Constellation Carousel and Fyre Drill have **no minimum height**":['Constellation CarouselSupervising Companion required','Fyre DrillSupervising Companion required'],
"Yoshi's Adventure starts at **34 inches**":["Yoshi's Adventure™*Minimum Height 34"],
"Mario Kart: Bowser's Challenge, Mine-Cart Madness, Hiccup's Wing Gliders and Harry Potter and the Battle at the Ministry":['Bowser’s Challenge™*Minimum Height 40','Mine-Cart Madness™*Minimum Height 40',"Hiccup's Wing Gliders*Minimum Height 40",'Battle at the Ministry™*Minimum Height 40'],
"Monsters Unchained: The Frankenstein Experiment needs **48 inches**":['Frankenstein Experiment*Minimum Height 48'],
"Elmo's Choo Choo Train at **36 inches**":['won’t want to miss! 36” min. height'],
"Super Grover's Box Car Derby at **38 inches**":['Box Car Derby roller coaster. 38” min. height'],
"Expedition Odyssey: Fire & Ice, needs **39 inches**":['height requirement of just 39 inches'],
"Penguin Trek needs **42 inches** (42 to 48 inches with a supervising companion)":['Penguin Trek - Minimum 42" (42" - 48" with a supervising companion)'],
"Mako and Manta need **54 inches**":['Mako® - Minimum 54"','Manta® - Minimum 54"'],
"Mako (54 inches)":['Mako® - Minimum 54"'],
"Lost Kingdom Adventure starts at **30 inches**":['Lost Kingdom Adventure Minimum rider height is 30 inches'],
"Galacticoaster at **36 inches**":['Galacticoaster Rider must be at least 36"'],
"The Dragon at **40 inches**":['The Dragon Minimum rider height is 40 inches'],
"Coastersaurus at **42 inches**":['Coastersaurus Minimum rider height is 42 inches']}
for k,vs in H.items(): chk(f'height body+extract: {k[:45]}', k in body and all(v in ext for v in vs), [v[:25] for v in vs if v not in ext])
C={"**Tiana's Bayou Adventure** is in a routine refurbishment that started November 2, and Disney expects it to reopen in December 2026":"Tiana’s Bayou Adventure will temporarily close for routine refurbishment on November 2 and is expected to reopen in December 2026",
"from November 27 to December 30, 2026, Disney is offering Living with the Land - Glimmering Greenhouses":"From November 27 to December 30, 2026, Living with the Land - Glimmering Greenhouses will be offered",
"**Jurassic Park River Adventure** is listed as closed through December 16, 2026":"Jurassic Park River Adventure: January 5, 2026 - December 16, 2026",
"scheduled to close December 11 to 15, 2026":"Monsters Unchained: December 11, 2026 - December 15, 2026",
"Volcano Bay is closed for maintenance with a planned reopening on or before April 1, 2027":"planned reopening on or before April 1, 2027",
"LEGOLAND Water Park is closed for the season":"LEGOLAND Water Park: Closed for the Season",
"Abby's Flower Tower and Infinity Falls closed for annual maintenance, and Sky Tower temporarily closed":"Abby's Flower Tower Just a sprinkle",
"LEGO NINJAGO The Ride and The Dragon as closed **November 30 to December 18**":"LEGO NINJAGO The Ride (11/30 - 12/18) The Dragon (11/30 - 12/18)",
"Pirate River Quest, Battle of Bricksburg, DUPLO Tractor and Kid Power Towers with no end date posted":"Pirate River Quest Battle of Bricksburg (Starting 11/2) DUPLO® Tractor (Starting 11/2)"}
for k,v in C.items(): chk(f'closure body+extract: {k[:45]}', k in body and v in ext)
chk('SeaWorld closures in extract', all(x in ext for x in ['Closed for Annual Maintenance Kid Friendly','42” min. height. Closed for Annual Maintenance','Temporarily Closed Kid Friendly']) and 'Kid Power Towers (Starting 11/10)' in ext)
E={"Disney's holiday season runs November 13 to January 6":"from November 13 to January 6",
"select nights from November 8 to December 22, 2026, and Disney says all 2026 dates have sold out":"All 2026 event dates have sold out",
"International Festival of the Holidays runs November 27 to December 30, 2026":"Festival of the Holidays Presented by AdventHealth Discover festive traditions from cultures around the world—from November 27 to December 30, 2026",
"select nights from November 7, 2026, to January 5, 2027":"select nights from November 7, 2026, to January 5, 2027",
"Merry Menagerie of arctic-animal puppets on Discovery Island and a holiday edition of Tree of Life Awakenings":"Tree of Life Awakenings Holiday Edition",
"Holidays run November 14, 2026, to January 3, 2027":"November 14 through January 3, 2027",
"(included with a theme park ticket)":"Included with Your Theme Park Ticket",
"Christmas Celebration runs on select dates from November 6 to January 4":"Christmas Celebration Select Dates, Nov. 6 - Jan. 4",
"November 21, 22, 27, 28 and 29; December 5, 6, 12, 13 and 18 to 31; and January 1 to 3":"November - 21, 22, 27, 28, 29 December- 5, 6, 12, 13, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 January- 1, 2, 3",
"Christmas Bricktacular is included with admission":"Christmas Bricktacular is included in General Park Admission",
"LEGOLAND is in Winter Haven":"Winter Haven, FL"}
for k,v in E.items(): chk(f'event body+extract: {k[:45]}', k in body and v in ext)
chk('facts dated Nov 16, 2026', 'November 16, 2026' in body)
chk('Tiana not recommended as open', not re.search(r"Tiana's Bayou Adventure[^.]*(open to|needs|starts)",body))
chk('no closed ride recommended (Jurassic River, Infinity Falls, Abby, Kid Power, NINJAGO as open)', not re.search(r'(Infinity Falls|Abby|Kid Power Towers|NINJAGO)[^.]*(starts at|needs \*\*)',body))
for i,(n,ok,inf) in enumerate(R):
    if i==n1: print('-- pass 2 --')
    print('PASS' if ok else 'FAIL',n,inf)
print('pass1 fails',sum(not ok for n,ok,i in R[:n1]),'| pass2 fails',sum(not ok for n,ok,i in R[n1:]),'| checks',len(R))
sys.exit(any(not ok for n,ok,i in R))
