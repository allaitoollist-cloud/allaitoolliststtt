'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Loader2, Users, Shield } from 'lucide-react';
import { UserRow } from '@/components/admin/UserRow';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.users) setUsers(data.users);
        } catch {
            // error handled by showing empty state
        }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const filtered = useMemo(() => {
        return users.filter(u => {
            const matchRole =
                roleFilter === 'all' ? true :
                roleFilter === 'admin' ? u.is_admin :
                roleFilter === 'user' ? !u.is_admin : true;
            const q = search.toLowerCase();
            const matchSearch = !q || u.email?.toLowerCase().includes(q);
            return matchRole && matchSearch;
        });
    }, [users, search, roleFilter]);

    const adminCount = users.filter(u => u.is_admin).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Manage Users</h1>
                    <p className="text-muted-foreground">View and manage all registered users</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 max-w-sm">
                <Card
                    onClick={() => setRoleFilter('all')}
                    className={`bg-card/50 border-white/10 cursor-pointer transition-all hover:border-white/30 ${roleFilter === 'all' ? 'ring-2 ring-primary' : ''}`}
                >
                    <CardContent className="pt-4 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                <Users className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{users.length}</p>
                                <p className="text-xs text-muted-foreground">Total</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card
                    onClick={() => setRoleFilter(roleFilter === 'admin' ? 'all' : 'admin')}
                    className={`bg-card/50 border-white/10 cursor-pointer transition-all hover:border-white/30 ${roleFilter === 'admin' ? 'ring-2 ring-primary' : ''}`}
                >
                    <CardContent className="pt-4 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                                <Shield className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{adminCount}</p>
                                <p className="text-xs text-muted-foreground">Admins</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by email..."
                        className="pl-9 bg-card/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'admin', 'user'].map(f => (
                        <Button
                            key={f}
                            size="sm"
                            variant={roleFilter === f ? 'default' : 'outline'}
                            onClick={() => setRoleFilter(f)}
                            className="capitalize"
                        >
                            {f}
                        </Button>
                    ))}
                </div>
                {search && (
                    <Button size="sm" variant="ghost" onClick={() => setSearch('')}>Clear</Button>
                )}
            </div>

            {/* Table */}
            <div className="rounded-md border border-white/10 bg-card/50 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="hidden md:table-cell">Last Sign In</TableHead>
                            <TableHead className="hidden md:table-cell">Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : filtered.length > 0 ? (
                            filtered.map((user) => (
                                <UserRow key={user.id} user={user} onRefresh={load} />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                    {search ? `No users matching "${search}"` : 'No users found'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <p className="text-sm text-muted-foreground">Showing {filtered.length} of {users.length} users</p>
        </div>
    );
}
