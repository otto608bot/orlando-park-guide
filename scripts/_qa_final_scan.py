#!/usr/bin/env python3
"""One-off final QA scan for Plan Your Park blog posts."""
from __future__ import annotations

import json
import re
import traceback
import urllib.parse
import urllib.request
from collections import defaultdict
from typing import Any

PROJECT_ID = "hd7qwtcq"
DATASET = "production"
API_VERSION = "2024-01-01"

query = """
*[_type == "blogPost"] | order(slug.current asc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  body[]{
    _key, _type, style, listItem, level,
    markDefs[]{_key,_type,href},
    children[]{_key,_type,text,marks}
  },
  _updatedAt,
  publishedAt
}
"""


def fetch_posts() -> list[dict[str, Any]]:
    url = (
        f"https://{PROJECT_ID}.api.sanity.io/v{API_VERSION}/data/query/{DATASET}"
        f"?query={urllib.parse.quote(query)}"
    )
    req = urllib.request.Request(url, headers={"User-Agent": "PYP-qa-final/1.0"})
    with urllib.request.urlopen(req, timeout=90) as resp:
        payload = json.loads(resp.read().decode())
    return payload.get("result") or []


def block_text(b: dict[str, Any] | None) -> str:
    if not b or b.get("_type") != "block":
        return ""
    return "".join((c.get("text") or "") for c in (b.get("children") or []))


def full_text(post: dict[str, Any]) -> str:
    parts = []
    for b in post.get("body") or []:
        t = block_text(b)
        if t:
            parts.append(t)
    return "\n".join(parts)


genie_re = re.compile(r"Genie\+|Genie Plus|Genie\s*app", re.I)
ll_re = re.compile(r"Lightning Lane", re.I)
express_as_ll = re.compile(r"Lightning Lane.{0,80}Universal|Universal.{0,80}Lightning Lane", re.I)
historical_context = re.compile(
    r"(retired|replaced|formerly|was called|previously|July 2024|until July|before July|"
    r"old name|legacy|shift from|renamed|succeeded|superseded|used to|from Genie|Genie\+ era)",
    re.I,
)
KNOWN_MARKS = {"strong", "em", "underline", "code", "strike-through", "description"}
HEADINGS = {"h1", "h2", "h3", "h4"}
CRIT = {
    "genie_current_suspect",
    "express_as_ll",
    "collapsed_list",
    "cliffhanger",
    "empty_heading",
    "height_conflict",
    "broken_mark",
    "genie_in_excerpt",
}


