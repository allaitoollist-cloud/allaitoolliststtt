import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

function generateSitemapXML(baseUrl: string, staticRoutes: string[], categoryRoutes: string[], toolRoutes: string[]) {
    const staticRoutesXml = staticRoutes.map((route) => {
        const priority = route === '' ? '1.0' : '0.8';
        return `    <url>
      <loc>${baseUrl}${route}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>${priority}</priority>
    </url>`;
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutesXml.join('\n')}
${categoryRoutes.join('\n')}
${toolRoutes.join('\n')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
        },
    });
}

export async function GET() {
    const baseUrl = 'https://aitoollist.com';

    // Static routes
    const staticRoutes = [
        '',
        '/categories',
        '/submit',
        '/trending',
        '/top-10',
    ];

    let toolRoutes: string[] = [];
    let categoryRoutes: string[] = [];

    // Try to connect to Supabase, but don't fail if it's not available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase environment variables not available, returning static sitemap only');
        return generateSitemapXML(baseUrl, staticRoutes, [], []);
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data: tools, error } = await supabase
            .from('tools')
            .select('slug, category, last_updated');

        if (!error && tools) {
            // Tool routes
            toolRoutes = tools.map((tool) =>
                `    <url>
      <loc>${baseUrl}/tool/${tool.slug}</loc>
      <lastmod>${tool.last_updated || new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.6</priority>
    </url>`
            );

            // Category routes
            const categories = Array.from(new Set(tools.map((tool) => tool.category).filter(Boolean)));
            categoryRoutes = categories.map((category) =>
                `    <url>
      <loc>${baseUrl}/category/${category}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
    </url>`
            );
        }
    } catch (error) {
        console.error('Error fetching tools for sitemap:', error);
        // Continue with static routes only
    }

    return generateSitemapXML(baseUrl, staticRoutes, categoryRoutes, toolRoutes);
}
