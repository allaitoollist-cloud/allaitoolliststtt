import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        // Verify admin via bearer token or ADMIN_EMAIL session check
        const authHeader = req.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;
        const adminEmail = process.env.ADMIN_EMAIL;

        // Allow cron secret
        const isCron = cronSecret && authHeader === `Bearer ${cronSecret}`;

        // Allow admin user via Supabase session token
        let isAdmin = isCron;
        if (!isAdmin && authHeader?.startsWith('Bearer ')) {
            const token = authHeader.replace('Bearer ', '');
            const supabaseCheck = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabaseCheck.auth.getUser(token);
            if (user && adminEmail && user.email === adminEmail) isAdmin = true;
        }

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { subject, message } = await req.json();

        if (!subject?.trim() || !message?.trim()) {
            return NextResponse.json({ error: 'Subject and message required' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: subscribers, error } = await supabase
            .from('newsletter_subscribers')
            .select('email')
            .eq('active', true);

        if (error) throw error;
        if (!subscribers || subscribers.length === 0) {
            return NextResponse.json({ error: 'No active subscribers' }, { status: 400 });
        }

        const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f0f4f8;">
<div style="width:100%;background:#f0f4f8;padding:24px 0;">
  <table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;margin:0 auto;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">
    <tr>
      <td style="background:linear-gradient(135deg,#1d4ed8 0%,#4f46e5 100%);padding:40px 32px;text-align:center;">
        <h1 style="color:#fff;margin:0 0 8px;font-family:Arial,sans-serif;font-size:26px;font-weight:800;">🤖 All AI Tool List</h1>
        <p style="color:rgba(255,255,255,0.85);margin:0;font-family:Arial,sans-serif;font-size:15px;">Weekly AI Tools Newsletter</p>
      </td>
    </tr>
    <tr>
      <td style="background:#ffffff;padding:40px 32px;">
        <h2 style="color:#1a202c;font-family:Arial,sans-serif;font-size:22px;margin:0 0 20px;">${subject}</h2>
        <div style="color:#4a5568;font-family:Arial,sans-serif;font-size:15px;line-height:1.8;white-space:pre-wrap;">${message}</div>
        <table cellpadding="0" cellspacing="0" border="0" style="margin:32px auto 0;">
          <tr>
            <td style="border-radius:10px;background:#2563eb;">
              <a href="https://allaitoollist.com" style="display:inline-block;padding:14px 32px;color:#fff;font-family:Arial,sans-serif;font-size:15px;font-weight:700;text-decoration:none;border-radius:10px;">Browse AI Tools →</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;font-family:Arial,sans-serif;">AI Tool List · allaitoollist.com</p>
        <p style="margin:0;font-size:12px;font-family:Arial,sans-serif;">
          <a href="https://allaitoollist.com/api/newsletter/unsubscribe?email={{email}}" style="color:#94a3b8;">Unsubscribe</a>
        </p>
      </td>
    </tr>
  </table>
</div>
</body>
</html>`;

        let sent = 0;
        let failed = 0;

        for (const sub of subscribers) {
            const personalHtml = html.replace('{{email}}', encodeURIComponent(sub.email));
            const result = await sendEmail({
                to: sub.email,
                subject,
                html: personalHtml,
            });
            if (result.success) sent++;
            else failed++;
        }

        return NextResponse.json({
            success: true,
            sent,
            failed,
            total: subscribers.length,
            message: `Sent to ${sent}/${subscribers.length} subscribers`,
        });

    } catch (err: any) {
        console.error('Newsletter send error:', err);
        return NextResponse.json({ error: err.message || 'Failed to send' }, { status: 500 });
    }
}
