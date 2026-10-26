"""POST mutations.json to Sanity (drafts.* only). Refuses any non-draft id."""
import json,os,urllib.request
m=json.load(open('mutations.json'))
assert all(x['createOrReplace']['_id'].startswith('drafts.') for x in m['mutations'])
r=urllib.request.Request("https://hd7qwtcq.api.sanity.io/v2023-01-01/data/mutate/production",data=json.dumps(m).encode(),headers={"Authorization":"Bearer "+os.environ['SANITY_API_TOKEN'],"Content-Type":"application/json"})
print(urllib.request.urlopen(r).read()[:300])
