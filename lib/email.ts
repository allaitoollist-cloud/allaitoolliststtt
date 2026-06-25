import { Resend } from 'resend';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, from, replyTo }: EmailOptions) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('[Email] RESEND_API_KEY is not set');
      return { success: false, error: 'Email service not configured' };
    }

    // Always use verified domain — ignore env var if it has wrong domain
    const envFrom = process.env.RESEND_FROM_EMAIL || '';
    const fromEmail = from || (envFrom.includes('allaitoollist.com') ? envFrom : 'All AI Tool List <hello@allaitoollist.com>');

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
      ...(replyTo && { reply_to: replyTo }),
    });

    if (error) {
      console.error('[Email] Resend API error:', JSON.stringify(error));
      return { success: false, error };
    }

    console.log(`[Email] Sent (${data?.id}) → ${to}`);
    return { success: true, data };
  } catch (err: any) {
    console.error('[Email] Exception:', err?.message || err);
    return { success: false, error: err?.message || 'Unknown error' };
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   Brand colors (matches website)
   Primary orange : #f97316
   Dark text      : #1a1007
   Body text      : #4a4540
   Muted text     : #79716a
   Border         : #e8dfd7
   Light bg       : #fef8f4   (very light orange tint for info boxes)
   Page bg        : #f5f5f5
───────────────────────────────────────────────────────────────────────────── */

const ORANGE  = '#f97316';
const DARK    = '#1a1007';
const BODY    = '#4a4540';
const MUTED   = '#79716a';
const BORDER  = '#e8dfd7';
const LIGHT   = '#fef8f4';
const PAGE_BG = '#f5f5f5';

/* ── Shared layout ─────────────────────────────────────────────────────────── */
function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>All AI Tool List</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}
    body{margin:0!important;padding:0!important;width:100%!important;background:${PAGE_BG}}
    @media only screen and (max-width:620px){
      .outer{padding:0!important}
      .card{border-radius:0!important;border-left:none!important;border-right:none!important}
      .body-td{padding:28px 20px!important}
      .footer-td{padding:20px!important}
      .btn a{display:block!important;width:100%!important;box-sizing:border-box!important}
      h1{font-size:22px!important}
      h2{font-size:18px!important}
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${PAGE_BG};">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PAGE_BG};">
  <tr>
    <td class="outer" style="padding:32px 16px;">
      <!--[if mso]><table width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
      <table class="card" cellpadding="0" cellspacing="0" border="0"
        style="width:100%;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid ${BORDER};overflow:hidden;">

        <!-- LOGO HEADER -->
        <tr>
          <td style="padding:22px 32px;border-bottom:1px solid ${BORDER};">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="width:4px;border-radius:2px;background:${ORANGE};font-size:1px;line-height:1px;">&nbsp;</td>
                <td style="padding-left:10px;font-family:Arial,sans-serif;font-size:17px;font-weight:800;color:${DARK};letter-spacing:-0.3px;">
                  All AI Tool List
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td class="body-td" style="padding:36px 32px;background:#ffffff;">
            ${content}
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td class="footer-td" style="padding:20px 32px;background:${PAGE_BG};border-top:1px solid ${BORDER};text-align:center;">
            <p style="margin:0 0 4px;color:${MUTED};font-size:13px;font-family:Arial,sans-serif;">
              All AI Tool List &mdash; Discover the Best AI Tools
            </p>
            <p style="margin:0;font-size:12px;font-family:Arial,sans-serif;">
              <a href="https://allaitoollist.com" style="color:${ORANGE};text-decoration:none;">allaitoollist.com</a>
            </p>
          </td>
        </tr>

      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td>
  </tr>
</table>
</body>
</html>`;
}

/* ── Reusable building blocks ──────────────────────────────────────────────── */
function heading(text: string, sub?: string): string {
  return `<h1 style="margin:0 0 ${sub ? '8px' : '24px'};font-family:Arial,sans-serif;font-size:26px;font-weight:800;color:${DARK};line-height:1.2;">${text}</h1>
  ${sub ? `<p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:15px;color:${MUTED};">${sub}</p>` : ''}`;
}

function infoBox(rows: Array<{ label: string; value: string }>): string {
  const rowsHtml = rows.map(({ label, value }) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${BORDER};">
        <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:${MUTED};">${label}</p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;font-weight:600;color:${DARK};">${value}</p>
      </td>
    </tr>`).join('');

  return `<table cellpadding="0" cellspacing="0" border="0" width="100%"
    style="background:${LIGHT};border:1px solid ${BORDER};border-left:3px solid ${ORANGE};border-radius:8px;margin-bottom:24px;">
    <tr><td style="padding:16px 20px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        ${rowsHtml}
      </table>
    </td></tr>
  </table>`;
}

