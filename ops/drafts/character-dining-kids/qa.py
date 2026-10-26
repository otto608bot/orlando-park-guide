"""QA for character dining post. Disney pages block scripted HEAD/GET from this box; they were fetched 2026-10-26 (see hub snapshot), so they're checked for path shape only."""
import re,urllib.request,sys
t=open('post.md').read(); body=t.split('---',2)[2]; links=re.findall(r'\[([^\]]+)\]\(([^)]+)\)',body); R=[]
def chk(n,ok,i=''): R.append((n,bool(ok),i))
for a,h in links:
    chk(f'anchor<=60 {a[:30]}',len(a)<=60)
    if 'disneyworld.disney.go.com' in h: chk(f'disney path {h}',re.match(r'https://disneyworld\.disney\.go\.com/dining/[a-z-]+/[a-z0-9-]+/$',h)); continue
    u=h if h.startswith('http') else 'https://planyourpark.com'+h
    try: s=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30).status
    except Exception as e: s=getattr(e,'code',0)
    chk(f'link {h}',s==200,s)
chk('disclosure first',body.strip().startswith('> Heads up'))
chk('ride finder',any('/rides/for/' in h for a,h in links)); chk('park chooser',any(h=='/parks/' for a,h in links)); chk('hub',any(h=='/character-dining/' for a,h in links))
chk('no first-person lore',not re.search(r'(?<!y)\bour (kids|son|daughter|family)|\bmy (kids|son|daughter)|\bI (took|went|have)',body))
chk('dated',body.count('2026')>=3); w=len(body.split()); chk('words>=1000',w>=1000,w)
bad=[r for r in R if not r[1]]
for r in bad: print('FAIL',r)
print(len(R)-len(bad),'/',len(R),'pass'); sys.exit(1 if bad else 0)
