import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// GET — list all subscribers
export async function GET(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();

    const { data, error } = await getSupabase()
        .from('newsletter_subscribers')
        .select('id, email, active, created_at')
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ subscribers: data });
}

// DELETE — remove subscriber by id
export async function DELETE(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const { error } = await getSupabase()
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}

// PATCH — toggle active status
export async function PATCH(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();

    const { id, active } = await req.json();
    if (!id || active === undefined) {
        return NextResponse.json({ error: 'id and active required' }, { status: 400 });
    }

    const { error } = await getSupabase()
        .from('newsletter_subscribers')
        .update({ active })
        .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
