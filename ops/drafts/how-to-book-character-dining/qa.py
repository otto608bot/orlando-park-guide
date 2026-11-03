"""Dual QA for the How to Book Disney Character Dining draft (2026-11-02). Pass 1 = author checks (links/anchors/format); pass 2 = independent fact/policy/brand checks."""
import re,urllib.request,sys
t=open('post.md').read(); body=t.split('---',2)[2]
links=re.findall(r'\[([^\]]+)\]\(([^)]+)\)',body); R=[]
def chk(name,ok,info=''): R.append((name,bool(ok),info))
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
print('== PASS 1 (author: links, anchors, format)')
for a,h in dict.fromkeys(links):
    u=h if h.startswith('http') else 'https://planyourpark.com'+h
    try: s=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':UA,'Accept-Language':'en-US'}),timeout=40).status
    except Exception as e: s=getattr(e,'code',0)
    chk(f'link {h}', s==200, s)
    chk(f'anchor<=60 "{a[:30]}"', len(a)<=60)
chk('amazon links tagged', all('tag=planyourpark-20' in h for a,h in links if 'amazon' in h))
chk('no empty headings', not re.search(r'^#+\s*$',body,re.M))
chk('no empty list items', not re.search(r'^\s*[-*]\s*$|^\d+\.\s*$',body,re.M))
chk('no duplicate H2', len(set(re.findall(r'^## (.+)$',body,re.M)))==len(re.findall(r'^## (.+)$',body,re.M)))
chk('title <= 70 chars', len(re.search(r'title: "(.+)"',t).group(1))<=70)
chk('excerpt <= 200 chars', len(re.search(r'excerpt: "(.+)"',t).group(1))<=200)
chk('links Post 1 + hub', '/blog/best-disney-world-character-dining-kids/' in body and '/character-dining/' in body)
n1=len(R)
print('== PASS 2 (independent: facts, policy, brand, disclosure)')
first_aff=min(i for i in [body.find('/deals/'),body.find('amazon.com')] if i>=0)
chk('disclosure before first affiliate link', 0<=body.find('affiliate disclosure') < first_aff)
chk('>=4 ride-finder links', sum('/rides/for/' in h for a,h in links)>=4)
chk('links park chooser /parks/ and /rides/', any(h=='/parks/' for a,h in links) and any(h=='/rides/' for a,h in links))
chk('no first-person lore (reader-voice FAQ questions excluded)', not re.search(r"\b(I|I've|I'm|my kids|our kids|our son|our daughter|when we went|we visited|we rode|we booked)\b",re.sub(r'^### .*\?$','',body,flags=re.M)))
chk('no Genie+/Lightning Lane claims', not re.search(r'Genie\+|Lightning Lane',body))
chk('60 days + 6:00 AM (official FAQ)', '60 days' in body and '6:00 AM' in body)
chk('resort window = up to a 10-night stay, no "10 days"', '10-night stay' in body and '10 days' not in body)
chk('fee $10 per person within 2 hours (official FAQ)', '$10 per person' in body and '2 hours' in body)
chk('CRT: full cost, no modifications', 'full cost' in body and "can't be modified" in body)
chk('no unverified prepayment claim', not re.search(r'prepa|pay in full|paid in full',body,re.I))
H={'Seven Dwarfs Mine Train':'**38 inches**',"Tiana's Bayou Adventure":'**40 inches**','Star Tours':'**40 inches**'}
for r,h in H.items(): chk(f'height {r}={h}', re.search(re.escape(r)+r'[^.]{0,40}'+re.escape(h),body))
chk("Tiana's refurb disclosed", 'closed for refurbishment from November 2, with reopening expected in December 2026' in body)
chk('heights/facts dated', body.count('November 2, 2026')>=3)
chk('meal times match official extract', all(x in body for x in ['breakfast 8:00 to 10:15 AM','breakfast 7:30 to 10:30 AM','breakfast 7:30 AM to 12:30 PM','dinner 4:00 to 9:15 PM','breakfast 8:00 AM to 12:00 PM, dinner 4:00 to 9:00 PM']))
chk('no specific dollar menu prices (tiers/fees only)', not re.search(r'\$\d+(?!\s*per person)',body.replace('$10 per person','')))
chk('ʻOhana/Topolino/Cape May dinner not called character', 'Dinner is not a character meal' in body and body.count('No characters at dinner')==2)
for i,(n,ok,inf) in enumerate(R):
    if i==n1: print('-- pass 2 --')
    print('PASS' if ok else 'FAIL',n,inf)
print('pass1 fails',sum(not ok for n,ok,i in R[:n1]),'| pass2 fails',sum(not ok for n,ok,i in R[n1:]))
sys.exit(any(not ok for n,ok,i in R))
