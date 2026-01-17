import { supabase } from '@/lib/supabase';
import { DatabaseTool, categories } from '@/types';

// CONFIG
const MAX_LINKS_PER_TEXT = 5; // Avoid over-linking
const MAX_LINKS_PER_ENTITY = 1; // Only link a specific term once

interface LinkEntity {
    term: string;
    url: string;
    priority: number; // Higher priority gets linked first
}

/**
 * Fetches relevant entities (Categories + Top Tools) to potentially link within a text.
 * Caching strategy should be applied here in production (e.g., React cache() or unstable_cache).
 */
export async function getLinkingEntities(currentCategoryId?: string, currentToolId?: string): Promise<LinkEntity[]> {
    const entities: LinkEntity[] = [];

    // 1. Add Categories (High Priority)
    // We want to link keywords like "AI Writing", "Image Generator"
    // We use the predefined 'categories' list from types, or fetch from DB if available.
    // Assuming 'categories' is just a string array:
    categories.forEach(cat => {
        if (cat === 'All') return;
        entities.push({
            term: cat, // Exact match on category name
            url: `/category/${cat.toLowerCase()}`,
            priority: 10
        });
        // Add variations? e.g. "Writing AI" -> simple regex later
    });

    // 2. Add Valid, Published Tools ( Medium Priority)
    // We probably don't want to fetch ALL tools. Let's fetch top tools in the current category
    // or just strict popular ones to avoid query bloat.
    if (currentCategoryId) {
        const { data: popularTools } = await supabase
            .from('tools')
            .select('name, slug, id, status')
            .eq('category', currentCategoryId)
            .eq('status', 'published') // STRICTLY published only
            .neq('id', currentToolId || '')
            .order('views', { ascending: false })
            .limit(10);

        if (popularTools) {
            popularTools.forEach(tool => {
                entities.push({
                    term: tool.name,
                    url: `/tool/${tool.slug}`,
                    priority: 5
                });
            });
        }
    }

    return entities.sort((a, b) => b.priority - a.priority);
}

/**
 * Smartly injects internal links into a text block.
 * - Respects max links.
 * - Respects single link per entity.
 * - Prevents linking inside existing tags (basic check).
 */
export function autolinkText(text: string, entities: LinkEntity[]): string {
    if (!text) return "";

    let processedText = text;
    let linkCount = 0;
    const linkedTerms = new Set<string>();

    for (const entity of entities) {
        if (linkCount >= MAX_LINKS_PER_TEXT) break;
        if (linkedTerms.has(entity.term.toLowerCase())) continue;

        // Create a loose regex to find the term
        // We look for the term surrounded by word boundaries to avoid partial word matches
        // e.g. don't match "cat" in "category"
        const regex = new RegExp(`\\b(${escapeRegExp(entity.term)})\\b`, 'i');

        if (regex.test(processedText)) {
            // Check if we are already inside a link or tag (Basic heuristics)
            // A full DOM parser is safer but slower. For simple descriptions, this usually works.
            // We use a placeholder to avoid re-matching or breaking HTML.

            // Actually, simplest way for 'pure text' input is string replacement.
            // But if input has HTML, we must be careful.
            // As this is usually for plaintext descriptions -> HTML, let's assume plaintext input OR use a robust parser.
            // For now, straightforward replacement on first match.

            processedText = processedText.replace(regex, (match) => {
                linkCount++;
                linkedTerms.add(entity.term.toLowerCase());
                // SEO-friendly, server-renderable link
                return `<a href="${entity.url}" class="text-primary hover:underline font-medium" title="Learn more about ${match}">${match}</a>`;
            });
        }
    }

    return processedText;
}

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Fetch Robust Alternatives based on Shared Tags + Category
 */
export async function getSmartAlternatives(tool: DatabaseTool, limit = 6) {
    // 1. Try matching by tags first (stronger signal)
    let alternatives: DatabaseTool[] = [];

    if (tool.tags && tool.tags.length > 0) {
        const { data: tagMatches } = await supabase
            .from('tools')
            .select('*')
            .eq('status', 'published')
            .neq('id', tool.id)
            .contains('tags', tool.tags.slice(0, 2)) // Match first 2 tags
            .limit(limit);

        if (tagMatches) alternatives = tagMatches;
    }

    // 2. If not enough, fill with Category matches
    if (alternatives.length < limit) {
        const { data: catMatches } = await supabase
            .from('tools')
            .select('*')
            .eq('category', tool.category)
            .eq('status', 'published')
            .neq('id', tool.id)
            .limit(limit - alternatives.length); // Only fetch what we need

        if (catMatches) {
            // Deduplicate
            const existingIds = new Set(alternatives.map(t => t.id));
            const newMatches = catMatches.filter(t => !existingIds.has(t.id));
            alternatives = [...alternatives, ...newMatches];
        }
    }

    return alternatives;
}
