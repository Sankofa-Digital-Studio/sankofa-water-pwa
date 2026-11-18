// =============================================================================
// Supabase Database TypeScript Types
// Auto-synchronized with migrations 001–004
// Sankofa Digital Matjhabeng Water PWA
// =============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ---------------------------------------------------------------------------
// Enumerations
// ---------------------------------------------------------------------------

export type PipeMaterial = 'AC' | 'PVC' | 'Ductile Iron'

export type NodeStatus =
  | 'NOMINAL'
  | 'HAMMER_SURGE'
  | 'DEPRESSURIZED'
  | 'LOCAL_DRAW_FILTERED'

export type TicketSource = 'LORA_TDOA' | 'UAV_NDVI' | 'SAR_POI' | 'MANUAL'

export type TicketStatus =
  | 'OPEN'
  | 'STAGE_1_EXCAVATED'
  | 'STAGE_2_REPAIRED'
  | 'AUTHORIZED_FOR_PAYMENT'
  | 'CLOSED'

export type FunderType = 'SEDA' | 'SEFA' | 'MINING_SLP' | 'MUNICIPAL'

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'

// ---------------------------------------------------------------------------
// Row types (what SELECT returns)
// ---------------------------------------------------------------------------

export interface TelemetryNodeRow {
  id: number
  name: string
  ward_id: number
  suburb: string
  street: string
  pipe_material: PipeMaterial
  burial_depth_m: number
  x_coord: number
  y_coord: number
  baseline_bar: number
  current_bar: number
  /** Generated column: current_bar - baseline_bar */
  delta_bar: number | null
  battery_mv: number | null
  rssi_dbm: number | null
  snr_db: number | null
  status: NodeStatus
  /** PostGIS GEOGRAPHY(POINT,4326) serialised as GeoJSON string by Supabase */
  location: string
  created_at: string
  updated_at: string
}

export interface PressureLogRow {
  id: number
  node_id: number
  ward_id: number
  peak_pressure_bar: number
  delta_pressure_bar: number
  battery_mv: number | null
  rssi_dbm: number | null
  is_hammer_event: boolean
  sparkline_json: Json | null
  created_at: string
}

export interface WardAlertLockRow {
  ward_id: number
  last_alert_sent: string
  lock_reason: string | null
  created_at: string
  updated_at: string
}

export interface WhatsappSubscriberRow {
  id: number
  phone_e164: string
  ward_id: number
  opted_in: boolean
  popia_consent_at: string | null
  created_at: string
}

export interface AlertDispatchLogRow {
  id: number
  ward_id: number
  alert_type: string
  message_text: string
  dispatched_at: string
  whatsapp_message_id: string | null
  recipients_count: number
}

export interface RepairTicketRow {
  id: string // UUID
  source: TicketSource
  ward_id: number
  suburb: string
  pipe_spec: string | null
  estimated_flow_kl_hr: number | null
  status: TicketStatus
  assigned_to: string | null // UUID → auth.users.id
  created_at: string
  updated_at: string
}

export interface TicketStageCompletionRow {
  id: number
  ticket_id: string // UUID
  stage_num: 1 | 2 | 3
  completed_at: string
  gps_lat: number
  gps_lng: number
  gps_accuracy_m: number | null
  distance_to_target_m: number | null
  photo_url: string | null
  completed_by: string | null // UUID → auth.users.id
}

export interface DossierSignatureRow {
  id: number
  dossier_code: string
  signatory_name: string
  signatory_role: string
  signed_at: string
  ref_code: string
  ip_hash: string
}

export interface FundingApplicationRow {
  id: number
  applicant_entity: string
  funder: FunderType
  amount_zar: number
  status: ApplicationStatus
  notes: string | null
  created_at: string
}

// ---------------------------------------------------------------------------
// Insert types (omit generated / defaulted columns)
// ---------------------------------------------------------------------------

export type TelemetryNodeInsert = Omit<
  TelemetryNodeRow,
  'id' | 'delta_bar' | 'created_at' | 'updated_at'
> & {
  id?: never
  delta_bar?: never
  created_at?: string
  updated_at?: string
}

