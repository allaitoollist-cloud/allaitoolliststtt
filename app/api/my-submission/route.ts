import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get('email')?.toLowerCase().trim();

    if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: submission, error } = await supabase
        .from('tool_submissions')
        .select('tool_name, plan, status, created_at, payment_proof_url')
        .eq('submitter_email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error || !submission) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // If approved, try to find the tool slug
    let tool_slug: string | null = null;
    if (submission.status === 'approved') {
        const { data: tool } = await supabase
            .from('tools')
            .select('slug')
            .ilike('name', submission.tool_name)
            .limit(1)
            .single();
        tool_slug = tool?.slug || null;
    }

    return NextResponse.json({ ...submission, tool_slug });
}
