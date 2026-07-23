# Security — Sanity token revoke — 2026-07-23

## Action
Bennett deleted legacy Sanity API token **Rufus New** (Editor, ~2 months old) from project Tokens UI.

## Kept
- **Herman** (Editor, ~2 weeks) — current agent/editor token

## Code status
- Write scripts require `SANITY_API_TOKEN` / `SANITY_TOKEN` from env (no hardcoded secrets in repo)
- Public read integrity checks still use Sanity public API (no token)

## Follow-up
- None required for revoke
- Do not commit Herman’s secret; store only in env / local secret files
