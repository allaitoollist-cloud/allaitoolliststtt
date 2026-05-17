'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
    Menu, X, ChevronDown, Mail, Zap, Gift, Newspaper, DollarSign,
    Briefcase, ShieldCheck, Layers, BarChart3, Code,
    BookOpen, Youtube as YoutubeIcon, User, LogOut, Heart, PlusCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
    onSearch?: (query: string) => void;
}

const PRIMARY_NAV = [
    { label: 'Directory',   href: '/' },
    { label: 'Categories',  href: '/categories' },
    { label: 'Tutorials',   href: '/tutorials' },
    { label: 'Blog',        href: '/blog' },
];

const MORE_LINKS = [
    { label: 'New AI Tools',    href: '/new',           icon: Zap,        desc: 'Latest additions' },
    { label: 'Free AI Tools',   href: '/?pricing=Free', icon: Gift,       desc: '100% free tools' },
    { label: 'AI News',         href: '/news',          icon: Newspaper,  desc: 'Latest updates' },
    { label: 'Deals & Bonuses', href: '/deals',         icon: DollarSign, desc: 'Exclusive offers' },
    { label: 'AI Jobs',         href: '/jobs',          icon: Briefcase,  desc: 'Find AI roles' },
    { label: 'AI Glossary',     href: '/glossary',      icon: BookOpen,   desc: '100+ AI terms' },
    { label: 'AI YouTube',      href: '/youtube',       icon: YoutubeIcon,desc: 'Best AI channels' },
    { label: 'AI Stacks',       href: '/stacks',        icon: Layers,     desc: 'Tool combinations' },
    { label: 'Reports',         href: '/reports',       icon: BarChart3,  desc: 'Market insights' },
    { label: 'API Access',      href: '/api-access',    icon: Code,       desc: 'Developer API' },
    { label: 'Verified Badge',  href: '/verified',      icon: ShieldCheck,desc: 'Get verified' },
];

