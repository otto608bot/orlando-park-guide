"""Dual QA for the EPCOT with kids draft. Pass 1 = author checks (links/anchors/format); pass 2 = independent fact/policy/brand checks."""
import re,urllib.request,sys
t=open('post.md').read(); body=t.split('---',2)[2]
links=re.findall(r'\[([^\]]+)\]\(([^)]+)\)',body); R=[]
def chk(name,ok,info=''): R.append((name,bool(ok),info))
print('== PASS 1 (author: links, anchors, format)')
for a,h in links:
    u=h if h.startswith('http') else 'https://planyourpark.com'+h
    try: s=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30).status
    except Exception as e: s=getattr(e,'code',0)
    chk(f'link {h}', s==200 or ('amazon.com' in h and s in(200,503)), s)
    chk(f'anchor<=60 "{a[:30]}"', len(a)<=60)
chk('amazon links tagged', all('tag=planyourpark-20' in h for a,h in links if 'amazon' in h))
chk('no empty headings', not re.search(r'^#+\s*$',body,re.M))
chk('no empty list items', not re.search(r'^\s*[-*]\s*$|^\d+\.\s*$',body,re.M))
chk('no duplicate H2', len(set(re.findall(r'^## (.+)$',body,re.M)))==len(re.findall(r'^## (.+)$',body,re.M)))
chk('title <= 70 chars', len(re.search(r'title: "(.+)"',t).group(1))<=70)
chk('excerpt <= 200 chars', len(re.search(r'excerpt: "(.+)"',t).group(1))<=200)
n1=len(R)
print('== PASS 2 (independent: facts, policy, brand, disclosure)')
chk('disclosure before first affiliate link', 0<=body.find('affiliate disclosure') < body.find('amazon.com'))
chk('>=4 EPCOT ride-finder links', sum('/rides/for/epcot' in h for a,h in links)>=4)
chk('links park chooser /parks/', any(h=='/parks/' for a,h in links))
chk('no first-person lore', not re.search(r"\b(I|I've|I'm|my kids|our kids|our son|our daughter|when we went|we visited|we rode)\b",body))
chk('no Genie+ as current', 'Genie+' not in body)
H={'Guardians of the Galaxy: Cosmic Rewind':'42 inches','Test Track':'40 inches','Mission: SPACE (Orange)':'44 inches','Soarin\' Across America':'40 inches'}
for r,h in H.items(): chk(f'height {r}={h}', r in body and h in body)
chk('closed Soarin\' Around the World not recommended as open', not re.search(r"^- \*\*Soarin' Around",body,re.M) and 'currently unavailable' in body)
chk('Living with the Land holiday closure disclosed', 'November 27 through December 30, 2026' in body)
chk('Living with the Land not in half-day plan', 'Living with the Land' not in body.split('## A Simple Half-Day Plan')[1].split('##')[0])
chk('DuckTales refurb noted, not recommended', 'refurbishment' in body)
chk('festival dates from official page', 'November 27 to December 30, 2026' in body and 'through November 21, 2026' in body)
chk('heights dated', 'October 26, 2026' in body)
chk('heat line non-medical + First Aid pointer', 'First Aid' in body and not re.search(r'prevent(s)? heat|heat stroke|dehydration is',body,re.I))
chk('no unverified ticket ages/prices', not re.search(r'3[–-]9|\$\d',body))
chk('no invented ride mechanics (trackless/dangle)', not re.search(r'trackless|dangle|outdoor lap',body,re.I))
for i,(n,ok,inf) in enumerate(R):
    if i==n1: print('-- pass 2 --')
    print('PASS' if ok else 'FAIL',n,inf)
print('pass1 fails',sum(not ok for n,ok,i in R[:n1]),'| pass2 fails',sum(not ok for n,ok,i in R[n1:]))
sys.exit(any(not ok for n,ok,i in R))
