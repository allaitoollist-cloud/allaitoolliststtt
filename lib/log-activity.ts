import { createClient } from '@supabase/supabase-js';

export async function logActivity(action: string, details: Record<string, any>) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
        await supabase.from('activity_logs').insert({
            action,
            details,
            created_at: new Date().toISOString(),
        });
    } catch {
        // Non-blocking — logging failure should never break the main action
    }
}
