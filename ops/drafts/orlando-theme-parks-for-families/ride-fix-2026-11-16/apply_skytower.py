"""Addendum 2026-11-16 (CEO/Bennett, closure only): Sky Tower draft. Drafts only, never publishes.
heightRequirement is deliberately LEFT at 0: SeaWorld's rides listing tags Sky Tower 48" Min. Height, but its own ride page says "HEIGHT REQUIREMENT: No Limit".
Usage: python3 apply_skytower.py [--apply]. Appends to manifest.json, writes apply-result-skytower.json."""
import json, os, sys, urllib.request
P = "https://hd7qwtcq.api.sanity.io/v2023-10-01/"
def api(path, body=None):
    req = urllib.request.Request(P+path, data=json.dumps(body).encode() if body else None,
        headers={"Authorization": "Bearer "+os.environ["SANITY_API_TOKEN"], "Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req))
def get(i):
    d = api("data/doc/production/"+i)["documents"]; return d[0] if d else None
PID = "UzjbPEJ4gI65TQn8dT7zNC"
NOTE = "Temporarily closed; SeaWorld lists no reopening date (checked Nov 16, 2026)"
SRC = ("https://seaworld.com/orlando/rides/ (\"Temporarily Closed\") + https://seaworld.com/orlando/park-info/ride-attraction-schedule (\"Sky Tower - Temporarily Closed\", no date). "
       "HEIGHT CONFLICT, not written: listing tag says 48\" min, https://seaworld.com/orlando/rides/sky-tower says \"No Limit\"; heightRequirement left at 0.")
pub = get(PID); assert pub and pub["name"] == "Sky Tower" and pub["park"] == "SeaWorld Orlando"
assert get("drafts."+PID) is None, "draft exists"
d = {k: v for k, v in pub.items() if k not in ("_rev", "_createdAt", "_updatedAt")}
d["_id"] = "drafts."+PID; d["isClosed"] = True; d["closureNote"] = NOTE
rows = [{"draftId": d["_id"], "name": "Sky Tower", "field": "isClosed", "before": pub.get("isClosed"), "after": True, "source": SRC},
        {"draftId": d["_id"], "name": "Sky Tower", "field": "closureNote", "before": pub.get("closureNote"), "after": NOTE, "source": SRC},
        {"draftId": d["_id"], "name": "Sky Tower", "field": "heightRequirement (UNCHANGED, conflict)", "before": pub.get("heightRequirement"), "after": pub.get("heightRequirement"), "source": SRC}]
print(json.dumps(rows, indent=1))
if "--apply" in sys.argv:
    m = json.load(open("manifest.json")); m += rows; json.dump(m, open("manifest.json", "w"), indent=1)
    r = api("data/mutate/production?returnIds=true", {"mutations": [{"createOrReplace": d}]})
    json.dump(r, open("apply-result-skytower.json", "w"), indent=1); print("applied", r["results"])
