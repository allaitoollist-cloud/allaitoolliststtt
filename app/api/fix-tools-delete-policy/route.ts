import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Fix RLS policy for deleting tools
export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ 
                error: 'Missing Supabase credentials',
                message: 'Please set SUPABASE_SERVICE_ROLE_KEY in your environment variables'
            }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Run this SQL in Supabase Dashboard > SQL Editor:',
            sql: `
-- Allow authenticated users to delete tools
DROP POLICY IF EXISTS "Authenticated users can delete tools" ON tools;
CREATE POLICY "Authenticated users can delete tools"
  ON tools FOR DELETE
  USING (auth.role() = 'authenticated');

-- OR if you want to allow service role to delete (recommended for admin operations):
-- This is already handled by using service role key in API routes
            `,
            instructions: [
                '1. Go to Supabase Dashboard',
                '2. Navigate to SQL Editor',
                '3. Copy and paste the SQL above',
                '4. Click "Run"',
                '5. Try deleting tools again from admin panel'
            ]
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

