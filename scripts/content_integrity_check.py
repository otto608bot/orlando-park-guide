#!/usr/bin/env python3
"""
Flag incomplete Sanity blog bodies before publish/rebuild.

Detects:
  - empty / very short bodies
  - sections that end after a colon cliffhanger (e.g. "Here's the strategy:")
  - mid-clause endings (and/or/the/to...)
  - empty headings
  - heading with no body before next same-or-higher heading
  - blocks that look mid-sentence truncated

Uses the public Sanity query API (read-only). No token required for published docs.

Usage:
  python3 scripts/content_integrity_check.py
  python3 scripts/content_integrity_check.py --slug epic-universe-1-day-plan
  python3 scripts/content_integrity_check.py --json
  python3 scripts/content_integrity_check.py --min-chars 800
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.parse
import urllib.request
from typing import Any

PROJECT_ID = "hd7qwtcq"
DATASET = "production"
API_VERSION = "2024-01-01"

CLIFFHANGER_RE = re.compile(
    r"(?i)\b("
    r"here'?s the (optimal )?strategy|"
    r"here'?s what|"
    r"here'?s how|"
    r"sample schedule|"
    r"priority (ride )?list|"
    r"the key decisions are"
    r")\s*:?\s*$"
)
MID_CLAUSE_RE = re.compile(
    r"(?i)\b(and|or|the|to|for|with|a|an|of|in|on|at|by|from|as|is|are|was|were|be|been|being)\s*$"
)
TERMINAL_PUNCT_RE = re.compile(r'[.!?…]["\')\]]*\s*$')
HEADING_STYLES = {"h1", "h2", "h3", "h4"}
HEADING_RANK = {"h1": 1, "h2": 2, "h3": 3, "h4": 4}


def fetch_posts(slug: str | None = None) -> list[dict[str, Any]]:
    if slug:
        query = f'''
        *[_type == "blogPost" && slug.current == $slug] {{
          title,
          "slug": slug.current,
          excerpt,
          body[]{{ _type, style, listItem, level, children[]{{text}} }},
          _updatedAt,
          publishedAt
        }}
        '''
        params = f"&$slug={urllib.parse.quote(json.dumps(slug))}"
    else:
        query = '''
        *[_type == "blogPost"] | order(coalesce(publishedAt, _updatedAt) desc) {
          title,
          "slug": slug.current,
          excerpt,
          body[]{ _type, style, listItem, level, children[]{text} },
          _updatedAt,
          publishedAt
        }
        '''
        params = ""

    url = (
        f"https://{PROJECT_ID}.api.sanity.io/v{API_VERSION}/data/query/{DATASET}"
        f"?query={urllib.parse.quote(query)}{params}"
    )
    req = urllib.request.Request(url, headers={"User-Agent": "PYP-content-integrity/1.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        payload = json.loads(resp.read().decode("utf-8"))
    result = payload.get("result") or []
    if isinstance(result, dict):
        return [result]
    return result


def block_text(block: dict[str, Any] | None) -> str:
    if not block or block.get("_type") != "block":
        return ""
    return "".join((c.get("text") or "") for c in (block.get("children") or [])).strip()


def normalize_style(block: dict[str, Any]) -> str:
    if block.get("listItem"):
        return "list"
    return block.get("style") or "normal"


def analyze_post(post: dict[str, Any], min_chars: int) -> dict[str, Any]:
    body = post.get("body") or []
    flags: list[str] = []
    details: list[str] = []

    texts: list[tuple[str, str]] = []
    for i, block in enumerate(body):
        if block.get("_type") != "block":
            continue
        style = normalize_style(block)
        text = block_text(block)
        texts.append((style, text))
        if style in HEADING_STYLES and not text:
            flags.append("empty-heading")
            details.append(f"empty-heading @ block {i}")

    content_parts = [t for s, t in texts if t and s not in HEADING_STYLES]
    full = " ".join(t for _, t in texts if t).strip()
    body_chars = len(full)

    if not body:
        flags.append("empty-body")
    elif body_chars < min_chars:
        flags.append("short-body")
        details.append(f"short-body: {body_chars} chars (min {min_chars})")

    if full.endswith(":"):
        flags.append("ends-with-colon")
        details.append(f"body ends with colon: …{full[-80:]}")

    if full and MID_CLAUSE_RE.search(full):
        flags.append("ends-mid-clause")
        details.append(f"body ends mid-clause: …{full[-80:]}")

    if full and CLIFFHANGER_RE.search(full):
        flags.append("ends-on-cliffhanger-phrase")
        details.append(f"cliffhanger phrase at end: …{full[-100:]}")

    # Section completeness: heading must have content before next same-or-higher heading
    for i, (style, text) in enumerate(texts):
        if style not in HEADING_STYLES:
            continue
        rank = HEADING_RANK[style]
        j = i + 1
        has_content = False
        while j < len(texts):
            s2, t2 = texts[j]
            if s2 in HEADING_STYLES and HEADING_RANK[s2] <= rank:
                break
            if t2 and s2 not in HEADING_STYLES:
                has_content = True
                break
            # subheading counts as structure, still need eventual content under tree
            if s2 in HEADING_STYLES and HEADING_RANK[s2] > rank:
                # look ahead under subheading handled by that heading's own check
                has_content = True  # presence of structured subheads is OK
                break
            j += 1
        if not has_content:
            flags.append("empty-section")
            details.append(f"empty-section after {style}: {text[:60]!r}")

    # Cliffhanger intro: normal block ending with ":" immediately before next heading / EOF
    # Skip intentional short labels and complete sentences that merely use a colon mid-thought
    # only if the tail looks like a promise of a list that never arrives as body content.
    for i, (style, text) in enumerate(texts):
        if style in HEADING_STYLES or not text:
            continue
        next_is_heading = i + 1 < len(texts) and texts[i + 1][0] in HEADING_STYLES
        next_is_eof = i + 1 >= len(texts)
        next_is_boundary = next_is_heading or next_is_eof
        if not next_is_boundary:
            continue

        promise = bool(CLIFFHANGER_RE.search(text)) or bool(
            re.search(r"(?i)\b(checklist|breakdown|as follows|the following)\s*:\s*$", text)
        )
        # "Here's how it works:" / "Here's the breakdown:" style
        promise = promise or bool(re.search(r"(?i)here'?s (how|the|what|your).{0,40}:\s*$", text))

        if promise:
            flags.append("section-cliffhanger")
            details.append(f"section-cliffhanger: {text[:100]!r}")
        elif text.endswith(":") and next_is_eof:
            flags.append("section-cliffhanger")
            details.append(f"section-cliffhanger(eof): {text[:100]!r}")

        # mid-sentence fragment: short, no terminal punct, not a label-like line
        if (
            15 <= len(text) <= 90
            and not TERMINAL_PUNCT_RE.search(text)
            and not text.endswith(":")
            and not re.match(r"(?i)^(worth it if|probably not|location|dates|florida residents)\b", text)
            and " " in text
            and re.search(r"\b(the|and|or|to|for|with|a|an)\s+\w+$", text)
            and not re.search(r"\d", text)  # allow price/date fragments
        ):
            # only flag if ends mid-clause-ish
            if MID_CLAUSE_RE.search(text):
                flags.append("mid-sentence-fragment")
                details.append(f"mid-sentence-fragment: {text!r}")

    # unique flags preserve order
    seen = set()
    uniq_flags = []
    for f in flags:
        if f not in seen:
            seen.add(f)
            uniq_flags.append(f)

    severity = "ok"
    high = {"empty-body", "ends-with-colon", "ends-mid-clause", "ends-on-cliffhanger-phrase", "section-cliffhanger"}
    if uniq_flags:
        severity = "high" if any(f in high for f in uniq_flags) else "warn"

    return {
        "slug": post.get("slug"),
        "title": post.get("title"),
        "updatedAt": post.get("_updatedAt"),
        "bodyChars": body_chars,
        "blockCount": len(body),
        "severity": severity,
        "flags": uniq_flags,
        "details": details,
        "url": f"https://planyourpark.com/blog/{post.get('slug')}/" if post.get("slug") else None,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Sanity blog content integrity checker")
    parser.add_argument("--slug", help="Check a single slug")
    parser.add_argument("--json", action="store_true", help="JSON output")
    parser.add_argument("--min-chars", type=int, default=500, help="Minimum body chars (default 500)")
    parser.add_argument("--fail-on", choices=["never", "high", "any"], default="never",
                        help="Exit non-zero on issues (default never)")
    args = parser.parse_args()

    try:
        posts = fetch_posts(args.slug)
    except Exception as exc:
        print(f"ERROR fetching Sanity posts: {exc}", file=sys.stderr)
        return 2

    if not posts:
        print("No posts found.", file=sys.stderr)
        return 1

    reports = [analyze_post(p, args.min_chars) for p in posts]
    issues = [r for r in reports if r["flags"]]
    high = [r for r in issues if r["severity"] == "high"]

    if args.json:
        print(json.dumps({
            "checked": len(reports),
            "issues": len(issues),
            "high": len(high),
            "posts": reports,
        }, indent=2))
    else:
        print(f"Content integrity — {len(reports)} post(s) checked")
        print(f"  Issues: {len(issues)}  |  High: {len(high)}")
        print()
        if not issues:
            print("OK — no cliffhangers / empty bodies / mid-clause endings flagged.")
        for r in reports:
            if not r["flags"] and not args.slug:
                continue
            mark = {"ok": "OK", "warn": "WARN", "high": "HIGH"}[r["severity"]]
            print(f"[{mark}] {r['slug']}  ({r['bodyChars']} chars, {r['blockCount']} blocks)")
            if r["url"]:
                print(f"  {r['url']}")
            for f in r["flags"]:
                print(f"  - {f}")
            for d in r["details"][:8]:
                print(f"    · {d}")
            if len(r["details"]) > 8:
                print(f"    · … +{len(r['details']) - 8} more")
            print()

        ok_count = len(reports) - len(issues)
        if issues and not args.slug:
            print(f"Clean: {ok_count}  |  Review: {len(issues)}")

    if args.fail_on == "high" and high:
        return 1
    if args.fail_on == "any" and issues:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
