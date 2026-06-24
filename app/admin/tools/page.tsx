'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Plus, Upload, Package, Star, TrendingUp, ShieldCheck, FileX, Eye, Loader2, ChevronDown, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ToolRow } from '@/components/admin/ToolRow';
import { useToast } from '@/components/ui/use-toast';

const FILTERS = ['all', 'published', 'featured', 'trending', 'verified', 'drafts'];

export default function AdminToolsPage() {
    const [tools, setTools] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkLoading, setBulkLoading] = useState(false);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const { toast } = useToast();

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/data?table=tools');
            const json = await res.json();
            if (json.data) setTools(json.data);
        } catch { /* network error */ }
        setLoading(false);
        setSelectedIds(new Set());
    };

    useEffect(() => { load(); }, []);

    const isPublished = (t: any) => t.status === 'published' || (!t.status && !t.is_draft);

    const stats = useMemo(() => ({
        total: tools.length,
        published: tools.filter(isPublished).length,
        featured: tools.filter(t => t.featured).length,
        trending: tools.filter(t => t.trending).length,
        verified: tools.filter(t => t.verified).length,
        drafts: tools.filter(t => !isPublished(t)).length,
    }), [tools]);

    const filtered = useMemo(() => {
        return tools.filter(t => {
            const q = search.toLowerCase();
            const matchSearch = !q || t.name?.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q) || t.url?.toLowerCase().includes(q) || t.short_description?.toLowerCase().includes(q);
            const matchFilter =
                filter === 'all' ? true :
                filter === 'published' ? isPublished(t) :
                filter === 'featured' ? t.featured :
                filter === 'trending' ? t.trending :
                filter === 'verified' ? t.verified :
                filter === 'drafts' ? !isPublished(t) : true;
            return matchSearch && matchFilter;
        });
    }, [tools, search, filter]);

    const allFilteredSelected = filtered.length > 0 && filtered.every(t => selectedIds.has(t.id));
    const someSelected = selectedIds.size > 0;

    const toggleSelectAll = () => {
        if (allFilteredSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filtered.map(t => t.id)));
        }
    };

    const toggleSelect = (id: string, checked: boolean) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            checked ? next.add(id) : next.delete(id);
            return next;
        });
    };

    const bulkUpdate = async (field: string, value: boolean | string) => {
        setBulkLoading(true);
        const ids = Array.from(selectedIds);
        const res = await fetch('/api/tools', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'bulk-update', toolIds: ids, field, value }),
        });
        if (res.ok) {
            toast({ title: 'Updated', description: `${ids.length} tool(s) updated.` });
            await load();
        } else {
            toast({ title: 'Error', description: 'Failed to update tools', variant: 'destructive' });
        }
        setBulkLoading(false);
    };

    const bulkDelete = async () => {
        setBulkLoading(true);
        const ids = Array.from(selectedIds);
        const res = await fetch('/api/tools', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'bulk-delete', toolIds: ids }),
        });
        if (res.ok) {
            toast({ title: 'Deleted', description: `${ids.length} tool(s) deleted.` });
            await load();
        } else {
            toast({ title: 'Error', description: 'Failed to delete tools', variant: 'destructive' });
        }
        setBulkLoading(false);
        setBulkDeleteOpen(false);
    };

    const statCards = [
        { label: 'Total', value: stats.total, icon: Package, color: 'blue', key: 'all' },
        { label: 'Published', value: stats.published, icon: Eye, color: 'green', key: 'published' },
        { label: 'Featured', value: stats.featured, icon: Star, color: 'purple', key: 'featured' },
        { label: 'Trending', value: stats.trending, icon: TrendingUp, color: 'orange', key: 'trending' },
        { label: 'Verified', value: stats.verified, icon: ShieldCheck, color: 'emerald', key: 'verified' },
        { label: 'Drafts', value: stats.drafts, icon: FileX, color: 'yellow', key: 'drafts' },
    ];

    const colorMap: Record<string, string> = {
        blue: 'bg-blue-500/10 text-blue-500', green: 'bg-green-500/10 text-green-500',
        purple: 'bg-purple-500/10 text-purple-500', orange: 'bg-orange-500/10 text-orange-500',
        emerald: 'bg-emerald-500/10 text-emerald-500', yellow: 'bg-yellow-500/10 text-yellow-500',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Manage Tools</h1>
                    <p className="text-muted-foreground text-sm">View and manage all AI tools in your directory.</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/tools/import"><Upload className="mr-2 h-4 w-4" />Import CSV</Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link href="/admin/tools/add"><Plus className="mr-2 h-4 w-4" />Add Tool</Link>
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {statCards.map(({ label, value, icon: Icon, color, key }) => (
                    <Card key={key} onClick={() => setFilter(key)}
                        className={`bg-card/50 border-white/10 cursor-pointer transition-all hover:border-white/30 ${filter === key ? 'ring-2 ring-primary' : ''}`}>
                        <CardContent className="pt-3 pb-2 px-3">
                            <div className="flex items-center gap-1.5">
                                <div className={`p-1.5 rounded-lg ${colorMap[color]}`}><Icon className="h-3 w-3" /></div>
                                <div>
                                    <p className="text-lg font-bold leading-none">{value}</p>
                                    <p className="text-[10px] text-muted-foreground">{label}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search + Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[180px] max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search tools..." className="pl-9 bg-card/50" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {FILTERS.map(f => (
                        <Button key={f} size="sm" variant={filter === f ? 'default' : 'outline'}
                            onClick={() => setFilter(f)} className="capitalize text-xs px-2.5">
                            {f}
                        </Button>
                    ))}
                </div>
                {search && <Button size="sm" variant="ghost" onClick={() => setSearch('')}>Clear</Button>}
            </div>

            {/* Bulk Action Bar */}
            {someSelected && (
                <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 border border-primary/20 rounded-lg flex-wrap">
                    <span className="text-sm font-medium text-primary">{selectedIds.size} selected</span>
                    <div className="flex gap-2 flex-wrap">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline" disabled={bulkLoading}>
                                    Bulk Action <ChevronDown className="ml-1 h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => bulkUpdate('featured', true)}>
                                    <Star className="mr-2 h-4 w-4 text-purple-500" /> Mark as Featured
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => bulkUpdate('featured', false)}>
                                    <Star className="mr-2 h-4 w-4" /> Remove Featured
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => bulkUpdate('trending', true)}>
                                    <TrendingUp className="mr-2 h-4 w-4 text-orange-500" /> Mark as Trending
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => bulkUpdate('trending', false)}>
                                    <TrendingUp className="mr-2 h-4 w-4" /> Remove Trending
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => bulkUpdate('verified', true)}>
                                    <ShieldCheck className="mr-2 h-4 w-4 text-green-500" /> Mark as Verified
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => bulkUpdate('verified', false)}>
                                    <ShieldCheck className="mr-2 h-4 w-4" /> Remove Verified
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => bulkUpdate('status', 'published')}>
                                    <Eye className="mr-2 h-4 w-4 text-blue-500" /> Publish All
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => bulkUpdate('status', 'draft')}>
                                    <FileX className="mr-2 h-4 w-4 text-yellow-500" /> Move to Draft
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button size="sm" variant="destructive" onClick={() => setBulkDeleteOpen(true)} disabled={bulkLoading}>
                            <Trash2 className="mr-1.5 h-3 w-3" /> Delete ({selectedIds.size})
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
                            Deselect All
                        </Button>
                    </div>
                    {bulkLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                </div>
            )}

            {/* Table */}
            <div className="rounded-md border border-white/10 bg-card/50 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="w-10">
                                <Checkbox
                                    checked={allFilteredSelected}
                                    onCheckedChange={toggleSelectAll}
                                    aria-label="Select all"
                                />
                            </TableHead>
                            <TableHead>Tool Name</TableHead>
                            <TableHead className="hidden sm:table-cell">Category</TableHead>
                            <TableHead className="hidden md:table-cell">Pricing</TableHead>
                            <TableHead className="hidden lg:table-cell">Views</TableHead>
                            <TableHead className="hidden md:table-cell">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : filtered.length > 0 ? (
                            filtered.map((tool) => (
                                <ToolRow
                                    key={tool.id}
                                    tool={tool}
                                    selected={selectedIds.has(tool.id)}
                                    onSelect={toggleSelect}
                                    onRefresh={load}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                    {search ? `No tools matching "${search}"` : 'No tools found'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <p className="text-sm text-muted-foreground">Showing {filtered.length} of {tools.length} tools</p>

            {/* Bulk Delete Confirm */}
            <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {selectedIds.size} tools?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete {selectedIds.size} selected tool{selectedIds.size > 1 ? 's' : ''}. This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={bulkDelete} disabled={bulkLoading} className="bg-red-600 hover:bg-red-700">
                            {bulkLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Delete ${selectedIds.size} Tools`}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
