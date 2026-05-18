import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { keywords, category } = await request.json();

        if (!keywords?.trim()) {
            return NextResponse.json({ error: 'Keywords are required' }, { status: 400 });
        }

        const openaiKey = process.env.OPENAI_API_KEY;
        if (!openaiKey) {
            return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 });
        }

        const prompt = `Write a comprehensive, SEO-optimized blog post about: "${keywords}"${category ? ` (category: ${category})` : ''}.

Requirements:
- Exactly 1200-1500 words
- Compelling SEO-friendly title (60-70 chars)
- Engaging intro (150 words)
- 5-6 main sections with ## headings and ### subheadings
- Practical tips, examples, use cases
- Strong conclusion
- Natural keyword usage throughout

Respond with ONLY valid JSON (no markdown wrapper):
{
  "title": "...",
  "excerpt": "2-3 sentence summary (160-200 chars)",
  "content": "full markdown blog post",
  "meta_title": "SEO title (50-60 chars)",
  "meta_description": "SEO description (150-160 chars)",
  "meta_keywords": "comma-separated keywords"
}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are an expert SEO blog writer for an AI tools directory. Always respond with valid JSON only.' },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 3000,
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('OpenAI error:', err);
            return NextResponse.json({ error: 'OpenAI API error', details: err }, { status: 500 });
        }

        const data = await response.json();
        let rawContent = data.choices?.[0]?.message?.content || '';

        // Strip markdown code fences if present
        rawContent = rawContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

        let blogData: any;
        try {
            blogData = JSON.parse(rawContent);
        } catch {
            return NextResponse.json({ error: 'Failed to parse AI response as JSON', raw: rawContent.slice(0, 300) }, { status: 500 });
        }

        if (!blogData.title || !blogData.content) {
            return NextResponse.json({ error: 'AI response missing required fields' }, { status: 500 });
        }

        const slug = blogData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        return NextResponse.json({
            success: true,
            blog: {
                ...blogData,
                slug,
                category: category || '',
                is_published: false,
            },
        });

    } catch (error: any) {
        console.error('Blog generation error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
