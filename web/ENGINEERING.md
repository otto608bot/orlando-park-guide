# PlanYourPark Engineering Rules

Codex owns production authority for application code, Sanity mutation scripts, deploy readiness, and release QA.

Rufus/OpenClaw may still generate marketing inputs, content drafts, social copy, and automation artifacts. Those outputs are treated as inputs until Codex reviews and integrates them.

## Production Safety

- Do not push directly to `main`.
- Do not run Sanity mutations without an explicit dry-run review first.
- Production Sanity write scripts must require `--patch` for mutation.
- Credentials must come from environment variables or local ignored files, never source code.
- Batch Netlify rebuilds after Sanity changes.
- Run `npm run lint` and `npm run build` from `web/` before release when feasible.

## Ownership

- App architecture, bug fixes, shared data models, scripts, forms, affiliate routing, and deploy config are Codex-owned.
- Marketing automation outputs from Rufus stay useful, but they do not directly mutate code, Sanity, or deploy state without review.
