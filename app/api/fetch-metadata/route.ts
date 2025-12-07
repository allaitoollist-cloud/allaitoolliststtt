import { NextRequest, NextResponse } from 'next/server';
import { load } from 'cheerio';

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Validate URL
        try {
            new URL(url);
        } catch {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch URL' }, { status: response.status });
        }

        const html = await response.text();
        const $ = load(html);

        // Extract metadata
        const title = $('meta[property="og:title"]').attr('content') ||
            $('meta[name="twitter:title"]').attr('content') ||
            $('title').text() || '';

        const description = $('meta[property="og:description"]').attr('content') ||
            $('meta[name="twitter:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') || '';

        const image = $('meta[property="og:image"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content') || '';

        const icon = $('link[rel="icon"]').attr('href') ||
            $('link[rel="shortcut icon"]').attr('href') || '';

        // Handle relative URLs for icon/image
        const resolveUrl = (path: string) => {
            if (!path) return '';
            try {
                return new URL(path, url).href;
            } catch {
                return path;
            }
        };

        return NextResponse.json({
            title: title.trim(),
            description: description.trim(),
            image: resolveUrl(image),
            icon: resolveUrl(icon),
        });

    } catch (error: any) {
        console.error('Metadata fetch error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch metadata' }, { status: 500 });
    }
}
