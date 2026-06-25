import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email';
import { logActivity } from '@/lib/log-activity';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const ORANGE = '#f97316';
const DARK   = '#1a1007';
const MUTED  = '#79716a';
const BORDER = '#e8dfd7';

function reminderEmail(toolName: string, plan: string, submitterEmail: string) {
    const price     = plan === 'sponsored' ? '$149' : '$49';
    const planLabel = plan === 'sponsored' ? 'Sponsored Placement' : 'Featured Listing';
    const paypalUsername = process.env.PAYPAL_ME_USERNAME || 'malikmazhar';
    const paypalLink = plan === 'sponsored'
        ? `https://paypal.me/${paypalUsername}/149`
        : `https://paypal.me/${paypalUsername}/49`;

    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<style>body{margin:0;padding:0;background:#f5f5f5;}@media only screen and (max-width:620px){.card{border-radius:0!important;}.body-td{padding:28px 20px!important;}}</style>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;">
  <tr><td style="padding:32px 16px;">
    <table cellpadding="0" cellspacing="0" border="0" class="card"
      style="width:100%;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid ${BORDER};overflow:hidden;">
      <tr>
        <td style="padding:22px 32px;border-bottom:1px solid ${BORDER};">
          <table cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="width:4px;border-radius:2px;background:${ORANGE};font-size:1px;line-height:1px;">&nbsp;</td>
            <td style="padding-left:10px;font-family:Arial,sans-serif;font-size:17px;font-weight:800;color:${DARK};">All AI Tool List</td>
          </tr></table>
        </td>
      </tr>
      <tr>
        <td class="body-td" style="padding:36px 32px;">
          <h1 style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:24px;font-weight:800;color:${DARK};">
            Your listing is almost ready ⏳
          </h1>
          <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:15px;color:${MUTED};">
            Hi! We noticed your submission for <strong style="color:${DARK};">${toolName}</strong> is still pending payment.
            Complete it now to get listed before your spot is taken.
          </p>

          <table cellpadding="0" cellspacing="0" border="0"
            style="width:100%;background:#fef8f4;border:1px solid ${BORDER};border-radius:8px;margin:0 0 24px;">
            <tr><td style="padding:18px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:13px;color:${MUTED};padding-bottom:6px;">Tool</td>
                  <td style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:${DARK};text-align:right;padding-bottom:6px;">${toolName}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:13px;color:${MUTED};padding-bottom:6px;">Plan</td>
                  <td style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:${DARK};text-align:right;padding-bottom:6px;">${planLabel}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:${DARK};padding-top:8px;border-top:1px solid ${BORDER};">Amount Due</td>
                  <td style="font-family:Arial,sans-serif;font-size:18px;font-weight:800;color:${ORANGE};text-align:right;padding-top:8px;border-top:1px solid ${BORDER};">${price}</td>
                </tr>
              </table>
            </td></tr>
          </table>

          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;">
            <tr>
              <td style="border-radius:8px;background:${ORANGE};">
                <a href="${paypalLink}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:700;text-decoration:none;border-radius:8px;">
                  Pay ${price} via PayPal &rarr;
                </a>
              </td>
            </tr>
          </table>

          <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:13px;color:${MUTED};">
            After paying, upload your screenshot at
            <a href="https://allaitoollist.com/payment-proof" style="color:${ORANGE};text-decoration:none;">allaitoollist.com/payment-proof</a>
            for faster approval. We also accept Binance (USDT) &bull; Payoneer &bull; Bank Transfer.
          </p>

          <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:${MUTED};">
            Questions? Simply reply to this email.<br/>
            <strong style="color:${DARK};">— All AI Tool List Team</strong>
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 32px;background:#f5f5f5;border-top:1px solid ${BORDER};text-align:center;">
          <p style="margin:0;color:${MUTED};font-size:12px;font-family:Arial,sans-serif;">
            <a href="https://allaitoollist.com" style="color:${ORANGE};text-decoration:none;">allaitoollist.com</a>
            &nbsp;&bull;&nbsp;
            <a href="https://allaitoollist.com/my-submission?email=${encodeURIComponent(submitterEmail)}" style="color:${MUTED};text-decoration:none;">Check submission status</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

export async function GET(req: NextRequest) {
    // Verify Vercel cron secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now      = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const tenDaysAgo   = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString();

    // Find pending submissions with no payment proof, submitted 3-10 days ago
    const { data: pending } = await supabase
        .from('tool_submissions')
        .select('id, tool_name, submitter_email, plan')
        .eq('status', 'pending')
        .is('payment_proof_url', null)
        .neq('plan', 'free')
        .lte('created_at', threeDaysAgo)
        .gte('created_at', tenDaysAgo);

    if (!pending || pending.length === 0) {
        return NextResponse.json({ sent: 0, message: 'No pending reminders' });
    }

    // Check which ones already got a reminder in last 3 days
    const { data: recentReminders } = await supabase
        .from('activity_logs')
        .select('details')
        .eq('action', 'payment_reminder_sent')
        .gte('created_at', threeDaysAgo);

    const alreadyReminded = new Set(
        (recentReminders || []).map((r: any) => r.details?.email).filter(Boolean)
    );

    let sent = 0;
    let skipped = 0;

    for (const sub of pending) {
        if (alreadyReminded.has(sub.submitter_email)) {
            skipped++;
            continue;
        }

        const result = await sendEmail({
            to: sub.submitter_email,
            subject: `⏳ Your "${sub.tool_name}" listing is waiting — complete payment`,
            html: reminderEmail(sub.tool_name, sub.plan, sub.submitter_email),
        });

        if (result.success) {
            await logActivity('payment_reminder_sent', {
                tool: sub.tool_name,
                email: sub.submitter_email,
                plan: sub.plan,
            });
            sent++;
        }
    }

    return NextResponse.json({ sent, skipped, total: pending.length });
}
