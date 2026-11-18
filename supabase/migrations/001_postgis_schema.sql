-- =============================================================================
-- Migration 001: PostGIS Schema — Telemetry Nodes & Pressure Logs
-- Sankofa Digital Matjhabeng Water PWA
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Custom ENUM types
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pipe_material') THEN
    CREATE TYPE pipe_material AS ENUM ('AC', 'PVC', 'Ductile Iron');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'node_status') THEN
    CREATE TYPE node_status AS ENUM (
      'NOMINAL',
      'HAMMER_SURGE',
      'DEPRESSURIZED',
      'LOCAL_DRAW_FILTERED'
    );
  END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- Table: telemetry_nodes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.telemetry_nodes (
  id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name            TEXT        NOT NULL,
  ward_id         INT         NOT NULL,
  suburb          TEXT        NOT NULL,
  street          TEXT        NOT NULL,
  pipe_material   pipe_material NOT NULL DEFAULT 'PVC',
  burial_depth_m  NUMERIC(5, 2) NOT NULL DEFAULT 0.9,
  x_coord         NUMERIC(12, 7) NOT NULL,
  y_coord         NUMERIC(12, 7) NOT NULL,

  -- Pressure fields (bar)
  baseline_bar    NUMERIC(6, 3) NOT NULL DEFAULT 0,
  current_bar     NUMERIC(6, 3) NOT NULL DEFAULT 0,
  delta_bar       NUMERIC(6, 3) GENERATED ALWAYS AS (current_bar - baseline_bar) STORED,

  -- Radio / battery telemetry
  battery_mv      INT,
  rssi_dbm        INT,
  snr_db          NUMERIC(5, 2),

  status          node_status NOT NULL DEFAULT 'NOMINAL',

  -- PostGIS geometry (lon/lat WGS-84)
  location        GEOGRAPHY(POINT, 4326) NOT NULL,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Spatial index
CREATE INDEX IF NOT EXISTS idx_telemetry_nodes_location
  ON public.telemetry_nodes USING GIST (location);

-- Ward lookup index
CREATE INDEX IF NOT EXISTS idx_telemetry_nodes_ward
  ON public.telemetry_nodes (ward_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_telemetry_nodes_updated_at ON public.telemetry_nodes;
CREATE TRIGGER trg_telemetry_nodes_updated_at
  BEFORE UPDATE ON public.telemetry_nodes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enable RLS
ALTER TABLE public.telemetry_nodes ENABLE ROW LEVEL SECURITY;

-- Public read policy (dashboard)
CREATE POLICY "public_read_telemetry_nodes"
  ON public.telemetry_nodes
  FOR SELECT
  USING (true);

-- Service role write policy
CREATE POLICY "service_write_telemetry_nodes"
  ON public.telemetry_nodes
  FOR ALL
  USING (auth.role() = 'service_role');

-- ---------------------------------------------------------------------------
-- Table: pressure_logs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pressure_logs (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  node_id             BIGINT NOT NULL REFERENCES public.telemetry_nodes (id) ON DELETE CASCADE,
  ward_id             INT    NOT NULL,
  peak_pressure_bar   NUMERIC(6, 3) NOT NULL,
  delta_pressure_bar  NUMERIC(6, 3) NOT NULL DEFAULT 0,
  battery_mv          INT,
  rssi_dbm            INT,
  is_hammer_event     BOOLEAN NOT NULL DEFAULT false,
  sparkline_json      JSONB,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pressure_logs_node_id
  ON public.pressure_logs (node_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pressure_logs_ward
  ON public.pressure_logs (ward_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pressure_logs_hammer
  ON public.pressure_logs (is_hammer_event) WHERE is_hammer_event = true;

-- Enable RLS
ALTER TABLE public.pressure_logs ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "public_read_pressure_logs"
  ON public.pressure_logs
  FOR SELECT
  USING (true);

-- Service role write
CREATE POLICY "service_write_pressure_logs"
  ON public.pressure_logs
  FOR ALL
  USING (auth.role() = 'service_role');

-- ---------------------------------------------------------------------------
-- Function: evaluate_ward_emergency
--
-- Correlates readings from ≥3 nodes in the target ward and fires an alert
-- if the threshold is breached. Implements a 4-hour debounce via advisory
-- locks so only one concurrent call wins the right to dispatch.
--
-- Parameters:
--   target_ward  — ward_id to evaluate
--   is_surge     — TRUE → water hammer / surge event, FALSE → depressurisation
--
-- Returns: BOOLEAN — TRUE if an alert should be dispatched, FALSE otherwise
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.evaluate_ward_emergency(
  target_ward INT,
  is_surge    BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_matching_nodes  INT;
  v_last_alert      TIMESTAMPTZ;
  v_lock_key        BIGINT;
  v_lock_acquired   BOOLEAN;
  v_target_status   node_status;
BEGIN
  -- Map event type to expected node status
  v_target_status := CASE WHEN is_surge THEN 'HAMMER_SURGE'::node_status
                          ELSE 'DEPRESSURIZED'::node_status
                     END;

  -- Count how many nodes in the ward are currently in the target status
  SELECT COUNT(*) INTO v_matching_nodes
  FROM public.telemetry_nodes
  WHERE ward_id = target_ward
    AND status  = v_target_status;

  -- Minimum 3-node correlation required
  IF v_matching_nodes < 3 THEN
    RETURN FALSE;
  END IF;

  -- -------------------------------------------------------------------------
  -- 4-hour debounce — check last_alert_sent in ward_alert_locks
  -- -------------------------------------------------------------------------
  SELECT last_alert_sent INTO v_last_alert
  FROM public.ward_alert_locks
  WHERE ward_id = target_ward;

  IF v_last_alert IS NOT NULL AND (now() - v_last_alert) < INTERVAL '4 hours' THEN
    RETURN FALSE;  -- still within debounce window
  END IF;

  -- -------------------------------------------------------------------------
  -- Advisory lock — ensure only one concurrent caller dispatches
  -- Use a deterministic key: hash of (ward_id, 'ward_alert')
  -- -------------------------------------------------------------------------
  v_lock_key := hashtext(target_ward::TEXT || '_ward_emergency');

  -- pg_try_advisory_xact_lock is released automatically at transaction end
  v_lock_acquired := pg_try_advisory_xact_lock(v_lock_key);

  IF NOT v_lock_acquired THEN
    RETURN FALSE;  -- another caller won the lock; let it dispatch
  END IF;

  -- Re-check debounce inside the lock (prevents TOCTOU race)
  SELECT last_alert_sent INTO v_last_alert
  FROM public.ward_alert_locks
  WHERE ward_id = target_ward;

  IF v_last_alert IS NOT NULL AND (now() - v_last_alert) < INTERVAL '4 hours' THEN
    RETURN FALSE;
  END IF;

  -- -------------------------------------------------------------------------
  -- Upsert the lock record — caller is responsible for dispatching the alert
  -- -------------------------------------------------------------------------
  INSERT INTO public.ward_alert_locks (ward_id, last_alert_sent, lock_reason, created_at, updated_at)
  VALUES (
    target_ward,
    now(),
    CASE WHEN is_surge THEN 'HAMMER_SURGE_3NODE' ELSE 'DEPRESSURIZED_3NODE' END,
    now(),
    now()
  )
  ON CONFLICT (ward_id) DO UPDATE
    SET last_alert_sent = EXCLUDED.last_alert_sent,
        lock_reason     = EXCLUDED.lock_reason,
        updated_at      = now();

  RETURN TRUE;
END;
$$;

COMMENT ON FUNCTION public.evaluate_ward_emergency IS
  'Evaluates whether a ward-level emergency alert should be dispatched. '
  'Requires ≥3 nodes in the target status (HAMMER_SURGE or DEPRESSURIZED) '
  'and enforces a 4-hour debounce with advisory-lock protection against '
  'concurrent duplicate dispatch.';
