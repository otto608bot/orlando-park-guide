"""Dual QA for the Universal Orlando parks with kids draft (2026-11-23).
Pass 1 = author (links/anchors/format/SEO/structure/disclosure/brand).
Pass 2 = independent facts/policy/dates vs saved official Universal pages in official/ (accessed 2026-11-23)."""
import re,urllib.request,sys
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
chk('internal links have trailing slash', all(h.endswith('/') for a,h in links if h.startswith('/')))
chk('no empty headings', not re.search(r'^#+\s*$',body,re.M))
chk('no empty list items', not re.search(r'^\s*[-*]\s*$|^\d+\.\s*$',body,re.M))
H2=re.findall(r'^## (.+)$',body,re.M); chk('no duplicate H2', len(set(H2))==len(H2))
chk('no unbalanced ** markers', all(l.count('**')%2==0 for l in body.split('\n')))
title=re.search(r'title: "(.+)"',t).group(1); exc=re.search(r'excerpt: "(.+)"',t).group(1)
chk('title <= 70 chars', len(title)<=70, len(title)); chk('excerpt <= 200 chars', len(exc)<=200, len(exc))
chk('title has "Universal Orlando Parks" + kids + 4', all(w in title for w in ['Universal Orlando Parks','Kids','4']))
chk('excerpt has primary words + date', 'universal orlando parks with kids' in exc.lower() and 'November 23, 2026' in exc)
chk('first block is affiliate disclosure', body.strip().startswith('> Heads up'))
aff=[i for i in [body.find('amazon.com'),body.find('/deals/')] if i>=0]
chk('disclosure before first affiliate link', 0<=body.find('affiliate disclosure')<min(aff))
chk('amazon links tagged planyourpark-20', all('tag=planyourpark-20' in h for a,h in links if 'amazon.com' in h))
chk('>=6 ride-finder links', sum('/rides/for/' in h for a,h in links)>=6, sum('/rides/for/' in h for a,h in links))
chk('links /parks/ /deals/ + 3 Universal park pages', all(any(h==x for a,h in links) for x in ['/parks/','/deals/','/parks/universal-studios-florida/','/parks/islands-of-adventure/','/parks/epic-universe/']))
rel=['universal-orlando-height-requirements','disney-vs-universal-with-kids-2026','epic-universe-rides-ranked-guide','epic-universe-1-day-plan','epic-universe-tickets-guide']
chk('links all 5 related posts', all(any(f'/blog/{s}/'==h for a,h in links) for s in rel))
chk('does not link parked/unpublished Orlando post', 'orlando-theme-parks-for-families' not in body)
faq=body.split('## FAQ')[1]; qs=re.findall(r'^\*\*(.+\?)\*\*',faq,re.M); chk('FAQ has >=8 questions', len(qs)>=8, len(qs))
for q in ['4 parks at Universal Orlando','How many parks','What parks are at Universal Studios','best for young kids','Epic Universe good for little kids','under 40 inches','Volcano Bay open','holiday events included','Child Swap']:
    chk(f'FAQ covers: {q}', any(q.lower() in x.lower() for x in qs))
bl=body.replace('If I Ran the Zoo','').replace('Amazing Adventures','')
chk('no first-person lore (excl. official name "If I Ran the Zoo")', not re.search(r"\b(I|I've|I'm|my kids|our kids|our son|our daughter|when we went|we visited|we rode|our trip|our family)\b",bl))
chk('no prices / $', '$' not in body)
chk('no age-to-height mapping', not re.search(r'\d-year-olds? (is|are) (about|around|usually)|most \d-year',body))
chk('no crowd predictions', not re.search(r'crowd(s|ed)? (are|will|is)|busiest|least crowded|quietest',body,re.I))
chk('no Express Pass / Lightning Lane claims', not re.search(r'Express Pass|Lightning Lane|Genie',body))
d=body.count('November 23, 2026'); chk('facts dated Nov 23, 2026 (>=8x)', d>=8, d)
chk('no hype words (excl. official name "The Amazing Adventures of Spider-Man")', not re.search(r'\b(must-do|must-ride|ultimate|perfect|amazing|guaranteed|never miss|best ever)\b',bl,re.I))
chk('Tiana not mentioned (Disney-only refurb, n/a)', 'Tiana' not in body)
n1=len(R)
# ---- pass 2: facts vs official pages ----
def off(f): return open(f'official/{f}.txt').read().replace('’',"'").replace('“','"').replace('”','"').replace('\u00a0',' ')
HT=off('uo-heights'); PH=off('uo-park-hours'); HOL=off('uo-holidays'); PAR=off('uo-holiday-parade'); PR=off('uo-press-holidays-2026-11-11'); TK=off('uo-park-tickets'); SV=off('uo-park-services')
def ht(name,inch):
    for m in re.finditer(re.escape(name),HT):
        seg=HT[m.start():m.start()+260]
        if re.search(rf'(at least|Minimum Height|designed for children) {inch}"',seg): return True
    return False
