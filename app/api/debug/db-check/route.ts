import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        if (!url || !key) return NextResponse.json({ error: 'Missing Keys' });

        const supabase = createClient(url, key);

        // Raw SQL to Create Tables if they don't exist
        // Note: Supabase JS client doesn't support raw SQL query execution easily without being owner or using specific functions.
        // However, we can try to use Rpc if a function exists, BUT usually we can't just run raw SQL via client.

        // ALTERNATIVE: We can check if table exists by selecting from it.
        const { error: checkError } = await supabase.from('tool_submissions').select('id').limit(1);

        if (checkError && checkError.code === '42P01') { // Relation does not exist
            return NextResponse.json({
                status: 'MISSING_TABLE',
                message: "The 'tool_submissions' table does not exist. Please run the SQL migration manually in Supabase Dashboard."
            });
        }

        if (checkError) {
            return NextResponse.json({ status: 'ERROR', details: checkError });
        }

        return NextResponse.json({ status: 'OK', message: "Table 'tool_submissions' exists and is accessible." });

    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
