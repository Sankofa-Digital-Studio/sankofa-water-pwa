import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyChirpstackHmac } from '@/lib/utils/hmac.utils';
import { cbarToBar, isHammerEvent } from '@/lib/utils/pressure.utils';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. CRITICAL SECURITY: Validate X-Chirpstack-Signature HMAC-SHA256 header
    const signature = req.headers.get('x-chirpstack-signature');
    const webhookSecret = process.env.CHIRPSTACK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook secret not configured on server', code: 'CONFIG_ERROR' },
        { status: 500 }
      );
    }

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing X-Chirpstack-Signature header', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Read raw body as text or buffer for exact HMAC verification
    const rawBody = await req.text();
    const isValidSignature = verifyChirpstackHmac(rawBody, signature, webhookSecret);

    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Invalid HMAC signature', code: 'INVALID_SIGNATURE' },
        { status: 401 }
      );
    }

    // 2. Parse decoded payload
    // Expected format: JSON with { node_id, peak_cbar, delta_cbar, battery_mv }
    // Or Chirpstack v4 uplink payload containing data / object
    let parsedBody: any;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: 'Payload is not valid JSON', code: 'MALFORMED_JSON' },
        { status: 400 }
      );
    }

    // Support direct 8-byte decoded properties or nested chirpstack data
    let nodeId: number = parsedBody.node_id ?? parsedBody.nodeId;
    let peakCbar: number = parsedBody.peak_cbar ?? parsedBody.peakCbar;
    let deltaCbar: number = parsedBody.delta_cbar ?? parsedBody.deltaCbar;
    let batteryMv: number = parsedBody.battery_mv ?? parsedBody.batteryMv;
    let rssiDbm: number = parsedBody.rssi_dbm ?? parsedBody.rssi ?? -85;

    // Handle base64 encoded raw 8-byte payload if passed via Chirpstack data field
    if ((nodeId === undefined || peakCbar === undefined) && parsedBody.data) {
      try {
        const buf = Buffer.from(parsedBody.data, 'base64');
        if (buf.length >= 8) {
          nodeId = buf.readUInt16BE(0);
          peakCbar = buf.readInt16BE(2);
          deltaCbar = buf.readInt16BE(4);
          batteryMv = buf.readUInt16BE(6);
        }
      } catch {
        // Fallback or let validator check below
      }
    }

    if (nodeId === undefined || peakCbar === undefined || deltaCbar === undefined) {
      return NextResponse.json(
        {
          error: 'Missing required payload fields: node_id, peak_cbar, delta_cbar',
          code: 'INVALID_PAYLOAD',
        },
        { status: 400 }
      );
    }

    const peakBar = cbarToBar(peakCbar);
    const deltaBar = cbarToBar(deltaCbar);
    const isHammer = isHammerEvent(deltaBar);

    // 3. Database Operations using service role client
    const supabase = createAdminClient();

    // Query node information to obtain ward_id and baseline
    const { data: nodeData, error: nodeErr } = await (supabase
      .from('telemetry_nodes') as any)
      .select('id, ward_id, baseline_bar')
      .eq('id', nodeId)
      .maybeSingle();

    const wardId = (nodeData as any)?.ward_id ?? 3; // Default to Ward 3 if node record not yet seeded

    // Update current_bar, battery_mv, status on telemetry_nodes
    const nodeStatus = isHammer
      ? 'HAMMER_SURGE'
      : peakBar < 1.0
      ? 'DEPRESSURIZED'
      : 'NOMINAL';

    await (supabase
      .from('telemetry_nodes') as any)
      .update({
        current_bar: peakBar,
        battery_mv: batteryMv ?? 3600,
        status: nodeStatus,
      })
      .eq('id', nodeId);

    // Insert into pressure_logs
    const sparklineSample = [peakBar];
    const { error: logErr } = await (supabase.from('pressure_logs') as any).insert({
      node_id: nodeId,
      ward_id: wardId,
      peak_pressure_bar: peakBar,
      delta_pressure_bar: deltaBar,
      battery_mv: batteryMv ?? 3600,
      rssi_dbm: rssiDbm,
      is_hammer_event: isHammer,
      sparkline_json: sparklineSample,
    });

    if (logErr) {
      console.error('Failed to log pressure reading:', logErr.message);
    }

    // 4. Call evaluate_ward_emergency RPC
    let isEmergency = false;
    try {
      const { data: rpcData, error: rpcErr } = await (supabase as any).rpc(
        'evaluate_ward_emergency',
        {
          target_ward: wardId,
          is_surge: isHammer,
        }
      );

      if (!rpcErr && rpcData === true) {
        isEmergency = true;
      }
    } catch (e: any) {
      console.warn('RPC evaluate_ward_emergency call non-fatal warning:', e.message);
    }

    // 5. If emergency triggered, dispatch WhatsApp alert to opted-in ward subscribers
    if (isEmergency) {
      const alertMsg = isHammer
        ? `EMERGENCY ALERT: High-pressure water hammer surge detected in Ward ${wardId}. Infrastructure protection dampeners engaged. Technical crews dispatched.`
        : `EMERGENCY ALERT: Severe pipeline depressurization (<1.0 bar) detected in Ward ${wardId}. Possible major pipe rupture. Repair team dispatched.`;

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      // Dispatch via internal alerts/whatsapp API
      try {
        await fetch(`${appUrl}/api/v1/alerts/whatsapp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${serviceRoleKey}`,
          },
          body: JSON.stringify({
            wardId,
            alertType: isHammer ? 'HAMMER_SURGE' : 'DEPRESSURIZED',
            messageText: alertMsg,
          }),
        });
      } catch (e: any) {
        console.error('Failed to trigger internal WhatsApp dispatch:', e.message);
      }
    }

    return NextResponse.json(
      {
        received: true,
        emergency: isEmergency,
        nodeId,
        peakBar,
        deltaBar,
        isHammerEvent: isHammer,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message || 'Error processing LoRaWAN webhook',
        code: 'WEBHOOK_INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
