"""Route leftover Sanity Amazon search / stale product links through the catalog.

DRAFTS only (drafts.*). Never publishes. Stored hrefs use the fallback tag
planyourpar0a-20; the site applies the page tracking ID at render time.

Usage: python3 apply.py [--apply]   (default: dry run)

Does not touch:
- drafts.disney-vs-universal-with-kids-2026
- drafts.blogPost-orlando-theme-parks-for-families
"""
import json, os, re, sys, urllib.request
from copy import deepcopy
from pathlib import Path

HERE = Path(__file__).resolve().parent
P = "https://hd7qwtcq.api.sanity.io/v2023-10-01/"
FALLBACK_TAG = "planyourpar0a-20"
DO_NOT_TOUCH = {
    "drafts.disney-vs-universal-with-kids-2026",
    "drafts.blogPost-orlando-theme-parks-for-families",
}

# Canonical catalog ASINs (same as web/src/config/amazon-products.ts).
SEARCH_TO_ASIN = {
    "cooling towel kids": "B08L5LXKGW",
    "cooling towel": "B08L5LXKGW",
    "kids rain poncho": "B0CP74JJ3Z",
    "rain poncho": "B0CP74JJ3Z",
    "lightweight rain poncho": "B0CP74JJ3Z",
    "stroller fan": "B085L71L9R",
    "usb stroller fan": "B085L71L9R",
    "stroller fan with clip": "B085L71L9R",
    "kids ear protection earmuffs": "B07YRPX74G",
    "kids ear muffs": "B07YRPX74G",
    "lightweight travel stroller": "B00O20OCVC",
    "travel stroller": "B00O20OCVC",
    "waterproof phone pouch": "B0BTHVCV49",
    "waterproof phone pouch or dry bag": "B0BTHVCV49",
    "packing cubes travel organizers": "B08Z7SLGMF",
    "packing cubes": "B08Z7SLGMF",
    "packing cubes or compression sacks": "B08Z7SLGMF",
}

ASIN_ALIASES = {
    "B005IHT94S": "B004CDQ73K",
    "B09KV1QTQ8": "B0BG6NRL86",
    "B08866RDYK": "B085L71L9R",
    "B0D14VV1JL": "B077TKLJ8T",
    "B077TQL1WG": "B077TKLJ8T",
    "B077TQL1WL": "B077TKLJ8T",
    "B077TQRHC3": "B077TKLJ8T",
    "B09HRW7ZHB": "B08L5LXKGW",
    "B0D7GCYHD5": "B0CP74JJ3Z",
}

CATALOG_ASINS = {
    "B00O20OCVC",
    "B085L71L9R",
    "B0DT12DNVF",
    "B08L5LXKGW",
    "B0CP74JJ3Z",
    "B0BG6NRL86",
    "B004CDQ73K",
    "B0BTHVCV49",
    "B077TKLJ8T",
    "B0FZYMW236",
    "B07YRPX74G",
    "B08Z7SLGMF",
}

