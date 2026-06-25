'use client';

import { useEffect } from 'react';
import { getBrowserClient } from '@/lib/supabase-browser';

export function AdminChatNotify() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        const supabase = getBrowserClient();

        const channel = supabase
            .channel('admin-chat-notify-global')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages',
            }, (payload) => {
                const msg = payload.new as { sender: string; message: string; session_id: string };
                if (msg.sender !== 'visitor') return;

                if ('Notification' in window && Notification.permission === 'granted') {
                    const n = new Notification('New Chat Message', {
                        body: msg.message.length > 80 ? msg.message.slice(0, 80) + '…' : msg.message,
                        icon: '/icon.svg',
                        tag: `chat-${msg.session_id}`,
                        requireInteraction: false,
                    });
                    n.onclick = () => {
                        window.focus();
                        window.location.href = '/admin/live-chat';
                    };
                }
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    return null;
}
