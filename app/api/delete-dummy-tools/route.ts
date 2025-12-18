import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Simple GET endpoint to delete ismail and chatgpt (NOT TaleGenie)
export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ 
                error: 'Missing SUPABASE_SERVICE_ROLE_KEY',
                hint: 'Please set SUPABASE_SERVICE_ROLE_KEY in .env.local'
            }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Only delete ismail and chatgpt (NOT TaleGenie)
        const toolIdsToDelete = [
            '8ac27bbf-1b65-4fb8-9a39-adfc51bba8b3', // ismail
            '7bbf4853-83a1-4900-9e2d-c63202edd545'  // chatgpt
        ];

        // First, get tool names for logging
        const { data: toolsToDelete } = await supabase
            .from('tools')
            .select('id, name, slug')
            .in('id', toolIdsToDelete);

        if (!toolsToDelete || toolsToDelete.length === 0) {
            return NextResponse.json({ 
                message: 'Tools already deleted or not found',
                toolIds: toolIdsToDelete
            });
        }

        console.log(`🗑️ Deleting ${toolsToDelete.length} tools:`, toolsToDelete.map(t => t.name).join(', '));

        // Delete the tools
        const { error: deleteError } = await supabase
            .from('tools')
            .delete()
            .in('id', toolIdsToDelete);

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
            .select('id, name')
            .in('id', toolIdsToDelete);

        if (verifyTools && verifyTools.length > 0) {
            console.error('⚠️ Some tools still exist after deletion!');
            return NextResponse.json({ 
                error: 'Some tools were not deleted',
                stillExist: verifyTools.map(t => ({ id: t.id, name: t.name }))
            }, { status: 500 });
        }

        console.log('✅ Tools deleted successfully:', toolsToDelete.map(t => t.name).join(', '));

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
                revalidatePath(`/category/${tool.category}`);
            });
            console.log('✅ Cache revalidated');
        } catch (revalidateError) {
            console.warn('Cache revalidation warning:', revalidateError);
        }

        return NextResponse.json({
            success: true,
            message: `Successfully deleted ${toolsToDelete.length} tool(s): ${toolsToDelete.map(t => t.name).join(', ')}`,
            deletedTools: toolsToDelete,
            note: 'TaleGenie was NOT deleted as requested'
        });

    } catch (error: any) {
        console.error('Delete error:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            message: error.message 
        }, { status: 500 });
    }
}

