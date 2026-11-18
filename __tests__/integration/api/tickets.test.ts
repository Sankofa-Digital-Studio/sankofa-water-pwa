import { NextRequest } from 'next/server';
import { PATCH } from '@/app/api/v1/tickets/route';
import {
  __resetMock,
  __setMockData,
  __setMockRpc,
  __setMockUser,
} from '../../mocks/supabase.mock';

describe('API Integration: PATCH /api/v1/tickets (Anti-Ghost-Work Geofence)', () => {
  const testTicketId = 'a1b2c3d4-e5f6-4a5b-8c9d-0123456789ab';
  const contractorUser = {
    id: 'user-contractor-999',
    email: 'contractor@senatla-water.co.za',
    app_metadata: { role: 'contractor' },
    user_metadata: { role: 'contractor' },
  };

  beforeEach(() => {
    __resetMock();
    __setMockUser(contractorUser);
    __setMockData([
      {
        id: testTicketId,
        status: 'OPEN',
        ward_id: 31,
        pipe_spec: '300mm AC Main',
      },
    ]);
  });

  it('allows stage advancement when contractor GPS is 5m from target (≤ 15m geofence)', async () => {
    // Mock PostGIS validate_stage_geofence RPC returning valid geofence proximity (5m)
    __setMockRpc('validate_stage_geofence', [
      {
        is_valid: true,
        distance_m: 5.0,
      },
    ]);

    const req = new NextRequest('http://localhost:3000/api/v1/tickets', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticketId: testTicketId,
        targetStage: 1, // Stage 1: Excavation
        lat: -27.9712,
        lng: 26.7321,
        accuracyM: 3.5,
      }),
    });

    const res = await PATCH(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.stageAdvanced).toBe(true);
    expect(body.distanceMeters).toBe(5.0);
    expect(body.geofenceVerified).toBe(true);
  });

  it('blocks stage advancement with 400 when contractor GPS is 20m from target (> 15m geofence)', async () => {
    // Mock PostGIS validate_stage_geofence RPC detecting breach (> 15m radius)
    __setMockRpc('validate_stage_geofence', [
      {
        is_valid: false,
        distance_m: 20.0,
      },
    ]);

    const req = new NextRequest('http://localhost:3000/api/v1/tickets', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticketId: testTicketId,
        targetStage: 1,
        lat: -27.975, // GPS position away from site
        lng: 26.738,
        accuracyM: 4.0,
      }),
    });

    const res = await PATCH(req);
    // Geofence breach returns 400 error
    expect([400, 403]).toContain(res.status);

    const body = await res.json();
    expect(body.code).toBe('GEOFENCE_BREACH');
    expect(body.distanceMeters).toBe(20.0);
    expect(body.geofenceRadiusMeters).toBe(15.0);
  });
});
