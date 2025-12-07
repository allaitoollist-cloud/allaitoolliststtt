import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// This API route applies the necessary RLS policies for tool_submissions
// Run this once by visiting /api/fix-rls
export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        return NextResponse.json({
            error: 'Missing Supabase credentials. Please set SUPABASE_SERVICE_ROLE_KEY in .env.local'
        }, { status: 500 });
    }

    // Use service role key for admin operations
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    try {
        // Run the RLS policy SQL
        const { error } = await supabaseAdmin.rpc('exec_sql', {
            sql: `
                -- Allow authenticated users to update submissions
                DROP POLICY IF EXISTS "Admins can update submissions" ON tool_submissions;
                CREATE POLICY "Admins can update submissions"
                  ON tool_submissions FOR UPDATE
                  USING (auth.role() = 'authenticated');

                -- Allow authenticated users to delete submissions
                DROP POLICY IF EXISTS "Admins can delete submissions" ON tool_submissions;
                CREATE POLICY "Admins can delete submissions"
                  ON tool_submissions FOR DELETE
                  USING (auth.role() = 'authenticated');
            `
        });

        if (error) {
            // If rpc doesn't work, try direct approach
            console.log('RPC approach failed, trying direct queries...');

            return NextResponse.json({
                message: 'Note: You need to run the SQL manually in Supabase Dashboard',
                sql: `
-- Run this SQL in Supabase Dashboard > SQL Editor:

-- Allow authenticated users to update submissions
DROP POLICY IF EXISTS "Admins can update submissions" ON tool_submissions;
CREATE POLICY "Admins can update submissions"
  ON tool_submissions FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete submissions
DROP POLICY IF EXISTS "Admins can delete submissions" ON tool_submissions;
CREATE POLICY "Admins can delete submissions"
  ON tool_submissions FOR DELETE
  USING (auth.role() = 'authenticated');
                `
            });
        }

        return NextResponse.json({
            success: true,
            message: 'RLS policies applied successfully!'
        });

    } catch (err) {
        return NextResponse.json({
            error: 'Failed to apply RLS policies',
            details: err instanceof Error ? err.message : 'Unknown error'
        }, { status: 500 });
    }
}
