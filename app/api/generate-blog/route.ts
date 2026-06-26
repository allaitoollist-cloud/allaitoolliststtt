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

        const year = new Date().getFullYear();

        const systemPrompt = `You are an expert AI tools content strategist writing for allaitoollist.com.
You specialize in:
- AEO (Answer Engine Optimization): structure content so ChatGPT, Perplexity, Gemini cite it directly
- GEO (Generative Engine Optimization): clear facts, definitions, statistics for AI synthesis
- NLP Semantic SEO: LSI keywords, topical depth, semantic co-occurrence
- Entity SEO: proper named entities (tools, companies, people, concepts)
- Traditional SEO: E-E-A-T, keyword density, internal linking intent

ALWAYS respond with valid JSON only. No markdown wrapper.`;

        let prompt: string;

        if (toolName) {
            prompt = `Write an expert, comprehensive review of the AI tool: "${toolName}"
${toolDescription ? `Description: ${toolDescription}` : ''}
${toolWebsite ? `Website: ${toolWebsite}` : ''}
${toolCategory ? `Category: ${toolCategory}` : ''}

CONTENT STRUCTURE (follow exactly):
---
# ${toolName} Review [${year}]: Features, Pricing, Pros & Cons

Brief 2-sentence hook answering: "What is ${toolName} and who is it for?"

## What Is ${toolName}?
(Clear entity definition — GEO: state the tool, its parent company if known, its core function in 1 sentence. NLP: use exact product name + category.)

## Key Features of ${toolName}
(6-8 features as bullet points with brief explanations. Use semantic variations: "capabilities", "functionalities".)

## How to Use ${toolName}: Step-by-Step
(Numbered steps, beginner-friendly. AEO: answer "how to use [tool]" directly.)

## ${toolName} Pricing
(Free tier, paid plans, pricing table if possible. AEO: answer "how much does ${toolName} cost")

## Pros and Cons
### ✅ Pros
- (list 5)
### ❌ Cons
- (list 3)

## Who Should Use ${toolName}?
(3 specific user personas: freelancers, enterprise, developers, etc.)

## ${toolName} vs Alternatives
(Compare to 2-3 competitors. Entity SEO: name actual competitors.)

## Real Use Cases
(3 specific scenarios with tangible outcomes.)

## Final Verdict
(1-2 paragraphs. GEO: start with a direct declarative statement. AEO: answer "is ${toolName} worth it?")

---
**[CTA]** At the end, add: "👉 Explore more tools like ${toolName} on [All AI Tool List](https://allaitoollist.com) — your free directory of 1000+ AI tools."

REQUIREMENTS:
- 1400-1800 words
- Include entities: tool name, category, competitors, use cases, company name if known
- Use semantic keywords: ${toolCategory || 'AI'} tools, AI software, machine learning, automation, productivity
- Natural keyword density for "${toolName} review" (1-2%)
- Reading level: Grade 8-10 (clear, professional)

Also generate:
- 5 FAQ Q&As targeting AEO (direct questions people ask about ${toolName})
- List of 5-8 entity mentions (tool names, company names, concepts in the article)
- Focus keyword (the primary keyword, e.g. "${toolName} review")

Respond with ONLY this JSON structure:
{
  "title": "...",
  "excerpt": "2-3 sentence summary for social sharing (max 160 chars)",
  "content": "full markdown content as described above",
  "meta_title": "${toolName} Review [${year}] — Is It Worth It? (max 60 chars)",
  "meta_description": "1-click answer: what ${toolName} is, what it costs, who it's for (150-160 chars)",
  "meta_keywords": "comma-separated, 8-10 keywords",
  "focus_keyword": "${toolName} review",
  "faq": [
    {"question": "What is ${toolName}?", "answer": "..."},
    {"question": "Is ${toolName} free?", "answer": "..."},
    {"question": "How does ${toolName} work?", "answer": "..."},
    {"question": "What are the best alternatives to ${toolName}?", "answer": "..."},
    {"question": "Who should use ${toolName}?", "answer": "..."}
  ],
  "entity_mentions": ["${toolName}", "..."]
}`;
        } else {
            const cat = category || 'AI Tools';
            prompt = `Write a comprehensive, expert-level blog post about: "${topic}" for the AI tools directory allaitoollist.com.
Category: ${cat}

CONTENT STRUCTURE (follow exactly):
---
# [Compelling title with year ${year} and power word]

**TL;DR:** (2-sentence direct answer for AEO — what this article covers and the key takeaway)

## Why [topic] Matters in ${year}
(Context + stats if possible. GEO: cite a fact or statistic. Entity: name 2-3 relevant companies/tools.)

## The Best AI Tools for [topic]
(Cover 5-7 specific, named AI tools. For each: name, what it does, best for whom, one key feature. Entity SEO: use exact tool names.)

## Key Features to Look For
(6 features as H3 subsections. NLP: use semantic variations — "capabilities", "functionalities", "what to evaluate".)

## How to Choose the Right AI Tool for [topic]
(Decision framework: 3-5 criteria. AEO: directly answers "how to choose" queries.)

## Step-by-Step: Getting Started
(Numbered steps a beginner can follow today. AEO: answer "how to use AI for [topic]".)

## Common Mistakes to Avoid
(3-5 mistakes. AEO: people also ask "what mistakes do people make with AI [topic]".)

## The Future of AI in [topic]
(1 paragraph trend analysis. GEO: make a clear, citable prediction.)

## Conclusion
(Summary + recommendation. End with CTA.)

---
**[CTA]** "👉 Ready to find the perfect AI tool? Browse our free directory of 1000+ AI tools at [All AI Tool List](https://allaitoollist.com)."

REQUIREMENTS:
- 1400-1700 words
- Named entities throughout: specific tool names, company names
- Semantic keyword cluster: AI ${topic}, best AI ${topic} tools, AI software for ${topic}, machine learning ${topic}, automated ${topic}
- Focus keyword used in: title, first 100 words, 2-3 H2s, last paragraph
- Reading level: Grade 8-10

Also generate:
- 5 FAQ Q&As targeting AEO (voice search, direct question format)
- List of 6-8 entity mentions in the article
- Focus keyword (primary search term)

Respond with ONLY this JSON:
{
  "title": "...",
  "excerpt": "...",
  "content": "...",
  "meta_title": "... (max 60 chars)",
  "meta_description": "... (150-160 chars)",
  "meta_keywords": "...",
  "focus_keyword": "...",
  "faq": [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ],
  "entity_mentions": ["...", "..."]
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
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.65,
                max_tokens: 4500,
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

        // Auto-generate JSON-LD schema markup
        const schemaType = toolName ? 'Review' : 'Article';
        const schemaMarkup = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': schemaType === 'Review' ? 'Review' : 'Article',
            headline: blogData.title,
            description: blogData.meta_description || blogData.excerpt,
            author: { '@type': 'Organization', name: 'All AI Tool List', url: 'https://allaitoollist.com' },
            publisher: { '@type': 'Organization', name: 'All AI Tool List', logo: { '@type': 'ImageObject', url: 'https://allaitoollist.com/icon.svg' } },
            datePublished: new Date().toISOString(),
            dateModified: new Date().toISOString(),
            mainEntityOfPage: { '@type': 'WebPage' },
            ...(toolName ? { itemReviewed: { '@type': 'SoftwareApplication', name: toolName, applicationCategory: toolCategory || 'AI Tool' } } : {}),
            ...(blogData.faq?.length ? {
                '@graph': [{
                    '@type': 'FAQPage',
                    mainEntity: blogData.faq.map((f: any) => ({
                        '@type': 'Question',
                        name: f.question,
                        acceptedAnswer: { '@type': 'Answer', text: f.answer },
                    }))
                }]
            } : {})
        });

        const slug = blogData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        const wordCount = blogData.content.split(/\s+/).length;

        return NextResponse.json({
            success: true,
            blog: {
                ...blogData,
                slug,
                category: toolCategory || category || 'AI Tools',
                is_published: false,
                schema_markup: schemaMarkup,
                entity_mentions: blogData.entity_mentions || [],
                reading_time: Math.max(1, Math.ceil(wordCount / 200)),
            },
        });

    } catch (error: any) {
        console.error('Blog generation error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
