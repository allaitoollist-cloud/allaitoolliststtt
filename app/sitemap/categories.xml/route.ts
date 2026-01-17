import { getIndexableCategories } from '@/lib/seo-gatekeeper';
import { supabase } from '@/lib/supabase';
import { DatabaseTool } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aitoollist.com';

    // Fetch all published tools to determine active categories
    // We must pass DatabaseTools to the helper
    const { data: allTools } = await supabase
        .from('tools')
        .select('*')
        .eq('status', 'published');

    // Get categories that have at least 1 published tool
    const categories = await getIndexableCategories((allTools || []) as unknown as DatabaseTool[]);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${categories.map(catSlug => `
    <url>
        <loc>${baseUrl}/category/${catSlug.toLowerCase()}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>`).join('')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
        },
    });
}
