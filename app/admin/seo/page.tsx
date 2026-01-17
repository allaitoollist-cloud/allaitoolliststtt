import { supabase } from '@/lib/supabase';
import { categories } from '@/types';
import SeoDashboard from '@/components/admin/SeoDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminSeoPage() {
    // 1. Fetch Tools
    const { data: tools } = await supabase
        .from('tools')
        .select('id, name, slug, status, seo_noindex');

    // 2. Fetch Use Cases (Check if table exists handled by graceful fail/empty or migration assumed run)
    // We try/catch just in case migration hasn't run yet to prevent page crash
    let useCases: any[] = [];
    try {
        const { data } = await supabase.from('use_cases').select('id, name, slug, status, seo_noindex');
        if (data) useCases = data;
    } catch (e) {
        console.warn('Use Cases table not found or accessible');
    }

    // 3. Process Categories (Static + Dynamic Check)
    // We need to count tools per category to find empty ones
    const toolCounts: Record<string, number> = {};
    (tools || []).forEach(t => {
        // We assume category is stored in 'category' field. If strict types needed, we'd select 'category' in query above.
        // Let's re-fetch to be safe or update query.
        // Re-fetching full tools just for this is heavy, let's optimize:
    });

    // Optimized Fetch for Counts
    const { data: toolCats } = await supabase.from('tools').select('category, status');

    (toolCats || []).forEach(t => {
        if (t.status === 'published' && t.category) { // Only count PUBLISHED tools
            toolCounts[t.category] = (toolCounts[t.category] || 0) + 1;
        }
    });

    // 4. Normalize Data for Dashboard
    const seoItems: any[] = [];

    // A. Tools
    (tools || []).forEach(t => {
        const item: any = {
            id: t.id,
            name: t.name,
            slug: t.slug,
            status: t.status,
            type: 'tool',
            seo_noindex: t.seo_noindex,
            warnings: []
        };
        if (t.status === 'draft') item.warnings.push('Draft Status');
        seoItems.push(item);
    });

    // B. Use Cases
    useCases.forEach(u => {
        const item: any = {
            id: u.id,
            name: u.name,
            slug: u.slug,
            status: u.status,
            type: 'use-case',
            seo_noindex: u.seo_noindex,
            warnings: []
        };
        seoItems.push(item);
    });

    // C. Categories
    categories.forEach((cat, idx) => {
        const count = toolCounts[cat] || 0;
        const status = count > 0 ? 'published' : 'empty'; // "empty" acts as draft/hidden
        const item: any = {
            id: `cat-${idx}`,
            name: cat,
            slug: cat.toLowerCase().replace(/\s+/g, '-'),
            status: status === 'published' ? 'published' : 'draft',
            type: 'category',
            seo_noindex: status !== 'published', // Empty = Noindex
            warnings: []
        };

        if (count === 0) item.warnings.push('Empty Content (Soft 404 Risk)');
        else if (count < 3) item.warnings.push('Thin Content (<3 Tools)');

        seoItems.push(item);
    });


    return (
        <div className="p-8 max-w-7xl mx-auto text-foreground">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">SEO Control Panel</h1>
                <p className="text-muted-foreground mt-2">
                    Manage indexing permissions and monitor content health.
                </p>
            </div>

            <SeoDashboard initialItems={seoItems} />
        </div>
    );
}
