import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();

    const openaiKey = process.env.OPENAI_API_KEY;
    return NextResponse.json({
        hasOpenAI: !!openaiKey,
        openaiKeyPrefix: openaiKey ? openaiKey.slice(0, 7) + '...' : null,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasResend: !!process.env.RESEND_API_KEY,
    });
}
