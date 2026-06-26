import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIKey } from '@/lib/openai';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
    if (!await verifyAdminRequest(request)) return unauthorizedJson();

    try {
        const { keywords, category, toolName, toolDescription, toolWebsite, toolCategory } = await request.json();

        const topic = toolName || keywords;
        if (!topic?.trim()) {
            return NextResponse.json({ error: 'Keywords or tool name required' }, { status: 400 });
        }

        const openaiKey = await getOpenAIKey();
        if (!openaiKey) {
            return NextResponse.json({ error: 'OpenAI API key not configured. Go to Admin → Settings to add it.' }, { status: 500 });
        }

        let prompt: string;

        if (toolName) {
            prompt = `Write a comprehensive, SEO-optimized blog post reviewing the AI tool: "${toolName}".
${toolDescription ? `Tool description: ${toolDescription}` : ''}
${toolWebsite ? `Website: ${toolWebsite}` : ''}
${toolCategory ? `Category: ${toolCategory}` : ''}

Requirements:
- Exactly 1200-1500 words
- Compelling title like "${toolName} Review [${new Date().getFullYear()}]: Features, Pros, Cons & Is It Worth It?"
- Engaging intro explaining what the tool is and who it is for (150 words)
- Sections:
  ## What Is ${toolName}?
  ## Key Features
  ## How to Use ${toolName}
  ## Pros and Cons
  ## Pricing
  ## Best Use Cases
  ## Alternatives
  ## Final Verdict
- Honest and practical, real examples
- Keywords: "${toolName} review", "${toolName} features", "best AI ${toolCategory || 'tool'}"
- End with a CTA to try the tool

Respond with ONLY valid JSON (no markdown wrapper):
{
  "title": "...",
  "excerpt": "2-3 sentence summary",
  "content": "full markdown blog post",
  "meta_title": "SEO title 50-60 chars",
  "meta_description": "SEO description 150-160 chars",
  "meta_keywords": "comma-separated keywords"
}`;
        } else {
            prompt = `Write a comprehensive, SEO-optimized blog post about AI tools for: "${topic}"${category ? ` (category: ${category})` : ''}.

You are writing for allaitoollist.com — an AI tools directory. Audience: people discovering AI tools.

Requirements:
- Exactly 1200-1500 words
- Compelling title including "AI Tools" or "Best AI" (60-70 chars)
- Engaging intro (150 words)
- 5-6 sections with ## headings covering: best tools, key features, how they work, use cases, tips, conclusion
- Mention specific known AI tools where relevant
- Strong conclusion with CTA

Respond with ONLY valid JSON (no markdown wrapper):
{
  "title": "...",
  "excerpt": "2-3 sentence summary",
  "content": "full markdown blog post",
  "meta_title": "SEO title 50-60 chars",
  "meta_description": "SEO description 150-160 chars",
  "meta_keywords": "comma-separated keywords"
}`;
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are an expert AI tools reviewer and SEO blog writer. Always respond with valid JSON only.' },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 3500,
            }),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => response.text());
            const errMsg = typeof err === 'object' ? (err as any)?.error?.message || JSON.stringify(err) : err;
            return NextResponse.json({ error: `OpenAI API error: ${errMsg}` }, { status: 500 });
        }

        const data = await response.json();
        let rawContent = data.choices?.[0]?.message?.content || '';
        rawContent = rawContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

        let blogData: any;
        try {
            blogData = JSON.parse(rawContent);
        } catch {
            return NextResponse.json({ error: 'Failed to parse AI response', raw: rawContent.slice(0, 300) }, { status: 500 });
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
                category: toolCategory || category || 'AI Tools',
                is_published: false,
            },
        });

    } catch (error: any) {
        console.error('Blog generation error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
