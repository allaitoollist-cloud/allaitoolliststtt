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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Check, X, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface Submission {
    id: string;
    tool_name: string;
    tool_url: string;
    description: string;
    category: string;
    pricing: string;
    submitter_name: string;
    submitter_email: string;
    status: string;
    created_at: string;
}

export function SubmissionRow({ submission }: { submission: Submission }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleApprove = async () => {
        setLoading(true);
        console.log('Approving submission:', submission.id);

        try {
            const response = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'approve',
                    submissionId: submission.id,
                    submissionData: {
                        tool_name: submission.tool_name,
                        tool_url: submission.tool_url,
                        description: submission.description,
                        category: submission.category,
                        pricing: submission.pricing,
                    }
                }),
            });

            const data = await response.json();


            if (!response.ok) {
                console.error('Error approving:', data.error);
                toast({
                    title: 'Error',
                    description: data.error || 'Failed to approve submission',
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Success',
                    description: data.message || 'Submission approved!',
                });
                router.refresh();
            }
        } catch (error) {
            console.error('Network error:', error);
            toast({
                title: 'Error',
                description: 'Network error occurred',
                variant: 'destructive',
            });
        }
        setLoading(false);
    };

    const handleReject = async () => {
        setLoading(true);
        console.log('Rejecting submission:', submission.id);

        try {
            const response = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'reject',
                    submissionId: submission.id,
                }),
            });

            console.log('API Response status:', response.status);
            const data = await response.json();
            console.log('API Response data:', data);


            if (!response.ok) {
                console.error('Error rejecting:', data.error);
                toast({
                    title: 'Error',
                    description: data.error || 'Failed to reject submission',
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Success',
                    description: data.message || 'Submission rejected',
                });
                router.refresh();
            }
        } catch (error) {
            console.error('Network error:', error);
            toast({
                title: 'Error',
                description: 'Network error occurred',
                variant: 'destructive',
            });
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        console.log('Deleting submission:', submission.id);

        try {
            const response = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'delete',
                    submissionId: submission.id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Error deleting:', data.error);
                toast({
                    title: 'Error',
                    description: data.error || 'Failed to delete submission',
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Success',
                    description: data.message || 'Submission deleted',
                });
                router.refresh();
            }
        } catch (error) {
            console.error('Network error:', error);
            toast({
                title: 'Error',
                description: 'Network error occurred',
                variant: 'destructive',
            });
        }
        setLoading(false);
        setDeleteDialogOpen(false);
    };

    return (
        <>
            <TableRow className="border-white/10 hover:bg-white/5">
                <TableCell>
                    <div className="font-medium">{submission.tool_name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{submission.description}</div>
                </TableCell>
                <TableCell>
                    <a href={submission.tool_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                        {submission.tool_url}
                    </a>
                </TableCell>
                <TableCell>
                    <Badge variant="outline">{submission.category}</Badge>
                </TableCell>
                <TableCell>
                    <div className="text-sm">
                        <div className="font-medium">{submission.submitter_name}</div>
                        <div className="text-xs text-muted-foreground">{submission.submitter_email}</div>
                    </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                    {new Date(submission.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                    <Badge
                        variant={submission.status === 'pending' ? 'secondary' : submission.status === 'approved' ? 'default' : 'destructive'}
                        className={
                            submission.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-0' :
                                submission.status === 'approved' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0' :
                                    'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0'
                        }
                    >
                        {submission.status}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        {submission.status === 'pending' && (
                            <>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('Approve clicked for:', submission.id);
                                        handleApprove();
                                    }}
                                    disabled={loading}
                                    className="hover:bg-green-500/20 hover:text-green-500"
                                >
                                    <Check className="h-4 w-4 mr-1" />
                                    {loading ? 'Processing...' : 'Approve'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('Reject clicked for:', submission.id);
                                        handleReject();
                                    }}
                                    disabled={loading}
                                    className="hover:bg-red-500/20 hover:text-red-500"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    {loading ? 'Processing...' : 'Reject'}
                                </Button>
                            </>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </TableCell>
            </TableRow>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the submission for "{submission.tool_name}". This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700">
                            {loading ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
