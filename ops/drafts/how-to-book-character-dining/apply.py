import json,os,urllib.request
d=json.load(open('sanity-doc.json')); d['heroImage']={'_type':'image','alt':'A laughing girl high-fives a friendly lavender mouse character with round glasses and a yellow bow tie at a sunny breakfast table, while a curly-haired boy laughs beside them.','asset':{'_type':'reference','_ref':'image-46eee22ac5b2219e2956cd40848104f19aae0550-1376x768-jpg'}}
assert d['_id'].startswith('drafts.')
req=urllib.request.Request('https://hd7qwtcq.api.sanity.io/v2023-10-01/data/mutate/production?returnIds=true',data=json.dumps({"mutations":[{"createOrReplace":d}]}).encode(),headers={'Authorization':'Bearer '+os.environ['SANITY_API_TOKEN'],'Content-Type':'application/json'})
print(urllib.request.urlopen(req).read().decode()[:300])
