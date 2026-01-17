import { supabase } from '@/lib/supabase';
import UseCaseList from '@/components/admin/UseCaseList';

export const dynamic = 'force-dynamic';

export default async function UseCasesPage() {
    // 1. Fetch Use Cases
    const { data: useCases, error } = await supabase
        .from('use_cases')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching use cases:", error);
    }

    // 2. Fetch Tool Stats (Lightweight)
    const { data: tools } = await supabase
        .from('tools')
        .select('category, tags');

    // 3. Aggregate Counts
    // We assume a use case 'slug' matches either a Category string OR is present in the Tags array
    const counts: Record<string, number> = {};

    (tools || []).forEach(tool => {
        // Check Category match
        if (tool.category) {
            const catSlug = tool.category.toLowerCase().replace(/\s+/g, '-');
            counts[catSlug] = (counts[catSlug] || 0) + 1;
        }

        // Check Tags match
        if (tool.tags && Array.isArray(tool.tags)) {
            tool.tags.forEach((tag: string) => {
                const tagSlug = tag.toLowerCase().replace(/\s+/g, '-');
                counts[tagSlug] = (counts[tagSlug] || 0) + 1;
            });
        }
    });

    // 4. Merge Data
    const formattedUseCases = (useCases || []).map(uc => ({
        ...uc,
        count: counts[uc.slug] || 0
    }));

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <UseCaseList initialUseCases={formattedUseCases} />
        </div>
    );
}
