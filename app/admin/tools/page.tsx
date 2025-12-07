import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, Upload, Package, Star, TrendingUp, ShieldCheck, FileX, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ToolRow } from '@/components/admin/ToolRow';

export const dynamic = 'force-dynamic';

export default async function AdminToolsPage() {
    const { data: tools, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching tools:', error);
    }

    // Calculate stats
    const stats = {
        total: tools?.length || 0,
        published: tools?.filter(t => !t.is_draft).length || 0,
        featured: tools?.filter(t => t.featured).length || 0,
        trending: tools?.filter(t => t.trending).length || 0,
        verified: tools?.filter(t => t.verified).length || 0,
        drafts: tools?.filter(t => t.is_draft).length || 0,
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Manage Tools</h1>
                    <p className="text-muted-foreground">View and manage all AI tools in your directory.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/admin/tools/import">
                            <Upload className="mr-2 h-4 w-4" />
                            Import CSV
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/admin/tools/add">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Tool
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="bg-card/50 border-white/10">
                    <CardContent className="pt-4 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <Package className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.total}</p>
                                <p className="text-xs text-muted-foreground">Total Tools</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-white/10">
                    <CardContent className="pt-4 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <Eye className="h-4 w-4 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.published}</p>
                                <p className="text-xs text-muted-foreground">Published</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-white/10">
                    <CardContent className="pt-4 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-purple-500/10">
                                <Star className="h-4 w-4 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.featured}</p>
                                <p className="text-xs text-muted-foreground">Featured</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-white/10">
                    <CardContent className="pt-4 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-orange-500/10">
                                <TrendingUp className="h-4 w-4 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.trending}</p>
                                <p className="text-xs text-muted-foreground">Trending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-white/10">
                    <CardContent className="pt-4 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.verified}</p>
                                <p className="text-xs text-muted-foreground">Verified</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-white/10">
                    <CardContent className="pt-4 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-yellow-500/10">
                                <FileX className="h-4 w-4 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.drafts}</p>
                                <p className="text-xs text-muted-foreground">Drafts</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tools..."
                        className="pl-9 bg-card/50"
                    />
                </div>
            </div>

            {/* Tools Table */}
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
                        {tools && tools.length > 0 ? (
                            tools.map((tool) => (
                                <ToolRow key={tool.id} tool={tool} />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    {error ? 'Error loading tools' : 'No tools found'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
