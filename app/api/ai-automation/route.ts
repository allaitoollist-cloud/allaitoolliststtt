import { NextRequest, NextResponse } from 'next/server';
import { load } from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import { getOpenAIKey } from '@/lib/openai';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
    if (!await verifyAdminRequest(request)) return unauthorizedJson();

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { urls } = await request.json();

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json({ error: 'URLs array is required' }, { status: 400 });
        }

        const openaiKey = await getOpenAIKey();
        if (!openaiKey) {
            return NextResponse.json({ error: 'OpenAI API key not configured. Go to Admin → Settings → API Keys.' }, { status: 500 });
        }

        const results = [];

        for (const url of urls) {
            if (!url?.trim()) continue;

            try {
                // 1. Scrape the URL
                const pageRes = await fetch(url, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' },
                    signal: AbortSignal.timeout(10000),
                });

                if (!pageRes.ok) throw new Error(`Failed to fetch URL: HTTP ${pageRes.status}`);

                const html = await pageRes.text();
                const $ = load(html);

                // Remove script/style noise
                $('script, style, nav, footer, header').remove();

                const pageTitle = $('title').text().trim();
                const metaDesc = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
                const bodyText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 4000);

                const context = `URL: ${url}\nTitle: ${pageTitle}\nDescription: ${metaDesc}\nContent: ${bodyText}`;

                // 2. Call OpenAI gpt-4o-mini
                const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
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
                                content: 'You are an AI directory curator. Extract structured data from AI tool websites. Respond with ONLY valid JSON — no markdown, no explanation.',
                            },
                            {
                                role: 'user',
                                content: `Analyze this AI tool website and extract data:\n\n${context}\n\nReturn JSON with these exact fields:
{
  "tool_name": "Clean product name",
  "slug": "url-friendly-slug",
  "short_description": "max 150 chars, one sentence",
  "full_description": "3-4 paragraph marketing description",
  "category": "one of: Text & Writing, Image Generation, Video & Audio, Code & Development, Productivity, Marketing, Design, Data & Analytics, Customer Support, Sales, Education, Research, Other",
  "pricing": "one of: Free, Freemium, Paid, Contact for Pricing",
  "tags": ["tag1", "tag2", "tag3"],
  "features": ["feature1", "feature2", "feature3", "feature4"],
  "platform": ["Web"]
}`,
                            },
                        ],
                        temperature: 0.3,
                        max_tokens: 1500,
                    }),
                });

                if (!gptRes.ok) {
                    const err = await gptRes.text();
                    throw new Error(`OpenAI error: ${err.slice(0, 200)}`);
                }

                const gptData = await gptRes.json();
                let rawContent = gptData.choices?.[0]?.message?.content || '';

                // Strip markdown fences
                rawContent = rawContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

                let aiData: any;
                try {
                    aiData = JSON.parse(rawContent);
                } catch {
                    throw new Error(`Could not parse AI response as JSON: ${rawContent.slice(0, 200)}`);
                }

                // Validate required fields
                if (!aiData.tool_name || !aiData.slug || !aiData.category) {
                    throw new Error('AI response missing required fields (tool_name, slug, category)');
                }

                // Ensure slug is unique
                let slug = aiData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/(^-|-$)/g, '');
                const { data: existing } = await supabase.from('tools').select('id').eq('slug', slug).single();
                if (existing) slug = `${slug}-${Date.now()}`;

                // 3. Save tool as draft
                const { data: toolData, error: toolError } = await supabase.from('tools').insert({
                    name: aiData.tool_name,
                    slug,
                    short_description: aiData.short_description || '',
                    full_description: aiData.full_description || '',
                    url: url,
                    category: aiData.category,
                    pricing: aiData.pricing || 'Freemium',
                    tags: aiData.tags || [],
                    features: aiData.features || [],
                    platform: aiData.platform || ['Web'],
                    is_draft: true,
                    verified: false,
                    status: 'draft',
                }).select().single();

                if (toolError) throw new Error(`DB insert error: ${toolError.message}`);

                results.push({ status: 'success', url, tool: aiData.tool_name, id: toolData?.id });

            } catch (error: any) {
                console.error(`Error processing ${url}:`, error.message);
                results.push({ status: 'error', url, message: error.message });
            }
        }

        const succeeded = results.filter(r => r.status === 'success').length;
        const failed = results.filter(r => r.status === 'error').length;

        return NextResponse.json({ results, summary: { succeeded, failed, total: results.length } });

    } catch (error: any) {
        console.error('AI automation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
