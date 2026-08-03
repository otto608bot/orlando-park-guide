#!/usr/bin/env python3
"""
Post-deploy smoke checks for Plan Your Park utility SEO + conversion pack.

Usage:
  python3 scripts/post_deploy_smoke.py
  python3 scripts/post_deploy_smoke.py --base https://planyourpark.com
  python3 scripts/post_deploy_smoke.py --local-out web/out
  python3 scripts/post_deploy_smoke.py --fail-on high

Exit 0 when no findings at/above --fail-on; else 1.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Optional

DEFAULT_BASE = "https://planyourpark.com"
UA = "PlanYourPark-PostDeploySmoke/1.0"
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "ops" / "weekly" / "post-deploy-smoke-latest.json"
REDIRECTS_FILE = ROOT / "web" / "public" / "_redirects"

# (path, expect_final_path_suffix or None, expect_status)
REDIRECTS = [
    ("/epic-universe", "/parks/epic-universe", 301),
    ("/epic-universe/", "/parks/epic-universe", 301),
    ("/parks/epic", "/parks/epic-universe", 301),
    ("/parks/epic/", "/parks/epic-universe", 301),
    ("/universal", "/parks/universal-studios-florida", 301),
    ("/universal/", "/parks/universal-studios-florida", 301),
    ("/disney", "/parks", 301),
    ("/disney-world", "/parks", 301),
    ("/hs", "/parks/hollywood-studios", 301),
    ("/hollywood", "/parks/hollywood-studios", 301),
    ("/parks/hollywood", "/parks/hollywood-studios", 301),
    ("/mk", "/parks/magic-kingdom", 301),
    ("/parks/mk", "/parks/magic-kingdom", 301),
    ("/ak", "/parks/animal-kingdom", 301),
    ("/parks/ak", "/parks/animal-kingdom", 301),
    ("/ioa", "/parks/islands-of-adventure", 301),
    ("/blog/epic", "/blog/epic-universe-1-day-plan", 301),
    ("/blog/packing", "/blog/disney-world-packing-list-kids", 301),
    ("/blog/heights", "/blog/universal-orlando-height-requirements", 301),
    ("/blog/mk-under-40", "/blog/best-magic-kingdom-rides-kids-under-40-inches", 301),
    ("/blog/epic-1-day", "/blog/epic-universe-1-day-plan", 301),
    ("/blog/tickets-epic", "/blog/epic-universe-tickets-guide", 301),
]

# path -> substring that must appear in <title>
# Empty string = skip title needle (body-only paths still checked via BODY_MUST_CONTAIN).
TITLE_MUST_CONTAIN = {
    "/parks/magic-kingdom/": "Magic Kingdom with Kids",
    "/parks/epic-universe/": "Epic Universe with Kids",
    "/parks/epcot/": "EPCOT with Kids",
    "/blog/": "Families",  # staged blog hub is family-oriented
    "/deals/": "Ticket Deals for Families",
    "/character-dining/": "Character Dining with Kids",
    "/rides/": "Ride Finder",
    "/": "Ride Finder",
    "/parks/": "All Parks in Orlando",
    "/blog/epic-universe-1-day-plan/": "Epic Universe",
}

BODY_MUST_CONTAIN = {
    "/": ["Organization", "WebSite", "application/ld+json"],
    "/parks/": [
        "FAQPage",
        "ItemList",
        "CollectionPage",
        "How do I know which rides my kids can ride",
        "application/ld+json",
    ],
    "/rides/": [
        "CollectionPage",
        "ItemList",
        "Shareable ride height presets",
        "application/ld+json",
    ],
    "/blog/epic-universe-1-day-plan/": [
        "BlogPosting",
        "logo-full.png",
        "BreadcrumbList",
        "application/ld+json",
    ],
    "/deals/": ["affiliate-disclosure", "commission"],
    "/parks/magic-kingdom/": [
        "Will my kid be tall enough",
        "height=40",
        "TouristAttraction",
        "FAQPage",
    ],
    "/parks/epic-universe/": [
        "Will my kid be tall enough",
        "epic-universe-1-day-plan",
        "TouristAttraction",
    ],
    "/404-test-path-that-should-404": [],  # handled separately
}


@dataclass
class Finding:
    severity: str  # high | medium | low
    code: str
    message: str
    detail: str = ""


def fetch(
    url: str, *, follow: bool = True, timeout: int = 25
) -> tuple[int, str, str, dict[str, str]]:
    """Return status, final_url, body, headers (lower-case keys)."""
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        if follow:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                body = resp.read().decode("utf-8", "replace")
                headers = {k.lower(): v for k, v in resp.headers.items()}
                return resp.status, resp.geturl(), body, headers
        opener = urllib.request.build_opener(NoRedirect)
        with opener.open(req, timeout=timeout) as resp:
            body = resp.read().decode("utf-8", "replace")
            headers = {k.lower(): v for k, v in resp.headers.items()}
            return resp.status, resp.geturl(), body, headers
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace") if e.fp else ""
        headers = {k.lower(): v for k, v in (e.headers.items() if e.headers else [])}
        # HTTPError.geturl() exists on some versions
        final = getattr(e, "url", url) or url
        return e.code, final, body, headers
    except Exception as e:  # noqa: BLE001
        raise RuntimeError(f"fetch failed {url}: {e}") from e


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):  # noqa: ANN001
        return None


def title_of(html: str) -> str:
    m = re.search(r"<title>([^<]+)</title>", html, re.I)
    if not m:
        return ""
    # decode a few common entities
    t = m.group(1)
    t = t.replace("&amp;", "&").replace("&#x27;", "'").replace("&quot;", '"')
    return t


def robots_of(html: str) -> str:
    m = re.search(r'name=["\']robots["\']\s+content=["\']([^"\']+)["\']', html, re.I)
    return (m.group(1) if m else "").lower()


def local_html_path(out_dir: Path, url_path: str) -> Path:
    """Map a site path to static export HTML under out/."""
    p = url_path.split("?", 1)[0]
    if not p.startswith("/"):
        p = "/" + p
    if p == "/":
        return out_dir / "index.html"
    # strip trailing slash for directory index
    stripped = p.rstrip("/")
    candidate_dir = out_dir / stripped.lstrip("/")
    index = candidate_dir / "index.html"
    if index.is_file():
        return index
    html_file = out_dir / f"{stripped.lstrip('/')}.html"
    return html_file


def read_local(out_dir: Path, url_path: str) -> tuple[int, str, str]:
    path = local_html_path(out_dir, url_path)
    if not path.is_file():
        return 404, str(path), ""
    return 200, str(path), path.read_text(encoding="utf-8", errors="replace")


def check_redirects(base: str) -> list[Finding]:
    findings: list[Finding] = []
    for path, expect_suffix, expect_status in REDIRECTS:
        url = base.rstrip("/") + path
        try:
            status, final, _body, headers = fetch(url, follow=False)
        except RuntimeError as e:
            findings.append(
                Finding("high", "redirect_fetch", f"Could not fetch {path}", str(e))
            )
            continue
        loc = headers.get("location", "")
        # Some stacks return 308; accept 301/302/307/308 for "redirect happened"
        if status not in (301, 302, 307, 308, expect_status):
            # If Netlify already collapsed or Next handled, follow and check final
            try:
                st2, final2, _, _ = fetch(url, follow=True)
            except RuntimeError as e:
                findings.append(
                    Finding(
                        "high",
                        "redirect_status",
                        f"{path} expected redirect ~{expect_status}, got {status}",
                        str(e),
                    )
                )
                continue
            if expect_suffix and expect_suffix not in final2:
                findings.append(
                    Finding(
                        "high",
                        "redirect_target",
                        f"{path} did not land on *{expect_suffix}*",
                        f"status={status}/{st2} final={final2} loc={loc}",
                    )
                )
            continue
        target = loc or final
        if expect_suffix and expect_suffix not in target:
            # follow once more
            try:
                _, final2, _, _ = fetch(url, follow=True)
            except RuntimeError:
                final2 = target
            if expect_suffix not in final2 and expect_suffix not in target:
                findings.append(
                    Finding(
                        "high",
                        "redirect_target",
                        f"{path} redirect target missing {expect_suffix}",
                        f"status={status} location={loc} final={final2}",
                    )
                )
    return findings


def check_redirects_file() -> list[Finding]:
    """Pre-deploy: ensure Netlify _redirects declares the short aliases."""
    findings: list[Finding] = []
    if not REDIRECTS_FILE.is_file():
        return [
            Finding(
                "high",
                "redirects_missing",
                "web/public/_redirects not found",
                str(REDIRECTS_FILE),
            )
        ]
    text = REDIRECTS_FILE.read_text(encoding="utf-8", errors="replace")
    for path, expect_suffix, _status in REDIRECTS:
        # lines look like: /epic-universe /parks/epic-universe 301
        pattern = re.compile(
            rf"^{re.escape(path.rstrip('/'))}/?\s+{re.escape(expect_suffix.rstrip('/'))}/?\s+30[18]\b",
            re.M,
        )
        if not pattern.search(text):
            findings.append(
                Finding(
                    "high",
                    "redirects_rule",
                    f"_redirects missing rule {path} → {expect_suffix}",
                    "",
                )
            )
    return findings


def check_titles_and_bodies(
    *, base: Optional[str] = None, out_dir: Optional[Path] = None
) -> list[Finding]:
    findings: list[Finding] = []
    for path, needle in TITLE_MUST_CONTAIN.items():
        try:
            if out_dir is not None:
                status, final, body = read_local(out_dir, path)
            else:
                assert base is not None
                url = base.rstrip("/") + path
                status, final, body, _ = fetch(url, follow=True)
        except RuntimeError as e:
            findings.append(Finding("high", "page_fetch", f"Could not fetch {path}", str(e)))
            continue
        if status != 200:
            findings.append(
                Finding("high", "page_status", f"{path} expected 200, got {status}", final)
            )
            continue
        title = title_of(body)
        if needle.lower() not in title.lower():
            findings.append(
                Finding(
                    "high",
                    "title_missing",
                    f"{path} title missing “{needle}”",
                    f"title={title!r}",
                )
            )
        for bneedle in BODY_MUST_CONTAIN.get(path, []):
            if bneedle.lower() not in body.lower():
                findings.append(
                    Finding(
                        "medium",
                        "body_missing",
                        f"{path} body missing “{bneedle}”",
                        "",
                    )
                )
    return findings


def check_404(*, base: Optional[str] = None, out_dir: Optional[Path] = None) -> list[Finding]:
    findings: list[Finding] = []
    if out_dir is not None:
        path = out_dir / "404.html"
        if not path.is_file():
            return [Finding("high", "404_fetch", "web/out/404.html missing", str(path))]
        body = path.read_text(encoding="utf-8", errors="replace")
        status = 404  # static export 404 page exists
    else:
        assert base is not None
        url = base.rstrip("/") + "/this-path-should-404-pyp-smoke"
        try:
            status, _final, body, _ = fetch(url, follow=True)
        except RuntimeError as e:
            return [Finding("high", "404_fetch", "Could not fetch deliberate 404 URL", str(e))]
        if status != 404:
            findings.append(
                Finding("medium", "404_status", f"Expected HTTP 404, got {status}", url)
            )
    robots = robots_of(body)
    if "noindex" not in robots:
        findings.append(
            Finding(
                "high",
                "404_indexable",
                "404 page missing robots noindex",
                f"robots={robots!r}",
            )
        )
    # recovery links
    for needle in ("/parks", "/rides", "/blog"):
        if needle not in body:
            findings.append(
                Finding(
                    "medium",
                    "404_recovery",
                    f"404 page missing recovery link to {needle}",
                    "",
                )
            )
    return findings


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--base", default=DEFAULT_BASE)
    ap.add_argument(
        "--local-out",
        default=None,
        help="Path to Next static export (e.g. web/out). Skips live redirects; checks _redirects + HTML.",
    )
    ap.add_argument(
        "--fail-on",
        choices=("high", "medium", "low", "none"),
        default="high",
        help="Exit non-zero if any finding at this severity or worse",
    )
    args = ap.parse_args()

    findings: list[Finding] = []
    label = args.base
    if args.local_out:
        out_dir = Path(args.local_out)
        if not out_dir.is_absolute():
            out_dir = (Path.cwd() / out_dir).resolve()
        if not out_dir.is_dir():
            print(f"local out dir missing: {out_dir}", file=sys.stderr)
            return 2
        label = f"local:{out_dir}"
        findings.extend(check_redirects_file())
        findings.extend(check_titles_and_bodies(out_dir=out_dir))
        findings.extend(check_404(out_dir=out_dir))
    else:
        findings.extend(check_redirects(args.base))
        findings.extend(check_titles_and_bodies(base=args.base))
        findings.extend(check_404(base=args.base))

    rank = {"high": 3, "medium": 2, "low": 1}
    findings.sort(key=lambda f: (-rank.get(f.severity, 0), f.code, f.message))

    payload = {
        "base": label,
        "findings": [asdict(f) for f in findings],
        "counts": {
            "high": sum(1 for f in findings if f.severity == "high"),
            "medium": sum(1 for f in findings if f.severity == "medium"),
            "low": sum(1 for f in findings if f.severity == "low"),
            "total": len(findings),
        },
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2) + "\n")

    print(f"Post-deploy smoke @ {label}")
    print(
        f"findings={payload['counts']['total']} "
        f"high={payload['counts']['high']} "
        f"med={payload['counts']['medium']} "
        f"low={payload['counts']['low']}"
    )
    for f in findings:
        print(f"  [{f.severity}] {f.code}: {f.message}" + (f" — {f.detail}" if f.detail else ""))
    print(f"wrote {OUT}")

    if args.fail_on == "none":
        return 0
    threshold = rank[args.fail_on]
    bad = [f for f in findings if rank.get(f.severity, 0) >= threshold]
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
