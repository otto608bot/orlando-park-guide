"""Amazon Associates tag swap, 2026-11-23. Sanity DRAFTS only (drafts.*), never publishes.

Usage: python3 apply.py [--apply]   (default: dry run, writes backup/manifest/mutations)

Replaces planyourpark-20 with planyourpar0a-20 (zero after 'par', not letter O)
in published documents that still carry the closed tag.

Skipped on purpose (do not touch):
- drafts.blogPost-universal-orlando-parks-with-kids (pending publish; has 3 old-tag links)
- drafts.disney-vs-universal-with-kids-2026
- drafts.blogPost-orlando-theme-parks-for-families (PR 79)

Asserts no draft already exists for each published id before createOrReplace.
Backups of every published doc touched are written to backup/ before any write.
"""
import json, os, sys, urllib.request

P = "https://hd7qwtcq.api.sanity.io/v2023-10-01/"
OLD, NEW = "planyourpark-20", "planyourpar0a-20"
DO_NOT_TOUCH = {
    "drafts.blogPost-universal-orlando-parks-with-kids",
    "drafts.disney-vs-universal-with-kids-2026",
    "drafts.blogPost-orlando-theme-parks-for-families",
}

# Published docs with the old tag, and the field(s) it lives in.
TARGETS = [
    {
        "id": "blogPost-animal-kingdom-with-kids-rides-by-height",
        "slug": "animal-kingdom-with-kids-rides-by-height",
        "title": "Animal Kingdom with Kids: Rides by Height, Best Picks, and a Simple Plan (2026)",
        "field": "body",
        "expected": 3,
    },
    {
        "id": "blogPost-disney-world-rides-for-toddlers-and-preschoolers",
        "slug": "disney-world-rides-for-toddlers-and-preschoolers",
        "title": "Best Disney World Rides for Toddlers and Preschoolers, Park by Park",
        "field": "body",
        "expected": 3,
    },
    {
        "id": "blogPost-epcot-with-kids-rides-by-height",
        "slug": "epcot-with-kids-rides-by-height",
        "title": "EPCOT with Kids: Rides by Height, Best Picks, and a Simple Plan (2026)",
        "field": "body",
        "expected": 3,
    },
    {
        "id": "blogPost-magic-kingdom-with-kids-rides-by-height",
        "slug": "magic-kingdom-with-kids-rides-by-height",
        "title": "Magic Kingdom with Kids: Rides by Height, Best Picks, and a Simple Plan (2026)",
        "field": "body",
        "expected": 3,
    },
    # Additional finds: old tag is in affiliateCTA (HTML string), not body.
    # Current web code does not appear to render affiliateCTA; still swapped so the
    # published docs are clean when this field is used or inspected.
    {
        "id": "q5bQv6QFqWcAZeLNacauDO",
        "slug": "best-magic-kingdom-rides-kids-under-40-inches",
        "title": "Best Magic Kingdom Rides for Kids Under 40 Inches",
        "field": "affiliateCTA",
        "expected": 3,
    },
    {
        "id": "q5bQv6QFqWcAZeLNacaufh",
        "slug": "beat-disney-world-crowds",
        "title": "How to Beat Disney World Crowds in 2026",
        "field": "affiliateCTA",
        "expected": 3,
    },
    {
        "id": "r5PBb5Nahg2bY9okthych9",
        "slug": "disney-world-with-baby-toddler",
        "title": "Disney World with a Baby or Toddler: The Complete Guide",
        "field": "affiliateCTA",
        "expected": 3,
    },
    {
        "id": "r5PBb5Nahg2bY9okthycnn",
        "slug": "universal-orlando-height-requirements",
        "title": "Universal Height Requirements 2026 — Full Ride Chart",
        "field": "affiliateCTA",
        "expected": 3,
    },
]


def api(path, body=None):
    req = urllib.request.Request(
        P + path,
        data=json.dumps(body).encode() if body else None,
        headers={
            "Authorization": "Bearer " + os.environ["SANITY_API_TOKEN"],
            "Content-Type": "application/json",
        },
    )
    return json.load(urllib.request.urlopen(req))


def get(i):
    d = api("data/doc/production/" + i)["documents"]
    return d[0] if d else None


def swap(obj):
    if isinstance(obj, dict):
        return {k: swap(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [swap(v) for v in obj]
    if isinstance(obj, str) and OLD in obj:
        return obj.replace(OLD, NEW)
    return obj


def count_tag(obj, tag):
    if isinstance(obj, dict):
        return sum(count_tag(v, tag) for v in obj.values())
    if isinstance(obj, list):
        return sum(count_tag(v, tag) for v in obj)
    if isinstance(obj, str):
        return obj.count(tag)
    return 0


os.makedirs("backup", exist_ok=True)
muts, manifest, publish_ids = [], [], []

for t in TARGETS:
    pid = t["id"]
    assert f"drafts.{pid}" not in DO_NOT_TOUCH
    pub = get(pid)
    assert pub, pid
    existing = get("drafts." + pid)
    assert existing is None, "draft already exists: " + pid
    before = count_tag(pub, OLD)
    assert before == t["expected"], f"{pid}: expected {t['expected']} old tags, found {before}"
    json.dump(pub, open(f"backup/{pid}-published-BEFORE.json", "w"), indent=1, ensure_ascii=False)
    d = {k: v for k, v in pub.items() if k not in ("_rev", "_createdAt", "_updatedAt")}
    d = swap(d)
    d["_id"] = "drafts." + pid
    after_old = count_tag(d, OLD)
    after_new = count_tag(d, NEW)
    assert after_old == 0, pid
    assert after_new == before, pid
    assert d["_id"].startswith("drafts.")
    muts.append({"createOrReplace": d})
    publish_ids.append(d["_id"])
    manifest.append({
        "draftId": d["_id"],
        "publishedId": pid,
        "slug": t["slug"],
        "title": t["title"],
        "field": t["field"],
        "oldTagCount": before,
        "newTagCount": after_new,
        "publishedRev": pub["_rev"],
        "publishedUpdatedAt": pub["_updatedAt"],
    })

# Read-only snapshot of the Universal draft we are not touching
held = get("drafts.blogPost-universal-orlando-parks-with-kids")
if held:
    json.dump(held, open("backup/drafts.blogPost-universal-orlando-parks-with-kids-UNCHANGED.json", "w"), indent=1, ensure_ascii=False)
    held_count = count_tag(held, OLD)
    print(f"held unchanged: drafts.blogPost-universal-orlando-parks-with-kids old tags={held_count} rev={held['_rev']}")

for m in muts:
    assert list(m.values())[0]["_id"].startswith("drafts.")

json.dump(manifest, open("manifest.json", "w"), indent=1, ensure_ascii=False)
json.dump(muts, open("mutations.json", "w"), indent=1, ensure_ascii=False)
json.dump({"draftIdsToPublish": publish_ids, "doNotTouch": sorted(DO_NOT_TOUCH)}, open("publish-ids.json", "w"), indent=1)

if "--apply" in sys.argv:
    r = api("data/mutate/production?returnIds=true", {"mutations": muts})
    json.dump(r, open("apply-result.json", "w"), indent=1)
    print("applied", len(r["results"]), "drafts:", publish_ids)
else:
    print("dry run", len(muts), "mutations;", len(manifest), "manifest rows")
