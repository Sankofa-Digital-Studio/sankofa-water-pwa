import {
  calculateRoi,
  calculateNrwDrop,
  calculateNrwPercentageDrop,
  formatZar,
} from '@/lib/utils/financial.utils';
import {
  getCapexTiers,
  getPilotMarginAnalysis,
} from '@/lib/services/financial.service';
import {
  MVP_0_PILOT_FEE_ZAR,
  MVP_0_DELIVERY_COST_ZAR,
  MVP_0_NET_PROFIT_ZAR,
  MVP_0_PROFIT_MARGIN_PERCENT,
} from '@/lib/constants/config';

describe('Financial Utilities & Commercial Margin (financial.utils.test.ts)', () => {
  describe('calculateRoi', () => {
    it('calculates Tier 1A MVP_0 turn-key pilot ROI (R150,000 fee, 18 bursts × 28 kL/hr × 120 hrs × R17.01)', () => {
      // 18 bursts * 28 kL/hr * 120 hrs = 60,480 kL = R 1,028,764.80 saved
      // ROI multiple on R150,000 turn-key pilot = 1,028,764.80 / 150,000 = ~6.86x
      const result = calculateRoi({
        capexZar: 150000,
        opexZarPerMonth: 0,
        burstsPreventedPerMonth: 18,
        avgFlowKlHr: 28,
        leakDurationHours: 120,
        tariffZarPerKl: 17.01,
        repairCostPerBurstZar: 0,
      });

      expect(result.monthlyWaterSavedKl).toBe(60480);
      expect(result.monthlyWaterSavingsZar).toBeCloseTo(1028765, -3);
      expect(result.roiMultiple).toBeCloseTo(6.86, 1);
      expect(result.paybackMonths).toBeLessThan(1.5);
    });

    it('calculates MVP_0 hardware-only baseline (R8000 capex, 18 bursts × 28 kL/hr × 120 hrs × R17.01)', () => {
      // 18 bursts * 28 kL/hr * 120 hrs = 60,480 kL
      // 60,480 kL * R17.01/kL = R 1,028,764.80
      // ROI multiple = ~128.42x - 128.6x
      const result = calculateRoi({
        capexZar: 8000,
        opexZarPerMonth: 0,
        burstsPreventedPerMonth: 18,
        avgFlowKlHr: 28,
        leakDurationHours: 120,
        tariffZarPerKl: 17.01,
        repairCostPerBurstZar: 0,
      });

      expect(result.monthlyWaterSavedKl).toBe(60480);
      expect(result.monthlyWaterSavingsZar).toBeCloseTo(1028765, -3);
      expect(result.roiMultiple).toBeCloseTo(128.42, 0);
      expect(result.paybackMonths).toBeLessThan(1);
    });

    it('handles zero or negative inputs gracefully', () => {
      const result = calculateRoi({
        capexZar: 150000,
        burstsPreventedPerMonth: 0,
        avgFlowKlHr: 0,
      });

      expect(result.monthlyWaterSavedKl).toBe(0);
      expect(result.monthlyWaterSavingsZar).toBe(0);
      expect(result.roiMultiple).toBe(0);
      expect(result.paybackMonths).toBe(999);
    });
  });

  describe('Commercial MVP-0 Profit Margin Architecture', () => {
    it('verifies exact 40.0% net operating margin on Tier 1A turn-key pilot', () => {
      const marginAnalysis = getPilotMarginAnalysis();

      expect(marginAnalysis.pilotFeeZar).toBe(MVP_0_PILOT_FEE_ZAR);
      expect(marginAnalysis.totalCostZar).toBe(MVP_0_DELIVERY_COST_ZAR);
      expect(marginAnalysis.netProfitZar).toBe(MVP_0_NET_PROFIT_ZAR);
      expect(marginAnalysis.profitMarginPercent).toBe(MVP_0_PROFIT_MARGIN_PERCENT);

      // Verify math: (Fee - Cost) / Fee == 40%
      const calculatedMargin =
        ((marginAnalysis.pilotFeeZar - marginAnalysis.totalCostZar) / marginAnalysis.pilotFeeZar) * 100;
      expect(calculatedMargin).toBe(40.0);

      // Verify cost itemization sums to total cost
      const totalItemizedCost = marginAnalysis.costBreakdown.reduce(
        (sum, item) => sum + item.costZar,
        0
      );
      expect(totalItemizedCost).toBe(MVP_0_DELIVERY_COST_ZAR);
    });

    it('verifies standardized capex tiers in financial service', () => {
      const tiers = getCapexTiers();
      const mvp0 = tiers.find((t) => t.id === 'MVP_0');

      expect(mvp0).toBeDefined();
      expect(mvp0?.capexZar).toBe(150000);
      expect(mvp0?.nodeCount).toBe(10);
      expect(mvp0?.paybackMonths).toBe(1.3);
    });
  });

  describe('calculateNrwDrop', () => {
    it('calculates physical volumetric NRW reduction in kL', () => {
      // 18 bursts * 28 kL/hr * 120 hours = 60480 kL
      const volumeKl = calculateNrwDrop(18, 28, 120);
      expect(volumeKl).toBe(60480);
    });

    it('calculates percentage drop capped at 24.5%', () => {
      // Standard 18 bursts * 28 kL/hr for 120 hours
      const pctDrop = calculateNrwPercentageDrop(18, 28, 120);
      expect(pctDrop).toBeGreaterThanOrEqual(24.0);
      expect(pctDrop).toBeLessThanOrEqual(24.5);

      // Huge burst volume should not exceed municipal realistic cap of 24.5%
      const cappedDrop = calculateNrwPercentageDrop(100, 100, 120);
      expect(cappedDrop).toBe(24.5);
    });

    it('returns 0 for non-positive parameters', () => {
      expect(calculateNrwDrop(0, 28)).toBe(0);
      expect(calculateNrwDrop(18, 0)).toBe(0);
      expect(calculateNrwPercentageDrop(-5, 28)).toBe(0);
    });
  });

  describe('formatZar', () => {
    it('formats R 1,234,567.00 with proper separators and currency prefix', () => {
      const formatted = formatZar(1234567);
      expect(formatted).toMatch(/R\s+1[,\s\u00a0]234[,\s\u00a0]567[.,]00/);
    });

    it('formats zero and cents correctly', () => {
      expect(formatZar(0)).toMatch(/R\s+0[.,]00/);
      expect(formatZar(17.01)).toMatch(/R\s+17[.,]01/);
    });
  });
});
