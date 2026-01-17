import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://allaitoollist.com';

    // Fetch all tools
    const { data: tools } = await supabase
        .from('tools')
        .select('slug, updated_at, created_at');

    // Fetch all unique categories
    const { data: categoryData } = await supabase
        .from('tools')
        .select('category');

    const categories = Array.from(new Set(categoryData?.map(t => t.category).filter(Boolean) || []));

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/categories`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/submit`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    // Tool pages
    const toolPages: MetadataRoute.Sitemap = (tools || []).map((tool) => ({
        url: `${baseUrl}/tool/${tool.slug}`,
        lastModified: tool.updated_at ? new Date(tool.updated_at) : new Date(tool.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Category pages
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
        url: `${baseUrl}/category/${encodeURIComponent(category)}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    return [...staticPages, ...categoryPages, ...toolPages];
}
