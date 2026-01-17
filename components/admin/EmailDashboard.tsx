'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle2, Clock, AlertTriangle, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface EmailLog {
    id: string;
    recipient: string;
    subject: string;
    type: 'confirmation' | 'approval' | 'notification' | 'reminder';
    sent_at: string;
    status: 'delivered' | 'failed';
}

export default function EmailDashboard({ logs }: { logs: EmailLog[] }) {
    const [emailEnabled, setEmailEnabled] = useState(true);
    const { toast } = useToast();

    const handleToggle = () => {
        setEmailEnabled(!emailEnabled);
        toast({
            title: emailEnabled ? "Email Automation Paused" : "Email Automation Resumed",
            description: "System settings updated."
        });
    };

    const sendTestEmail = async () => {
        toast({ title: "Test Email Sent", description: "Check your admin inbox." });
        // Call API here if implemented
    };

    return (
        <div className="space-y-8">
            {/* 1. Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Service Status</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Operational</div>
                        <p className="text-xs text-muted-foreground">Provider: Resend.com</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Emails Sent</CardTitle>
                        <Mail className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{logs.length}</div>
                        <p className="text-xs text-muted-foreground">Lifetime volume</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Automation</CardTitle>
                        <Switch checked={emailEnabled} onCheckedChange={handleToggle} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{emailEnabled ? 'Active' : 'Paused'}</div>
                        <p className="text-xs text-muted-foreground">Triggers enabled</p>
                    </CardContent>
                </Card>
            </div>

            {/* 2. Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Trigger Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <span className="font-medium">Submission Confirmation</span>
                                <p className="text-xs text-muted-foreground">Sent to user upon form submit</p>
                            </div>
                            <Switch checked={true} disabled />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <span className="font-medium">Admin Notification</span>
                                <p className="text-xs text-muted-foreground">Sent to admin upon new entry</p>
                            </div>
                            <Switch checked={true} disabled />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <span className="font-medium">Approval Notification</span>
                                <p className="text-xs text-muted-foreground">Sent to user when published</p>
                            </div>
                            <Switch checked={true} disabled />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start" onClick={sendTestEmail}>
                            <Send className="mr-2 h-4 w-4" /> Send Test Email
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-muted-foreground" disabled>
                            <AlertTriangle className="mr-2 h-4 w-4" /> View Error Logs (Coming Soon)
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Recent Activity Log */}
            <div className="rounded-md border bg-card">
                <div className="p-4 border-b">
                    <h3 className="font-semibold">Recent Email Activity</h3>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Recipient</TableHead>
                            <TableHead>Sent At</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No email activity recorded yet.
                                </TableCell>
                            </TableRow>
                        )}
                        {logs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize">{log.type}</Badge>
                                </TableCell>
                                <TableCell className="font-mono text-xs">{log.recipient}</TableCell>
                                <TableCell>{new Date(log.sent_at).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">Delivered</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
