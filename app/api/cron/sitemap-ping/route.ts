import { NextRequest, NextResponse } from 'next/server';

const SITEMAP_URL = 'https://allaitoollist.com/sitemap.xml';

const PING_URLS = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
];

export async function GET(req: NextRequest) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results: { url: string; status: number | string }[] = [];

    for (const pingUrl of PING_URLS) {
        try {
            const res = await fetch(pingUrl, { method: 'GET' });
            results.push({ url: pingUrl, status: res.status });
        } catch (err) {
            results.push({ url: pingUrl, status: 'error' });
        }
    }

    return NextResponse.json({ success: true, pinged: results, sitemap: SITEMAP_URL });
}
