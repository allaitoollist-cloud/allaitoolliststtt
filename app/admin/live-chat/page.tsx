'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Send, Loader2, MessageCircle, Circle, RefreshCw, RotateCcw,
    Pencil, Trash2, Check, X, Search, Zap, Globe, Star, Moon, Sun,
} from 'lucide-react';
import { getBrowserClient } from '@/lib/supabase-browser';
import { Switch } from '@/components/ui/switch';

interface Message {
    id: string;
    message: string;
    sender: 'visitor' | 'admin';
    created_at: string;
    read_at?: string | null;
    edited_at?: string | null;
    deleted?: boolean;
}

interface Session {
    id: string;
    visitor_name: string;
    visitor_email?: string;
    visitor_page?: string;
    visitor_browser?: string;
    status: string;
    rating?: number | null;
    rating_comment?: string | null;
    created_at: string;
    updated_at: string;
    chat_messages: Message[];
}

const QUICK_REPLIES = [
    'Thanks for reaching out! How can I help you?',
    'Please give me a moment, I\'ll check that for you.',
    'Could you provide more details about your issue?',
    'I\'ll get back to you shortly.',
    'Your request has been noted. We\'ll follow up via email.',
    'Is there anything else I can help you with?',
];

function playNotificationSound() {
    try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
    } catch {}
}

