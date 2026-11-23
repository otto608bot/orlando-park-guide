"""Read-back for ride-fix-2026-11-23 (Sanity drafts only). Checks every manifest value on the drafts, that published docs are
byte-identical to the pre-apply backups (nothing published), that new docs have no published version, and that the blog
post draft is present, unpublished and unchanged (rev matches backup) unless --post-changed. Prints ALL OK or PROBLEM."""
import json, os, glob, urllib.request
P = "https://hd7qwtcq.api.sanity.io/v2023-10-01/data/doc/production/"
def get(i):
    r = urllib.request.Request(P+i, headers={"Authorization": "Bearer "+os.environ["SANITY_API_TOKEN"]})
    d = json.load(urllib.request.urlopen(r))["documents"]; return d[0] if d else None
ok = True
def chk(label, cond):
    global ok; ok &= bool(cond); print(("  OK   " if cond else "  FAIL ")+label)
man = json.load(open("manifest.json")); res = json.load(open("apply-result.json"))["results"]
ids = sorted({r["id"] for r in res})
for i in ids:
    d = get(i); pid = i[len("drafts."):]; pub = get(pid)
    print(i, "|", d and d.get("name"))
    chk("draft exists", d)
    chk("draft _type ride", d and d.get("_type") == "ride")
    for m in [m for m in man if m["draftId"] == i]:
        f = "heightRequirement" if m["field"].startswith("NEW") else m["field"]
        chk(f"{f} = {json.dumps(m['after'])[:60]}", d and d.get(f) == m["after"])
    bk = f"backup/{pid}-published-BEFORE.json"
    if os.path.exists(bk):
        b = json.load(open(bk))
        chk("published doc identical to pre-apply backup (rev %s)" % b["_rev"], pub == b)
        chk("published isClosed still unset", pub and not pub.get("isClosed"))
        for k in b:
            if k not in ("_rev", "_createdAt", "_updatedAt", "_id", "isClosed", "closureNote"):
                chk(f"draft keeps published {k}", d.get(k) == b[k]) if k in ("name", "park", "heightRequirement", "slug", "rideType") else None
    else:
        chk("no published version (new doc)", pub is None)
        for k in ("name", "park", "land", "rideType", "slug", "description"): chk(f"{k} set", d and d.get(k))
        chk("thrillLevel 1", d and d.get("thrillLevel") == 1)
        chk("closure fields unset", d and "isClosed" not in d and "closureNote" not in d)
    if d and d.get("closureNote"): chk("closureNote dated (checked Nov 23, 2026)", "(checked Nov 23, 2026)" in d["closureNote"])
print("drafts.blogPost-universal-orlando-parks-with-kids")
bp = get("drafts.blogPost-universal-orlando-parks-with-kids"); bb = json.load(open("backup/blogPost-universal-orlando-parks-with-kids-draft-BEFORE.json"))
chk("blog post draft exists", bp)
chk("blog post has no published version", get("blogPost-universal-orlando-parks-with-kids") is None)
chk("blog post draft unchanged by rechecks (rev %s)" % bb["_rev"], bp and bp["_rev"] == bb["_rev"])
txt = json.dumps(bp["body"], ensure_ascii=False)
for s in ("April 1, 2027", "January 5 to December 16, 2026", "December 11 to December 15, 2026", "November 14, 2026 to January 3, 2027"):
    chk(f"post states '{s}' (matches Nov 23 recheck)", s in txt)
chk("post heroImage set", bp.get("heroImage"))
print("ALL OK" if ok else "PROBLEM")
