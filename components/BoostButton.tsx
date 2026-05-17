'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Loader2, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getBrowserClient } from '@/lib/supabase-browser';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface BoostButtonProps {
    toolSlug: string;
    toolName: string;
    isFeatured: boolean;
}

export function BoostButton({ toolSlug, toolName, isFeatured }: BoostButtonProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [requested, setRequested] = useState(false);
    const { toast } = useToast();
    const supabase = getBrowserClient();

    const handleRequestBoost = async () => {
        setLoading(true);
        try {
            // Get current user email
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user?.email) {
                throw new Error("You must be logged in to request a boost.");
            }

            const { error } = await supabase
                .from('sponsorship_requests')
                .insert([{
                    tool_slug: toolSlug,
                    tool_name: toolName,
                    user_email: user.email,
                    status: 'pending'
                }]);

            if (error) throw error;

            setRequested(true);
            toast({
                title: 'Boost Requested!',
                description: 'We will send you an email shortly with payment instructions.',
            });
            
            // Close dialog after a delay
            setTimeout(() => setOpen(false), 2000);

        } catch (error: any) {
            console.error('Boost request error:', error);
            toast({
                title: 'Request Failed',
                description: error.message || 'Could not send the request.',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    if (isFeatured) {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                <Zap className="w-3 h-3 fill-orange-500" /> Featured
            </span>
        );
    }

    return (
        <>
            <Button 
                size="sm" 
                variant="outline" 
                className="h-8 text-xs bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 hover:text-white border-orange-200 text-orange-600 transition-all"
                onClick={() => setOpen(true)}
            >
                <Zap className="w-3 h-3 mr-1" />
                Boost ($49)
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
                            Boost "{toolName}"
                        </DialogTitle>
                        <DialogDescription className="pt-3 space-y-3">
                            <p>To maintain the highest quality in our directory, we manually review and process all Featured placements.</p>
                            
                            <div className="bg-muted p-3 rounded-md text-sm border border-border">
                                <strong>What happens next?</strong>
                                <ul className="list-disc pl-4 mt-2 space-y-1">
                                    <li>We will send an invoice for $49 to your email.</li>
                                    <li>You can pay via Binance (Crypto), Payoneer, or Bank Transfer.</li>
                                    <li>Once we verify the payment, your tool will be pinned to the top of the homepage for 30 days!</li>
                                </ul>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button 
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                            onClick={handleRequestBoost} 
                            disabled={loading || requested}
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                            ) : requested ? (
                                <><Mail className="w-4 h-4 mr-2" /> Request Sent!</>
                            ) : (
                                "Request Invoice"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
