import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Share2 } from 'lucide-react';
import Link from 'next/link';
import { markdownToHtml } from '@/lib/markdown';

interface BlogTemplateDefaultProps {
    blog: {
        title: string;
        excerpt?: string;
        cover_image?: string;
        category?: string;
        created_at: string;
        views?: number;
        tags?: string[];
        content: string;
        formattedDate?: string;
    };
}

export function BlogTemplateDefault({ blog }: BlogTemplateDefaultProps) {
    // Use formatted date from props (always provided from server)
    const formattedDate = blog.formattedDate || '';

    return (
        <article className="container mx-auto px-4 py-8 max-w-4xl">
            {blog.cover_image && (
                <div className="mb-8 rounded-lg overflow-hidden">
                    <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="w-full h-auto max-h-[500px] object-cover"
                    />
                </div>
            )}

            <div className="space-y-6">
                {blog.category && (
                    <Badge variant="secondary" className="text-sm">
                        {blog.category}
                    </Badge>
                )}

                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                    {blog.title}
                </h1>

                {blog.excerpt && (
                    <p className="text-xl text-muted-foreground">
                        {blog.excerpt}
                    </p>
                )}

                <div className="flex items-center gap-6 text-sm text-muted-foreground border-y py-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                            <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Admin</span>
                    </div>
                    {blog.views && (
                        <div>
                            {blog.views} views
                        </div>
                    )}
                </div>

                {/* Article Content */}
                <div
                    className="prose prose-lg dark:prose-invert max-w-none 
                         prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                         prose-p:text-base prose-p:leading-relaxed prose-p:mb-4
                         prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                         prose-img:rounded-lg prose-img:my-8
                         prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded
                         prose-pre:bg-muted prose-pre:p-6
                         prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4
                         prose-strong:font-semibold"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(blog.content || '') }}
                />

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-8 border-t">
                        <span className="text-sm font-medium">Tags:</span>
                        {blog.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Share Section */}
                <div className="flex items-center gap-4 pt-8 border-t">
                    <span className="text-sm font-medium">Share:</span>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Share Article
                    </Button>
                </div>
            </div>
        </article>
    );
}

