import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Share2, Clock, ArrowDown } from 'lucide-react';
import { markdownToHtml } from '@/lib/markdown';

interface BlogTemplateStoryProps {
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
        readingTime?: number;
    };
}

export function BlogTemplateStory({ blog }: BlogTemplateStoryProps) {
    const formattedDate = blog.formattedDate || '';
    const readingTime = blog.readingTime || 0;

    return (
        <article className="min-h-screen">
            {/* Full-Screen Hero Section */}
            <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {blog.cover_image && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={blog.cover_image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
                    </div>
                )}
                {!blog.cover_image && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
                )}

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white max-w-4xl">
                    {blog.category && (
                        <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                            {blog.category}
                        </Badge>
                    )}

                    <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 drop-shadow-2xl">
                        {blog.title}
                    </h1>

                    {blog.excerpt && (
                        <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-2xl mx-auto">
                            {blog.excerpt}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80 mb-8">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Admin</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{readingTime} min read</span>
                        </div>
                        {blog.views && (
                            <div>
                                {blog.views} views
                            </div>
                        )}
                    </div>

                    {/* Scroll Indicator */}
                    <div className="animate-bounce">
                        <ArrowDown className="h-6 w-6 mx-auto text-white/60" />
                    </div>
                </div>
            </div>

            {/* Story Content - Centered and Immersive */}
            <div className="bg-background">
                <div className="container mx-auto px-4 py-16 max-w-4xl">
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none
                             prose-headings:font-bold prose-headings:tracking-tight
                             prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base
                             prose-p:text-lg prose-p:leading-[1.9] prose-p:mb-8
                             prose-a:text-primary prose-a:font-medium hover:prose-a:underline
                             prose-img:rounded-xl prose-img:my-12 prose-img:shadow-2xl
                             prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                             prose-pre:bg-muted prose-pre:p-6 prose-pre:rounded-xl prose-pre:shadow-xl
                             prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-muted/50 prose-blockquote:py-6 prose-blockquote:my-10 prose-blockquote:text-lg prose-blockquote:rounded-r-lg
                             prose-strong:font-semibold
                             prose-ul:space-y-3 prose-ol:space-y-3
                             prose-li:marker:text-primary"
                        dangerouslySetInnerHTML={{ __html: markdownToHtml(blog.content || '') }}
                    />

                    {/* Story Footer */}
                    <div className="mt-20 pt-12 border-t space-y-8">
                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tags</h3>
                                <div className="flex flex-wrap gap-3">
                                    {blog.tags.map((tag: string, index: number) => (
                                        <Badge key={index} variant="secondary" className="text-sm px-4 py-1.5">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Share Section */}
                        <div className="flex items-center justify-between pt-6 border-t">
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Share this story</h3>
                                <p className="text-sm text-muted-foreground">Help others discover this content</p>
                            </div>
                            <Button variant="default" size="lg" className="gap-2">
                                <Share2 className="h-5 w-5" />
                                Share Article
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

