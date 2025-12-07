import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

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
            const slug = submissionData.tool_name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            // First, create the tool in tools table
            const { error: toolError } = await supabase
                .from('tools')
                .insert({
                    name: submissionData.tool_name,
                    slug: slug,
                    short_description: submissionData.description,
                    full_description: submissionData.description,
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
                });

            if (toolError) {
                console.error('Error creating tool:', toolError);
                return NextResponse.json({ error: `Failed to create tool: ${toolError.message}` }, { status: 500 });
            }

            // Update submission status
            const { error } = await supabase
                .from('tool_submissions')
                .update({ status: 'approved', reviewed_at: new Date().toISOString() })
                .eq('id', submissionId);

            if (error) {
                return NextResponse.json({ error: `Failed to approve: ${error.message}` }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: 'Submission approved and tool created!' });

        } else if (action === 'reject') {
            const { error } = await supabase
                .from('tool_submissions')
                .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
                .eq('id', submissionId);

            if (error) {
                return NextResponse.json({ error: `Failed to reject: ${error.message}` }, { status: 500 });
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
