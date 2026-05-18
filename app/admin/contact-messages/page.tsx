'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Loader2, MailOpen, Mail, MessageSquareReply } from 'lucide-react';
import { getBrowserClient } from '@/lib/supabase-browser';
import { ContactMessageRow } from '@/components/admin/ContactMessageRow';

const FILTERS = ['all', 'unread', 'read', 'replied'];

export default function ContactMessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const supabase = getBrowserClient();

    const load = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setMessages(data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const filtered = useMemo(() => {
        return messages.filter(m => {
            const matchStatus = statusFilter === 'all' || m.status === statusFilter;
            const q = search.toLowerCase();
            const matchSearch = !q ||
                m.name?.toLowerCase().includes(q) ||
                m.email?.toLowerCase().includes(q) ||
                m.subject?.toLowerCase().includes(q) ||
                m.message?.toLowerCase().includes(q);
            return matchStatus && matchSearch;
        });
    }, [messages, search, statusFilter]);

    const stats = useMemo(() => ({
        unread: messages.filter(m => m.status === 'unread').length,
        read: messages.filter(m => m.status === 'read').length,
        replied: messages.filter(m => m.status === 'replied').length,
    }), [messages]);

    const statCards = [
        { label: 'Unread', value: stats.unread, icon: Mail, color: 'bg-blue-500/10 text-blue-500', key: 'unread' },
        { label: 'Read', value: stats.read, icon: MailOpen, color: 'bg-gray-500/10 text-gray-400', key: 'read' },
        { label: 'Replied', value: stats.replied, icon: MessageSquareReply, color: 'bg-green-500/10 text-green-500', key: 'replied' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Contact Messages</h1>
                <p className="text-muted-foreground">View and manage messages from your contact form.</p>
                {stats.unread > 0 && (
                    <p className="text-sm text-blue-400 mt-1">📬 {stats.unread} unread message{stats.unread > 1 ? 's' : ''}</p>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                {statCards.map(({ label, value, icon: Icon, color, key }) => (
                    <Card
                        key={key}
                        onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
                        className={`bg-card/50 border-white/10 cursor-pointer transition-all hover:border-white/30 ${statusFilter === key ? 'ring-2 ring-primary' : ''}`}
                    >
                        <CardContent className="pt-4 pb-3">
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-lg ${color}`}>
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

            {/* Search + Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email, subject..."
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
                            variant={statusFilter === f ? 'default' : 'outline'}
                            onClick={() => setStatusFilter(f)}
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
                            <TableHead>From</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Date</TableHead>
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
                            filtered.map((message) => (
                                <ContactMessageRow key={message.id} message={message} onRefresh={load} />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    {search || statusFilter !== 'all' ? 'No matching messages' : 'No messages found'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <p className="text-sm text-muted-foreground">Showing {filtered.length} of {messages.length} messages</p>
        </div>
    );
}
