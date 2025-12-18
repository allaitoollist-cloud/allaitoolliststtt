import { NextResponse } from 'next/server';

// Check if SUPABASE_SERVICE_ROLE_KEY is set
export async function GET() {
    const hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return NextResponse.json({
        hasServiceRoleKey,
        hasSupabaseUrl,
        hasAnonKey,
        message: hasServiceRoleKey 
            ? '✅ SUPABASE_SERVICE_ROLE_KEY is set! You can delete tools now.'
            : '❌ SUPABASE_SERVICE_ROLE_KEY is missing. Please add it to .env.local',
        instructions: !hasServiceRoleKey ? [
            '1. Go to Supabase Dashboard: https://supabase.com/dashboard',
            '2. Select your project',
            '3. Go to Settings > API',
            '4. Copy the "service_role" key (secret key, NOT anon key)',
            '5. Add this line to your .env.local file:',
            '   SUPABASE_SERVICE_ROLE_KEY=your_key_here',
            '6. Restart your dev server (Ctrl+C then npm run dev)'
        ] : []
    });
}

