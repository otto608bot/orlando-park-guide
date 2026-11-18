"""Addendum 2026-11-16 (CEO/Bennett): Hollywood Studios data. Drafts only, never publishes.
1) drafts.<Muppet*Vision 3D> isClosed + dated note. 2) drafts.<Rock 'n' Roller Coaster> name only (slug unchanged).
3) Backs up then DELETES only the pending draft drafts.r5PBb5Nahg2bY9oktfqOej (Walt Disney World Railroad); published doc untouched.
Usage: python3 apply_hs_cleanup.py [--apply]. Appends to manifest.json, writes apply-result-hs-cleanup.json."""
import json, os, sys, urllib.request
P = "https://hd7qwtcq.api.sanity.io/v2023-10-01/"
def api(path, body=None):
    req = urllib.request.Request(P+path, data=json.dumps(body).encode() if body else None,
        headers={"Authorization": "Bearer "+os.environ["SANITY_API_TOKEN"], "Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req))
def get(i):
    d = api("data/doc/production/"+i)["documents"]; return d[0] if d else None
LIST = "https://disneyworld.disney.go.com/attractions/hollywood-studios/ (42 things to do, checked Nov 16, 2026)"
muts, rows = [], []
def copy(pid, expect_name):
    pub = get(pid); assert pub and pub["name"] == expect_name and pub["park"] == "Hollywood Studios", pid
    assert get("drafts."+pid) is None
    d = {k: v for k, v in pub.items() if k not in ("_rev", "_createdAt", "_updatedAt")}; d["_id"] = "drafts."+pid
    return pub, d
# 1. Muppet*Vision 3D
pub, d = copy("UzjbPEJ4gI65TQn8dT78P8", "Muppet*Vision 3D")
note = "Permanently closed in June 2025 (checked Nov 16, 2026)"
d["isClosed"] = True; d["closureNote"] = note; muts.append({"createOrReplace": d})
src1 = (LIST+": not listed (Rock 'n' Roller Coaster Starring The Muppets is; no Muppet*Vision 3D); disneyworld.disney.go.com/attractions/hollywood-studios/muppet-vision-3d/ redirects to that listing. "
        "Closure date: last public show June 7, closed June 8, 2025 per https://wdwnt.com/2025/06/video-final-muppetvision-3d-show-at-disneys-hollywood-studios/ and https://www.disneytouristblog.com/muppetvision-3d-is-closed-whats-next/")
rows += [{"draftId": d["_id"], "name": pub["name"], "field": "isClosed", "before": pub.get("isClosed"), "after": True, "source": src1},
         {"draftId": d["_id"], "name": pub["name"], "field": "closureNote", "before": pub.get("closureNote"), "after": note, "source": src1}]
# 2. Rock 'n' Roller Coaster rename (name only)
pub, d = copy("q5bQv6QFqWcAZeLNaYZpj7", "Rock 'n' Roller Coaster")
new = "Rock 'n' Roller Coaster Starring The Muppets"; d["name"] = new; muts.append({"createOrReplace": d})
assert d["slug"] == pub["slug"]
rows.append({"draftId": d["_id"], "name": pub["name"], "field": "name", "before": pub["name"], "after": new,
             "source": LIST+": official listing name is \"Rock ’n’ Roller Coaster Starring The Muppets — New!\" (48\" or taller; straight apostrophes kept to match site data). Slug hs-rock-roller UNCHANGED."})
# 3. discard Railroad draft after saving backup
RID = "drafts.r5PBb5Nahg2bY9oktfqOej"; PUB = "r5PBb5Nahg2bY9oktfqOej"
bk = get(RID); assert bk and bk["name"] == "Walt Disney World Railroad"
rpub = get(PUB); assert rpub
json.dump(bk, open("railroad-draft-BACKUP.json", "w"), indent=1)
json.dump(rpub, open("railroad-published-BEFORE.json", "w"), indent=1)
assert os.path.getsize("railroad-draft-BACKUP.json") > 100
muts.append({"delete": {"id": RID}})
rows.append({"draftId": RID, "name": "Walt Disney World Railroad", "field": "DRAFT DISCARDED (deleted)", "before": "draft existed (isClosed true, refurb note from Oct 19); backup: railroad-draft-BACKUP.json", "after": "no draft; published doc untouched", "source": "CEO/Bennett instruction; revert.py re-creates from backup"})
print(json.dumps(rows, indent=1)[:1500])
if "--apply" in sys.argv:
    m = json.load(open("manifest.json")); m += rows; json.dump(m, open("manifest.json", "w"), indent=1)
    r = api("data/mutate/production?returnIds=true", {"mutations": muts}); json.dump(r, open("apply-result-hs-cleanup.json", "w"), indent=1); print(r["results"])
