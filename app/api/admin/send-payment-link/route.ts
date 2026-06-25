import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';
import { sendEmail } from '@/lib/email';
import { logActivity } from '@/lib/log-activity';

const ORANGE  = '#f97316';
const DARK    = '#1a1007';
const MUTED   = '#79716a';
const BORDER  = '#e8dfd7';
const LIGHT   = '#fef8f4';

export async function POST(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();

    const { submitterEmail, toolName, plan, paypalLink } = await req.json();

    if (!submitterEmail || !paypalLink) {
        return NextResponse.json({ error: 'submitterEmail and paypalLink required' }, { status: 400 });
    }

    const price = plan === 'sponsored' ? '$149' : '$49';
    const planName = plan === 'sponsored' ? 'Sponsored Placement' : 'Featured Listing';

    const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>
    body{margin:0;padding:0;background:#f5f5f5;}
    @media only screen and (max-width:620px){
      .card{border-radius:0!important;}
      .body-td{padding:28px 20px!important;}
    }
  </style>
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
          <h1 style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:26px;font-weight:800;color:${DARK};">Your Payment Link is Ready 💳</h1>
          <p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:15px;color:${MUTED};">Complete payment to activate your listing</p>

          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background:${LIGHT};border:1px solid ${BORDER};border-radius:8px;margin:0 0 24px;">
            <tr><td style="padding:20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:13px;color:${MUTED};padding-bottom:8px;">Tool Name</td>
                  <td style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:${DARK};text-align:right;padding-bottom:8px;">${toolName || 'Your Tool'}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:13px;color:${MUTED};padding-bottom:8px;">Plan</td>
                  <td style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:${DARK};text-align:right;padding-bottom:8px;">${planName}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:${DARK};padding-top:8px;border-top:1px solid ${BORDER};">Total</td>
                  <td style="font-family:Arial,sans-serif;font-size:18px;font-weight:800;color:${ORANGE};text-align:right;padding-top:8px;border-top:1px solid ${BORDER};">${price}</td>
                </tr>
              </table>
            </td></tr>
          </table>

          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
            <tr>
              <td style="border-radius:8px;background:${ORANGE};">
                <a href="${paypalLink}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:700;text-decoration:none;border-radius:8px;">
                  Pay ${price} via PayPal &rarr;
                </a>
              </td>
            </tr>
          </table>

          <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;color:${MUTED};">
            Once payment is confirmed, your listing goes live within 24 hours.<br/>
            We also accept: Binance (USDT) &bull; Payoneer &bull; Bank Transfer
          </p>
          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;width:100%;">
            <tr><td style="padding:16px 20px;">
              <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#166534;">📸 After Payment — Upload Your Screenshot</p>
              <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:13px;color:#15803d;">Upload your payment screenshot so we can verify instantly:</p>
              <a href="https://allaitoollist.com/payment-proof" style="display:inline-block;padding:8px 20px;background:#16a34a;color:#ffffff;font-family:Arial,sans-serif;font-size:13px;font-weight:700;text-decoration:none;border-radius:6px;margin-right:8px;">
                Upload Screenshot →
              </a>
              <a href="https://allaitoollist.com/my-submission" style="display:inline-block;padding:8px 16px;background:transparent;color:#15803d;font-family:Arial,sans-serif;font-size:13px;font-weight:600;text-decoration:none;border-radius:6px;border:1px solid #16a34a;">
                Check Status →
              </a>
            </td></tr>
          </table>
          <p style="margin:0 0 0;font-family:Arial,sans-serif;font-size:14px;color:${MUTED};">
            Questions? Simply reply to this email.<br/>
            <strong style="color:${DARK};">— All AI Tool List Team</strong>
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px;background:#f5f5f5;border-top:1px solid ${BORDER};text-align:center;">
          <p style="margin:0;color:${MUTED};font-size:12px;font-family:Arial,sans-serif;">
            <a href="https://allaitoollist.com" style="color:${ORANGE};text-decoration:none;">allaitoollist.com</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

    const result = await sendEmail({
        to: submitterEmail,
        subject: `Payment Link for Your "${toolName}" Listing — ${price}`,
        html,
    });

    if (!result.success) {
        console.error('[PaymentLink] Failed:', result.error);
        return NextResponse.json({ error: JSON.stringify(result.error) }, { status: 500 });
    }

    await logActivity('send_paypal_link', {
        tool: toolName || '—',
        to: submitterEmail,
        plan: plan || 'featured',
        amount: price,
        link: paypalLink,
    });

    return NextResponse.json({ success: true, sentTo: submitterEmail });
}
