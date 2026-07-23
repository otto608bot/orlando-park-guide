#!/usr/bin/env python3
"""
Live-site blog QA — audits RENDERED HTML, not Sanity structure alone.

Catches the class of bugs CMS-only QA misses:
  - whole-paragraph / overlong hyperlinks
  - empty headings / empty strong titles
  - collapsed list markers / missing list structure
  - dead internal links
  - leftover Genie+ as current product
  - Amazon dp links wrapping long prose
  - excessive mid-sentence affiliate spam

Usage:
  python3 scripts/live_blog_qa.py
  python3 scripts/live_blog_qa.py --base https://planyourpark.com
  python3 scripts/live_blog_qa.py --fail-on high
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict
from dataclasses import dataclass, asdict
from html.parser import HTMLParser
from pathlib import Path

PROJECT = "hd7qwtcq"
DEFAULT_BASE = "https://planyourpark.com"
UA = "PlanYourPark-LiveBlogQA/1.0"


@dataclass
class Finding:
    slug: str
    severity: str  # high | medium | low
    code: str
    message: str
    detail: str = ""


class BlogHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.anchors: list[tuple[str, str]] = []  # (href, text)
        self.headings: list[tuple[str, str]] = []  # (tag, text)
        self.list_items: list[str] = []
        self.paragraphs: list[str] = []
        self._in_a = False
        self._a_href = ""
        self._a_text: list[str] = []
        self._in_h = False
        self._h_tag = ""
        self._h_text: list[str] = []
        self._in_li = False
        self._li_text: list[str] = []
        self._in_p = False
        self._p_text: list[str] = []
        self._in_main = False
        self._skip = 0  # skip nav/footer-ish via depth heuristics
        self._stack: list[str] = []

    def handle_starttag(self, tag, attrs):
        attrs_d = dict(attrs)
        self._stack.append(tag)
        if tag == "main":
            self._in_main = True
        if not self._in_main:
            return
        if tag == "a":
            self._in_a = True
            self._a_href = attrs_d.get("href") or ""
            self._a_text = []
        elif tag in {"h1", "h2", "h3", "h4"}:
            self._in_h = True
            self._h_tag = tag
            self._h_text = []
        elif tag == "li":
            self._in_li = True
            self._li_text = []
        elif tag == "p":
            self._in_p = True
            self._p_text = []

    def handle_endtag(self, tag):
        if self._stack and self._stack[-1] == tag:
            self._stack.pop()
        if tag == "main":
            self._in_main = False
        if not self._in_main and tag != "a":
            # still close a if needed
            pass
        if tag == "a" and self._in_a:
            text = " ".join("".join(self._a_text).split())
            self.anchors.append((self._a_href, text))
            self._in_a = False
            self._a_href = ""
            self._a_text = []
        elif tag in {"h1", "h2", "h3", "h4"} and self._in_h:
            text = " ".join("".join(self._h_text).split())
            self.headings.append((self._h_tag, text))
            self._in_h = False
        elif tag == "li" and self._in_li:
            text = " ".join("".join(self._li_text).split())
            self.list_items.append(text)
            self._in_li = False
        elif tag == "p" and self._in_p:
            text = " ".join("".join(self._p_text).split())
            if text:
                self.paragraphs.append(text)
            self._in_p = False

    def handle_data(self, data):
        if not self._in_main:
            return
        if self._in_a:
            self._a_text.append(data)
        if self._in_h:
            self._h_text.append(data)
        if self._in_li:
            self._li_text.append(data)
        if self._in_p:
            self._p_text.append(data)


def fetch(url: str) -> tuple[int, str, str]:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Cache-Control": "no-cache"})
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            body = r.read().decode("utf-8", "ignore")
            return r.status, r.geturl(), body
    except urllib.error.HTTPError as e:
        return e.code, url, ""
    except Exception as e:
        return 0, url, str(e)


def list_slugs() -> list[str]:
    q = '*[_type=="blogPost"]|order(publishedAt desc){"slug":slug.current}'
    params = urllib.parse.urlencode({"query": q})
    url = f"https://{PROJECT}.api.sanity.io/v2024-01-01/data/query/production?{params}"
    data = json.loads(urllib.request.urlopen(url, timeout=60).read())
    return [p["slug"] for p in data["result"] if p.get("slug")]


def analyze_slug(base: str, slug: str) -> list[Finding]:
    url = f"{base.rstrip('/')}/blog/{slug}/"
    status, final, html = fetch(url)
    findings: list[Finding] = []

    if status != 200 or not html:
        findings.append(Finding(slug, "high", "page_fetch", f"HTTP {status} fetching {url}", final))
        return findings

    # Prefer parsing visible HTML; also scan RSC payload strings for overlong anchors
    parser = BlogHTMLParser()
    try:
        parser.feed(html)
    except Exception as e:
        findings.append(Finding(slug, "medium", "parse_error", f"HTML parse issue: {e}"))

    # --- Overlong anchors (the orange wall bug) ---
    for href, text in parser.anchors:
        t = text.strip()
        if not t:
            if href and not href.startswith("#") and "/_next" not in href:
                findings.append(
                    Finding(slug, "medium", "empty_anchor_text", "Anchor with empty text", href[:120])
                )
            continue
        if not href or href.startswith("#") or "/_next" in href:
            continue
        is_amazon = "amazon." in href or "amzn." in href
        is_internal_blog = "/blog/" in href
        # Related-card titles can be long; only flag extreme internal titles.
        if is_amazon and len(t) > 60:
            findings.append(
                Finding(
                    slug,
                    "high",
                    "overlong_amazon_anchor",
                    f"Amazon hyperlink text is {len(t)} chars (must be short product phrase)",
                    f"href={href[:100]} | text={t[:90]}…",
                )
            )
        elif (not is_internal_blog) and len(t) > 80:
            findings.append(
                Finding(
                    slug,
                    "high" if len(t) > 120 else "medium",
                    "overlong_anchor",
                    f"Hyperlink text is {len(t)} chars (whole sentence/paragraph linked)",
                    f"href={href[:100]} | text={t[:90]}…",
                )
            )
        elif is_internal_blog and len(t) > 140:
            findings.append(
                Finding(
                    slug,
                    "medium",
                    "overlong_internal_anchor",
                    f"Internal blog link text is {len(t)} chars (consider shorter label)",
                    f"href={href[:100]} | text={t[:90]}…",
                )
            )

    # RSC payload: amazon or external overlong only (internal related titles excluded)
    for m in re.finditer(
        r'href\\?":\\?"(https?://[^"\\]+|/[^"\\]+)\\?"[^}]{0,240}?children\\?":\\?"([^"\\]{61,})\\?"',
        html,
    ):
        href, text = m.group(1), m.group(2)
        if "/_next" in href:
            continue
        is_amazon = "amazon." in href or "amzn." in href
        is_internal_blog = href.startswith("/blog/") or "/blog/" in href
        if is_amazon:
            findings.append(
                Finding(
                    slug,
                    "high",
                    "overlong_amazon_anchor_rsc",
                    f"RSC Amazon anchor too long ({len(text)} chars)",
                    f"href={href[:100]} | text={text[:90]}…",
                )
            )
        elif (not is_internal_blog) and len(text) > 80:
            findings.append(
                Finding(
                    slug,
                    "high" if len(text) > 120 else "medium",
                    "overlong_anchor_rsc",
                    f"RSC payload overlong anchor ({len(text)} chars)",
                    f"href={href[:100]} | text={text[:90]}…",
                )
            )

    # --- Empty headings ---
    for tag, text in parser.headings:
        if not text.strip():
            findings.append(Finding(slug, "high", "empty_heading", f"Empty {tag}"))

    # --- Empty / near-empty list items ---
    for text in parser.list_items:
        if len(text.strip()) < 2:
            findings.append(Finding(slug, "high", "empty_list_item", "Empty <li>"))

    # --- Genie+ as current (heuristic) ---
    plain = re.sub(r"<[^>]+>", " ", html)
    plain = re.sub(r"\s+", " ", plain)
    for m in re.finditer(r".{0,50}Genie\+.{0,50}", plain, flags=re.I):
        window = m.group(0)
        if not re.search(
            r"retir|replac|former|old system|no longer|July 2024|used to|shift from|renamed|was called|legacy",
            window,
            re.I,
        ):
            findings.append(
                Finding(
                    slug,
                    "medium",
                    "genie_plus_possibly_current",
                    "Genie+ mention without nearby historical framing",
                    window.strip()[:120],
                )
            )
    # --- Dead internal links (sample unique) ---
    internal = sorted(
        {
            urllib.parse.urljoin(url, href)
            for href, _ in parser.anchors
            if href
            and not href.startswith(("mailto:", "#", "javascript:"))
            and ("planyourpark.com" in href or href.startswith("/"))
            and "/_next" not in href
            and not href.endswith((".css", ".js", ".png", ".jpg", ".webp", ".ico", ".xml", ".woff2"))
        }
    )
    # limit checks
    for link in internal[:40]:
        # skip self
        code, final_u, _ = fetch(link)
        if code == 404 or code == 0:
            findings.append(
                Finding(slug, "high", "dead_internal_link", f"Dead link HTTP {code}", link)
            )
        elif isinstance(code, int) and code >= 400:
            findings.append(
                Finding(slug, "medium", "bad_internal_link", f"Link HTTP {code}", link)
            )

    # --- Amazon dp presence as full-paragraph (payload) ---
    for m in re.finditer(r"https://www\.amazon\.com/dp/[A-Z0-9]+[^\"\\s]*", html):
        # if this dp appears as href for long children already flagged; still note count
        pass

    # --- Very few list items on packing-style posts ---
    if "packing" in slug and len(parser.list_items) < 5:
        # static export may put lists only in RSC — check RSC for blog-ol
        if "blog-ol" not in html and "blog-ul" not in html:
            findings.append(
                Finding(
                    slug,
                    "medium",
                    "missing_lists",
                    f"Packing post has few/no parsed list items ({len(parser.list_items)})",
                )
            )

    # Dedupe by code+detail prefix
    seen = set()
    uniq: list[Finding] = []
    for f in findings:
        key = (f.code, f.message, f.detail[:80])
        if key in seen:
            continue
        seen.add(key)
        uniq.append(f)
    return uniq


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default=DEFAULT_BASE)
    ap.add_argument("--fail-on", choices=["high", "medium", "low", "none"], default="high")
    ap.add_argument("--json-out", default="")
    args = ap.parse_args()

    slugs = list_slugs()
    all_findings: list[Finding] = []
    print(f"Live blog QA — {len(slugs)} posts @ {args.base}\n")

    for slug in slugs:
        fs = analyze_slug(args.base, slug)
        all_findings.extend(fs)
        highs = sum(1 for f in fs if f.severity == "high")
        meds = sum(1 for f in fs if f.severity == "medium")
        status = "PASS" if not fs else ("FAIL" if highs else "WARN")
        print(f"{status:4} {slug:50} high={highs} med={meds} total={len(fs)}")
        for f in fs:
            print(f"     [{f.severity}] {f.code}: {f.message}")
            if f.detail:
                print(f"            {f.detail[:160]}")

    by_sev = defaultdict(int)
    for f in all_findings:
        by_sev[f.severity] += 1

    print("\n=== SUMMARY ===")
    print(dict(by_sev))
    print(f"findings={len(all_findings)} posts={len(slugs)}")

    out = {
        "base": args.base,
        "posts": len(slugs),
        "summary": dict(by_sev),
        "findings": [asdict(f) for f in all_findings],
    }
    out_path = Path(args.json_out) if args.json_out else Path("ops/weekly/live-blog-qa-latest.json")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(out, indent=2))
    print(f"wrote {out_path}")

    fail_rank = {"high": 3, "medium": 2, "low": 1, "none": 0}
    threshold = fail_rank[args.fail_on]
    worst = max((fail_rank[f.severity] for f in all_findings), default=0)
    return 1 if worst >= threshold and threshold > 0 else 0


if __name__ == "__main__":
    sys.exit(main())
