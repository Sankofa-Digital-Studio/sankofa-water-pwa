import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { hashIp, generateRefCode } from '@/lib/utils/hmac.utils';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dossierCode, signatoryName, signatoryRole } = body;

    // Validate mandatory fields
    if (!signatoryName || typeof signatoryName !== 'string' || signatoryName.trim().length === 0) {
      return NextResponse.json(
        {
          error: 'Signatory name is mandatory and cannot be empty',
          code: 'INVALID_SIGNATORY_NAME',
        },
        { status: 400 }
      );
    }

    if (!dossierCode || typeof dossierCode !== 'string' || dossierCode.trim().length === 0) {
      return NextResponse.json(
        {
          error: 'Dossier code is mandatory',
          code: 'INVALID_DOSSIER_CODE',
        },
        { status: 400 }
      );
    }

    // Extract client IP from headers (x-forwarded-for, x-real-ip)
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const rawIp = forwarded ? (forwarded.split(',')[0]?.trim() || '127.0.0.1') : realIp || '127.0.0.1';

    // POPIA Compliance: Hash IP address using SHA-256 before storage
    const ipHash = hashIp(rawIp);

    // Generate unique verifiable reference code
    const refCode = generateRefCode(dossierCode);
    const role = signatoryRole && typeof signatoryRole === 'string' ? signatoryRole.trim() : 'Authorized Signatory';

    // Persist signature to dossier_signatures using service role Supabase client
    const supabase = createAdminClient();
    const { data, error } = await (supabase.from('dossier_signatures') as any)
      .insert({
        dossier_code: dossierCode.trim().toUpperCase(),
        signatory_name: signatoryName.trim(),
        signatory_role: role,
        ref_code: refCode,
        ip_hash: ipHash,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: `Failed to record signature: ${error.message}`,
          code: 'DATABASE_INSERT_ERROR',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        signature: {
          id: data.id,
          dossierCode: data.dossier_code,
          signatoryName: data.signatory_name,
          signatoryRole: data.signatory_role,
          refCode: data.ref_code,
          signedAt: data.signed_at,
          ipHash: data.ip_hash,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message || 'An unexpected error occurred while signing dossier',
        code: 'SIGN_DOSSIER_INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