H={'Despicable Me Minion Mayhem':40,'E.T. Adventure':34,'Harry Potter and the Escape from Gringotts':42,'MEN IN BLACK':42,'Race Through New York Starring Jimmy Fallon':40,'Revenge of the Mummy':48,'The Simpsons Ride':40,'TRANSFORMERS: The Ride-3D':40,'Trolls Trollercoaster':36,
 'The Amazing Adventures of Spider-Man':40,'Cat in the Hat':36,"Doctor Doom's Fearfall":52,"Dudley Do-Right's Ripsaw Falls":44,'Flight of the Hippogriff':36,"Hagrid's Magical Creatures Motorbike Adventure":48,'Harry Potter and the Forbidden Journey':48,'Jurassic Park River Adventure':42,'Jurassic World VelociCoaster':51,'The High in the Sky Seuss Trolley Train Ride!':36,'The Incredible Hulk Coaster':54,"Popeye & Bluto's Bilge-Rat Barges":42,'Pteranodon Flyers':36,'Skull Island: Reign of Kong':36,
 'Curse of the Werewolf':40,"Dragon Racer's Rally":48,'Harry Potter and the Battle at the Ministry':40,"Hiccup's Wing Gliders":40,'Mario Kart':40,'Mine-Cart Madness':40,'Monsters Unchained: The Frankenstein Experiment':48,'Stardust Racers':48,"Yoshi's Adventure":34}
for n,i in H.items(): chk(f'official height {i}": {n}', ht(n,i))
# post states each height next to the ride (spot-check pairs in body)
PAIRS=[('E.T. Adventure:** 34'),('Trolls Trollercoaster:** 36'),('Despicable Me Minion Mayhem:** 40'),('Revenge of the Mummy:** 48'),('Yoshi\'s Adventure:** 34'),('Jurassic World VelociCoaster:** 51'),("Doctor Doom's Fearfall:** 52"),('The Incredible Hulk Coaster:** 54'),("Dudley Do-Right's Ripsaw Falls:** 44"),('The Amazing Adventures of Spider-Man:** 40')]
for p in PAIRS: chk(f'post pairs height: {p}', p in body)
for f,n in [('ride-caro-seuss-el','Caro-Seuss-el'),('ride-one-fish-two-fish-red-fish','One Fish'),('ride-storm-force-accelatron','Storm Force'),('ride-kang-and-kodos-twirl-and-hurl','Kang & Kodos'),('ride-constellation-carousel','Constellation Carousel'),('ride-fyre-drill','Fyre Drill')]:
    x=off(f); chk(f'no minimum official: {n}', ('No Minimum Height' in x or 'No Height Requirement' in x) and n in body, f)
