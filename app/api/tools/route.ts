import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// API route for tool management actions
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, toolId, toolIds, field, value } = body;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Toggle single tool field
        if (action === 'toggle') {
            const { error } = await supabase
                .from('tools')
                .update({ [field]: value })
                .eq('id', toolId);

            if (error) {
                return NextResponse.json({ error: `Failed to update: ${error.message}` }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: `Tool ${field} updated` });
        }

        // Delete single tool
        if (action === 'delete') {
            const { error } = await supabase
                .from('tools')
                .delete()
                .eq('id', toolId);

            if (error) {
                return NextResponse.json({ error: `Failed to delete: ${error.message}` }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: 'Tool deleted' });
        }

        // Bulk delete multiple tools
        if (action === 'bulk-delete') {
            const { error } = await supabase
                .from('tools')
                .delete()
                .in('id', toolIds);

            if (error) {
                return NextResponse.json({ error: `Failed to delete: ${error.message}` }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: `${toolIds.length} tools deleted` });
        }

        // Bulk update field
        if (action === 'bulk-update') {
            const { error } = await supabase
                .from('tools')
                .update({ [field]: value })
                .in('id', toolIds);

            if (error) {
                return NextResponse.json({ error: `Failed to update: ${error.message}` }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: `${toolIds.length} tools updated` });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET endpoint for stats
export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Get various counts
        const [
            { count: total },
            { count: featured },
            { count: trending },
            { count: verified },
            { count: drafts },
            { count: published }
        ] = await Promise.all([
            supabase.from('tools').select('*', { count: 'exact', head: true }),
            supabase.from('tools').select('*', { count: 'exact', head: true }).eq('featured', true),
            supabase.from('tools').select('*', { count: 'exact', head: true }).eq('trending', true),
            supabase.from('tools').select('*', { count: 'exact', head: true }).eq('verified', true),
            supabase.from('tools').select('*', { count: 'exact', head: true }).eq('is_draft', true),
            supabase.from('tools').select('*', { count: 'exact', head: true }).eq('is_draft', false),
        ]);

        return NextResponse.json({
            total: total || 0,
            featured: featured || 0,
            trending: trending || 0,
            verified: verified || 0,
            drafts: drafts || 0,
            published: published || 0,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
