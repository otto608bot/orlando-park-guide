import sys,re; sys.path.insert(0,'scripts')
import seo_analytics_review as s
from googleapiclient.discovery import build
import datetime as dt
creds=s.get_credentials()
svc=build('searchconsole','v1',credentials=creds,cache_discovery=False)
site='sc-domain:planyourpark.com'
end=dt.date(2026,11,21)
pat=r'(universal).*(parks?|parques)\b|(parks?|parques).*(universal)|universal orlando with kids|universal.*(kids|toddler|5 year|young)|(kids|toddler).*universal'
for days in (28,90):
    start=end-dt.timedelta(days=days-1)
    r=svc.searchanalytics().query(siteUrl=site,body={'startDate':str(start),'endDate':str(end),'dimensions':['query'],'rowLimit':5000}).execute()
    rows=sorted([x for x in r.get('rows',[]) if re.search(pat,x['keys'][0]) and 'epic' not in x['keys'][0]],key=lambda x:-x['impressions'])
    ti=sum(x['impressions'] for x in rows); tc=sum(x['clicks'] for x in rows)
    wp=sum(x['impressions']*x['position'] for x in rows)/max(ti,1)
    print(f"=== {days}d {start}..{end} universal-parks cluster queries={len(rows)} impr={ti} clicks={tc} CTR={tc/max(ti,1)*100:.2f}% impr-weighted pos={wp:.1f}")
    for x in rows: print(f"  {x['clicks']:3} {x['impressions']:5} {x['ctr']*100:5.2f}% {x['position']:5.1f} | {x['keys'][0]}")
    r=svc.searchanalytics().query(siteUrl=site,body={'startDate':str(start),'endDate':str(end),'dimensions':['query','page'],'rowLimit':5000}).execute()
    pages={}
    for x in r.get('rows',[]):
        q,p=x['keys']
        if re.search(pat,q) and 'epic' not in q: pages[p]=pages.get(p,0)+x['impressions']
    print("  pages:",sorted(pages.items(),key=lambda t:-t[1])[:8])