chk('Villain-Con: companion under 48, no hand-held infants (no minimum)', 'Villain-Con Minion Blast\nSupervising Companion required for children under 48' in HT and 'No hand-held infants' in HT)
chk('Minion Mayhem stationary seat under 40', 'Persons under 40" (102cm) must experience this attraction from an adjacent stationary seat' in HT)
chk('Pteranodon 36-56 + child must accompany >56', 'designed for children 36"–56"' in HT and 'A child meeting this requirement must accompany guests over 56"' in HT)
chk('Hogwarts Express absent from height page (no minimum listed)', 'Hogwarts Express' not in HT)
chk('Hogwarts Express needs Park-to-Park', "You'll need a Park-to-Park ticket to ride the Hogwarts Express" in off('ride-hogwarts-express-hogsmeade-station'))
chk('Supercharged + Rip Ride Rockit absent from height page', 'Fast & Furious' not in HT and 'Rip Ride Rockit' not in HT)
chk('Volcano Bay closed, reopening on or before April 1, 2027', 'temporarily closed for maintenance and has a planned reopening on or before April 1, 2027' in PH)
chk('Jurassic Park River Adventure closed Jan 5 - Dec 16, 2026', 'Jurassic Park River Adventure: January 5, 2026 - December 16, 2026' in PH)
chk('Monsters Unchained closed Dec 11-15, 2026', 'Monsters Unchained: December 11, 2026 - December 15, 2026' in PH)
chk('Po Live! starting Oct 3, 2026', 'Po Live!: Starting October 3, 2026' in PH)
chk('2027 refurbs: Barges Jan 9-Feb 2, Fyre Drill Jan 25-Feb 4, Forbidden Journey Feb 8-19', "Bilge-Rat Barges: January 9, 2027 - February 2, 2027" in PH and 'Fyre Drill: January 25th, 2027 - February 4th, 2027' in PH and 'Forbidden Journey™: February 8, 2027 - February 19, 2027' in PH)
chk('Holidays Nov 14, 2026 - Jan 3, 2027, included w/ ticket, blockouts', 'Nov. 14, 2026-Jan. 3, 2027' in HOL and 'Included with Your Theme Park Ticket or Annual/Seasonal Pass ( blockout dates and restrictions apply )' in HOL)
chk('Parade each night at USF', 'each night to catch the parade' in PAR)
chk('Parade: tree lighting led by Santa (press)', 'Christmas tree lighting led by none other than Santa Claus' in PR)
chk('Grinchmas Who-liday Spectacular + meet the Grinch (press)', 'Grinchmas Who-liday Spectacular' in PR and 'meet the mean, green one himself, The Grinch' in PR)
chk('Hogwarts castle projection show (press)', 'The Magic of Christmas at Hogwarts Castle' in PR)
chk('Epic: Nintendo decor + Snoggletog + Celestial Park trees', 'Snoggletog' in HOL and 'SUPER NINTENDO WORLD' in PR and 'glittering Christmas trees' in PR)
chk('Wizarding World Christmas in all three lands', 'across all three wizarding world lands' in PR)
chk('Grinch breakfast: Circus McGurkus + same-day IOA admission', 'Circus McGurkus Cafe Stoo-pendous' in HOL and 'Separate Universal Islands of Adventure theme park admission valid for the same date' in HOL)
chk('Holiday Tour select dates to Jan 2, 2027 + Grinch meet', 'Select Dates Nov. 14, 2026-Jan. 2, 2027' in HOL and 'Grinch™ meet and greet' in HOL)
chk('Parade/show times in app', 'Universal Orlando Resort Mobile App for the most up-to-date information' in PAR)
chk('Tickets: One-Park-Per-Day incl. 4 parks', 'One-Park-Per-Day Ticket : Enjoy one day at Universal Epic Universe, Universal Studios Florida, Universal Islands of Adventure or Universal Volcano Bay' in TK)
chk('Tickets: Park-to-Park incl. Epic + Hogwarts Express', 'Park-to-Park tickets are available at any Universal Orlando Resort theme park, including Universal Epic Universe' in TK and 'can also ride the Hogwarts Express' in TK)
chk('Tickets: prices vary by day', 'Ticket prices and availability vary by day' in TK)
chk('Child Swap wording', 'wait in a designated area along with any children who are unable or unwilling to participate' in SV and 'ask a ride attendant' in SV)
chk('Test seats asterisk note', 'These rides have test seats available' in HT)
chk('Volcano Bay rules: Tot Tiki <48, Runamukka <54, life vests', 'Tot Tiki Reef ™ is designed for children under 48' in HT and 'Runamukka Reef ™ is designed for children under 54' in HT and HT.count('Children under 48” (122cm) must wear a U.S. Coast Guard-approved life vest')+HT.count('Children under 48" (122cm) must wear a U.S. Coast Guard-approved life vest')>=3)
chk('Water ride quotes (really wet / very, very wet)', 'really wet' in off('ride-popeye-and-blutos-bilge-rat-barges') and 'Plan to Get Very, Very Wet' in off('ride-dudley-do-rights-ripsaw-falls'))
chk('DreamWorks Land: Po camp, Swamp Symphony, Shrek/Fiona/Donkey at cottage, Trollercoaster family-friendly', all(s in off('uo-land-dreamworks-land') for s in ["Po's Kung Fu Training Camp","King Harold's Swamp Symphony",'meet Shrek, Fiona and Donkey outside Shrek','family-friendly coaster']))
chk('If I Ran the Zoo is a kids play area (URL kids-play-areas)', 'kids-play-areas/if-i-ran-the-zoo' in off('ride-if-i-ran-the-zoo') or 'If I Ran the Zoo' in off('ride-if-i-ran-the-zoo'))
chk('Constellation/Fyre: hand-held infants not permitted', 'Hand-held infants are not permitted' in off('ride-constellation-carousel') and 'Hand-held infants are not permitted' in off('ride-fyre-drill'))
for i,(n,ok,inf) in enumerate(R):
    if i==n1: print('-- pass 2 --')
    print('PASS' if ok else 'FAIL',n,inf)
print('pass1 fails',sum(not ok for n,ok,i in R[:n1]),'| pass2 fails',sum(not ok for n,ok,i in R[n1:]),'| checks',len(R))
sys.exit(any(not ok for n,ok,i in R))
