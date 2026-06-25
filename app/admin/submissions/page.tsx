'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Loader2, Download, X, Trash2, Flag } from 'lucide-react';
import { SubmissionRow } from '@/components/admin/SubmissionRow';
import { useToast } from '@/components/ui/use-toast';

const STATUSES = ['all', 'pending', 'paid', 'approved', 'rejected', 'flagged'];

export default function AdminSubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paypalSentMap, setPaypalSentMap] = useState<Record<string, string>>({});
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [bulkLoading, setBulkLoading] = useState(false);
    const { toast } = useToast();

    const load = async () => {
        setLoading(true);
        try {
            const [subsRes, logsRes] = await Promise.all([
                fetch('/api/admin/data?table=tool_submissions'),
                fetch('/api/admin/data?table=activity_logs&limit=500'),
            ]);
            const subsJson = await subsRes.json();
            const logsJson = await logsRes.json();
            if (subsJson.data) setSubmissions(subsJson.data);
            if (logsJson.data) {
                const map: Record<string, string> = {};
                logsJson.data
                    .filter((l: any) => l.action === 'send_paypal_link')
                    .forEach((l: any) => {
                        const key = `${l.details?.tool}::${l.details?.to}`;
                        if (!map[key]) map[key] = l.created_at;
                    });
                setPaypalSentMap(map);
            }
        } catch { /* network error */ }
        setLoading(false);
        setSelected(new Set());
    };

    useEffect(() => { load(); }, []);

    const filtered = useMemo(() => {
        return submissions.filter(s => {
            const matchStatus =
                statusFilter === 'all' ? true :
                statusFilter === 'paid' ? (s.status === 'pending' && s.payment_proof_url) :
                s.status === statusFilter;
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
    const paidPendingCount = submissions.filter(s => s.status === 'pending' && s.payment_proof_url).length;

    const allVisibleSelected = filtered.length > 0 && filtered.every(s => selected.has(s.id));

    const toggleSelectAll = () => {
        if (allVisibleSelected) {
            setSelected(prev => {
                const next = new Set(prev);
                filtered.forEach(s => next.delete(s.id));
                return next;
            });
        } else {
            setSelected(prev => {
                const next = new Set(prev);
                filtered.forEach(s => next.add(s.id));
                return next;
            });
        }
    };

    const toggleOne = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const bulkAction = async (action: string) => {
        const ids = Array.from(selected);
        if (!ids.length) return;
        setBulkLoading(true);
        try {
            const res = await fetch('/api/admin/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, ids }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast({ title: `Done`, description: `${data.affected} submission(s) ${action}ed` });
            load();
        } catch (e: any) {
            toast({ title: 'Error', description: e.message, variant: 'destructive' });
        }
        setBulkLoading(false);
    };

    const exportCSV = () => {
        window.location.href = '/api/admin/export?type=submissions';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-bold">Tool Submissions</h1>
                    <p className="text-muted-foreground">Review and manage tool submissions.</p>
                    {pendingCount > 0 && (
                        <p className="text-sm text-yellow-500 mt-1">
                            ⚠️ {pendingCount} pending submission{pendingCount > 1 ? 's' : ''}
                            {paidPendingCount > 0 && (
                                <span className="text-green-400 ml-1.5 font-medium">
                                    ({paidPendingCount} with payment proof)
                                </span>
                            )}
                        </p>
                    )}
                </div>
                <Button variant="outline" size="sm" onClick={exportCSV} className="shrink-0">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                </Button>
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
                            {s === 'paid' ? 'Paid (Pending Review)' : s}
                            {s !== 'all' && (
                                <Badge className="ml-1.5 bg-white/10 text-xs" variant="secondary">
                                    {s === 'paid'
                                        ? paidPendingCount
                                        : submissions.filter(sub => sub.status === s).length}
                                </Badge>
                            )}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Bulk action bar */}
            {selected.size > 0 && (
                <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2.5 flex-wrap">
                    <span className="text-sm font-medium text-primary">{selected.size} selected</span>
                    <div className="flex gap-2 flex-wrap">
                        <Button size="sm" variant="outline" onClick={() => bulkAction('reject')} disabled={bulkLoading}
                            className="text-red-400 border-red-500/30 hover:bg-red-500/10 h-7">
                            <X className="h-3.5 w-3.5 mr-1" /> Reject All
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => bulkAction('flag')} disabled={bulkLoading}
                            className="text-orange-400 border-orange-500/30 hover:bg-orange-500/10 h-7">
                            <Flag className="h-3.5 w-3.5 mr-1" /> Flag All
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => bulkAction('delete')} disabled={bulkLoading}
                            className="text-red-500 border-red-500/30 hover:bg-red-500/10 h-7">
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete All
                        </Button>
                    </div>
                    {bulkLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    <Button size="sm" variant="ghost" className="ml-auto h-7 text-xs"
                        onClick={() => setSelected(new Set())}>
                        Clear selection
                    </Button>
                </div>
            )}

            <div className="rounded-md border border-white/10 bg-card/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="w-10 pl-4">
                                <Checkbox
                                    checked={allVisibleSelected}
                                    onCheckedChange={toggleSelectAll}
                                    aria-label="Select all"
                                />
                            </TableHead>
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
                                <TableCell colSpan={8} className="text-center py-8">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : filtered.length > 0 ? (
                            filtered.map((submission) => (
                                <SubmissionRow
                                    key={submission.id}
                                    submission={submission}
                                    onRefresh={load}
                                    paypalSentAt={paypalSentMap[`${submission.tool_name}::${submission.submitter_email}`]}
                                    selected={selected.has(submission.id)}
                                    onToggleSelect={() => toggleOne(submission.id)}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
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
