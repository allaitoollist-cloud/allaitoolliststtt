'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { getBrowserClient } from '@/lib/supabase-browser';
import { Mail, Loader2 } from 'lucide-react';

export function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const supabase = getBrowserClient();

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('newsletter_subscribers')
                .insert([{ email }]);

            if (error) {
                if (error.code === '23505') { // Unique violation
                    toast({
                        title: "Already Subscribed",
                        description: "This email is already on our list!",
                    });
                } else {
                    throw error;
                }
            } else {
                toast({
                    title: "Subscribed!",
                    description: "Thank you for subscribing to our newsletter.",
                });
                setEmail('');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to subscribe. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubscribe} className="flex flex-col gap-3 w-full">
            <div className="relative w-full">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    type="email"
                    placeholder="Enter your email"
                    className="pl-9 bg-background/50 border-white/10 w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
            </Button>
        </form>
    );
}
