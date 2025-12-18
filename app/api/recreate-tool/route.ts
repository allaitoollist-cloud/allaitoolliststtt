import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// API to recreate a tool from an approved submission
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { submissionId } = body;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Get the submission
        const { data: submission, error: subError } = await supabase
            .from('tool_submissions')
            .select('*')
            .eq('id', submissionId)
            .single();

        if (subError || !submission) {
            return NextResponse.json({ 
                error: 'Submission not found',
                details: subError?.message 
            }, { status: 404 });
        }

        if (submission.status !== 'approved') {
            return NextResponse.json({ 
                error: 'Submission is not approved',
                status: submission.status
            }, { status: 400 });
        }

        // Check if tool already exists
        const slug = submission.tool_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const { data: existingTool } = await supabase
            .from('tools')
            .select('id, name, slug')
            .eq('slug', slug)
            .single();

        if (existingTool) {
            return NextResponse.json({ 
                success: true,
                message: 'Tool already exists',
                toolId: existingTool.id,
                toolSlug: existingTool.slug,
                existing: true
            });
        }

        // Create the tool
        let finalSlug = slug;
        let counter = 1;
        let slugExists = true;

        while (slugExists) {
            const { data: existingTools } = await supabase
                .from('tools')
                .select('id')
                .eq('slug', finalSlug)
                .limit(1);

            if (!existingTools || existingTools.length === 0) {
                slugExists = false;
            } else {
                finalSlug = `${slug}-${counter}`;
                counter++;
                if (counter > 100) {
                    finalSlug = `${slug}-${Date.now()}`;
                    slugExists = false;
                }
            }
        }

        // Create tool (without is_draft column as it may not exist in database)
        const { data: createdTool, error: toolError } = await supabase
            .from('tools')
            .insert({
                name: submission.tool_name,
                slug: finalSlug,
                short_description: submission.description || 'No description provided',
                full_description: submission.description || 'No description provided',
                url: submission.tool_url,
                category: submission.category,
                pricing: submission.pricing,
                tags: [],
                platform: ['Web'],
                views: 0,
                trending: false,
                featured: false,
                verified: false,
                rating: 0,
                review_count: 0,
                // is_draft column removed - not present in database schema
            })
            .select()
            .single();

        if (toolError) {
            return NextResponse.json({ 
                error: `Failed to create tool: ${toolError.message}`,
                details: toolError 
            }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true,
            message: 'Tool created successfully',
            toolId: createdTool.id,
            toolSlug: createdTool.slug
        });

    } catch (error: any) {
        return NextResponse.json({ 
            error: 'Internal server error',
            message: error.message 
        }, { status: 500 });
    }
}

