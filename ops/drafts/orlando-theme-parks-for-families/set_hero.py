"""Upload hero to Sanity and set heroImage on drafts.blogPost-orlando-theme-parks-for-families ONLY (patch; never publish)."""
import json,os,urllib.request
T=os.environ['SANITY_API_TOKEN']; API='https://hd7qwtcq.api.sanity.io/v2023-10-01'
DOC='drafts.blogPost-orlando-theme-parks-for-families'
ALT='A family of four, the youngest on dad\'s shoulders, looks out at sunset over a lagoon toward a fairytale castle, a silver geodesic sphere and a looping roller coaster, framed by palm trees and pink and purple flowers.'
assert DOC.startswith('drafts.')
r=urllib.request.Request(API+'/assets/images/production?filename=orlando-theme-parks-for-families-hero-1376x768.jpg',data=open('hero-1376x768.jpg','rb').read(),headers={'Authorization':'Bearer '+T,'Content-Type':'image/jpeg'})
a=json.loads(urllib.request.urlopen(r).read())['document']; print('asset',a['_id'],a.get('url'))
m={"mutations":[{"patch":{"id":DOC,"ifRevisionID":None,"set":{"heroImage":{"_type":"image","alt":ALT,"asset":{"_type":"reference","_ref":a['_id']}}}}}]}
del m['mutations'][0]['patch']['ifRevisionID']
r=urllib.request.Request(API+'/data/mutate/production?returnIds=true&returnDocuments=false',data=json.dumps(m).encode(),headers={'Authorization':'Bearer '+T,'Content-Type':'application/json'})
print(urllib.request.urlopen(r).read().decode()[:300])
