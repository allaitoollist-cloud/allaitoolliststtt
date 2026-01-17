import { supabase } from '@/lib/supabase';
import ComparisonList from '@/components/admin/ComparisonList';

export const dynamic = 'force-dynamic';

export default async function ComparisonsPage() {
    // 1. Fetch Comparisons (Try to verify if table exists by simple query)
    // We fetch raw first
    let comparisons: any[] = [];
    try {
        const { data, error } = await supabase
            .from('comparisons')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) comparisons = data;
    } catch (e) {
        console.warn('Comparisons table missing or error');
    }

    // 2. Fetch All Tools (for dropdowns and name mapping)
    // Optimized select
    const { data: tools } = await supabase
        .from('tools')
        .select('id, name, slug')
        .order('name');

    // 3. Map Tool Names to Comparisons (Client-side join equivalent)
    // Avoids complex PostgREST embedding for multiple FKs to same table
    const toolsMap = new Map((tools || []).map(t => [t.id, t]));

    const enrichedComparisons = comparisons.map(comp => ({
        ...comp,
        tool_a: toolsMap.get(comp.tool_a_id) ? { name: toolsMap.get(comp.tool_a_id)?.name } : { name: 'Unknown' },
        tool_b: toolsMap.get(comp.tool_b_id) ? { name: toolsMap.get(comp.tool_b_id)?.name } : { name: 'Unknown' },
    }));

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <ComparisonList
                initialComparisons={enrichedComparisons}
                tools={tools || []}
            />
        </div>
    );
}
