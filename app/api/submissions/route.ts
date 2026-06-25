import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';
import { logActivity } from '@/lib/log-activity';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
    if (!await verifyAdminRequest(request)) return unauthorizedJson();

    console.log('=== Submissions API Called ===');

    try {
        const body = await request.json();
        console.log('Request body:', body);

        const { action, submissionId, submissionData } = body;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        console.log('Using Supabase URL:', supabaseUrl ? 'yes' : 'no');
        console.log('Using key type:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE' : 'ANON');

        if (!supabaseUrl || !supabaseKey) {
            console.error('Missing credentials!');
            return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        if (action === 'approve') {
            // Generate slug from tool name
            let baseSlug = submissionData.tool_name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            // Check if slug exists and make it unique if needed
            let slug = baseSlug;
            let counter = 1;
            let slugExists = true;

            while (slugExists) {
                const { data: existingTools, error: checkError } = await supabase
                    .from('tools')
                    .select('id')
                    .eq('slug', slug)
                    .limit(1);

                if (checkError) {
                    console.error('Error checking slug:', checkError);
                    break;
                }

                if (!existingTools || existingTools.length === 0) {
                    slugExists = false;
                } else {
                    slug = `${baseSlug}-${counter}`;
                    counter++;
                    // Safety check to prevent infinite loop
                    if (counter > 100) {
                        console.error('Too many slug attempts, using timestamp');
                        slug = `${baseSlug}-${Date.now()}`;
                        slugExists = false;
                    }
                }
            }

            console.log('Creating tool with slug:', slug);
            console.log('Tool data being inserted:', {
                name: submissionData.tool_name,
                slug: slug,
                category: submissionData.category,
                pricing: submissionData.pricing,
                url: submissionData.tool_url,
                description_length: submissionData.description?.length || 0,
            });

            // First, create the tool in tools table
            const { data: createdTool, error: toolError } = await supabase
                .from('tools')
                .insert({
                    name: submissionData.tool_name,
                    slug: slug,
                    short_description: submissionData.description || 'No description provided',
                    full_description: submissionData.full_description || submissionData.description || 'No description provided',
                    url: submissionData.tool_url,
                    category: submissionData.category,
                    pricing: submissionData.pricing,
                    status: 'published',
                    tags: [],
                    platform: ['Web'],
                    views: 0,
                    trending: false,
                    featured: submissionData.plan === 'featured' || submissionData.plan === 'sponsored',
                    verified: false,
                    rating: 0,
                    review_count: 0,
                    submitter_email: submissionData.submitter_email || null,
                    approval_email_sent: !!submissionData.submitter_email,
                })
                .select()
                .single();

            if (toolError) {
                console.error('❌ Error creating tool:', toolError);
                console.error('Error code:', toolError.code);
                console.error('Error details:', toolError.details);
                console.error('Error hint:', toolError.hint);
                console.error('Tool data that failed:', {
                    name: submissionData.tool_name,
                    slug: slug,
                    category: submissionData.category,
                    pricing: submissionData.pricing,
                    url: submissionData.tool_url,
                });

                // Check if it's a duplicate slug error
                if (toolError.code === '23505' || toolError.message?.includes('duplicate') || toolError.message?.includes('unique')) {
                    return NextResponse.json({
                        error: `Tool with this name/slug already exists. Slug: ${slug}`,
                        details: toolError,
                        code: 'DUPLICATE_SLUG'
                    }, { status: 409 });
                }

                return NextResponse.json({
                    error: `Failed to create tool: ${toolError.message}`,
                    details: toolError,
                    code: toolError.code
                }, { status: 500 });
            }

            if (!createdTool) {
                console.error('Tool creation returned no data');
                return NextResponse.json({
                    error: 'Tool was not created - no data returned',
                }, { status: 500 });
            }

            console.log('Tool created successfully:', createdTool.id);
            console.log('Tool details:', {
                id: createdTool.id,
                name: createdTool.name,
                slug: createdTool.slug,
                category: createdTool.category,
            });

            // Verify the tool exists
            const { data: verifyTool, error: verifyError } = await supabase
                .from('tools')
                .select('id, name, slug')
                .eq('id', createdTool.id)
                .single();

            if (verifyError || !verifyTool) {
                console.error('Verification failed:', verifyError);
                return NextResponse.json({
                    error: 'Tool was created but verification failed',
                    details: verifyError
                }, { status: 500 });
            }

            // Tool verified successfully - it will be visible on website
            console.log('✅ Tool verified successfully:', verifyTool.id);

            // Update submission status
            const { error } = await supabase
                .from('tool_submissions')
                .update({ status: 'approved', reviewed_at: new Date().toISOString() })
                .eq('id', submissionId);

            if (error) {
                console.error('Error updating submission status:', error);
                return NextResponse.json({ error: `Failed to approve: ${error.message}` }, { status: 500 });
            }

            // Send approval email to submitter
            if (submissionData.submitter_email) {
                const toolUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://allaitoollist.com'}/tool/${createdTool.slug}`;
                const emailTemplate = emailTemplates.toolApproved(
                    submissionData.tool_name,
                    toolUrl
                );

                await sendEmail({
                    to: submissionData.submitter_email,
                    subject: emailTemplate.subject,
                    html: emailTemplate.html,
                });
                console.log('✅ Approval email sent to:', submissionData.submitter_email);
            }

            await logActivity('approve_submission', {
                tool: submissionData.tool_name,
                email: submissionData.submitter_email,
                plan: submissionData.plan || 'featured',
                slug: createdTool.slug,
            });

            // Revalidate sitemap so new tool appears immediately
            revalidatePath('/sitemap.xml');
            revalidatePath('/');

            return NextResponse.json({
                success: true,
                message: 'Submission approved and tool created!',
                toolId: createdTool.id,
                toolSlug: createdTool.slug
            });

        } else if (action === 'reject') {
            // Get submission data for email
            const { data: submission } = await supabase
                .from('tool_submissions')
                .select('tool_name, submitter_email')
                .eq('id', submissionId)
                .single();

            const { error } = await supabase
                .from('tool_submissions')
                .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
                .eq('id', submissionId);

            if (error) {
                return NextResponse.json({ error: `Failed to reject: ${error.message}` }, { status: 500 });
            }

            // Send rejection email to submitter
            if (submission?.submitter_email && submission?.tool_name) {
                const emailTemplate = emailTemplates.toolRejected(submission.tool_name);

                await sendEmail({
                    to: submission.submitter_email,
                    subject: emailTemplate.subject,
                    html: emailTemplate.html,
                });
                console.log('✅ Rejection email sent to:', submission.submitter_email);
            }

            await logActivity('reject_submission', {
                tool: submission?.tool_name || submissionId,
                email: submission?.submitter_email || '—',
            });

            return NextResponse.json({ success: true, message: 'Submission rejected' });

        } else if (action === 'delete') {
            const { error } = await supabase
                .from('tool_submissions')
                .delete()
                .eq('id', submissionId);

            if (error) {
                return NextResponse.json({ error: `Failed to delete: ${error.message}` }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: 'Submission deleted' });

        } else if (action === 'update') {
            // Update submission fields without changing approval status (unless status field is explicitly set)
            const updateFields: Record<string, string> = {};

            const allowed = [
                'tool_name', 'tool_url', 'description', 'full_description', 'category',
                'pricing', 'submitter_name', 'submitter_email', 'plan', 'status',
            ] as const;

            for (const field of allowed) {
                if (submissionData[field] !== undefined) {
                    updateFields[field] = submissionData[field] as string;
                }
            }

            const { error } = await supabase
                .from('tool_submissions')
                .update(updateFields)
                .eq('id', submissionId);

            if (error) {
                return NextResponse.json({ error: `Failed to update: ${error.message}` }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: 'Submission updated' });

        } else if (action === 'followup') {
            const { message, submitterEmail, toolName } = body as {
                message: string;
                submitterEmail: string;
                toolName: string;
            };

            if (!submitterEmail || !message) {
                return NextResponse.json({ error: 'submitterEmail and message are required' }, { status: 400 });
            }

            // Build the follow-up email HTML inline using the same layout style as lib/email.ts
            const safeMessage = message
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '<br/>');

            const followupHtml = `<!DOCTYPE html>
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
          <h1 style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:26px;font-weight:800;color:#1a1007;line-height:1.2;">A Message From Our Team</h1>
          <p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:15px;color:#79716a;">Regarding your submission: ${toolName}</p>
          <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:15px;color:#4a4540;line-height:1.7;">Hello,</p>
          <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:15px;color:#4a4540;line-height:1.7;">${safeMessage}</p>
          <p style="margin:24px 0 0;font-family:Arial,sans-serif;font-size:14px;color:#79716a;">Best regards,<br/><strong style="color:#1a1007;">The All AI Tool List Team</strong></p>
        </td>
      </tr>
      <tr>
        <td class="footer-td" style="padding:20px 32px;background:#f5f5f5;border-top:1px solid #e8dfd7;text-align:center;">
          <p style="margin:0 0 4px;color:#79716a;font-size:13px;font-family:Arial,sans-serif;">All AI Tool List &mdash; Discover the Best AI Tools</p>
          <p style="margin:0;font-size:12px;font-family:Arial,sans-serif;"><a href="https://allaitoollist.com" style="color:#f97316;text-decoration:none;">allaitoollist.com</a></p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

            const emailResult = await sendEmail({
                to: submitterEmail,
                subject: `Follow-up on Your Submission: ${toolName}`,
                html: followupHtml,
            });

            if (!emailResult.success) {
                console.error('Failed to send follow-up email:', emailResult.error);
                return NextResponse.json({ error: 'Failed to send follow-up email' }, { status: 500 });
            }

            console.log('✅ Follow-up email sent to:', submitterEmail);
            return NextResponse.json({ success: true, message: 'Follow-up email sent' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
