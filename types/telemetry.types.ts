// ============================================================
// Sankofa Digital Matjhabeng Water PWA — Telemetry Types
// ============================================================

export type PipeMaterial = 'AC' | 'PVC' | 'Ductile Iron';

export type NodeStatus =
  | 'NOMINAL'
  | 'HAMMER_SURGE'
  | 'DEPRESSURIZED'
  | 'LOCAL_DRAW_FILTERED';

export interface TelemetryNode {
  id: string;
  name: string;
  ward: number;
  suburb: string;
  street: string;
  material: PipeMaterial;
  /** Burial depth in metres */
  depth: number;
  /** Longitude (WGS-84) */
  x: number;
  /** Latitude (WGS-84) */
  y: number;
  baselineBar: number;
  currentBar: number;
  deltaBar: number;
  batteryMv: number;
  rssi: number;
  snr: number;
  status: NodeStatus;
  /** Array of recent pressure readings for mini sparkline chart */
  sparkline: number[];
}

export interface MapLayer {
  /** CAD pipe-network GeoJSON layer toggle */
  cadPipes: boolean;
  /** Asterra SAR leakage layer toggle */
  asterraSar: boolean;
  /** UAV NDVI vegetation-stress layer toggle */
  uavNdvi: boolean;
  /** LoRa node markers layer toggle */
  loraNodes: boolean;
  /** TDOA rupture-pinpoint layer toggle */
  tdoaPinpoint: boolean;
}

export interface TdoaAlert {
  /** IDs of the two nodes used for TDOA triangulation */
  between: [string, string];
  /** Delta time-of-arrival in milliseconds */
  deltaTMs: number;
  /** Assumed pressure-wave velocity in m/s (typically 1,200–1,400 for AC) */
  waveVelocityMs: number;
  /** Estimated rupture coordinate [lng, lat] */
  ruptureCoord: [number, number];
  /** Accuracy estimate in metres */
  accuracy: number;
}

export interface PressureLog {
  id: string;
  nodeId: string;
  wardId: number;
  peakPressureBar: number;
  deltaPressureBar: number;
  batteryMv: number;
  rssiDbm: number;
  isHammerEvent: boolean;
  sparklineJson: number[];
  createdAt: string; // ISO 8601
}

/** Raw 8-byte LoRaWAN uplink payload (decoded) */
export interface LoRaUplink {
  node_id: number;
  peak_cbar: number;
  delta_cbar: number;
  battery_mv: number;
}

/** Response shape returned by GET /api/v1/telemetry */
export interface TelemetryResponse {
  nodes: TelemetryNode[];
  timestamp: string;
  total: number;
}
