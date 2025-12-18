import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// API endpoint to fix tools with null is_draft values
export async function POST(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Find all tools with null is_draft
        const { data: nullDraftTools, error: findError } = await supabase
            .from('tools')
            .select('id, name, is_draft')
            .is('is_draft', null);

        if (findError) {
            return NextResponse.json({ 
                error: 'Error finding tools',
                details: findError.message 
            }, { status: 500 });
        }

        if (!nullDraftTools || nullDraftTools.length === 0) {
            return NextResponse.json({ 
                success: true, 
                message: 'No tools with null is_draft found',
                fixed: 0
            });
        }

        // Update all null is_draft to false (published)
        const { data: updatedTools, error: updateError } = await supabase
            .from('tools')
            .update({ is_draft: false })
            .is('is_draft', null)
            .select('id, name');

        if (updateError) {
            return NextResponse.json({ 
                error: 'Error updating tools',
                details: updateError.message 
            }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            message: `Fixed ${updatedTools?.length || 0} tools`,
            fixed: updatedTools?.length || 0,
            tools: updatedTools
        });

    } catch (error: any) {
        return NextResponse.json({ 
            error: 'Internal server error',
            message: error.message 
        }, { status: 500 });
    }
}

