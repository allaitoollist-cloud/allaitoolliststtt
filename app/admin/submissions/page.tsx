'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Loader2 } from 'lucide-react';
import { SubmissionRow } from '@/components/admin/SubmissionRow';

const STATUSES = ['all', 'pending', 'approved', 'rejected', 'flagged'];

export default function AdminSubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/data?table=tool_submissions');
            const json = await res.json();
            if (json.data) setSubmissions(json.data);
        } catch { /* network error */ }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const filtered = useMemo(() => {
        return submissions.filter(s => {
            const matchStatus = statusFilter === 'all' || s.status === statusFilter;
            const q = search.toLowerCase();
            const matchSearch = !q ||
                s.tool_name?.toLowerCase().includes(q) ||
                s.submitter_email?.toLowerCase().includes(q) ||
                s.tool_url?.toLowerCase().includes(q) ||
                s.category?.toLowerCase().includes(q);
            return matchStatus && matchSearch;
        });
    }, [submissions, search, statusFilter]);

    const pendingCount = submissions.filter(s => s.status === 'pending').length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Tool Submissions</h1>
                <p className="text-muted-foreground">Review and manage tool submissions.</p>
                {pendingCount > 0 && (
                    <p className="text-sm text-yellow-500 mt-1">⚠️ {pendingCount} pending submission{pendingCount > 1 ? 's' : ''}</p>
                )}
            </div>

            {/* Search + Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email, URL..."
                        className="pl-9 bg-card/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {STATUSES.map(s => (
                        <Button
                            key={s}
                            size="sm"
                            variant={statusFilter === s ? 'default' : 'outline'}
                            onClick={() => setStatusFilter(s)}
                            className="capitalize"
                        >
                            {s}
                            {s !== 'all' && (
                                <Badge className="ml-1.5 bg-white/10 text-xs" variant="secondary">
                                    {submissions.filter(sub => sub.status === s).length}
                                </Badge>
                            )}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="rounded-md border border-white/10 bg-card/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead>Tool Name</TableHead>
                            <TableHead className="hidden md:table-cell">Category</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead className="hidden lg:table-cell">Submitted By</TableHead>
                            <TableHead className="hidden sm:table-cell">Date</TableHead>
                            <TableHead>Status</TableHead>
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
                            filtered.map((submission) => (
                                <SubmissionRow key={submission.id} submission={submission} onRefresh={load} />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                    {search || statusFilter !== 'all' ? 'No matching submissions' : 'No submissions found'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <p className="text-sm text-muted-foreground">Showing {filtered.length} of {submissions.length} submissions</p>
        </div>
    );
}