export default function LiveChatPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});
    const [visitorTyping, setVisitorTyping] = useState(false);
    const [search, setSearch] = useState('');
    const [showQuick, setShowQuick] = useState(false);
    const [awayMode, setAwayMode] = useState(false);
    const [awayMessage, setAwayMessage] = useState('');
    const [configLoaded, setConfigLoaded] = useState(false);

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const bottomRef = useRef<HTMLDivElement>(null);
    const activeIdRef = useRef<string | null>(null);
    const typingChannelRef = useRef<any>(null);
    const visitorTypingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const editInputRef = useRef<HTMLInputElement>(null);
    const supabase = getBrowserClient();

    useEffect(() => { activeIdRef.current = activeId; }, [activeId]);

    const load = useCallback(async () => {
        setLoading(true);
        const res = await fetch('/api/chat');
        const data = await res.json();
        if (data.sessions) setSessions(data.sessions);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    // Load away mode config
    useEffect(() => {
        fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'get_config' }),
        }).then(r => r.json()).then(data => {
            if (data.config) {
                setAwayMode(data.config.away_mode === 'true');
                setAwayMessage(data.config.away_message || '');
            }
            setConfigLoaded(true);
        }).catch(() => setConfigLoaded(true));
    }, []);

    const toggleAwayMode = async (val: boolean) => {
        setAwayMode(val);
        await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'set_config', key: 'away_mode', value: val ? 'true' : 'false' }),
        });
    };

    useEffect(() => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }, [messages, visitorTyping]);

    useEffect(() => {
        if (!activeId) return;
        const session = sessions.find(s => s.id === activeId);
        if (session) {
            setMessages([...session.chat_messages].sort((a, b) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            ));
        }
        setVisitorTyping(false);
        setEditingId(null);
        setUnreadMap(prev => ({ ...prev, [activeId]: 0 }));
        fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'mark_read', sessionId: activeId }),
        });
    }, [activeId, sessions]);

    // Focus edit input when editing starts
    useEffect(() => {
        if (editingId) setTimeout(() => editInputRef.current?.focus(), 50);
    }, [editingId]);

    // Typing indicator channel
    useEffect(() => {
        if (typingChannelRef.current) {
            supabase.removeChannel(typingChannelRef.current);
            typingChannelRef.current = null;
        }
        if (!activeId) return;
        const ch = supabase.channel(`typing:${activeId}`);
        ch.on('broadcast', { event: 'visitor-typing' }, () => {
            setVisitorTyping(true);
            if (visitorTypingTimeout.current) clearTimeout(visitorTypingTimeout.current);
            visitorTypingTimeout.current = setTimeout(() => setVisitorTyping(false), 2500);
        }).subscribe();
        typingChannelRef.current = ch;
        return () => {
            if (typingChannelRef.current) {
                supabase.removeChannel(typingChannelRef.current);
                typingChannelRef.current = null;
            }
        };
    }, [activeId]);

    // Global realtime
    useEffect(() => {
        const channel = supabase
            .channel('admin-chat-all')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
                const msg = payload.new as Message & { session_id: string };
                const sid = (msg as any).session_id;
                setSessions(prev => prev.map(s =>
                    s.id !== sid ? s : { ...s, chat_messages: [...s.chat_messages, msg], updated_at: msg.created_at }
                ));
                if (sid === activeIdRef.current) {
                    setMessages(prev => {
                        const without = prev.filter(m => !m.id.startsWith('opt-') && m.id !== msg.id);
                        return [...without, msg];
                    });
                    setVisitorTyping(false);
                    if (msg.sender === 'visitor') {
                        fetch('/api/chat', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'mark_read', sessionId: sid }),
                        });
                    }
                } else if (msg.sender === 'visitor') {
                    playNotificationSound();
                    setUnreadMap(prev => ({ ...prev, [sid]: (prev[sid] || 0) + 1 }));
                }
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_messages' }, (payload) => {
                const updated = payload.new as Message & { session_id: string };
                const sid = (updated as any).session_id;
                const patch = (prev: Message[]) => prev.map(m => m.id === updated.id
                    ? { ...m, message: updated.message, read_at: updated.read_at, edited_at: updated.edited_at, deleted: updated.deleted }
                    : m
                );
                if (sid === activeIdRef.current) setMessages(patch);
                setSessions(prev => prev.map(s =>
                    s.id !== sid ? s : { ...s, chat_messages: patch(s.chat_messages) }
                ));
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_sessions' }, () => load())
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_sessions' }, () => load())
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [load]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        try {
            typingChannelRef.current?.send({ type: 'broadcast', event: 'admin-typing', payload: {} });
        } catch {}
    };

    const sendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !activeId || sending) return;
        const text = input.trim();
        setInput('');
        setShowQuick(false);
        setSending(true);
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
        load();
    };

    const startEdit = (msg: Message) => {
        setEditingId(msg.id);
        setEditText(msg.message);
    };

    const saveEdit = async () => {
        if (!editingId || !editText.trim()) return;
        setMessages(prev => prev.map(m => m.id === editingId ? { ...m, message: editText.trim(), edited_at: new Date().toISOString() } : m));
        setEditingId(null);
        await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'edit_msg', messageId: editingId, message: editText.trim() }),
        });
    };

    const deleteMessage = async (messageId: string) => {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, deleted: true } : m));
        await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete_msg', messageId }),
        });
    };

    const closeSession = async (sessionId: string) => {
        await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'close', sessionId }),
        });
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'closed' } : s));
    };

    const reopenSession = async (sessionId: string) => {
        await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'reopen', sessionId }),
        });
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'open' } : s));
    };

    const useQuickReply = (text: string) => {
        setInput(text);
        setShowQuick(false);
    };

    const activeSession = sessions.find(s => s.id === activeId);
    const openSessions = sessions.filter(s => s.status === 'open');
    const closedSessions = sessions.filter(s => s.status === 'closed');
    const totalUnread = Object.values(unreadMap).reduce((a, b) => a + b, 0);

    const filterSessions = (list: Session[]) =>
        search.trim()
            ? list.filter(s =>
                s.visitor_name.toLowerCase().includes(search.toLowerCase()) ||
                s.visitor_email?.toLowerCase().includes(search.toLowerCase())
            )
            : list;

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-0 rounded-xl border border-white/10 overflow-hidden bg-card/50">

            {/* ── Left: Session list ─────────────────────────────────────── */}
            <div className="w-72 shrink-0 border-r border-white/10 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-white/10 shrink-0 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-sm">Live Chats</h2>
                            {totalUnread > 0 && (
                                <span className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {totalUnread}
                                </span>
                            )}
                        </div>
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
                    {/* Away Mode toggle */}
                    <div className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${awayMode ? 'border-orange-500/30 bg-orange-500/10' : 'border-white/10 bg-white/5'}`}>
                        <div className="flex items-center gap-2">
                            {awayMode ? <Moon className="h-3.5 w-3.5 text-orange-400" /> : <Sun className="h-3.5 w-3.5 text-green-400" />}
                            <span className="text-xs font-medium">{awayMode ? 'Away Mode ON' : 'Online'}</span>
                        </div>
                        <Switch checked={awayMode} onCheckedChange={toggleAwayMode} />
                    </div>
                </div>

                {/* Search */}
                <div className="p-2 border-b border-white/5">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Search name or email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-8 h-8 text-xs"
                        />
                    </div>
                </div>

                {/* Session list */}
                <div className="flex-1 overflow-y-auto">
                    {sessions.length === 0 && !loading && (
                        <div className="text-center text-muted-foreground text-sm p-8">
                            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            No chats yet
                        </div>
                    )}

                    {filterSessions(openSessions).map(session => {
                        const sorted = [...session.chat_messages].sort((a, b) =>
                            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                        );
                        const lastMsg = sorted[0];
                        const unread = unreadMap[session.id] || 0;
                        return (
                            <button
                                key={session.id}
                                onClick={() => setActiveId(session.id)}
                                className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors
                                    ${activeId === session.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''}`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <Circle className="h-2 w-2 fill-green-500 text-green-500 shrink-0" />
                                        <span className="font-medium text-sm truncate">{session.visitor_name}</span>
                                    </div>
                                    {unread > 0 && (
                                        <span className="w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0 ml-1">
                                            {unread}
                                        </span>
                                    )}
                                </div>
                                {session.visitor_email && (
                                    <p className="text-xs text-muted-foreground truncate">{session.visitor_email}</p>
                                )}
                                {lastMsg && (
                                    <p className="text-xs text-muted-foreground truncate mt-1">
                                        {lastMsg.deleted ? '🗑 Message deleted' : lastMsg.sender === 'admin' ? `🟠 You: ${lastMsg.message}` : lastMsg.message}
                                    </p>
                                )}
                                <p className="text-[10px] text-muted-foreground/60 mt-1">
                                    {new Date(session.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </button>
                        );
                    })}

                    {closedSessions.length > 0 && (
                        <div className="px-4 py-2 text-[10px] text-muted-foreground uppercase tracking-wider border-b border-white/5">
                            Closed
                        </div>
                    )}
                    {filterSessions(closedSessions).map(session => (
                        <button
                            key={session.id}
                            onClick={() => setActiveId(session.id)}
                            className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors opacity-60
                                ${activeId === session.id ? 'bg-white/5 opacity-100' : ''}`}
                        >
                            <div className="flex items-center gap-1.5">
                                <Circle className="h-2 w-2 fill-gray-500 text-gray-500 shrink-0" />
                                <span className="font-medium text-sm truncate">{session.visitor_name}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground/60 mt-1">
                                {new Date(session.updated_at).toLocaleDateString()}
                            </p>
                        </button>
                    ))}

                    {search && filterSessions([...openSessions, ...closedSessions]).length === 0 && (
                        <div className="text-center text-muted-foreground text-xs p-6">No results for "{search}"</div>
                    )}
                </div>
            </div>

            {/* ── Right: Chat window ─────────────────────────────────────── */}
            {activeSession ? (
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Chat header */}
                    <div className="px-5 py-3 border-b border-white/10 shrink-0 space-y-1">
                        <div className="flex items-center justify-between">
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
                                {activeSession.status === 'open' ? (
                                    <Button size="sm" variant="outline" className="text-xs h-7 border-white/10"
                                        onClick={() => closeSession(activeSession.id)}>
                                        Close Chat
                                    </Button>
                                ) : (
                                    <Button size="sm" variant="outline" className="text-xs h-7 border-white/10 gap-1"
                                        onClick={() => reopenSession(activeSession.id)}>
                                        <RotateCcw className="h-3 w-3" />
                                        Reopen
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Visitor info row */}
                        <div className="flex flex-wrap items-center gap-3">
                            {activeSession.visitor_browser && (
                                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                    <Globe className="h-3 w-3" />{activeSession.visitor_browser}
                                </span>
                            )}
                            {activeSession.visitor_page && (
                                <a
                                    href={activeSession.visitor_page}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-primary hover:underline truncate max-w-[200px]"
                                    title={activeSession.visitor_page}
                                >
                                    📍 {(() => { try { return new URL(activeSession.visitor_page).pathname || '/'; } catch { return activeSession.visitor_page; } })()}
                                </a>
                            )}
                            {activeSession.rating && (
                                <span className="flex items-center gap-1 text-[11px] text-yellow-400">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`h-3 w-3 ${i < activeSession.rating! ? 'fill-yellow-400' : 'text-muted-foreground/30'}`} />
                                    ))}
                                    {activeSession.rating_comment && (
                                        <span className="text-muted-foreground ml-1">"{activeSession.rating_comment}"</span>
                                    )}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-2 min-h-0">
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'} group`}
                                onMouseEnter={() => setHoveredId(msg.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                {/* Action buttons — show on hover for non-deleted, non-optimistic messages */}
                                {!msg.deleted && !msg.id.startsWith('opt-') && hoveredId === msg.id && editingId !== msg.id && (
                                    <div className={`flex items-center gap-1 self-center mx-2 ${msg.sender === 'admin' ? 'order-first' : 'order-last'}`}>
                                        {msg.sender === 'admin' && (
                                            <button
                                                onClick={() => startEdit(msg)}
                                                className="w-6 h-6 rounded-full bg-secondary border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="h-3 w-3 text-muted-foreground" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteMessage(msg.id)}
                                            className="w-6 h-6 rounded-full bg-secondary border border-white/10 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-400" />
                                        </button>
                                    </div>
                                )}

                                <div className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-sm
                                    ${msg.sender === 'admin'
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-secondary border border-white/10 text-foreground rounded-bl-none'
                                    } ${msg.id.startsWith('opt-') ? 'opacity-60' : ''}`}>

                                    {/* Deleted message */}
                                    {msg.deleted ? (
                                        <p className="italic text-xs opacity-60">🗑 This message was deleted</p>
                                    ) : editingId === msg.id ? (
                                        /* Inline edit */
                                        <div className="space-y-2">
                                            <Input
                                                ref={editInputRef}
                                                value={editText}
                                                onChange={e => setEditText(e.target.value)}
                                                onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingId(null); }}
                                                className="h-7 text-sm bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                            />
                                            <div className="flex gap-1">
                                                <button onClick={saveEdit} className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 transition-colors">
                                                    <Check className="h-3 w-3" /> Save
                                                </button>
                                                <button onClick={() => setEditingId(null)} className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors">
                                                    <X className="h-3 w-3" /> Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p>{msg.message}</p>
                                    )}

                                    {!msg.deleted && (
                                        <div className="flex items-center justify-end gap-1 mt-0.5">
                                            <span className="text-[10px] opacity-60">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {msg.edited_at && !msg.deleted && (
                                                <span className="text-[10px] opacity-50 italic">edited</span>
                                            )}
                                            {msg.sender === 'admin' && !msg.id.startsWith('opt-') && (
                                                <span className="text-[10px]">
                                                    {msg.read_at
                                                        ? <span className="text-blue-200 font-bold">✓✓</span>
                                                        : <span className="opacity-50">✓</span>
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Visitor typing indicator */}
                        {visitorTyping && activeSession.status === 'open' && (
                            <div className="flex justify-start">
                                <div className="bg-secondary border border-white/10 rounded-2xl rounded-bl-none px-4 py-3">
                                    <div className="flex gap-1 items-center">
                                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input area */}
                    {activeSession.status === 'open' ? (
                        <div className="border-t border-white/10 shrink-0">
                            {/* Quick replies panel */}
                            {showQuick && (
                                <div className="p-3 border-b border-white/10 space-y-1">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Quick Replies</p>
                                    {QUICK_REPLIES.map((r, i) => (
                                        <button
                                            key={i}
                                            onClick={() => useQuickReply(r)}
                                            className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <form onSubmit={sendReply} className="flex gap-2 p-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className={`h-9 w-9 shrink-0 ${showQuick ? 'text-primary' : ''}`}
                                    onClick={() => setShowQuick(s => !s)}
                                    title="Quick replies"
                                >
                                    <Zap className="h-4 w-4" />
                                </Button>
                                <Input
                                    placeholder="Type your reply..."
                                    value={input}
                                    onChange={handleInputChange}
                                    className="flex-1"
                                    autoFocus
                                />
                                <Button type="submit" disabled={!input.trim() || sending} className="shrink-0">
                                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="p-4 border-t border-white/10 text-center text-sm text-muted-foreground shrink-0">
                            Chat closed — click <strong>Reopen</strong> to reply again
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
