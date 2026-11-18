# Sankofa Digital Matjhabeng Water PWA

Production-grade Progressive Web Application (PWA) for real-time water infrastructure monitoring, telemetry anomaly detection, and outage response orchestration for the **Matjhabeng Local Municipality** (Free State, South Africa).

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase SSR**.

---

## Architecture Overview

```
                      ┌─────────────────────────┐
                      │    LoRaWAN Gateways     │
                      │  (Matjhabeng Reservoirs) │
                      └────────────┬────────────┘
                                   │ ChirpStack Uplink
                                   ▼
                      ┌─────────────────────────┐
                      │  ChirpStack Webhook API  │
                      │  (/api/webhooks/chirp)  │
                      └────────────┬────────────┘
                                   │ Telemetry Ingest
                                   ▼
                      ┌─────────────────────────┐
                      │     Supabase Cloud      │
                      │ (PostgreSQL + Auth+ RLS) │
                      └────────────┬────────────┘
                                   │ Realtime Subscriptions
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Sankofa Water Next.js 15 PWA                     │
│  - Edge Functions deployed on Vercel (jnb1 / Johannesburg)     │
│  - App Router: Dashboard, Anomaly Heatmaps, Incident Tracking   │
│  - Service Worker: Offline-first cached telemetry inspection   │
│  - Meta WhatsApp Business API webhook for field alerts          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **Package Manager**: `npm` (v10+)
- **Supabase Account**: Project configured with South Africa or EU region
- **Vercel Account**: Linked repository for automated edge deployments (`jnb1`)
- **GitHub Repository**: GitHub Actions enabled for CI and Pages

---

## Step-by-Step Setup Guide

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-org/senatla-ops-internal-automation-solution.git
cd senatla-ops-internal-automation-solution/sankofa-water-pwa
npm install
```

### 2. Environment Variables Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Populate the required configuration keys:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Base public URL (`http://localhost:3000` in local dev) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project REST URL (`https://<proj>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key with RLS enforcement |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase elevated key for backend webhooks & mutations |
| `CHIRPSTACK_WEBHOOK_SECRET` | HMAC secret to authenticate incoming LoRaWAN uplinks |
| `META_WHATSAPP_TOKEN` | WhatsApp Cloud API Bearer Token |
| `META_WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Business Sender Phone ID |

---

### 3. Supabase Database & Security Setup

1. In Supabase Dashboard, run the database migrations for:
   - `sensors`: telemetry sensor records (reservoir level, flow rate, pressure, conductivity).
   - `telemetry_readings`: timescaled sensor log partitions.
   - `incidents`: critical water infrastructure outages and ticket states.
2. Ensure Row Level Security (RLS) is enabled on all tables.
3. Configure authentication redirect URLs in **Supabase Auth > URL Configuration**:
   - Site URL: `https://<your-vercel-domain>.vercel.app`
   - Redirect URL: `https://<your-vercel-domain>.vercel.app/**` and `http://localhost:3000/**`

---

### 4. Local Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- Type checks: `npm run type-check`
- Unit tests: `npm test`
- E2E tests: `npm run test:e2e`

---

### 5. Vercel Deployment (Johannesburg `jnb1`)

The repository includes `vercel.json` pinned to the `jnb1` (Johannesburg) region to minimize latency for field technicians across the Matjhabeng municipality.

1. Connect the GitHub repository in the [Vercel Dashboard](https://vercel.com).
2. Set Root Directory to `sankofa-water-pwa`.
3. Add the environment variables from `.env.local` to the Vercel Project Settings.
4. Deploy. Subsequent pushes to `main` will automatically trigger preview/production edge builds in `jnb1`.

---

### 6. GitHub Pages Documentation Deployments

Project documentation residing in `docs/` is automatically built and deployed to GitHub Pages on every push to `main` via `.github/workflows/pages.yml`.

1. Go to repository **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Push changes to `main` to trigger the build.

---

## Testing Strategy

- **Unit & Component Testing**: Jest + `@testing-library/react` configured with `@/` path aliasing in `jest.config.ts`.
- **End-to-End Testing**: Playwright configured for Desktop Chromium and Mobile Chrome (Pixel 7 viewport) targeting South African locale (`en-ZA`) and timezone (`Africa/Johannesburg`).
- **Continuous Integration**: `.github/workflows/ci.yml` runs linter, TypeScript check, Jest unit tests, and Playwright tests on every PR.

---

## PWA Capabilities

- Offline shell navigation via custom Service Worker headers.
- Installable manifest (`public/manifest.json`) supporting maskable adaptive icons.
- Pinned viewport settings for Android & iOS notch/home indicator safe areas.
