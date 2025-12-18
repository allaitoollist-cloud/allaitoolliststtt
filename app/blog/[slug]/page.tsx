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
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { data: blog } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', params.slug)
        .eq('is_published', true)
        .single();

    if (!blog) {
        return {
            title: 'Blog Post Not Found',
        };
    }

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
        .from('blogs')
        .select('*, template')
        .eq('slug', params.slug)
        .eq('is_published', true)
        .single();

    if (error || !blog) {
        notFound();
    }
    
    // Log for debugging (can remove later)
    if (process.env.NODE_ENV === 'development') {
        console.log('Blog data:', {
            id: blog.id,
            title: blog.title,
            template: blog.template,
            templateType: typeof blog.template
        });
    }

    // Increment views
    await supabase
        .from('blogs')
        .update({ views: (blog.views || 0) + 1 })
        .eq('id', blog.id);

    // Get template from blog data, default to 'default' if not set
    // Handle both null/undefined and empty string cases
    let template = 'default';
    
    // Check if template field exists and has a valid value
    if (blog && 'template' in blog && blog.template) {
        const templateValue = String(blog.template).trim().toLowerCase();
        const validTemplates = ['default', 'modern', 'minimal', 'magazine', 'story'];
        if (templateValue && validTemplates.includes(templateValue)) {
            template = templateValue;
        }
    }
    
    // Format date on server side to avoid hydration mismatch
    // Always provide formatted values to prevent client-side calculation
    const formattedDate = formatBlogDate(blog.created_at);
    const readingTime = Math.ceil((blog.content || '').split(/\s+/).length / 200);
    
    // Prepare blog data with formatted values (always provided)
    const blogData = {
        ...blog,
        formattedDate, // Always provided from server
        readingTime    // Always provided from server
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Back Button - Hidden for Story template */}
                {template !== 'story' && (
                    <div className="container mx-auto px-4 pt-8">
                        <Link href="/blog">
                            <Button variant="ghost" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Blog
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Render based on selected template */}
                {(() => {
                    switch (template) {
                        case 'modern':
                            return <BlogTemplateModern blog={blogData} />;
                        case 'minimal':
                            return <BlogTemplateMinimal blog={blogData} />;
                        case 'magazine':
                            return <BlogTemplateMagazine blog={blogData} />;
                        case 'story':
                            return <BlogTemplateStory blog={blogData} />;
                        case 'default':
                        default:
                            return <BlogTemplateDefault blog={blogData} />;
                    }
                })()}
            </main>
            {template !== 'story' && <Footer />}
        </div>
    );
}
