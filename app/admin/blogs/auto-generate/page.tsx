'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserClient } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, Loader2, ArrowLeft, Search, CheckCircle2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Tool {
    id: string;
    name: string;
    slug: string;
    category: string;
    short_description?: string;
    url?: string;
    pricing?: string;
    hasBlog?: boolean;
}

interface GeneratingState {
    [toolId: string]: 'idle' | 'generating' | 'done' | 'error';
}

export default function AutoGenerateBlogsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const supabase = getBrowserClient();

    const [tools, setTools] = useState<Tool[]>([]);
    const [blogs, setBlogs] = useState<Set<string>>(new Set());
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [genState, setGenState] = useState<GeneratingState>({});
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [bulkGenerating, setBulkGenerating] = useState(false);

    const getToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || '';
    };

    const load = useCallback(async () => {
        setLoading(true);
        const [{ data: toolsData }, { data: blogsData }] = await Promise.all([
            supabase.from('tools').select('id, name, slug, category, short_description, url, pricing')
                .eq('status', 'approved').order('name', { ascending: true }),
            supabase.from('blogs').select('title'),
        ]);
        const toolsList: Tool[] = toolsData || [];
        const blogTitles = new Set<string>(
            (blogsData || []).map((b: any) => b.title?.toLowerCase())
        );
        setBlogs(blogTitles);
        setTools(toolsList.map(t => ({
            ...t,
            hasBlog: blogTitles.has(t.name?.toLowerCase()),
        })));
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const generateForTool = async (tool: Tool): Promise<boolean> => {
        setGenState(s => ({ ...s, [tool.id]: 'generating' }));
        try {
            const token = await getToken();
            const genRes = await fetch('/api/generate-blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
                body: JSON.stringify({
                    toolName: tool.name,
                    toolDescription: tool.short_description || '',
                    toolWebsite: tool.url || '',
                    toolCategory: tool.category || 'AI Tools',
                }),
            });
            const genData = await genRes.json();
            if (!genRes.ok || !genData.success) throw new Error(genData.error || 'Generation failed');

            const saveRes = await fetch('/api/save-blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
                body: JSON.stringify({ blog: { ...genData.blog, is_published: false, related_tool_slug: tool.slug } }),
            });
            const saveData = await saveRes.json();
            if (!saveRes.ok) throw new Error(saveData.error || 'Save failed');

            setGenState(s => ({ ...s, [tool.id]: 'done' }));
            setTools(prev => prev.map(t => t.id === tool.id ? { ...t, hasBlog: true } : t));
            return true;
        } catch (err: any) {
            setGenState(s => ({ ...s, [tool.id]: 'error' }));
            toast({ title: `Failed: ${tool.name}`, description: err.message, variant: 'destructive' });
            return false;
        }
    };

    const handleGenerate = async (tool: Tool) => {
        const ok = await generateForTool(tool);
        if (ok) toast({ title: 'Blog created!', description: `"${tool.name}" blog saved as draft.` });
    };

    const toggleSelect = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const selectAll = () => {
        const withoutBlog = filtered.filter(t => !t.hasBlog).map(t => t.id);
        setSelected(new Set(withoutBlog));
    };

    const handleBulkGenerate = async () => {
        if (selected.size === 0) return;
        setBulkGenerating(true);
        const toolsToGenerate = tools.filter(t => selected.has(t.id));
        let success = 0;
        for (const tool of toolsToGenerate) {
            const ok = await generateForTool(tool);
            if (ok) success++;
            await new Promise(r => setTimeout(r, 1500)); // rate limiting
        }
        setBulkGenerating(false);
        setSelected(new Set());
        toast({ title: `Bulk done!`, description: `${success}/${toolsToGenerate.length} blogs generated.` });
    };

    const filtered = tools.filter(t =>
        !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.category?.toLowerCase().includes(search.toLowerCase())
    );

    const withoutBlog = filtered.filter(t => !t.hasBlog);
    const withBlog = filtered.filter(t => t.hasBlog);

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/blogs">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        Auto Generate Blogs from AI Tools
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Pick any tool from your database → AI writes a full review blog
                    </p>
                </div>
            </div>

            {/* Stats bar */}
            <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-primary/10 text-primary border-0 text-sm px-3 py-1">
                    {tools.length} Total Tools
                </Badge>
                <Badge className="bg-green-500/10 text-green-500 border-0 text-sm px-3 py-1">
                    {tools.filter(t => t.hasBlog).length} Have Blog
                </Badge>
                <Badge className="bg-orange-500/10 text-orange-500 border-0 text-sm px-3 py-1">
                    {tools.filter(t => !t.hasBlog).length} Need Blog
                </Badge>
            </div>

            {/* Search + bulk actions */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search tools..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                </div>
                <Button variant="outline" onClick={selectAll} disabled={withoutBlog.length === 0 || bulkGenerating}>
                    Select All ({withoutBlog.length})
                </Button>
                {selected.size > 0 && (
                    <Button onClick={handleBulkGenerate} disabled={bulkGenerating} className="gap-2">
                        {bulkGenerating
                            ? <><Loader2 className="h-4 w-4 animate-spin" />Generating...</>
                            : <><Sparkles className="h-4 w-4" />Generate {selected.size} Blogs</>
                        }
                    </Button>
                )}
                <Link href="/admin/blogs"><Button variant="outline">View All Blogs</Button></Link>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Tools without blog */}
                    {withoutBlog.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Needs Blog ({withoutBlog.length})
                            </h2>
                            <div className="grid gap-3">
                                {withoutBlog.map(tool => (
                                    <ToolRow
                                        key={tool.id}
                                        tool={tool}
                                        state={genState[tool.id] || 'idle'}
                                        selected={selected.has(tool.id)}
                                        onSelect={() => toggleSelect(tool.id)}
                                        onGenerate={() => handleGenerate(tool)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tools with blog */}
                    {withBlog.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Already Has Blog ({withBlog.length})
                            </h2>
                            <div className="grid gap-3">
                                {withBlog.map(tool => (
                                    <ToolRow
                                        key={tool.id}
                                        tool={tool}
                                        state={genState[tool.id] || 'done'}
                                        selected={false}
                                        onSelect={() => {}}
                                        onGenerate={() => handleGenerate(tool)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-muted-foreground">
                            No tools found for &ldquo;{search}&rdquo;
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function ToolRow({
    tool, state, selected, onSelect, onGenerate,
}: {
    tool: Tool;
    state: 'idle' | 'generating' | 'done' | 'error';
    selected: boolean;
    onSelect: () => void;
    onGenerate: () => void;
}) {
    const isGenerating = state === 'generating';
    const isDone = state === 'done' || tool.hasBlog;

    return (
        <Card className={`border transition-colors ${selected ? 'border-primary/50 bg-primary/5' : 'border-white/10'}`}>
            <CardContent className="p-4 flex items-center gap-4">
                {/* Checkbox */}
                {!isDone && (
                    <button
                        onClick={onSelect}
                        className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
                            selected ? 'bg-primary border-primary' : 'border-white/30 hover:border-primary'
                        }`}
                    >
                        {selected && <span className="text-white text-xs">✓</span>}
                    </button>
                )}
                {isDone && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />}

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">{tool.name}</p>
                        {tool.category && (
                            <Badge variant="secondary" className="text-xs">{tool.category}</Badge>
                        )}
                        {tool.pricing && (
                            <span className="text-xs text-muted-foreground">{tool.pricing}</span>
                        )}
                    </div>
                    {tool.short_description && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{tool.short_description}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    {tool.url && (
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                        </a>
                    )}
                    <Button
                        size="sm"
                        variant={isDone ? 'outline' : 'default'}
                        onClick={onGenerate}
                        disabled={isGenerating}
                        className="gap-1.5 h-8 text-xs"
                    >
                        {isGenerating ? (
                            <><Loader2 className="h-3 w-3 animate-spin" />Generating...</>
                        ) : isDone ? (
                            <><Sparkles className="h-3 w-3" />Regenerate</>
                        ) : (
                            <><Sparkles className="h-3 w-3" />Generate Blog</>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
