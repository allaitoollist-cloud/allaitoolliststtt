import { redirect } from 'next/navigation';

// Maps TrendingCategories slugs → DB category names used by /category/[slug]
const SLUG_MAP: Record<string, string> = {
    'video':      'Video',
    'image':      'Image',
    'chatbots':   'Chat',
    'ai-agents':  'Agent',
    'marketing':  'Marketing',
    'code':       'Code',
    'seo':        'SEO',
    'automation': 'Automation',
};

export default function CategorySlugRedirect({ params }: { params: { slug: string } }) {
    const category = SLUG_MAP[params.slug] ?? params.slug;
    redirect(`/category/${encodeURIComponent(category)}`);
}
