import { createBrowserClient as createBrowserSupabaseClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase.types'

/**
 * Creates a Supabase client for Client Components (browser context).
 * Uses Next.js public environment variables.
 */
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  return createBrowserSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}
