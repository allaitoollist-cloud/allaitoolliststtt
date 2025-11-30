import { supabase } from '../supabase';
import { DatabaseTool, Tool, dbToolToTool, toolToDbTool } from '@/types';

/**
 * Fetch all tools from the database
 */
export async function getAllTools(): Promise<Tool[]> {
    const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('date_added', { ascending: false });

    if (error) {
        console.error('Error fetching tools:', error);
        return [];
    }

    return (data as DatabaseTool[]).map(dbToolToTool);
}

/**
 * Fetch a single tool by ID
 */
export async function getToolById(id: string): Promise<Tool | null> {
    const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching tool:', error);
        return null;
    }

    return dbToolToTool(data as DatabaseTool);
}

/**
 * Fetch tools by category
 */
export async function getToolsByCategory(category: string): Promise<Tool[]> {
    const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('category', category)
        .order('date_added', { ascending: false });

    if (error) {
        console.error('Error fetching tools by category:', error);
        return [];
    }

    return (data as DatabaseTool[]).map(dbToolToTool);
}

/**
 * Fetch featured tools
 */
export async function getFeaturedTools(): Promise<Tool[]> {
    const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('featured', true)
        .order('date_added', { ascending: false });

    if (error) {
        console.error('Error fetching featured tools:', error);
        return [];
    }

    return (data as DatabaseTool[]).map(dbToolToTool);
}

/**
 * Fetch trending tools
 */
export async function getTrendingTools(): Promise<Tool[]> {
    const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('trending', true)
        .order('views', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching trending tools:', error);
        return [];
    }

    return (data as DatabaseTool[]).map(dbToolToTool);
}

/**
 * Fetch new tools (added in last 7 days)
 */
export async function getNewTools(): Promise<Tool[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
        .from('tools')
        .select('*')
        .gte('date_added', sevenDaysAgo.toISOString())
        .order('date_added', { ascending: false });

    if (error) {
        console.error('Error fetching new tools:', error);
        return [];
    }

    return (data as DatabaseTool[]).map(dbToolToTool);
}

/**
 * Search tools by name, description, or tags
 */
export async function searchTools(query: string): Promise<Tool[]> {
    const { data, error } = await supabase
        .from('tools')
        .select('*')
        .or(`name.ilike.%${query}%,short_description.ilike.%${query}%,full_description.ilike.%${query}%`);

    if (error) {
        console.error('Error searching tools:', error);
        return [];
    }

    return (data as DatabaseTool[]).map(dbToolToTool);
}

/**
 * Increment tool view count
 */
export async function incrementToolViews(toolId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_views', { tool_id: toolId });

    if (error) {
        console.error('Error incrementing views:', error);
    }
}

/**
 * Create a new tool (admin only)
 */
export async function createTool(tool: Partial<Tool>): Promise<Tool | null> {
    const dbTool = toolToDbTool(tool);

    const { data, error } = await supabase
        .from('tools')
        .insert([dbTool])
        .select()
        .single();

    if (error) {
        console.error('Error creating tool:', error);
        return null;
    }

    return dbToolToTool(data as DatabaseTool);
}

/**
 * Update a tool (admin only)
 */
export async function updateTool(id: string, updates: Partial<Tool>): Promise<Tool | null> {
    const dbUpdates = toolToDbTool(updates);

    const { data, error } = await supabase
        .from('tools')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating tool:', error);
        return null;
    }

    return dbToolToTool(data as DatabaseTool);
}

/**
 * Delete a tool (admin only)
 */
export async function deleteTool(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting tool:', error);
        return false;
    }

    return true;
}
