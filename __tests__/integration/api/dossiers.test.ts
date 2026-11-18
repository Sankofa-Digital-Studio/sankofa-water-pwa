import { NextRequest } from 'next/server';
import { POST } from '@/app/api/v1/dossiers/sign/route';
import {
  __resetMock,
  __setMockData,
} from '../../mocks/supabase.mock';
import { computeDeterministicSha256 } from '../../mocks/crypto.mock';

describe('API Integration: POST /api/v1/dossiers/sign (POPIA Immutable LOI)', () => {
  beforeEach(() => {
    __resetMock();
  });

  it('rejects submission with empty signatory name with 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/v1/dossiers/sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dossierCode: 'DOS_01',
        signatoryName: '   ', // Empty / whitespace
        signatoryRole: 'Director of Water Services',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.code).toBe('INVALID_SIGNATORY_NAME');
  });

  it('signs dossier successfully with 200/201 and returns verifiable refCode', async () => {
    const rawClientIp = '197.229.4.12';
    const expectedIpHash = computeDeterministicSha256(rawClientIp);

    // Mock successful Supabase insertion return
    __setMockData({
      id: 'sig-test-uuid-777',
      dossier_code: 'DOS_01',
      signatory_name: 'Dr. T. Mokoena',
      signatory_role: 'Head of Infrastructure',
      ref_code: 'SKF-DOS01-18BCDE9A-8F4A',
      signed_at: new Date().toISOString(),
      ip_hash: expectedIpHash,
    });

    const req = new NextRequest('http://localhost:3000/api/v1/dossiers/sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': rawClientIp,
      },
      body: JSON.stringify({
        dossierCode: 'DOS_01',
        signatoryName: 'Dr. T. Mokoena',
        signatoryRole: 'Head of Infrastructure',
      }),
    });

    const res = await POST(req);
    expect([200, 201]).toContain(res.status);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.signature).toBeDefined();
    expect(body.signature.refCode).toBeDefined();
    expect(typeof body.signature.refCode).toBe('string');
    expect(body.signature.refCode.startsWith('SKF-')).toBe(true);

    // CRITICAL POPIA SECURITY CHECK: Verify IP is NOT stored in raw form
    expect(body.signature.ipHash).toBeDefined();
    expect(body.signature.ipHash).toHaveLength(64);
    expect(body.signature.ipHash).not.toContain(rawClientIp);
    expect(body.signature.ipHash).not.toContain('197');
    expect(body.signature.ipHash).toBe(expectedIpHash);
  });
});
