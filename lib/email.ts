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

    const fromEmail = from || process.env.RESEND_FROM_EMAIL;
    if (!fromEmail) {
      console.error('[Email] RESEND_FROM_EMAIL is not set');
      return { success: false, error: 'Sender email not configured' };
    }

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

// ─── Shared layout wrapper ────────────────────────────────────────────────────
function layout(headerBg: string, headerContent: string, bodyContent: string) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>AI Tool List</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f0f4f8; }
    .wrapper { width: 100%; background-color: #f0f4f8; }
    .main-table { width: 100%; max-width: 640px; margin: 0 auto; }
    @media only screen and (max-width: 640px) {
      .main-table { width: 100% !important; }
      .inner-td { padding: 24px 16px !important; }
      .header-td { padding: 32px 16px !important; }
      .btn { display: block !important; width: 100% !important; text-align: center !important; box-sizing: border-box !important; }
      h1 { font-size: 24px !important; }
      h2 { font-size: 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;">
<div class="wrapper" style="width:100%;background-color:#f0f4f8;padding:24px 0;">
  <!--[if mso]><table width="640" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
  <table class="main-table" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;margin:0 auto;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">
    <!-- HEADER -->
    <tr>
      <td class="header-td" style="background:${headerBg};padding:40px 32px;text-align:center;">
        ${headerContent}
      </td>
    </tr>
    <!-- BODY -->
    <tr>
      <td class="inner-td" style="background:#ffffff;padding:40px 32px;">
        ${bodyContent}
      </td>
    </tr>
    <!-- FOOTER -->
    <tr>
      <td style="background:#f8fafc;padding:24px 32px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="margin:0 0 4px;color:#94a3b8;font-size:13px;font-family:Arial,sans-serif;">AI Tool List &mdash; Discover the Best AI Tools</p>
        <p style="margin:0;font-size:12px;font-family:Arial,sans-serif;"><a href="https://allaitoollist.com" style="color:#667eea;text-decoration:none;">allaitoollist.com</a></p>
      </td>
    </tr>
  </table>
  <!--[if mso]></td></tr></table><![endif]-->
</div>
</body>
</html>`;
}

function btn(href: string, text: string, bg = '#667eea') {
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:24px auto 0;">
    <tr>
      <td align="center" style="border-radius:10px;background:${bg};">
        <a href="${href}" class="btn" style="display:inline-block;padding:14px 32px;color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:700;text-decoration:none;border-radius:10px;background:${bg};">${text}</a>
      </td>
    </tr>
  </table>`;
}

function infoRow(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;">${label}</p>
      <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:16px;font-weight:600;color:#1a202c;">${value}</p>
    </td>
  </tr>`;
}

// ─── Templates ───────────────────────────────────────────────────────────────
export const emailTemplates = {

  toolSubmitted: (toolName: string) => ({
    subject: `Thank You for Submitting "${toolName}" to AI Tool List`,
    html: layout(
      'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
      `<h1 style="color:#ffffff;margin:0 0 8px;font-family:Arial,sans-serif;font-size:28px;font-weight:800;">Thank You! 🙏</h1>
       <p style="color:rgba(255,255,255,0.85);margin:0;font-family:Arial,sans-serif;font-size:15px;">Your submission has been received</p>`,
      `<p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:16px;color:#4a5568;">Hello,</p>
       <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#4a5568;">
         Thank you for submitting <strong style="color:#667eea;">"${toolName}"</strong> to AI Tool List! Our team will review it shortly.
       </p>
       <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f7f9fc;border-left:4px solid #667eea;border-radius:8px;margin-bottom:24px;">
         <tr><td style="padding:20px;">
           ${infoRow('Tool Name', toolName)}
           ${infoRow('Status', '⏳ Under Review')}
         </td></tr>
       </table>
       <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e2e8f0;border-radius:8px;margin-bottom:24px;">
         <tr><td style="padding:20px;">
           <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:16px;font-weight:700;color:#1a202c;">What happens next?</p>
           <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;color:#4a5568;line-height:1.6;"><span style="color:#667eea;font-weight:700;">1.</span> Our team reviews your tool for quality</p>
           <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;color:#4a5568;line-height:1.6;"><span style="color:#667eea;font-weight:700;">2.</span> If approved, it goes live to thousands of users</p>
           <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#4a5568;line-height:1.6;"><span style="color:#667eea;font-weight:700;">3.</span> You'll get an email when it's published</p>
         </td></tr>
       </table>
       <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#718096;">Best regards,<br/><strong style="color:#1a202c;">The AI Tool List Team</strong></p>`
    ),
  }),

  toolApproved: (toolName: string, toolUrl: string) => ({
    subject: `🎉 Your Tool "${toolName}" Has Been Published!`,
    html: layout(
      'linear-gradient(135deg,#10b981 0%,#059669 100%)',
      `<h1 style="color:#ffffff;margin:0 0 8px;font-family:Arial,sans-serif;font-size:28px;font-weight:800;">🎉 Congratulations!</h1>
       <p style="color:rgba(255,255,255,0.85);margin:0;font-family:Arial,sans-serif;font-size:15px;">Your tool has been published!</p>`,
      `<p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:16px;color:#4a5568;">Hello,</p>
       <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#4a5568;">
         Great news! <strong style="color:#10b981;">"${toolName}"</strong> has been <strong>approved and published</strong> on AI Tool List!
       </p>
       <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#ecfdf5;border:2px solid #10b981;border-radius:8px;margin-bottom:24px;">
         <tr><td style="padding:20px;">
           ${infoRow('Tool Name', toolName)}
           ${infoRow('Status', '✅ Published & Live')}
         </td></tr>
       </table>
       ${btn(toolUrl, 'View Your Tool →', '#10b981')}
       <p style="margin:24px 0 0;font-family:Arial,sans-serif;font-size:14px;color:#718096;">Best regards,<br/><strong style="color:#1a202c;">The AI Tool List Team</strong></p>`
    ),
  }),

  toolRejected: (toolName: string, reason?: string) => ({
    subject: `Update on Your Submission: "${toolName}"`,
    html: layout(
      'linear-gradient(135deg,#f59e0b 0%,#d97706 100%)',
      `<h1 style="color:#ffffff;margin:0 0 8px;font-family:Arial,sans-serif;font-size:28px;font-weight:800;">Submission Update</h1>
       <p style="color:rgba(255,255,255,0.85);margin:0;font-family:Arial,sans-serif;font-size:15px;">Review Complete</p>`,
      `<p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:16px;color:#4a5568;">Hello,</p>
       <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#4a5568;">
         Thank you for submitting <strong style="color:#f59e0b;">"${toolName}"</strong>. After review, we're unable to approve it at this time.
       </p>
       ${reason ? `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#fef3c7;border-left:4px solid #f59e0b;border-radius:8px;margin-bottom:24px;"><tr><td style="padding:20px;"><p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;color:#92400e;">Reason</p><p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:#92400e;">${reason}</p></td></tr></table>` : ''}
       <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e2e8f0;border-radius:8px;margin-bottom:24px;">
         <tr><td style="padding:20px;">
           <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:14px;color:#4a5568;line-height:1.6;"><span style="color:#f59e0b;font-weight:700;">•</span> Review our submission guidelines</p>
           <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:14px;color:#4a5568;line-height:1.6;"><span style="color:#f59e0b;font-weight:700;">•</span> Make necessary improvements</p>
           <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#4a5568;line-height:1.6;"><span style="color:#f59e0b;font-weight:700;">•</span> Submit again in the future</p>
         </td></tr>
       </table>
       <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#718096;">Best regards,<br/><strong style="color:#1a202c;">The AI Tool List Team</strong></p>`
    ),
  }),

  contactFormReceived: (name: string, email: string, subject: string, message: string) => ({
    subject: `New Contact: ${subject}`,
    html: layout(
      'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
      `<h1 style="color:#ffffff;margin:0 0 8px;font-family:Arial,sans-serif;font-size:24px;font-weight:800;">New Contact Message</h1>
       <p style="color:rgba(255,255,255,0.85);margin:0;font-family:Arial,sans-serif;font-size:15px;">Via allaitoollist.com</p>`,
      `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f7f9fc;border-left:4px solid #667eea;border-radius:8px;margin-bottom:24px;">
         <tr><td style="padding:20px;">
           ${infoRow('Name', name)}
           ${infoRow('Email', `<a href="mailto:${email}" style="color:#667eea;">${email}</a>`)}
           ${infoRow('Subject', subject)}
         </td></tr>
       </table>
       <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e2e8f0;border-radius:8px;">
         <tr><td style="padding:20px;">
           <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;">Message</p>
           <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:#4a5568;line-height:1.7;white-space:pre-wrap;">${message}</p>
         </td></tr>
       </table>`
    ),
  }),

  contactFormConfirmation: (name: string) => ({
    subject: 'Thank You for Contacting AI Tool List',
    html: layout(
      'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
      `<h1 style="color:#ffffff;margin:0 0 8px;font-family:Arial,sans-serif;font-size:28px;font-weight:800;">Thank You! ✨</h1>
       <p style="color:rgba(255,255,255,0.85);margin:0;font-family:Arial,sans-serif;font-size:15px;">We've received your message</p>`,
      `<p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:16px;color:#4a5568;">Hello ${name},</p>
       <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#4a5568;">
         We've received your message and will get back to you as soon as possible.
       </p>
       <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#eff6ff;border-left:4px solid #667eea;border-radius:8px;margin-bottom:24px;">
         <tr><td style="padding:20px;">
           <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#1d4ed8;line-height:1.6;">
             <strong>⏱️ Response Time:</strong> We typically respond within 24–48 hours.
           </p>
         </td></tr>
       </table>
       <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#718096;">Best regards,<br/><strong style="color:#1a202c;">The AI Tool List Team</strong></p>`
    ),
  }),

  welcomeEmail: (name: string, username: string) => ({
    subject: 'Welcome to AI Tool List! 🚀',
    html: layout(
      'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
      `<h1 style="color:#ffffff;margin:0 0 8px;font-family:Arial,sans-serif;font-size:28px;font-weight:800;">Welcome! 🚀</h1>
       <p style="color:rgba(255,255,255,0.85);margin:0;font-family:Arial,sans-serif;font-size:15px;">You're now part of the AI Tool List community</p>`,
      `<p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:16px;color:#4a5568;">Hello ${name || username},</p>
       <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#4a5568;">
         We're thrilled to have you! Discover and share the best AI tools with thousands of users.
       </p>
       <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f7f9fc;border-left:4px solid #667eea;border-radius:8px;margin-bottom:24px;">
         <tr><td style="padding:20px;">
           <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:#1a202c;">What you can do:</p>
           <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;color:#4a5568;line-height:1.6;">🔍 &nbsp;Discover thousands of AI tools</p>
           <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;color:#4a5568;line-height:1.6;">⭐ &nbsp;Save your favorite tools</p>
           <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;color:#4a5568;line-height:1.6;">📤 &nbsp;Submit new AI tools</p>
           <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;color:#4a5568;line-height:1.6;">⚖️ &nbsp;Compare tools side by side</p>
           <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#4a5568;line-height:1.6;">💬 &nbsp;Read reviews and ratings</p>
         </td></tr>
       </table>
       ${btn('https://allaitoollist.com', 'Start Discovering AI Tools →')}
       <p style="margin:24px 0 0;font-family:Arial,sans-serif;font-size:14px;color:#718096;">Happy exploring!<br/><strong style="color:#1a202c;">The AI Tool List Team</strong></p>`
    ),
  }),

  newsletterWelcome: (email: string) => ({
    subject: '🤖 Welcome to All AI Tool List Newsletter!',
    html: layout(
      'linear-gradient(135deg,#1d4ed8 0%,#4f46e5 100%)',
      `<h1 style="color:#ffffff;margin:0 0 8px;font-family:Arial,sans-serif;font-size:28px;font-weight:800;">You're subscribed! 🎉</h1>
       <p style="color:rgba(255,255,255,0.85);margin:0;font-family:Arial,sans-serif;font-size:15px;">Every Monday — Top 5 new AI tools</p>`,
      `<p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#4a5568;">
         Welcome! Every Monday morning you'll get our curated list of the top 5 new AI tools — reviewed and rated by our team.
       </p>
       <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#eff6ff;border-radius:8px;margin-bottom:24px;">
         <tr><td style="padding:20px;">
           <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:#1d4ed8;">What to expect:</p>
           <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;color:#374151;line-height:1.6;">✅ &nbsp;5 new AI tools every Monday</p>
           <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;color:#374151;line-height:1.6;">🎁 &nbsp;Exclusive deals for subscribers</p>
           <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#374151;line-height:1.6;">🚫 &nbsp;No spam, ever — unsubscribe anytime</p>
         </td></tr>
       </table>
       ${btn('https://allaitoollist.com', 'Browse AI Tools Now →', '#2563eb')}
       <p style="margin:24px 0 0;text-align:center;font-family:Arial,sans-serif;font-size:12px;color:#9ca3af;">
         <a href="https://allaitoollist.com/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}" style="color:#9ca3af;">Unsubscribe</a>
       </p>`
    ),
  }),
};

