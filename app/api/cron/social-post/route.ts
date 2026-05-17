import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch newest tool added in the last 24 hours
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: tools, error } = await supabase
            .from('tools')
            .select('name, slug, short_description, category, pricing')
            .eq('is_draft', false)
            .gte('created_at', since)
            .order('created_at', { ascending: false })
            .limit(3);

        if (error) throw error;
        if (!tools || tools.length === 0) {
            return NextResponse.json({ message: 'No new tools to post today' });
        }

        const posted: string[] = [];

        for (const tool of tools) {
            const toolUrl = `https://allaitoollist.com/tool/${tool.slug}`;
            const tweet = buildTweet(tool, toolUrl);

            // Post to X (Twitter) if credentials configured
            if (process.env.TWITTER_BEARER_TOKEN && process.env.TWITTER_API_KEY) {
                await postToTwitter(tweet);
                posted.push(`twitter:${tool.slug}`);
            }
        }

        return NextResponse.json({ success: true, posted, tools: tools.map(t => t.slug) });
    } catch (err: any) {
        console.error('Social post cron error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

function buildTweet(tool: { name: string; short_description: string; category: string; pricing: string }, url: string): string {
    const pricing = tool.pricing === 'Free' ? '🆓 Free' : tool.pricing === 'Freemium' ? '🆓 Freemium' : `💰 ${tool.pricing}`;
    return `🤖 New AI Tool: ${tool.name}\n\n${tool.short_description}\n\n📂 ${tool.category} | ${pricing}\n\n👉 ${url}\n\n#AI #AITools #ArtificialIntelligence`;
}

async function postToTwitter(text: string): Promise<void> {
    const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
        body: JSON.stringify({ text }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Twitter API error: ${err}`);
    }
}
