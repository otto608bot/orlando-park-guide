import sys; sys.path.insert(0,'scripts')
import seo_analytics_review as s
from googleapiclient.discovery import build
import datetime as dt
creds=s.get_credentials()
svc=build('searchconsole','v1',credentials=creds,cache_discovery=False)
site='sc-domain:planyourpark.com'
end=dt.date(2026,11,21)
for days in (28,90):
    start=end-dt.timedelta(days=days-1)
    r=svc.searchanalytics().query(siteUrl=site,body={'startDate':str(start),'endDate':str(end),'dimensions':['query'],'rowLimit':2000}).execute()
    rows=sorted(r.get('rows',[]),key=lambda x:-x['impressions'])
    print(f"=== {days}d {start}..{end} rows={len(rows)}")
    for x in rows[:70]:
        print(f"{x['clicks']:3} {x['impressions']:5} {x['ctr']*100:5.2f}% {x['position']:5.1f} | {x['keys'][0]}")
    import re
    print("--- seasonal/crowd/holiday matches")
    for x in rows:
        if re.search(r'christmas|holiday|december|thanksgiving|crowd|busy|new year|winter|season|festival|halloween|jollywood|very merry|grinch|candlelight|week|best time|calendar|november',x['keys'][0]):
            print(f"{x['clicks']:3} {x['impressions']:5} {x['ctr']*100:5.2f}% {x['position']:5.1f} | {x['keys'][0]}")
