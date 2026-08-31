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
    ("/tickets", "/deals", 301),
    ("/dining", "/character-dining", 301),
    ("/character-meals", "/character-dining", 301),
    ("/disclosure", "/affiliate-disclosure", 301),
    ("/affiliate", "/affiliate-disclosure", 301),
    ("/height", "/rides", 301),
    ("/ride-finder", "/rides", 301),
    ("/rides-by-height", "/rides", 301),
    ("/packing-list", "/blog/disney-world-packing-list-kids", 301),
    ("/blog/baby", "/blog/disney-world-with-baby-toddler", 301),
    ("/blog/toddler", "/blog/disney-world-with-baby-toddler", 301),
    ("/blog/crowds", "/blog/beat-disney-world-crowds", 301),
    ("/blog/free", "/blog/free-things-disney-world", 301),
    ("/blog/rides-ranked", "/blog/epic-universe-rides-ranked-guide", 301),
    ("/usf", "/parks/universal-studios-florida", 301),
    ("/parks/usf", "/parks/universal-studios-florida", 301),
    ("/compare-parks", "/parks", 301),
    ("/orlando-parks", "/parks", 301),
    ("/blog/epic-tickets", "/blog/epic-universe-tickets-guide", 301),
    ("/blog/mk-heights", "/blog/best-magic-kingdom-rides-kids-under-40-inches", 301),
    ("/blog/disney-packing", "/blog/disney-world-packing-list-kids", 301),
    ("/blog/universal-heights", "/blog/universal-orlando-height-requirements", 301),
    # Height SEO landing short aliases (2026-08-11)
    ("/under-40", "/rides/for/under-40", 301),
    ("/rides/under-40", "/rides/for/under-40", 301),
    ("/height-40", "/rides/for/under-40", 301),
    ("/rides/mk-under-40", "/rides/for/magic-kingdom-under-40", 301),
    ("/rides/epic-under-40", "/rides/for/epic-universe-under-40", 301),
    ("/rides/usf-under-40", "/rides/for/universal-studios-under-40", 301),
    ("/rides/epic-44", "/rides/for/epic-universe-44", 301),
    ("/rides/mk-44", "/rides/for/magic-kingdom-44", 301),
    # Height aliases expansion (2026-08-21)
    ("/rides/ioa-44", "/rides/for/islands-of-adventure-44", 301),
    ("/rides/usf-44", "/rides/for/universal-studios-44", 301),
    ("/rides/hs-44", "/rides/for/hollywood-studios-44", 301),
    ("/rides/epcot-44", "/rides/for/epcot-44", 301),
    ("/rides/hs-under-40", "/rides/for/hollywood-studios-under-40", 301),
    ("/rides/ioa-under-40", "/rides/for/islands-of-adventure-under-40", 301),
    ("/rides/epcot-under-40", "/rides/for/epcot-under-40", 301),
    ("/height-48", "/rides/for/height-48", 301),
    ("/rides/height-48", "/rides/for/height-48", 301),
    # AK 48 + SeaWorld/LEGOLAND bands (2026-08-22)
    ("/rides/ak-under-40", "/rides/for/animal-kingdom-under-40", 301),
    ("/rides/ak-44", "/rides/for/animal-kingdom-44", 301),
    ("/rides/ak-48", "/rides/for/animal-kingdom-48", 301),
    ("/rides/seaworld-under-40", "/rides/for/seaworld-under-40", 301),
    ("/rides/seaworld-44", "/rides/for/seaworld-44", 301),
    ("/rides/seaworld-48", "/rides/for/seaworld-48", 301),
    ("/rides/legoland-under-40", "/rides/for/legoland-under-40", 301),
    ("/rides/legoland-44", "/rides/for/legoland-44", 301),
    ("/rides/legoland-48", "/rides/for/legoland-48", 301),
    # Park calm + under-40 (2026-08-23)
    ("/rides/epic-calm", "/rides/for/epic-universe-calm-under-40", 301),
    ("/rides/usf-calm", "/rides/for/universal-studios-calm-under-40", 301),
    ("/rides/ioa-calm", "/rides/for/islands-of-adventure-calm-under-40", 301),
    ("/rides/epcot-calm", "/rides/for/epcot-calm-under-40", 301),
    ("/rides/hs-calm", "/rides/for/hollywood-studios-calm-under-40", 301),
    ("/rides/ak-calm", "/rides/for/animal-kingdom-calm-under-40", 301),
    ("/rides/seaworld-calm", "/rides/for/seaworld-calm-under-40", 301),
    ("/rides/legoland-calm", "/rides/for/legoland-calm-under-40", 301),
    ("/rides/mk-calm", "/rides/for/magic-kingdom-calm-under-40", 301),
    # Park-only all-heights (2026-08-25)
    ("/rides/mk-all", "/rides/for/magic-kingdom-all", 301),
    ("/rides/epcot-all", "/rides/for/epcot-all", 301),
    ("/rides/hs-all", "/rides/for/hollywood-studios-all", 301),
    ("/rides/ak-all", "/rides/for/animal-kingdom-all", 301),
    ("/rides/usf-all", "/rides/for/universal-studios-all", 301),
    ("/rides/ioa-all", "/rides/for/islands-of-adventure-all", 301),
    ("/rides/epic-all", "/rides/for/epic-universe-all", 301),
    ("/rides/seaworld-all", "/rides/for/seaworld-all", 301),
    ("/rides/legoland-all", "/rides/for/legoland-all", 301),
    # Multi-resort bundles (2026-08-26)
    ("/rides/disney-under-40", "/rides/for/disney-world-under-40", 301),
    ("/rides/disney-48", "/rides/for/disney-world-48", 301),
    ("/rides/disney-all", "/rides/for/disney-world-all", 301),
    ("/rides/universal-under-40", "/rides/for/universal-orlando-under-40", 301),
    ("/rides/universal-48", "/rides/for/universal-orlando-48", 301),
    ("/rides/universal-all", "/rides/for/universal-orlando-all", 301),
    ("/disney-under-40", "/rides/for/disney-world-under-40", 301),
    ("/universal-under-40", "/rides/for/universal-orlando-under-40", 301),
    ("/rides/disney-44", "/rides/for/disney-world-44", 301),
    ("/rides/universal-44", "/rides/for/universal-orlando-44", 301),
    ("/rides/disney-calm", "/rides/for/disney-world-calm-under-40", 301),
    ("/rides/universal-calm", "/rides/for/universal-orlando-calm-under-40", 301),
    ("/rides/disney-52", "/rides/for/disney-world-52", 301),
    ("/rides/universal-52", "/rides/for/universal-orlando-52", 301),
    # Park-level 52″ (2026-08-30)
    ("/rides/mk-52", "/rides/for/magic-kingdom-52", 301),
    ("/rides/epcot-52", "/rides/for/epcot-52", 301),
    ("/rides/hs-52", "/rides/for/hollywood-studios-52", 301),
    ("/rides/ak-52", "/rides/for/animal-kingdom-52", 301),
    ("/rides/usf-52", "/rides/for/universal-studios-52", 301),
    ("/rides/ioa-52", "/rides/for/islands-of-adventure-52", 301),
    ("/rides/epic-52", "/rides/for/epic-universe-52", 301),
    # Park-level 52″ SeaWorld + LEGOLAND (2026-08-31)
    ("/rides/seaworld-52", "/rides/for/seaworld-52", 301),
    ("/rides/sw-52", "/rides/for/seaworld-52", 301),
    ("/rides/legoland-52", "/rides/for/legoland-52", 301),
    ("/rides/ll-52", "/rides/for/legoland-52", 301),
]

