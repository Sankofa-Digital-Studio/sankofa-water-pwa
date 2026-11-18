import {
  cbarToBar,
  mvToPercent,
  isHammerEvent,
  isDepressurized,
  formatBar,
} from '@/lib/utils/pressure.utils';

describe('Pressure Utilities (pressure.utils.ts)', () => {
  describe('cbarToBar', () => {
    it('converts 360 cbar to 3.6 bar', () => {
      expect(cbarToBar(360)).toBe(3.6);
    });

    it('converts 0 cbar to 0 bar', () => {
      expect(cbarToBar(0)).toBe(0);
    });

    it('converts 1200 cbar to 12 bar', () => {
      expect(cbarToBar(1200)).toBe(12);
    });

    it('handles negative or unusual pressure spikes', () => {
      expect(cbarToBar(-50)).toBe(-0.5);
    });
  });

  describe('mvToPercent', () => {
    it('maps 3000 mV to 0% battery', () => {
      expect(mvToPercent(3000)).toBe(0);
      expect(mvToPercent(2900)).toBe(0);
    });

    it('maps 3650 mV to 100% battery', () => {
      expect(mvToPercent(3650)).toBe(100);
      expect(mvToPercent(3700)).toBe(100);
    });

    it('maps nominal operational voltage 3580 mV on LiFePO4 curve', () => {
      const pct = mvToPercent(3580);
      expect(pct).toBeGreaterThanOrEqual(65);
      expect(pct).toBeLessThanOrEqual(100);
    });

    it('calculates mid-point charge correctly', () => {
      expect(mvToPercent(3325)).toBe(50);
    });
  });

  describe('isHammerEvent', () => {
    it('identifies 1.5 bar as a hammer event (exact threshold)', () => {
      expect(isHammerEvent(1.5)).toBe(true);
    });

    it('identifies delta > 1.5 bar as a hammer event', () => {
      expect(isHammerEvent(11.8)).toBe(true);
      expect(isHammerEvent(-2.0)).toBe(true);
    });

    it('rejects delta 1.4 bar as below hammer threshold', () => {
      expect(isHammerEvent(1.4)).toBe(false);
      expect(isHammerEvent(-1.4)).toBe(false);
      expect(isHammerEvent(0)).toBe(false);
    });
  });

  describe('isDepressurized', () => {
    it('detects 0.99 bar as depressurized (burst / main outage)', () => {
      expect(isDepressurized(0.99)).toBe(true);
      expect(isDepressurized(0.5)).toBe(true);
      expect(isDepressurized(0)).toBe(true);
    });

    it('rejects 1.0 bar as not depressurized (nominal boundary)', () => {
      expect(isDepressurized(1.0)).toBe(false);
      expect(isDepressurized(3.8)).toBe(false);
    });
  });

  describe('formatBar', () => {
    it('formats bar numeric value with 2 decimals and "bar" unit', () => {
      expect(formatBar(3.8)).toBe('3.80 bar');
      expect(formatBar(11.823)).toBe('11.82 bar');
      expect(formatBar(0)).toBe('0.00 bar');
    });
  });
});