const LANGUAGES = [
    { code: 'en', label: 'English',  flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español',  flag: '🇪🇸' },
    { code: 'de', label: 'Deutsch',  flag: '🇩🇪' },
];

export function Navbar(_props: NavbarProps = {}) {
    const pathname = usePathname();
    const [moreOpen,     setMoreOpen]     = useState(false);
    const [langOpen,     setLangOpen]     = useState(false);
    const [mobileOpen,   setMobileOpen]   = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [activeLang,   setActiveLang]   = useState(LANGUAGES[0]);
    const [scrolled,     setScrolled]     = useState(false);

    const moreRef = useRef<HTMLDivElement>(null);
    const langRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    const { user, signOut } = useAuth();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
            if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
            if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname?.startsWith(href);

    return (
        <nav className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
            scrolled
                ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-lg shadow-gray-200/30 py-2'
                : 'bg-white border-b border-gray-100 py-3'
        }`}>
            <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">

                {/* ── Logo ── */}
                <Link href="/" className="flex items-center gap-2.5 shrink-0 group mr-2">
                    <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-105 group-hover:shadow-orange-500/40 transition-all duration-200">
                        <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
                            <rect x="6" y="8" width="20" height="14" rx="4" fill="white"/>
                            <circle cx="12" cy="14" r="2.5" fill="#f97316"/>
                            <circle cx="20" cy="14" r="2.5" fill="#f97316"/>
                            <path d="M12 18.5 Q16 21 20 18.5" stroke="#f97316" strokeWidth="2" strokeLinecap="round" fill="none"/>
                        </svg>
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-[15px] font-black text-gray-900 tracking-tighter uppercase">All AI List</span>
                        <span className="text-[9px] font-bold text-orange-500 tracking-[0.15em] uppercase mt-0.5">Verified Tools</span>
                    </div>
                </Link>

                {/* ── Desktop Nav — centered pill group ── */}
                <div className="hidden md:flex items-center flex-1 justify-center">
                    <div className="flex items-center bg-gray-50 rounded-2xl px-1 py-1 border border-gray-100 gap-0.5">
                        {PRIMARY_NAV.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all duration-200 ${
                                    isActive(item.href)
                                        ? 'bg-white text-orange-600 shadow-sm ring-1 ring-gray-100 font-black'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}

                        <div className="relative" ref={moreRef}>
                            <button
                                onClick={() => setMoreOpen(!moreOpen)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all duration-200 ${
                                    moreOpen
                                        ? 'bg-white text-orange-600 shadow-sm ring-1 ring-gray-100 font-black'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
                                }`}
                            >
                                Resources
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${moreOpen ? 'rotate-180 text-orange-500' : ''}`} />
                            </button>

                            {moreOpen && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-white border border-gray-100 rounded-[28px] shadow-2xl p-3 z-50 ring-1 ring-gray-100 animate-in fade-in slide-in-from-top-2">
                                    <div className="grid grid-cols-1 gap-0.5">
                                        {MORE_LINKS.map((item) => (
                                            <Link
                                                key={item.label}
                                                href={item.href}
                                                onClick={() => setMoreOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-orange-50 transition-all group"
                                            >
                                                <div className="w-9 h-9 bg-gray-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center shrink-0 transition-all">
                                                    <item.icon className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-black text-gray-800 group-hover:text-orange-700 leading-none">{item.label}</p>
                                                    <p className="text-[11px] text-gray-400 mt-0.5 font-medium group-hover:text-gray-500">{item.desc}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Right side actions ── */}
                <div className="flex items-center gap-2 ml-auto shrink-0">

                    {/* Language — tertiary */}
                    <div className="relative hidden lg:block" ref={langRef}>
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            <span className="text-base leading-none">{activeLang.flag}</span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {langOpen && (
                            <div className="absolute top-full right-0 mt-3 w-40 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 z-50 ring-1 ring-gray-100 animate-in fade-in slide-in-from-top-2">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => { setActiveLang(lang); setLangOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-bold transition-all rounded-xl ${
                                            activeLang.code === lang.code
                                                ? 'bg-orange-50 text-orange-600 font-black'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="text-base">{lang.flag}</span>
                                        <span>{lang.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Newsletter — secondary */}
                    <Link
                        href="/newsletter"
                        className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-all"
                    >
                        <Mail className="w-4 h-4" />
                        Newsletter
                    </Link>

                    {/* Submit Tool — primary CTA, always orange */}
                    <Link
                        href="/submit"
                        className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-[13px] font-black transition-all duration-200 shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-95 group"
                    >
                        <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                        Submit Tool
                    </Link>

                    {/* User Menu */}
                    <div className="relative" ref={userRef}>
                        {user ? (
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 transition-all border border-orange-200 flex items-center justify-center shadow-sm"
                            >
                                <User className="w-4 h-4" />
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all border border-gray-200"
                            >
                                <User className="w-4 h-4" />
                            </Link>
                        )}
                        {user && userMenuOpen && (
                            <div className="absolute top-full right-0 mt-3 w-56 bg-white border border-gray-100 rounded-3xl shadow-2xl p-2 z-50 ring-1 ring-gray-100">
                                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logged in as</p>
                                    <p className="text-[13px] font-black text-gray-900 truncate mt-0.5">{user.email}</p>
                                </div>
                                {[
                                    { href: '/dashboard', label: 'My Dashboard',    icon: BarChart3 },
                                    { href: '/favorites', label: 'Saved Tools',     icon: Heart },
                                    { href: '/settings',  label: 'Account Settings',icon: Zap },
                                ].map(({ href, label, icon: Icon }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setUserMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-[13px] font-bold text-gray-600 hover:bg-orange-50 hover:text-orange-700 transition-all"
                                    >
                                        <Icon className="w-4 h-4" /> {label}
                                    </Link>
                                ))}
                                <button
                                    onClick={() => { signOut(); setUserMenuOpen(false); }}
                                    className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-[13px] font-bold text-red-500 hover:bg-red-50 w-full text-left transition-all mt-1"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 border border-gray-200"
                    >
                        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 px-4 py-5 flex flex-col gap-1.5 shadow-2xl animate-in fade-in slide-in-from-top-2">
                    {PRIMARY_NAV.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`px-4 py-3 rounded-2xl text-[15px] font-bold transition-all ${
                                isActive(item.href)
                                    ? 'bg-orange-50 text-orange-600 font-black'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="h-px bg-gray-100 my-2" />
                    <Link
                        href="/submit"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-[15px] font-black transition-all shadow-lg shadow-orange-500/20"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Submit Your AI Tool
                    </Link>
                </div>
            )}
        </nav>
    );
}
