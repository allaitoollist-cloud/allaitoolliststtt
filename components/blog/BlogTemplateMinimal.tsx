import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Share2 } from 'lucide-react';
import { markdownToHtml } from '@/lib/markdown';

interface BlogTemplateMinimalProps {
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

export function BlogTemplateMinimal({ blog }: BlogTemplateMinimalProps) {
    const formattedDate = blog.formattedDate || '';

    return (
        <article className="container mx-auto px-4 py-12 max-w-3xl">
            {/* Minimal Header */}
            <header className="mb-12 text-center space-y-4">
                {blog.category && (
                    <Badge variant="outline" className="text-xs font-normal">
                        {blog.category}
                    </Badge>
                )}
                
                <h1 className="text-4xl md:text-5xl font-light tracking-tight leading-tight">
                    {blog.title}
                </h1>

                {blog.excerpt && (
                    <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
                        {blog.excerpt}
                    </p>
                )}

                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-4 border-t">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5" />
                        <span>Admin</span>
                    </div>
                    {blog.views && (
                        <div className="text-xs">
                            {blog.views} views
                        </div>
                    )}
                </div>
            </header>

            {/* Cover Image - Minimal Style */}
            {blog.cover_image && (
                <div className="mb-12">
                    <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="w-full h-auto"
                    />
                </div>
            )}

            {/* Article Content - Clean Typography */}
            <div
                className="prose prose-lg dark:prose-invert max-w-none
                     prose-headings:font-light prose-headings:tracking-tight
                     prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-h6:text-sm
                     prose-p:text-base prose-p:leading-relaxed prose-p:mb-6 prose-p:font-light
                     prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-primary
                     prose-img:my-12
                     prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                     prose-pre:bg-muted prose-pre:p-6 prose-pre:rounded-none prose-pre:border-l-2 prose-pre:border-primary
                     prose-blockquote:border-l-2 prose-blockquote:border-muted prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:font-light prose-blockquote:text-muted-foreground
                     prose-strong:font-normal
                     prose-ul:space-y-2 prose-ol:space-y-2
                     prose-li:marker:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(blog.content || '') }}
            />

            {/* Minimal Footer */}
            <footer className="mt-16 pt-8 border-t space-y-6">
                {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                        {blog.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs font-normal">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-center">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                    </Button>
                </div>
            </footer>
        </article>
    );
}

