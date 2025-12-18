'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Loader2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function DeleteDummyToolsButton() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/delete-dummy-tools', {
                method: 'GET',
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to delete tools');
            }

            toast({
                title: 'Success',
                description: `Deleted: ${result.deletedTools?.map((t: any) => t.name).join(', ') || 'Tools'}`,
            });

            setOpen(false);
            
            // Reload page after 1 second
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error: any) {
            console.error('Delete error:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete tools. Make sure SUPABASE_SERVICE_ROLE_KEY is set in .env.local',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Dummy Tools
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Dummy Tools?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will delete <strong>ismail</strong> and <strong>chatgpt</strong> tools.
                        <br />
                        <strong>TaleGenie will NOT be deleted.</strong>
                        <br />
                        <br />
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