function noteBox(text: string): string {
  return `<table cellpadding="0" cellspacing="0" border="0" width="100%"
    style="background:${LIGHT};border:1px solid ${BORDER};border-left:3px solid ${ORANGE};border-radius:8px;margin-bottom:24px;">
    <tr><td style="padding:16px 20px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:${BODY};line-height:1.6;">${text}</p>
    </td></tr>
  </table>`;
}

function btn(href: string, text: string): string {
  return `<table class="btn" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;">
    <tr>
      <td style="border-radius:8px;background:${ORANGE};">
        <a href="${href}"
          style="display:inline-block;padding:13px 28px;color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:700;text-decoration:none;border-radius:8px;background:${ORANGE};">
          ${text}
        </a>
      </td>
    </tr>
  </table>`;
}

function p(text: string, mb = '20px'): string {
  return `<p style="margin:0 0 ${mb};font-family:Arial,sans-serif;font-size:15px;color:${BODY};line-height:1.7;">${text}</p>`;
}

function sign(): string {
  return `<p style="margin:24px 0 0;font-family:Arial,sans-serif;font-size:14px;color:${MUTED};">
    Best regards,<br/>
    <strong style="color:${DARK};">The All AI Tool List Team</strong>
  </p>`;
}

/* ── Templates ─────────────────────────────────────────────────────────────── */
export const emailTemplates = {

  toolSubmitted: (toolName: string, plan: string = 'featured', price: string = '$49') => ({
    subject: `Submission Received: "${toolName}" — Payment Invoice Coming`,
    html: layout(`
      ${heading('Submission Received! 🎉', 'We have your tool — payment step is next')}
      ${p(`Thank you for submitting <strong style="color:${DARK};">${toolName}</strong>. Your submission is saved and under review.`)}
      ${infoBox([
        { label: 'Tool Name', value: toolName },
        { label: 'Plan',      value: plan === 'sponsored' ? 'Sponsored Placement' : 'Featured Listing' },
        { label: 'Amount',    value: price },
        { label: 'Status',    value: 'Pending Payment' },
      ])}
      ${noteBox(`
        <strong>💳 Payment — What happens next:</strong><br/>
        1. We will send you a <strong>PayPal payment link</strong> for ${price} within a few hours.<br/>
        2. Complete the payment via PayPal (we also accept Binance USDT &amp; Payoneer).<br/>
        3. Once paid, your tool goes live with priority placement within 24 hours.
      `)}
      ${p('If you have any questions, simply reply to this email.', '0')}
      ${sign()}
    `),
  }),

  toolApproved: (toolName: string, toolUrl: string) => ({
    subject: `Published: "${toolName}" is now live`,
    html: layout(`
      ${heading('Your Tool is Live!', `"${toolName}" has been approved and published`)}
      ${p(`Great news! <strong style="color:${DARK};">${toolName}</strong> has been reviewed, approved, and is now live on All AI Tool List.`)}
      ${infoBox([
        { label: 'Tool Name', value: toolName },
        { label: 'Status',    value: 'Published &amp; Live' },
      ])}
      ${btn(toolUrl, 'View Your Tool &rarr;')}
      ${p('Share your listing with your users — every view counts toward trending rankings.', '0')}
      ${sign()}
    `),
  }),

  toolRejected: (toolName: string, reason?: string) => ({
    subject: `Submission Update: "${toolName}"`,
    html: layout(`
      ${heading('Submission Update', 'We have reviewed your submission')}
      ${p(`Thank you for submitting <strong style="color:${DARK};">${toolName}</strong>. After our review, we are unable to approve it at this time.`)}
      ${reason ? noteBox(`<strong>Reason:</strong> ${reason}`) : ''}
      ${noteBox(`
        You're welcome to make improvements and resubmit in the future.<br/>
        Make sure your tool has a clear description, a working URL, and fits our categories.
      `)}
      ${btn('https://allaitoollist.com/submit', 'Submit Again &rarr;')}
      ${sign()}
    `),
  }),

  contactFormReceived: (name: string, email: string, subject: string, message: string) => ({
    subject: `Contact: ${subject}`,
    html: layout(`
      ${heading('New Contact Message', 'Submitted via allaitoollist.com')}
      ${infoBox([
        { label: 'Name',    value: name },
        { label: 'Email',   value: `<a href="mailto:${email}" style="color:${ORANGE};text-decoration:none;">${email}</a>` },
        { label: 'Subject', value: subject },
      ])}
      <table cellpadding="0" cellspacing="0" border="0" width="100%"
        style="border:1px solid ${BORDER};border-radius:8px;margin-bottom:24px;">
        <tr><td style="padding:16px 20px;">
          <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:${MUTED};">Message</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:${BODY};line-height:1.7;white-space:pre-wrap;">${message}</p>
        </td></tr>
      </table>
    `),
  }),

  contactFormConfirmation: (name: string) => ({
    subject: 'We received your message',
    html: layout(`
      ${heading('Message Received', 'Thank you for reaching out')}
      ${p(`Hello <strong style="color:${DARK};">${name}</strong>,`)}
      ${p("We've received your message and will get back to you as soon as possible.")}
      ${noteBox('<strong>Response time:</strong> We typically reply within 24&ndash;48 hours.')}
      ${sign()}
    `),
  }),

  welcomeEmail: (name: string, username: string) => ({
    subject: 'Welcome to All AI Tool List',
    html: layout(`
      ${heading('Welcome!', 'You\'re now part of the AI Tool List community')}
      ${p(`Hello <strong style="color:${DARK};">${name || username}</strong>, we're glad to have you!`)}
      ${p("Discover thousands of AI tools, save your favorites, and submit new ones to share with the community.")}
      ${noteBox(`
        &bull;&nbsp; Browse thousands of AI tools by category<br/>
        &bull;&nbsp; Save and compare tools side by side<br/>
        &bull;&nbsp; Submit new AI tools for review<br/>
        &bull;&nbsp; Get weekly updates via newsletter
      `)}
      ${btn('https://allaitoollist.com', 'Start Exploring &rarr;')}
      ${sign()}
    `),
  }),

  newsletterWelcome: (email: string) => ({
    subject: 'You\'re subscribed to All AI Tool List',
    html: layout(`
      ${heading('Subscribed!', 'Weekly AI tools — every Monday')}
      ${p("Thank you for subscribing. Every Monday you'll get our curated list of the best new AI tools, reviewed by our team.")}
      ${noteBox(`
        &bull;&nbsp; Top new AI tools every Monday<br/>
        &bull;&nbsp; Exclusive deals for subscribers<br/>
        &bull;&nbsp; No spam &mdash; unsubscribe anytime
      `)}
      ${btn('https://allaitoollist.com', 'Browse AI Tools &rarr;')}
      <p style="margin:24px 0 0;text-align:center;font-family:Arial,sans-serif;font-size:12px;color:${MUTED};">
        <a href="https://allaitoollist.com/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}"
          style="color:${MUTED};text-decoration:underline;">Unsubscribe</a>
      </p>
    `),
  }),

};

/* ── Helper exports ────────────────────────────────────────────────────────── */
export async function sendSubmissionConfirmation(toolName: string, submitterEmail: string, plan = 'featured', price = '$49') {
  const t = emailTemplates.toolSubmitted(toolName, plan, price);
  return sendEmail({ to: submitterEmail, subject: t.subject, html: t.html });
}

export async function sendAdminNewSubmissionEmail(toolName: string, submitterEmail: string, adminEmail: string, plan = 'featured', price = '$49') {
  return sendEmail({
    to: adminEmail,
    replyTo: submitterEmail,
    subject: `💰 New ${plan === 'sponsored' ? 'Sponsored ($149)' : 'Featured ($49)'} Submission: ${toolName}`,
    html: layout(`
      ${heading('New Paid Submission', 'Action required — send PayPal payment link')}
      ${infoBox([
        { label: 'Tool Name',  value: toolName },
        { label: 'Submitter', value: submitterEmail },
        { label: 'Plan',      value: plan === 'sponsored' ? 'Sponsored Placement' : 'Featured Listing' },
        { label: 'Amount',    value: price },
      ])}
      ${noteBox(`<strong>Next step:</strong> Send a PayPal payment link of <strong>${price}</strong> to <strong>${submitterEmail}</strong>`)}
      ${btn('https://allaitoollist.com/admin/submissions', 'Review in Admin Panel &rarr;')}
    `),
  });
}

export async function sendToolApprovedEmail(toolName: string, toolUrl: string, submitterEmail: string) {
  const t = emailTemplates.toolApproved(toolName, toolUrl);
  return sendEmail({ to: submitterEmail, subject: t.subject, html: t.html });
}

export async function sendFreshnessReminder(toolName: string, toolOwnerEmail: string) {
  return sendEmail({
    to: toolOwnerEmail,
    subject: `Update Needed: ${toolName}`,
    html: layout(`
      ${heading('Update Reminder', `Your listing needs a refresh`)}
      ${p(`It's been a while since <strong style="color:${DARK};">${toolName}</strong> was last updated. Fresh listings rank higher and get more clicks.`)}
      ${btn('https://allaitoollist.com/admin', 'Update Now &rarr;')}
      ${sign()}
    `),
  });
}
