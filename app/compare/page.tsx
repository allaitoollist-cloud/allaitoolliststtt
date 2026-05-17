import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { CompareClient } from './CompareClient';

export const metadata: Metadata = {
    title: 'Compare AI Tools | All AI Tool List',
    description: 'Compare AI tools side by side — features, pricing, ratings and more.',
};

export const dynamic = 'force-dynamic';

export default async function ComparePage() {
    const { data: tools } = await supabase
        .from('tools')
        .select('id, name, slug, short_description, category, pricing, platform, tags, verified, rating')
        .eq('is_draft', false)
        .order('name')
        .limit(200);

    return <CompareClient tools={tools || []} />;
}