export type PressureLogInsert = Omit<PressureLogRow, 'id' | 'created_at'> & {
  id?: never
  created_at?: string
}

export type WardAlertLockInsert = Omit<WardAlertLockRow, 'created_at' | 'updated_at'> & {
  created_at?: string
  updated_at?: string
}

export type WhatsappSubscriberInsert = Omit<WhatsappSubscriberRow, 'id' | 'created_at'> & {
  created_at?: string
}

export interface AlertDispatchLogInsert {
  id?: number | undefined
  ward_id: number
  alert_type: string
  message_text: string
  dispatched_at?: string | undefined
  whatsapp_message_id?: string | null | undefined
  recipients_count: number
}

export type RepairTicketInsert = Omit<
  RepairTicketRow,
  'id' | 'created_at' | 'updated_at'
> & {
  id?: string
  created_at?: string
  updated_at?: string
}

export type TicketStageCompletionInsert = Omit<
  TicketStageCompletionRow,
  'id' | 'completed_at'
> & {
  completed_at?: string
}

export type DossierSignatureInsert = Omit<DossierSignatureRow, 'id' | 'signed_at'> & {
  signed_at?: string
}

export type FundingApplicationInsert = Omit<
  FundingApplicationRow,
  'id' | 'created_at'
> & {
  created_at?: string
}

// ---------------------------------------------------------------------------
// Update types (all fields optional except PKs)
// ---------------------------------------------------------------------------

export type TelemetryNodeUpdate = Partial<
  Omit<TelemetryNodeRow, 'id' | 'delta_bar' | 'created_at'>
>

export type RepairTicketUpdate = Partial<
  Omit<RepairTicketRow, 'id' | 'created_at'>
>

export type WardAlertLockUpdate = Partial<Omit<WardAlertLockRow, 'ward_id' | 'created_at'>>

export type FundingApplicationUpdate = Partial<Omit<FundingApplicationRow, 'id' | 'created_at'>>

// ---------------------------------------------------------------------------
// Supabase Database schema type (used with createClient<Database>)
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      telemetry_nodes: {
        Row: TelemetryNodeRow
        Insert: TelemetryNodeInsert
        Update: TelemetryNodeUpdate
      }
      pressure_logs: {
        Row: PressureLogRow
        Insert: PressureLogInsert
        Update: Partial<Omit<PressureLogRow, 'id' | 'created_at'>>
      }
      ward_alert_locks: {
        Row: WardAlertLockRow
        Insert: WardAlertLockInsert
        Update: WardAlertLockUpdate
      }
      whatsapp_subscribers: {
        Row: WhatsappSubscriberRow
        Insert: WhatsappSubscriberInsert
        Update: Partial<Omit<WhatsappSubscriberRow, 'id' | 'created_at'>>
      }
      alert_dispatch_log: {
        Row: AlertDispatchLogRow
        Insert: AlertDispatchLogInsert
        Update: Partial<AlertDispatchLogRow>
      }
      repair_tickets: {
        Row: RepairTicketRow
        Insert: RepairTicketInsert
        Update: RepairTicketUpdate
      }
      ticket_stage_completions: {
        Row: TicketStageCompletionRow
        Insert: TicketStageCompletionInsert
        Update: Partial<TicketStageCompletionRow>
      }
      dossier_signatures: {
        Row: DossierSignatureRow
        Insert: DossierSignatureInsert
        Update: Partial<DossierSignatureRow>
      }
      funding_applications: {
        Row: FundingApplicationRow
        Insert: FundingApplicationInsert
        Update: FundingApplicationUpdate
      }
    }
    Views: Record<string, never>
    Functions: {
      evaluate_ward_emergency: {
        Args: { target_ward: number; is_surge: boolean }
        Returns: boolean
      }
      validate_stage_geofence: {
        Args: { p_ticket_id: string; p_lat: number; p_lng: number }
        Returns: Array<{ is_valid: boolean; distance_m: number }>
      }
    }
    Enums: {
      pipe_material: PipeMaterial
      node_status: NodeStatus
      ticket_source: TicketSource
      ticket_status: TicketStatus
      funder_type: FunderType
      application_status: ApplicationStatus
    }
  }
}
