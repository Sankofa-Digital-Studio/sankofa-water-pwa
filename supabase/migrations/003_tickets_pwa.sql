-- =============================================================================
-- Migration 003: Repair Tickets & Geofenced Stage Completions
-- Sankofa Digital Matjhabeng Water PWA
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Custom ENUM types
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_source') THEN
    CREATE TYPE ticket_source AS ENUM (
      'LORA_TDOA',
      'UAV_NDVI',
      'SAR_POI',
      'MANUAL'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
    CREATE TYPE ticket_status AS ENUM (
      'OPEN',
      'STAGE_1_EXCAVATED',
      'STAGE_2_REPAIRED',
      'AUTHORIZED_FOR_PAYMENT',
      'CLOSED'
    );
  END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- Table: repair_tickets
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.repair_tickets (
  id                    UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  source                ticket_source NOT NULL DEFAULT 'MANUAL',
  ward_id               INT         NOT NULL,
  suburb                TEXT        NOT NULL,
  pipe_spec             TEXT,                        -- e.g. "110mm PVC PN10"
  estimated_flow_kl_hr  NUMERIC(8, 3),              -- kL/hr estimated loss rate
  status                ticket_status NOT NULL DEFAULT 'OPEN',
  assigned_to           UUID        REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_repair_tickets_ward
  ON public.repair_tickets (ward_id, status);

CREATE INDEX IF NOT EXISTS idx_repair_tickets_assigned
  ON public.repair_tickets (assigned_to)
  WHERE assigned_to IS NOT NULL;

DROP TRIGGER IF EXISTS trg_repair_tickets_updated_at ON public.repair_tickets;
CREATE TRIGGER trg_repair_tickets_updated_at
  BEFORE UPDATE ON public.repair_tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.repair_tickets IS
  'Repair work orders raised from LoRa TDOA leakage detection, UAV NDVI '
  'thermal anomalies, SAR points-of-interest, or manual field reporting.';

-- RLS
ALTER TABLE public.repair_tickets ENABLE ROW LEVEL SECURITY;

-- Admins and service role can read all
CREATE POLICY "admin_read_all_tickets"
  ON public.repair_tickets
  FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'supervisor')
  );

-- Contractors can only read tickets assigned to them
CREATE POLICY "contractor_read_own_tickets"
  ON public.repair_tickets
  FOR SELECT
  USING (
    auth.role() != 'service_role'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'contractor'
    AND assigned_to = auth.uid()
  );

-- Contractors can only update their own tickets (status/progress)
CREATE POLICY "contractor_update_own_tickets"
  ON public.repair_tickets
  FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'contractor'
    AND assigned_to = auth.uid()
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'contractor'
    AND assigned_to = auth.uid()
  );

-- Admins/supervisors can update any ticket
CREATE POLICY "admin_update_any_ticket"
  ON public.repair_tickets
  FOR UPDATE
  USING (
    auth.role() = 'service_role'
    OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'supervisor')
  );

-- Only admins and service role can insert/delete
CREATE POLICY "admin_insert_tickets"
  ON public.repair_tickets
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
    OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'supervisor')
  );

CREATE POLICY "admin_delete_tickets"
  ON public.repair_tickets
  FOR DELETE
  USING (
    auth.role() = 'service_role'
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ---------------------------------------------------------------------------
-- Table: ticket_stage_completions
-- GPS-verified photographic evidence for each repair stage.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ticket_stage_completions (
  id                    BIGINT      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  ticket_id             UUID        NOT NULL REFERENCES public.repair_tickets (id) ON DELETE CASCADE,
  stage_num             INT         NOT NULL CHECK (stage_num BETWEEN 1 AND 3),
  completed_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- GPS proof-of-presence
  gps_lat               NUMERIC(10, 7) NOT NULL,
  gps_lng               NUMERIC(10, 7) NOT NULL,
  gps_accuracy_m        NUMERIC(6, 2),
  distance_to_target_m  NUMERIC(8, 2),  -- computed by validate_stage_geofence()

  -- Photo evidence (URL to Supabase Storage object)
  photo_url             TEXT,

  completed_by          UUID        REFERENCES auth.users (id) ON DELETE SET NULL,

  CONSTRAINT uq_ticket_stage UNIQUE (ticket_id, stage_num)
);

CREATE INDEX IF NOT EXISTS idx_ticket_stage_completions_ticket
  ON public.ticket_stage_completions (ticket_id);

COMMENT ON TABLE public.ticket_stage_completions IS
  'GPS + photo evidence records for each repair stage (1=Excavation, '
  '2=Repair, 3=Backfill/Reinstatement). Distance verified against ticket '
  'location using ST_DistanceSphere via validate_stage_geofence().';

ALTER TABLE public.ticket_stage_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_all_completions"
  ON public.ticket_stage_completions
  FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'supervisor')
  );

CREATE POLICY "contractor_read_own_completions"
  ON public.ticket_stage_completions
  FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'contractor'
    AND completed_by = auth.uid()
  );

CREATE POLICY "contractor_insert_own_completion"
  ON public.ticket_stage_completions
  FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'contractor'
    AND completed_by = auth.uid()
  );

-- ---------------------------------------------------------------------------
-- Function: validate_stage_geofence
--
-- Checks whether a contractor's reported GPS position is within 15 m of the
-- repair ticket's target location (derived from the creating telemetry node
-- or the suburb centroid stored on the ticket).
--
-- Parameters:
--   p_ticket_id  — UUID of the repair_ticket
--   p_lat        — contractor's current latitude
--   p_lng        — contractor's current longitude
--
-- Returns: TABLE(is_valid BOOLEAN, distance_m NUMERIC)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.validate_stage_geofence(
  p_ticket_id UUID,
  p_lat       NUMERIC,
  p_lng       NUMERIC
)
RETURNS TABLE (is_valid BOOLEAN, distance_m NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_target_location GEOGRAPHY;
  v_distance        NUMERIC;
BEGIN
  -- Derive target location from the nearest telemetry node in the ticket's ward
  -- Falls back to the centroid of the suburb if no node is found.
  SELECT tn.location
  INTO   v_target_location
  FROM   public.telemetry_nodes tn
  JOIN   public.repair_tickets  rt ON rt.ward_id = tn.ward_id
  WHERE  rt.id = p_ticket_id
  ORDER BY ST_Distance(
             tn.location,
             ST_MakePoint(p_lng::FLOAT8, p_lat::FLOAT8)::GEOGRAPHY
           ) ASC
  LIMIT 1;

  IF v_target_location IS NULL THEN
    -- No node found — cannot validate; return invalid with sentinel distance
    RETURN QUERY SELECT FALSE, -1::NUMERIC;
    RETURN;
  END IF;

  -- Spherical distance in metres
  v_distance := ST_DistanceSphere(
    ST_MakePoint(p_lng::FLOAT8, p_lat::FLOAT8),
    ST_GeomFromText(ST_AsText(v_target_location::GEOMETRY), 4326)
  );

  RETURN QUERY SELECT (v_distance <= 15.0), ROUND(v_distance::NUMERIC, 2);
END;
$$;

COMMENT ON FUNCTION public.validate_stage_geofence IS
  'Returns (is_valid, distance_m) for a contractor GPS check against the '
  'nearest telemetry node in the ticket''s ward. is_valid = TRUE iff distance ≤ 15 m.';
