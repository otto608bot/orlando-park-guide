#!/usr/bin/env python3
"""Review Google Analytics 4 + Search Console for Plan Your Park.

Examples:
  python scripts/seo_analytics_review.py
  python scripts/seo_analytics_review.py --days 28
  python scripts/seo_analytics_review.py --section gsc
  python scripts/seo_analytics_review.py --section ga
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import date, timedelta
from pathlib import Path
from typing import Any

from google.analytics.admin_v1beta import AnalyticsAdminServiceClient
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    OrderBy,
    RunReportRequest,
)
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

ROOT = Path(__file__).resolve().parents[1]
TOKEN_PATH = ROOT / ".hermes" / "google_seo_token.json"
CONFIG_PATH = Path(__file__).with_name("seo_analytics_config.json")
SCOPES = [
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/webmasters.readonly",
]


def load_config() -> dict:
    return json.loads(CONFIG_PATH.read_text())


def save_config(cfg: dict) -> None:
    CONFIG_PATH.write_text(json.dumps(cfg, indent=2) + "\n")


def get_credentials() -> Credentials:
    if not TOKEN_PATH.exists():
        print(f"ERROR: Not authenticated. Run:\n  python scripts/seo_analytics_auth.py --auth-url")
        sys.exit(1)
    creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)
    if not creds.valid:
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())
            TOKEN_PATH.write_text(creds.to_json())
        else:
            print("ERROR: Token invalid. Re-run auth setup.")
            sys.exit(1)
    return creds


def discover_property_id(creds: Credentials, measurement_id: str, configured: str) -> str:
    if configured:
        return configured.replace("properties/", "")

    admin = AnalyticsAdminServiceClient(credentials=creds)
    for account in admin.list_account_summaries():
        for prop in account.property_summaries:
            property_name = prop.property  # properties/123
            try:
                streams = admin.list_data_streams(parent=property_name)
            except Exception:
                continue
            for stream in streams:
                web = getattr(stream, "web_stream_data", None)
                mid = getattr(web, "measurement_id", None) if web else None
                if mid == measurement_id:
                    return property_name.split("/")[-1]
    raise RuntimeError(
        f"Could not find a GA4 property with measurement ID {measurement_id}. "
        "Confirm this Google account can access the GA property, then pass --property-id."
    )


def print_section(title: str) -> None:
    print()
    print("=" * 72)
    print(title)
    print("=" * 72)


def fmt_num(value: Any) -> str:
    try:
        if isinstance(value, float) or (isinstance(value, str) and "." in value):
            return f"{float(value):,.2f}"
        return f"{int(float(value)):,}"
    except Exception:
        return str(value)


def review_ga(creds: Credentials, property_id: str, days: int) -> None:
    client = BetaAnalyticsDataClient(credentials=creds)
    end = date.today()
    start = end - timedelta(days=days)
    date_range = DateRange(start_date=start.isoformat(), end_date=end.isoformat())
    prop = f"properties/{property_id}"

    print_section(f"Google Analytics 4 — last {days} days ({start} → {end})")
    print(f"Property: {prop}")

    overview = client.run_report(
        RunReportRequest(
            property=prop,
            date_ranges=[date_range],
            metrics=[
                Metric(name="sessions"),
                Metric(name="totalUsers"),
                Metric(name="newUsers"),
                Metric(name="screenPageViews"),
                Metric(name="bounceRate"),
                Metric(name="averageSessionDuration"),
                Metric(name="engagementRate"),
            ],
        )
    )
    if overview.rows:
        row = overview.rows[0].metric_values
        labels = [
            "Sessions",
            "Users",
            "New users",
            "Page views",
            "Bounce rate",
            "Avg session duration (sec)",
            "Engagement rate",
        ]
        for label, cell in zip(labels, row):
            print(f"  {label:28} {fmt_num(cell.value)}")
    else:
        print("  No GA4 rows returned for this date range.")

    print("\nTop pages")
    pages = client.run_report(
        RunReportRequest(
            property=prop,
            date_ranges=[date_range],
            dimensions=[Dimension(name="pagePath")],
            metrics=[
                Metric(name="screenPageViews"),
                Metric(name="sessions"),
                Metric(name="averageSessionDuration"),
            ],
            order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="screenPageViews"), desc=True)],
            limit=15,
        )
    )
    if not pages.rows:
        print("  (none)")
    for row in pages.rows:
        path = row.dimension_values[0].value
        views, sessions, dur = (m.value for m in row.metric_values)
        print(f"  {fmt_num(views):>8} views | {fmt_num(sessions):>7} sess | {fmt_num(dur):>7}s | {path}")

    print("\nTraffic sources")
    sources = client.run_report(
        RunReportRequest(
            property=prop,
            date_ranges=[date_range],
            dimensions=[Dimension(name="sessionDefaultChannelGroup")],
            metrics=[Metric(name="sessions"), Metric(name="totalUsers")],
            order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
            limit=10,
        )
    )
    for row in sources.rows:
        channel = row.dimension_values[0].value
        sessions, users = (m.value for m in row.metric_values)
        print(f"  {channel:22} sessions={fmt_num(sessions):>8}  users={fmt_num(users):>8}")

    print("\nDevices")
    devices = client.run_report(
        RunReportRequest(
            property=prop,
            date_ranges=[date_range],
            dimensions=[Dimension(name="deviceCategory")],
            metrics=[Metric(name="sessions"), Metric(name="totalUsers")],
            order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
        )
    )
    for row in devices.rows:
        device = row.dimension_values[0].value
        sessions, users = (m.value for m in row.metric_values)
        print(f"  {device:12} sessions={fmt_num(sessions):>8}  users={fmt_num(users):>8}")


def _gsc_query(service, site_url: str, start: str, end: str, dimensions: list[str], row_limit: int = 15):
    body = {
        "startDate": start,
        "endDate": end,
        "dimensions": dimensions,
        "rowLimit": row_limit,
        "dataState": "final",
        # Explicit sort so low-click long-tail rows don't dominate the printout.
        "dimensionFilterGroups": [],
    }
    # searchanalytics.query sorts by clicks desc by default when no startRow tricks;
    # still request a higher limit for query dimension so real click-winners surface.
    if dimensions:
        body["rowLimit"] = max(row_limit, 25)
    return service.searchanalytics().query(siteUrl=site_url, body=body).execute()


def review_gsc(creds: Credentials, site_url: str, days: int) -> None:
    service = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
    end = date.today() - timedelta(days=2)  # GSC lag
    start = end - timedelta(days=days - 1)

    print_section(f"Google Search Console — last {days} days ending {end} (2-day lag)")
    print(f"Property: {site_url}")

    # Resolve property if exact URL property missing
    sites = service.sites().list().execute().get("siteEntry", [])
    available = {s.get("siteUrl"): s.get("permissionLevel") for s in sites}
    if site_url not in available:
        print("Configured Search Console property not found on this account.")
        print("Available properties:")
        for url, perm in available.items():
            print(f"  - {url} ({perm})")
        # Prefer sc-domain then https variants
        candidates = [
            site_url,
            site_url.rstrip("/") + "/",
            site_url.replace("https://", "sc-domain:").rstrip("/").replace("sc-domain:planyourpark.com/", "sc-domain:planyourpark.com"),
            "sc-domain:planyourpark.com",
            "https://www.planyourpark.com/",
            "http://planyourpark.com/",
        ]
        resolved = next((c for c in candidates if c in available), None)
        if not resolved and available:
            # fuzzy match domain
            for url in available:
                if "planyourpark.com" in url:
                    resolved = url
                    break
        if not resolved:
            raise RuntimeError(
                "No Search Console property for planyourpark.com is accessible with this Google account. "
                "Add/verify the property in Search Console, then re-run."
            )
        site_url = resolved
        print(f"Using available property: {site_url}")

    overview = _gsc_query(service, site_url, start.isoformat(), end.isoformat(), dimensions=[], row_limit=1)
    rows = overview.get("rows") or []
    if rows:
        r = rows[0]
        print(
            f"  Clicks={fmt_num(r.get('clicks', 0))}  "
            f"Impressions={fmt_num(r.get('impressions', 0))}  "
            f"CTR={r.get('ctr', 0)*100:.2f}%  "
            f"Avg position={r.get('position', 0):.1f}"
        )
    else:
        print("  No Search Console rows for this range (new property or no data yet).")

    print("\nTop queries")
    queries = _gsc_query(service, site_url, start.isoformat(), end.isoformat(), dimensions=["query"], row_limit=15)
    for r in queries.get("rows") or []:
        q = r["keys"][0]
        print(
            f"  {fmt_num(r.get('clicks', 0)):>6} clicks | "
            f"{fmt_num(r.get('impressions', 0)):>8} impr | "
            f"CTR {r.get('ctr', 0)*100:5.2f}% | "
            f"pos {r.get('position', 0):5.1f} | {q}"
        )

    print("\nTop pages")
    pages = _gsc_query(service, site_url, start.isoformat(), end.isoformat(), dimensions=["page"], row_limit=15)
    for r in pages.get("rows") or []:
        page = r["keys"][0]
        print(
            f"  {fmt_num(r.get('clicks', 0)):>6} clicks | "
            f"{fmt_num(r.get('impressions', 0)):>8} impr | "
            f"CTR {r.get('ctr', 0)*100:5.2f}% | "
            f"pos {r.get('position', 0):5.1f} | {page}"
        )

    print("\nDevices")
    devices = _gsc_query(service, site_url, start.isoformat(), end.isoformat(), dimensions=["device"], row_limit=10)
    for r in devices.get("rows") or []:
        device = r["keys"][0]
        print(
            f"  {device:10} clicks={fmt_num(r.get('clicks', 0)):>6}  "
            f"impr={fmt_num(r.get('impressions', 0)):>8}  "
            f"CTR={r.get('ctr', 0)*100:5.2f}%  pos={r.get('position', 0):5.1f}"
        )


def main() -> None:
    parser = argparse.ArgumentParser(description="Review Plan Your Park GA4 + Search Console")
    parser.add_argument("--days", type=int, default=28, help="Lookback window (default 28)")
    parser.add_argument("--section", choices=["all", "ga", "gsc"], default="all")
    parser.add_argument("--property-id", type=str, default="", help="Numeric GA4 property id override")
    parser.add_argument("--site-url", type=str, default="", help="Search Console siteUrl override")
    args = parser.parse_args()

    cfg = load_config()
    creds = get_credentials()

    try:
        if args.section in ("all", "ga"):
            property_id = discover_property_id(
                creds,
                cfg["ga4_measurement_id"],
                args.property_id or cfg.get("ga4_property_id") or "",
            )
            if not cfg.get("ga4_property_id"):
                cfg["ga4_property_id"] = property_id
                save_config(cfg)
                print(f"Saved discovered GA4 property id: {property_id}")
            review_ga(creds, property_id, args.days)

        if args.section in ("all", "gsc"):
            site_url = args.site_url or cfg.get("search_console_site_url") or cfg["site_url"]
            if not site_url.endswith("/") and site_url.startswith("http"):
                # URL-prefix properties usually include trailing slash
                site_url = site_url + "/"
            review_gsc(creds, site_url, args.days)
    except HttpError as exc:
        print(f"API ERROR: {exc}")
        if exc.resp is not None and exc.resp.status in (403, 404):
            print(
                "\nLikely causes:\n"
                "  1) API not enabled in Google Cloud project\n"
                "  2) This Google account lacks access to the GA/GSC property\n"
                "  3) Property URL/ID mismatch"
            )
        sys.exit(1)
    except Exception as exc:
        print(f"ERROR: {exc}")
        sys.exit(1)


if __name__ == "__main__":
    main()
