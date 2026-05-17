import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '';
const HOST = 'allaitoollist.com';

export async function GET(req: NextRequest) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!INDEXNOW_KEY) {
        return NextResponse.json({ error: 'INDEXNOW_KEY not configured' }, { status: 500 });
    }

    try {
        // Get tools published in last 24 hours not yet indexed
        const since = new Date();
        since.setHours(since.getHours() - 24);

        const { data: newTools } = await supabase
            .from('tools')
            .select('slug, created_at')
            .eq('status', 'published')
            .gte('created_at', since.toISOString())
            .limit(100);

        if (!newTools || newTools.length === 0) {
            return NextResponse.json({ message: 'No new tools to index' });
        }

        const urls = newTools.map(t => `https://${HOST}/tool/${t.slug}`);

        // Submit to Bing/IndexNow
        const body = {
            host: HOST,
            key: INDEXNOW_KEY,
            keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
            urlList: urls,
        };

        const res = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        return NextResponse.json({
            success: true,
            submitted: urls.length,
            indexnow_status: res.status,
            urls,
        });
    } catch (err) {
        console.error('IndexNow cron error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
