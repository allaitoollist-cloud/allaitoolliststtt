'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getBrowserClient } from '@/lib/supabase-browser';
import { Mail, Loader2, ArrowRight } from 'lucide-react';

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
        <form onSubmit={handleSubscribe} className="relative group w-full">
            <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                        <Mail className="w-5 h-5" />
                    </div>
                    <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white font-bold placeholder:text-gray-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all text-sm md:text-base"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full sm:w-auto px-10 py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Join Now
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
