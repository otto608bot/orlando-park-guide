"""Upload hero to Sanity and set heroImage on drafts.blogPost-universal-orlando-parks-with-kids ONLY (patch; never publish).
Usage (from this dir, after the image exists): python3 set_hero.py "<alt text matching the image>" """
import json,os,sys,urllib.request
T=os.environ['SANITY_API_TOKEN']; API='https://hd7qwtcq.api.sanity.io/v2023-10-01'
DOC='drafts.blogPost-universal-orlando-parks-with-kids'
IMG='../../buffer/universal-orlando-parks-with-kids-2026-11/images/hero-1376x768.jpg'
ALT=sys.argv[1]
assert DOC.startswith('drafts.') and len(ALT)>20
r=urllib.request.Request(API+'/assets/images/production?filename=universal-orlando-parks-with-kids-hero-1376x768.jpg',data=open(IMG,'rb').read(),headers={'Authorization':'Bearer '+T,'Content-Type':'image/jpeg'})
a=json.loads(urllib.request.urlopen(r).read())['document']; print('asset',a['_id'],a.get('url'))
m={"mutations":[{"patch":{"id":DOC,"set":{"heroImage":{"_type":"image","alt":ALT,"asset":{"_type":"reference","_ref":a['_id']}}}}}]}
r=urllib.request.Request(API+'/data/mutate/production?returnIds=true&returnDocuments=false',data=json.dumps(m).encode(),headers={'Authorization':'Bearer '+T,'Content-Type':'application/json'})
print(urllib.request.urlopen(r).read().decode()[:300])
