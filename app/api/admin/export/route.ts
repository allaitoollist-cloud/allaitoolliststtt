import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') ?? 'submissions';

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const tableMap: Record<string, string> = {
        submissions: 'tool_submissions',
        tools: 'tools',
        subscribers: 'newsletter_subscribers',
    };

    const table = tableMap[type] ?? 'tool_submissions';

    const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data || data.length === 0) {
        return new NextResponse('', {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${type}-empty.csv"`,
            },
        });
    }

    const cols = Object.keys(data[0]);
    const escape = (val: unknown) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const rows = [cols.join(','), ...data.map(row => cols.map(c => escape(row[c])).join(','))];

    return new NextResponse(rows.join('\r\n'), {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="${type}-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
    });
}
