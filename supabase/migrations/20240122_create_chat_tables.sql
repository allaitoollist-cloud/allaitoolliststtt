-- Live Chat Tables Migration
-- Run this in Supabase Dashboard > SQL Editor

-- Chat Sessions Table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id TEXT NOT NULL,
    visitor_name TEXT NOT NULL,
    visitor_email TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('visitor', 'admin')),
    message TEXT NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add columns if upgrading existing table
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;

-- Visitor info + rating on sessions
ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS visitor_page TEXT DEFAULT NULL;
ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS visitor_browser TEXT DEFAULT NULL;
ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS rating INT DEFAULT NULL;
ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS rating_comment TEXT DEFAULT NULL;

-- Chat config table (away mode, auto-reply message)
CREATE TABLE IF NOT EXISTS chat_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE chat_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages chat_config" ON chat_config FOR ALL USING (true) WITH CHECK (true);

INSERT INTO chat_config (key, value) VALUES
    ('away_mode', 'false'),
    ('away_message', 'Thanks for reaching out! We are currently away but will reply as soon as possible. 🙏')
ON CONFLICT (key) DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS chat_sessions_visitor_id_idx ON chat_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS chat_sessions_status_idx ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS chat_sessions_updated_at_idx ON chat_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS chat_messages_session_id_idx ON chat_messages(session_id);

-- Enable RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies: service role bypasses RLS automatically, so these cover the browser client
-- Visitors can insert their own sessions (the API route uses service role, so this is a safety net)
CREATE POLICY "Service role manages chat_sessions"
    ON chat_sessions FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role manages chat_messages"
    ON chat_messages FOR ALL
    USING (true)
    WITH CHECK (true);

-- Enable realtime for live chat (required for Supabase Realtime subscriptions)
ALTER PUBLICATION supabase_realtime ADD TABLE chat_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
