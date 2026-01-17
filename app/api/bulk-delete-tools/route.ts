import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Bulk delete specific tools by IDs
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { toolIds } = body;

        if (!toolIds || !Array.isArray(toolIds) || toolIds.length === 0) {
            return NextResponse.json({ error: 'toolIds array is required' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({
                error: 'Missing SUPABASE_SERVICE_ROLE_KEY',
                hint: 'Delete operations require service role key'
            }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // First, get tool names for logging
        const { data: toolsToDelete } = await supabase
            .from('tools')
            .select('id, name, slug, category')
            .in('id', toolIds);

        if (!toolsToDelete || toolsToDelete.length === 0) {
            return NextResponse.json({
                message: 'No tools found with provided IDs',
                toolIds
            });
        }

        console.log(`🗑️ Deleting ${toolsToDelete.length} tools:`, toolsToDelete.map(t => t.name).join(', '));

        // Delete the tools
        const { error: deleteError } = await supabase
            .from('tools')
            .delete()
            .in('id', toolIds);

        if (deleteError) {
            console.error('Delete error:', deleteError);
            return NextResponse.json({
                error: `Failed to delete: ${deleteError.message}`,
                details: deleteError
            }, { status: 500 });
        }

        // Verify deletion
        await new Promise(resolve => setTimeout(resolve, 500));

        const { data: verifyTools } = await supabase
            .from('tools')
            .select('id')
            .in('id', toolIds);

        if (verifyTools && verifyTools.length > 0) {
            console.error('⚠️ Some tools still exist after deletion!');
            return NextResponse.json({
                error: 'Some tools were not deleted',
                stillExist: verifyTools.map(t => t.id)
            }, { status: 500 });
        }

        console.log('✅ All tools deleted successfully');

        // Revalidate all pages
        try {
            revalidatePath('/');
            revalidatePath('/new');
            revalidatePath('/trending');
            revalidatePath('/top-10');
            revalidatePath('/categories');
            revalidatePath('/admin/tools');
            toolsToDelete.forEach(tool => {
                revalidatePath(`/tool/${tool.slug}`);
                if (tool.category) {
                    revalidatePath(`/category/${tool.category}`);
                }
            });
            console.log('✅ Cache revalidated');
        } catch (revalidateError) {
            console.warn('Cache revalidation warning:', revalidateError);
        }

        return NextResponse.json({
            success: true,
            message: `Successfully deleted ${toolsToDelete.length} tool(s)`,
            deletedTools: toolsToDelete
        });

    } catch (error: any) {
        console.error('Bulk delete error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            message: error.message
        }, { status: 500 });
    }
}

