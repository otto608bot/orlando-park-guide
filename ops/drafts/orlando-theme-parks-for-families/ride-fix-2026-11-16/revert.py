"""Revert: deletes ONLY the drafts.* documents created by apply.py (published docs untouched). Usage: python3 revert.py [--go]"""
import json, os, sys, urllib.request
ids = sorted({r["id"] for r in json.load(open("apply-result.json"))["results"]})
assert all(i.startswith("drafts.") for i in ids)
print("\n".join(ids))
if "--go" in sys.argv:
    req = urllib.request.Request("https://hd7qwtcq.api.sanity.io/v2023-10-01/data/mutate/production",
        data=json.dumps({"mutations":[{"delete":{"id":i}} for i in ids]}).encode(),
        headers={"Authorization":"Bearer "+os.environ["SANITY_API_TOKEN"],"Content-Type":"application/json"})
    print(urllib.request.urlopen(req).read()[:200])
