'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Headphones, RefreshCw, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getBrowserClient } from '@/lib/supabase-browser';

interface Message {
    id: string;
    message: string;
    sender: 'visitor' | 'admin';
    created_at: string;
    read_at?: string | null;
    edited_at?: string | null;
    deleted?: boolean;
}

function getVisitorId() {
    if (typeof window === 'undefined') return '';
    let id = localStorage.getItem('_chat_vid');
    if (!id) {
        id = Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem('_chat_vid', id);
    }
    return id;
}

function getBrowserName() {
    if (typeof window === 'undefined') return '';
    const ua = navigator.userAgent;
    if (ua.includes('Edg/')) return 'Edge';
    if (ua.includes('Chrome/')) return 'Chrome';
    if (ua.includes('Firefox/')) return 'Firefox';
    if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('OPR/') || ua.includes('Opera/')) return 'Opera';
    return 'Browser';
}

export function LiveChatWidget() {
    return <LiveChatWidgetInner />;
}

function LiveChatWidgetInner() {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const [started, setStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [unread, setUnread] = useState(0);
    const [setupRequired, setSetupRequired] = useState(false);
    const [sessionClosed, setSessionClosed] = useState(false);
    const [adminTyping, setAdminTyping] = useState(false);

    // Rating state
    const [rated, setRated] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);
    const [ratingComment, setRatingComment] = useState('');
    const [ratingSubmitting, setRatingSubmitting] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    const adminTypingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const typingChannelRef = useRef<any>(null);
    const supabase = getBrowserClient();

    useEffect(() => { setMounted(true); }, []);

    const scrollBottom = () => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    };

    const loadMessages = async (sid: string) => {
        try {
            const res = await fetch(`/api/chat?sessionId=${sid}`);
            const data = await res.json();
            if (data.setup_required) { setSetupRequired(true); return; }
            if (data.messages) { setMessages(data.messages); scrollBottom(); }
        } catch { setSetupRequired(true); }
    };

    // Restore session from localStorage
    useEffect(() => {
        if (!mounted) return;
        const savedSession = localStorage.getItem('_chat_session');
        const savedName = localStorage.getItem('_chat_name') || '';
        const savedEmail = localStorage.getItem('_chat_email') || '';
        const savedRated = localStorage.getItem('_chat_rated') === '1';
        if (savedSession && savedName) {
            setSessionId(savedSession);
            setName(savedName);
            setEmail(savedEmail);
            setStarted(true);
            setRated(savedRated);
            setLoading(true);
            loadMessages(savedSession).finally(() => setLoading(false));
        }
    }, [mounted]);

    // Realtime: messages + session status + message updates
    useEffect(() => {
        if (!sessionId) return;
        const channel = supabase
            .channel(`session:${sessionId}`)
            .on('postgres_changes', {
                event: 'INSERT', schema: 'public', table: 'chat_messages',
                filter: `session_id=eq.${sessionId}`,
            }, (payload) => {
                const msg = payload.new as Message;
                setMessages(prev => {
                    const without = prev.filter(m => !m.id.startsWith('opt-') && m.id !== msg.id);
                    return [...without, msg];
                });
                if (msg.sender === 'admin') {
                    setAdminTyping(false);
                    if (!open) setUnread(u => u + 1);
                }
                scrollBottom();
            })
            .on('postgres_changes', {
                event: 'UPDATE', schema: 'public', table: 'chat_messages',
                filter: `session_id=eq.${sessionId}`,
            }, (payload) => {
                const updated = payload.new as Message;
                setMessages(prev => prev.map(m => m.id === updated.id
                    ? { ...m, message: updated.message, read_at: updated.read_at, edited_at: updated.edited_at, deleted: updated.deleted }
                    : m
                ));
            })
            .on('postgres_changes', {
                event: 'UPDATE', schema: 'public', table: 'chat_sessions',
                filter: `id=eq.${sessionId}`,
            }, (payload) => {
                const s = payload.new as any;
                if (s.status === 'closed') setSessionClosed(true);
                else if (s.status === 'open') setSessionClosed(false);
            })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [sessionId]);

    // Typing channel
    useEffect(() => {
        if (!sessionId) return;
        const ch = supabase.channel(`typing:${sessionId}`);
        ch.on('broadcast', { event: 'admin-typing' }, () => {
            setAdminTyping(true);
            if (adminTypingTimeout.current) clearTimeout(adminTypingTimeout.current);
            adminTypingTimeout.current = setTimeout(() => setAdminTyping(false), 2500);
        }).subscribe();
        typingChannelRef.current = ch;
        return () => { supabase.removeChannel(ch); };
    }, [sessionId]);

    useEffect(() => {
        if (open) { setUnread(0); scrollBottom(); }
    }, [open]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        try {
            typingChannelRef.current?.send({ type: 'broadcast', event: 'visitor-typing', payload: {} });
        } catch {}
    };

    const startChat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) return;
        setSending(true);
        const visitorId = getVisitorId();
        const page = window.location.href;
        const browser = getBrowserName();
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'start', visitorId, name: name.trim(), email: email.trim(), page, browser }),
        });
        const data = await res.json();
        if (data.setup_required || res.status === 503) {
            setSetupRequired(true);
            setSending(false);
            return;
        }
        if (data.sessionId) {
            setSessionId(data.sessionId);
            localStorage.setItem('_chat_session', data.sessionId);
            localStorage.setItem('_chat_name', name.trim());
            localStorage.setItem('_chat_email', email.trim());
            localStorage.removeItem('_chat_rated');
            setStarted(true);
            setSessionClosed(false);
            setRated(false);
            setMessages(data.messages || []);
            scrollBottom();
        }
        setSending(false);
    };

    const startNewSession = async () => {
        setSending(true);
        localStorage.removeItem('_chat_session');
        localStorage.removeItem('_chat_rated');
        setRated(false);
        setSelectedRating(0);
        setRatingComment('');
        const visitorId = getVisitorId();
        const page = window.location.href;
        const browser = getBrowserName();
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'start', visitorId, name, email, page, browser }),
        });
        const data = await res.json();
        if (data.sessionId) {
            setSessionId(data.sessionId);
            localStorage.setItem('_chat_session', data.sessionId);
            setSessionClosed(false);
            setMessages(data.messages || []);
            scrollBottom();
        }
        setSending(false);
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !sessionId || sending) return;
        const text = input.trim();
        setInput('');
        setSending(true);
        const optimistic: Message = {
            id: `opt-${Date.now()}`,
            message: text,
            sender: 'visitor',
            created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, optimistic]);
        scrollBottom();
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'message', sessionId, message: text, sender: 'visitor' }),
        });
        const data = await res.json();
        if (data.session_closed) {
            setMessages(prev => prev.filter(m => !m.id.startsWith('opt-')));
            setSessionClosed(true);
        }
        setSending(false);
    };

    const submitRating = async () => {
        if (!selectedRating || !sessionId) return;
        setRatingSubmitting(true);
        await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'rate', sessionId, rating: selectedRating, comment: ratingComment }),
        });
        setRated(true);
        localStorage.setItem('_chat_rated', '1');
        setRatingSubmitting(false);
    };

    if (!mounted) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {open && (
                <div className="w-80 sm:w-96 bg-background border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    style={{ height: '480px' }}>

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-primary/10 border-b border-white/10 shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Headphones className="h-5 w-5 text-primary" />
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Support Chat</p>
                                <p className="text-xs text-green-400">Online — we reply fast</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Body */}
                    {setupRequired ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-5 text-center space-y-2">
                            <p className="text-sm font-medium">Chat is coming soon!</p>
                            <p className="text-xs text-muted-foreground">Email us at <span className="text-primary">hello@allaitoollist.com</span></p>
                        </div>

                    ) : !started ? (
                        <form onSubmit={startChat} className="flex-1 flex flex-col justify-center p-5 space-y-4">
                            <div className="text-center space-y-1">
                                <p className="font-semibold text-sm">👋 Hi there!</p>
                                <p className="text-xs text-muted-foreground">Fill in your details to start chatting.</p>
                            </div>
                            <Input placeholder="Your name *" value={name} onChange={e => setName(e.target.value)} required className="text-sm" />
                            <Input type="email" placeholder="Email address *" value={email} onChange={e => setEmail(e.target.value)} required className="text-sm" />
                            <Button type="submit" size="sm" disabled={sending || !name.trim() || !email.trim()} className="w-full">
                                {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Start Chat
                            </Button>
                        </form>

                    ) : sessionClosed ? (
                        /* Chat ended — show rating if not yet rated */
                        <div className="flex-1 flex flex-col items-center justify-center p-5 text-center space-y-4 overflow-y-auto">
                            {!rated ? (
                                <>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold">Chat Ended 👋</p>
                                        <p className="text-xs text-muted-foreground">How was your experience?</p>
                                    </div>

                                    {/* Star rating */}
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setSelectedRating(star)}
                                                className="transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    className={`h-7 w-7 transition-colors ${
                                                        star <= (hoverRating || selectedRating)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-muted-foreground/30'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>

                                    {selectedRating > 0 && (
                                        <Input
                                            placeholder="Leave a comment (optional)"
                                            value={ratingComment}
                                            onChange={e => setRatingComment(e.target.value)}
                                            className="text-sm"
                                        />
                                    )}

                                    <div className="flex flex-col gap-2 w-full">
                                        <Button
                                            size="sm"
                                            onClick={submitRating}
                                            disabled={!selectedRating || ratingSubmitting}
                                            className="w-full"
                                        >
                                            {ratingSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : null}
                                            Submit Rating
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => setRated(true)} className="w-full text-xs text-muted-foreground">
                                            Skip
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-1">
                                        <p className="text-2xl">🙏</p>
                                        <p className="text-sm font-semibold">Thanks for your feedback!</p>
                                        <p className="text-xs text-muted-foreground">Start a new chat anytime.</p>
                                    </div>
                                    <Button size="sm" onClick={startNewSession} disabled={sending} className="gap-2">
                                        {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                                        Start New Chat
                                    </Button>
                                </>
                            )}
                        </div>

                    ) : (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                                {loading && (
                                    <div className="flex justify-center pt-4">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    </div>
                                )}
                                {!loading && messages.length === 0 && (
                                    <div className="text-center text-xs text-muted-foreground pt-4">
                                        Send a message — we&apos;ll reply shortly!
                                    </div>
                                )}
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm
                                            ${msg.sender === 'visitor'
                                                ? 'bg-primary text-white rounded-br-none'
                                                : 'bg-card border border-white/10 text-foreground rounded-bl-none'
                                            } ${msg.id.startsWith('opt-') ? 'opacity-60' : ''}`}>
                                            {msg.sender === 'admin' && !msg.deleted && (
                                                <p className="text-[10px] font-semibold text-primary mb-0.5">Support</p>
                                            )}
                                            {msg.deleted
                                                ? <p className="italic text-xs opacity-50">🗑 This message was deleted</p>
                                                : <p>{msg.message}</p>
                                            }
                                            {!msg.deleted && (
                                                <div className="flex items-center justify-end gap-1 mt-0.5">
                                                    <span className="text-[10px] opacity-60">
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {msg.edited_at && <span className="text-[10px] opacity-40 italic">edited</span>}
                                                    {msg.sender === 'visitor' && !msg.id.startsWith('opt-') && (
                                                        <span className="text-[10px]">
                                                            {msg.read_at
                                                                ? <span className="text-blue-300 font-bold">✓✓</span>
                                                                : <span className="opacity-50">✓</span>}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {adminTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-card border border-white/10 rounded-xl rounded-bl-none px-4 py-2.5">
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

                            <form onSubmit={sendMessage} className="flex gap-2 p-3 border-t border-white/10 shrink-0">
                                <Input
                                    placeholder="Type a message..."
                                    value={input}
                                    onChange={handleInputChange}
                                    className="text-sm h-9"
                                    autoFocus
                                />
                                <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={!input.trim() || sending}>
                                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            )}

            <button
                onClick={() => setOpen(o => !o)}
                className="relative w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
                {open ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}
                {!open && unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unread}
                    </span>
                )}
            </button>
        </div>
    );
}
