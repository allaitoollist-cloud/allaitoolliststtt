import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function POST(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();

    try {
        const { blog, id } = await req.json();
        if (!blog?.title || !blog?.content) {
            return NextResponse.json({ error: 'title and content required' }, { status: 400 });
        }

        const supabase = getSupabase();
        const blogData = {
            title: blog.title,
            slug: blog.slug,
            content: blog.content,
            excerpt: blog.excerpt || '',
            cover_image: blog.cover_image || null,
            meta_title: blog.meta_title || blog.title.slice(0, 60),
            meta_description: blog.meta_description || '',
            meta_keywords: blog.meta_keywords || '',
            category: blog.category || 'AI Tools',
            is_published: blog.is_published ?? false,
            template: blog.template || 'default',
            author_id: null,
            updated_at: new Date().toISOString(),
        };

        if (id) {
            const { error } = await supabase.from('blogs').update(blogData).eq('id', id);
            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            return NextResponse.json({ success: true });
        } else {
            const { data, error } = await supabase.from('blogs').insert([blogData]).select('id').single();
            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            return NextResponse.json({ success: true, id: data.id });
        }
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
