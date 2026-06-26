import { NextResponse } from 'next/server';

// One-time setup route: creates chat_sessions and chat_messages tables
// Visit /api/setup-chat once to initialize the live chat feature
export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
    }

    // Extract project ref from URL
    const projectRef = supabaseUrl.replace('https://', '').split('.')[0];

    const sql = `
-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id TEXT NOT NULL,
    visitor_name TEXT NOT NULL,
    visitor_email TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('visitor', 'admin')),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS chat_sessions_visitor_id_idx ON chat_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS chat_sessions_status_idx ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS chat_sessions_updated_at_idx ON chat_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS chat_messages_session_id_idx ON chat_messages(session_id);

-- Enable RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Service role manages chat_sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Service role manages chat_messages" ON chat_messages;

-- Permissive policies (API routes use service_role which bypasses RLS anyway)
CREATE POLICY "Service role manages chat_sessions"
    ON chat_sessions FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role manages chat_messages"
    ON chat_messages FOR ALL
    USING (true)
    WITH CHECK (true);
`;

    try {
        // Use Supabase Management API to execute SQL
        const response = await fetch(
            `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${serviceRoleKey}`,
                },
                body: JSON.stringify({ query: sql }),
            }
        );

        if (!response.ok) {
            const err = await response.text();
            console.error('[setup-chat] Management API error:', err);
            // Management API requires a separate token. Return the SQL for manual execution.
            return NextResponse.json({
                success: false,
                message: 'Automatic setup requires Supabase Management API token. Please run the SQL manually in your Supabase Dashboard > SQL Editor.',
                sql,
                dashboardUrl: `${supabaseUrl.replace('.supabase.co', '')}.supabase.com/editor`,
                instructions: [
                    '1. Go to your Supabase Dashboard',
                    '2. Navigate to SQL Editor',
                    '3. Paste and run the SQL provided in the "sql" field above',
                    '4. The chat feature will work immediately after'
                ]
            }, { status: 200 });
        }

        return NextResponse.json({
            success: true,
            message: 'Chat tables created successfully! The live chat feature is now ready.'
        });

    } catch (err: any) {
        return NextResponse.json({
            success: false,
            message: 'Please run the SQL manually in Supabase Dashboard > SQL Editor.',
            sql,
            error: err.message
        }, { status: 200 });
    }
}