def analyze(p: dict[str, Any]) -> dict[str, Any]:
    slug = p.get("slug") or "?"
    body = p.get("body") or []
    text = full_text(p)
    issues: list[dict[str, Any]] = []

    for m in genie_re.finditer(text):
        start = max(0, m.start() - 100)
        end = min(len(text), m.end() + 100)
        ctx = text[start:end].replace("\n", " | ")
        window = text[max(0, m.start() - 250) : min(len(text), m.end() + 250)]
        is_hist = bool(historical_context.search(window))
        issues.append(
            {
                "type": "genie_historical" if is_hist else "genie_current_suspect",
                "match": m.group(),
                "ctx": ctx,
            }
        )

    for m in express_as_ll.finditer(text):
        start = max(0, m.start() - 80)
        end = min(len(text), m.end() + 80)
        issues.append(
            {
                "type": "express_as_ll",
                "match": m.group(),
                "ctx": text[start:end].replace("\n", " "),
            }
        )

    for i, b in enumerate(body):
        if not isinstance(b, dict):
            continue
        if b.get("_type") != "block":
            continue
        children = b.get("children") or []
        if not isinstance(children, list):
            children = []

        if b.get("listItem") and len(children) >= 3:
            desc_count = 0
            for c in children:
                if not isinstance(c, dict):
                    continue
                marks = c.get("marks") or []
                if isinstance(marks, list) and "description" in marks:
                    desc_count += 1
            if desc_count >= 2 or (len(children) >= 5 and desc_count >= 1):
                issues.append(
                    {
                        "type": "collapsed_list",
                        "block_idx": i,
                        "children": len(children),
                        "desc_marks": desc_count,
                        "text": block_text(b)[:140],
                    }
                )

        if not b.get("listItem") and (b.get("style") or "normal") == "normal":
            t = block_text(b)
            if t.count(" — ") >= 3 and len(t) > 200:
                issues.append(
                    {
                        "type": "possible_jammed_list_paragraph",
                        "block_idx": i,
                        "text": t[:160],
                    }
                )

        defs: set[str] = set()
        for d in b.get("markDefs") or []:
            if isinstance(d, dict) and d.get("_key"):
                defs.add(str(d["_key"]))
        for c in children:
            if not isinstance(c, dict):
                continue
            marks = c.get("marks") or []
            if not isinstance(marks, list):
                continue
            for mk in marks:
                if not isinstance(mk, str):
                    continue
                if mk not in KNOWN_MARKS and mk not in defs:
                    issues.append(
                        {
                            "type": "broken_mark",
                            "block_idx": i,
                            "mark": mk,
                            "text": (c.get("text") or "")[:60],
                        }
                    )

    missing_level = 0
    for b in body:
        if isinstance(b, dict) and b.get("listItem") and b.get("level") is None:
            missing_level += 1
    if missing_level:
        issues.append({"type": "missing_list_level", "count": missing_level})

    texts: list[tuple[str, str]] = []
    for b in body:
        if not isinstance(b, dict) or b.get("_type") != "block":
            continue
        style = "list" if b.get("listItem") else (b.get("style") or "normal")
        texts.append((style, block_text(b)))

    for i, (style, t) in enumerate(texts):
        if style in HEADINGS and not t.strip():
            issues.append({"type": "empty_heading", "idx": i})
        next_boundary = (
            i + 1 >= len(texts)
            or texts[i + 1][0] in HEADINGS
            or not texts[i + 1][1].strip()
        )
        if t.strip().endswith(":") and next_boundary:
            if re.search(r"(?i)here'?s|strategy|checklist|as follows|the following", t):
                issues.append({"type": "cliffhanger", "text": t[:100]})

    height_map: dict[str, set[int]] = defaultdict(set)
    height_samples: dict[str, list[str]] = defaultdict(list)
    for m in re.finditer(
        r"((?:[A-Z][A-Za-z'’&\-]+(?:\s+[A-Za-z'’&\-/]+){0,6}))\s*[—–-]\s*(\d{2})\s*(?:inches|inch|in\b)",
        text,
    ):
        ride = re.sub(r"\s+", " ", m.group(1)).strip()
        h = int(m.group(2))
        key = ride.lower()
        height_map[key].add(h)
        if len(height_samples[key]) < 4:
            height_samples[key].append(m.group(0)[:90])
    for ride, hs in height_map.items():
        if len(hs) > 1:
            issues.append(
                {
                    "type": "height_conflict",
                    "ride": ride,
                    "heights": sorted(hs),
                    "samples": height_samples[ride],
                }
            )

    for m in re.finditer(r"FastPass\+?", text, re.I):
        window = text[max(0, m.start() - 120) : min(len(text), m.end() + 120)].replace(
            "\n", " "
        )
        issues.append({"type": "fastpass_mention", "ctx": window})

    ex = p.get("excerpt") or ""
    if genie_re.search(ex):
        issues.append({"type": "genie_in_excerpt", "text": ex[:200]})

    return {
        "slug": slug,
        "title": p.get("title"),
        "id": p.get("_id"),
        "updated": p.get("_updatedAt"),
        "blocks": len(body),
        "chars": len(text),
        "ll": len(ll_re.findall(text)),
        "multi": len(re.findall(r"Multi Pass", text, re.I)),
        "single": len(re.findall(r"Single Pass", text, re.I)),
        "express": len(
            re.findall(r"Universal Express|Express Pass|Express Unlimited", text, re.I)
        ),
        "issues": issues,
        "excerpt": ex[:160],
    }


