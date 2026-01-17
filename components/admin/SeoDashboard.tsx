'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserClient } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Search, Globe, EyeOff, AlertTriangle, CheckCircle2, ShieldAlert, FileText } from 'lucide-react';

interface SeoItem {
    id: string;
    name: string;
    slug: string;
    status: string; // published, draft, etc
    type: 'tool' | 'use-case' | 'category'; // Normalized type
    seo_noindex?: boolean; // Manual override
    warnings?: string[];
}

interface SeoDashboardProps {
    initialItems: SeoItem[];
}

export default function SeoDashboard({ initialItems }: SeoDashboardProps) {
    const [items, setItems] = useState<SeoItem[]>(initialItems);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const { toast } = useToast();
    const router = useRouter();
    const supabase = getBrowserClient();

    // Derived State
    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.slug.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'all' || item.type === filterType;
        return matchesSearch && matchesType;
    });

    const stats = {
        total: items.length,
        indexed: items.filter(i => i.status === 'published' && !i.seo_noindex && (!i.warnings || i.warnings.length === 0)).length,
        noindex: items.filter(i => i.status !== 'published' || i.seo_noindex).length,
        warnings: items.filter(i => i.warnings && i.warnings.length > 0).length,
    };

    // Actions
    const toggleNoIndex = async (id: string, currentVal: boolean, type: string) => {
        const tableName = type === 'tool' ? 'tools' : (type === 'use-case' ? 'use_cases' : null);

        if (!tableName) {
            toast({ title: "Action not supported for this type", variant: "destructive" });
            return;
        }

        const newVal = !currentVal;

        // Optimistic Update
        setItems(prev => prev.map(item => item.id === id ? { ...item, seo_noindex: newVal } : item));

        const { error } = await supabase
            .from(tableName)
            .update({ seo_noindex: newVal })
            .eq('id', id);

        if (error) {
            // Revert
            setItems(prev => prev.map(item => item.id === id ? { ...item, seo_noindex: currentVal } : item));
            toast({ title: "Update failed", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "SEO Updated", description: `Page set to ${newVal ? 'NOINDEX' : 'INDEX'}` });
            router.refresh();
        }
    };

    return (
        <div className="space-y-8">
            {/* 1. Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Measured Pages</CardTitle>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" /> Indexable (Healthy)
                        </CardTitle>
                        <div className="text-2xl font-bold">{stats.indexed}</div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium text-amber-600 flex items-center gap-2">
                            <EyeOff className="h-4 w-4" /> Noindex / Hidden
                        </CardTitle>
                        <div className="text-2xl font-bold">{stats.noindex}</div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> SEO Warnings
                        </CardTitle>
                        <div className="text-2xl font-bold">{stats.warnings}</div>
                    </CardHeader>
                </Card>
            </div>

            {/* 2. Controls & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setFilterType}>
                    <TabsList>
                        <TabsTrigger value="all">All Pages</TabsTrigger>
                        <TabsTrigger value="tool">Tools</TabsTrigger>
                        <TabsTrigger value="category">Categories</TabsTrigger>
                        <TabsTrigger value="use-case">Use Cases</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search pages..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* 3. Main Data Table */}
            <div className="rounded-md border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Page Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Robots Tag</TableHead>
                            <TableHead>Issues</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredItems.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    No pages found matching criteria.
                                </TableCell>
                            </TableRow>
                        )}
                        {filteredItems.map(item => {
                            const isPublished = item.status === 'published';
                            const isNoIndex = !isPublished || item.seo_noindex || (item.warnings && item.warnings.includes('Empty Content'));

                            return (
                                <TableRow key={`${item.type}-${item.id}`}>
                                    <TableCell>
                                        <div className="font-semibold">{item.name}</div>
                                        <div className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                                            <Globe className="h-3 w-3" /> /{item.type === 'tool' ? 'tool' : item.type}/{item.slug}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">{item.type.replace('-', ' ')}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${isPublished ? 'bg-green-500' : 'bg-gray-300'}`} />
                                            <span className="capitalize text-sm">{item.status.replace('_', ' ')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {isNoIndex ? (
                                            <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
                                                NOINDEX
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                                                INDEX
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {item.warnings && item.warnings.length > 0 ? (
                                            <div className="flex flex-col gap-1">
                                                {item.warnings.map((w, i) => (
                                                    <span key={i} className="text-xs text-amber-600 font-medium flex items-center gap-1">
                                                        <AlertTriangle className="h-3 w-3" /> {w}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {(item.type === 'tool' || item.type === 'use-case') && (
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="text-xs text-muted-foreground mr-2">Force Noindex</span>
                                                <Switch
                                                    checked={!!item.seo_noindex}
                                                    onCheckedChange={() => toggleNoIndex(item.id, !!item.seo_noindex, item.type)}
                                                />
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
