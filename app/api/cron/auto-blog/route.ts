import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BLOG_TOPICS = [
    'Top 5 New AI Tools This Week',
    'Best Free AI Tools for Beginners',
    'AI Tools for Content Creators',
    'AI Productivity Tools Compared',
    'New AI Image Tools Reviewed',
];

function generateBlogHTML(topic: string, tools: any[]): string {
    const toolList = tools.slice(0, 5).map((t, i) =>
        `<h3>${i + 1}. ${t.name}</h3>
<p><strong>Category:</strong> ${t.category} | <strong>Pricing:</strong> ${t.pricing}</p>
<p>${t.short_description || t.name + ' is a powerful AI tool for ' + t.category + ' tasks.'}</p>
<p><a href="https://allaitoollist.com/tool/${t.slug}">Learn more about ${t.name} →</a></p>`
    ).join('\n\n');

    return `<article>
<h1>${topic}</h1>
<p>The AI tools landscape keeps evolving. Here are the standout tools worth knowing about right now.</p>
${toolList}
<h2>Conclusion</h2>
<p>These AI tools represent the cutting edge of what's available. Explore them on <a href="https://allaitoollist.com">All AI Tool List</a> and find the perfect tool for your workflow.</p>
</article>`;
}

function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function GET(req: NextRequest) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Get recent tools added in last 7 days
        const since = new Date();
        since.setDate(since.getDate() - 7);

        const { data: recentTools } = await supabase
            .from('tools')
            .select('id, name, slug, category, pricing, short_description')
            .eq('status', 'published')
            .gte('created_at', since.toISOString())
            .order('created_at', { ascending: false })
            .limit(10);

        const tools = recentTools && recentTools.length >= 3 ? recentTools : [];

        if (tools.length < 3) {
            return NextResponse.json({ message: 'Not enough new tools for a blog post this week' });
        }

        const topic = BLOG_TOPICS[Math.floor(Math.random() * BLOG_TOPICS.length)];
        const htmlContent = generateBlogHTML(topic, tools);
        const slug = slugify(topic) + '-' + Date.now();

        const { error } = await supabase.from('blogs').insert([{
            title: topic,
            slug,
            content: htmlContent,
            excerpt: `Discover ${tools.length} standout AI tools — reviewed and curated by All AI Tool List.`,
            status: 'draft',
            category: 'AI Tools',
            tags: ['AI tools', 'weekly roundup', 'automation'],
            created_at: new Date().toISOString(),
            author: 'All AI Tool List',
            meta_title: topic + ' | All AI Tool List',
            meta_description: `Discover ${tools.length} standout AI tools — reviewed and curated by All AI Tool List.`,
        }]);

        if (error) throw error;

        return NextResponse.json({ success: true, title: topic, slug, tools_count: tools.length });
    } catch (err) {
        console.error('Auto-blog cron error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
