'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Send, Loader2, MessageCircle, Circle, RefreshCw } from 'lucide-react';
import { getBrowserClient } from '@/lib/supabase-browser';

interface Message {
    id: string;
    message: string;
    sender: 'visitor' | 'admin';
    created_at: string;
}

interface Session {
    id: string;
    visitor_name: string;
    visitor_email?: string;
    status: string;
    created_at: string;
    updated_at: string;
    chat_messages: Message[];
}

export default function LiveChatPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});
    const bottomRef = useRef<HTMLDivElement>(null);
    const activeIdRef = useRef<string | null>(null);
    const supabase = getBrowserClient();

    useEffect(() => { activeIdRef.current = activeId; }, [activeId]);

    const load = async () => {
        setLoading(true);
        const res = await fetch('/api/chat');
        const data = await res.json();
        if (data.sessions) setSessions(data.sessions);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }, [messages]);

    // Load messages for active session
    useEffect(() => {
        if (!activeId) return;
        const session = sessions.find(s => s.id === activeId);
        if (session) {
            setMessages([...session.chat_messages].sort((a, b) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            ));
        }
        // Clear unread
        setUnreadMap(prev => ({ ...prev, [activeId]: 0 }));
    }, [activeId, sessions]);

    // Realtime: listen for new messages on ALL sessions
    useEffect(() => {
        const channel = supabase
            .channel('admin-chat-all')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages',
            }, (payload) => {
                const msg = payload.new as Message & { session_id: string };
                // Update sessions list
                setSessions(prev => prev.map(s => {
                    if (s.id !== (msg as any).session_id) return s;
                    return { ...s, chat_messages: [...s.chat_messages, msg], updated_at: msg.created_at };
                }));
                // If active session — add to messages (use ref to avoid stale closure)
                if ((msg as any).session_id === activeIdRef.current) {
                    setMessages(prev => {
                        // Remove any optimistic placeholder, then add real message if not already present
                        const without = prev.filter(m => !m.id.startsWith('opt-') && m.id !== msg.id);
                        return [...without, msg];
                    });
                } else if (msg.sender === 'visitor') {
                    // Unread badge for other sessions
                    setUnreadMap(prev => ({
                        ...prev,
                        [(msg as any).session_id]: (prev[(msg as any).session_id] || 0) + 1,
                    }));
                }
            })
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_sessions',
            }, () => { load(); })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const sendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !activeId || sending) return;
        const text = input.trim();
        setInput('');
        setSending(true);

        // Optimistic update so admin sees reply immediately
        const optimistic: Message = {
            id: `opt-${Date.now()}`,
            message: text,
            sender: 'admin',
            created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, optimistic]);

        await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'message', sessionId: activeId, message: text, sender: 'admin' }),
        });
        setSending(false);
        // Reload to sync real IDs
        load();
    };

    const closeSession = async (sessionId: string) => {
        await supabase.from('chat_sessions').update({ status: 'closed' }).eq('id', sessionId);
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'closed' } : s));
    };

    const activeSession = sessions.find(s => s.id === activeId);
    const openSessions = sessions.filter(s => s.status === 'open');
    const closedSessions = sessions.filter(s => s.status === 'closed');

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-0 rounded-xl border border-white/10 overflow-hidden bg-card/50">

            {/* Left: Session list */}
            <div className="w-72 shrink-0 border-r border-white/10 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="font-semibold text-sm">Live Chats</h2>
                    <div className="flex items-center gap-2">
                        {openSessions.length > 0 && (
                            <Badge className="bg-green-500/10 text-green-500 border-0 text-xs">
                                {openSessions.length} open
                            </Badge>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={load} disabled={loading}>
                            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {sessions.length === 0 && !loading && (
                        <div className="text-center text-muted-foreground text-sm p-8">
                            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            No chats yet
                        </div>
                    )}

                    {/* Open sessions */}
                    {openSessions.map(session => {
                        const lastMsg = [...session.chat_messages].sort((a, b) =>
                            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                        )[0];
                        const unread = unreadMap[session.id] || 0;
                        return (
                            <button
                                key={session.id}
                                onClick={() => setActiveId(session.id)}
                                className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors
                                    ${activeId === session.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''}`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5">
                                        <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                                        <span className="font-medium text-sm truncate">{session.visitor_name}</span>
                                    </div>
                                    {unread > 0 && (
                                        <span className="w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                                            {unread}
                                        </span>
                                    )}
                                </div>
                                {session.visitor_email && (
                                    <p className="text-xs text-muted-foreground truncate">{session.visitor_email}</p>
                                )}
                                {lastMsg && (
                                    <p className="text-xs text-muted-foreground truncate mt-1">
                                        {lastMsg.sender === 'admin' ? '🟠 You: ' : ''}{lastMsg.message}
                                    </p>
                                )}
                                <p className="text-[10px] text-muted-foreground/60 mt-1">
                                    {new Date(session.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </button>
                        );
                    })}

                    {/* Closed sessions */}
                    {closedSessions.length > 0 && (
                        <div className="px-4 py-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                            Closed
                        </div>
                    )}
                    {closedSessions.map(session => (
                        <button
                            key={session.id}
                            onClick={() => setActiveId(session.id)}
                            className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors opacity-60
                                ${activeId === session.id ? 'bg-white/5 opacity-100' : ''}`}
                        >
                            <div className="flex items-center gap-1.5">
                                <Circle className="h-2 w-2 fill-gray-500 text-gray-500" />
                                <span className="font-medium text-sm truncate">{session.visitor_name}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground/60 mt-1">
                                {new Date(session.updated_at).toLocaleDateString()}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Chat window */}
            {activeSession ? (
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Chat header */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                        <div>
                            <p className="font-semibold">{activeSession.visitor_name}</p>
                            {activeSession.visitor_email && (
                                <p className="text-xs text-muted-foreground">{activeSession.visitor_email}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className={activeSession.status === 'open'
                                ? 'bg-green-500/10 text-green-500 border-0'
                                : 'bg-gray-500/10 text-gray-400 border-0'}>
                                {activeSession.status}
                            </Badge>
                            {activeSession.status === 'open' && (
                                <Button
                                    size="sm" variant="outline"
                                    className="text-xs h-7 border-white/10"
                                    onClick={() => closeSession(activeSession.id)}
                                >
                                    Close Chat
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-3">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm
                                    ${msg.sender === 'admin'
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-secondary border border-white/10 text-foreground rounded-bl-none'
                                    }`}>
                                    <p>{msg.message}</p>
                                    <p className="text-[10px] opacity-60 mt-0.5 text-right">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {/* Reply input */}
                    {activeSession.status === 'open' ? (
                        <form onSubmit={sendReply} className="flex gap-3 p-4 border-t border-white/10">
                            <Input
                                placeholder="Type your reply..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="flex-1"
                                autoFocus
                            />
                            <Button type="submit" disabled={!input.trim() || sending} className="shrink-0">
                                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </form>
                    ) : (
                        <div className="p-4 border-t border-white/10 text-center text-sm text-muted-foreground">
                            This chat is closed
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <div className="text-center space-y-2">
                        <MessageCircle className="h-12 w-12 mx-auto opacity-20" />
                        <p className="text-sm">Select a conversation</p>
                    </div>
                </div>
            )}
        </div>
    );
}