// ─── Helper functions ─────────────────────────────────────────────────────────
export async function sendSubmissionConfirmation(toolName: string, submitterEmail: string) {
  const template = emailTemplates.toolSubmitted(toolName);
  return sendEmail({ to: submitterEmail, subject: template.subject, html: template.html });
}

export async function sendAdminNewSubmissionEmail(toolName: string, submitterEmail: string, adminEmail: string) {
  return sendEmail({
    to: adminEmail,
    replyTo: submitterEmail,
    subject: `New Tool Submission: ${toolName}`,
    html: layout(
      '#1a202c',
      `<h1 style="color:#ffffff;margin:0 0 8px;font-family:Arial,sans-serif;font-size:24px;font-weight:800;">New Submission</h1>
       <p style="color:rgba(255,255,255,0.7);margin:0;font-family:Arial,sans-serif;font-size:14px;">Action required in admin panel</p>`,
      `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f7f9fc;border-left:4px solid #667eea;border-radius:8px;margin-bottom:24px;">
         <tr><td style="padding:20px;">
           ${infoRow('Tool Name', toolName)}
           ${infoRow('Submitter', submitterEmail)}
         </td></tr>
       </table>
       ${btn('https://allaitoollist.com/admin/submissions', 'Review in Admin Panel →')}`
    ),
  });
}

export async function sendToolApprovedEmail(toolName: string, toolUrl: string, submitterEmail: string) {
  const template = emailTemplates.toolApproved(toolName, toolUrl);
  return sendEmail({ to: submitterEmail, subject: template.subject, html: template.html });
}

export async function sendFreshnessReminder(toolName: string, toolOwnerEmail: string) {
  return sendEmail({
    to: toolOwnerEmail,
    subject: `Update Required: ${toolName}`,
    html: layout(
      'linear-gradient(135deg,#f59e0b 0%,#d97706 100%)',
      `<h1 style="color:#ffffff;margin:0;font-family:Arial,sans-serif;font-size:24px;font-weight:800;">Update Reminder</h1>`,
      `<p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:16px;color:#4a5568;">Hi there,</p>
       <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#4a5568;">
         It's been a while since <strong>${toolName}</strong> was last updated. Please review and refresh your tool information.
       </p>
       ${btn('https://allaitoollist.com/admin', 'Update Now →', '#f59e0b')}
       <p style="margin:24px 0 0;font-family:Arial,sans-serif;font-size:14px;color:#718096;">The AI Tool List Team</p>`
    ),
  });
}
