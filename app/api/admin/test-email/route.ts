import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { sendEmail, emailTemplates } from '@/lib/email';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();

    // Get the current admin's email from session
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { get(name) { return req.cookies.get(name)?.value; }, set() {}, remove() {} } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    const adminEmail = user?.email || process.env.ADMIN_EMAIL;

    if (!adminEmail) {
        return NextResponse.json({ error: 'Cannot determine admin email' }, { status: 500 });
    }

    // Send a test welcome email so we verify the template + Resend together
    const template = emailTemplates.newsletterWelcome(adminEmail);
    const result = await sendEmail({
        to: adminEmail,
        subject: `[Test] ${template.subject}`,
        html: template.html,
    });

    if (!result.success) {
        console.error('[TestEmail] Failed:', result.error);
        return NextResponse.json({ error: JSON.stringify(result.error) }, { status: 500 });
    }

    console.log('[TestEmail] Sent to', adminEmail);
    return NextResponse.json({ ok: true, sentTo: adminEmail });
}
