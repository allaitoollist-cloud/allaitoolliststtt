import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action } = body;

        if (action === 'start') {
            const { visitorId, name, email } = body;
            if (!visitorId || !name) {
                return NextResponse.json({ error: 'visitorId and name required' }, { status: 400 });
            }

            // Check if existing open session for this visitor
            const { data: existing, error: findError } = await supabase
                .from('chat_sessions')
                .select('id')
                .eq('visitor_id', visitorId)
                .eq('status', 'open')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (findError) {
                // Table likely doesn't exist yet
                console.error('[Chat] chat_sessions table error:', findError.message);
                return NextResponse.json({ error: 'Chat not configured. Run Supabase SQL setup.', setup_required: true }, { status: 503 });
            }

            let sessionId: string;

            if (existing) {
                sessionId = existing.id;
            } else {
                const { data: session, error } = await supabase
                    .from('chat_sessions')
                    .insert({ visitor_id: visitorId, visitor_name: name, visitor_email: email || null, status: 'open' })
                    .select('id')
                    .single();
                if (error || !session) {
                    console.error('[Chat] insert session error:', error?.message);
                    return NextResponse.json({ error: error?.message || 'Failed to create session' }, { status: 500 });
                }
                sessionId = session.id;

                // Welcome message from admin
                await supabase.from('chat_messages').insert({
                    session_id: sessionId,
                    sender: 'admin',
                    message: `Hi ${name}! 👋 Thanks for reaching out. How can we help you today?`,
                });
            }

            const { data: messages } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: true });

            return NextResponse.json({ sessionId, messages: messages || [] });
        }

        if (action === 'message') {
            const { sessionId, message, sender } = body;
            if (!sessionId || !message || !sender) {
                return NextResponse.json({ error: 'sessionId, message, sender required' }, { status: 400 });
            }

            const { error } = await supabase.from('chat_messages').insert({
                session_id: sessionId,
                sender,
                message: message.trim(),
            });

            if (error) return NextResponse.json({ error: error.message }, { status: 500 });

            await supabase.from('chat_sessions')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', sessionId);

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (e: any) {
        console.error('[Chat API] Unexpected error:', e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// Admin: get all sessions
export async function GET() {
    const { data: sessions, error } = await supabase
        .from('chat_sessions')
        .select(`
            id, visitor_name, visitor_email, status, created_at, updated_at,
            chat_messages(id, message, sender, created_at)
        `)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('[Chat] GET error:', error.message);
        return NextResponse.json({ sessions: [], setup_required: true });
    }

    return NextResponse.json({ sessions: sessions || [] });
}
