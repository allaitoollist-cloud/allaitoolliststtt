'use client';

import Image from 'next/image';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Search, Trash2, Star, ExternalLink, MessageSquare } from 'lucide-react';
import { getBrowserClient } from '@/lib/supabase-browser';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

interface Review {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    user_id: string;
    tool_id: string;
    user_profiles?: {
        full_name: string;
        email: string;
        avatar_url: string;
    };
    tools?: {
        name: string;
        slug: string;
    };
}

export function ReviewList({ initialReviews }: { initialReviews: Review[] }) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const supabase = getBrowserClient();

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        setLoading(true);
        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', id);

        if (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete review',
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Success',
                description: 'Review deleted successfully',
            });
            setReviews(reviews.filter(review => review.id !== id));
        }
        setLoading(false);
    };

    const filteredReviews = reviews.filter(review => {
        const searchLower = searchQuery.toLowerCase();
        return (
            review.comment?.toLowerCase().includes(searchLower) ||
            review.user_profiles?.full_name?.toLowerCase().includes(searchLower) ||
            review.tools?.name?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search reviews..."
                        className="pl-9 bg-card/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border border-white/10 bg-card/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead>User</TableHead>
                            <TableHead>Tool</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Comment</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map((review) => (
                                <TableRow key={review.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                                                {review.user_profiles?.avatar_url ? (
                                                    <div className="relative h-full w-full">
                                                        <Image
                                                            src={review.user_profiles.avatar_url}
                                                            alt=""
                                                            fill
                                                            className="object-cover"
                                                            sizes="40px"
                                                        />
                                                    </div>
                                                ) : (
                                                    (review.user_profiles?.full_name || 'U')[0].toUpperCase()
                                                )}
                                            </div>
                                            <div className="text-sm font-medium">
                                                {review.user_profiles?.full_name || 'Unknown User'}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/tool/${review.tools?.slug}`}
                                            target="_blank"
                                            className="text-sm font-medium hover:text-primary flex items-center gap-1"
                                        >
                                            {review.tools?.name || 'Unknown Tool'}
                                            <ExternalLink className="h-3 w-3 opacity-50" />
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                            <span className="font-bold">{review.rating}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs" title={review.comment}>
                                            {review.comment || <span className="italic opacity-50">No comment</span>}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => handleDelete(review.id)}
                                                    disabled={loading}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Review
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    No reviews found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
