"""Dual QA for the Magic Kingdom draft. Pass 1 = author checks; pass 2 = independent fact/policy/brand checks."""
import re,urllib.request,sys
t=open('post.md').read(); body=t.split('---',2)[2]
links=re.findall(r'\[([^\]]+)\]\(([^)]+)\)',body); R=[]
def chk(name,ok,info=''): R.append((name,bool(ok),info));
# PASS 1
for a,h in links:
    u=h if h.startswith('http') else 'https://planyourpark.com'+h
    try: s=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30).status
    except Exception as e: s=getattr(e,'code',0)
    chk(f'link {h}', s==200 or ('amazon.com' in h and s in(200,503)), s)
    chk(f'anchor<=60 "{a[:30]}"', len(a)<=60 and not('amazon' in h and len(a)>40))
chk('amazon links tagged', all('tag=planyourpark-20' in h for a,h in links if 'amazon' in h))
chk('no empty headings', not re.search(r'^#+\s*$',body,re.M))
chk('no empty list items', not re.search(r'^\s*[-*]\s*$|^\d+\.\s*$',body,re.M))
# PASS 2
chk('disclosure before first affiliate link', body.find('affiliate disclosure') < body.find('amazon.com'))
chk('links ride finder MK', sum('/rides/for/magic-kingdom' in h for a,h in links)>=4)
chk('links park chooser', any(h=='/parks/' for a,h in links))
chk('links MK park page', any(h=='/parks/magic-kingdom/' for a,h in links))
chk('links under-40 complementary post', any('best-magic-kingdom-rides-kids-under-40' in h for a,h in links))
chk('links disney vs universal', any('disney-vs-universal-with-kids' in h for a,h in links))
chk('links deals', any(h=='/deals/' for a,h in links))
chk('no first-person lore', not re.search(r"\b(I|I've|my kids|our kids|our son|our daughter|when we went|we visited)\b",body))
chk('no Genie+ as current', 'Genie+' not in body)
H={'Seven Dwarfs Mine Train':38,'Big Thunder Mountain Railroad':38,"Tiana's Bayou Adventure":40,'Space Mountain':44,'TRON Lightcycle / Run':48,'The Barnstormer':35,'Tomorrowland Speedway':32}
for r,h in H.items(): chk(f'height {r}={h}', re.search(rf'{h} inches',body) and r.replace("'","'") in body or (r.split()[0] in body and re.search(rf'{h} inches',body)))
# tighter per-ride
for r,h in H.items():
    ok = (r in body or r.replace('\u2019',"'") in body) and str(h) in body
    # Speedway special: 32 and 54
    if r=='Tomorrowland Speedway': ok = 'Tomorrowland Speedway' in body and '32 inches' in body and '54 inches' in body
    chk(f'named height {r}', ok)
chk('Big Thunder listed as 38 not 40 for min', 'Big Thunder' in body and '38 inches (97 cm)' in body)
chk('Tiana refurb flagged', 'November 2' in body and 'December 2026' in body)
chk('heights dated Oct 19', 'October 19, 2026' in body or 'Oct 19, 2026' in body)
chk('no unverified ticket ages', '3–9' not in body and '3-9' not in body)
chk('heat line non-medical + First Aid pointer', 'First Aid' in body and not re.search(r'prevent(s)? heat|heat stroke|dehydration is',body,re.I))
chk('word count band', 900 <= len(re.sub(r'\[([^\]]+)\]\([^)]+\)',r'\1',body).split()) <= 1450)
for n,ok,i in R: print('PASS' if ok else 'FAIL',n,i)
print('fails',sum(not ok for n,ok,i in R)); sys.exit(1 if any(not ok for n,ok,i in R) else 0)
