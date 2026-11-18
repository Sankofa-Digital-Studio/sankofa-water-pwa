/**
 * Comprehensive Supabase Client Mock for Jest Tests.
 * Implements chainable query builder pattern (.from().select().eq().order().single().rpc())
 */

export interface MockSupabaseState {
  data: any;
  error: any;
  count: number | null;
  rpcData: Record<string, any>;
  rpcError: Record<string, any>;
  user: any;
}

const defaultState: MockSupabaseState = {
  data: [],
  error: null,
  count: 0,
  rpcData: {},
  rpcError: {},
  user: {
    id: 'usr-test-uuid-1001',
    email: 'contractor@matjhabeng.gov.za',
    app_metadata: { role: 'engineer' },
    user_metadata: { role: 'engineer' },
  },
};

let currentState: MockSupabaseState = { ...defaultState };

export const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  upsert: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  neq: jest.fn().mockReturnThis(),
  gt: jest.fn().mockReturnThis(),
  gte: jest.fn().mockReturnThis(),
  lt: jest.fn().mockReturnThis(),
  lte: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  range: jest.fn().mockReturnThis(),
  single: jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: Array.isArray(currentState.data) ? currentState.data[0] || null : currentState.data,
      error: currentState.error,
    })
  ),
  maybeSingle: jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: Array.isArray(currentState.data) ? currentState.data[0] || null : currentState.data,
      error: currentState.error,
    })
  ),
  then: jest.fn().mockImplementation((resolve) =>
    resolve({
      data: currentState.data,
      error: currentState.error,
      count: currentState.count,
    })
  ),
};

export const mockAuth = {
  getUser: jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: { user: currentState.user },
      error: currentState.user ? null : { message: 'Unauthorized' },
    })
  ),
  getSession: jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: { session: currentState.user ? { user: currentState.user } : null },
      error: null,
    })
  ),
  signInWithOtp: jest.fn().mockResolvedValue({ data: {}, error: null }),
  signOut: jest.fn().mockResolvedValue({ error: null }),
};

export const mockRpc = jest.fn().mockImplementation((fnName: string, args?: any) => {
  const customData = currentState.rpcData[fnName];
  const customError = currentState.rpcError[fnName];

  if (customError) {
    return Promise.resolve({ data: null, error: customError });
  }

  if (customData !== undefined) {
    return Promise.resolve({ data: customData, error: null });
  }

  // Built-in intelligent defaults for Matjhabeng Water RPCs
  if (fnName === 'validate_stage_geofence') {
    // Check if lat/lng are close or if distance simulated
    return Promise.resolve({
      data: [{ is_valid: true, distance_m: 5.0 }],
      error: null,
    });
  }

  if (fnName === 'evaluate_ward_emergency') {
    return Promise.resolve({
      data: true,
      error: null,
    });
  }

  return Promise.resolve({ data: true, error: null });
});

export const mockSupabaseClient = {
  from: jest.fn().mockImplementation(() => mockQueryBuilder),
  rpc: mockRpc,
  auth: mockAuth,
};

/**
 * Test utilities to control mock behavior
 */
export function __setMockData(data: any, error: any = null) {
  currentState.data = data;
  currentState.error = error;
}

export function __setMockRpc(fnName: string, data: any, error: any = null) {
  if (data !== undefined) currentState.rpcData[fnName] = data;
  if (error !== undefined) currentState.rpcError[fnName] = error;
}

export function __setMockUser(user: any) {
  currentState.user = user;
}

export function __resetMock() {
  currentState = {
    ...defaultState,
    rpcData: {},
    rpcError: {},
  };
  jest.clearAllMocks();
}
