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
import { MoreHorizontal, Trash2, Shield, ShieldOff } from 'lucide-react';
import { getBrowserClient } from '@/lib/supabase-browser';
import { useToast } from '@/components/ui/use-toast';

interface User {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at?: string;
    is_admin?: boolean;
}

export function UserRow({ user, onRefresh }: { user: User; onRefresh?: () => void }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const supabase = getBrowserClient();

    const handleToggleAdmin = async () => {
        setLoading(true);
        const newAdminStatus = !user.is_admin;

        const { error } = await supabase
            .from('user_profiles')
            .update({ is_admin: newAdminStatus })
            .eq('id', user.id);

        if (error) {
            toast({
                title: 'Error',
                description: 'Failed to update user role',
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Success',
                description: `User ${newAdminStatus ? 'promoted to' : 'removed from'} admin`,
            });
            onRefresh?.();
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        const { error } = await supabase.auth.admin.deleteUser(user.id);

        if (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete user',
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Success',
                description: 'User deleted successfully',
            });
            onRefresh?.();
        }
        setLoading(false);
        setDeleteDialogOpen(false);
    };

    return (
        <>
            <TableRow className="border-white/10 hover:bg-white/5">
                <TableCell>
                    <div className="font-medium">{user.email}</div>
                </TableCell>
                <TableCell>
                    {user.is_admin ? (
                        <Badge className="bg-primary/20 text-primary border-0">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                        </Badge>
                    ) : (
                        <Badge variant="secondary">User</Badge>
                    )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleToggleAdmin} disabled={loading}>
                                {user.is_admin ? (
                                    <>
                                        <ShieldOff className="mr-2 h-4 w-4" />
                                        Remove Admin
                                    </>
                                ) : (
                                    <>
                                        <Shield className="mr-2 h-4 w-4" />
                                        Make Admin
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete user "{user.email}". This action cannot be undone.
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
