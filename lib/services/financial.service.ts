// =============================================================================
// Financial Service — Non-Revenue Water (NRW) Analytics & CAPEX Tiers
// Sankofa Digital Matjhabeng Water PWA
// =============================================================================

export interface NrwCalculationParams {
  /** Average pipe bursts or severe leak events per month */
  burstsPerMonth: number
  /** Average estimated flow rate of rupture in kL per hour (typically 15 - 50 kL/h) */
  flowRateKlPerHr: number
  /** Hours saved in leak detection and repair turnaround (e.g., 72h baseline down to 4h = 68h saved) */
  hoursSaved: number
  /** Municipal bulk or end-user water tariff in ZAR per kL (default: 28.50) */
  tariffZarPerKl?: number
  /** Total capital expenditure in ZAR for the deployment tier (default: 285,000 for MVP) */
  capexZar?: number
}

export interface NrwCalculationResult {
  /** Water saved per single burst event in kiloLitres */
  klSavedPerBurst: number
  /** Water saved per month across all bursts in kiloLitres */
  klSavedPerMonth: number
  /** Water saved per annum in kiloLitres */
  klSavedPerYear: number
  /** Financial value recovered per month in South African Rands (ZAR) */
  zarRecoveredPerMonth: number
  /** Financial value recovered per annum in South African Rands (ZAR) */
  zarRecoveredPerYear: number
  /** Annual Return on Investment multiple (annual savings / capex) */
  roiMultiple: number
  /** Payback period in months to recoup CAPEX investment */
  paybackMonths: number
}

export type CapexTierId = 'MVP_0' | 'LEAN_DMA' | 'FULL_3_TIER'

export interface CapexTier {
  id: CapexTierId
  name: string
  code: string
  nodeCount: number
  capexZar: number
  opexZarPerMonth: number
  description: string
  deliverables: string[]
  targetWards: string
  estimatedAnnualSavingsZar: number
  paybackMonths: number
}

/**
 * Calculates Non-Revenue Water (NRW) physical and financial recovery metrics.
 * Pure deterministic mathematical calculation matching the Matjhabeng Municipal Business Case.
 *
 * @param params - Configuration parameters for bursts, flow rate, hours saved, tariff, and CAPEX
 * @returns NrwCalculationResult containing physical water volume and financial recovery metrics
 */
export function calculateNrwFinancials(params: NrwCalculationParams): NrwCalculationResult {
  const {
    burstsPerMonth,
    flowRateKlPerHr,
    hoursSaved,
    tariffZarPerKl = 28.5,
    capexZar = 285_000,
  } = params

  const safeBursts = Math.max(0, burstsPerMonth)
  const safeFlow = Math.max(0, flowRateKlPerHr)
  const safeHours = Math.max(0, hoursSaved)
  const safeTariff = Math.max(0, tariffZarPerKl)
  const safeCapex = Math.max(0, capexZar)

  // Physical calculations
  const klSavedPerBurst = safeFlow * safeHours
  const klSavedPerMonth = klSavedPerBurst * safeBursts
  const klSavedPerYear = klSavedPerMonth * 12

  // Financial calculations
  const zarRecoveredPerMonth = klSavedPerMonth * safeTariff
  const zarRecoveredPerYear = klSavedPerYear * safeTariff

  // Investment ratios
  const roiMultiple = safeCapex > 0 ? Number((zarRecoveredPerYear / safeCapex).toFixed(2)) : 0
  const paybackMonths =
    zarRecoveredPerMonth > 0 ? Number((safeCapex / zarRecoveredPerMonth).toFixed(1)) : 0

  return {
    klSavedPerBurst: Math.round(klSavedPerBurst),
    klSavedPerMonth: Math.round(klSavedPerMonth),
    klSavedPerYear: Math.round(klSavedPerYear),
    zarRecoveredPerMonth: Math.round(zarRecoveredPerMonth),
    zarRecoveredPerYear: Math.round(zarRecoveredPerYear),
    roiMultiple,
    paybackMonths,
  }
}

/**
 * Returns the 3 standardized deployment CAPEX tiers for Matjhabeng Municipality.
 *
 * 1. MVP_0: 10 Nodes - Rapid deployment pilot for Welkom CBD & Riebeeckstad
 * 2. LEAN_DMA: 50 Nodes - 3 District Metered Areas with acoustic TDOA correlation
 * 3. FULL_3_TIER: 250+ Nodes - Comprehensive multi-tier network (Satellite SAR + UAV + LoRaWAN)
 */
