/**
 * Deterministic Cryptographic and HMAC test mocks for ChirpStack & POPIA tests.
 */
import { createHmac, createHash } from 'crypto';

export const TEST_WEBHOOK_SECRET = 'matjhabeng-chirpstack-secret-key-32b!';
export const TEST_TAMPERED_SECRET = 'wrong-secret-key-9999999999999!';

/**
 * Computes deterministic HMAC-SHA256 signature
 */
export function computeDeterministicHmac(payload: string, secret: string = TEST_WEBHOOK_SECRET): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Creates valid headers for ChirpStack uplink webhook tests
 */
export function createChirpstackHeaders(payload: string, secret: string = TEST_WEBHOOK_SECRET): Record<string, string> {
  const signature = computeDeterministicHmac(payload, secret);
  return {
    'Content-Type': 'application/json',
    'X-Chirpstack-Signature': signature,
  };
}

/**
 * Creates tampered HMAC signature
 */
export function createTamperedSignature(payload: string, secret: string = TEST_WEBHOOK_SECRET): string {
  const valid = computeDeterministicHmac(payload, secret);
  // Invert the last character
  const lastChar = valid.slice(-1);
  const replacement = lastChar === 'a' ? 'b' : 'a';
  return valid.slice(0, -1) + replacement;
}

/**
 * Deterministic SHA-256 hash for IP POPIA verification
 */
export function computeDeterministicSha256(input: string): string {
  return createHash('sha256').update(input.trim()).digest('hex');
}
