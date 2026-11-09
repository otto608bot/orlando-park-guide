"""Write the draft to Sanity as drafts.* ONLY (never publish). No heroImage: no image generator was available on 2026-11-09."""
import json,os,urllib.request
d=json.load(open('sanity-doc.json'))
assert d['_id'].startswith('drafts.') and 'publishedAt' not in d
req=urllib.request.Request('https://hd7qwtcq.api.sanity.io/v2023-10-01/data/mutate/production?returnIds=true',data=json.dumps({"mutations":[{"createOrReplace":d}]}).encode(),headers={'Authorization':'Bearer '+os.environ['SANITY_API_TOKEN'],'Content-Type':'application/json'})
print(urllib.request.urlopen(req).read().decode()[:300])