# path -> substring that must appear in <title>
# Empty string = skip title needle (body-only paths still checked via BODY_MUST_CONTAIN).
TITLE_MUST_CONTAIN = {
    "/parks/magic-kingdom/": "Magic Kingdom with Kids",
    "/parks/epic-universe/": "Epic Universe with Kids",
    "/parks/epcot/": "EPCOT with Kids",
    "/parks/hollywood-studios/": "Hollywood Studios with Kids",
    "/parks/animal-kingdom/": "Animal Kingdom with Kids",
    "/parks/universal-studios-florida/": "Universal Studios Florida with Kids",
    "/parks/islands-of-adventure/": "Islands of Adventure with Kids",
    "/parks/seaworld-orlando/": "SeaWorld Orlando with Kids",
    "/parks/legoland-florida/": "LEGOLAND Florida with Kids",
    "/blog/": "Families",  # staged blog hub is family-oriented
    "/deals/": "Ticket Deals for Families",
    "/character-dining/": "Character Dining with Kids",
    "/rides/": "Ride Finder",
    "/rides/for/under-40/": 'Under 40',
    "/rides/for/magic-kingdom-under-40/": "Magic Kingdom",
    "/rides/for/universal-studios-under-40/": "Universal Studios Florida",
    "/rides/for/epic-universe-under-40/": "Epic Universe",
    "/rides/for/epic-universe-44/": "Epic Universe",
    "/rides/for/magic-kingdom-44/": "Magic Kingdom",
    "/rides/for/universal-studios-44/": "Universal Studios Florida",
    "/rides/for/islands-of-adventure-44/": "Islands of Adventure",
    "/rides/for/hollywood-studios-44/": "Hollywood Studios",
    "/rides/for/epcot-44/": "EPCOT",
    "/rides/for/height-48/": "48",
    "/rides/for/animal-kingdom-48/": "Animal Kingdom",
    "/rides/for/seaworld-44/": "SeaWorld",
    "/rides/for/seaworld-48/": "SeaWorld",
    "/rides/for/legoland-44/": "LEGOLAND",
    "/rides/for/legoland-48/": "LEGOLAND",
    "/rides/for/epic-universe-calm-under-40/": "Epic Universe",
    "/rides/for/universal-studios-calm-under-40/": "Universal Studios Florida",
    "/rides/for/islands-of-adventure-calm-under-40/": "Islands of Adventure",
    "/rides/for/epcot-calm-under-40/": "EPCOT",
    "/rides/for/hollywood-studios-calm-under-40/": "Hollywood Studios",
    "/rides/for/animal-kingdom-calm-under-40/": "Animal Kingdom",
    "/rides/for/seaworld-calm-under-40/": "SeaWorld",
    "/rides/for/legoland-calm-under-40/": "LEGOLAND",
    "/rides/for/magic-kingdom-calm-under-40/": "Magic Kingdom",
    "/rides/for/magic-kingdom-all/": "Magic Kingdom",
    "/rides/for/epcot-all/": "EPCOT",
    "/rides/for/hollywood-studios-all/": "Hollywood Studios",
    "/rides/for/animal-kingdom-all/": "Animal Kingdom",
    "/rides/for/universal-studios-all/": "Universal Studios Florida",
    "/rides/for/islands-of-adventure-all/": "Islands of Adventure",
    "/rides/for/epic-universe-all/": "Epic Universe",
    "/rides/for/seaworld-all/": "SeaWorld",
    "/rides/for/legoland-all/": "LEGOLAND",
    "/rides/for/disney-world-under-40/": "Disney World",
    "/rides/for/disney-world-48/": "Disney World",
    "/rides/for/disney-world-all/": "Disney World",
    "/rides/for/universal-orlando-under-40/": "Universal Orlando",
    "/rides/for/universal-orlando-48/": "Universal Orlando",
    "/rides/for/universal-orlando-all/": "Universal Orlando",
    "/rides/for/disney-world-44/": "Disney World",
    "/rides/for/universal-orlando-44/": "Universal Orlando",
    "/rides/for/disney-world-calm-under-40/": "Disney World",
    "/rides/for/universal-orlando-calm-under-40/": "Universal Orlando",
    "/rides/for/disney-world-52/": "Disney World",
    "/rides/for/universal-orlando-52/": "Universal Orlando",
    "/rides/for/magic-kingdom-52/": "Magic Kingdom",
    "/rides/for/epcot-52/": "EPCOT",
    "/rides/for/hollywood-studios-52/": "Hollywood Studios",
    "/rides/for/animal-kingdom-52/": "Animal Kingdom",
    "/rides/for/universal-studios-52/": "Universal Studios Florida",
    "/rides/for/islands-of-adventure-52/": "Islands of Adventure",
    "/rides/for/epic-universe-52/": "Epic Universe",
    "/rides/for/seaworld-52/": "SeaWorld",
    "/rides/for/legoland-52/": "LEGOLAND",
    "/": "Ride Finder",
    "/parks/": "All Parks in Orlando",
    "/blog/epic-universe-1-day-plan/": "Epic Universe",
    "/blog/universal-orlando-height-requirements/": "Universal",
    "/blog/disney-world-packing-list-kids/": "Packing",
    "/blog/best-magic-kingdom-rides-kids-under-40-inches/": "Magic Kingdom",
    "/about/": "About Plan Your Park",
    "/contact/": "Contact Plan Your Park",
    "/affiliate-disclosure/": "Affiliate Disclosure",
}

