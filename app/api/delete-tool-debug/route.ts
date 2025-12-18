import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Debug endpoint to check and delete specific tools
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { toolName } = body;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Find tools by name (case insensitive)
        const { data: tools, error: searchError } = await supabase
            .from('tools')
            .select('id, name, slug')
            .ilike('name', `%${toolName}%`);

        if (searchError) {
            return NextResponse.json({ error: searchError.message }, { status: 500 });
        }

        if (!tools || tools.length === 0) {
            return NextResponse.json({ 
                message: `No tools found with name containing "${toolName}"`,
                found: false
            });
        }

        // Delete all matching tools
        const toolIds = tools.map(t => t.id);
        const { error: deleteError } = await supabase
            .from('tools')
            .delete()
            .in('id', toolIds);

        if (deleteError) {
            return NextResponse.json({ error: deleteError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Deleted ${tools.length} tool(s)`,
            deletedTools: tools
        });

    } catch (error) {
        console.error('Delete debug error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET endpoint to list all tools
export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: tools, error } = await supabase
            .from('tools')
            .select('id, name, slug, category, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            total: tools?.length || 0,
            tools: tools || []
        });

    } catch (error) {
        console.error('List tools error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

