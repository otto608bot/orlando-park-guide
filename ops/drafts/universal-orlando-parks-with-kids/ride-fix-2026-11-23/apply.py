"""Universal ride-finder fixes, 2026-11-23 (PR 83, Universal bundle step 1). Sanity DRAFTS only (drafts.*), never publishes.
Usage: python3 apply.py [--apply]   (default: dry run, prints mutations)
- Closures: drafts.<id> = createOrReplace copy of the published doc + isClosed/closureNote (asserts no draft existed).
- New ride docs: drafts.ride-<park>-<slug> (convention from PR 80, e.g. ride-ioa-flight-of-the-hippogriff).
- Skipped by approval: Jurassic Park River Adventure temporary closure, optional name tweaks.
- Backups of every published doc touched are written to backup/ before any write."""
import json, os, sys, urllib.request
P = "https://hd7qwtcq.api.sanity.io/v2023-10-01/"
def api(path, body=None):
    req = urllib.request.Request(P+path, data=json.dumps(body).encode() if body else None,
        headers={"Authorization": "Bearer "+os.environ["SANITY_API_TOKEN"], "Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req))
def get(i):
    d = api("data/doc/production/"+i)["documents"]; return d[0] if d else None
CHK = "Nov 23, 2026"
UOH = "https://www.universalorlando.com/web/en/us/plan-your-visit/hours-information/ride-height-requirements"
UOR = "https://www.universalorlando.com/web/en/us/things-to-do/rides-attractions/"
PR = "https://media.universalparksusa.com/press-releases/trade-universal-orlando-resort-reveals-its-next-blockbuster-attraction-fast-furious-hollywood-drift-a-high-speed-roller-coaster-coming-to-universal-studios-florida-in-2027/"
os.makedirs("backup", exist_ok=True)
muts, manifest = [], []
def change(pid, fields, src):
    pub = get(pid); assert pub, pid
    assert get("drafts."+pid) is None, "draft already exists: "+pid
    json.dump(pub, open(f"backup/{pid}-published-BEFORE.json", "w"), indent=1, ensure_ascii=False)
    d = {k: v for k, v in pub.items() if k not in ("_rev", "_createdAt", "_updatedAt")}
    d["_id"] = "drafts."+pid
    for k, v in fields.items():
        manifest.append({"draftId": d["_id"], "name": pub["name"], "field": k, "before": pub.get(k), "after": v, "source": src})
        d[k] = v
    muts.append({"createOrReplace": d})
# 1. Fast & Furious: Supercharged
change("q5bQv6QFqWcAZeLNaYa8Up", {"isClosed": True, "closureNote":
    "Permanently closed. Last day Aug 16, 2026 (closed Aug 17), moved up from the 2027 closure in Universal's Jan 20, 2026 press release, "
    "per Universal's passholder notice as reported by Inside Universal (Jul 15 and Aug 17, 2026). No longer on Universal's ride height page, "
    f"and its official ride page now redirects to the homepage (checked {CHK})."},
    UOH+" (not listed) + "+UOR+"fast-furious-supercharged (redirects to homepage) + "+PR+" ('will permanently close in 2027') + "
    "https://www.insideuniversal.net/2026/08/fast-furious-supercharged-permanently-closes-at-universal-studios-florida/")
# 2. Hollywood Rip Ride Rockit
change("q5bQv6QFqWcAZeLNaYa8qq", {"isClosed": True, "closureNote":
    "Permanently closed. Last day Aug 17, 2025, as reported by WDW News Today and Inside Universal (Aug 18, 2025); Universal's Jan 20, 2026 "
    "press release calls it \"the former Hollywood Rip Ride Rockit\", being replaced by Fast & Furious: Hollywood Drift in 2027. No longer on "
    f"Universal's ride height page, and its official ride page now redirects to the homepage (checked {CHK})."},
    UOH+" (not listed) + "+UOR+"hollywood-rip-ride-rockit (redirects to homepage) + "+PR+" ('Replacing the former Hollywood Rip Ride Rockit') + "
    "https://wdwnt.com/2025/08/last-look-hollywood-rip-ride-rockit-universal-studios-florida/")
# 3. New ride docs. Shape copied from published PR 80 new docs + comparable no-minimum rides (One Fish, Two Fish / Storm Force:
#    rideType Spinner, thrillLevel 1). thrillLevel 1 follows the site's migrate-to-sanity.mjs rule (height < 35 -> 1).
#    accessibility [] and no rideDuration: Universal's pages give neither in a checkable form (same as PR 80 new docs).
new = [
 ("ride-ioa-caro-seuss-el", "Caro-Seuss-el", "Islands of Adventure", "Seuss Landing", "Carousel", "ioa-caro-seuss-el",
  "A carousel of Dr. Seuss characters whose eyes blink, ears wiggle and heads turn when you pull the reins. Children under 48 inches need a supervising companion.",
  UOR+"caro-seuss-el (Seuss Landing, 'No Minimum Height', 'Under 48\" Requires Supervising Companion', Kid Friendly)"),
 ("ride-usf-kang-kodos-twirl-n-hurl", "Kang & Kodos' Twirl 'n' Hurl", "Universal Studios Florida", "Springfield, U.S.A.: Home of The Simpsons", "Spinner", "usf-kang-kodos",
  "Pilot your own flying saucer with Kang and Kodos from The Simpsons, swooping up and down as you spin through space. Children under 48 inches need a supervising companion.",
  UOR+"kang-and-kodos-twirl-and-hurl (Springfield, U.S.A., 'No Minimum Height', 'Under 48\" Requires Supervising Companion', Kid Friendly)"),
]
taken = {s for s in api("data/query/production?query=*%5B_type%3D%3D%22ride%22%5D.slug.current")["result"]}
for _id, name, park, land, rt, slug, desc, src in new:
    assert get(_id) is None and get("drafts."+_id) is None, _id
    assert slug not in taken, "slug taken: "+slug
    doc = {"_id": "drafts."+_id, "_type": "ride", "name": name, "park": park, "land": land, "heightRequirement": 0,
           "rideType": rt, "thrillLevel": 1, "description": desc, "accessibility": [], "slug": {"_type": "slug", "current": slug}}
    muts.append({"createOrReplace": doc})
    manifest.append({"draftId": doc["_id"], "name": name, "field": "NEW DOC heightRequirement", "before": None, "after": 0, "source": src})
for m in muts: assert list(m.values())[0]["_id"].startswith("drafts.")
json.dump(manifest, open("manifest.json", "w"), indent=1, ensure_ascii=False)
json.dump(muts, open("mutations.json", "w"), indent=1, ensure_ascii=False)
if "--apply" in sys.argv:
    r = api("data/mutate/production?returnIds=true", {"mutations": muts})
    json.dump(r, open("apply-result.json", "w"), indent=1); print("applied", len(r["results"]))
else:
    print("dry run", len(muts), "mutations;", len(manifest), "manifest rows")
