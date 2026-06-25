import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const adminEmail = process.env.ADMIN_EMAIL;

    const config = {
        RESEND_API_KEY: apiKey ? `✅ Set (${apiKey.slice(0, 8)}...)` : '❌ NOT SET',
        RESEND_FROM_EMAIL: fromEmail ? `✅ ${fromEmail}` : `⚠️ Not set (will use hello@allaitoollist.com)`,
        ADMIN_EMAIL: adminEmail ? `✅ ${adminEmail}` : '⚠️ Not set (using haramtaxiservice@gmail.com)',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ NOT SET',
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? `✅ ${process.env.NEXT_PUBLIC_SUPABASE_URL}` : '❌ NOT SET',
    };

    // Test Resend API key validity
    let resendTest = 'Not tested (API key missing)';
    if (apiKey) {
        try {
            const resend = new Resend(apiKey);
            const { data, error } = await resend.domains.list();
            if (error) {
                resendTest = `❌ API key invalid: ${(error as any)?.message || JSON.stringify(error)}`;
            } else {
                const domains = (data as any)?.data || [];
                const verified = domains.filter((d: any) => d.status === 'verified').map((d: any) => d.name);
                resendTest = verified.length
                    ? `✅ Valid key — Verified domains: ${verified.join(', ')}`
                    : `⚠️ Valid key but NO verified domains. Emails will fail unless you verify allaitoollist.com in Resend dashboard.`;
            }
        } catch (e: any) {
            resendTest = `❌ Exception: ${e?.message}`;
        }
    }

    return NextResponse.json({ config, resendTest });
}
