import json, os, urllib.request
P="https://hd7qwtcq.api.sanity.io/v2023-10-01/"
def get(i):
    req=urllib.request.Request(P+"data/doc/production/"+i,headers={"Authorization":"Bearer "+os.environ["SANITY_API_TOKEN"]})
    d=json.load(urllib.request.urlopen(req))["documents"]; return d[0] if d else None
res=json.load(open("apply-result.json"))["results"]; ids=sorted({r["id"] for r in res})
before={}
for m in json.load(open("manifest.json")): before.setdefault(m["draftId"],[]).append(m)
ok=True
for i in ids:
    d=get(i); pubid=i[len("drafts."):]; pub=get(pubid)
    print(i,"| draft exists:",bool(d),"| published exists:",bool(pub),"| pub _rev:",pub and pub["_rev"],"| pub _updatedAt:",pub and pub["_updatedAt"])
    for m in before.get(i,[]):
        if m["field"].startswith("NEW"): v=d.get("heightRequirement")
        elif m["field"].startswith("body"): continue
        else: v=d.get(m["field"])
        flag="OK" if v==m["after"] else "MISMATCH"; ok&=(v==m["after"])
        print("   ",m["field"],"draft =",v,"expected",m["after"],flag)
    if pub and d and pub.get("_updatedAt")>="2026-11-16": print("   !! published updated today"); ok=False
print("ALL OK" if ok else "PROBLEM")
