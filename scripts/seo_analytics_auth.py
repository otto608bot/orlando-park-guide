#!/usr/bin/env python3
"""OAuth setup for Plan Your Park Google Analytics + Search Console.

Uses the existing Hermes Google OAuth desktop client secret, but stores a
separate token so Workspace scopes stay untouched.

Commands:
  --check
  --auth-url
  --auth-code "URL_OR_CODE"
  --revoke
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow

ROOT = Path(__file__).resolve().parents[1]
HERMES_HOME = Path.home() / ".hermes"
CLIENT_SECRET_PATH = HERMES_HOME / "google_client_secret.json"
TOKEN_PATH = ROOT / ".hermes" / "google_seo_token.json"
PENDING_PATH = ROOT / ".hermes" / "google_seo_oauth_pending.json"

SCOPES = [
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/webmasters.readonly",
]
REDIRECT_URI = "http://localhost:1"


def _ensure_dir() -> None:
    TOKEN_PATH.parent.mkdir(parents=True, exist_ok=True)


def check_auth() -> bool:
    if not TOKEN_PATH.exists():
        print(f"NOT_AUTHENTICATED: No token at {TOKEN_PATH}")
        return False

    try:
        # Don't force scopes on load; validate against required list separately.
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH))
        if not creds.valid:
            if creds.expired and creds.refresh_token:
                creds.refresh(Request())
                TOKEN_PATH.write_text(creds.to_json())
            else:
                print("NOT_AUTHENTICATED: Token invalid and cannot refresh")
                return False

        granted = set(creds.scopes or [])
        # Some token files store scopes only as space-separated string in JSON
        if not granted:
            raw = json.loads(TOKEN_PATH.read_text())
            raw_scopes = raw.get("scopes") or raw.get("scope") or []
            if isinstance(raw_scopes, str):
                granted = set(raw_scopes.split())
            else:
                granted = set(raw_scopes)

        missing = [s for s in SCOPES if s not in granted]
        if missing:
            print("AUTHENTICATED (partial): missing scopes:")
            for scope in missing:
                print(f"  - {scope}")
            return False

        print(f"AUTHENTICATED: {TOKEN_PATH}")
        print("Scopes:")
        for scope in sorted(granted):
            print(f"  - {scope}")
        return True
    except Exception as exc:
        print(f"NOT_AUTHENTICATED: {exc}")
        return False


def auth_url() -> None:
    if not CLIENT_SECRET_PATH.exists():
        print(f"ERROR: Missing client secret at {CLIENT_SECRET_PATH}")
        print("Set up Hermes Google Workspace OAuth first.")
        sys.exit(1)

    _ensure_dir()
    flow = Flow.from_client_secrets_file(
        str(CLIENT_SECRET_PATH),
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI,
        autogenerate_code_verifier=True,
    )
    url, state = flow.authorization_url(
        access_type="offline",
        prompt="consent",
    )
    PENDING_PATH.write_text(
        json.dumps(
            {
                "state": state,
                "code_verifier": flow.code_verifier,
                "redirect_uri": REDIRECT_URI,
            },
            indent=2,
        )
    )
    print(url)


def _extract_code_and_state(code_or_url: str):
    value = code_or_url.strip().strip('"').strip("'")
    if not value.startswith("http"):
        if value.startswith("code="):
            value = "http://localhost:1/?" + value
        else:
            return value, None, None

    params = parse_qs(urlparse(value).query)
    if "code" not in params:
        print("ERROR: No 'code' parameter found in URL.")
        sys.exit(1)
    scope_val = (params.get("scope") or [""])[0].strip()
    granted = scope_val.split() if scope_val else list(SCOPES)
    return params["code"][0], params.get("state", [None])[0], granted


def auth_code(raw: str) -> None:
    if not CLIENT_SECRET_PATH.exists():
        print(f"ERROR: Missing client secret at {CLIENT_SECRET_PATH}")
        sys.exit(1)
    if not PENDING_PATH.exists():
        print("ERROR: No pending OAuth session. Run --auth-url first.")
        sys.exit(1)

    pending = json.loads(PENDING_PATH.read_text())
    if not pending.get("state") or not pending.get("code_verifier"):
        print("ERROR: Pending OAuth session is missing PKCE data. Run --auth-url again.")
        sys.exit(1)

    code, returned_state, granted_scopes = _extract_code_and_state(raw)
    if returned_state and returned_state != pending["state"]:
        print("ERROR: OAuth state mismatch. Run --auth-url again.")
        sys.exit(1)

    flow = Flow.from_client_secrets_file(
        str(CLIENT_SECRET_PATH),
        scopes=granted_scopes or SCOPES,
        redirect_uri=pending.get("redirect_uri", REDIRECT_URI),
        state=pending["state"],
        code_verifier=pending["code_verifier"],
    )

    try:
        os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "1"
        flow.fetch_token(code=code)
    except Exception as exc:
        print(f"ERROR: Token exchange failed: {exc}")
        print("The code may have expired. Run --auth-url to get a fresh URL.")
        sys.exit(1)

    creds = flow.credentials
    payload = json.loads(creds.to_json())
    if not payload.get("type"):
        payload["type"] = "authorized_user"
    # Prefer actually granted scopes when available
    if granted_scopes:
        payload["scopes"] = granted_scopes
    TOKEN_PATH.write_text(json.dumps(payload, indent=2))
    PENDING_PATH.unlink(missing_ok=True)
    print(f"TOKEN_SAVED: {TOKEN_PATH}")
    check_auth()


def revoke() -> None:
    if TOKEN_PATH.exists():
        try:
            creds = Credentials.from_authorized_user_file(str(TOKEN_PATH))
            if creds.token:
                import urllib.request

                req = urllib.request.Request(
                    f"https://oauth2.googleapis.com/revoke?token={creds.token}",
                    method="POST",
                    headers={"Content-Type": "application/x-www-form-urlencoded"},
                )
                urllib.request.urlopen(req, timeout=20)
        except Exception as exc:
            print(f"WARNING: revoke request failed ({exc}); deleting local token anyway")
        TOKEN_PATH.unlink(missing_ok=True)
    PENDING_PATH.unlink(missing_ok=True)
    print("REVOKED")


def main() -> None:
    parser = argparse.ArgumentParser(description="Plan Your Park GA4 + Search Console auth")
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--auth-url", action="store_true")
    parser.add_argument("--auth-code", type=str)
    parser.add_argument("--revoke", action="store_true")
    args = parser.parse_args()

    if args.check:
        sys.exit(0 if check_auth() else 1)
    if args.auth_url:
        auth_url()
        return
    if args.auth_code is not None:
        auth_code(args.auth_code)
        return
    if args.revoke:
        revoke()
        return

    parser.print_help()
    sys.exit(2)


if __name__ == "__main__":
    main()
