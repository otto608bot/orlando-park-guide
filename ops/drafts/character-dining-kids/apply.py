import json,os,urllib.request
d=json.load(open('sanity-doc.json')); d['heroImage']={'_type':'image','alt':'Text graphic: Disney World character dining for kids. Breakfast mostly 35 to 59.99 dollars per adult, lunch and dinner mostly over 60 dollars per adult, book 60 days out at 6 AM Eastern.','asset':{'_type':'reference','_ref':'image-a437a27f14ca8c05911fc9d288f0b94c1c0eb1da-1376x768-png'}}
assert d['_id'].startswith('drafts.')
req=urllib.request.Request('https://hd7qwtcq.api.sanity.io/v2023-01-01/data/mutate/production',data=json.dumps({"mutations":[{"createOrReplace":d}]}).encode(),headers={'Authorization':'Bearer '+os.environ['SANITY_API_TOKEN'],'Content-Type':'application/json'})
print(urllib.request.urlopen(req).read().decode()[:300])
