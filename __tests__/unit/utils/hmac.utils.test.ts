import { verifyChirpstackHmac, generateRefCode, hashIp } from '@/lib/utils/hmac.utils';
import {
  computeDeterministicHmac,
  TEST_WEBHOOK_SECRET,
  TEST_TAMPERED_SECRET,
  computeDeterministicSha256,
} from '../../mocks/crypto.mock';

describe('HMAC & Cryptographic Security Utilities (hmac.utils.test.ts)', () => {
  const validPayload = JSON.stringify({
    node_id: 101,
    peak_cbar: 1180,
    delta_cbar: 450,
    battery_mv: 3620,
  });

  describe('verifyChirpstackHmac', () => {
    it('returns true for authentic payload and signature signed with secret', () => {
      const validSignature = computeDeterministicHmac(validPayload, TEST_WEBHOOK_SECRET);
      const isVerified = verifyChirpstackHmac(validPayload, validSignature, TEST_WEBHOOK_SECRET);
      expect(isVerified).toBe(true);
    });

    it('returns false when payload has been tampered with in-flight', () => {
      const originalSignature = computeDeterministicHmac(validPayload, TEST_WEBHOOK_SECRET);
      const tamperedPayload = JSON.stringify({
        node_id: 101,
        peak_cbar: 300, // Attacker modified 1180 cbar surge to 300
        delta_cbar: 10,
        battery_mv: 3620,
      });

      const isVerified = verifyChirpstackHmac(tamperedPayload, originalSignature, TEST_WEBHOOK_SECRET);
      expect(isVerified).toBe(false);
    });

    it('returns false when signature was generated with wrong secret key', () => {
      const wrongKeySignature = computeDeterministicHmac(validPayload, TEST_TAMPERED_SECRET);
      const isVerified = verifyChirpstackHmac(validPayload, wrongKeySignature, TEST_WEBHOOK_SECRET);
      expect(isVerified).toBe(false);
    });

    it('returns false when signature or secret is empty or corrupted', () => {
      expect(verifyChirpstackHmac(validPayload, '', TEST_WEBHOOK_SECRET)).toBe(false);
      expect(verifyChirpstackHmac(validPayload, 'not-a-valid-hex-signature', TEST_WEBHOOK_SECRET)).toBe(false);
      expect(verifyChirpstackHmac(validPayload, 'abc123', '')).toBe(false);
    });
  });

  describe('generateRefCode', () => {
    it('returns a non-empty unique string containing the dossier code prefix', () => {
      const dossierCode = 'DOS_01';
      const refCode = generateRefCode(dossierCode);

      expect(refCode).toBeTruthy();
      expect(typeof refCode).toBe('string');
      // Format: SKF-{CLEAN_DOSSIER_CODE}-{TIMESTAMP_HEX}-{RANDOM}
      expect(refCode).toContain('DOS01');
      expect(refCode.startsWith('SKF-')).toBe(true);
    });

    it('generates unique ref codes across successive invocations', () => {
      const code1 = generateRefCode('DOS_02');
      const code2 = generateRefCode('DOS_02');
      expect(code1).not.toBe(code2);
    });
  });

  describe('hashIp (POPIA Compliance)', () => {
    it('hashes IP address with SHA-256 and never returns raw IP', () => {
      const rawIp = '102.132.224.45';
      const hashed = hashIp(rawIp);

      expect(hashed).not.toContain('102');
      expect(hashed).toHaveLength(64);
      expect(hashed).toBe(computeDeterministicSha256(rawIp));
    });

    it('returns anonymous-hash when IP is empty or undefined', () => {
      expect(hashIp('')).toBe('anonymous-hash');
    });
  });
});
