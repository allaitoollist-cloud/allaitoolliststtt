import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BlogTemplateDefault } from '@/components/blog/BlogTemplateDefault';
import { BlogTemplateModern } from '@/components/blog/BlogTemplateModern';
import { BlogTemplateMinimal } from '@/components/blog/BlogTemplateMinimal';
import { BlogTemplateMagazine } from '@/components/blog/BlogTemplateMagazine';
import { BlogTemplateStory } from '@/components/blog/BlogTemplateStory';
import { formatBlogDate } from '@/lib/markdown';

export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
    params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { data: blog } = await supabase
        .from('blogs').select('*').eq('slug', params.slug).eq('is_published', true).single();
    if (!blog) return { title: 'Blog Post Not Found' };
    return {
        title: blog.meta_title || blog.title,
        description: blog.meta_description || blog.excerpt,
        keywords: blog.meta_keywords,
        openGraph: {
            title: blog.meta_title || blog.title,
            description: blog.meta_description || blog.excerpt,
            images: blog.cover_image ? [blog.cover_image] : [],
            type: 'article',
            publishedTime: blog.created_at,
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { data: blog, error } = await supabase
        .from('blogs').select('*').eq('slug', params.slug).eq('is_published', true).single();

    if (error || !blog) notFound();

    // Increment views
    await supabase.from('blogs').update({ views: (blog.views || 0) + 1 }).eq('id', blog.id);

    // Fetch related tool if linked
    let relatedTool = null;
    if (blog.related_tool_slug) {
        const { data: tool } = await supabase
            .from('tools')
            .select('name, slug, icon, url, pricing, short_description, category')
            .eq('slug', blog.related_tool_slug)
            .eq('status', 'approved')
            .single();
        relatedTool = tool || null;
    }

    // If no explicit tool, try to auto-match by blog title (first word match)
    if (!relatedTool) {
        const firstWord = blog.title.split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        if (firstWord.length > 3) {
            const { data: tool } = await supabase
                .from('tools')
                .select('name, slug, icon, url, pricing, short_description, category')
                .ilike('slug', `%${firstWord}%`)
                .eq('status', 'approved')
                .limit(1)
                .maybeSingle();
            relatedTool = tool || null;
        }
    }

    const template = (() => {
        if (!blog.template) return 'default';
        const valid = ['default', 'modern', 'minimal', 'magazine', 'story'];
        const t = String(blog.template).trim().toLowerCase();
        return valid.includes(t) ? t : 'default';
    })();

    const blogData = {
        ...blog,
        formattedDate: formatBlogDate(blog.created_at),
        readingTime: blog.reading_time || Math.ceil((blog.content || '').split(/\s+/).length / 200),
        relatedTool,
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                {template !== 'story' && (
                    <div className="container mx-auto px-4 pt-8">
                        <Link href="/blog">
                            <Button variant="ghost" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />Back to Blog
                            </Button>
                        </Link>
                    </div>
                )}
                {(() => {
                    switch (template) {
                        case 'modern':   return <BlogTemplateModern blog={blogData} />;
                        case 'minimal':  return <BlogTemplateMinimal blog={blogData} />;
                        case 'magazine': return <BlogTemplateMagazine blog={blogData} />;
                        case 'story':    return <BlogTemplateStory blog={blogData} />;
                        default:         return <BlogTemplateDefault blog={blogData} />;
                    }
                })()}
            </main>
            {template !== 'story' && <Footer />}
        </div>
    );
}
