import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import CategoriesClient from './CategoriesClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Browse AI Tools by Category | All AI List',
    description: 'Explore 5,000+ verified AI tools organized by category. Find the best AI tools for writing, image generation, coding, marketing, video, audio, and more.',
};

export default async function CategoriesPage() {
    const { data: tools } = await supabase
        .from('tools')
        .select('category');

    // Build category counts from real data
    const categoryCounts: Record<string, number> = {};
    tools?.forEach(tool => {
        const cat = tool.category;
        if (cat && cat.trim()) {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }
    });

    const categories = Object.keys(categoryCounts)
        .sort((a, b) => categoryCounts[b] - categoryCounts[a])
        .map(name => ({ name, count: categoryCounts[name] }));

    const totalTools = tools?.length ?? 0;

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow">
                <CategoriesClient categories={categories} totalTools={totalTools} />
            </main>
            <Footer />
        </div>
    );
}
