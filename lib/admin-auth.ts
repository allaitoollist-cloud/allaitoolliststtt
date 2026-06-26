import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ADMIN_EMAILS = [
    'muhammadismailkpt@gmail.com',
    'allaitoolist@gmail.com',
    'haramtaxiservice@gmail.com',
];

export async function verifyAdminRequest(req: NextRequest): Promise<boolean> {
    try {
        // 1. Check x-admin-token header (sent by client-side admin pages)
        const token = req.headers.get('x-admin-token');
        if (token) {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser(token);
            if (user?.email && ALLOWED_ADMIN_EMAILS.includes(user.email)) return true;
        }

        // 2. Fallback: check auth cookies (for SSR / server components)
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name) { return req.cookies.get(name)?.value; },
                    set() {},
                    remove() {},
                },
            }
        );
        const { data: { user } } = await supabase.auth.getUser();
        return !!(user?.email && ALLOWED_ADMIN_EMAILS.includes(user.email));
    } catch {
        return false;
    }
}

export function unauthorizedJson(): NextResponse {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
