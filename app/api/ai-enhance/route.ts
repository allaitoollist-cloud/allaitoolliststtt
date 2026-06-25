import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest, unauthorizedJson } from '@/lib/admin-auth';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: NextRequest) {
    if (!await verifyAdminRequest(req)) return unauthorizedJson();

    const { toolName, url, description, category } = await req.json();

    if (!toolName) {
        return NextResponse.json({ error: 'toolName is required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });

    const prompt = `You are writing copy for an AI tool directory listing.

Tool: ${toolName}
URL: ${url || 'unknown'}
Category: ${category || 'AI Tool'}
Current description: ${description || 'none'}

Write two things:
1. A SHORT description (1 sentence, max 120 chars) — what the tool does, snappy and clear
2. A FULL description (3-4 sentences, 200-300 chars) — features, use cases, who it's for

Also suggest 3-5 relevant tags (single words or short phrases).

Reply as JSON exactly like this (no markdown, no extra text):
{
  "short_description": "...",
  "full_description": "...",
  "tags": ["tag1", "tag2", "tag3"]
}`;

    try {
        const message = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 512,
            messages: [{ role: 'user', content: prompt }],
        });

        const text = message.content[0].type === 'text' ? message.content[0].text : '';
        const json = JSON.parse(text.trim());

        return NextResponse.json({
            short_description: json.short_description || '',
            full_description: json.full_description || '',
            tags: Array.isArray(json.tags) ? json.tags : [],
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
