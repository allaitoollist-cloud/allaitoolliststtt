'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Send, Trash2, Download, Users, Search, Loader2 } from 'lucide-react';

interface Subscriber {
    id: string;
    email: string;
    active: boolean;
    created_at: string;
}

export default function NewsletterPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [search, setSearch] = useState('');
    const { toast } = useToast();

    useEffect(() => { loadSubscribers(); }, []);

    const loadSubscribers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/newsletter-subscribers');
            if (!res.ok) throw new Error('Failed to load');
            const data = await res.json();
            setSubscribers(data.subscribers ?? []);
        } catch {
            toast({ title: 'Error', description: 'Failed to load subscribers', variant: 'destructive' });
        }
        setLoading(false);
    };

    const filtered = useMemo(() =>
        subscribers.filter(s => s.email.toLowerCase().includes(search.toLowerCase())),
        [subscribers, search]
    );

    const activeCount = subscribers.filter(s => s.active !== false).length;

    const handleDelete = async (id: string) => {
        const res = await fetch('/api/admin/newsletter-subscribers', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        if (res.ok) {
            toast({ title: 'Subscriber removed' });
            setSubscribers(prev => prev.filter(s => s.id !== id));
        } else {
            toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
        }
    };

    const handleToggleActive = async (id: string, current: boolean) => {
        const res = await fetch('/api/admin/newsletter-subscribers', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, active: !current }),
        });
        if (res.ok) {
            setSubscribers(prev =>
                prev.map(s => s.id === id ? { ...s, active: !current } : s)
            );
        } else {
            toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
        }
    };

    const handleSendCampaign = async () => {
        if (!subject.trim() || !message.trim()) {
            toast({ title: 'Error', description: 'Fill in subject and message', variant: 'destructive' });
            return;
        }
        setSending(true);
        try {
            const res = await fetch('/api/admin/newsletter-send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, message }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');
            toast({
                title: 'Campaign Sent!',
                description: `${data.sent} emails sent${data.failed > 0 ? `, ${data.failed} failed` : ''}`,
            });
            setSubject('');
            setMessage('');
        } catch (err: any) {
            toast({ title: 'Error', description: err.message, variant: 'destructive' });
        }
        setSending(false);
    };

    const handleExport = () => {
        const csv = 'Email,Status,Date\n' +
            subscribers.map(s =>
                `${s.email},${s.active !== false ? 'active' : 'inactive'},${s.created_at}`
            ).join('\n');
        const link = document.createElement('a');
        link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        link.download = 'subscribers.csv';
        link.click();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Newsletter</h1>
                    <p className="text-muted-foreground">Manage subscribers and send campaigns</p>
                </div>
                <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-card/50 border-white/10">
                    <CardContent className="p-4 flex items-center gap-3">
                        <Users className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-2xl font-bold">{subscribers.length}</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-white/10">
                    <CardContent className="p-4 flex items-center gap-3">
                        <Mail className="h-8 w-8 text-green-500" />
                        <div>
                            <p className="text-2xl font-bold">{activeCount}</p>
                            <p className="text-xs text-muted-foreground">Active</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-white/10">
                    <CardContent className="p-4 flex items-center gap-3">
                        <Mail className="h-8 w-8 text-red-400" />
                        <div>
                            <p className="text-2xl font-bold">{subscribers.length - activeCount}</p>
                            <p className="text-xs text-muted-foreground">Inactive</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Send Campaign */}
                <Card className="lg:col-span-2 bg-card/50 border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Send className="h-5 w-5" /> Send Campaign
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subject</label>
                            <Input
                                placeholder="e.g., Top 5 New AI Tools This Week!"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message</label>
                            <Textarea
                                placeholder="Write your newsletter content here..."
                                className="min-h-[200px]"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Will send to <strong>{activeCount}</strong> active subscribers
                            </p>
                            <Button onClick={handleSendCampaign} disabled={sending || activeCount === 0}>
                                {sending ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                                ) : (
                                    <><Send className="mr-2 h-4 w-4" /> Send Campaign</>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent subscribers */}
                <Card className="bg-card/50 border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" /> Recent Subscribers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-[320px] overflow-y-auto space-y-2">
                            {loading ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                </div>
                            ) : subscribers.slice(0, 20).map((sub) => (
                                <div key={sub.id} className="flex items-center justify-between p-2 rounded bg-secondary/20 text-sm">
                                    <div>
                                        <p className="truncate max-w-[150px]">{sub.email}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(sub.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-destructive shrink-0"
                                        onClick={() => handleDelete(sub.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                            {!loading && subscribers.length === 0 && (
                                <p className="text-muted-foreground text-center py-4 text-sm">No subscribers yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Full subscribers table */}
            <Card className="bg-card/50 border-white/10">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All Subscribers</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search email..."
                                className="pl-9 h-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10">
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Subscribed</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((sub) => (
                                <TableRow key={sub.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium">{sub.email}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={sub.active !== false
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                : 'bg-red-500/10 text-red-500 border-red-500/20'}
                                            variant="outline"
                                        >
                                            {sub.active !== false ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(sub.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleActive(sub.id, sub.active !== false)}
                                                className="text-xs h-7"
                                            >
                                                {sub.active !== false ? 'Deactivate' : 'Activate'}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-destructive"
                                                onClick={() => handleDelete(sub.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                        {search ? 'No matching subscribers' : 'No subscribers yet'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
