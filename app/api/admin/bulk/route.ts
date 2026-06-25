import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';
import { logActivity } from '@/lib/log-activity';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();

    const { action, ids } = await req.json() as { action: string; ids: string[] };

    if (!Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }

    if (action === 'reject') {
        const { error } = await supabase
            .from('tool_submissions')
            .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
            .in('id', ids);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        await logActivity('bulk_reject', { count: ids.length, ids });
        return NextResponse.json({ success: true, affected: ids.length });
    }

    if (action === 'delete') {
        const { error } = await supabase
            .from('tool_submissions')
            .delete()
            .in('id', ids);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        await logActivity('bulk_delete', { count: ids.length, ids });
        return NextResponse.json({ success: true, affected: ids.length });
    }

    if (action === 'flag') {
        const { error } = await supabase
            .from('tool_submissions')
            .update({ status: 'flagged' })
            .in('id', ids);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        await logActivity('bulk_flag', { count: ids.length });
        return NextResponse.json({ success: true, affected: ids.length });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
