import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  const timestamp = new Date().toISOString();
  let supabaseConnected = false;

  try {
    const supabase = createAdminClient();
    // Test database connectivity by checking telemetry_nodes count or version
    const { error } = await supabase
      .from('telemetry_nodes')
      .select('id', { count: 'exact', head: true });

    if (!error) {
      supabaseConnected = true;
    }
  } catch {
    supabaseConnected = false;
  }

  return NextResponse.json(
    {
      status: 'ok',
      timestamp,
      version: '1.0.0',
      supabase_connected: supabaseConnected,
    },
    { status: 200 }
  );
}
