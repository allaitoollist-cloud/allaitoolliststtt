import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// API route for tool management actions
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, toolId, toolIds, field, value } = body;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        // MUST use service role key for delete operations to bypass RLS
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY - delete operations require service role key');
            return NextResponse.json({
                error: 'Missing SUPABASE_SERVICE_ROLE_KEY. Delete operations require service role key to bypass RLS.',
                hint: 'Please set SUPABASE_SERVICE_ROLE_KEY in your environment variables'
            }, { status: 500 });
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
            console.log('🗑️ Deleting tool:', toolId);

            // First verify the tool exists
            const { data: existingTool, error: checkError } = await supabase
                .from('tools')
                .select('id, name, slug, category')
                .eq('id', toolId)
                .single();

            if (checkError || !existingTool) {
                console.error('Tool not found:', checkError);
                return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
            }

            console.log('Tool found:', existingTool.name, 'Slug:', existingTool.slug);

            // Delete the tool
            const { error } = await supabase
                .from('tools')
                .delete()
                .eq('id', toolId);

            if (error) {
                console.error('Delete error:', error);
                return NextResponse.json({ error: `Failed to delete: ${error.message}` }, { status: 500 });
            }

            // Verify deletion - wait a bit for database to update
            await new Promise(resolve => setTimeout(resolve, 500));

            const { data: verifyTool } = await supabase
                .from('tools')
                .select('id')
                .eq('id', toolId)
                .single();

            if (verifyTool) {
                console.error('⚠️ Tool still exists after deletion! Attempting force delete...');
                // Try one more time with force delete
                const { error: forceDeleteError } = await supabase
                    .from('tools')
                    .delete()
                    .eq('id', toolId);

                if (forceDeleteError) {
                    console.error('Force delete also failed:', forceDeleteError);
                    return NextResponse.json({ error: 'Tool deletion failed - tool still exists' }, { status: 500 });
                }
            }

            console.log('✅ Tool deleted successfully:', existingTool.name);

            // Revalidate all pages that show tools
            try {
                revalidatePath('/');
                revalidatePath('/new');
                revalidatePath('/trending');
                revalidatePath('/top-10');
                revalidatePath('/categories');
                revalidatePath(`/tool/${existingTool.slug}`);
                if (existingTool.category) {
                    revalidatePath(`/category/${existingTool.category}`);
                }
                revalidatePath('/admin/tools');
                console.log('✅ Cache revalidated for all tool pages');
            } catch (revalidateError) {
                console.warn('Cache revalidation warning:', revalidateError);
                // Continue even if revalidation fails
            }

            return NextResponse.json({
                success: true,
                message: 'Tool deleted successfully',
                deletedTool: {
                    id: existingTool.id,
                    name: existingTool.name,
                    slug: existingTool.slug
                }
            });
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
