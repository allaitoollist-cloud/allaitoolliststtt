import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email';
import { verifyAdminRequest } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        const isCron = !!(cronSecret && authHeader === `Bearer ${cronSecret}`);
        const isAdmin = isCron || await verifyAdminRequest(req);

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
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>All AI Tool List</title>
  <style>
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}
    body{margin:0!important;padding:0!important;width:100%!important;background:#f5f5f5}
    @media only screen and (max-width:620px){
      .outer{padding:0!important}
      .card{border-radius:0!important;border-left:none!important;border-right:none!important}
      .body-td{padding:28px 20px!important}
      .footer-td{padding:20px!important}
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;">
  <tr><td class="outer" style="padding:32px 16px;">
    <table class="card" cellpadding="0" cellspacing="0" border="0"
      style="width:100%;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e8dfd7;overflow:hidden;">
      <tr>
        <td style="padding:22px 32px;border-bottom:1px solid #e8dfd7;">
          <table cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="width:4px;border-radius:2px;background:#f97316;font-size:1px;line-height:1px;">&nbsp;</td>
            <td style="padding-left:10px;font-family:Arial,sans-serif;font-size:17px;font-weight:800;color:#1a1007;letter-spacing:-0.3px;">All AI Tool List</td>
          </tr></table>
        </td>
      </tr>
      <tr>
        <td class="body-td" style="padding:36px 32px;background:#ffffff;">
          <h2 style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:22px;font-weight:800;color:#1a1007;line-height:1.3;">${subject}</h2>
          <div style="color:#4a4540;font-family:Arial,sans-serif;font-size:15px;line-height:1.8;white-space:pre-wrap;">${message}</div>
          <table cellpadding="0" cellspacing="0" border="0" style="margin:32px 0 0;">
            <tr><td style="border-radius:8px;background:#f97316;">
              <a href="https://allaitoollist.com"
                style="display:inline-block;padding:13px 28px;color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:700;text-decoration:none;border-radius:8px;background:#f97316;">
                Browse AI Tools &rarr;
              </a>
            </td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td class="footer-td" style="padding:20px 32px;background:#f5f5f5;border-top:1px solid #e8dfd7;text-align:center;">
          <p style="margin:0 0 4px;color:#79716a;font-size:13px;font-family:Arial,sans-serif;">All AI Tool List &mdash; Discover the Best AI Tools</p>
          <p style="margin:0;font-size:12px;font-family:Arial,sans-serif;">
            <a href="https://allaitoollist.com" style="color:#f97316;text-decoration:none;">allaitoollist.com</a>
            &nbsp;&middot;&nbsp;
            <a href="https://allaitoollist.com/api/newsletter/unsubscribe?email={{email}}" style="color:#79716a;text-decoration:underline;">Unsubscribe</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
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
