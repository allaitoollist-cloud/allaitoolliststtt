import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';

function db() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// PATCH — update status (read / replied)
export async function PATCH(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 });

    const { error } = await db().from('contact_messages').update({ status }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}

// DELETE — remove message
export async function DELETE(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const { error } = await db().from('contact_messages').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
