"""Verify catalog Amazon drafts. Does not publish."""
import json, os, sys, urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
P = "https://hd7qwtcq.api.sanity.io/v2023-10-01/"
manifest = json.load(open(HERE / "manifest.json"))
do_not_touch = json.load(open(HERE / "publish-ids.json"))["doNotTouch"]
fails = 0


def api(path):
    req = urllib.request.Request(
        P + path,
        headers={"Authorization": "Bearer " + os.environ["SANITY_API_TOKEN"]},
    )
    return json.load(urllib.request.urlopen(req))


def get(i):
    d = api("data/doc/production/" + i)["documents"]
    return d[0] if d else None


def urls(obj, acc=None):
    import re
    if acc is None:
        acc = []
    if isinstance(obj, dict):
        for v in obj.values():
            urls(v, acc)
    elif isinstance(obj, list):
        for v in obj:
            urls(v, acc)
    elif isinstance(obj, str):
        acc.extend(re.findall(r"https?://[^\s\"'<>]*?(?:amazon\.com|amzn\.to)[^\s\"'<>]*", obj, re.I))
    return acc


def fail(msg):
    global fails
    fails += 1
    print("FAIL", msg)


for row in manifest:
    did, pid = row["draftId"], row["publishedId"]
    draft = get(did)
    pub = get(pid)
    if not draft:
        fail(f"missing draft {did}")
        continue
    if not pub:
        fail(f"missing published {pid}")
        continue
    if pub.get("_rev") != row["publishedRev"]:
        fail(f"published {pid} rev changed: {pub.get('_rev')} vs {row['publishedRev']}")
    for u in urls(draft):
        if "/s?" in u or "tag=planyourpark-20" in u:
            fail(f"{did} still has leftover Amazon URL: {u}")
        if "amazon.com" in u and "/dp/" not in u:
            fail(f"{did} non-/dp/ Amazon URL: {u}")
        if "tag=" in u and "tag=planyourpar0a-20" not in u and "tag=planyourpark-20" not in u:
            # stored hrefs must use the fallback tag
            fail(f"{did} unexpected tag in {u}")
    for c in row["changes"]:
        if c["to"] and c["to"] not in json.dumps(draft):
            fail(f"{did} missing expected href {c['to']}")
        if c["from"] in json.dumps(draft) and c["from"] != c["to"]:
            fail(f"{did} still has old href {c['from']}")
    print("OK", did, "changes", len(row["changes"]))

for parked in do_not_touch:
    path = HERE / "backup" / f"{parked}-UNCHANGED.json"
    if not path.exists():
        print("NOTE no backup for", parked)
        continue
    before = json.load(open(path))
    now = get(parked)
    if not now:
        fail(f"parked draft disappeared: {parked}")
        continue
    if now.get("_rev") != before.get("_rev"):
        fail(f"parked draft changed: {parked} {now.get('_rev')} vs {before.get('_rev')}")
    else:
        print("OK parked unchanged", parked)

if fails:
    print("FAILED", fails)
    sys.exit(1)
print("ALL OK")
