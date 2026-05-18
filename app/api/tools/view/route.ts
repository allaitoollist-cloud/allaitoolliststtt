import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { slug } = await req.json();
        if (!slug?.trim()) {
            return NextResponse.json({ error: 'slug required' }, { status: 400 });
        }

        // Try RPC first, fall back to direct update
        const { error } = await supabase.rpc('increment_views', { tool_slug: slug });

        if (error) {
            const { data: tool } = await supabase
                .from('tools')
                .select('id, views')
                .eq('slug', slug)
                .single();

            if (tool) {
                await supabase
                    .from('tools')
                    .update({ views: (tool.views || 0) + 1 })
                    .eq('id', tool.id);
            }
        }

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
