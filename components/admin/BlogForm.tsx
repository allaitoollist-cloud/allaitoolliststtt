'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { MarkdownEditor } from '@/components/admin/MarkdownEditor';

interface BlogFormProps {
    initialData?: {
        id?: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        cover_image: string;
        meta_title: string;
        meta_description: string;
        meta_keywords: string;
        category: string;
        is_published: boolean;
        template?: string;
    };
    isEditing?: boolean;
}

export function BlogForm({ initialData, isEditing = false }: BlogFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [keywords, setKeywords] = useState('');

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        cover_image: initialData?.cover_image || '',
        meta_title: initialData?.meta_title || '',
        meta_description: initialData?.meta_description || '',
        meta_keywords: initialData?.meta_keywords || '',
        category: initialData?.category || '',
        is_published: initialData?.is_published || false,
        template: initialData?.template || 'default',
    });

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title,
            slug: !isEditing ? generateSlug(title) : prev.slug
        }));
    };

    const handleGenerateBlog = async () => {
        if (!keywords.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter keywords to generate blog',
                variant: 'destructive',
            });
            return;
        }

        setGenerating(true);
        try {
            console.log('Sending request to generate blog with keywords:', keywords);
            
            const response = await fetch('/api/generate-blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    keywords: keywords.trim(),
                    category: formData.category || ''
                }),
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
            console.log('Blog data received:', data.blog);

            if (!response.ok) {
                console.error('API Error:', data);
                throw new Error(data.error || data.details || 'Failed to generate blog');
            }

            if (data.success && data.blog) {
                // Validate required fields
                if (!data.blog.title || !data.blog.content) {
                    console.error('Missing required fields:', {
                        hasTitle: !!data.blog.title,
                        hasContent: !!data.blog.content,
                        blog: data.blog
                    });
                    throw new Error('Generated blog is missing required fields (title or content)');
                }

                // Fill form with generated content
                const updatedFormData = {
                    ...formData,
                    title: data.blog.title || formData.title,
                    slug: data.blog.slug || formData.slug,
                    content: data.blog.content || formData.content,
                    excerpt: data.blog.excerpt || formData.excerpt || (data.blog.content?.substring(0, 200) + '...'),
                    meta_title: data.blog.meta_title || formData.meta_title || data.blog.title?.substring(0, 60),
                    meta_description: data.blog.meta_description || formData.meta_description || data.blog.excerpt?.substring(0, 160),
                    meta_keywords: data.blog.meta_keywords || formData.meta_keywords || keywords,
                    category: data.blog.category || formData.category,
                    is_published: false // Keep as draft
                };

                console.log('Updating form with:', {
                    title: updatedFormData.title,
                    contentLength: updatedFormData.content?.length,
                    excerpt: updatedFormData.excerpt?.substring(0, 50)
                });

                setFormData(updatedFormData);

                toast({
                    title: 'Success',
                    description: `Blog generated successfully! Title: ${data.blog.title?.substring(0, 50)}...`,
                });
            } else {
                console.error('Invalid response structure:', data);
                throw new Error('Invalid response from blog generation API');
            }
        } catch (error: any) {
            console.error('Error generating blog:', error);
            const errorMessage = error.message || error.toString() || 'Failed to generate blog';
            toast({
                title: 'Error',
                description: errorMessage.length > 100 ? errorMessage.substring(0, 100) + '...' : errorMessage,
                variant: 'destructive',
            });
        } finally {
            setGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // TEMP: Auth check disabled for testing
            // const { data: { user } } = await supabase.auth.getUser();
            // if (!user) throw new Error('Not authenticated');

            const blogData = {
                ...formData,
                template: formData.template || 'default', // Ensure template is always set
                author_id: null, // TEMP: Set to null since auth is disabled
                updated_at: new Date().toISOString(),
            };
            
            // Ensure template is always a valid value
            if (!blogData.template || !['default', 'modern', 'minimal', 'magazine', 'story'].includes(blogData.template)) {
                blogData.template = 'default';
            }
            
            // Debug log
            if (process.env.NODE_ENV === 'development') {
                console.log('Saving blog with template:', blogData.template, 'Full data:', blogData);
            }

            let error;

            if (isEditing && initialData?.id) {
                const { error: updateError } = await supabase
                    .from('blogs')
                    .update(blogData)
                    .eq('id', initialData.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('blogs')
                    .insert([blogData]);
                error = insertError;
            }

            if (error) throw error;

            toast({
                title: 'Success',
                description: `Blog post ${isEditing ? 'updated' : 'created'} successfully.`,
            });

            router.push('/admin/blogs');
            router.refresh();
        } catch (error: any) {
            console.error('Error saving blog:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to save blog post',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blogs">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">{isEditing ? 'Edit Post' : 'Create New Post'}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="published"
                            checked={formData.is_published}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                        />
                        <Label htmlFor="published">Published</Label>
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Post
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {/* AI Blog Generator */}
                {!isEditing && (
                    <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">AI Blog Generator</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Enter keywords and let AI write a complete blog post for you. It will be saved as draft.
                            </p>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter keywords (e.g., AI tools, productivity tips, technology trends)"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !generating) {
                                            handleGenerateBlog();
                                        }
                                    }}
                                    disabled={generating}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    onClick={handleGenerateBlog}
                                    disabled={generating || !keywords.trim()}
                                    className="gap-2"
                                >
                                    {generating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4" />
                                            Generate Blog
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={handleTitleChange}
                                placeholder="Enter post title"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                placeholder="post-url-slug"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="excerpt">Excerpt</Label>
                            <Textarea
                                id="excerpt"
                                value={formData.excerpt}
                                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                placeholder="Brief summary for cards and SEO"
                                rows={3}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="cover_image">Cover Image URL</Label>
                            <Input
                                id="cover_image"
                                value={formData.cover_image}
                                onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                placeholder="e.g., AI Tools, Technology, Tutorials"
                            />
                        </div>

                    </CardContent>
                </Card>

                {/* SEO Section */}
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="border-b pb-3 mb-4">
                            <h3 className="text-lg font-semibold">SEO Optimization</h3>
                            <p className="text-sm text-muted-foreground">Optimize for search engines to rank better</p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="meta_title">Meta Title (SEO Title)</Label>
                            <Input
                                id="meta_title"
                                value={formData.meta_title}
                                onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                                placeholder="Title for Google search results (50-60 chars)"
                                maxLength={60}
                            />
                            <p className="text-xs text-muted-foreground">{formData.meta_title.length}/60 characters</p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="meta_description">Meta Description</Label>
                            <Textarea
                                id="meta_description"
                                value={formData.meta_description}
                                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                                placeholder="Description for Google search results (150-160 chars)"
                                rows={3}
                                maxLength={160}
                            />
                            <p className="text-xs text-muted-foreground">{formData.meta_description.length}/160 characters</p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="meta_keywords">Meta Keywords</Label>
                            <Input
                                id="meta_keywords"
                                value={formData.meta_keywords}
                                onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                                placeholder="keyword1, keyword2, keyword3"
                            />
                            <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold">Content</h3>
                            <p className="text-sm text-muted-foreground">Write your blog post content with formatting</p>
                        </div>
                        {/* Template Selection - Right in Editor Area */}
                        <div className="flex items-center gap-3">
                            <Label htmlFor="template" className="text-sm font-medium whitespace-nowrap">Template:</Label>
                            <Select
                                value={formData.template}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}
                            >
                                <SelectTrigger id="template" className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">📄 Default Template</SelectItem>
                                    <SelectItem value="modern">✨ Modern Template</SelectItem>
                                    <SelectItem value="minimal">🎨 Minimal Template</SelectItem>
                                    <SelectItem value="magazine">📰 Magazine Template</SelectItem>
                                    <SelectItem value="story">📖 Story Template</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <MarkdownEditor
                        value={formData.content}
                        onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                    />
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="font-medium">💡 Tip:</span> Choose a template above to change how your blog post will look when published
                    </p>
                </div>
            </div>
        </form>
    );
}
