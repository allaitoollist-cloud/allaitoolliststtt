'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface UserInteractionsContextType {
    favoriteToolIds: string[];
    upvotedToolIds: string[];
    toggleFavorite: (toolId: string) => Promise<void>;
    toggleUpvote: (toolId: string) => Promise<void>;
    loading: boolean;
}

const UserInteractionsContext = createContext<UserInteractionsContextType | undefined>(undefined);

export function UserInteractionsProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [favoriteToolIds, setFavoriteToolIds] = useState<string[]>([]);
    const [upvotedToolIds, setUpvotedToolIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        if (!user) {
            setFavoriteToolIds([]);
            setUpvotedToolIds([]);
            setLoading(false);
            return;
        }

        const fetchInteractions = async () => {
            setLoading(true);
            try {
                // Fetch favorites
                const { data: favs, error: favError } = await supabase
                    .from('favorites')
                    .select('tool_id')
                    .eq('user_id', user.id);

                if (favError) throw favError;
                setFavoriteToolIds((favs || []).map(f => f.tool_id));

                // Fetch upvotes
                const { data: upvs, error: upvError } = await supabase
                    .from('upvotes')
                    .select('tool_id')
                    .eq('user_id', user.id);

                if (upvError) throw upvError;
                setUpvotedToolIds((upvs || []).map(u => u.tool_id));

            } catch (error: any) {
                console.error('Error fetching user interactions:', error);
                // Fail silently so it doesn't break the app if tables don't exist yet
            } finally {
                setLoading(false);
            }
        };

        fetchInteractions();
    }, [user]);

    const toggleFavorite = async (toolId: string) => {
        if (!user) {
            toast({ title: 'Sign in required', description: 'Please sign in to save favorites.', variant: 'destructive' });
            return;
        }

        const isFavorited = favoriteToolIds.includes(toolId);
        
        // Optimistic UI update
        setFavoriteToolIds(prev => 
            isFavorited ? prev.filter(id => id !== toolId) : [...prev, toolId]
        );

        try {
            if (isFavorited) {
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .match({ user_id: user.id, tool_id: toolId });
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('favorites')
                    .insert({ user_id: user.id, tool_id: toolId });
                if (error) throw error;
                toast({ title: 'Added to favorites', description: 'Tool saved successfully.' });
            }
        } catch (error: any) {
            console.error('Error toggling favorite:', error);
            // Revert on error
            setFavoriteToolIds(prev => 
                isFavorited ? [...prev, toolId] : prev.filter(id => id !== toolId)
            );
            toast({ title: 'Error', description: 'Could not update favorites. Make sure you have run the database migrations.', variant: 'destructive' });
        }
    };

    const toggleUpvote = async (toolId: string) => {
        if (!user) {
            toast({ title: 'Sign in required', description: 'Please sign in to upvote tools.', variant: 'destructive' });
            return;
        }

        const isUpvoted = upvotedToolIds.includes(toolId);
        
        // Optimistic UI update
        setUpvotedToolIds(prev => 
            isUpvoted ? prev.filter(id => id !== toolId) : [...prev, toolId]
        );

        try {
            if (isUpvoted) {
                const { error } = await supabase
                    .from('upvotes')
                    .delete()
                    .match({ user_id: user.id, tool_id: toolId });
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('upvotes')
                    .insert({ user_id: user.id, tool_id: toolId });
                if (error) throw error;
            }
        } catch (error: any) {
            console.error('Error toggling upvote:', error);
            // Revert on error
            setUpvotedToolIds(prev => 
                isUpvoted ? [...prev, toolId] : prev.filter(id => id !== toolId)
            );
            toast({ title: 'Error', description: 'Could not update upvotes. Make sure you have run the database migrations.', variant: 'destructive' });
        }
    };

    return (
        <UserInteractionsContext.Provider value={{ favoriteToolIds, upvotedToolIds, toggleFavorite, toggleUpvote, loading }}>
            {children}
        </UserInteractionsContext.Provider>
    );
}

export const useUserInteractions = () => {
    const context = useContext(UserInteractionsContext);
    if (context === undefined) {
        throw new Error('useUserInteractions must be used within a UserInteractionsProvider');
    }
    return context;
};
