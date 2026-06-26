'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Copy, Database, ExternalLink, Terminal, XCircle } from 'lucide-react';

const CHAT_SQL = `-- ====================================================
-- Live Chat Tables — Run once in Supabase SQL Editor
-- ====================================================

CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id TEXT NOT NULL,
    visitor_name TEXT NOT NULL,
    visitor_email TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('visitor', 'admin')),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chat_sessions_visitor_id_idx ON chat_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS chat_sessions_status_idx ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS chat_sessions_updated_at_idx ON chat_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS chat_messages_session_id_idx ON chat_messages(session_id);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Manage chat_sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Manage chat_messages" ON chat_messages;

CREATE POLICY "Manage chat_sessions"
    ON chat_sessions FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Manage chat_messages"
    ON chat_messages FOR ALL USING (true) WITH CHECK (true);`;

export default function SetupPage() {
    const [chatStatus, setChatStatus] = useState<'idle' | 'checking' | 'ok' | 'missing'>('idle');
    const [copied, setCopied] = useState(false);

    const checkChatTables = async () => {
        setChatStatus('checking');
        try {
            const res = await fetch('/api/chat');
            const data = await res.json();
            if (data.setup_required) {
                setChatStatus('missing');
            } else {
                setChatStatus('ok');
            }
        } catch {
            setChatStatus('missing');
        }
    };

    const copySQL = () => {
        navigator.clipboard.writeText(CHAT_SQL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-1">Database Setup</h1>
                <p className="text-muted-foreground text-sm">
                    Run these one-time SQL migrations in your{' '}
                    <a
                        href="https://supabase.com/dashboard/project/pvvstmqtpdwiqqnklmeu/editor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline underline-offset-2 inline-flex items-center gap-1"
                    >
                        Supabase SQL Editor <ExternalLink className="w-3 h-3" />
                    </a>
                </p>
            </div>

            {/* Chat Tables */}
            <div className="border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 bg-card border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Database className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Live Chat Tables</p>
                            <p className="text-xs text-muted-foreground">
                                <code className="text-primary">chat_sessions</code> &amp;{' '}
                                <code className="text-primary">chat_messages</code>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {chatStatus === 'ok' && (
                            <Badge className="bg-green-500/10 text-green-400 border-0 gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Tables exist
                            </Badge>
                        )}
                        {chatStatus === 'missing' && (
                            <Badge className="bg-red-500/10 text-red-400 border-0 gap-1">
                                <XCircle className="w-3 h-3" /> Tables missing
                            </Badge>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-white/10 h-8"
                            onClick={checkChatTables}
                            disabled={chatStatus === 'checking'}
                        >
                            {chatStatus === 'checking' ? 'Checking…' : 'Check Status'}
                        </Button>
                    </div>
                </div>

                <div className="p-5 space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-sm">
                        <Terminal className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                        <div className="text-amber-200/80">
                            <p className="font-semibold text-amber-300 mb-1">How to apply</p>
                            <ol className="list-decimal list-inside space-y-1 text-xs leading-relaxed">
                                <li>Click <strong>Copy SQL</strong> below</li>
                                <li>Open your <a href="https://supabase.com/dashboard/project/pvvstmqtpdwiqqnklmeu/editor" target="_blank" rel="noopener noreferrer" className="underline text-amber-300">Supabase SQL Editor ↗</a></li>
                                <li>Paste and click <strong>Run</strong></li>
                                <li>Come back and click <strong>Check Status</strong> to verify</li>
                            </ol>
                        </div>
                    </div>

                    <div className="relative">
                        <pre className="text-xs text-muted-foreground bg-black/30 rounded-xl p-5 overflow-x-auto border border-white/5 max-h-72">
                            {CHAT_SQL}
                        </pre>
                        <Button
                            size="sm"
                            className="absolute top-3 right-3 h-7 text-xs gap-1.5"
                            onClick={copySQL}
                        >
                            {copied ? (
                                <><CheckCircle2 className="w-3.5 h-3.5" /> Copied!</>
                            ) : (
                                <><Copy className="w-3.5 h-3.5" /> Copy SQL</>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
