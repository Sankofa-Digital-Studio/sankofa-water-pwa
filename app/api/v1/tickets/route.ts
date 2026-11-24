import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, createAdminClient } from '@/lib/supabase/server';
import { GEOFENCE_RADIUS_METERS } from '@/lib/constants/config';
import { AdvanceStageRequest } from '@/types/tickets.types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/tickets
 * Lists repair tickets. Requires authenticated user.
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: authentication required to view tickets', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const wardParam = searchParams.get('ward');
    const statusParam = searchParams.get('status');

    let query = supabase
      .from('repair_tickets')
      .select(`
        *,
        ticket_stage_completions (*)
      `)
      .order('created_at', { ascending: false });

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

    if (error) {
      return NextResponse.json(
        { error: error.message, code: 'FETCH_TICKETS_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json({ tickets: data || [], total: (data || []).length }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Unexpected server error', code: 'TICKETS_INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/tickets
 * Creates a new repair ticket. Requires authenticated user with role 'admin' or 'supervisor' or 'engineer'.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: authentication required to create tickets', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Role check: admin, supervisor, engineer
    const userRole = (user.app_metadata?.role as string) || (user.user_metadata?.role as string) || '';
    const allowedRoles = ['admin', 'supervisor', 'engineer'];

    if (!allowedRoles.includes(userRole.toLowerCase())) {
      return NextResponse.json(
        {
          error: `Forbidden: role '${userRole}' is not authorized to create repair tickets`,
          code: 'FORBIDDEN',
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { wardId, suburb, pipeSpec, estimatedFlowKlHr, source } = body;

    if (!wardId || !suburb) {
      return NextResponse.json(
        { error: 'wardId and suburb are required fields', code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();
    const { data, error } = await (adminSupabase.from('repair_tickets') as any)
      .insert({
        ward_id: wardId,
        suburb,
        pipe_spec: pipeSpec || null,
        estimated_flow_kl_hr: estimatedFlowKlHr ? parseFloat(estimatedFlowKlHr) : null,
        source: source || 'MANUAL',
        status: 'OPEN',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message, code: 'CREATE_TICKET_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ticket: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Unexpected server error', code: 'CREATE_TICKET_INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/v1/tickets
 * Advances a ticket stage with SERVER-SIDE geofence verification using PostGIS `validate_stage_geofence` RPC.
 * NOT a client-side check.
 */
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: authentication required to advance ticket stages', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body: AdvanceStageRequest = await req.json();
    const { ticketId, targetStage, lat, lng, accuracyM, photoUrl } = body;

    if (!ticketId || !targetStage || lat === undefined || lng === undefined) {
      return NextResponse.json(
        {
          error: 'ticketId, targetStage (1-3), lat, and lng are required',
          code: 'BAD_REQUEST',
        },
        { status: 400 }
      );
    }

    if (![1, 2, 3].includes(targetStage)) {
      return NextResponse.json(
        {
          error: 'targetStage must be 1 (Excavation), 2 (Repair), or 3 (Reinstatement)',
          code: 'INVALID_STAGE',
        },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    // 1. Verify Ticket Exists
    const { data: ticket, error: ticketErr } = await adminSupabase
      .from('repair_tickets')
      .select('id, status, ward_id')
      .eq('id', ticketId)
      .maybeSingle();

    if (ticketErr || !ticket) {
      return NextResponse.json(
        { error: 'Repair ticket not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // 2. SERVER-SIDE GEOFENCE VALIDATION via PostGIS RPC: validate_stage_geofence
    // PostGIS function returns TABLE(is_valid BOOLEAN, distance_m NUMERIC)
    const { data: geofenceResult, error: geoErr } = await adminSupabase.rpc(
      'validate_stage_geofence',
      {
        p_ticket_id: ticketId,
        p_lat: lat,
        p_lng: lng,
      }
    );

    if (geoErr) {
      return NextResponse.json(
        {
          error: `Geofence verification RPC failed: ${geoErr.message}`,
          code: 'GEOFENCE_RPC_ERROR',
        },
        { status: 500 }
      );
    }

    const geoRow = Array.isArray(geofenceResult) ? geofenceResult[0] : geofenceResult;
    const isValid = geoRow?.is_valid === true;
    const distanceM = geoRow?.distance_m !== undefined ? parseFloat(geoRow.distance_m) : 999.0;

    // Fail if outside the 15.0m threshold
    if (!isValid || distanceM > GEOFENCE_RADIUS_METERS) {
      return NextResponse.json(
        {
          error: `Contractor GPS position (${lat}, ${lng}) is outside required 15m geofence radius. Measured distance: ${distanceM.toFixed(1)}m.`,
          code: 'GEOFENCE_BREACH',
          distanceMeters: distanceM,
          geofenceRadiusMeters: GEOFENCE_RADIUS_METERS,
        },
        { status: 400 }
      );
    }

    // 3. Record stage completion proof with GPS coordinates & distance
    const { data: completionData, error: completionErr } = await (adminSupabase.from('ticket_stage_completions') as any)
      .upsert(
        {
          ticket_id: ticketId,
          stage_num: targetStage,
          gps_lat: lat,
          gps_lng: lng,
          gps_accuracy_m: accuracyM || null,
          distance_to_target_m: distanceM,
          photo_url: photoUrl || null,
          completed_by: user.id,
        },
        { onConflict: 'ticket_id,stage_num' }
      )
      .select()
      .single();

    if (completionErr) {
      return NextResponse.json(
        {
          error: `Failed to record stage completion: ${completionErr.message}`,
          code: 'STAGE_COMPLETION_ERROR',
        },
        { status: 500 }
      );
    }

    // 4. Advance ticket status accordingly
    const nextStatusMap: Record<number, string> = {
      1: 'STAGE_1_EXCAVATED',
      2: 'STAGE_2_REPAIRED',
      3: 'AUTHORIZED_FOR_PAYMENT',
    };

    const newStatus = nextStatusMap[targetStage] || ticket.status;

    const { data: updatedTicket, error: updateErr } = await adminSupabase
      .from('repair_tickets')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (updateErr) {
      return NextResponse.json(
        { error: updateErr.message, code: 'UPDATE_TICKET_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        ticket: updatedTicket,
        stageAdvanced: true,
        stageCompletion: completionData,
        geofenceVerified: true,
        distanceMeters: distanceM,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Unexpected server error', code: 'ADVANCE_STAGE_INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

