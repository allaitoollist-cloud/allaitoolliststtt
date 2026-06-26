'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Loader2, Sparkles, MoreHorizontal, Pencil, Trash2, Eye, FileText, Globe, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { getBrowserClient } from '@/lib/supabase-browser';
import { useToast } from '@/components/ui/use-toast';

const CATEGORIES = ['AI Tools', 'Technology', 'Tutorials', 'Reviews', 'News', 'Productivity', 'Marketing', 'Design'];

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // AI Generator state
    const [keywords, setKeywords] = useState('');
    const [genCategory, setGenCategory] = useState('AI Tools');
    const [generating, setGenerating] = useState(false);
    const [autoPublish, setAutoPublish] = useState(false);

    const supabase = getBrowserClient();
    const { toast } = useToast();

    const load = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setBlogs(data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const filtered = useMemo(() => {
        return blogs.filter(b => {
            const matchStatus =
                statusFilter === 'all' ? true :
                statusFilter === 'published' ? (b.is_published || b.status === 'published') :
                !(b.is_published || b.status === 'published');
            const q = search.toLowerCase();
            const matchSearch = !q || b.title?.toLowerCase().includes(q) || b.slug?.toLowerCase().includes(q) || b.category?.toLowerCase().includes(q);
            return matchStatus && matchSearch;
        });
    }, [blogs, search, statusFilter]);

    const stats = useMemo(() => ({
        total: blogs.length,
        published: blogs.filter(b => b.is_published || b.status === 'published').length,
        drafts: blogs.filter(b => !(b.is_published || b.status === 'published')).length,
    }), [blogs]);

    const isPublished = (b: any) => b.is_published || b.status === 'published';

    const handleTogglePublish = async (blog: any) => {
        const newVal = !isPublished(blog);
        const { error } = await supabase
            .from('blogs')
            .update({
                is_published: newVal,
                status: newVal ? 'published' : 'draft',
                published_at: newVal ? new Date().toISOString() : null,
            })
            .eq('id', blog.id);

        if (error) {
            toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
        } else {
            setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, is_published: newVal, status: newVal ? 'published' : 'draft' } : b));
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if (error) {
            toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
        } else {
            toast({ title: 'Deleted', description: `"${title}" deleted.` });
            setBlogs(prev => prev.filter(b => b.id !== id));
        }
    };

    const handleGenerate = async () => {
        if (!keywords.trim()) {
            toast({ title: 'Keywords required', description: 'Enter keywords to generate a blog post.', variant: 'destructive' });
            return;
        }

        setGenerating(true);
        try {
            const res = await fetch('/api/generate-blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keywords: keywords.trim(), category: genCategory }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || 'Generation failed');

            const blog = data.blog;
            const publish = autoPublish;

            // Save to DB
            const { data: saved, error } = await supabase.from('blogs').insert([{
                title: blog.title,
                slug: blog.slug + '-' + Date.now(),
                content: blog.content,
                excerpt: blog.excerpt,
                meta_title: blog.meta_title,
                meta_description: blog.meta_description,
                meta_keywords: blog.meta_keywords,
                category: genCategory,
                is_published: publish,
                status: publish ? 'published' : 'draft',
                published_at: publish ? new Date().toISOString() : null,
                author: 'All AI Tool List',
                template: 'default',
                created_at: new Date().toISOString(),
            }]).select().single();

            if (error) throw new Error(error.message);

            toast({
                title: 'Blog Generated!',
                description: `"${blog.title}" ${publish ? 'published' : 'saved as draft'}.`,
            });

            setKeywords('');
            load();

        } catch (err: any) {
            toast({ title: 'Error', description: err.message, variant: 'destructive' });
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Manage Blogs</h1>
                    <p className="text-muted-foreground text-sm">Create and manage your blog posts.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild size="sm" variant="outline">
                        <Link href="/admin/blogs/auto-generate">
                            <Sparkles className="mr-2 h-4 w-4 text-primary" />Auto Generate
                        </Link>
                    </Button>
                    <Button asChild size="sm">
                        <Link href="/admin/blogs/create"><Plus className="mr-2 h-4 w-4" />New Post</Link>
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-sm">
                {[
                    { label: 'Total', value: stats.total, icon: BookOpen, color: 'bg-blue-500/10 text-blue-500', key: 'all' },
                    { label: 'Published', value: stats.published, icon: Globe, color: 'bg-green-500/10 text-green-500', key: 'published' },
                    { label: 'Drafts', value: stats.drafts, icon: FileText, color: 'bg-yellow-500/10 text-yellow-500', key: 'draft' },
                ].map(({ label, value, icon: Icon, color, key }) => (
                    <Card key={key} onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
                        className={`bg-card/50 border-white/10 cursor-pointer transition-all hover:border-white/30 ${statusFilter === key ? 'ring-2 ring-primary' : ''}`}>
                        <CardContent className="pt-4 pb-3">
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-lg ${color}`}><Icon className="h-4 w-4" /></div>
                                <div>
                                    <p className="text-2xl font-bold">{value}</p>
                                    <p className="text-xs text-muted-foreground">{label}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* AI Generator Panel */}
            <Card className="border-primary/30 bg-primary/5">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI Blog Generator
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Enter keywords — AI writes a full SEO blog post and saves it instantly.</p>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            placeholder="e.g. best AI writing tools 2026, ChatGPT alternatives..."
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !generating) handleGenerate(); }}
                            disabled={generating}
                            className="flex-1 bg-background"
                        />
                        <Select value={genCategory} onValueChange={setGenCategory}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2 text-sm">
                            <Switch checked={autoPublish} onCheckedChange={setAutoPublish} id="auto-publish" />
                            <label htmlFor="auto-publish" className="cursor-pointer text-muted-foreground">
                                Auto-publish <span className="text-foreground font-medium">(saves as {autoPublish ? 'Published' : 'Draft'})</span>
                            </label>
                        </div>
                        <Button onClick={handleGenerate} disabled={generating || !keywords.trim()} className="gap-2">
                            {generating ? <><Loader2 className="h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="h-4 w-4" />Generate & Save</>}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Search + Filter */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[180px] max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search posts..." className="pl-9 bg-card/50" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="flex gap-2">
                    {[['all', 'All'], ['published', 'Published'], ['draft', 'Drafts']].map(([val, label]) => (
                        <Button key={val} size="sm" variant={statusFilter === val ? 'default' : 'outline'}
                            onClick={() => setStatusFilter(val)} className="text-xs">
                            {label}
                        </Button>
                    ))}
                </div>
                {search && <Button size="sm" variant="ghost" onClick={() => setSearch('')}>Clear</Button>}
            </div>

            {/* Table */}
            <div className="rounded-md border border-white/10 bg-card/50 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead>Title</TableHead>
                            <TableHead className="hidden sm:table-cell">Category</TableHead>
                            <TableHead>Published</TableHead>
                            <TableHead className="hidden md:table-cell">Views</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : filtered.length > 0 ? (
                            filtered.map((blog) => (
                                <TableRow key={blog.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell>
                                        <div className="font-medium line-clamp-1">{blog.title}</div>
                                        <div className="text-xs text-muted-foreground">/{blog.slug}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge variant="outline" className="text-xs">{blog.category || 'Uncategorized'}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={isPublished(blog)}
                                            onCheckedChange={() => handleTogglePublish(blog)}
                                            title={isPublished(blog) ? 'Click to unpublish' : 'Click to publish'}
                                        />
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                                        <div className="flex items-center gap-1"><Eye className="h-3 w-3" />{blog.views || 0}</div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                                        {new Date(blog.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <Link href={`/blog/${blog.slug}`} target="_blank">
                                                    <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Live</DropdownMenuItem>
                                                </Link>
                                                <Link href={`/admin/blogs/edit/${blog.id}`}>
                                                    <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600"
                                                    onClick={() => handleDelete(blog.id, blog.title)}>
                                                    <Trash2 className="mr-2 h-4 w-4" />Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    {search || statusFilter !== 'all' ? 'No matching posts' : 'No blog posts yet'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <p className="text-sm text-muted-foreground">Showing {filtered.length} of {blogs.length} posts</p>
        </div>
    );
}