TARGETS = [
    {"id": "blogPost-animal-kingdom-with-kids-rides-by-height", "slug": "animal-kingdom-with-kids-rides-by-height", "title": "Animal Kingdom with Kids: Rides by Height, Best Picks, and a Simple Plan (2026)"},
    {"id": "blogPost-disney-world-rides-for-toddlers-and-preschoolers", "slug": "disney-world-rides-for-toddlers-and-preschoolers", "title": "Best Disney World Rides for Toddlers and Preschoolers, Park by Park"},
    {"id": "blogPost-epcot-with-kids-rides-by-height", "slug": "epcot-with-kids-rides-by-height", "title": "EPCOT with Kids: Rides by Height, Best Picks, and a Simple Plan (2026)"},
    {"id": "blogPost-magic-kingdom-with-kids-rides-by-height", "slug": "magic-kingdom-with-kids-rides-by-height", "title": "Magic Kingdom with Kids: Rides by Height, Best Picks, and a Simple Plan (2026)"},
    {"id": "blogPost-universal-orlando-parks-with-kids", "slug": "universal-orlando-parks-with-kids", "title": "Universal Orlando Parks with Kids: Which of the 4 to Pick (2026)"},
    {"id": "q5bQv6QFqWcAZeLNacauDO", "slug": "best-magic-kingdom-rides-kids-under-40-inches", "title": "Best Magic Kingdom Rides for Kids Under 40 Inches"},
    {"id": "q5bQv6QFqWcAZeLNacaufh", "slug": "beat-disney-world-crowds", "title": "How to Beat Disney World Crowds in 2026"},
    {"id": "r5PBb5Nahg2bY9okthych9", "slug": "disney-world-with-baby-toddler", "title": "Disney World with a Baby or Toddler: The Complete Guide"},
    {"id": "r5PBb5Nahg2bY9okthycnn", "slug": "universal-orlando-height-requirements", "title": "Universal Height Requirements 2026 — Full Ride Chart"},
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


def norm_key(raw):
    value = raw.replace("+", " ")
    try:
        from urllib.parse import unquote
        value = unquote(value)
    except Exception:
        pass
    return re.sub(r"\s+", " ", re.sub(r"[_-]+", " ", value.lower())).strip()


def extract_asin(href):
    m = re.search(r"/(?:dp|gp/product|gp/aw/d|d)/([A-Z0-9]{10})", href, re.I)
    if m:
        return m.group(1).upper()
    m = re.search(r"[?&]asin=([A-Z0-9]{10})", href, re.I)
    return m.group(1).upper() if m else None


def extract_search_key(href):
    m = re.search(r"[?&](?:k|field-keywords)=([^&]+)", href, re.I)
    return norm_key(m.group(1)) if m else None


def catalog_url(asin):
    return f"https://www.amazon.com/dp/{asin}?tag={FALLBACK_TAG}"


def resolve_href(href):
    if not isinstance(href, str) or "amazon." not in href.lower() and "amzn.to" not in href.lower():
        return href, "leave"
    asin = extract_asin(href)
    if asin:
        dest = ASIN_ALIASES.get(asin, asin if asin in CATALOG_ASINS else None)
        if not dest:
            return None, "unlink"
        return catalog_url(dest), "asin"
    key = extract_search_key(href)
    if key:
        dest = SEARCH_TO_ASIN.get(key)
        if not dest:
            return None, "unlink"
        return catalog_url(dest), "search"
    return None, "unlink"


AMAZON_IN_STR = re.compile(r"https?://[^\s\"'<>]*?(?:amazon\.com|amzn\.to)[^\s\"'<>]*", re.I)


def rewrite(obj, changes):
    if isinstance(obj, dict):
        out = {}
        for k, v in obj.items():
            if k == "href" and isinstance(v, str) and ("amazon." in v.lower() or "amzn.to" in v.lower()):
                new, kind = resolve_href(v)
                changes.append({"field": "href", "from": v, "to": new, "kind": kind})
                if new is None:
                    # Drop the mark href so Portable Text unlinks; keep the key absent.
                    continue
                out[k] = new
            else:
                out[k] = rewrite(v, changes)
        return out
    if isinstance(obj, list):
        return [rewrite(v, changes) for v in obj]
    if isinstance(obj, str) and ("amazon.com" in obj.lower() or "amzn.to" in obj.lower()):
        def repl(m):
            url = m.group(0)
            new, kind = resolve_href(url)
            changes.append({"field": "string", "from": url, "to": new, "kind": kind})
            return new if new is not None else ""
        return AMAZON_IN_STR.sub(repl, obj)
    return obj


def amazon_urls(obj, acc=None):
    if acc is None:
        acc = []
    if isinstance(obj, dict):
        for v in obj.values():
            amazon_urls(v, acc)
    elif isinstance(obj, list):
        for v in obj:
            amazon_urls(v, acc)
    elif isinstance(obj, str):
        acc.extend(AMAZON_IN_STR.findall(obj))
    return acc


os.makedirs(HERE / "backup", exist_ok=True)
muts, manifest, publish_ids = [], [], []

for parked in sorted(DO_NOT_TOUCH):
    doc = get(parked)
    if doc:
        json.dump(doc, open(HERE / "backup" / f"{parked}-UNCHANGED.json", "w"), indent=1, ensure_ascii=False)

for t in TARGETS:
    pid = t["id"]
    assert f"drafts.{pid}" not in DO_NOT_TOUCH
    pub = get(pid)
    assert pub, pid
    existing = get("drafts." + pid)
    assert existing is None, "draft already exists: " + pid
    json.dump(pub, open(HERE / "backup" / f"{pid}-published-BEFORE.json", "w"), indent=1, ensure_ascii=False)
    changes = []
    d = {k: v for k, v in pub.items() if k not in ("_rev", "_createdAt", "_updatedAt")}
    d = rewrite(d, changes)
    d["_id"] = "drafts." + pid
    leftover = [u for u in amazon_urls(d) if "/s?" in u or "planyourpark-20" in u]
    assert not leftover, (pid, leftover)
    assert d["_id"].startswith("drafts.")
    meaningful = [c for c in changes if c["from"] != c["to"]]
    assert meaningful, "no Amazon changes for " + pid
    muts.append({"createOrReplace": d})
    publish_ids.append(d["_id"])
    manifest.append({
        "draftId": d["_id"],
        "publishedId": pid,
        "slug": t["slug"],
        "title": t["title"],
        "publishedRev": pub["_rev"],
        "publishedUpdatedAt": pub["_updatedAt"],
        "changes": meaningful,
    })

for m in muts:
    assert list(m.values())[0]["_id"].startswith("drafts.")

json.dump(manifest, open(HERE / "manifest.json", "w"), indent=1, ensure_ascii=False)
json.dump(muts, open(HERE / "mutations.json", "w"), indent=1, ensure_ascii=False)
json.dump({"draftIdsToPublish": publish_ids, "doNotTouch": sorted(DO_NOT_TOUCH)}, open(HERE / "publish-ids.json", "w"), indent=1)

if "--apply" in sys.argv:
    r = api("data/mutate/production?returnIds=true", {"mutations": muts})
    json.dump(r, open(HERE / "apply-result.json", "w"), indent=1)
    print("applied", len(r["results"]), "drafts")
    for mid in publish_ids:
        print(" ", mid)
else:
    print("dry run:", len(muts), "drafts ready. Re-run with --apply to write drafts.")
    for row in manifest:
        print(row["draftId"], "changes", len(row["changes"]))
        for c in row["changes"]:
            print("   ", c["kind"], c["from"], "->", c["to"])
