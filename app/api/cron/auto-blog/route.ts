import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getOpenAIKey } from '@/lib/openai';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BLOG_TOPICS = [
    'Top New AI Tools This Week',
    'Best Free AI Tools for Beginners',
    'AI Tools for Content Creators',
    'AI Productivity Tools Roundup',
    'New AI Image & Design Tools',
    'AI Tools for Developers & Coders',
    'AI Marketing Tools Worth Trying',
    'AI Writing Assistants Compared',
];

function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function generateBlogWithAI(topic: string, tools: any[]): Promise<{ title: string; content: string; excerpt: string; meta_description: string } | null> {
    const openaiKey = await getOpenAIKey();
    if (!openaiKey) return null;

    const toolSummaries = tools.slice(0, 5).map((t, i) =>
        `${i + 1}. ${t.name} (${t.category}, ${t.pricing}) — ${t.short_description || 'Powerful AI tool'} — https://allaitoollist.com/tool/${t.slug}`
    ).join('\n');

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You write engaging blog posts for an AI tools directory. Write in a friendly, informative tone. Include real tool links. Respond with ONLY valid JSON.',
                },
                {
                    role: 'user',
                    content: `Write a blog post titled "${topic}" featuring these AI tools:\n\n${toolSummaries}\n\nReturn JSON:
{
  "title": "engaging title (max 70 chars)",
  "excerpt": "2-3 sentence hook (max 200 chars)",
  "content": "700-900 word blog post in HTML format with <h2>, <h3>, <p>, <ul>, <li> tags. Include tool links. End with a call to action to visit allaitoollist.com",
  "meta_description": "SEO meta description (150-160 chars)"
}`,
                },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    let raw = data.choices?.[0]?.message?.content || '';
    raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function generateFallbackHTML(topic: string, tools: any[]): string {
    const toolList = tools.slice(0, 5).map((t, i) =>
        `<h3>${i + 1}. ${t.name}</h3>
<p><strong>Category:</strong> ${t.category} &nbsp;|&nbsp; <strong>Pricing:</strong> ${t.pricing}</p>
<p>${t.short_description || `${t.name} is a powerful AI tool for ${t.category} tasks.`}</p>
<p><a href="https://allaitoollist.com/tool/${t.slug}">View ${t.name} on All AI Tool List →</a></p>`
    ).join('\n\n');

    return `<article>
<h1>${topic}</h1>
<p>The AI tools landscape keeps evolving. Here are the standout tools worth knowing about right now.</p>
${toolList}
<h2>Conclusion</h2>
<p>These AI tools represent the cutting edge of what's available. <a href="https://allaitoollist.com">Explore All AI Tool List</a> to find the perfect tool for your workflow.</p>
</article>`;
}

export async function GET(req: NextRequest) {
    if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const since = new Date();
        since.setDate(since.getDate() - 7);

        const { data: recentTools } = await supabase
            .from('tools')
            .select('id, name, slug, category, pricing, short_description')
            .not('is_draft', 'eq', true)
            .gte('created_at', since.toISOString())
            .order('created_at', { ascending: false })
            .limit(10);

        if (!recentTools || recentTools.length < 3) {
            return NextResponse.json({ message: 'Not enough new tools this week for a blog post' });
        }

        const topic = BLOG_TOPICS[Math.floor(Math.random() * BLOG_TOPICS.length)];

        // Try AI generation first, fall back to template
        const aiResult = await generateBlogWithAI(topic, recentTools);

        const title = aiResult?.title || topic;
        const content = aiResult?.content || generateFallbackHTML(topic, recentTools);
        const excerpt = aiResult?.excerpt || `Discover ${recentTools.length} standout AI tools — reviewed and curated by All AI Tool List.`;
        const metaDesc = aiResult?.meta_description || `${recentTools.length} new AI tools reviewed: ${recentTools.slice(0, 3).map(t => t.name).join(', ')} and more.`;
        const slug = slugify(title) + '-' + Date.now();

        const { error } = await supabase.from('blogs').insert([{
            title,
            slug,
            content,
            excerpt,
            status: 'published',
            category: 'AI Tools',
            tags: ['AI tools', 'weekly roundup', 'automation'],
            author: 'All AI Tool List',
            meta_title: title.substring(0, 60) + ' | All AI Tool List',
            meta_description: metaDesc,
            created_at: new Date().toISOString(),
            published_at: new Date().toISOString(),
        }]);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            title,
            slug,
            tools_count: recentTools.length,
            ai_generated: !!aiResult,
        });

    } catch (err: any) {
        console.error('Auto-blog cron error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
