import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// One-time migration: rename "AIxploria Selection" → "All AI Tool List Selection"
// in both the tools table and tool_submissions table
export async function POST(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();

    const OLD = 'AIxploria Selection';
    const NEW = 'All AI Tool List Selection';

    const [tools, submissions] = await Promise.all([
        supabase.from('tools').update({ category: NEW }).eq('category', OLD).select('id'),
        supabase.from('tool_submissions').update({ category: NEW }).eq('category', OLD).select('id'),
    ]);

    const errors: string[] = [];
    if (tools.error) errors.push(`tools: ${tools.error.message}`);
    if (submissions.error) errors.push(`submissions: ${submissions.error.message}`);

    if (errors.length) {
        return NextResponse.json({ error: errors.join(' | ') }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        toolsRenamed: tools.data?.length ?? 0,
        submissionsRenamed: submissions.data?.length ?? 0,
        from: OLD,
        to: NEW,
    });
}
