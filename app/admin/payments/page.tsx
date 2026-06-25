'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    DollarSign, CheckCircle, XCircle, Clock, Search, Loader2, RefreshCw,
    ExternalLink, Receipt, Check, X,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getBrowserClient } from '@/lib/supabase-browser';

const FILTERS = ['all', 'pending', 'verified', 'rejected'];

const PLAN_LABELS: Record<string, string> = {
    featured_tool:       'Featured Tool — $49',
    verified_basic:      'Verified Basic — $99',
    verified_pro:        'Verified Pro — $199',
    verified_enterprise: 'Verified Enterprise — $499',
    api_pro:             'API Pro — $29',
    api_enterprise:      'API Enterprise — $199',
    job_basic:           'Job Standard — $99',
    job_featured:        'Job Featured — $199',
};

export default function AdminPaymentsPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [confirmAction, setConfirmAction] = useState<{ type: 'verify' | 'reject'; order: any } | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [txnDialogOpen, setTxnDialogOpen] = useState(false);
    const [txnId, setTxnId] = useState('');
    const [pendingVerifyOrder, setPendingVerifyOrder] = useState<any>(null);
    const { toast } = useToast();
    const supabase = getBrowserClient();

    const load = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('paypal_orders')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setOrders(data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const filtered = useMemo(() => {
        return orders.filter(o => {
            const matchFilter = filter === 'all' || o.status === filter;
            const q = search.toLowerCase();
            const matchSearch = !q ||
                o.email?.toLowerCase().includes(q) ||
                o.price_key?.toLowerCase().includes(q) ||
                o.label?.toLowerCase().includes(q) ||
                o.paypal_txn_id?.toLowerCase().includes(q);
            return matchFilter && matchSearch;
        });
    }, [orders, search, filter]);

    const stats = useMemo(() => {
        const verified = orders.filter(o => o.status === 'verified');
        return {
            pending:  orders.filter(o => o.status === 'pending').length,
            verified: verified.length,
            rejected: orders.filter(o => o.status === 'rejected').length,
            revenue:  verified.reduce((sum, o) => sum + (o.amount || 0), 0),
        };
    }, [orders]);

    const openVerifyDialog = (order: any) => {
        setPendingVerifyOrder(order);
        setTxnId('');
        setTxnDialogOpen(true);
    };

    const handleVerify = async () => {
        if (!pendingVerifyOrder) return;
        setTxnDialogOpen(false);
        setConfirmAction({ type: 'verify', order: { ...pendingVerifyOrder, txnId } });
    };

    const handleConfirm = async () => {
        if (!confirmAction) return;
        setActionLoading(true);
        try {
            const res = await fetch('/api/paypal/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: confirmAction.order.id,
                    txnId: confirmAction.order.txnId || undefined,
                    action: confirmAction.type,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');
            toast({
                title: confirmAction.type === 'verify' ? '✅ Payment Verified!' : '❌ Payment Rejected',
                description: confirmAction.type === 'verify'
                    ? `Order verified. Benefits applied automatically.`
                    : `Order has been rejected.`,
            });
            load();
        } catch (err: any) {
            toast({ title: 'Error', description: err.message, variant: 'destructive' });
        }
        setActionLoading(false);
        setConfirmAction(null);
    };

    const statusBadge = (status: string) => {
        if (status === 'verified') return <Badge className="bg-green-500/10 text-green-500 border-0">Verified</Badge>;
        if (status === 'rejected') return <Badge className="bg-red-500/10 text-red-500 border-0">Rejected</Badge>;
        return <Badge className="bg-orange-500/10 text-orange-500 border-0">Pending</Badge>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Receipt className="h-8 w-8 text-green-500" /> Payments
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        All PayPal orders — verify after confirming payment in your PayPal dashboard.
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Pending',  value: stats.pending,  icon: Clock,       color: 'bg-orange-500/10 text-orange-500', key: 'pending' },
                    { label: 'Verified', value: stats.verified, icon: CheckCircle, color: 'bg-green-500/10 text-green-500',  key: 'verified' },
                    { label: 'Rejected', value: stats.rejected, icon: XCircle,     color: 'bg-red-500/10 text-red-500',      key: 'rejected' },
                    { label: 'Revenue',  value: `$${stats.revenue}`, icon: DollarSign, color: 'bg-blue-500/10 text-blue-500', key: 'all' },
                ].map(({ label, value, icon: Icon, color, key }) => (
                    <Card
                        key={key}
                        onClick={() => setFilter(filter === key ? 'all' : key)}
                        className={`bg-card/50 border-white/10 cursor-pointer transition-all hover:border-white/30 ${filter === key ? 'ring-2 ring-primary' : ''}`}
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

            {/* Pending alert */}
            {stats.pending > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-400 shrink-0" />
                    <p className="text-sm text-orange-300">
                        <strong>{stats.pending} pending order{stats.pending > 1 ? 's' : ''}</strong> — check your PayPal dashboard and verify after confirming payment.
                    </p>
                </div>
            )}

            {/* Search + Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by email, plan, txn ID..."
                        className="pl-9 bg-card/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {FILTERS.map(f => (
                        <Button key={f} size="sm"
                            variant={filter === f ? 'default' : 'outline'}
                            onClick={() => setFilter(f)}
                            className="capitalize">
                            {f}
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
                            <TableHead>Email</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden md:table-cell">TXN ID</TableHead>
                            <TableHead className="hidden sm:table-cell">Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : filtered.length > 0 ? (
                            filtered.map((order) => (
                                <TableRow key={order.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell>
                                        <div className="font-medium text-sm">{order.email || '—'}</div>
                                        {order.metadata?.toolSlug && (
                                            <a
                                                href={`/tool/${order.metadata.toolSlug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                                            >
                                                <ExternalLink className="h-2.5 w-2.5" />
                                                {order.metadata.toolSlug}
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {PLAN_LABELS[order.price_key] || order.label || order.price_key}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-bold text-green-400">${order.amount}</span>
                                    </TableCell>
                                    <TableCell>{statusBadge(order.status)}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <span className="text-xs font-mono text-muted-foreground">
                                            {order.paypal_txn_id || '—'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {order.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm" variant="ghost"
                                                    className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                                    onClick={() => openVerifyDialog(order)}
                                                >
                                                    <Check className="h-4 w-4 mr-1" /> Verify
                                                </Button>
                                                <Button
                                                    size="sm" variant="ghost"
                                                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                    onClick={() => setConfirmAction({ type: 'reject', order })}
                                                >
                                                    <X className="h-4 w-4 mr-1" /> Reject
                                                </Button>
                                            </div>
                                        )}
                                        {order.status === 'verified' && (
                                            <span className="text-xs text-green-500 font-medium">✓ Applied</span>
                                        )}
                                        {order.status === 'rejected' && (
                                            <span className="text-xs text-red-500 font-medium">✗ Rejected</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                                    {search || filter !== 'all' ? 'No matching orders' : 'No PayPal orders yet'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <p className="text-sm text-muted-foreground">
                Showing {filtered.length} of {orders.length} orders · Verified revenue: <strong className="text-green-400">${stats.revenue}</strong>
            </p>

            {/* TXN ID Dialog (before verify confirmation) */}
            <Dialog open={txnDialogOpen} onOpenChange={setTxnDialogOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Enter PayPal Transaction ID</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <p className="text-sm text-muted-foreground">
                            Paste the PayPal Transaction ID from your dashboard (optional but recommended).
                        </p>
                        <div className="space-y-1">
                            <Label htmlFor="txn-id">Transaction ID</Label>
                            <Input
                                id="txn-id"
                                placeholder="e.g. 5O190127TN364715T"
                                value={txnId}
                                onChange={(e) => setTxnId(e.target.value)}
                                className="font-mono text-sm"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setTxnDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleVerify} className="bg-green-600 hover:bg-green-700">
                            <Check className="h-4 w-4 mr-2" /> Proceed to Verify
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Dialog */}
            <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmAction?.type === 'verify' ? '✅ Verify Payment?' : '❌ Reject Payment?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmAction?.type === 'verify'
                                ? `This will mark $${confirmAction?.order.amount} payment from "${confirmAction?.order.email}" as verified and automatically apply the plan benefits. Only do this after confirming payment in your PayPal dashboard.`
                                : `This will reject the payment order from "${confirmAction?.order.email}". No benefits will be applied.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={actionLoading}
                            onClick={handleConfirm}
                            className={confirmAction?.type === 'verify' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                        >
                            {actionLoading
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : confirmAction?.type === 'verify' ? 'Yes, Verify & Apply' : 'Yes, Reject'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
