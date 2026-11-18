import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

interface WhatsAppAlertBody {
  wardId: number;
  alertType: 'HAMMER_SURGE' | 'DEPRESSURIZED' | 'GENERAL';
  messageText: string;
  recipientPhone?: string; // Optional direct test phone number
}

export async function POST(req: NextRequest) {
  try {
    // Service-role / internal protection check
    const authHeader = req.headers.get('authorization');
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceKey) {
      return NextResponse.json(
        { error: 'Service role key not configured on server', code: 'CONFIG_ERROR' },
        { status: 500 }
      );
    }

    // Verify caller has internal service role token
    const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : null;
    if (token !== serviceKey) {
      return NextResponse.json(
        { error: 'Unauthorized: internal service-role endpoint', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body: WhatsAppAlertBody = await req.json();
    const { wardId, alertType, messageText, recipientPhone } = body;

    if (!wardId || !messageText) {
      return NextResponse.json(
        { error: 'wardId and messageText are required', code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Fetch eligible opt-in subscribers for this ward (POPIA Section 69 compliant)
    let subscribers: { phone_e164: string }[] = [];

    if (recipientPhone) {
      // Direct recipient test - verify opt-in status first
      const { data: directSub, error: directErr } = await supabase
        .from('whatsapp_subscribers')
        .select('phone_e164')
        .eq('phone_e164', recipientPhone)
        .eq('opted_in', true)
        .maybeSingle();

      if (!directErr && directSub) {
        subscribers = [directSub];
      } else {
        return NextResponse.json(
          {
            error: 'Specified recipient is not opted in under POPIA Sec 69',
            code: 'RECIPIENT_NOT_OPTED_IN',
          },
          { status: 400 }
        );
      }
    } else {
      const { data, error: subError } = await supabase
        .from('whatsapp_subscribers')
        .select('phone_e164')
        .eq('ward_id', wardId)
        .eq('opted_in', true);

      if (subError) {
        return NextResponse.json(
          { error: `Database error querying subscribers: ${subError.message}`, code: 'DB_ERROR' },
          { status: 500 }
        );
      }
      subscribers = data || [];
    }

    const metaToken = process.env.META_WHATSAPP_TOKEN;
    const phoneId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
    let dispatchedCount = 0;
    let lastWamid: string | null = null;

    // 2. Dispatch Meta Cloud API WhatsApp messages if configured
    if (metaToken && phoneId && subscribers.length > 0) {
      for (const sub of subscribers) {
        try {
          const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${metaToken}`,
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: sub.phone_e164,
              type: 'text',
              text: {
                preview_url: false,
                body: messageText,
              },
            }),
          });

          if (res.ok) {
            const resData = await res.json();
            lastWamid = resData?.messages?.[0]?.id || null;
            dispatchedCount++;
          }
        } catch {
          // Log and continue to next subscriber
        }
      }
    } else {
      // In development / demo mode without active Meta credentials, simulate delivery count
      dispatchedCount = subscribers.length;
    }

    // 3. Log dispatch event to alert_dispatch_log
    const { error: logError } = await (supabase.from('alert_dispatch_log') as any).insert({
      ward_id: wardId,
      alert_type: alertType || 'GENERAL',
      message_text: messageText,
      recipients_count: dispatchedCount,
      whatsapp_message_id: lastWamid,
    });

    if (logError) {
      // Non-fatal logging error
      console.error('Failed to write alert_dispatch_log:', logError.message);
    }

    return NextResponse.json(
      {
        success: true,
        wardId,
        alertType,
        recipientsNotified: dispatchedCount,
        whatsappMessageId: lastWamid,
        simulated: !Boolean(metaToken && phoneId),
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message || 'Internal error in WhatsApp alert dispatch',
        code: 'ALERT_DISPATCH_ERROR',
      },
      { status: 500 }
    );
  }
}
