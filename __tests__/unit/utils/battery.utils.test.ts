import {
  calculateDailyConsumptionUah,
  calculateTheoreticalBatteryLifeYears,
  calculateRealBatteryLifeYears,
} from '@/lib/utils/battery.utils';
import { BATTERY_CAPACITY_MAH, AVG_CURRENT_UA } from '@/lib/constants/config';

describe('Battery & Low-Power Telemetry Calculations (battery.utils.test.ts)', () => {
  it('verifies that 11.2 µA average × 24hrs = 268.8 µAh/day', () => {
    const dailyConsumption = calculateDailyConsumptionUah(11.2);
    expect(dailyConsumption).toBe(268.8);

    // Verify using system configuration default
    expect(calculateDailyConsumptionUah(AVG_CURRENT_UA)).toBe(268.8);
  });

  it('verifies 3000mAh × 0.75 usable ÷ 268.8 µAh/day ÷ 365 = ~22.9 years (theoretical)', () => {
    // Usable capacity: 3000 mAh * 1000 µA/mA * 0.75 = 2,250,000 µAh
    // Days of operation: 2,250,000 / 268.8 = 8370.38 days
    // Lifespan: 8370.38 / 365 ≈ 22.93 years
    const theoreticalYears = calculateTheoreticalBatteryLifeYears(3000, 0.75, 268.8);
    expect(theoreticalYears).toBeCloseTo(22.9, 1);

    // Verify using system config defaults
    const defaultLife = calculateTheoreticalBatteryLifeYears(BATTERY_CAPACITY_MAH, 0.75);
    expect(defaultLife).toBeCloseTo(22.9, 1);
  });

  it('verifies that real battery shelf life limits service life to 6-7 years', () => {
    const theoreticalYears = calculateTheoreticalBatteryLifeYears(3000, 0.75, 268.8);
    expect(theoreticalYears).toBeGreaterThan(20);

    // Real LiFePO4 chemical electrolyte passivation caps service life
    const realisticYears = calculateRealBatteryLifeYears(theoreticalYears, 7);
    expect(realisticYears).toBeLessThanOrEqual(7);
    expect(realisticYears).toBeGreaterThanOrEqual(6);
  });
});
