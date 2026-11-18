"""Revert: deletes ONLY the drafts.* created by the apply scripts (published docs untouched) and RE-CREATES the discarded
Walt Disney World Railroad draft from railroad-draft-BACKUP.json. Usage: python3 revert.py [--go]"""
import json, os, sys, urllib.request
FILES = ("apply-result.json", "apply-result-skytower.json", "apply-result-hs-cleanup.json")
ids = sorted({r["id"] for f in FILES if os.path.exists(f) for r in json.load(open(f))["results"] if r.get("operation") != "delete"})
bk = json.load(open("railroad-draft-BACKUP.json"))
bk = {k: v for k, v in bk.items() if k not in ("_rev", "_updatedAt", "_createdAt")}
assert bk["_id"] == "drafts.r5PBb5Nahg2bY9oktfqOej" and all(i.startswith("drafts.") for i in ids)
print("delete:", *ids, sep="\n  "); print("re-create:", bk["_id"])
if "--go" in sys.argv:
    muts = [{"delete": {"id": i}} for i in ids] + [{"createOrReplace": bk}]
    req = urllib.request.Request("https://hd7qwtcq.api.sanity.io/v2023-10-01/data/mutate/production",
        data=json.dumps({"mutations": muts}).encode(),
        headers={"Authorization": "Bearer "+os.environ["SANITY_API_TOKEN"], "Content-Type": "application/json"})
    print(urllib.request.urlopen(req).read()[:200])
