'use client';
import { useEffect } from 'react';

export function WebMCP() {
  useEffect(() => {
    const nav = navigator as typeof navigator & {
      modelContext?: {
        provideContext: (ctx: unknown) => void;
      };
    };
    if (!nav.modelContext) return;

    nav.modelContext.provideContext({
      tools: [
        {
          name: 'search_ai_tools',
          description: 'Search for AI tools in the All AI Tool List directory by name, category, or use case',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query — tool name, category, or use case',
              },
              category: {
                type: 'string',
                description: 'Filter by category slug (optional)',
              },
              pricing: {
                type: 'string',
                enum: ['free', 'freemium', 'paid'],
                description: 'Filter by pricing model (optional)',
              },
            },
            required: ['query'],
          },
          execute: async (params: { query: string; category?: string; pricing?: string }) => {
            const url = new URL('/api/tools', window.location.origin);
            url.searchParams.set('search', params.query);
            if (params.category) url.searchParams.set('category', params.category);
            if (params.pricing) url.searchParams.set('pricing', params.pricing);
            const res = await fetch(url.toString());
            return res.json();
          },
        },
        {
          name: 'get_categories',
          description: 'List all AI tool categories available in the directory',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
          execute: async () => {
            const res = await fetch('/api/categories');
            return res.json();
          },
        },
      ],
    });
  }, []);

  return null;
}
