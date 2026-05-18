'use client';

import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getBrowserClient } from '@/lib/supabase-browser';
import { Activity, Clock, User } from 'lucide-react';

interface Log {
    id: string;
    action: string;
    details: any;
    created_at: string;
    user_id: string;
    user_profiles?: {
        email: string;
        full_name: string;
    };
}

export default function ActivityLogsPage() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = getBrowserClient();

    useEffect(() => {
        const fetchLogs = async () => {
            const { data, error } = await supabase
                .from('activity_logs')
                .select(`
                    *,
                    user_profiles:user_id (
                        email,
                        full_name
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(50);

            if (data) setLogs(data);
            setLoading(false);
        };

        fetchLogs();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Activity Logs</h1>
                <p className="text-muted-foreground">Track admin actions and system events.</p>
            </div>

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
                        {logs.length > 0 ? (
                            logs.map((log) => (
                                <TableRow key={log.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-primary" />
                                            <span className="font-medium">{log.action}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="h-3 w-3" />
                                            {log.user_profiles?.email || 'Unknown'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-xs bg-secondary/30 p-1 rounded">
                                            {JSON.stringify(log.details)}
                                        </code>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3 w-3" />
                                            {new Date(log.created_at).toLocaleString()}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                    {loading ? 'Loading logs...' : 'No activity recorded yet'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
