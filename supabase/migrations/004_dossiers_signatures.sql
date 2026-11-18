-- =============================================================================
-- Migration 004: Dossier Signatures & Funding Applications
-- Sankofa Digital Matjhabeng Water PWA
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Custom ENUM types
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'funder_type') THEN
    CREATE TYPE funder_type AS ENUM (
      'SEDA',
      'SEFA',
      'MINING_SLP',
      'MUNICIPAL'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
    CREATE TYPE application_status AS ENUM (
      'DRAFT',
      'SUBMITTED',
      'UNDER_REVIEW',
      'APPROVED',
      'REJECTED'
    );
  END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- Table: dossier_signatures
-- Electronic signature records. POPIA compliant: IP address is hashed
-- (SHA-256) before storage — no raw IPs persisted.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dossier_signatures (
  id              BIGINT      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  dossier_code    TEXT        NOT NULL,          -- e.g. 'DSR-2024-WW-001'
  signatory_name  TEXT        NOT NULL,
  signatory_role  TEXT        NOT NULL,          -- e.g. 'Technical Director'
  signed_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  ref_code        TEXT        NOT NULL UNIQUE,   -- e.g. 'SIG-20241116-XK9'
  ip_hash         TEXT        NOT NULL           -- SHA-256 hex of originating IP
                                                 -- (POPIA: no raw IPs stored)
);

CREATE INDEX IF NOT EXISTS idx_dossier_signatures_dossier
  ON public.dossier_signatures (dossier_code);

COMMENT ON TABLE public.dossier_signatures IS
  'Electronic signature audit records for Sankofa dossiers. '
  'POPIA Sec 69 compliant: ip_hash is SHA-256 of originating IPv4/IPv6; '
  'raw IP addresses are never persisted.';

COMMENT ON COLUMN public.dossier_signatures.ip_hash IS
  'SHA-256 hex digest of the originating client IP. '
  'Raw IP is discarded server-side before INSERT (POPIA).';

COMMENT ON COLUMN public.dossier_signatures.ref_code IS
  'Unique signature reference code, e.g. SIG-YYYYMMDD-XXXXX. '
  'Used for verification without exposing internal IDs.';

ALTER TABLE public.dossier_signatures ENABLE ROW LEVEL SECURITY;

-- Public can verify by ref_code (read-only)
CREATE POLICY "public_verify_signature"
  ON public.dossier_signatures
  FOR SELECT
  USING (true);

-- Only service role can insert
CREATE POLICY "service_insert_signature"
  ON public.dossier_signatures
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Nobody can update or delete (immutable audit log)
-- (No UPDATE/DELETE policies → denied for all roles except superuser)

-- ---------------------------------------------------------------------------
-- Table: funding_applications
-- Tracks grant and funding applications to SEDA, SEFA, Mining SLPs, etc.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.funding_applications (
  id                BIGINT           PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  applicant_entity  TEXT             NOT NULL,   -- e.g. 'Senatla Operations (Pty) Ltd'
  funder            funder_type      NOT NULL,
  amount_zar        NUMERIC(14, 2)   NOT NULL CHECK (amount_zar > 0),
  status            application_status NOT NULL DEFAULT 'DRAFT',
  notes             TEXT,
  created_at        TIMESTAMPTZ      NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_funding_applications_funder
  ON public.funding_applications (funder, status);

COMMENT ON TABLE public.funding_applications IS
  'Funding and grant applications submitted on behalf of Sankofa / Senatla. '
  'Funders: SEDA (Small Enterprise Development Agency), '
  'SEFA (Small Enterprise Finance Agency), '
  'Mining SLP (Social and Labour Plan obligations), '
  'MUNICIPAL (municipal infrastructure grants).';

ALTER TABLE public.funding_applications ENABLE ROW LEVEL SECURITY;

-- Admins and service role can read all
CREATE POLICY "admin_read_funding"
  ON public.funding_applications
  FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'supervisor')
  );

-- Only service role / admin can insert or update
CREATE POLICY "admin_write_funding"
  ON public.funding_applications
  FOR ALL
  USING (
    auth.role() = 'service_role'
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
