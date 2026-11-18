-- =============================================================================
-- Migration 002: Ward Alerts — Locks, WhatsApp Subscribers, Dispatch Log
-- Sankofa Digital Matjhabeng Water PWA
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Table: ward_alert_locks
-- Prevents duplicate emergency alerts within a 4-hour debounce window.
-- Referenced by evaluate_ward_emergency() in migration 001.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ward_alert_locks (
  ward_id         INT         PRIMARY KEY,
  last_alert_sent TIMESTAMPTZ NOT NULL DEFAULT now(),
  lock_reason     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_ward_alert_locks_updated_at ON public.ward_alert_locks;
CREATE TRIGGER trg_ward_alert_locks_updated_at
  BEFORE UPDATE ON public.ward_alert_locks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.ward_alert_locks ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write lock records
CREATE POLICY "service_all_ward_alert_locks"
  ON public.ward_alert_locks
  FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE public.ward_alert_locks IS
  'Per-ward mutex for emergency alert dispatching. '
  'evaluate_ward_emergency() upserts a row when it wins the advisory lock, '
  'preventing re-alerts within a 4-hour window.';

-- ---------------------------------------------------------------------------
-- Table: whatsapp_subscribers
-- POPIA Section 69 compliant — explicit opt-in with consent timestamp.
-- No marketing use. Consent logged at time of subscription.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.whatsapp_subscribers (
  id               BIGINT      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  phone_e164       TEXT        NOT NULL,         -- e.g. +27831234567
  ward_id          INT         NOT NULL,
  opted_in         BOOLEAN     NOT NULL DEFAULT false,
  popia_consent_at TIMESTAMPTZ,                  -- NULL until explicit consent given
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT uq_subscriber_phone_ward UNIQUE (phone_e164, ward_id),
  CONSTRAINT chk_popia_consent CHECK (
    (opted_in = false) OR (opted_in = true AND popia_consent_at IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_subscribers_ward
  ON public.whatsapp_subscribers (ward_id)
  WHERE opted_in = true;

COMMENT ON TABLE public.whatsapp_subscribers IS
  'WhatsApp alert subscribers. POPIA Sec 69 compliant: opted_in can only be '
  'TRUE when popia_consent_at is recorded. No marketing data; emergency alerts only.';

COMMENT ON COLUMN public.whatsapp_subscribers.phone_e164 IS
  'E.164 format phone number, e.g. +27831234567. Never store raw IPs here.';

ALTER TABLE public.whatsapp_subscribers ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own subscription record (matched by phone via JWT custom claim)
CREATE POLICY "owner_read_own_subscription"
  ON public.whatsapp_subscribers
  FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR auth.uid()::TEXT = (SELECT raw_user_meta_data->>'phone_e164'
                           FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "service_write_subscriptions"
  ON public.whatsapp_subscribers
  FOR ALL
  USING (auth.role() = 'service_role');

-- ---------------------------------------------------------------------------
-- Table: alert_dispatch_log
-- Immutable audit trail of every WhatsApp alert dispatched.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.alert_dispatch_log (
  id                  BIGINT      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  ward_id             INT         NOT NULL,
  alert_type          TEXT        NOT NULL,       -- e.g. 'HAMMER_SURGE', 'DEPRESSURIZED'
  message_text        TEXT        NOT NULL,
  dispatched_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  whatsapp_message_id TEXT,                       -- Meta API wamid
  recipients_count    INT         NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_alert_dispatch_log_ward
  ON public.alert_dispatch_log (ward_id, dispatched_at DESC);

COMMENT ON TABLE public.alert_dispatch_log IS
  'Append-only audit log of all WhatsApp emergency alerts dispatched. '
  'whatsapp_message_id stores the Meta API wamid for delivery tracking.';

ALTER TABLE public.alert_dispatch_log ENABLE ROW LEVEL SECURITY;

-- Admins and service role can read; service role only can insert
CREATE POLICY "admin_read_dispatch_log"
  ON public.alert_dispatch_log
  FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "service_insert_dispatch_log"
  ON public.alert_dispatch_log
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
