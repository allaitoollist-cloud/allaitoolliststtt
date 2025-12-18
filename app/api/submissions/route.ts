import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';

// API route for approving/rejecting/deleting submissions
// Uses service role key to bypass RLS
export async function POST(request: NextRequest) {
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
            // Note: is_draft column may not exist in database, so we don't include it
            const { data: createdTool, error: toolError } = await supabase
                .from('tools')
                .insert({
                    name: submissionData.tool_name,
                    slug: slug,
                    short_description: submissionData.description || 'No description provided',
                    full_description: submissionData.description || 'No description provided',
                    url: submissionData.tool_url,
                    category: submissionData.category,
                    pricing: submissionData.pricing,
                    tags: [],
                    platform: ['Web'],
                    views: 0,
                    trending: false,
                    featured: false,
                    verified: false,
                    rating: 0,
                    review_count: 0,
                    // is_draft column removed - not present in database schema
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
                const toolUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://aitoollist.com'}/tool/${createdTool.slug}`;
                const emailTemplate = emailTemplates.toolApproved(
                    submissionData.tool_name,
                    toolUrl,
                    submissionData.submitter_email
                );
                
                await sendEmail({
                    to: submissionData.submitter_email,
                    subject: emailTemplate.subject,
                    html: emailTemplate.html,
                });
                console.log('✅ Approval email sent to:', submissionData.submitter_email);
            }

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
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
