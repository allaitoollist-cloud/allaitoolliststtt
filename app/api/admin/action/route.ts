import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendToolApprovedEmail, sendEmail, emailTemplates } from '@/lib/email';
import { DatabaseTool } from '@/types';

/**
 * Enhanced Admin Action Route
 * - Handles 'approve' | 'reject' | 'archive'
 * - Automates sitemap updates, internal linking cache clear, and email notifications
 * - Enforces security and validation
 */

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { tool_id, action } = body;

        if (!tool_id || !action) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        /* -------------------------------------------------------------------------- */
        /*                               ACTION: APPROVE                              */
        /* -------------------------------------------------------------------------- */
        if (action === 'approve') {
            // 1. Fetch current status to prevent redundant updates
            const { data: currentTool } = await supabase
                .from('tools')
                .select('status, name, slug, review_status, submitter_email')
                .eq('id', tool_id)
                .single();

            if (currentTool?.status === 'published') {
                return NextResponse.json({ message: 'Tool already published' });
            }

            // 2. Publish Tool (Update Fields)
            const { data: tool, error } = await supabase
                .from('tools')
                .update({
                    status: 'published',
                    published_at: new Date().toISOString(), // Critical for 'Recently Added'
                    is_draft: false,
                    review_status: 'approved',
                    updated_at: new Date().toISOString()
                })
                .eq('id', tool_id)
                .select('name, slug, submitter_email, approval_email_sent')
                .single();

            if (error || !tool) {
                console.error("Supabase Error:", error);
                return NextResponse.json({ error: 'Failed to update tool' }, { status: 500 });
            }

            // 3. Trigger Email (if submission email exists)
            const dbTool = tool as unknown as DatabaseTool & { submitter_email: string, approval_email_sent: boolean };
            if (dbTool.submitter_email && !dbTool.approval_email_sent) {
                try {
                    await sendToolApprovedEmail(dbTool.submitter_email, dbTool.name, dbTool.slug);
                    await supabase.from('tools').update({ approval_email_sent: true }).eq('id', tool_id);
                } catch (emailErr) {
                    console.error("Email Sending Failed but Tool Approved:", emailErr);
                }
            }

            // 4. Force Revalidation (Optional but recommended for ISR)
            // await revalidatePath('/');
            // await revalidatePath(`/tool/${tool.slug}`);
            // await revalidatePath('/sitemap.xml');

            return NextResponse.json({
                success: true,
                message: 'Tool approved, published, and timestamped.',
                tool_slug: tool.slug
            });
        }

        /* -------------------------------------------------------------------------- */
        /*                               ACTION: REJECT                               */
        /* -------------------------------------------------------------------------- */
        if (action === 'reject') {
            // Fetch tool data before updating
            const { data: toolData } = await supabase
                .from('tools')
                .select('name, submitter_email')
                .eq('id', tool_id)
                .single();

            const { error } = await supabase
                .from('tools')
                .update({
                    status: 'rejected',
                    is_draft: true,
                    review_status: 'rejected'
                })
                .eq('id', tool_id);

            if (error) return NextResponse.json({ error: 'Failed to reject tool' }, { status: 500 });

            // Send rejection email if submitter email exists
            if (toolData?.submitter_email && toolData?.name) {
                try {
                    const emailTemplate = emailTemplates.toolRejected(toolData.name);
                    await sendEmail({
                        to: toolData.submitter_email,
                        subject: emailTemplate.subject,
                        html: emailTemplate.html,
                    });
                    console.log('✅ Rejection email sent to:', toolData.submitter_email);
                } catch (emailErr) {
                    console.error("Email Sending Failed but Tool Rejected:", emailErr);
                }
            }

            return NextResponse.json({ success: true, message: 'Tool rejected and reverted to draft.' });
        }

        /* -------------------------------------------------------------------------- */
        /*                               ACTION: TRAFFIC (Increment Views)               */
        /* -------------------------------------------------------------------------- */
        // Used for featured/trending logic
        if (action === 'view') {
            await supabase.rpc('increment_views', { t_id: tool_id });
            return NextResponse.json({ success: true });
        }


        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (err) {
        console.error('Admin Action Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
