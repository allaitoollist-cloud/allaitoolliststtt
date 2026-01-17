import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { dbToolToTool, Tool } from '@/types';
import CategoryClient from '@/components/CategoryClient';
import { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: {
        q?: string;
        filter?: string;
    };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const query = searchParams.q || 'Tools';
    const title = `Search Results for "${query}" - AI Tool List`;
    const description = `Find the best AI tools matching "${query}". Explore our directory of free and paid artificial intelligence software.`;

    return {
        title,
        description,
        robots: {
            index: false, // Search results shouldn't be indexed to prevent spam
            follow: true,
        }
    };
}

export default async function SearchPage({ searchParams }: PageProps) {
    const query = searchParams.q || '';
    const filter = searchParams.filter || '';

    // Fetch all tools first
    let tools: Tool[] = [];
    const { data: allDbTools, error } = await supabase
        .from('tools')
        .select('*')
        .in('status', ['published', 'approved', 'draft'])
        .neq('status', 'archived')
        .order('views', { ascending: false })
        .limit(200);

    if (error) {
        console.error('Search error:', error);
    } else {
        tools = ((allDbTools as any[]) || []).map(dbToolToTool);
    }

    // Apply search query filter
    if (query) {
        const queryLower = query.toLowerCase();
        tools = tools.filter(tool =>
            tool.name.toLowerCase().includes(queryLower) ||
            tool.shortDescription?.toLowerCase().includes(queryLower) ||
            tool.category?.toLowerCase().includes(queryLower)
        );
    }

    // Apply pricing filter
    if (filter) {
        tools = tools.filter(tool => {
            const pricing = tool.pricing?.toLowerCase() || '';
            if (filter === 'free') return pricing.includes('free') && !pricing.includes('trial');
            if (filter === 'freemium') return pricing.includes('freemium');
            if (filter === 'paid') return pricing.includes('paid');
            if (filter === 'trial') return pricing.includes('trial');
            return true;
        });
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Navbar />

            <main className="flex-grow">
                {/* Header Section */}
                <div className="pt-24 pb-12 border-b border-border bg-secondary/5">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <nav className="flex justify-center items-center text-sm text-muted-foreground mb-6">
                            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                            <span className="mx-2">/</span>
                            <span className="text-foreground">Search</span>
                        </nav>

                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
                            Search Results
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            {query || filter ? (
                                <>Found <strong>{tools.length}</strong> {filter ? `${filter} ` : ''}tools{query ? ` for "${query}"` : ''}</>
                            ) : (
                                'Enter a keyword to search or use filters'
                            )}
                        </p>
                    </div>
                </div>

                {/* Main Tool Grid */}
                <CategoryClient tools={tools} category="Search Results" />
            </main>

            <Footer />
        </div>
    );
}
