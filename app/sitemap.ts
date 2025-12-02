import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

// Revalidate every hour
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://aitoollist.com'; // Replace with your actual domain

    // Static routes
    const routes = [
        '',
        '/categories',
        '/submit',
        '/trending',
        '/top-10',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Try to fetch tools, but don't fail if it doesn't work
    try {
        const { data: tools, error } = await supabase
            .from('tools')
            .select('slug, category, last_updated');

        if (error) {
            console.error('Error fetching tools for sitemap:', error);
            return routes;
        }

        // Tool routes
        const toolRoutes = (tools || []).map((tool) => ({
            url: `${baseUrl}/tool/${tool.slug}`,
            lastModified: tool.last_updated || new Date().toISOString(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));

        // Category routes
        const categories = Array.from(new Set((tools || []).map((tool) => tool.category).filter(Boolean)));
        const categoryRoutes = categories.map((category) => ({
            url: `${baseUrl}/category/${category}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily' as const,
            priority: 0.7,
        }));

        return [...routes, ...categoryRoutes, ...toolRoutes];
    } catch (error) {
        console.error('Error generating sitemap:', error);
        // Return just the static routes if database fetch fails
        return routes;
    }
}
