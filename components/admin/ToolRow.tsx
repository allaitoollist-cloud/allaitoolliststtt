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
import { MoreHorizontal, Trash2, ExternalLink, Eye, Star, TrendingUp, BadgeCheck, Clock, ShieldCheck, Pencil, FileX } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Tool {
    id: string;
    name: string;
    slug?: string;
    description: string;
    short_description?: string;
    url: string;
    category: string;
    pricing: string;
    views: number;
    rating: number;
    trending: boolean;
    featured: boolean;
    verified: boolean;
    is_draft?: boolean;
}

export function ToolRow({ tool }: { tool: Tool }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleDelete = async () => {
        setLoading(true);
        const { error } = await supabase
            .from('tools')
            .delete()
            .eq('id', tool.id);

        if (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete tool',
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Success',
                description: 'Tool deleted successfully',
            });
            router.refresh();
        }
        setLoading(false);
        setDeleteDialogOpen(false);
    };

    const handleToggle = async (field: 'featured' | 'trending' | 'verified', currentValue: boolean) => {
        const { error } = await supabase
            .from('tools')
            .update({ [field]: !currentValue })
            .eq('id', tool.id);

        if (error) {
            toast({
                title: 'Error',
                description: `Failed to update ${field}`,
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Success',
                description: `Tool ${field} status updated`,
            });
            router.refresh();
        }
    };

    return (
        <>
            <TableRow className="border-white/10 hover:bg-white/5">
                <TableCell>
                    <div className="flex items-center gap-2">
                        <div className="font-medium">{tool.name}</div>
                        {/* Verified Status Icons */}
                        {tool.verified ? (
                            <span title="Verified">
                                <BadgeCheck className="h-4 w-4 text-green-500" />
                            </span>
                        ) : (
                            <span title="Pending Verification">
                                <Clock className="h-4 w-4 text-yellow-500" />
                            </span>
                        )}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{tool.short_description || tool.description}</div>
                </TableCell>
                <TableCell>
                    <Badge variant="outline">{tool.category}</Badge>
                </TableCell>
                <TableCell>
                    <Badge variant={tool.pricing === 'Free' ? 'default' : 'secondary'}>
                        {tool.pricing}
                    </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{tool.views || 0}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-1 flex-wrap">
                        {/* Featured Badge with Star */}
                        {tool.featured && (
                            <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-0 gap-1">
                                <Star className="h-3 w-3 fill-purple-500" />
                                Featured
                            </Badge>
                        )}
                        {/* Trending Badge with Fire Icon */}
                        {tool.trending && (
                            <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-0 gap-1">
                                <TrendingUp className="h-3 w-3" />
                                Trending
                            </Badge>
                        )}
                        {/* Verified Badge */}
                        {tool.verified && (
                            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0 gap-1">
                                <ShieldCheck className="h-3 w-3" />
                                Verified
                            </Badge>
                        )}
                        {/* Draft Badge */}
                        {tool.is_draft && (
                            <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-0 gap-1">
                                <FileX className="h-3 w-3" />
                                Draft
                            </Badge>
                        )}
                    </div>
                </TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            {/* Edit Tool */}
                            <Link href={`/admin/tools/edit/${tool.id}`}>
                                <DropdownMenuItem>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Tool
                                </DropdownMenuItem>
                            </Link>

                            <Link href={`/tool/${tool.slug || tool.id}`} target="_blank">
                                <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Tool
                                </DropdownMenuItem>
                            </Link>
                            <Link href={tool.url} target="_blank">
                                <DropdownMenuItem>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Visit Site
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />

                            {/* Featured Toggle */}
                            <DropdownMenuItem onClick={() => handleToggle('featured', tool.featured)}>
                                <Star className={`mr-2 h-4 w-4 ${tool.featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                                {tool.featured ? 'Remove Featured' : 'Mark as Featured'}
                            </DropdownMenuItem>

                            {/* Trending Toggle */}
                            <DropdownMenuItem onClick={() => handleToggle('trending', tool.trending)}>
                                <TrendingUp className={`mr-2 h-4 w-4 ${tool.trending ? 'text-orange-500' : ''}`} />
                                {tool.trending ? 'Remove Trending' : 'Mark as Trending'}
                            </DropdownMenuItem>

                            {/* Verified Toggle */}
                            <DropdownMenuItem onClick={() => handleToggle('verified', tool.verified)}>
                                <ShieldCheck className={`mr-2 h-4 w-4 ${tool.verified ? 'text-green-500' : 'text-yellow-500'}`} />
                                {tool.verified ? 'Remove Verified' : 'Mark as Verified'}
                            </DropdownMenuItem>

                            {/* Draft Toggle */}
                            <DropdownMenuItem onClick={() => handleToggle('is_draft' as any, tool.is_draft || false)}>
                                <FileX className={`mr-2 h-4 w-4 ${tool.is_draft ? 'text-yellow-500' : ''}`} />
                                {tool.is_draft ? 'Publish' : 'Move to Draft'}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
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
                            This will permanently delete &quot;{tool.name}&quot;. This action cannot be undone.
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
