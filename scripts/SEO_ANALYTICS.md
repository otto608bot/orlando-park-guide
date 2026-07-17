# Plan Your Park — Analytics & Search Console access

Local tooling so Hermes can pull GA4 + Search Console reviews for planyourpark.com.

## One-time setup

### 1. Enable APIs (Google Cloud project that owns the OAuth client)

In the same Google Cloud project as `~/.hermes/google_client_secret.json`, enable:

- [Google Analytics Data API](https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com)
- [Google Analytics Admin API](https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com)
- [Google Search Console API](https://console.cloud.google.com/apis/library/searchconsole.googleapis.com)

If the OAuth app is in **Testing**, add your Google account under
[Audience → Test users](https://console.cloud.google.com/auth/audience).

### 2. Confirm product access

Using the **same Google account** you’ll authorize:

- GA4 property that serves measurement ID `G-SJHPEWNBLS` (already embedded in `web/src/app/layout.tsx`)
- Search Console property for `planyourpark.com` (URL-prefix or domain property)

### 3. Authorize (agent-mediated)

```bash
# from repo root
export PY="/Users/bennett/Hermes/planyourpark/.venv-analytics/bin/python"

env -u PYTHONPATH $PY scripts/seo_analytics_auth.py --auth-url
# open the printed URL, approve Analytics + Search Console read access
# browser may error on localhost redirect — copy the full redirect URL

env -u PYTHONPATH $PY scripts/seo_analytics_auth.py --auth-code 'PASTE_FULL_REDIRECT_URL'
env -u PYTHONPATH $PY scripts/seo_analytics_auth.py --check
```

Token is stored at `.hermes/google_seo_token.json` (gitignored), separate from Workspace auth.

## Review

```bash
export PY="/Users/bennett/Hermes/planyourpark/.venv-analytics/bin/python"
env -u PYTHONPATH $PY scripts/seo_analytics_review.py          # last 28 days
env -u PYTHONPATH $PY scripts/seo_analytics_review.py --days 7
env -u PYTHONPATH $PY scripts/seo_analytics_review.py --section gsc
env -u PYTHONPATH $PY scripts/seo_analytics_review.py --section ga
```

Config: `scripts/seo_analytics_config.json`  
(`ga4_property_id` auto-fills on first successful GA discovery)

## Notes

- Always run with `env -u PYTHONPATH` in Hermes sessions so the project venv is not polluted by Hermes’ own Python path.
- Search Console data lags ~2 days; the review script accounts for that.
- Revoke: `env -u PYTHONPATH $PY scripts/seo_analytics_auth.py --revoke`
