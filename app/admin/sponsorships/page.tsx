'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Check, X, Mail, Search, Loader2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getBrowserClient } from '@/lib/supabase-browser';
import { useToast } from '@/components/ui/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const FILTERS = ['all', 'pending', 'approved', 'rejected'];

export default function SponsorshipsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'reject'; req: any } | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const supabase = getBrowserClient();
    const { toast } = useToast();

    const load = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('sponsorship_requests')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setRequests(data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const filtered = useMemo(() => {
        return requests.filter(r => {
            const matchStatus = statusFilter === 'all' || r.status === statusFilter;
            const q = search.toLowerCase();
            const matchSearch = !q ||
                r.tool_name?.toLowerCase().includes(q) ||
                r.user_email?.toLowerCase().includes(q);
            return matchStatus && matchSearch;
        });
    }, [requests, search, statusFilter]);

    const stats = useMemo(() => ({
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
    }), [requests]);

    const handleApprove = async (req: any) => {
        setActionLoading(true);
        const { error: reqErr } = await supabase
            .from('sponsorship_requests')
            .update({ status: 'approved' })
            .eq('id', req.id);
        const { error: toolErr } = await supabase
            .from('tools')
            .update({ featured: true, trending: true })
            .eq('slug', req.tool_slug);

        if (reqErr || toolErr) {
            toast({ title: 'Error', description: 'Failed to approve sponsorship', variant: 'destructive' });
        } else {
            toast({ title: 'Approved', description: `${req.tool_name} is now featured & trending.` });
            load();
        }
        setActionLoading(false);
        setConfirmAction(null);
    };

    const handleReject = async (req: any) => {
        setActionLoading(true);
        const { error } = await supabase
            .from('sponsorship_requests')
            .update({ status: 'rejected' })
            .eq('id', req.id);

        if (error) {
            toast({ title: 'Error', description: 'Failed to reject sponsorship', variant: 'destructive' });
        } else {
            toast({ title: 'Rejected', description: `${req.tool_name} sponsorship rejected.` });
            load();
        }
        setActionLoading(false);
        setConfirmAction(null);
    };

    const statusBadge = (status: string) => {
        if (status === 'approved') return <Badge className="bg-green-500/10 text-green-500 border-0">Approved</Badge>;
        if (status === 'rejected') return <Badge className="bg-red-500/10 text-red-500 border-0">Rejected</Badge>;
        return <Badge className="bg-orange-500/10 text-orange-500 border-0">Pending</Badge>;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <DollarSign className="w-8 h-8 text-orange-500" /> Sponsorship Requests
                </h1>
                <p className="text-muted-foreground mt-1">
                    Once payment is received via Payoneer/Crypto, approve to feature the tool.
                </p>
                {stats.pending > 0 && (
                    <p className="text-sm text-orange-400 mt-1">⚠️ {stats.pending} pending request{stats.pending > 1 ? 's' : ''}</p>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg">
                {[
                    { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-orange-500/10 text-orange-500', key: 'pending' },
                    { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'bg-green-500/10 text-green-500', key: 'approved' },
                    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-red-500/10 text-red-500', key: 'rejected' },
                ].map(({ label, value, icon: Icon, color, key }) => (
                    <Card
                        key={key}
                        onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
                        className={`bg-card/50 border-white/10 cursor-pointer transition-all hover:border-white/30 ${statusFilter === key ? 'ring-2 ring-primary' : ''}`}
                    >
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

            {/* Search + Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by tool name or email..."
                        className="pl-9 bg-card/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {FILTERS.map(f => (
                        <Button key={f} size="sm" variant={statusFilter === f ? 'default' : 'outline'}
                            onClick={() => setStatusFilter(f)} className="capitalize">
                            {f}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border border-white/10 bg-card/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead>Tool Name</TableHead>
                            <TableHead>User Email</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
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
                            filtered.map((req) => (
                                <TableRow key={req.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium">{req.tool_name}</TableCell>
                                    <TableCell>
                                        <a href={`mailto:${req.user_email}`} className="flex items-center gap-1 text-primary hover:underline text-sm">
                                            <Mail className="w-3 h-3" /> {req.user_email}
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">{req.plan || 'featured'}</Badge>
                                    </TableCell>
                                    <TableCell>{statusBadge(req.status)}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(req.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {req.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost"
                                                    className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                                    onClick={() => setConfirmAction({ type: 'approve', req })}>
                                                    <Check className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost"
                                                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                    onClick={() => setConfirmAction({ type: 'reject', req })}>
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                        {req.status === 'approved' && (
                                            <span className="text-xs text-green-500 font-medium">✓ Featured</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    {search || statusFilter !== 'all' ? 'No matching requests' : 'No sponsorship requests yet'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <p className="text-sm text-muted-foreground">Showing {filtered.length} of {requests.length} requests</p>

            {/* Confirm Dialog */}
            <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmAction?.type === 'approve' ? 'Approve Sponsorship?' : 'Reject Sponsorship?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmAction?.type === 'approve'
                                ? `This will mark "${confirmAction?.req.tool_name}" as featured & trending. Only do this after confirming payment was received.`
                                : `This will reject the sponsorship request for "${confirmAction?.req.tool_name}".`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={actionLoading}
                            onClick={() => confirmAction?.type === 'approve'
                                ? handleApprove(confirmAction.req)
                                : handleReject(confirmAction!.req)}
                            className={confirmAction?.type === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                        >
                            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmAction?.type === 'approve' ? 'Approve & Feature' : 'Reject'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
