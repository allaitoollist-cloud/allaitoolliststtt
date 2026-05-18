'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBrowserClient } from '@/lib/supabase-browser';
import { useToast } from '@/components/ui/use-toast';

export function FavoriteButton({ toolId, toolSlug }: { toolId: string; toolSlug: string }) {
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const supabase = getBrowserClient();
    const { toast } = useToast();

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setLoading(false); return; }
            setUserId(user.id);

            const { data } = await supabase
                .from('favorites')
                .select('tool_id')
                .eq('user_id', user.id)
                .eq('tool_id', toolId)
                .maybeSingle();

            setSaved(!!data);
            setLoading(false);
        };
        init();
    }, [toolId]);

    const toggle = async () => {
        if (!userId) {
            toast({ title: 'Sign in required', description: 'Please sign in to save tools.', variant: 'destructive' });
            return;
        }

        setLoading(true);
        if (saved) {
            await supabase.from('favorites').delete().eq('user_id', userId).eq('tool_id', toolId);
            setSaved(false);
            toast({ title: 'Removed', description: 'Tool removed from your saved list.' });
        } else {
            await supabase.from('favorites').insert({ user_id: userId, tool_id: toolId });
            setSaved(true);
            toast({ title: 'Saved!', description: 'Tool added to your favorites.' });
        }
        setLoading(false);
    };

    return (
        <Button
            variant="outline"
            className={`bg-zinc-900 border-white/10 hover:bg-zinc-800 px-8 py-7 text-lg rounded-2xl font-bold transition-colors ${saved ? 'text-orange-500 border-orange-500/30' : 'text-white'}`}
            size="lg"
            onClick={toggle}
            disabled={loading}
        >
            <Bookmark className={`mr-2 h-5 w-5 ${saved ? 'fill-orange-500' : ''}`} />
            {saved ? 'Saved' : 'Save'}
        </Button>
    );
}
