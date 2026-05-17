import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

// Server-side singleton (API routes / server components)
let serverInstance: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
    // In browser, delegate to the singleton browser client to avoid
    // multiple GoTrueClient instances
    if (typeof window !== 'undefined') {
        // Dynamic require avoids a circular dep at build time
        const { getBrowserClient } = require('./supabase-browser')
        return getBrowserClient()
    }

    if (!serverInstance) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Missing Supabase environment variables')
        }

        serverInstance = createClient(supabaseUrl, supabaseAnonKey)
    }
    return serverInstance
}

// Proxy so existing imports (`import { supabase }`) keep working unchanged
export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        return getSupabase()[prop as keyof SupabaseClient]
    }
})
