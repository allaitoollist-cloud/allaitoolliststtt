import { DatabaseTool, Category, dbToolToTool } from '@/types';
import { supabase } from '@/lib/supabase';

// CONSTANTS
const MIN_DESCRIPTION_LENGTH = 150; // Characters
const MIN_TOOLS_FOR_INDEXING = 1;

/**
 * SEO Gatekeeper: Validates if a tool is high-quality enough to be indexed.
 * Rule: Must be explicitly 'published'.
 * Rule: Must have description > 150 chars, and have an icon.
 */
export function isToolIndexable(tool: DatabaseTool): boolean {
    // 1. LIFECYCLE CHECK (Strict)
    // If status exists, it MUST be 'published'.
    if (tool.status && tool.status !== 'published' && tool.status !== 'approved') return false;

    // Fallback for legacy rows without status: check is_draft
    if (!tool.status && tool.is_draft) return false;

    if (tool.seo_ignore) return false; // Manual override

    // Content Quality Check
    const descLength = (tool.full_description || '').length + (tool.short_description || '').length;
    if (descLength < MIN_DESCRIPTION_LENGTH) {
        return false; // Thin content
    }

    if (!tool.icon) {
        return false; // Low visual quality
    }

    return true;
}

/**
 * SEO Gatekeeper: Validates if a category page should be indexed.
 * Rule: Must have at least 1 indexable tool.
 */
export async function isCategoryIndexable(categorySlug: string): Promise<boolean> {
    // 1. Check Tool Count
    // We only count PUBLISHED tools
    const query = supabase
        .from('tools')
        .select('id', { count: 'exact', head: true })
        .eq('category', categorySlug)
        .in('status', ['published', 'approved']); // Only count published or approved tools

    const { count, error } = await query;

    if (error || !count || count < MIN_TOOLS_FOR_INDEXING) {
        return false; // Empty or near-empty category
    }

    return true;
}

/**
 * Helper to get safe, indexable tools for Sitemap
 */
export async function getIndexableTools() {
    const { data: tools } = await supabase
        .from('tools')
        .select('*')
        .in('status', ['published', 'approved']); // Database-level filter first

    if (!tools) return [];

    return tools.filter(isToolIndexable);
}

/**
 * Helper to get safe, indexable categories for Sitemap
 */
export async function getIndexableCategories(allTools: DatabaseTool[]) {
    const categories = new Set(allTools.map(t => t.category));
    const validCategories: string[] = [];

    for (const cat of Array.from(categories)) {
        // We can check in-memory for the tools list we just fetched
        // Ensure we only count tools that are actually indexable
        const toolsInCat = allTools.filter(t => t.category === cat && isToolIndexable(t));
        if (toolsInCat.length >= MIN_TOOLS_FOR_INDEXING) {
            validCategories.push(cat);
        }
    }

    return validCategories;
}
