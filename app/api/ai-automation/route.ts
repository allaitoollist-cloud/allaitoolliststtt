import { NextRequest, NextResponse } from 'next/server';
import { load } from 'cheerio';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with Service Role Key for writing to DB
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { urls, openaiKey } = await request.json();

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json({ error: 'URLs are required' }, { status: 400 });
        }

        if (!openaiKey) {
            return NextResponse.json({ error: 'OpenAI API Key is required' }, { status: 400 });
        }

        const results = [];

        for (const url of urls) {
            if (!url) continue;

            try {
                // 1. Scrape the URL
                const response = await fetch(url, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' }
                });
                const html = await response.text();
                const $ = load(html);

                // Extract basic text for context (limit to 3000 chars to save tokens)
                const pageTitle = $('title').text().trim();
                const metaDesc = $('meta[name="description"]').attr('content') || '';
                const bodyText = $('body').text().replace(/\s+/g, ' ').substring(0, 3000);

                const context = `Title: ${pageTitle}\nDescription: ${metaDesc}\nContent Sample: ${bodyText}`;

                // 2. Call OpenAI API
                const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openaiKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo", // or gpt-4
                        messages: [
                            {
                                role: "system",
                                content: "You are an AI Directory Admin. Analyze the provided website content and extract structued data for an AI tool listing. Also write a short blog post about it. Return ONLY valid JSON."
                            },
                            {
                                role: "user",
                                content: `Here is the scraped content of an AI tool website:\n\n${context}\n\n
                                Please generate a JSON response with the following fields:
                                1. tool_name (Clean name)
                                2. slug (URL friendly)
                                3. short_description (max 150 chars)
                                4. full_description (marketing style, 3-4 paragraphs)
                                5. category (Choose one from: Text, Image, Video, Audio, Coding, Marketing, Automation, Other)
                                6. pricing_model (Free, Freemium, Paid, Contact for Pricing)
                                7. tags (array of 3-5 strings)
                                8. features (array of 3-4 key features)
                                9. blog_title (Catchy title for a blog post about this tool)
                                10. blog_content (A 500-word blog post in Markdown format introducing this tool, its features, and use cases)
                                `
                            }
                        ],
                        temperature: 0.7
                    })
                });

                const gptData = await gptResponse.json();

                if (gptData.error) {
                    throw new Error(gptData.error.message);
                }

                const content = gptData.choices[0].message.content;
                const jsonStr = content.replace(/```json/g, '').replace(/```/g, ''); // Clean markdown code blocks
                const aiData = JSON.parse(jsonStr);

                // 3. Save Tool to Database (Draft)
                const { data: toolData, error: toolError } = await supabase.from('tools').insert({
                    name: aiData.tool_name,
                    slug: aiData.slug,
                    short_description: aiData.short_description,
                    full_description: aiData.full_description,
                    url: url,
                    category: aiData.category,
                    pricing: aiData.pricing_model,
                    tags: aiData.tags,
                    features: aiData.features,
                    platform: ['Web'], // Default
                    is_draft: true, // SAVE AS DRAFT
                    verified: false
                }).select().single();

                if (toolError) throw toolError;

                // 4. Save Blog to Database (Draft) - Assuming blogs table exists, otherwise skip
                // We'll return the blog content for now if table doesn't exist
                /* 
                const { error: blogError } = await supabase.from('blogs').insert({
                    title: aiData.blog_title,
                    content: aiData.blog_content,
                    tool_id: toolData.id,
                    is_published: false
                });
                */

                results.push({
                    status: 'success',
                    url,
                    tool: aiData.tool_name,
                    blog: aiData.blog_title
                });

            } catch (error: any) {
                console.error(`Error processing ${url}:`, error);
                results.push({ status: 'error', url, message: error.message });
            }
        }

        return NextResponse.json({ results });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
