import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  try {
    console.log('📧 sendEmail called:', { to, subject, from: from || 'default' });
    
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not set');
      return { success: false, error: 'Email service not configured' };
    }

    console.log('✅ RESEND_API_KEY found, sending email...');

    // Use custom domain if set, otherwise use Resend test domain
    // Note: Resend test domain can only send to the account owner's email
    const defaultFrom = process.env.RESEND_FROM_EMAIL || 'AI Tool List <onboarding@resend.dev>';
    const emailFrom = from || defaultFrom;
    
    // Test mode: If RESEND_TEST_EMAIL is set and domain not verified, only send to account owner
    const testEmail = process.env.RESEND_TEST_EMAIL; // allaitoollist@gmail.com
    const isTestMode = testEmail && !process.env.RESEND_FROM_EMAIL;
    
    // In test mode, redirect ALL emails to account owner email (Resend requirement)
    const emailTo = isTestMode ? testEmail : to;
    
    if (isTestMode) {
      console.log(`⚠️ Test mode active: Redirecting email from "${to}" to "${testEmail}"`);
      console.log(`   (Resend test domain can only send to account owner email)`);
    }
    
    console.log('Email from:', emailFrom);
    console.log('Email to:', emailTo);
    console.log('Test mode:', isTestMode, '| Test email:', testEmail);
    console.log('RESEND_FROM_EMAIL set:', !!process.env.RESEND_FROM_EMAIL);
    console.log('RESEND_FROM_EMAIL value:', process.env.RESEND_FROM_EMAIL);

    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      subject,
      html,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      console.error('❌ Email from address used:', emailFrom);
      console.error('❌ Domain extracted from email:', emailFrom.match(/@([^\s>]+)/)?.[1]);
      
      // Check if it's a domain verification error
      const isDomainError = error.message?.includes('testing emails') || 
                           error.message?.includes('domain') || 
                           error.message?.includes('not verified') ||
                           error.statusCode === 403;
      
      if (isDomainError) {
        // Extract domain from email
        const domainMatch = emailFrom.match(/@([^\s>]+)/);
        const domain = domainMatch ? domainMatch[1] : 'unknown';
        
        return { 
          success: false, 
          error: {
            ...error,
            helpfulMessage: `Domain "${domain}" verification issue. Please check: 1) Domain is verified in Resend dashboard, 2) Email format is correct (noreply@${domain}), 3) Server was restarted after setting RESEND_FROM_EMAIL.`,
            needsDomainVerification: true,
            domainUsed: domain
          }
        };
      }
      
      return { success: false, error };
    }

    console.log('✅ Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error };
  }
}

