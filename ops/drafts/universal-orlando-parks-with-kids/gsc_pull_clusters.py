import sys,re; sys.path.insert(0,'scripts')
import seo_analytics_review as s
from googleapiclient.discovery import build
import datetime as dt
creds=s.get_credentials()
svc=build('searchconsole','v1',credentials=creds,cache_discovery=False)
site='sc-domain:planyourpark.com'
end=dt.date(2026,11,21)
for days in (28,90):
    start=end-dt.timedelta(days=days-1)
    r=svc.searchanalytics().query(siteUrl=site,body={'startDate':str(start),'endDate':str(end),'dimensions':['query'],'rowLimit':5000}).execute()
    rows=sorted(r.get('rows',[]),key=lambda x:-x['impressions'])
    for name,pat in [('hollywood',r'hollywood|toy story|star wars|galaxy|slinky'),('universal studios/ioa',r'islands|universal studios(?! orlando parks)|usf|ioa|volcano|minion|velocicoaster|hagrid|jurassic'),('seaworld',r'sea ?world|aquatica|sesame'),('how many',r'how many|how may'),('epic',r'epic')]:
        sel=[x for x in rows if re.search(pat,x['keys'][0])]
        ti=sum(x['impressions'] for x in sel); tc=sum(x['clicks'] for x in sel)
        print(f"=== {days}d {start}..{end} [{name}] queries={len(sel)} impr={ti} clicks={tc}")
        for x in sel[:25]:
            print(f"  {x['clicks']:3} {x['impressions']:5} {x['ctr']*100:5.2f}% {x['position']:5.1f} | {x['keys'][0]}")
