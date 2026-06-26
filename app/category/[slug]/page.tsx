import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { dbToolToTool } from '@/types';
import CategoryClient from '@/components/CategoryClient';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        slug: string;
    };
}

import { formatCategoryName } from '@/lib/category-utils';

// Generate dynamic metadata for each category page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const decodedCategory = decodeURIComponent(params.slug);
    const displayCategory = formatCategoryName(decodedCategory);

    const { data: dbTools } = await supabase
        .from('tools')
        .select('*')
        .eq('category', decodedCategory);

    const toolCount = dbTools?.length || 0;

    return {
        title: `${displayCategory} AI Tools - ${toolCount}+ Best ${displayCategory} Tools | All AI Tool List`,
        description: `Discover ${toolCount}+ best ${displayCategory} AI tools. Compare features, pricing, and reviews. Find the perfect ${displayCategory} tool for your needs. Updated daily.`,
        keywords: [
            `${displayCategory} AI tools`,
            `best ${displayCategory} tools`,
            `${displayCategory} software`,
            `AI ${displayCategory}`,
            `${displayCategory} tools comparison`,
        ],
        openGraph: {
            title: `${displayCategory} AI Tools - ${toolCount}+ Best Tools`,
            description: `Discover and compare ${toolCount}+ ${displayCategory} AI tools. Find the perfect tool for your needs.`,
            url: `https://allaitoollist.com/category/${encodeURIComponent(decodedCategory)}`,
            siteName: 'All AI Tool List',
            type: 'website',
            locale: 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${displayCategory} AI Tools - ${toolCount}+ Best Tools`,
            description: `Discover and compare ${toolCount}+ ${displayCategory} AI tools.`,
        },
        alternates: {
            canonical: `https://allaitoollist.com/category/${encodeURIComponent(decodedCategory)}`,
        },
    };
}



export default async function CategoryPage({ params }: PageProps) {
    // Decode the slug to handle spaces, special characters, and URL encoding
    let decodedCategory = decodeURIComponent(params.slug);

    // Fetch tools for this category (exact match first)
    let { data: dbTools, error } = await supabase
        .from('tools')
        .select('*')
        .eq('category', decodedCategory)
        .order('views', { ascending: false });

    if (error) {
        console.error('Error fetching tools:', error);
    }

    // If no exact match, try a case-insensitive / hyphen-normalised fallback
    if (!dbTools || dbTools.length === 0) {
        const { data: allCategoryRows } = await supabase
            .from('tools')
            .select('category');

        const uniqueCategories = Array.from(
            new Set(allCategoryRows?.map(t => t.category).filter(Boolean) || [])
        ) as string[];

        // Normalise: lowercase + replace hyphens/underscores with spaces
        const normalize = (s: string) => s.toLowerCase().replace(/[-_]/g, ' ').trim();
        const normalizedInput = normalize(decodedCategory);

        const matched = uniqueCategories.find(
            cat => normalize(cat) === normalizedInput
        );

        if (!matched) {
            notFound();
        }

        // Re-fetch with the correct casing
        decodedCategory = matched!;
        const refetch = await supabase
            .from('tools')
            .select('*')
            .eq('category', matched)
            .order('views', { ascending: false });
        dbTools = refetch.data;
    }

    const displayCategory = formatCategoryName(decodedCategory);

    const tools = (dbTools || []).map(dbToolToTool);

    // JSON-LD Schema for category page
    const categorySchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${displayCategory} AI Tools`,
        description: `Collection of ${tools.length} ${displayCategory} AI tools`,
        url: `https://allaitoollist.com/category/${encodeURIComponent(decodedCategory)}`,
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: tools.length,
            itemListElement: tools.slice(0, 10).map((tool, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'SoftwareApplication',
                    name: tool.name,
                    description: tool.shortDescription,
                    applicationCategory: tool.category,
                    url: `https://allaitoollist.com/tool/${tool.slug}`,
                },
            })),
        },
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
            />

            <Navbar />
            <main className="flex-grow">
                <CategoryClient category={displayCategory} tools={tools} />
            </main>
            <Footer />
        </div>
    );
}