// Email templates
export const emailTemplates = {
  toolSubmitted: (toolName: string, submitterEmail: string) => ({
    subject: `Thank You for Submitting "${toolName}" to AI Tool List`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f7fa; padding: 20px;">
            <tr>
              <td align="center">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Thank You! 🙏</h1>
                      <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Your submission has been received</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="color: #1a202c; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hello,</p>
                      <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">Thank you for submitting your tool <strong style="color: #667eea;">"${toolName}"</strong> to AI Tool List! We're excited to review it.</p>
                      
                      <!-- Tool Info Card -->
                      <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-left: 4px solid #667eea; padding: 24px; border-radius: 8px; margin: 30px 0;">
                        <table role="presentation" style="width: 100%;">
                          <tr>
                            <td style="padding: 8px 0;">
                              <p style="margin: 0; color: #718096; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Tool Name</p>
                              <p style="margin: 4px 0 0 0; color: #1a202c; font-size: 18px; font-weight: 700;">${toolName}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <p style="margin: 0; color: #718096; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Status</p>
                              <p style="margin: 4px 0 0 0; color: #f59e0b; font-size: 16px; font-weight: 600;">⏳ Under Review</p>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- What's Next Section -->
                      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin: 30px 0;">
                        <h2 style="color: #1a202c; font-size: 20px; font-weight: 700; margin: 0 0 20px 0;">What happens next?</h2>
                        <table role="presentation" style="width: 100%;">
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                              <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                                <span style="color: #667eea; font-weight: 700; margin-right: 8px;">1.</span>
                                Our team will review your tool for quality and relevance
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                              <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                                <span style="color: #667eea; font-weight: 700; margin-right: 8px;">2.</span>
                                If approved, your tool will be published and visible to thousands of users
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0;">
                              <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                                <span style="color: #667eea; font-weight: 700; margin-right: 8px;">3.</span>
                                You'll receive an email notification when your tool goes live
                              </p>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 30px 0 0 0;">If you have any questions or need to update your submission, please feel free to contact us.</p>
                      
                      <!-- Footer -->
                      <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                        <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 0 0 8px 0;">Best regards,</p>
                        <p style="color: #1a202c; font-size: 16px; font-weight: 700; margin: 0;">The AI Tool List Team</p>
                        <p style="color: #a0aec0; font-size: 12px; margin: 20px 0 0 0;">AI Tool List - Discover the Best AI Tools</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }),

  toolApproved: (toolName: string, toolUrl: string, submitterEmail: string) => ({
    subject: `🎉 Your Tool "${toolName}" Has Been Published!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f7fa; padding: 20px;">
            <tr>
              <td align="center">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">🎉 Great News!</h1>
                      <p style="color: rgba(255, 255, 255, 0.95); margin: 10px 0 0 0; font-size: 18px; font-weight: 500;">Your tool has been published!</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="color: #1a202c; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hello,</p>
                      <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">We're excited to inform you that your tool submission <strong style="color: #10b981;">"${toolName}"</strong> has been <strong style="color: #10b981;">approved and published</strong> on AI Tool List!</p>
                      
                      <!-- Tool Info Card -->
                      <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 2px solid #10b981; padding: 24px; border-radius: 8px; margin: 30px 0;">
                        <table role="presentation" style="width: 100%;">
                          <tr>
                            <td style="padding: 8px 0;">
                              <p style="margin: 0; color: #059669; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Tool Name</p>
                              <p style="margin: 4px 0 0 0; color: #1a202c; font-size: 20px; font-weight: 700;">${toolName}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 16px 0 8px 0;">
                              <p style="margin: 0; color: #059669; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Status</p>
                              <p style="margin: 4px 0 0 0; color: #10b981; font-size: 16px; font-weight: 700;">✅ Published & Live</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 20px 0 0 0; border-top: 1px solid #a7f3d0;">
                              <a href="${toolUrl}" style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 15px; margin-top: 12px;">View Your Tool →</a>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 30px 0; text-align: center; font-weight: 600;">Your tool is now live and discoverable by thousands of users! 🚀</p>
                      
                      <!-- What You Can Do Section -->
                      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin: 30px 0;">
                        <h2 style="color: #1a202c; font-size: 20px; font-weight: 700; margin: 0 0 20px 0;">What you can do now:</h2>
                        <table role="presentation" style="width: 100%;">
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                              <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                                <span style="color: #10b981; font-weight: 700; margin-right: 8px;">✓</span>
                                Share your tool with your network
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                              <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                                <span style="color: #10b981; font-weight: 700; margin-right: 8px;">✓</span>
                                Monitor views and engagement
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0;">
                              <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                                <span style="color: #10b981; font-weight: 700; margin-right: 8px;">✓</span>
                                Respond to reviews and feedback
                              </p>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 30px 0 0 0;">Thank you for contributing to our AI tools directory. If you have any questions or need to make updates, please don't hesitate to contact us.</p>
                      
                      <!-- Footer -->
                      <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                        <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 0 0 8px 0;">Best regards,</p>
                        <p style="color: #1a202c; font-size: 16px; font-weight: 700; margin: 0;">The AI Tool List Team</p>
                        <p style="color: #a0aec0; font-size: 12px; margin: 20px 0 0 0;">AI Tool List - Discover the Best AI Tools</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }),

  toolRejected: (toolName: string, reason?: string) => ({
    subject: `Update on Your Tool Submission: "${toolName}"`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f7fa; padding: 20px;">
            <tr>
              <td align="center">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Submission Update</h1>
                      <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Review Complete</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="color: #1a202c; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hello,</p>
                      <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">Thank you for submitting your tool <strong style="color: #f59e0b;">"${toolName}"</strong> to AI Tool List.</p>
                      
                      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 24px; border-radius: 8px; margin: 30px 0;">
                        <p style="margin: 0; color: #92400e; font-size: 16px; line-height: 1.6; font-weight: 600;">After careful review, we're unable to approve this submission at this time.</p>
                        ${reason ? `<div style="background: #ffffff; padding: 16px; border-radius: 6px; margin-top: 16px;">
                          <p style="margin: 0; color: #78350f; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Reason</p>
                          <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.6;">${reason}</p>
                        </div>` : ''}
                      </div>
                      
                      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin: 30px 0;">
                        <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">We encourage you to:</p>
                        <table role="presentation" style="width: 100%;">
                          <tr>
                            <td style="padding: 8px 0;">
                              <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                                <span style="color: #f59e0b; font-weight: 700; margin-right: 8px;">•</span>
                                Review our submission guidelines
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                                <span style="color: #f59e0b; font-weight: 700; margin-right: 8px;">•</span>
                                Make necessary improvements
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                                <span style="color: #f59e0b; font-weight: 700; margin-right: 8px;">•</span>
                                Submit again in the future
                              </p>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 30px 0 0 0;">If you have any questions, please feel free to contact us. We're here to help!</p>
                      
                      <!-- Footer -->
                      <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                        <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 0 0 8px 0;">Best regards,</p>
                        <p style="color: #1a202c; font-size: 16px; font-weight: 700; margin: 0;">The AI Tool List Team</p>
                        <p style="color: #a0aec0; font-size: 12px; margin: 20px 0 0 0;">AI Tool List - Discover the Best AI Tools</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }),

  contactFormReceived: (name: string, email: string, subject: string, message: string) => ({
    subject: `New Contact Form Submission: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f7fa; padding: 20px;">
            <tr>
              <td align="center">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">New Contact Form Submission</h1>
                      <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">You have a new message</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <!-- Contact Info Card -->
                      <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-left: 4px solid #667eea; padding: 24px; border-radius: 8px; margin: 0 0 24px 0;">
                        <table role="presentation" style="width: 100%;">
                          <tr>
                            <td style="padding: 8px 0;">
                              <p style="margin: 0; color: #718096; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Name</p>
                              <p style="margin: 4px 0 0 0; color: #1a202c; font-size: 18px; font-weight: 700;">${name}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <p style="margin: 0; color: #718096; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                              <p style="margin: 4px 0 0 0;"><a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-size: 16px; font-weight: 600;">${email}</a></p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <p style="margin: 0; color: #718096; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Subject</p>
                              <p style="margin: 4px 0 0 0; color: #1a202c; font-size: 16px; font-weight: 600;">${subject}</p>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- Message Card -->
                      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin: 24px 0;">
                        <p style="margin: 0 0 16px 0; color: #718096; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                        <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.8; white-space: pre-wrap;">${message}</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }),

  contactFormConfirmation: (name: string) => ({
    subject: 'Thank You for Contacting AI Tool List',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f7fa; padding: 20px;">
            <tr>
              <td align="center">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Thank You! ✨</h1>
                      <p style="color: rgba(255, 255, 255, 0.95); margin: 10px 0 0 0; font-size: 18px; font-weight: 500;">We've received your message</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="color: #1a202c; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hello ${name},</p>
                      <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">Thank you for reaching out to us! We have received your message and our team will get back to you as soon as possible.</p>
                      
                      <!-- Response Time Card -->
                      <div style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); border-left: 4px solid #667eea; padding: 20px; border-radius: 8px; margin: 30px 0;">
                        <p style="margin: 0; color: #4c1d95; font-size: 15px; line-height: 1.6;">
                          <strong style="color: #667eea;">⏱️ Response Time:</strong> We typically respond within 24-48 hours. If your inquiry is urgent, please don't hesitate to reach out again.
                        </p>
                      </div>
                      
                      <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 30px 0 0 0;">We appreciate your patience and look forward to assisting you!</p>
                      
                      <!-- Footer -->
                      <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                        <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 0 0 8px 0;">Best regards,</p>
                        <p style="color: #1a202c; font-size: 16px; font-weight: 700; margin: 0;">The AI Tool List Team</p>
                        <p style="color: #a0aec0; font-size: 12px; margin: 20px 0 0 0;">AI Tool List - Discover the Best AI Tools</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }),

  welcomeEmail: (name: string, username: string) => ({
    subject: 'Welcome to AI Tool List! 🚀',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f7fa; padding: 20px;">
            <tr>
              <td align="center">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Welcome! 🚀</h1>
                      <p style="color: rgba(255, 255, 255, 0.95); margin: 10px 0 0 0; font-size: 18px; font-weight: 500;">You're now part of the AI Tool List community</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="color: #1a202c; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hello ${name || username},</p>
                      <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">We're thrilled to have you join the AI Tool List community! You're now part of a platform dedicated to discovering and sharing the best AI tools.</p>
                      
                      <!-- Features Card -->
                      <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-left: 4px solid #667eea; padding: 24px; border-radius: 8px; margin: 30px 0;">
                        <p style="margin: 0 0 20px 0; color: #1a202c; font-size: 18px; font-weight: 700;">What you can do:</p>
                        <table role="presentation" style="width: 100%;">
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                              <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                                <span style="color: #667eea; font-weight: 700; margin-right: 8px;">🔍</span>
                                Discover thousands of AI tools
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                              <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                                <span style="color: #667eea; font-weight: 700; margin-right: 8px;">⭐</span>
                                Save your favorite tools
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                              <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                                <span style="color: #667eea; font-weight: 700; margin-right: 8px;">📤</span>
                                Submit new AI tools
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                              <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                                <span style="color: #667eea; font-weight: 700; margin-right: 8px;">⚖️</span>
                                Compare tools side by side
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0;">
                              <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                                <span style="color: #667eea; font-weight: 700; margin-right: 8px;">💬</span>
                                Read reviews and ratings
                              </p>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- CTA Button -->
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="https://allaitoollist.com" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">Start Discovering AI Tools →</a>
                      </div>
                      
                      <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">If you have any questions or need help, feel free to reach out to us anytime.</p>
                      
                      <!-- Footer -->
                      <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                        <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 0 0 8px 0;">Happy exploring!</p>
                        <p style="color: #1a202c; font-size: 16px; font-weight: 700; margin: 0;">The AI Tool List Team</p>
                        <p style="color: #a0aec0; font-size: 12px; margin: 20px 0 0 0;">AI Tool List - Discover the Best AI Tools</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }),
};

