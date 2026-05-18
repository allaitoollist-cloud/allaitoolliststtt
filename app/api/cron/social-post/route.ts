import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function buildTweet(tool: { name: string; short_description: string; category: string; pricing: string }, url: string): string {
    const pricing = tool.pricing === 'Free' ? '🆓 Free' : tool.pricing === 'Freemium' ? '✨ Freemium' : `💰 ${tool.pricing}`;
    const desc = tool.short_description?.length > 100 ? tool.short_description.substring(0, 97) + '...' : tool.short_description;
    return `🤖 New AI Tool: ${tool.name}\n\n${desc}\n\n📂 ${tool.category} | ${pricing}\n\n👉 ${url}\n\n#AI #AITools #ArtificialIntelligence`;
}

// OAuth 1.0a signature for Twitter v2 posting
function oauthSign(method: string, url: string, params: Record<string, string>, consumerKey: string, consumerSecret: string, token: string, tokenSecret: string): string {
    const nonce = crypto.randomBytes(16).toString('hex');
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const oauthParams: Record<string, string> = {
        oauth_consumer_key: consumerKey,
        oauth_nonce: nonce,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: timestamp,
        oauth_token: token,
        oauth_version: '1.0',
        ...params,
    };

    const sortedParams = Object.keys(oauthParams)
        .sort()
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams[k])}`)
        .join('&');

    const baseString = [method.toUpperCase(), encodeURIComponent(url), encodeURIComponent(sortedParams)].join('&');
    const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
    const signature = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');

    const headerParams = {
        oauth_consumer_key: consumerKey,
        oauth_nonce: nonce,
        oauth_signature: signature,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: timestamp,
        oauth_token: token,
        oauth_version: '1.0',
    };

    return 'OAuth ' + Object.keys(headerParams)
        .map(k => `${encodeURIComponent(k)}="${encodeURIComponent((headerParams as any)[k])}"`)
        .join(', ');
}

async function postToTwitter(text: string): Promise<{ ok: boolean; error?: string }> {
    const consumerKey = process.env.TWITTER_API_KEY;
    const consumerSecret = process.env.TWITTER_API_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

    if (!consumerKey || !consumerSecret || !accessToken || !accessTokenSecret) {
        return { ok: false, error: 'Twitter credentials not fully configured (need API_KEY, API_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET)' };
    }

    const tweetUrl = 'https://api.twitter.com/2/tweets';
    const body = JSON.stringify({ text });

    const authHeader = oauthSign('POST', tweetUrl, {}, consumerKey, consumerSecret, accessToken, accessTokenSecret);

    const response = await fetch(tweetUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
        },
        body,
    });

    if (!response.ok) {
        const err = await response.text();
        return { ok: false, error: `Twitter API ${response.status}: ${err.slice(0, 300)}` };
    }

    return { ok: true };
}

export async function GET(req: NextRequest) {
    if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if Twitter is configured
    const twitterConfigured = !!(
        process.env.TWITTER_API_KEY &&
        process.env.TWITTER_API_SECRET &&
        process.env.TWITTER_ACCESS_TOKEN &&
        process.env.TWITTER_ACCESS_TOKEN_SECRET
    );

    if (!twitterConfigured) {
        return NextResponse.json({
            message: 'Twitter credentials not configured — skipping social post',
            required_env: ['TWITTER_API_KEY', 'TWITTER_API_SECRET', 'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_TOKEN_SECRET'],
        });
    }

    try {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: tools, error } = await supabase
            .from('tools')
            .select('name, slug, short_description, category, pricing')
            .not('is_draft', 'eq', true)
            .gte('created_at', since)
            .order('created_at', { ascending: false })
            .limit(3);

        if (error) throw error;
        if (!tools || tools.length === 0) {
            return NextResponse.json({ message: 'No new tools to post today' });
        }

        const posted: string[] = [];
        const failed: string[] = [];

        for (const tool of tools) {
            const toolUrl = `https://allaitoollist.com/tool/${tool.slug}`;
            const tweet = buildTweet(tool, toolUrl);
            const result = await postToTwitter(tweet);

            if (result.ok) {
                posted.push(tool.slug);
            } else {
                console.error(`Failed to post ${tool.slug}:`, result.error);
                failed.push(tool.slug);
            }

            // Rate limit: wait 2s between tweets
            if (tools.indexOf(tool) < tools.length - 1) {
                await new Promise(r => setTimeout(r, 2000));
            }
        }

        return NextResponse.json({
            success: true,
            posted,
            failed,
            total: tools.length,
        });

    } catch (err: any) {
        console.error('Social post cron error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
