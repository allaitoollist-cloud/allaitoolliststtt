'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Activity, Clock, User, RefreshCw } from 'lucide-react';

const ACTION_COLORS: Record<string, string> = {
    approve: 'bg-green-500/10 text-green-500',
    reject: 'bg-red-500/10 text-red-500',
    delete: 'bg-red-500/10 text-red-500',
    update: 'bg-blue-500/10 text-blue-500',
    create: 'bg-purple-500/10 text-purple-500',
    login: 'bg-gray-500/10 text-gray-400',
    publish: 'bg-emerald-500/10 text-emerald-500',
    paypal: 'bg-orange-500/10 text-orange-400',
    send: 'bg-orange-500/10 text-orange-400',
};

const ACTION_LABELS: Record<string, string> = {
    approve_submission: '✅ Approved',
    reject_submission: '❌ Rejected',
    send_paypal_link: '💳 PayPal Link Sent',
    send_newsletter: '📧 Newsletter Sent',
};

function actionColor(action: string) {
    const key = Object.keys(ACTION_COLORS).find(k => action.toLowerCase().includes(k));
    return key ? ACTION_COLORS[key] : 'bg-gray-500/10 text-gray-400';
}

export default function ActivityLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionFilter, setActionFilter] = useState('all');
    const load = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/data?table=activity_logs&limit=200');
            const json = await res.json();
            if (json.data) setLogs(json.data);
        } catch { /* network error */ }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const actionTypes = useMemo(() => {
        const types = Array.from(new Set(logs.map(l => l.action))).sort();
        return ['all', ...types];
    }, [logs]);

    const filtered = useMemo(() => {
        return logs.filter(l => {
            const matchAction = actionFilter === 'all' || l.action === actionFilter;
            const q = search.toLowerCase();
            const matchSearch = !q ||
                l.action?.toLowerCase().includes(q) ||
                l.user_profiles?.email?.toLowerCase().includes(q) ||
                l.user_profiles?.full_name?.toLowerCase().includes(q) ||
                JSON.stringify(l.details)?.toLowerCase().includes(q);
            return matchAction && matchSearch;
        });
    }, [logs, search, actionFilter]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Activity Logs</h1>
                    <p className="text-muted-foreground">Track admin actions and system events.</p>
                </div>
                <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by action, user, details..."
                        className="pl-9 bg-card/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {actionTypes.map(a => (
                        <Button
                            key={a}
                            size="sm"
                            variant={actionFilter === a ? 'default' : 'outline'}
                            onClick={() => setActionFilter(a)}
                            className="capitalize"
                        >
                            {a}
                        </Button>
                    ))}
                </div>
                {search && (
                    <Button size="sm" variant="ghost" onClick={() => setSearch('')}>Clear</Button>
                )}
            </div>

            {/* Table */}
            <div className="rounded-md border border-white/10 bg-card/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead>Action</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : filtered.length > 0 ? (
                            filtered.map((log) => (
                                <TableRow key={log.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell>
                                        <Badge className={`border-0 ${actionColor(log.action)}`}>
                                            {ACTION_LABELS[log.action] || log.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="h-3 w-3 shrink-0" />
                                            <span>{log.user_profiles?.email || log.user_profiles?.full_name || 'Admin'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {typeof log.details === 'object' && log.details ? (
                                            <div className="text-xs text-muted-foreground space-y-0.5">
                                                {log.details.tool && <div><span className="text-foreground font-medium">{log.details.tool}</span></div>}
                                                {log.details.to && <div>To: {log.details.to}</div>}
                                                {log.details.email && !log.details.to && <div>{log.details.email}</div>}
                                                {log.details.plan && <div>Plan: {log.details.plan} {log.details.amount ? `· ${log.details.amount}` : ''}</div>}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">{String(log.details ?? '—')}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3 w-3 shrink-0" />
                                            {new Date(log.created_at).toLocaleString()}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                    {search || actionFilter !== 'all' ? 'No matching logs' : 'No activity recorded yet'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <p className="text-sm text-muted-foreground">Showing {filtered.length} of {logs.length} entries</p>
        </div>
    );
}
