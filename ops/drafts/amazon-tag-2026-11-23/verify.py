"""Read back Amazon tag-swap drafts. Never publishes. Expects ALL OK."""
import json, os, sys, urllib.request

P = "https://hd7qwtcq.api.sanity.io/v2023-10-01/data/doc/production/"
OLD, NEW = "planyourpark-20", "planyourpar0a-20"


def get(i):
    r = urllib.request.Request(
        P + i, headers={"Authorization": "Bearer " + os.environ["SANITY_API_TOKEN"]}
    )
    d = json.load(urllib.request.urlopen(r))["documents"]
    return d[0] if d else None


def count_tag(obj, tag):
    if isinstance(obj, dict):
        return sum(count_tag(v, tag) for v in obj.values())
    if isinstance(obj, list):
        return sum(count_tag(v, tag) for v in obj)
    if isinstance(obj, str):
        return obj.count(tag)
    return 0


manifest = json.load(open("manifest.json"))
ok = True
lines = []
for row in manifest:
    did, pid = row["draftId"], row["publishedId"]
    draft, pub = get(did), get(pid)
    checks = []
    if draft is None:
        checks.append("MISSING DRAFT")
    if pub is None:
        checks.append("MISSING PUBLISHED")
    if draft and not did.startswith("drafts."):
        checks.append("draft id not drafts.*")
    if draft:
        old_d, new_d = count_tag(draft, OLD), count_tag(draft, NEW)
        if old_d != 0:
            checks.append(f"draft still has {old_d} old tags")
        if new_d != row["newTagCount"]:
            checks.append(f"draft new tag count {new_d} != {row['newTagCount']}")
    if pub:
        old_p = count_tag(pub, OLD)
        if old_p != row["oldTagCount"]:
            checks.append(f"published old tag count changed: {old_p} != {row['oldTagCount']}")
        if count_tag(pub, NEW) != 0:
            checks.append("published already has new tag (should stay old until publish)")
    status = "OK" if not checks else "FAIL " + "; ".join(checks)
    if checks:
        ok = False
    line = f"{status}  {did}  slug={row['slug']}  field={row['field']}"
    lines.append(line)
    print(line)

held = get("drafts.blogPost-universal-orlando-parks-with-kids")
if held:
    line = f"HELD (untouched) drafts.blogPost-universal-orlando-parks-with-kids old={count_tag(held, OLD)} new={count_tag(held, NEW)} rev={held['_rev']}"
    lines.append(line)
    print(line)

summary = "ALL OK" if ok else "FAILURES"
lines.append(summary)
print(summary)
open("verify-output.txt", "w").write("\n".join(lines) + "\n")
sys.exit(0 if ok else 1)