BODY_MUST_CONTAIN = {
    "/": [
        "Organization",
        "WebSite",
        "application/ld+json",
        # Home cards point at crawlable height SEO landings
        "/rides/for/under-40/",
        "/rides/for/disney-world-under-40/",
        "/rides/for/universal-orlando-under-40/",
        "/rides/for/disney-world-52/",
    ],
    "/parks/": [
        "FAQPage",
        "ItemList",
        "CollectionPage",
        "How do I know which rides my kids can ride",
        "application/ld+json",
        "/rides/for/under-40/",
        "/rides/for/disney-world-under-40/",
        "/rides/for/universal-orlando-under-40/",
        "/rides/for/disney-world-52/",
        "/rides/for/universal-orlando-52/",
    ],
    "/rides/": [
        "CollectionPage",
        "ItemList",
        "Shareable ride height presets",
        "FAQPage",
        "How do I filter Orlando rides by my child's height",
        "application/ld+json",
        # Canonical USF park query must match ride.park (not bare "Universal Studios")
        "Universal%20Studios%20Florida",
        "USF + under 40",
        # Static SEO landings linked from hub cards
        "/rides/for/under-40/",
        "/rides/for/universal-studios-under-40/",
        "Disney World all four parks",
        "Universal Orlando USF",
        "/rides/for/disney-world-52/",
        "/rides/for/universal-orlando-52/",
        "/rides/for/magic-kingdom-52/",
        "/rides/for/epic-universe-52/",
        "/rides/for/seaworld-52/",
        "/rides/for/legoland-52/",
    ],
    "/rides/for/under-40/": [
        "CollectionPage",
        "ItemList",
        "FAQPage",
        "BreadcrumbList",
        "Open interactive filter",
        "application/ld+json",
        "affiliate-disclosure",
        "What if my kids are different heights",
        "Next planning steps",
        "Heights checked",
        "/blog/disney-world-packing-list-kids/",
        "/deals/",
    ],
    "/rides/for/magic-kingdom-under-40/": [
        "CollectionPage",
        "Magic Kingdom",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "/blog/best-magic-kingdom-rides-kids-under-40-inches/",
        "Next planning steps",
        "Heights checked",
    ],
    "/rides/for/universal-studios-under-40/": [
        "CollectionPage",
        "Universal Studios Florida",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "/blog/universal-orlando-height-requirements/",
        "Heights checked",
    ],
    "/rides/for/epic-universe-under-40/": [
        "CollectionPage",
        "Epic Universe",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "/blog/epic-universe-1-day-plan/",
        "Next planning steps",
        "Heights checked",
    ],
    "/rides/for/animal-kingdom-under-40/": [
        "CollectionPage",
        "Animal Kingdom",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/magic-kingdom-48/": [
        "CollectionPage",
        "Magic Kingdom",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/epic-universe-44/": [
        "CollectionPage",
        "Epic Universe",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
        "/blog/epic-universe-1-day-plan/",
    ],
    "/rides/for/magic-kingdom-44/": [
        "CollectionPage",
        "Magic Kingdom",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/universal-studios-44/": [
        "CollectionPage",
        "Universal Studios Florida",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/islands-of-adventure-44/": [
        "CollectionPage",
        "Islands of Adventure",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/hollywood-studios-44/": [
        "CollectionPage",
        "Hollywood Studios",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
        "/blog/beat-disney-world-crowds/",
    ],
    "/rides/for/epcot-44/": [
        "CollectionPage",
        "EPCOT",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
        "/blog/beat-disney-world-crowds/",
    ],
    "/rides/for/animal-kingdom-48/": [
        "CollectionPage",
        "Animal Kingdom",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/seaworld-44/": [
        "CollectionPage",
        "SeaWorld Orlando",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
        "/parks/",
    ],
    "/rides/for/seaworld-48/": [
        "CollectionPage",
        "SeaWorld Orlando",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/legoland-44/": [
        "CollectionPage",
        "LEGOLAND Florida",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
        "/parks/",
    ],
    "/rides/for/legoland-48/": [
        "CollectionPage",
        "LEGOLAND Florida",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/epic-universe-calm-under-40/": [
        "CollectionPage",
        "Epic Universe",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
        "calm",
    ],
    "/rides/for/universal-studios-calm-under-40/": [
        "CollectionPage",
        "Universal Studios Florida",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
        "calm",
    ],
    "/rides/for/islands-of-adventure-calm-under-40/": [
        "CollectionPage",
        "Islands of Adventure",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
        "calm",
    ],
    "/rides/for/epcot-calm-under-40/": [
        "CollectionPage",
        "EPCOT",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
        "calm",
    ],
    "/rides/for/hollywood-studios-calm-under-40/": [
        "CollectionPage",
        "Hollywood Studios",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
        "calm",
    ],
    "/rides/for/animal-kingdom-calm-under-40/": [
        "CollectionPage",
        "Animal Kingdom",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
        "calm",
    ],
    "/rides/for/seaworld-calm-under-40/": [
        "CollectionPage",
        "SeaWorld Orlando",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
        "calm",
    ],
    "/rides/for/legoland-calm-under-40/": [
        "CollectionPage",
        "LEGOLAND Florida",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
        "calm",
    ],
    "/rides/for/magic-kingdom-calm-under-40/": [
        "CollectionPage",
        "Magic Kingdom",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
        "calm",
    ],
    "/rides/for/magic-kingdom-all/": [
        "CollectionPage",
        "Magic Kingdom",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
        "Open interactive filter",
    ],
    "/rides/for/epcot-all/": [
        "CollectionPage",
        "EPCOT",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/hollywood-studios-all/": [
        "CollectionPage",
        "Hollywood Studios",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/animal-kingdom-all/": [
        "CollectionPage",
        "Animal Kingdom",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/universal-studios-all/": [
        "CollectionPage",
        "Universal Studios Florida",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/islands-of-adventure-all/": [
        "CollectionPage",
        "Islands of Adventure",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/epic-universe-all/": [
        "CollectionPage",
        "Epic Universe",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
        "/blog/epic-universe-1-day-plan/",
    ],
    "/rides/for/seaworld-all/": [
        "CollectionPage",
        "SeaWorld Orlando",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/legoland-all/": [
        "CollectionPage",
        "LEGOLAND Florida",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/disney-world-under-40/": [
        "CollectionPage",
        "Magic Kingdom",
        "EPCOT",
        "Hollywood Studios",
        "Animal Kingdom",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
        "/blog/best-magic-kingdom-rides-kids-under-40-inches/",
        "Next planning steps",
    ],
    "/rides/for/disney-world-48/": [
        "CollectionPage",
        "Magic Kingdom",
        "EPCOT",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/disney-world-all/": [
        "CollectionPage",
        "Magic Kingdom",
        "Hollywood Studios",
        "Animal Kingdom",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/universal-orlando-under-40/": [
        "CollectionPage",
        "Universal Studios Florida",
        "Islands of Adventure",
        "Epic Universe",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
        "/blog/universal-orlando-height-requirements/",
        "Next planning steps",
    ],
    "/rides/for/universal-orlando-48/": [
        "CollectionPage",
        "Universal Studios Florida",
        "Epic Universe",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/universal-orlando-all/": [
        "CollectionPage",
        "Universal Studios Florida",
        "Islands of Adventure",
        "Epic Universe",
        "ItemList",
        "BreadcrumbList",
        "application/ld+json",
        "Heights checked",
    ],
    "/rides/for/disney-world-44/": [
        "CollectionPage", "Magic Kingdom", "EPCOT", "Hollywood Studios", "Animal Kingdom",
        "ItemList", "BreadcrumbList", "application/ld+json", "Heights checked",
    ],
    "/rides/for/universal-orlando-44/": [
        "CollectionPage", "Universal Studios Florida", "Islands of Adventure", "Epic Universe",
        "ItemList", "BreadcrumbList", "application/ld+json", "Heights checked",
    ],
    "/rides/for/disney-world-calm-under-40/": [
        "CollectionPage", "Magic Kingdom", "EPCOT", "ItemList", "BreadcrumbList",
        "application/ld+json", "Heights checked", "Next planning steps",
    ],
    "/rides/for/universal-orlando-calm-under-40/": [
        "CollectionPage", "Universal Studios Florida", "Islands of Adventure", "Epic Universe",
        "ItemList", "BreadcrumbList", "application/ld+json", "Heights checked", "Next planning steps",
    ],
    "/rides/for/disney-world-52/": [
        "CollectionPage", "Magic Kingdom", "EPCOT", "Hollywood Studios", "Animal Kingdom",
        "ItemList", "BreadcrumbList", "application/ld+json", "Heights checked", "Next planning steps",
    ],
    "/rides/for/universal-orlando-52/": [
        "CollectionPage", "Universal Studios Florida", "Islands of Adventure", "Epic Universe",
        "ItemList", "BreadcrumbList", "application/ld+json", "Heights checked", "Next planning steps",
    ],
    "/rides/for/magic-kingdom-52/": [
        "CollectionPage", "Magic Kingdom", "ItemList", "BreadcrumbList",
        "application/ld+json", "Heights checked", "Next planning steps",
    ],
    "/rides/for/epcot-52/": [
        "CollectionPage", "EPCOT", "ItemList", "BreadcrumbList",
        "application/ld+json", "Heights checked", "Next planning steps",
    ],
    "/rides/for/hollywood-studios-52/": [
        "CollectionPage", "Hollywood Studios", "ItemList", "BreadcrumbList",
        "application/ld+json", "Heights checked", "Next planning steps",
    ],
    "/rides/for/animal-kingdom-52/": [
        "CollectionPage", "Animal Kingdom", "ItemList", "BreadcrumbList",
        "application/ld+json", "Heights checked", "Next planning steps",
    ],
    "/rides/for/universal-studios-52/": [
        "CollectionPage", "Universal Studios Florida", "ItemList", "BreadcrumbList",
        "application/ld+json", "Heights checked", "Next planning steps",
    ],
    "/rides/for/islands-of-adventure-52/": [
        "CollectionPage", "Islands of Adventure", "ItemList", "BreadcrumbList",
        "application/ld+json", "Heights checked", "Next planning steps",
    ],
    "/rides/for/epic-universe-52/": [
        "CollectionPage", "Epic Universe", "ItemList", "BreadcrumbList",
        "application/ld+json", "Heights checked", "Next planning steps",
        "/blog/epic-universe-1-day-plan/",
    ],
    "/rides/for/seaworld-52/": [
        "CollectionPage", "SeaWorld", "ItemList", "BreadcrumbList",
        "application/ld+json", "Heights checked", "Next planning steps",
    ],
    "/rides/for/legoland-52/": [
        "CollectionPage", "LEGOLAND", "ItemList", "BreadcrumbList",
        "application/ld+json", "Heights checked", "Next planning steps",
    ],
    # Note: park-page 52″ chip needles live on the main /parks/* entries below
    # (do not redefine those keys here — later dict keys overwrite earlier ones).
    "/blog/": [
        "CollectionPage",
        "ItemList",
        "FAQPage",
        "Where should families start planning",
        "application/ld+json",
        # Start-here amplify → crawlable height SEO landings
        "/rides/for/under-40/",
        "/rides/for/magic-kingdom-under-40/",
        "/rides/for/disney-world-under-40/",
        "/rides/for/universal-orlando-under-40/",
    ],
    "/blog/epic-universe-1-day-plan/": [
        "BlogPosting",
        "logo-full.png",
        "BreadcrumbList",
        "application/ld+json",
        # Helpful links amplify → crawlable Epic height landing
        "/rides/for/epic-universe-under-40/",
    ],
    "/blog/universal-orlando-height-requirements/": [
        "BlogPosting",
        "application/ld+json",
        # Multi-resort amplify (not single-park USF-only)
        "/rides/for/universal-orlando-under-40/",
    ],
    "/blog/disney-world-packing-list-kids/": [
        "BlogPosting",
        "application/ld+json",
        "/rides/for/disney-world-under-40/",
    ],
    "/blog/best-magic-kingdom-rides-kids-under-40-inches/": [
        "BlogPosting",
        "application/ld+json",
        "/rides/for/magic-kingdom-under-40/",
    ],
    "/deals/": [
        "affiliate-disclosure",
        "commission",
        "CollectionPage",
        "ItemList",
        "FAQPage",
        "How do families save on Orlando theme park tickets",
        "sponsored",
        "application/ld+json",
    ],
    "/character-dining/": [
        "CollectionPage",
        "ItemList",
        "FAQPage",
        "Is character dining worth it with kids",
        "application/ld+json",
    ],
    "/parks/magic-kingdom/": [
        "Will my kid be tall enough",
        "/rides/for/magic-kingdom-under-40/",
        "/rides/for/magic-kingdom-44/",
        "/rides/for/magic-kingdom-52/",
        "52″+",
        "Calm + under",
        "/rides/for/magic-kingdom-calm-under-40/",
        "/rides/for/magic-kingdom-all/",
        "TouristAttraction",
        "FAQPage",
    ],
    "/parks/epic-universe/": [
        "Will my kid be tall enough",
        "epic-universe-1-day-plan",
        "/rides/for/epic-universe-calm-under-40/",
        "TouristAttraction",
        "/rides/for/epic-universe-under-40/",
        "/rides/for/epic-universe-44/",
        "/rides/for/epic-universe-52/",
        "52″+",
        "/rides/for/epic-universe-all/",
        "Calm + under",
    ],
    "/parks/universal-studios-florida/": [
        "Will my kid be tall enough",
        "/rides/for/universal-studios-under-40/",
        "/rides/for/universal-studios-44/",
        "/rides/for/universal-studios-52/",
        "52″+",
        "Calm + under",
        "/rides/for/universal-studios-calm-under-40/",
        "/rides/for/universal-studios-all/",
        "TouristAttraction",
    ],
    "/parks/islands-of-adventure/": [
        "Will my kid be tall enough",
        "/rides/for/islands-of-adventure-under-40/",
        "/rides/for/islands-of-adventure-44/",
        "/rides/for/islands-of-adventure-52/",
        "52″+",
        "Calm + under",
        "/rides/for/islands-of-adventure-calm-under-40/",
        "/rides/for/islands-of-adventure-all/",
        "TouristAttraction",
    ],
    "/parks/hollywood-studios/": [
        "Will my kid be tall enough",
        "/rides/for/hollywood-studios-under-40/",
        "/rides/for/hollywood-studios-44/",
        "/rides/for/hollywood-studios-52/",
        "52″+",
        "Calm + under",
        "/rides/for/hollywood-studios-calm-under-40/",
        "/rides/for/hollywood-studios-all/",
        "TouristAttraction",
    ],
    "/parks/epcot/": [
        "Will my kid be tall enough",
        "/rides/for/epcot-under-40/",
        "/rides/for/epcot-44/",
        "/rides/for/epcot-52/",
        "52″+",
        "Calm + under",
        "/rides/for/epcot-calm-under-40/",
        "/rides/for/epcot-all/",
        "TouristAttraction",
    ],
    "/parks/animal-kingdom/": [
        "Will my kid be tall enough",
        "/rides/for/animal-kingdom-under-40/",
        "/rides/for/animal-kingdom-44/",
        "/rides/for/animal-kingdom-48/",
        "/rides/for/animal-kingdom-52/",
        "52″+",
        "Calm + under",
        "/rides/for/animal-kingdom-calm-under-40/",
        "/rides/for/animal-kingdom-all/",
        "TouristAttraction",
    ],
    "/parks/seaworld-orlando/": [
        "Will my kid be tall enough",
        "/rides/for/seaworld-under-40/",
        "/rides/for/seaworld-44/",
        "/rides/for/seaworld-48/",
        "/rides/for/seaworld-52/",
        "52″+",
        "Calm + under",
        "/rides/for/seaworld-calm-under-40/",
        "/rides/for/seaworld-all/",
        "TouristAttraction",
    ],
    "/parks/legoland-florida/": [
        "Will my kid be tall enough",
        "/rides/for/legoland-under-40/",
        "/rides/for/legoland-44/",
        "/rides/for/legoland-48/",
        "/rides/for/legoland-52/",
        "52″+",
        "Calm + under",
        "/rides/for/legoland-calm-under-40/",
        "/rides/for/legoland-all/",
        "TouristAttraction",
    ],
    "/about/": [
        "AboutPage",
        "FAQPage",
        "What is Plan Your Park",
        "affiliate-disclosure",
        "application/ld+json",
        "rides/?height=40",
    ],
    "/affiliate-disclosure/": [
        "FAQPage",
        "Does Plan Your Park use affiliate links",
        "planyourpark-20",
        "Undercover Tourist",
        "application/ld+json",
    ],
    "/contact/": [
        "ride finder",
        "affiliate-disclosure",
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
