import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email';

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
}

function chatTranscriptHtml(visitorName: string, messages: { sender: string; message: string; created_at: string }[]) {
    const rows = messages.map(m => {
        const who = m.sender === 'admin' ? 'Support' : visitorName;
        const color = m.sender === 'admin' ? '#f97316' : '#1a1007';
        const time = new Date(m.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
        return `
            <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e8dfd7;vertical-align:top;width:90px">
                    <span style="font-size:12px;font-weight:700;color:${color}">${who}</span><br>
                    <span style="font-size:11px;color:#79716a">${time}</span>
                </td>
                <td style="padding:10px 0 10px 16px;border-bottom:1px solid #e8dfd7;font-size:14px;color:#4a4540;line-height:1.5">
                    ${m.message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                </td>
            </tr>`;
    }).join('');

    return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f5f5;font-family:sans-serif">
    <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e8dfd7">
        <div style="background:#f97316;padding:24px 32px">
            <h1 style="margin:0;color:#fff;font-size:20px">Chat Transcript</h1>
            <p style="margin:4px 0 0;color:#fff;opacity:.85;font-size:13px">Conversation with ${visitorName}</p>
        </div>
        <div style="padding:24px 32px">
            <table style="width:100%;border-collapse:collapse">${rows}</table>
        </div>
        <div style="padding:16px 32px;background:#fef8f4;border-top:1px solid #e8dfd7;font-size:12px;color:#79716a;text-align:center">
            All AI Tool List &mdash; <a href="https://allaitoollist.com" style="color:#f97316">allaitoollist.com</a>
        </div>
    </div>
    </body></html>`;
}

export async function POST(req: NextRequest) {
    const supabase = getSupabase();
    if (!supabase) {
        return NextResponse.json({ error: 'Chat not configured.', setup_required: true }, { status: 503 });
    }
    try {
        const body = await req.json();
        const { action } = body;

        // ── Start / resume session ─────────────────────────────────────────
        if (action === 'start') {
            const { visitorId, name, email } = body;
            if (!visitorId || !name) {
                return NextResponse.json({ error: 'visitorId and name required' }, { status: 400 });
            }

            const { data: existing, error: findError } = await supabase
                .from('chat_sessions')
                .select('id')
                .eq('visitor_id', visitorId)
                .eq('status', 'open')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (findError) {
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
                    return NextResponse.json({ error: error?.message || 'Failed to create session' }, { status: 500 });
                }
                sessionId = session.id;

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

        // ── Send message ───────────────────────────────────────────────────
        if (action === 'message') {
            const { sessionId, message, sender } = body;
            if (!sessionId || !message || !sender) {
                return NextResponse.json({ error: 'sessionId, message, sender required' }, { status: 400 });
            }

            // Check session is still open
            const { data: sess } = await supabase
                .from('chat_sessions')
                .select('status')
                .eq('id', sessionId)
                .single();

            if (sess?.status === 'closed') {
                return NextResponse.json({ session_closed: true });
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

        // ── Mark visitor messages read ─────────────────────────────────────
        if (action === 'mark_read') {
            const { sessionId } = body;
            if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
            await supabase.from('chat_messages')
                .update({ read_at: new Date().toISOString() })
                .eq('session_id', sessionId)
                .eq('sender', 'visitor')
                .is('read_at', null);
            return NextResponse.json({ success: true });
        }

        // ── Close session + send transcript ───────────────────────────────
        if (action === 'close') {
            const { sessionId } = body;
            if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });

            const { data: session } = await supabase
                .from('chat_sessions')
                .select('visitor_name, visitor_email')
                .eq('id', sessionId)
                .single();

            const { data: messages } = await supabase
                .from('chat_messages')
                .select('sender, message, created_at')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: true });

            await supabase.from('chat_sessions')
                .update({ status: 'closed', updated_at: new Date().toISOString() })
                .eq('id', sessionId);

            if (session && messages && messages.length > 0) {
                const html = chatTranscriptHtml(session.visitor_name, messages);
                const adminEmail = process.env.ADMIN_EMAIL || 'allaitoollist@gmail.com';
                const emailJobs: Promise<any>[] = [
                    sendEmail({ to: adminEmail, subject: `Chat ended — ${session.visitor_name}`, html }),
                ];
                if (session.visitor_email) {
                    emailJobs.push(sendEmail({
                        to: session.visitor_email,
                        subject: 'Your chat transcript — All AI Tool List',
                        html,
                    }));
                }
                await Promise.allSettled(emailJobs);
            }

            return NextResponse.json({ success: true });
        }

        // ── Reopen session ─────────────────────────────────────────────────
        if (action === 'reopen') {
            const { sessionId } = body;
            if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
            await supabase.from('chat_sessions')
                .update({ status: 'open', updated_at: new Date().toISOString() })
                .eq('id', sessionId);
            return NextResponse.json({ success: true });
        }

        // ── Edit message ───────────────────────────────────────────────────
        if (action === 'edit_msg') {
            const { messageId, message } = body;
            if (!messageId || !message?.trim()) return NextResponse.json({ error: 'messageId and message required' }, { status: 400 });
            const { error } = await supabase.from('chat_messages')
                .update({ message: message.trim(), edited_at: new Date().toISOString() })
                .eq('id', messageId);
            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            return NextResponse.json({ success: true });
        }

        // ── Delete message (soft) ──────────────────────────────────────────
        if (action === 'delete_msg') {
            const { messageId } = body;
            if (!messageId) return NextResponse.json({ error: 'messageId required' }, { status: 400 });
            const { error } = await supabase.from('chat_messages')
                .update({ deleted: true, edited_at: new Date().toISOString() })
                .eq('id', messageId);
            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (e: any) {
        console.error('[Chat API] Unexpected error:', e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// GET /api/chat?sessionId=xxx  → visitor fetches own messages
// GET /api/chat               → admin fetches all sessions
export async function GET(req: NextRequest) {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ sessions: [], setup_required: true });

    const sessionId = req.nextUrl.searchParams.get('sessionId');
    if (sessionId) {
        const { data: messages, error } = await supabase
            .from('chat_messages')
            .select('id, message, sender, created_at, read_at, edited_at, deleted')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });
        if (error) return NextResponse.json({ messages: [], setup_required: true });
        return NextResponse.json({ messages: messages || [] });
    }

    const { data: sessions, error } = await supabase
        .from('chat_sessions')
        .select(`
            id, visitor_name, visitor_email, status, created_at, updated_at,
            chat_messages(id, message, sender, created_at, read_at, edited_at, deleted)
        `)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('[Chat] GET error:', error.message);
        return NextResponse.json({ sessions: [], setup_required: true });
    }

    return NextResponse.json({ sessions: sessions || [] });
}
