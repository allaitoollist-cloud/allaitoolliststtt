import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_ADMIN_EMAILS = [
    'muhammadismailkpt@gmail.com',
    'allaitoolist@gmail.com',
    'haramtaxiservice@gmail.com',
];

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

async function isAdmin(req: NextRequest): Promise<boolean> {
    try {
        const token = req.headers.get('x-admin-token');
        if (!token) return false;
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { user } } = await supabase.auth.getUser(token);
        return !!(user?.email && ALLOWED_ADMIN_EMAILS.includes(user.email));
    } catch { return false; }
}

export async function GET(req: NextRequest) {
    if (!await isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const supabase = getSupabase();
    const { data, error } = await supabase.from('site_settings').select('key, value');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const settings: Record<string, string> = {};
    data?.forEach(row => { settings[row.key] = row.value || ''; });
    return NextResponse.json({ settings });
}

export async function POST(req: NextRequest) {
    if (!await isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const supabase = getSupabase();
    try {
        const { settings } = await req.json();
        if (!settings || typeof settings !== 'object') {
            return NextResponse.json({ error: 'settings object required' }, { status: 400 });
        }
        const upserts = Object.entries(settings).map(([key, value]) => ({
            key,
            value: String(value ?? ''),
            updated_at: new Date().toISOString(),
        }));
        const { error } = await supabase
            .from('site_settings')
            .upsert(upserts, { onConflict: 'key' });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
