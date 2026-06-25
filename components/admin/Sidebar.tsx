'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard, Users, FileText, Settings, LogOut, PlusCircle,
    Mail, FolderOpen, Activity, MessageSquare, Bot, DollarSign,
    BarChart2, Star, X, Menu, Receipt, Globe, Inbox, Headphones,
} from 'lucide-react';
import { getBrowserClient } from '@/lib/supabase-browser';
import { useState, useEffect } from 'react';

const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { href: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
    { href: '/admin/submissions', icon: FileText, label: 'Submissions' },
    { href: '/admin/payments', icon: Receipt, label: 'Payments' },
    { href: '/admin/sponsorships', icon: DollarSign, label: 'Sponsorships' },
    { href: '/admin/tools', icon: PlusCircle, label: 'Manage Tools' },
    { href: '/admin/categories', icon: FolderOpen, label: 'Categories' },
    { href: '/admin/automation', icon: Bot, label: 'AI Automation' },
    { href: '/admin/blogs', icon: FileText, label: 'Blogs' },
    { href: '/admin/newsletter', icon: Mail, label: 'Newsletter' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/reviews', icon: Star, label: 'Reviews' },
    { href: '/admin/live-chat', icon: Headphones, label: 'Live Chat' },
    { href: '/admin/contact-messages', icon: Mail, label: 'Contact Messages' },
    { href: '/admin/activity', icon: Activity, label: 'Activity Logs' },
    { href: '/admin/seo', icon: Globe, label: 'SEO Control' },
    { href: '/admin/email', icon: Inbox, label: 'Email Logs' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

function NavLinks({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = getBrowserClient();
        await supabase.auth.signOut();
        router.replace('/admin/login');
    };

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

    return (
        <>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map(({ href, icon: Icon, label, exact }) => (
                    <Link
                        key={href}
                        href={href}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                            isActive(href, exact)
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                        }`}
                    >
                        <Icon className="h-4 w-4 shrink-0" />
                        {label}
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-white/10">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </>
    );
}

export function Sidebar() {
    return (
        <aside className="w-64 border-r border-white/10 bg-card/50 hidden md:flex flex-col shrink-0">
            <div className="p-5 border-b border-white/10">
                <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
                    <span className="bg-primary/10 p-1 rounded text-primary">AI</span>
                    <span>Admin</span>
                </Link>
            </div>
            <NavLinks />
        </aside>
    );
}

export function MobileSidebar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Close on route change
    useEffect(() => { setOpen(false); }, [pathname]);

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    return (
        <>
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="md:hidden">
                <Menu className="h-5 w-5" />
            </Button>

            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Drawer */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-white/10 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <Link href="/admin" className="flex items-center gap-2 font-bold text-xl" onClick={() => setOpen(false)}>
                        <span className="bg-primary/10 p-1 rounded text-primary">AI</span>
                        <span>Admin</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <NavLinks onClose={() => setOpen(false)} />
            </div>
        </>
    );
}
