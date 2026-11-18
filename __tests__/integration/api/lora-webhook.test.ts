import { NextRequest } from 'next/server';
import { POST } from '@/app/api/v1/lora/webhook/route';
import {
  __resetMock,
  __setMockData,
  __setMockRpc,
} from '../../mocks/supabase.mock';
import {
  TEST_WEBHOOK_SECRET,
  computeDeterministicHmac,
  createTamperedSignature,
} from '../../mocks/crypto.mock';

describe('API Integration: POST /api/v1/lora/webhook', () => {
  const originalEnvSecret = process.env.CHIRPSTACK_WEBHOOK_SECRET;

  beforeAll(() => {
    process.env.CHIRPSTACK_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;
  });

  afterAll(() => {
    process.env.CHIRPSTACK_WEBHOOK_SECRET = originalEnvSecret;
  });

  beforeEach(() => {
    __resetMock();
    // Default node record in database
    __setMockData([
      {
        id: 101,
        name: 'Welkom Stateway North',
        ward_id: 31,
        baseline_bar: 3.8,
      },
    ]);
  });

  it('rejects request without X-Chirpstack-Signature header with 401', async () => {
    const payload = JSON.stringify({
      node_id: 101,
      peak_cbar: 380,
      delta_cbar: 10,
      battery_mv: 3600,
    });

    const req = new NextRequest('http://localhost:3000/api/v1/lora/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    });

    const res = await POST(req);
    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.code).toBe('UNAUTHORIZED');
  });

  it('rejects request with invalid or tampered HMAC signature with 401', async () => {
    const payload = JSON.stringify({
      node_id: 101,
      peak_cbar: 380,
      delta_cbar: 10,
      battery_mv: 3600,
    });

    const tamperedSig = createTamperedSignature(payload, TEST_WEBHOOK_SECRET);

    const req = new NextRequest('http://localhost:3000/api/v1/lora/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Chirpstack-Signature': tamperedSig,
      },
      body: payload,
    });

    const res = await POST(req);
    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.code).toBe('INVALID_SIGNATURE');
  });

  it('accepts request with valid HMAC signature and returns 200', async () => {
    const payload = JSON.stringify({
      node_id: 101,
      peak_cbar: 380, // 3.80 bar (nominal)
      delta_cbar: 10, // 0.10 bar (no hammer)
      battery_mv: 3620,
    });

    const validSig = computeDeterministicHmac(payload, TEST_WEBHOOK_SECRET);

    // evaluate_ward_emergency returns false for nominal readings
    __setMockRpc('evaluate_ward_emergency', false);

    const req = new NextRequest('http://localhost:3000/api/v1/lora/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Chirpstack-Signature': validSig,
      },
      body: payload,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.received).toBe(true);
    expect(body.nodeId).toBe(101);
    expect(body.peakBar).toBe(3.8);
    expect(body.deltaBar).toBe(0.1);
    expect(body.isHammerEvent).toBe(false);
    expect(body.emergency).toBe(false);
  });

  it('detects hydraulic hammer event (delta > 150 cbar) and triggers ward emergency (200 with emergency: true)', async () => {
    const payload = JSON.stringify({
      node_id: 101,
      peak_cbar: 1180, // 11.80 bar peak
      delta_cbar: 800, // 8.00 bar surge delta (> 150 cbar threshold)
      battery_mv: 3580,
    });

    const validSig = computeDeterministicHmac(payload, TEST_WEBHOOK_SECRET);

    // Mock 3-node correlation emergency RPC returning true
    __setMockRpc('evaluate_ward_emergency', true);

    const req = new NextRequest('http://localhost:3000/api/v1/lora/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Chirpstack-Signature': validSig,
      },
      body: payload,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.received).toBe(true);
    expect(body.isHammerEvent).toBe(true);
    expect(body.emergency).toBe(true);
  });
});
