/**
 * Battery life and energy consumption calculation utilities for LoRaWAN telemetry nodes.
 */

import { BATTERY_CAPACITY_MAH, AVG_CURRENT_UA } from '@/lib/constants/config';

/**
 * Calculates daily energy consumption in microampere-hours (µAh/day).
 * Default: 11.2 µA average * 24 hours = 268.8 µAh/day
 * @param avgCurrentUa Average current consumption in µA (default 11.2 µA)
 */
export function calculateDailyConsumptionUah(avgCurrentUa: number = AVG_CURRENT_UA): number {
  return parseFloat((avgCurrentUa * 24).toFixed(4));
}

/**
 * Calculates theoretical battery lifespan in years based on usable capacity and daily consumption.
 * Formula: (Capacity_mAh * 1000 * usable_fraction) / daily_consumption_uAh / 365
 * Default: 3000 mAh * 0.75 usable / 268.8 µAh/day / 365 days ≈ 22.9 years
 * @param capacityMah Total battery capacity in mAh (e.g. 3000 mAh)
 * @param usableRatio Fraction of capacity usable (e.g. 0.75 for LiFePO4 DOD safety)
 * @param dailyConsumptionUah Daily consumption in µAh/day (e.g. 268.8 µAh/day)
 */
export function calculateTheoreticalBatteryLifeYears(
  capacityMah: number = BATTERY_CAPACITY_MAH,
  usableRatio: number = 0.75,
  dailyConsumptionUah: number = calculateDailyConsumptionUah()
): number {
  if (dailyConsumptionUah <= 0) return 0;
  const usableCapacityUah = capacityMah * 1000 * usableRatio;
  const days = usableCapacityUah / dailyConsumptionUah;
  return parseFloat((days / 365).toFixed(1));
}

/**
 * Calculates realistic operating life taking chemistry self-discharge / shelf life into account.
 * Real LiFePO4 battery shelf life typically caps service life at 6-7 years.
 */
export function calculateRealBatteryLifeYears(
  theoreticalYears: number = calculateTheoreticalBatteryLifeYears(),
  shelfLifeCapYears: number = 7
): number {
  return Math.min(theoreticalYears, shelfLifeCapYears);
}
