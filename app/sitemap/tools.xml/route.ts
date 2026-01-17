import { getIndexableTools } from '@/lib/seo-gatekeeper';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aitoollist.com';

    // Fetch ONLY indexable tools (Published + Quality Check)
    const tools = await getIndexableTools();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${tools.map(tool => `
    <url>
        <loc>${baseUrl}/tool/${tool.slug}</loc>
        <lastmod>${tool.last_updated && typeof tool.last_updated === 'string' ? tool.last_updated : new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`).join('')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
        },
    });
}
