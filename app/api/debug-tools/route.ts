import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Debug endpoint to check tools in database
export async function GET(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Get all recent tools (last 20)
        const { data: allTools, error: allError } = await supabase
            .from('tools')
            .select('id, name, slug, is_draft, created_at, category, url')
            .order('created_at', { ascending: false })
            .limit(20);

        // Get published tools only (is_draft = false)
        const { data: publishedTools, error: publishedError } = await supabase
            .from('tools')
            .select('id, name, slug, is_draft, created_at, category, url')
            .eq('is_draft', false)
            .order('created_at', { ascending: false })
            .limit(20);

        // Get tools with is_draft = null
        const { data: nullDraftTools, error: nullError } = await supabase
            .from('tools')
            .select('id, name, slug, is_draft, created_at, category, url')
            .is('is_draft', null)
            .order('created_at', { ascending: false })
            .limit(20);

        // Get tools with is_draft = true (drafts)
        const { data: draftTools, error: draftError } = await supabase
            .from('tools')
            .select('id, name, slug, is_draft, created_at, category, url')
            .eq('is_draft', true)
            .order('created_at', { ascending: false })
            .limit(20);

        // Get approved submissions to see which ones were approved
        const { data: approvedSubmissions, error: submissionsError } = await supabase
            .from('tool_submissions')
            .select('id, tool_name, status, reviewed_at, created_at')
            .eq('status', 'approved')
            .order('reviewed_at', { ascending: false })
            .limit(10);

        return NextResponse.json({
            success: true,
            stats: {
                total_recent: allTools?.length || 0,
                published: publishedTools?.length || 0,
                with_null_draft: nullDraftTools?.length || 0,
                drafts: draftTools?.length || 0,
                approved_submissions: approvedSubmissions?.length || 0,
            },
            all_tools: allTools || [],
            published_tools: publishedTools || [],
            null_draft_tools: nullDraftTools || [],
            draft_tools: draftTools || [],
            approved_submissions: approvedSubmissions || [],
            errors: {
                all: allError?.message,
                published: publishedError?.message,
                null: nullError?.message,
                drafts: draftError?.message,
                submissions: submissionsError?.message,
            }
        });

    } catch (error: any) {
        return NextResponse.json({ 
            error: 'Internal server error',
            message: error.message 
        }, { status: 500 });
    }
}

