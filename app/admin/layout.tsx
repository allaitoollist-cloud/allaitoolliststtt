'use client';

import { Sidebar } from '@/components/admin/Sidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getBrowserClient } from '@/lib/supabase-browser';

const ALLOWED_ADMIN_EMAILS = [
    'muhammadismailkpt@gmail.com',
    'allaitoolist@gmail.com',
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router   = useRouter();
    const pathname = usePathname();
    const [authed, setAuthed]   = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (pathname === '/admin/login') {
            setLoading(false);
            return;
        }

        const supabase = getBrowserClient();

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user && ALLOWED_ADMIN_EMAILS.includes(session.user.email || '')) {
                setAuthed(true);
            } else {
                router.replace('/admin/login');
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session || !ALLOWED_ADMIN_EMAILS.includes(session.user?.email || '')) {
                setAuthed(false);
                router.replace('/admin/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [pathname, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (!authed) return null;

    return (
        <div className="min-h-screen flex bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <AdminHeader />
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
