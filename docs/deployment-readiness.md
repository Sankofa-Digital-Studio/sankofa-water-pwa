# Deployment and operational readiness

## Current status

The README describes this repository as a prototype with simulation flows. A production deployment and municipal pilot have not been verified. Treat architecture and funding material in `docs/architecture.md` as design/specification material, not proof that the described infrastructure, integrations, regulatory approvals, service levels, or field deployment are operational.

Use synthetic data for development and demonstrations. Do not connect this prototype to live municipal infrastructure, dispatch real alerts, or enter personal or sensitive operational data without authorization, a reviewed deployment plan, and appropriate security/privacy controls.

## Environment and services

The application is a Next.js app. `.env.example` lists application, Supabase, ChirpStack webhook, and optional Meta/WhatsApp configuration. Keep server secrets (especially `SUPABASE_SERVICE_ROLE_KEY`, webhook secrets, and provider tokens) in the deployment platform's secret manager; never put them in client-side code or commit them. Only `NEXT_PUBLIC_*` variables are intended to be exposed to browsers.

Database-backed flows require a dedicated Supabase project with PostGIS and the SQL migrations in `supabase/migrations/` applied in numeric order. Validate schema changes and seed data in an isolated environment before any production rollout.

## Pre-deployment checklist

Before any real-world deployment, the responsible maintainers and operators should:

- Verify the deployed build, routes, authentication, authorization, and database policies in a staging environment.
- Resolve the known production build and test-runner blockers documented in the root README.
- Test migration application and recovery against a disposable database; plan backups and restore drills.
- Review access to geolocation, photographs, telemetry, personal information, and incident records; establish retention and deletion procedures.
- Verify webhook authentication, alert opt-in/consent, rate limits, monitoring, and failure handling without sending live alerts during tests.
- Test mobile devices, poor-connectivity behavior, offline synchronization, and field workflows with synthetic records.
- Obtain the required organizational, municipal, legal, privacy, radio, and operational approvals before handling real data or infrastructure.
- Document an accountable on-call contact, incident escalation process, rollback plan, and deployment owner.

This checklist is not a certification or legal determination. Record evidence and approval for each item before describing a deployment as production-ready.
