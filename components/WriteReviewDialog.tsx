'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Loader2, AlertCircle, LogIn, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface WriteReviewDialogProps {
    toolId: string;
    toolName: string;
    trigger?: React.ReactNode;
}

export function WriteReviewDialog({ toolId, toolName, trigger }: WriteReviewDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const { toast } = useToast();
    const pathname = usePathname();

    // Auth Hook
    const { user, loading: authLoading } = useAuth();

    // Initialize Supabase client
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const hasUrl = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9]+\.[a-zA-Z]{2,}\/)/i;
        return urlRegex.test(text);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast({
                title: "Authentication required",
                description: "Please sign in to leave a review.",
                variant: "destructive",
            });
            return;
        }

        if (rating === 0) {
            toast({
                title: "Rating required",
                description: "Please select a star rating",
                variant: "destructive",
            });
            return;
        }

        if (hasUrl(comment)) {
            toast({
                title: "No links allowed",
                description: "To prevent spam, reviews cannot contain links or URLs.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            const reviewData = {
                tool_id: toolId,
                user_id: user.id,
                rating: rating,
                comment: comment,
            };

            const { error } = await supabase
                .from('reviews')
                .insert([reviewData]);

            if (error) throw error;

            toast({
                title: "Review Submitted",
                description: "Your review has been submitted for approval.",
            });
            setOpen(false);
            setComment('');
            setRating(0);

        } catch (error: any) {
            console.error('Review Error:', error);
            toast({
                title: "Submission Failed",
                description: error.message || "Could not submit review. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // If Auth is still loading, maybe just show trigger for now

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button variant="outline">Write a Review</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Review {toolName}</DialogTitle>
                    <DialogDescription>
                        Share your experience with this tool. Reviews are moderated.
                    </DialogDescription>
                </DialogHeader>

                {authLoading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : !user ? (
                    // UNAUTHENTICATED STATE
                    <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
                        <div className="h-16 w-16 bg-secondary/30 rounded-full flex items-center justify-center">
                            <Lock className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">Sign in to Write a Review</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                To ensure authentic feedback, we require users to sign in before leaving a review.
                            </p>
                        </div>
                        <div className="flex gap-3 w-full max-w-xs">
                            <Button asChild className="flex-1" variant="default">
                                <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
                                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                                </Link>
                            </Button>
                            <Button asChild className="flex-1" variant="outline">
                                <Link href="/register">
                                    Sign Up
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    // AUTHENTICATED FORM
                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        {/* Rating Stars */}
                        <div className="flex flex-col items-center gap-2">
                            <Label>Your Rating</Label>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= (hoverRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-muted-foreground/30'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <div className="text-sm font-medium text-muted-foreground">
                                {rating ? ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1] : 'Select a rating'}
                            </div>
                        </div>

                        {/* Comment */}
                        <div className="space-y-2">
                            <Label htmlFor="comment">Your Review</Label>
                            <Textarea
                                id="comment"
                                placeholder="What did you like or dislike? (No links allowed)"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="min-h-[100px]"
                                required
                            />
                            {hasUrl(comment) && (
                                <div className="flex items-center gap-2 text-xs text-red-500 font-medium animate-pulse">
                                    <AlertCircle className="w-3 h-3" />
                                    Links are not allowed in reviews.
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Please be respectful. Spam and self-promotion will be rejected.
                            </p>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || rating === 0 || hasUrl(comment)}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Review'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
