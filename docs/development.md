# Development guide

This guide supplements the [README](../README.md) with a practical local setup and verification checklist for the Matjhabeng Water PWA prototype.

## Requirements

- Node.js 22 LTS (Node.js 20 or newer is declared in `package.json`; the README's tested recommendation is Node.js 22).
- npm.
- A dedicated Supabase development project with PostGIS only when exercising database-backed flows.

## Start the application

```sh
npm ci
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env.local` instead of `cp`. Set only the values needed for your chosen flow. Never commit `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY` to browser code. Variables prefixed `NEXT_PUBLIC_` are client-visible.

The local app is served at `http://localhost:3000`; the health endpoint is `http://localhost:3000/api/v1/health`.

## Database-backed development

Use an isolated, non-production Supabase project with PostGIS. Apply SQL migrations in numeric order from `supabase/migrations/`; load `supabase/seed.sql` only when appropriate for your test scenario. Review migration changes carefully and do not run development seeds against production data.

The `.env.example` documents Supabase, ChirpStack webhook, and optional WhatsApp integration variables. Configure real third-party credentials only in an authorized development environment. Use synthetic data for demos and development, as the README specifies.

## Checks

```sh
npm run type-check
npm test -- --runInBand
npx playwright install chromium
npm run test:e2e
npm run build
```

Playwright browser installation is needed before the browser tests. Consult the root README's Verification section for known setup/build blockers; do not treat a successful local run as evidence that the prototype is production-ready.

## Contribution expectations

Read [CONTRIBUTING.md](../CONTRIBUTING.md) and [SECURITY.md](../SECURITY.md) before submitting changes. For field-workflow changes, document relevant device permissions, network conditions, and test evidence. For database changes, use an isolated development project and include migration/rollback considerations in the pull request.
