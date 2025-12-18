import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Check a specific tool by name or ID
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const toolName = searchParams.get('name');
        const toolId = searchParams.get('id');
        const toolSlug = searchParams.get('slug');

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        let query = supabase.from('tools').select('*');

        if (toolId) {
            query = query.eq('id', toolId);
        } else if (toolSlug) {
            query = query.eq('slug', toolSlug);
        } else if (toolName) {
            query = query.ilike('name', `%${toolName}%`);
        } else {
            return NextResponse.json({ error: 'Please provide name, id, or slug parameter' }, { status: 400 });
        }

        const { data: tools, error } = await query;

        if (error) {
            return NextResponse.json({ 
                error: 'Error fetching tool',
                details: error.message 
            }, { status: 500 });
        }

        if (!tools || tools.length === 0) {
            return NextResponse.json({ 
                found: false,
                message: 'Tool not found in database'
            });
        }

        return NextResponse.json({
            found: true,
            count: tools.length,
            tools: tools.map(tool => ({
                id: tool.id,
                name: tool.name,
                slug: tool.slug,
                is_draft: tool.is_draft,
                category: tool.category,
                url: tool.url,
                created_at: tool.created_at,
                will_show_on_homepage: tool.is_draft !== true,
            }))
        });

    } catch (error: any) {
        return NextResponse.json({ 
            error: 'Internal server error',
            message: error.message 
        }, { status: 500 });
    }
}

