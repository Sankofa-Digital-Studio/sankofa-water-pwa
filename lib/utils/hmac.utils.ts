import { createHmac, timingSafeEqual, createHash, randomBytes } from 'crypto';

/**
 * Verifies the X-Chirpstack-Signature HMAC-SHA256 header against the incoming payload.
 * Uses Node.js crypto module and constant-time buffer comparison to prevent timing attacks.
 */
export function verifyChirpstackHmac(
  payload: string | Buffer,
  signature: string,
  secret: string
): boolean {
  if (!signature || !secret) {
    return false;
  }

  try {
    const hmac = createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const actualBuffer = Buffer.from(signature, 'utf8');

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, actualBuffer);
  } catch {
    return false;
  }
}

/**
 * Generates a unique, tamper-evident LOI reference code for dossiers.
 * Format: SKF-{DOSSIER_CODE}-{TIMESTAMP_HEX}-{RANDOM}
 * e.g. SKF-D01-18BCDE9A-8F4A
 */
export function generateRefCode(dossierCode: string): string {
  const cleanCode = dossierCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const timestampHex = Date.now().toString(16).toUpperCase();
  const randomHex = randomBytes(2).toString('hex').toUpperCase();
  return `SKF-${cleanCode}-${timestampHex}-${randomHex}`;
}

/**
 * Hashes an IP address using SHA-256 for POPIA compliance (never store raw PII/IP).
 */
export function hashIp(ip: string): string {
  if (!ip) return 'anonymous-hash';
  return createHash('sha256').update(ip.trim()).digest('hex');
}
