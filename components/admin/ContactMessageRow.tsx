'use client';

import { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { MoreHorizontal, Mail, CheckCheck, Trash2, Eye } from 'lucide-react';
import { getBrowserClient } from '@/lib/supabase-browser';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'unread' | 'read' | 'replied';
    created_at: string;
}

export function ContactMessageRow({ message }: { message: ContactMessage }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const supabase = getBrowserClient();
    const { toast } = useToast();
    const router = useRouter();

    const handleMarkAsRead = async () => {
        setLoading(true);
        const { error } = await supabase
            .from('contact_messages')
            .update({ status: 'read' })
            .eq('id', message.id);

        if (error) {
            toast({
                title: 'Error',
                description: 'Failed to update message status',
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Success',
                description: 'Message marked as read',
            });
            router.refresh();
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        setLoading(true);
        const { error } = await supabase
            .from('contact_messages')
            .delete()
            .eq('id', message.id);

        if (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete message',
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Success',
                description: 'Message deleted',
            });
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <>
            <TableRow className="border-white/10 hover:bg-white/5">
                <TableCell>
                    <div>
                        <div className="font-medium">{message.name}</div>
                        <div className="text-xs text-muted-foreground">{message.email}</div>
                    </div>
                </TableCell>
                <TableCell>
                    <span className="font-medium">{message.subject}</span>
                </TableCell>
                <TableCell>
                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                        {message.message}
                    </p>
                </TableCell>
                <TableCell className="text-muted-foreground">
                    {new Date(message.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                    <Badge
                        variant={message.status === 'unread' ? 'secondary' : 'default'}
                        className={
                            message.status === 'unread' ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-0' :
                                message.status === 'replied' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0' :
                                    'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-0'
                        }
                    >
                        {message.status}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                            <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Reply
                                </DropdownMenuItem>
                                {message.status === 'unread' && (
                                    <DropdownMenuItem onClick={handleMarkAsRead} disabled={loading}>
                                        <CheckCheck className="mr-2 h-4 w-4" />
                                        Mark as Read
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600" onClick={handleDelete} disabled={loading}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </TableCell>
            </TableRow>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{message.subject}</DialogTitle>
                        <DialogDescription>
                            From: {message.name} ({message.email})
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="text-sm text-muted-foreground mb-2">
                            Received: {new Date(message.created_at).toLocaleString()}
                        </div>
                        <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                            {message.message}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
                        <Button onClick={() => window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`}>
                            Reply via Email
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
