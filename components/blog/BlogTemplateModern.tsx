import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Share2, Clock } from 'lucide-react';
import Link from 'next/link';
import { markdownToHtml } from '@/lib/markdown';

interface BlogTemplateModernProps {
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

export function BlogTemplateModern({ blog }: BlogTemplateModernProps) {
    // Use formatted values from props (always provided from server)
    const formattedDate = blog.formattedDate || '';
    const readingTime = blog.readingTime || 0;

    return (
        <article className="container mx-auto px-4 py-12 max-w-5xl">
            {/* Modern Header with Gradient Background */}
            <div className="relative mb-12 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background p-8 md:p-12">
                {blog.cover_image && (
                    <div className="absolute inset-0 opacity-10">
                        <img
                            src={blog.cover_image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <div className="relative z-10">
                    {blog.category && (
                        <Badge variant="secondary" className="text-sm mb-4 bg-primary/20 border-primary/30">
                            {blog.category}
                        </Badge>
                    )}

                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {blog.title}
                    </h1>

                    {blog.excerpt && (
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
                            {blog.excerpt}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full">
                            <Calendar className="h-4 w-4" />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full">
                            <User className="h-4 w-4" />
                            <span>Admin</span>
                        </div>
                        <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full">
                            <Clock className="h-4 w-4" />
                            <span>{readingTime} min read</span>
                        </div>
                        {blog.views && (
                            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full">
                                <span>{blog.views} views</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Full-width Cover Image */}
            {blog.cover_image && (
                <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
                    <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="w-full h-auto max-h-[600px] object-cover"
                    />
                </div>
            )}

            {/* Article Content with Modern Styling */}
            <div className="grid md:grid-cols-[1fr_250px] gap-8">
                <div className="prose prose-lg dark:prose-invert max-w-none 
                         prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base
                         prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
                         prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                         prose-img:rounded-xl prose-img:my-10 prose-img:shadow-lg
                         prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                         prose-pre:bg-muted prose-pre:p-6 prose-pre:rounded-xl prose-pre:shadow-lg
                         prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-muted/50 prose-blockquote:py-4 prose-blockquote:rounded-r-lg
                         prose-strong:font-semibold prose-strong:text-foreground
                         prose-ul:space-y-2 prose-ol:space-y-2"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(blog.content || '') }}
                />

                {/* Sidebar */}
                <aside className="hidden md:block space-y-6">
                    <div className="sticky top-8 space-y-6">
                        {/* Share Section */}
                        <div className="bg-muted/50 rounded-xl p-6 border">
                            <h3 className="font-semibold mb-4">Share Article</h3>
                            <Button variant="outline" size="sm" className="w-full gap-2">
                                <Share2 className="h-4 w-4" />
                                Share
                            </Button>
                        </div>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="bg-muted/50 rounded-xl p-6 border">
                                <h3 className="font-semibold mb-4">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {blog.tags.map((tag: string, index: number) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            {/* Mobile Tags and Share */}
            <div className="md:hidden mt-8 space-y-4 pt-8 border-t">
                {blog.tags && blog.tags.length > 0 && (
                    <div>
                        <span className="text-sm font-medium mb-2 block">Tags:</span>
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag: string, index: number) => (
                                <Badge key={index} variant="outline">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex items-center gap-4">
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