export function getCapexTiers(): CapexTier[] {
  return [
    {
      id: 'MVP_0',
      name: 'Tier 1A: Rapid Pilot (10 Nodes / 90 Days)',
      code: 'MVP_0',
      nodeCount: 10,
      capexZar: 150_000,
      opexZarPerMonth: 0,
      description:
        'Immediate 10-node LoRaWAN pressure acoustic turn-key pilot covering high-risk transmission lines in Welkom CBD and Riebeeckstad.',
      deliverables: [
        '10x IP68 Submersible Pressure Transducers with LoRaWAN transmitters (Welkom Ward 3)',
        '1x High-site solar-powered 8-channel LoRaWAN Gateway with 53h LiFePO4 UPS',
        'Sankofa Field PWA with GPS 15m geofencing for contractors',
        'Full acoustic calibration, mechanical installation & crew onboarding',
        '3-Month Dedicated SLA monitoring & weekly water recovery audits',
      ],
      targetWards: 'Wards 3 & 5 (Welkom CBD, Riebeeckstad)',
      estimatedAnnualSavingsZar: 1_280_000,
      paybackMonths: 1.3,
    },
    {
      id: 'LEAN_DMA',
      name: 'Tier 2: Lean DMA Network (50 Nodes)',
      code: 'LEAN_DMA',
      nodeCount: 50,
      capexZar: 1_250_000,
      opexZarPerMonth: 42_000,
      description:
        '50-node district metered network across 3 major zones with acoustic time-difference-of-arrival (TDOA) leak localization.',
      deliverables: [
        '50x High-frequency pressure telemetry nodes',
        '3x High-gain gateway base stations',
        'Acoustic TDOA correlation pinpointing leaks to ±10m',
        'Automated pressure reduction valve (PRV) night-flow modulation',
        'Full POPIA Sec 69 compliant WhatsApp notification service',
      ],
      targetWards: 'Wards 3, 5, 7, 9 & 11 (CBD, Riebeeckstad, Thabong, Virginia, Odendaalsrus)',
      estimatedAnnualSavingsZar: 6_450_000,
      paybackMonths: 2.3,
    },
    {
      id: 'FULL_3_TIER',
      name: 'Tier 3: Municipal 3-Tier System (250+ Nodes)',
      code: 'FULL_3_TIER',
      nodeCount: 250,
      capexZar: 5_850_000,
      opexZarPerMonth: 165_000,
      description:
        'Comprehensive multi-layered pipeline monitoring combining Satellite SAR L-band interferometry, drone UAV multispectral NDVI, and IoT acoustic sensors.',
      deliverables: [
        '250x IoT Acoustic & Pressure Telemetry nodes across all 36 wards',
        'Sentinel-1 / ALOS-2 SAR L-band satellite subsurface moisture detection',
        'Quarterly UAV NDVI multispectral drone flyovers for transmission mains',
        'Municipal SCADA integration and live citizen SDBIP KPI audit dashboard',
        'Integrated contractor work order payment authorization escrow',
      ],
      targetWards: 'All 36 Wards (Matjhabeng Local Municipality)',
      estimatedAnnualSavingsZar: 32_800_000,
      paybackMonths: 2.1,
    },
  ]
}

export interface PilotCostItem {
  category: string;
  description: string;
  costZar: number;
}

export interface PilotMarginBreakdown {
  tierId: string;
  name: string;
  pilotFeeZar: number;
  totalCostZar: number;
  netProfitZar: number;
  profitMarginPercent: number;
  costBreakdown: PilotCostItem[];
}

/**
 * Returns detailed commercial cost and margin breakdown for the MVP-0 pilot,
 * ensuring a sustainable 40.0% net profit margin on delivery.
 */
export function getPilotMarginAnalysis(): PilotMarginBreakdown {
  return {
    tierId: 'MVP_0',
    name: 'MVP-0 90-Day Turn-Key Pilot',
    pilotFeeZar: 150_000,
    totalCostZar: 90_000,
    netProfitZar: 60_000,
    profitMarginPercent: 40.0,
    costBreakdown: [
      { category: 'Hardware BOM', description: '10x Boundary Watch nodes @ R620/unit', costZar: 6_200 },
      { category: 'High-Site Gateway & UPS', description: 'LoRaWAN 8-channel gateway + 53h LiFePO4 battery', costZar: 3_800 },
      { category: 'Connectivity & Cloud', description: '90-day cellular SIM, fiber backhaul & Supabase Edge hosting', costZar: 5_000 },
      { category: 'Mechanical Field Installation', description: '2 artisan plumbers, pit excavation & tap manifold fitting (5 days)', costZar: 18_000 },
      { category: 'GIS & Acoustic Calibration', description: 'PostGIS spatial network model, node acoustic baseline profiling', costZar: 15_000 },
      { category: 'Crew Enablement & Runbooks', description: 'Municipal field technician mobile PWA training & certification', costZar: 12_000 },
      { category: '3-Month SLA Operations', description: 'Dedicated telemetry monitoring, incident triage & weekly MFMA audit reports', costZar: 25_000 },
      { category: 'Consumables & Contingency', description: 'IP68 resin potting, brass fittings, replacement lithium cells', costZar: 5_000 },
    ],
  };
}
