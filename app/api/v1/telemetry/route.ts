import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { INITIAL_NODES } from '@/lib/constants/nodes';
import { TelemetryNode, NodeStatus, PipeMaterial } from '@/types/telemetry.types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const wardParam = searchParams.get('ward');
    const statusParam = searchParams.get('status');

    let nodes: TelemetryNode[] = [];

    // Attempt to query live telemetry from Supabase
    try {
      const supabase = createAdminClient();
      let query = supabase
        .from('telemetry_nodes')
        .select(`
          id,
          name,
          ward_id,
          suburb,
          street,
          pipe_material,
          burial_depth_m,
          x_coord,
          y_coord,
          baseline_bar,
          current_bar,
          delta_bar,
          battery_mv,
          rssi_dbm,
          snr_db,
          status,
          pressure_logs (
            peak_pressure_bar,
            created_at
          )
        `)
        .order('id', { ascending: true });

      if (wardParam) {
        const wardId = parseInt(wardParam, 10);
        if (!isNaN(wardId)) {
          query = query.eq('ward_id', wardId);
        }
      }

      if (statusParam) {
        query = query.eq('status', statusParam);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        nodes = data.map((item: any) => {
          // Extract last 7 readings or defaults for sparkline
          const logs = Array.isArray(item.pressure_logs)
            ? item.pressure_logs
                .slice(-7)
                .map((log: any) => Number(log.peak_pressure_bar) || Number(item.current_bar))
            : [Number(item.current_bar)];

          const sparkline = logs.length > 0 ? logs : [Number(item.current_bar)];

          return {
            id: String(item.id),
            name: item.name,
            ward: item.ward_id,
            suburb: item.suburb,
            street: item.street,
            material: item.pipe_material as PipeMaterial,
            depth: Number(item.burial_depth_m),
            x: Number(item.x_coord),
            y: Number(item.y_coord),
            baselineBar: Number(item.baseline_bar),
            currentBar: Number(item.current_bar),
            deltaBar: Number(item.delta_bar ?? (Number(item.current_bar) - Number(item.baseline_bar))),
            batteryMv: item.battery_mv ?? 3600,
            rssi: item.rssi_dbm ?? -85,
            snr: Number(item.snr_db ?? 7.0),
            status: item.status as NodeStatus,
            sparkline,
          };
        });
      }
    } catch {
      // Fallback to static catalog if DB connection is unavailable during early bootstrap
    }

    // If database returned no records (e.g. before seed), fallback gracefully to INITIAL_NODES
    if (nodes.length === 0) {
      nodes = [...INITIAL_NODES];

      if (wardParam) {
        const wardId = parseInt(wardParam, 10);
        if (!isNaN(wardId)) {
          nodes = nodes.filter((n) => n.ward === wardId);
        }
      }

      if (statusParam) {
        nodes = nodes.filter((n) => n.status.toUpperCase() === statusParam.toUpperCase());
      }
    }

    return NextResponse.json(
      {
        nodes,
        timestamp: new Date().toISOString(),
        total: nodes.length,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message || 'Internal server error while fetching telemetry',
        code: 'TELEMETRY_FETCH_ERROR',
      },
      { status: 500 }
    );
  }
}
