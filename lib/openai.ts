import { createClient } from '@supabase/supabase-js';

let cachedKey: string | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

export async function getOpenAIKey(): Promise<string | null> {
    if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;

    // Return cached value if fresh
    if (cachedKey && Date.now() - cacheTime < CACHE_TTL) return cachedKey;

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        const { data } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'openai_api_key')
            .single();

        cachedKey = data?.value || null;
        cacheTime = Date.now();
        return cachedKey;
    } catch {
        return null;
    }
}
