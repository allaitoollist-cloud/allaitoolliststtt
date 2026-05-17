import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ToolCard } from '@/components/ToolCard';
import { Heart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getServerUser } from '@/lib/auth-helpers';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { dbToolToTool } from '@/types';

export const dynamic = 'force-dynamic';

export default async function FavoritesPage() {
    const user = await getServerUser();
    const cookieStore = cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    let favoriteTools: any[] = [];

    if (user) {
        // Fetch favorites and join with tools
        const { data: favoritesData, error } = await supabase
            .from('favorites')
            .select(`
                tool_id,
                tools (*)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (!error && favoritesData) {
            favoriteTools = favoritesData
                .map(fav => fav.tools)
                .filter(tool => tool !== null)
                .map(dbTool => dbToolToTool(dbTool as any));
        } else if (error) {
            console.error('Error fetching favorites:', error);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative isolate overflow-hidden pt-24 pb-12">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <div className="flex justify-center mb-6">
                                <div className="bg-primary/10 p-3 rounded-2xl">
                                    <Heart className="h-10 w-10 text-primary fill-primary" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-b from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-4">
                                My Favorites
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Your personal collection of saved AI tools.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Favorites Grid */}
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {!user ? (
                         <div className="text-center py-20">
                             <div className="bg-secondary/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                 <Heart className="h-8 w-8 text-muted-foreground" />
                             </div>
                             <h3 className="text-xl font-bold mb-2">Sign in required</h3>
                             <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                                 Please sign in to view and save your favorite AI tools.
                             </p>
                             <Link href="/login?redirect=/favorites">
                                 <Button size="lg" className="bg-primary hover:bg-primary/90">
                                     Sign In
                                 </Button>
                             </Link>
                         </div>
                    ) : favoriteTools.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favoriteTools.map((tool) => (
                                <ToolCard key={tool.id} tool={tool} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="bg-secondary/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
                            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                                Start exploring and save the tools you like to build your collection.
                            </p>
                            <Link href="/categories">
                                <Button size="lg" className="bg-primary hover:bg-primary/90">
                                    <Search className="mr-2 h-4 w-4" />
                                    Browse Tools
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
