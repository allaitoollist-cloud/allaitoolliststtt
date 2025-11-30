import { supabase } from '../supabase';
import { ToolSubmission } from '@/types';

/**
 * Submit a new tool for review
 */
export async function submitTool(submission: {
    toolName: string;
    toolUrl: string;
    description: string;
    category: string;
    pricing: string;
    submitterName?: string;
    submitterEmail?: string;
}): Promise<ToolSubmission | null> {
    const { data, error } = await supabase
        .from('tool_submissions')
        .insert([
            {
                tool_name: submission.toolName,
                tool_url: submission.toolUrl,
                description: submission.description,
                category: submission.category,
                pricing: submission.pricing,
                submitter_name: submission.submitterName,
                submitter_email: submission.submitterEmail,
            },
        ])
        .select()
        .single();

    if (error) {
        console.error('Error submitting tool:', error);
        return null;
    }

    return data as ToolSubmission;
}

/**
 * Get all tool submissions (admin only)
 */
export async function getAllSubmissions(): Promise<ToolSubmission[]> {
    const { data, error } = await supabase
        .from('tool_submissions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching submissions:', error);
        return [];
    }

    return data as ToolSubmission[];
}

/**
 * Update submission status (admin only)
 */
export async function updateSubmissionStatus(
    id: string,
    status: 'pending' | 'approved' | 'rejected'
): Promise<boolean> {
    const { error } = await supabase
        .from('tool_submissions')
        .update({ status, reviewed_at: new Date().toISOString() })
        .eq('id', id);

    if (error) {
        console.error('Error updating submission status:', error);
        return false;
    }

    return true;
}
