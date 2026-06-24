import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
        return NextResponse.json({ error: 'ADMIN_EMAIL not configured' }, { status: 500 });
    }

    const html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
            <h2 style="color:#7c3aed">✅ Test Email</h2>
            <p>Your email system is working correctly.</p>
            <p style="color:#888;font-size:13px">Sent from All AI Tool List admin panel — ${new Date().toLocaleString()}</p>
        </div>
    `;

    const result = await sendEmail({
        to: adminEmail,
        subject: 'All AI Tool List — Test Email',
        html,
    });

    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}
