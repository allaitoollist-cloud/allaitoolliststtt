import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();

    const adminSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
    try {
        const { data: authData, error: authError } = await adminSupabase.auth.admin.listUsers();
        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 500 });
        }

        const { data: profiles } = await adminSupabase
            .from('user_profiles')
            .select('id, is_admin');

        const profilesMap = new Map(profiles?.map(p => [p.id, p.is_admin]) || []);

        const users = authData.users.map(user => ({
            id: user.id,
            email: user.email || '',
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
            is_admin: profilesMap.get(user.id) || false,
        }));

        return NextResponse.json({ users });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
