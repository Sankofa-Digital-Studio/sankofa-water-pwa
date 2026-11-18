// ============================================================
// Sankofa Digital Matjhabeng Water PWA — Financial Utilities
// ============================================================

import { WATER_TARIFF_ZAR_PER_KL } from '@/lib/constants/config';

export interface RoiParams {
  /** Capital expenditure in ZAR */
  capexZar: number;
  /** Monthly operational expenditure in ZAR */
  opexZarPerMonth?: number;
  /** Number of pipe bursts prevented per month */
  burstsPreventedPerMonth: number;
  /** Average flow rate of burst/leak in kL per hour */
  avgFlowKlHr: number;
  /** Average repair duration or leak duration before intervention (in hours) */
  leakDurationHours?: number;
  /** Bulk water tariff per kL in ZAR (defaults to 17.01) */
  tariffZarPerKl?: number;
  /** Average civil repair cost per burst in ZAR (pipe, labour, plant) */
  repairCostPerBurstZar?: number;
}

export interface RoiResult {
  monthlyWaterSavedKl: number;
  monthlyWaterSavingsZar: number;
  monthlyRepairSavingsZar: number;
  monthlyTotalSavingsZar: number;
  netMonthlyBenefitZar: number;
  paybackMonths: number;
  annualRoiPercent: number;
  roiMultiple: number;
}

/**
 * Calculates Non-Revenue Water (NRW) reduction / drop in kL or percentage.
 * Formula: bursts * avgFlowKlHr * durationHours
 * Default duration assumes 48 hours typical baseline before pin-point acoustic detection.
 * If asPercentage is true, returns percentage drop (capped at 24.5% per municipal model).
 */
export function calculateNrwDrop(
  bursts: number,
  avgFlowKlHr: number,
  durationHoursOrOptions: number | { hours?: number; returnPercentage?: boolean } = 48,
  asPercentageFlag: boolean = false
): number {
  if (bursts <= 0 || avgFlowKlHr <= 0) return 0;

  const durationHours =
    typeof durationHoursOrOptions === 'number'
      ? durationHoursOrOptions
      : (durationHoursOrOptions?.hours ?? 48);

  const asPercentage =
    typeof durationHoursOrOptions === 'object'
      ? !!durationHoursOrOptions.returnPercentage
      : asPercentageFlag;

  const klSaved = bursts * avgFlowKlHr * durationHours;

  if (asPercentage) {
    // Matjhabeng municipal model: max achievable NRW percentage drop capped at 24.5%
    return Math.min(24.5, parseFloat(((klSaved / 250000) * 100).toFixed(1)));
  }

  return klSaved;
}

/**
 * Calculates NRW percentage drop directly. Capped at 24.5%.
 */
export function calculateNrwPercentageDrop(
  bursts: number,
  avgFlowKlHr: number,
  durationHours: number = 120
): number {
  return calculateNrwDrop(bursts, avgFlowKlHr, durationHours, true);
}

/**
 * Calculates ROI and financial payback for Sankofa smart IoT interventions.
 * Matches exact municipal economic model from Matjhabeng water loss demo.
 */
export function calculateRoi(params: RoiParams): RoiResult {
  const {
    capexZar,
    opexZarPerMonth = 0,
    burstsPreventedPerMonth,
    avgFlowKlHr,
    leakDurationHours = 48,
    tariffZarPerKl = WATER_TARIFF_ZAR_PER_KL,
    repairCostPerBurstZar = 45000, // Average civil repair per major burst
  } = params;

  // Water volume saved monthly (kL)
  const monthlyWaterSavedKl = calculateNrwDrop(
    burstsPreventedPerMonth,
    avgFlowKlHr,
    leakDurationHours
  );

  // Monetary savings on bulk water procurement
  const monthlyWaterSavingsZar = monthlyWaterSavedKl * tariffZarPerKl;

  // Civil repair & excavation cost savings
  const monthlyRepairSavingsZar = burstsPreventedPerMonth * repairCostPerBurstZar;

  // Total monthly savings
  const monthlyTotalSavingsZar = monthlyWaterSavingsZar + monthlyRepairSavingsZar;

  // Net benefit after ongoing IoT opex
  const netMonthlyBenefitZar = monthlyTotalSavingsZar - opexZarPerMonth;

  // Simple payback period in months
  const paybackMonths =
    netMonthlyBenefitZar > 0
      ? parseFloat((capexZar / netMonthlyBenefitZar).toFixed(1))
      : 999.0;

  // Annual ROI percentage: (Annual Net Benefit / Capex) * 100
  const annualRoiPercent =
    capexZar > 0
      ? parseFloat(((netMonthlyBenefitZar * 12) / capexZar * 100).toFixed(1))
      : 0;

  // ROI Multiple (e.g. 128.42x for MVP_0)
  const roiMultiple =
    capexZar > 0 ? parseFloat((monthlyWaterSavingsZar / capexZar).toFixed(2)) : 0;

  return {
    monthlyWaterSavedKl: Math.round(monthlyWaterSavedKl),
    monthlyWaterSavingsZar: Math.round(monthlyWaterSavingsZar),
    monthlyRepairSavingsZar: Math.round(monthlyRepairSavingsZar),
    monthlyTotalSavingsZar: Math.round(monthlyTotalSavingsZar),
    netMonthlyBenefitZar: Math.round(netMonthlyBenefitZar),
    paybackMonths,
    annualRoiPercent,
    roiMultiple,
  };
}

/**
 * Formats numeric monetary amounts into South African Rand string:
 * e.g. "R 1,234,567.00"
 */
export function formatZar(amount: number): string {
  const formatted = new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `R ${formatted}`;
}
