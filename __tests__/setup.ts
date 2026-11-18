import '@testing-library/jest-dom';
import { mockSupabaseClient } from './mocks/supabase.mock';

// 1. Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  redirect: jest.fn(),
}));

// 2. Mock @supabase/ssr
jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(() => mockSupabaseClient),
  createServerClient: jest.fn(() => mockSupabaseClient),
}));

// Mock @/lib/supabase/client and server
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));

jest.mock('@/lib/supabase/server', () => ({
  createServerClient: jest.fn(async () => mockSupabaseClient),
  createAdminClient: jest.fn(() => mockSupabaseClient),
}));

// 3. Mock global fetch
if (!global.fetch) {
  global.fetch = jest.fn();
}

// 4. Mock matchMedia for jsdom
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock window.print
  window.print = jest.fn();
}
