"""Dual QA for LEGOLAND Florida rides-by-height draft (2026-11-09). Pass 1 = author (links/anchors/format/SEO); pass 2 = independent facts/policy/brand vs official extract."""
import re,urllib.request,sys
t=open('post.md').read(); body=t.split('---',2)[2]
ext=re.sub(r'[ \xa0]+',' ',open('official-legoland-extract-2026-11-09.txt').read())
links=re.findall(r'\[([^\]]+)\]\(([^)]+)\)',body); R=[]
def chk(name,ok,info=''): R.append((name,bool(ok),info))
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
for a,h in dict.fromkeys(links):
    u=h if h.startswith('http') else 'https://planyourpark.com'+h
    try: s=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':UA}),timeout=40).status
    except Exception as e: s=getattr(e,'code',0)
    chk(f'link {h}', s==200, s); chk(f'anchor<=60 "{a[:30]}"', len(a)<=60)
chk('no empty headings', not re.search(r'^#+\s*$',body,re.M))
chk('no empty list items', not re.search(r'^\s*[-*]\s*$|^\d+\.\s*$',body,re.M))
H2=re.findall(r'^## (.+)$',body,re.M); chk('no duplicate H2', len(set(H2))==len(H2))
chk('title <= 70 chars', len(re.search(r'title: "(.+)"',t).group(1))<=70)
chk('excerpt <= 200 chars', len(re.search(r'excerpt: "(.+)"',t).group(1))<=200)
chk('primary query words in title', all(w in t.split('\n')[1].lower() for w in ['legoland florida','ride heights']))
chk('FAQ answers "how many rides"', 'How many rides are at LEGOLAND Florida?' in body)
n1=len(R)
first_aff=min(i for i in [body.find('/deals/'),body.find('anrdoezrs')] if i>=0)
chk('disclosure before first affiliate link', 0<=body.find('affiliate disclosure') < first_aff)
chk('affiliate link = config legoland', 'https://www.anrdoezrs.net/click-101693488-12540781' in body)
chk('>=4 ride-finder links', sum('/rides/for/' in h for a,h in links)>=4, sum('/rides/for/' in h for a,h in links))
chk('links /parks/ and /rides/ and park page', all(any(h==x for a,h in links) for x in ['/parks/','/rides/','/parks/legoland-florida/']))
chk('no first-person lore', not re.search(r"\b(I|I've|I'm|my kids|our kids|our son|our daughter|when we went|we visited|we rode|our trip)\b",re.sub(r'^### .*\?$','',body,flags=re.M)))
chk('no Genie+/Lightning Lane', not re.search(r'Genie\+|Lightning Lane',body))
H={'Lost Kingdom Adventure (30 inches)':'Minimum rider height is 30 inches','Coast Guard Academy (34 inches)':'Coast Guard Academy','Galacticoaster (36 inches)':'at least 36"','Beetle Bounce (36 inches)':'Minimum rider height is 36 inches',"Merlin's Challenge (36 inches)":'Minimum rider height is 36 inches','The Dragon (40 inches)':'Minimum rider height is 40 inches','Coastersaurus (42 inches)':'Minimum rider height is 42 inches','The Great LEGO Race (42 inches)':'42 inches',"Mia's Riding Adventure (48 inches)":'Minimum rider height is 48 inches','AQUAZONE Wave Racers (52 inches)':'52 inches',"Unikitty's Disco Drop (40 inches)":'under 40','THE LEGO MOVIE Masters of Flight (40 inches)':'under 40','Royal Joust (36 inches)':'36 inches','Technicycle (36 inches)':'36 inches','Safari Trek (34 inches)':'34 inches','Rescue Academy (34 inches)':'34 inches'}
for k,v in H.items(): chk(f'height in body + extract: {k}', k in body and v in ext)
chk('Kid Power Towers conflict disclosed (30 vs 38)', '**30 inches**' in body and '**38 inches**' in body and 'Minimum rider height is 38 inches' in ext)
for c in ['Pirate River Quest','Battle of Bricksburg','DUPLO Train and DUPLO Tractor:** closed November 2 to 11','Technicycle:** closed November 2 to 20','closed for the season']:
    chk(f'closure disclosed: {c[:30]}', c in body)
chk('closures match official page', all(x in ext for x in ['Battle of Bricksburg (Starting 11/2)','DUPLO® Tractor (11/2 - 11/11)','Technicycle (11/2 - 11/20)','Closed for the Season']))
chk('Bricktacular dates match', 'November 21, 22, 27, 28 and 29; December 5, 6, 12, 13 and 18 to 31; and January 1 to 3' in body and 'December- 5, 6, 12, 13, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31' in ext)
chk('drone show dates match', 'December 5, 12 and 19 to 30' in body and 'December 5, 12, 19 – 30' in ext)
chk('tree lighting Nov 20 6 PM', 'November 20 at 6:00 PM' in body and 'November 20 at 6:00 p.m.' in ext)
chk('prices dated + sourced', '$69' in body and '$129' in body and 'On November 9, 2026' in body)
chk('heights/facts dated (>=5x)', body.count('November 9, 2026')>=5, body.count('November 9, 2026'))
chk('no Disney/Universal rides recommended (no closure recheck needed)', not re.search(r"Tiana|Soarin|Seven Dwarfs|Test Track",body))
chk('no invented age-height mapping', not re.search(r'\d-year-olds\)',body))
for i,(n,ok,inf) in enumerate(R):
    if i==n1: print('-- pass 2 --')
    print('PASS' if ok else 'FAIL',n,inf)
print('pass1 fails',sum(not ok for n,ok,i in R[:n1]),'| pass2 fails',sum(not ok for n,ok,i in R[n1:]),'| checks',len(R))
sys.exit(any(not ok for n,ok,i in R))
