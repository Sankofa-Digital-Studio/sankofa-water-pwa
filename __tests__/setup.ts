// Polyfill Web APIs for jsdom environment using Next.js compiled primitives
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { TextDecoder, TextEncoder } = require('util');
// @ts-ignore
global.TextDecoder = TextDecoder;
// @ts-ignore
global.TextEncoder = TextEncoder;
if (typeof global.setImmediate === 'undefined') {
  // @ts-ignore
  global.setImmediate = (fn: (...args: any[]) => void, ...args: any[]) => setTimeout(fn, 0, ...args);
}
if (typeof global.clearImmediate === 'undefined') {
  // @ts-ignore
  global.clearImmediate = (id: any) => clearTimeout(id);
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Request: EdgeRequest, Response: EdgeResponse, Headers: EdgeHeaders, FormData: EdgeFormData } = require('next/dist/compiled/@edge-runtime/primitives');

if (typeof global.Request === 'undefined') {
  // @ts-ignore
  global.Request = EdgeRequest;
}
if (typeof global.Response === 'undefined') {
  // @ts-ignore
  global.Response = EdgeResponse;
}
if (typeof global.Headers === 'undefined') {
  // @ts-ignore
  global.Headers = EdgeHeaders;
}
if (typeof global.FormData === 'undefined') {
  // @ts-ignore
  global.FormData = EdgeFormData;
}

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
