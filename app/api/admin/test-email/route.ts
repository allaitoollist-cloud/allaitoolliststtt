import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';
import { createServerClient } from '@supabase/ssr';

export async function POST(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();

    // Resolve admin email from session
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { get(n) { return req.cookies.get(n)?.value; }, set() {}, remove() {} } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    const toEmail = user?.email || process.env.ADMIN_EMAIL || '';

    const apiKey    = process.env.RESEND_API_KEY;
    // Use same fallback as sendEmail() so this matches exactly what other routes use
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'AI Tool List <hello@allaitoollist.com>';

    if (!apiKey)  return NextResponse.json({ error: 'RESEND_API_KEY not set in Vercel environment variables' }, { status: 500 });
    if (!toEmail) return NextResponse.json({ error: 'Could not determine recipient email from session' }, { status: 500 });

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: `[Test] All AI Tool List email check`,
        html: `<p style="font-family:Arial,sans-serif;font-size:16px;padding:32px;">
                 ✅ Email system is working!<br/>
                 <small style="color:#888;">From: ${fromEmail} | To: ${toEmail} | ${new Date().toISOString()}</small>
               </p>`,
    });

    if (error) {
        console.error('[TestEmail] Resend error:', JSON.stringify(error));
        return NextResponse.json({
            error: (error as any)?.message || 'Resend rejected the email',
            resendError: error,
            from: fromEmail,
            to: toEmail,
        }, { status: 500 });
    }

    console.log('[TestEmail] OK — id:', data?.id, 'to:', toEmail);
    return NextResponse.json({ ok: true, id: data?.id, sentTo: toEmail, from: fromEmail });
}
