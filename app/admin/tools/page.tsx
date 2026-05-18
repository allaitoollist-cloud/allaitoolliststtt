'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Upload, Package, Star, TrendingUp, ShieldCheck, FileX, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ToolRow } from '@/components/admin/ToolRow';
import { DeleteDummyToolsButton } from '@/components/admin/DeleteDummyToolsButton';
import { getBrowserClient } from '@/lib/supabase-browser';

const FILTERS = ['all', 'published', 'featured', 'trending', 'verified', 'drafts'];

export default function AdminToolsPage() {
    const [tools, setTools] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const supabase = getBrowserClient();

    const load = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('tools')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setTools(data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const stats = useMemo(() => ({
        total: tools.length,
        published: tools.filter(t => !t.is_draft).length,
        featured: tools.filter(t => t.featured).length,
        trending: tools.filter(t => t.trending).length,
        verified: tools.filter(t => t.verified).length,
        drafts: tools.filter(t => t.is_draft).length,
    }), [tools]);

    const filtered = useMemo(() => {
        return tools.filter(t => {
            const q = search.toLowerCase();
            const matchSearch = !q ||
                t.name?.toLowerCase().includes(q) ||
                t.category?.toLowerCase().includes(q) ||
                t.url?.toLowerCase().includes(q) ||
                t.short_description?.toLowerCase().includes(q);
            const matchFilter =
                filter === 'all' ? true :
                filter === 'published' ? !t.is_draft :
                filter === 'featured' ? t.featured :
                filter === 'trending' ? t.trending :
                filter === 'verified' ? t.verified :
                filter === 'drafts' ? t.is_draft : true;
            return matchSearch && matchFilter;
        });
    }, [tools, search, filter]);

    const statCards = [
        { label: 'Total', value: stats.total, icon: Package, color: 'blue', key: 'all' },
        { label: 'Published', value: stats.published, icon: Eye, color: 'green', key: 'published' },
        { label: 'Featured', value: stats.featured, icon: Star, color: 'purple', key: 'featured' },
        { label: 'Trending', value: stats.trending, icon: TrendingUp, color: 'orange', key: 'trending' },
        { label: 'Verified', value: stats.verified, icon: ShieldCheck, color: 'emerald', key: 'verified' },
        { label: 'Drafts', value: stats.drafts, icon: FileX, color: 'yellow', key: 'drafts' },
    ];

    const colorMap: Record<string, string> = {
        blue: 'bg-blue-500/10 text-blue-500',
        green: 'bg-green-500/10 text-green-500',
        purple: 'bg-purple-500/10 text-purple-500',
        orange: 'bg-orange-500/10 text-orange-500',
        emerald: 'bg-emerald-500/10 text-emerald-500',
        yellow: 'bg-yellow-500/10 text-yellow-500',
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Manage Tools</h1>
                    <p className="text-muted-foreground">View and manage all AI tools in your directory.</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <DeleteDummyToolsButton />
                    <Button variant="outline" asChild>
                        <Link href="/admin/tools/import">
                            <Upload className="mr-2 h-4 w-4" /> Import CSV
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/admin/tools/add">
                            <Plus className="mr-2 h-4 w-4" /> Add New Tool
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards — clickable filters */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statCards.map(({ label, value, icon: Icon, color, key }) => (
                    <Card
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`bg-card/50 border-white/10 cursor-pointer transition-all hover:border-white/30 ${filter === key ? 'ring-2 ring-primary' : ''}`}
                    >
                        <CardContent className="pt-4 pb-3">
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-lg ${colorMap[color]}`}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{value}</p>
                                    <p className="text-xs text-muted-foreground">{label}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search + filter */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, category, URL..."
                        className="pl-9 bg-card/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {FILTERS.map(f => (
                        <Button
                            key={f}
                            size="sm"
                            variant={filter === f ? 'default' : 'outline'}
                            onClick={() => setFilter(f)}
                            className="capitalize"
                        >
                            {f}
                        </Button>
                    ))}
                </div>
                {search && (
                    <Button size="sm" variant="ghost" onClick={() => setSearch('')}>
                        Clear
                    </Button>
                )}
            </div>

            {/* Table */}
            <div className="rounded-md border border-white/10 bg-card/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead>Tool Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Pricing</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead>Status</TableHead>
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
                            filtered.map((tool) => (
                                <ToolRow key={tool.id} tool={tool} />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    {search ? `No tools matching "${search}"` : 'No tools found'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <p className="text-sm text-muted-foreground">
                Showing {filtered.length} of {tools.length} tools
            </p>
        </div>
    );
}
