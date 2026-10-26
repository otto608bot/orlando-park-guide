import json,os,urllib.request
d=json.load(open('sanity-doc.json')); assert d['_id'].startswith('drafts.')
req=urllib.request.Request('https://hd7qwtcq.api.sanity.io/v2023-01-01/data/mutate/production',data=json.dumps({"mutations":[{"createOrReplace":d}]}).encode(),headers={'Authorization':'Bearer '+os.environ['SANITY_API_TOKEN'],'Content-Type':'application/json'})
print(urllib.request.urlopen(req).read().decode()[:300])
