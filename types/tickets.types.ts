// ============================================================
// Sankofa Digital Matjhabeng Water PWA — Ticket Types
// ============================================================

export type TicketStatus =
  | 'OPEN'
  | 'STAGE_1_EXCAVATED'
  | 'STAGE_2_REPAIRED'
  | 'AUTHORIZED_FOR_PAYMENT'
  | 'CLOSED';

export type TicketSource =
  | 'LORA_TDOA'
  | 'UAV_NDVI'
  | 'SAR_POI'
  | 'MANUAL';

export interface StageCompletion {
  id: string;
  ticketId: string;
  stageNum: 1 | 2 | 3;
  completedAt: string; // ISO 8601
  gpsLat: number;
  gpsLng: number;
  gpsAccuracyM: number;
  distanceToTargetM: number;
  photoUrl?: string;
  completedBy: string; // UUID of auth.users
}

export interface RepairTicket {
  id: string;
  source: TicketSource;
  wardId: number;
  suburb: string;
  street?: string;
  pipeSpec: string;
  estimatedFlowKlHr: number;
  status: TicketStatus;
  assignedTo?: string; // UUID
  gpsLat?: number;
  gpsLng?: number;
  createdAt: string;
  updatedAt: string;
  stages?: StageCompletion[];
}

export interface GeofenceResult {
  valid: boolean;
  distanceMeters: number;
  thresholdMeters: number;
  reason?: string;
}

export interface AdvanceStageRequest {
  ticketId: string;
  targetStage: 1 | 2 | 3;
  lat: number;
  lng: number;
  accuracyM: number;
  photoUrl?: string;
}
