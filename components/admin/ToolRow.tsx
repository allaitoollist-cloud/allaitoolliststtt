'use client';

import { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { useToast } from '@/components/ui/use-toast';
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
    status?: string;
}

interface ToolRowProps {
    tool: Tool;
    selected: boolean;
    onSelect: (id: string, checked: boolean) => void;
    onRefresh: () => void;
}

export function ToolRow({ tool, selected, onSelect, onRefresh }: ToolRowProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/tools', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', toolId: tool.id }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.error || 'Failed to delete tool');
            toast({ title: 'Deleted', description: `"${tool.name}" deleted.` });
            onRefresh();
        } catch (error) {
            toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to delete', variant: 'destructive' });
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);
        }
    };

    const isDraft = (t: typeof tool) => t.status === 'draft' || (!t.status && t.is_draft);

    const handleToggle = async (field: 'featured' | 'trending' | 'verified', currentValue: boolean) => {
        const res = await fetch('/api/tools', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'toggle', toolId: tool.id, field, value: !currentValue }),
        });
        if (res.ok) {
            toast({ title: 'Updated', description: `${field} toggled.` });
            onRefresh();
        } else {
            toast({ title: 'Error', description: `Failed to update ${field}`, variant: 'destructive' });
        }
    };

    const handleTogglePublish = async () => {
        const newStatus = isDraft(tool) ? 'published' : 'draft';
        const res = await fetch('/api/tools', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'toggle', toolId: tool.id, field: 'status', value: newStatus }),
        });
        if (res.ok) {
            toast({ title: 'Updated', description: `Tool ${newStatus}.` });
            onRefresh();
        } else {
            toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
        }
    };

    return (
        <>
            <TableRow className={`border-white/10 hover:bg-white/5 ${selected ? 'bg-primary/5' : ''}`}>
                <TableCell className="w-10">
                    <Checkbox
                        checked={selected}
                        onCheckedChange={(checked) => onSelect(tool.id, !!checked)}
                        aria-label={`Select ${tool.name}`}
                    />
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <div className="font-medium">{tool.name}</div>
                        {tool.verified ? (
                            <BadgeCheck className="h-4 w-4 text-green-500 shrink-0" />
                        ) : (
                            <Clock className="h-4 w-4 text-yellow-500 shrink-0" />
                        )}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{tool.short_description || tool.description}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{tool.category}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    <Badge variant={tool.pricing === 'Free' ? 'default' : 'secondary'}>{tool.pricing}</Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{tool.views || 0}</TableCell>
                <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1 flex-wrap">
                        {tool.featured && <Badge className="bg-purple-500/10 text-purple-500 border-0 gap-1 text-xs"><Star className="h-3 w-3 fill-purple-500" />Featured</Badge>}
                        {tool.trending && <Badge className="bg-orange-500/10 text-orange-500 border-0 gap-1 text-xs"><TrendingUp className="h-3 w-3" />Trending</Badge>}
                        {tool.verified && <Badge className="bg-green-500/10 text-green-500 border-0 gap-1 text-xs"><ShieldCheck className="h-3 w-3" />Verified</Badge>}
                        {isDraft(tool) && <Badge className="bg-yellow-500/10 text-yellow-500 border-0 gap-1 text-xs"><FileX className="h-3 w-3" />Draft</Badge>}
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
                            <Link href={`/admin/tools/edit/${tool.id}`}>
                                <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" />Edit Tool</DropdownMenuItem>
                            </Link>
                            <Link href={`/tool/${tool.slug || tool.id}`} target="_blank">
                                <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Tool</DropdownMenuItem>
                            </Link>
                            <Link href={tool.url} target="_blank">
                                <DropdownMenuItem><ExternalLink className="mr-2 h-4 w-4" />Visit Site</DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggle('featured', tool.featured)}>
                                <Star className={`mr-2 h-4 w-4 ${tool.featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                                {tool.featured ? 'Remove Featured' : 'Mark as Featured'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggle('trending', tool.trending)}>
                                <TrendingUp className={`mr-2 h-4 w-4 ${tool.trending ? 'text-orange-500' : ''}`} />
                                {tool.trending ? 'Remove Trending' : 'Mark as Trending'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggle('verified', tool.verified)}>
                                <ShieldCheck className={`mr-2 h-4 w-4 ${tool.verified ? 'text-green-500' : ''}`} />
                                {tool.verified ? 'Remove Verified' : 'Mark as Verified'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleTogglePublish}>
                                <FileX className={`mr-2 h-4 w-4 ${isDraft(tool) ? 'text-yellow-500' : ''}`} />
                                {isDraft(tool) ? 'Publish' : 'Move to Draft'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{tool.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
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
