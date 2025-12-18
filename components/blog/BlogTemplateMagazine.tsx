import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Share2, Clock, BookOpen } from 'lucide-react';
import { markdownToHtml } from '@/lib/markdown';

interface BlogTemplateMagazineProps {
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

export function BlogTemplateMagazine({ blog }: BlogTemplateMagazineProps) {
    const formattedDate = blog.formattedDate || '';
    const readingTime = blog.readingTime || 0;

    return (
        <article className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Magazine Header */}
            <div className="mb-8 border-b-2 border-primary/20 pb-6">
                <div className="flex items-center gap-3 mb-4">
                    {blog.category && (
                        <Badge variant="secondary" className="text-xs font-semibold uppercase tracking-wider">
                            {blog.category}
                        </Badge>
                    )}
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {formattedDate}
                    </span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 max-w-4xl">
                    {blog.title}
                </h1>

                {blog.excerpt && (
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl font-medium italic">
                        {blog.excerpt}
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-6 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span className="font-medium">Admin</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{readingTime} min read</span>
                    </div>
                    {blog.views && (
                        <div className="text-muted-foreground">
                            {blog.views} views
                        </div>
                    )}
                </div>
            </div>

            {/* Magazine Layout - Two Columns */}
            <div className="grid md:grid-cols-[1fr_300px] gap-8 lg:gap-12">
                {/* Main Content */}
                <div className="space-y-8">
                    {/* Hero Image */}
                    {blog.cover_image && (
                        <figure className="mb-8">
                            <img
                                src={blog.cover_image}
                                alt={blog.title}
                                className="w-full h-auto rounded-lg shadow-lg"
                            />
                        </figure>
                    )}

                    {/* Article Content - Magazine Style */}
                    <div
                        className="prose prose-xl dark:prose-invert max-w-none
                             prose-headings:font-bold prose-headings:tracking-tight
                             prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base
                             prose-p:text-lg prose-p:leading-[1.8] prose-p:mb-6 prose-p:font-serif
                             prose-a:text-primary prose-a:font-semibold hover:prose-a:underline
                             prose-img:rounded-lg prose-img:my-10 prose-img:shadow-md
                             prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                             prose-pre:bg-muted prose-pre:p-6 prose-pre:rounded-lg prose-pre:shadow-md
                             prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-muted/30 prose-blockquote:py-4 prose-blockquote:my-8 prose-blockquote:text-lg
                             prose-strong:font-bold
                             prose-ul:space-y-3 prose-ol:space-y-3
                             prose-li:marker:text-primary"
                        dangerouslySetInnerHTML={{ __html: markdownToHtml(blog.content || '') }}
                    />

                    {/* Tags Section */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="pt-8 border-t space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.map((tag: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Share Section */}
                    <div className="pt-8 border-t">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Share Article</span>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Share2 className="h-4 w-4" />
                                Share
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                    <div className="sticky top-8 space-y-6">
                        {/* Article Info Card */}
                        <div className="bg-muted/50 rounded-lg p-6 border space-y-4">
                            <div className="flex items-center gap-2 text-sm">
                                <BookOpen className="h-4 w-4 text-primary" />
                                <span className="font-semibold">Article Details</span>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Published:</span>
                                    <p className="font-medium">
                                        {formattedDate}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Reading Time:</span>
                                    <p className="font-medium">{readingTime} minutes</p>
                                </div>
                                {blog.views && (
                                    <div>
                                        <span className="text-muted-foreground">Views:</span>
                                        <p className="font-medium">{blog.views}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Share */}
                        <div className="bg-muted/50 rounded-lg p-6 border">
                            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Share</h3>
                            <Button variant="outline" size="sm" className="w-full gap-2">
                                <Share2 className="h-4 w-4" />
                                Share Article
                            </Button>
                        </div>
                    </div>
                </aside>
            </div>
        </article>
    );
}

