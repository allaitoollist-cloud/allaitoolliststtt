import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';

const ALLOWED_TABLES = new Set([
    'tool_submissions',
    'contact_messages',
    'tools',
    'categories',
    'activity_logs',
    'newsletter_subscribers',
    'sponsorship_requests',
    'paypal_orders',
    'blogs',
    'reviews',
]);

export async function GET(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();

    const { searchParams } = new URL(req.url);
    const table    = searchParams.get('table') ?? '';
    const select   = searchParams.get('select') ?? '*';
    const orderBy  = searchParams.get('orderBy') ?? 'created_at';
    const orderDir = searchParams.get('orderDir') ?? 'desc';
    const limit    = Math.min(parseInt(searchParams.get('limit') ?? '2000'), 5000);

    if (!ALLOWED_TABLES.has(table)) {
        return NextResponse.json({ error: 'Table not allowed' }, { status: 400 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
        .from(table)
        .select(select)
        .order(orderBy, { ascending: orderDir === 'asc' })
        .limit(limit);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: data ?? [] });
}
