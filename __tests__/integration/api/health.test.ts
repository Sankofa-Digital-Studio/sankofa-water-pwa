import { NextRequest } from 'next/server';
import { GET } from '@/app/api/v1/health/route';
import { __resetMock, __setMockData } from '../../mocks/supabase.mock';

describe('API Integration: GET /api/v1/health', () => {
  beforeEach(() => {
    __resetMock();
  });

  it('returns 200 with { status: "ok" } and database connectivity status', async () => {
    __setMockData([{ id: 101 }]);

    const req = new NextRequest('http://localhost:3000/api/v1/health', {
      method: 'GET',
    });

    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.version).toBe('1.0.0');
    expect(body.timestamp).toBeDefined();
    expect(typeof body.supabase_connected).toBe('boolean');
  });
});
