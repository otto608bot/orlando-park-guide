# Plan Your Park — Analytics & Search Console access

Local tooling so Hermes can pull GA4 + Search Console reviews for planyourpark.com.

## One-time setup

### 1. Enable APIs (project that owns the site-only OAuth client)

Dedicated project: [`plan-your-park-analytics`](https://console.cloud.google.com/home/dashboard?project=plan-your-park-analytics), created Oct 5, 2026, with Analytics Data/Admin and Search Console APIs enabled. The Desktop OAuth client JSON lives at `.hermes/google_seo_client_secret.json` (gitignored; mode 0600). The auth script prefers this local client and only falls back to `~/.hermes/google_client_secret.json` when the local file is absent. **Never commit either client secret or the token.**

- [Google Analytics Data API](https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com?project=plan-your-park-analytics)
- [Google Analytics Admin API](https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com?project=plan-your-park-analytics)
- [Google Search Console API](https://console.cloud.google.com/apis/library/searchconsole.googleapis.com?project=plan-your-park-analytics)

Before reauthorizing on the new client, publish the reviewed app homepage/privacy pages, set the matching URLs under [Branding](https://console.cloud.google.com/auth/branding?project=plan-your-park-analytics), and move the site-only app beyond Testing under [Audience](https://console.cloud.google.com/auth/audience?project=plan-your-park-analytics). Never migrate the shared Hermes Workspace client for this site's branding. During Testing, add the operator account as a test user if needed.

### 2. Confirm product access

Using the **same Google account** you’ll authorize:

- GA4 property that serves measurement ID `G-SJHPEWNBLS` (already embedded in `web/src/app/layout.tsx`)
- Search Console property for `planyourpark.com` (URL-prefix or domain property)

### 3. Authorize (agent-mediated)

```bash
# from repo root
export PY="/Users/bennett/Hermes/planyourpark/.venv-analytics/bin/python"

env -u PYTHONPATH $PY scripts/seo_analytics_auth.py --auth-url
# Open the printed URL in the visible Hermes preview. The account holder approves
# only Analytics + Search Console read access there; no code/redirect is pasted in chat.
# Hermes reads the localhost redirect privately from the preview and exchanges it.
env -u PYTHONPATH $PY scripts/seo_analytics_auth.py --auth-code 'LOCAL_REDIRECT_FROM_PREVIEW'
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
