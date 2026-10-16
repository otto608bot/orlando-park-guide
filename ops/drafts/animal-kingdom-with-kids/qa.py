"""Dual QA for the Animal Kingdom draft. Pass 1 = author checks (links/anchors/format); pass 2 = independent fact/policy/brand checks."""
import re,urllib.request,json,sys
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
chk('links ride finder AK', sum('/rides/for/animal-kingdom' in h for a,h in links)>=4)
chk('links park chooser', any(h=='/parks/' for a,h in links))
chk('no first-person lore', not re.search(r"\b(I|I've|my kids|our kids|our son|our daughter|when we went|we visited)\b",body))
chk('no Genie+ as current', 'Genie+' not in body)
H={'Avatar Flight of Passage':44,'Expedition Everest':44,'Kali River Rapids':38}
for r,h in H.items(): chk(f'height {r}={h}', re.search(rf'{h} inches',body) and r in body)
chk('closed rides not listed as open', not re.search(r'^- \*\*(DINOSAUR|TriceraTop|It.s Tough)',body,re.M))
chk('heights dated', 'October 16, 2026' in body)
chk('heat line non-medical + First Aid pointer', 'First Aid' in body and not re.search(r'prevent(s)? heat|heat stroke|dehydration is',body,re.I))
for n,ok,i in R: print('PASS' if ok else 'FAIL',n,i)
print('fails',sum(not ok for n,ok,i in R)); sys.exit(any(not ok for n,ok,i in R))