def main() -> int:
    try:
        posts = fetch_posts()
    except Exception:
        traceback.print_exc()
        return 2

    print(f"Fetched {len(posts)} posts\n")
    results = []
    for p in posts:
        try:
            results.append(analyze(p))
        except Exception as exc:
            print(f"ERROR on {p.get('slug')}: {exc}")
            traceback.print_exc()
            results.append(
                {
                    "slug": p.get("slug"),
                    "title": p.get("title"),
                    "id": p.get("_id"),
                    "issues": [{"type": "scan_error", "error": str(exc)}],
                    "blocks": 0,
                    "chars": 0,
                    "ll": 0,
                    "multi": 0,
                    "single": 0,
                    "express": 0,
                    "excerpt": "",
                    "updated": p.get("_updatedAt"),
                }
            )

    for r in results:
        crit = [i for i in r["issues"] if i.get("type") in CRIT]
        warn = [i for i in r["issues"] if i.get("type") not in CRIT]
        status = "FAIL" if crit else ("WARN" if warn else "PASS")
        print(f"=== {status} {r['slug']} ===")
        print(f"  title: {r.get('title')}")
        print(
            f"  blocks={r.get('blocks')} chars={r.get('chars')} "
            f"LL={r.get('ll')} Multi={r.get('multi')} Single={r.get('single')} "
            f"Express={r.get('express')}"
        )
        print(f"  updated={r.get('updated')}")
        print(f"  excerpt: {(r.get('excerpt') or '')[:120]}")
        for i in r["issues"]:
            print(f"  ! {json.dumps(i, ensure_ascii=False)[:400]}")
        if not r["issues"]:
            print("  (no scan issues)")
        print()

    print("=" * 60)
    print("SCORECARD")
    for r in results:
        crit = [i for i in r["issues"] if i.get("type") in CRIT]
        warn = [i for i in r["issues"] if i.get("type") not in CRIT]
        st = "FAIL" if crit else ("WARN" if warn else "PASS")
        print(f"{st:4}  {r['slug']}")

    with open("/tmp/pyp-qa-scan.json", "w") as f:
        json.dump(results, f, indent=2)

    high_risk = [
        "disney-world-guide",
        "best-time-visit-disney-world-2026",
        "beat-disney-world-crowds",
        "epic-universe-tickets-guide",
        "universal-orlando-height-requirements",
        "best-magic-kingdom-rides-kids-under-40-inches",
        "disney-world-packing-list",
        "universal-orlando-summer-2026",
    ]
    bodies = {}
    for p in posts:
        if p.get("slug") in high_risk:
            bodies[p["slug"]] = {
                "title": p.get("title"),
                "id": p.get("_id"),
                "blocks": [
                    {
                        "style": b.get("style"),
                        "listItem": b.get("listItem"),
                        "level": b.get("level"),
                        "text": block_text(b)[:600],
                        "nchildren": len(b.get("children") or []),
                        "marks": sorted(
                            {
                                m
                                for c in (b.get("children") or [])
                                if isinstance(c, dict)
                                for m in (c.get("marks") or [])
                                if isinstance(m, str)
                            }
                        ),
                    }
                    for b in (p.get("body") or [])
                    if isinstance(b, dict) and b.get("_type") == "block"
                ],
            }
    with open("/tmp/pyp-highrisk-bodies.json", "w") as f:
        json.dump(bodies, f, indent=2)

    print("\nALL GENIE CONTEXTS:")
    for r in results:
        for i in r["issues"]:
            if "genie" in str(i.get("type")):
                print(f"  [{r['slug']}] {i['type']}: {i.get('ctx', i.get('text', ''))[:220]}")

    print("\nALL EXPRESS_AS_LL:")
    for r in results:
        for i in r["issues"]:
            if i.get("type") == "express_as_ll":
                print(f"  [{r['slug']}] {i.get('ctx', '')[:250]}")

    print("\nALL COLLAPSED:")
    for r in results:
        for i in r["issues"]:
            if i.get("type") == "collapsed_list":
                print(f"  [{r['slug']}] {i}")

    print("\nALL HEIGHT CONFLICTS:")
    for r in results:
        for i in r["issues"]:
            if i.get("type") == "height_conflict":
                print(f"  [{r['slug']}] {i}")

    print("\nALL MISSING LEVEL / JAMMED / FASTPASS / BROKEN:")
    for r in results:
        for i in r["issues"]:
            if i.get("type") in {
                "missing_list_level",
                "possible_jammed_list_paragraph",
                "fastpass_mention",
                "broken_mark",
                "cliffhanger",
                "empty_heading",
            }:
                print(f"  [{r['slug']}] {i.get('type')}: {json.dumps(i, ensure_ascii=False)[:250]}")

    print("DONE")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
