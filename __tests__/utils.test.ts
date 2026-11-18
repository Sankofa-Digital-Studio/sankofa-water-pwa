import { verifyChirpstackHmac, generateRefCode, hashIp } from '@/lib/utils/hmac.utils';
import { cbarToBar, mvToPercent, isHammerEvent, isDepressurized, formatBar } from '@/lib/utils/pressure.utils';
import { calculateRoi, calculateNrwDrop, formatZar } from '@/lib/utils/financial.utils';
import { createHmac } from 'crypto';

describe('HMAC & Security Utilities', () => {
  const secret = 'super-secret-key-12345';
  const payload = JSON.stringify({ node_id: 101, peak_cbar: 450 });

  it('verifies valid HMAC signature successfully', () => {
    const validSig = createHmac('sha256', secret).update(payload).digest('hex');
    expect(verifyChirpstackHmac(payload, validSig, secret)).toBe(true);
  });

  it('rejects invalid HMAC signature', () => {
    expect(verifyChirpstackHmac(payload, 'bad-signature-hex', secret)).toBe(false);
  });

  it('generates properly formatted ref code', () => {
    const code = generateRefCode('DSR-2024-WW-001');
    expect(code).toMatch(/^SKF-DSR2024WW001-[A-F0-9]+-[A-F0-9]+$/);
  });

  it('hashes IP address with SHA-256 for POPIA compliance', () => {
    const ip = '192.168.1.1';
    const hash = hashIp(ip);
    expect(hash).toHaveLength(64);
    expect(hash).toBe(hashIp(ip));
  });
});

describe('Pressure Utilities', () => {
  it('converts cbar to bar correctly', () => {
    expect(cbarToBar(380)).toBe(3.8);
    expect(cbarToBar(100)).toBe(1.0);
  });

  it('calculates LiFePO4 battery percentage', () => {
    expect(mvToPercent(3000)).toBe(0);
    expect(mvToPercent(3650)).toBe(100);
    expect(mvToPercent(3325)).toBe(50);
  });

  it('detects hydraulic hammer surge', () => {
    expect(isHammerEvent(1.6)).toBe(true);
    expect(isHammerEvent(1.2)).toBe(false);
    expect(isHammerEvent(-1.8)).toBe(true);
  });

  it('detects depressurization', () => {
    expect(isDepressurized(0.8)).toBe(true);
    expect(isDepressurized(2.5)).toBe(false);
  });

  it('formats bar string', () => {
    expect(formatBar(3.8)).toBe('3.80 bar');
  });
});

describe('Financial Utilities', () => {
  it('calculates NRW water volume drop', () => {
    const drop = calculateNrwDrop(2, 50, 48);
    expect(drop).toBe(4800);
  });

  it('calculates ROI matching municipal business case', () => {
    const roi = calculateRoi({
      capexZar: 950000,
      opexZarPerMonth: 28000,
      burstsPreventedPerMonth: 3,
      avgFlowKlHr: 50,
      leakDurationHours: 48,
    });

    expect(roi.monthlyWaterSavedKl).toBe(7200);
    expect(roi.monthlyWaterSavingsZar).toBeGreaterThan(0);
    expect(roi.monthlyRepairSavingsZar).toBe(135000);
    expect(roi.paybackMonths).toBeLessThan(12);
  });

  it('formats ZAR currency strings', () => {
    const zar = formatZar(1234567);
    expect(zar).toContain('1');
    expect(zar).toContain('234');
    expect(zar).toContain('567');
  });
});
