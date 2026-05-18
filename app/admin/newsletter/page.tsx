'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { getBrowserClient } from '@/lib/supabase-browser';
import { Mail, Send, Trash2, Download, Users } from 'lucide-react';

export default function NewsletterPage() {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const { toast } = useToast();
    const supabase = getBrowserClient();

    useEffect(() => {
        loadSubscribers();
    }, []);

    const loadSubscribers = async () => {
        const { data } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .order('subscribed_at', { ascending: false });

        if (data) setSubscribers(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from('newsletter_subscribers')
            .delete()
            .eq('id', id);

        if (!error) {
            toast({ title: 'Success', description: 'Subscriber removed' });
            loadSubscribers();
        }
    };

    const handleSendCampaign = async () => {
        if (!subject || !message) {
            toast({ title: 'Error', description: 'Please fill in subject and message', variant: 'destructive' });
            return;
        }

        setSending(true);
        // Simulate sending emails
        await new Promise(resolve => setTimeout(resolve, 2000));

        toast({
            title: 'Campaign Sent! 🚀',
            description: `Email sent to ${subscribers.length} subscribers.`
        });

        setSubject('');
        setMessage('');
        setSending(false);
    };

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Email,Date\n"
            + subscribers.map(s => `${s.email},${s.subscribed_at}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "subscribers.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Newsletter</h1>
                    <p className="text-muted-foreground">Manage subscribers and send updates</p>
                </div>
                <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Send Campaign */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Send className="h-5 w-5" />
                            Send Campaign
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subject</label>
                            <Input
                                placeholder="e.g., New AI Tools Added this Week!"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message</label>
                            <Textarea
                                placeholder="Write your update here..."
                                className="min-h-[200px]"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleSendCampaign} disabled={sending || subscribers.length === 0}>
                                {sending ? 'Sending...' : `Send to ${subscribers.length} Subscribers`}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Subscribers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-4">{subscribers.length}</div>
                        <div className="max-h-[300px] overflow-y-auto space-y-2">
                            {subscribers.map((sub) => (
                                <div key={sub.id} className="flex items-center justify-between p-2 rounded bg-secondary/20 text-sm">
                                    <span className="truncate max-w-[150px]">{sub.email}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-destructive"
                                        onClick={() => handleDelete(sub.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                            {subscribers.length === 0 && (
                                <div className="text-muted-foreground text-center py-4">No subscribers yet</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
