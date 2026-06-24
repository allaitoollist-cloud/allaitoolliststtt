import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ADMIN_EMAILS = [
    'muhammadismailkpt@gmail.com',
    'allaitoolist@gmail.com',
    'haramtaxiservice@gmail.com',
];

export async function verifyAdminRequest(req: NextRequest): Promise<boolean> {
    try {
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
