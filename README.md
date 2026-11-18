# Matjhabeng Water PWA

Sankofa Digital’s prototype for monitoring water infrastructure and coordinating repairs in Matjhabeng, Free State, South Africa. It brings sensor readings, map-based triage and field repair evidence into one workflow.

**Status:** The repository contains prototype and simulation flows. A production deployment and municipal pilot have yet to be verified. Use synthetic data while developing or demonstrating the app.

## What’s in the repository

- **Telemetry** — ChirpStack/LoRaWAN ingest and a dashboard for reviewing network readings.
- **GIS** — a map and simulation controls for exploring suspected incidents.
- **Field operations** — repair tickets, geofence validation and staged repair evidence.
- **Reporting** — service-level views, project dossiers and an optional WhatsApp alert integration.

## Run locally

Use Node.js 22 LTS and npm. After cloning the repository:

```powershell
git clone https://github.com/OhhttooeXCIV/sankofa-water-pwa.git
cd sankofa-water-pwa
npm ci
Copy-Item .env.example .env.local
npm run dev
```

On macOS or Linux, use `cp .env.example .env.local` for the copy step. Open [localhost:3000](http://localhost:3000) for the app and [localhost:3000/api/v1/health](http://localhost:3000/api/v1/health) for the health endpoint. Inspect the response’s `supabase_connected` field to check database connectivity.

For database-backed flows, use a dedicated development Supabase project with PostGIS. Apply the [migrations](supabase/migrations/) in numeric order, then load [the seed file](supabase/seed.sql) if you need sample data. Set the Supabase URL and keys in `.env.local` using [.env.example](.env.example) as a reference. Configure ChirpStack and WhatsApp credentials only for integration testing. Keep service-role keys and integration secrets server-side.

## Verification

| Command | Scope |
| --- | --- |
| `npm run type-check` | TypeScript checks |
| `npm test -- --runInBand` | Jest unit and integration tests |
| `npm run test:e2e` | Playwright browser flows. Install Chromium with `npx playwright install chromium` first. |
| `npm run build` | Production bundle and build-time checks |

The initial import has a known Supabase RPC type error that blocks the production build. Jest also needs a TypeScript configuration loader that the current dependency list does not supply. Record any failed or blocked checks when submitting changes.

## Documentation and community

- [Architecture and design notes](docs/architecture.md)
- [Contributing guide](CONTRIBUTING.md)
- [Code of conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md)
- [Report a bug or propose a feature](https://github.com/OhhttooeXCIV/sankofa-water-pwa/issues/new/choose)

This repository currently has no published project license.
