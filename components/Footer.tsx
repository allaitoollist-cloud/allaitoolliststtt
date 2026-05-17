'use client';

import Link from 'next/link';
import { Mail, Phone, ArrowRight, Twitter, Youtube, Github, Globe } from 'lucide-react';
import { NewsletterForm } from '@/components/NewsletterForm';

const FOOTER_LINKS = {
    Platform: [
        { label: 'Full AI Directory',    href: '/' },
        { label: 'New Tool Submissions', href: '/new' },
        { label: 'Featured Top 10',      href: '/top-10' },
        { label: 'Browse Categories',    href: '/categories' },
        { label: 'Exclusive Deals',      href: '/deals' },
    ],
    Resources: [
        { label: 'AI Video Tutorials',  href: '/tutorials' },
        { label: 'AI Tech Glossary',    href: '/glossary' },
        { label: 'Market Research',     href: '/reports' },
        { label: 'Industry Blog',       href: '/blog' },
        { label: 'AI Jobs Board',       href: '/jobs' },
    ],
    Partnership: [
        { label: 'Advertise with Us',   href: '/advertise' },
        { label: 'Submit Your Tool',    href: '/submit' },
        { label: 'API Documentation',   href: '/api-access' },
        { label: 'Verified Badge',      href: '/verified' },
        { label: 'Affiliate Program',   href: '/affiliates' },
    ],
};

const SOCIALS = [
    { label: 'X (Twitter)', icon: Twitter, href: '#' },
    { label: 'YouTube',     icon: Youtube, href: '#' },
    { label: 'GitHub',      icon: Github,  href: '#' },
    { label: 'Website',     icon: Globe,   href: '#' },
];

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100">

            {/* ── Newsletter Section ── */}
            <div className="max-w-7xl mx-auto px-4 pt-16 pb-10">
                <div className="bg-gray-900 rounded-[40px] px-8 py-10 md:px-14 md:py-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-400/8 rounded-full blur-[60px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                        {/* Left copy */}
                        <div className="space-y-3 lg:max-w-sm">
                            <div className="inline-flex items-center gap-2 text-orange-400 font-black text-xs uppercase tracking-[0.2em]">
                                <Mail className="w-4 h-4" />
                                Weekly AI Digest
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                                The best AI tools,<br />
                                <span className="text-gray-400">delivered weekly.</span>
                            </h3>
                            <p className="text-gray-500 text-[13px] font-bold uppercase tracking-widest">
                                Join 42,000+ AI enthusiasts. No spam.
                            </p>
                        </div>

                        {/* Right form */}
                        <div className="w-full lg:w-[460px]">
                            <NewsletterForm />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Footer Links ── */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-5">
                            <Link href="/" className="flex items-center gap-3 group w-fit">
                                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:shadow-orange-500/40 transition-shadow">
                                    <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
                                        <rect x="6" y="8" width="20" height="14" rx="4" fill="white"/>
                                        <circle cx="12" cy="14" r="2.5" fill="#f97316"/>
                                        <circle cx="20" cy="14" r="2.5" fill="#f97316"/>
                                        <path d="M12 18.5 Q16 21 20 18.5" stroke="#f97316" strokeWidth="2" strokeLinecap="round" fill="none"/>
                                    </svg>
                                </div>
                                <span className="text-[18px] font-black text-gray-900 uppercase tracking-tighter">All AI List</span>
                            </Link>
                            <p className="text-[14px] text-gray-500 font-medium leading-relaxed max-w-xs">
                                The world's largest hand-curated directory of verified AI tools. Navigate the AI revolution with expert human analysis.
                            </p>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Get in Touch</h4>
                            <a
                                href="mailto:hello@allaitoollist.com"
                                className="flex items-center gap-3 text-[14px] font-black text-gray-800 hover:text-orange-600 transition-colors group"
                            >
                                <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors">
                                    <Mail className="w-4 h-4 text-orange-500" />
                                </div>
                                hello@allaitoollist.com
                            </a>
                            <a
                                href="tel:+13073464572"
                                className="flex items-center gap-3 text-[14px] font-black text-gray-800 hover:text-orange-600 transition-colors group"
                            >
                                <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:bg-orange-50 group-hover:border-orange-100 transition-all">
                                    <Phone className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                </div>
                                +1 (307) 346-4572
                            </a>
                        </div>

                        {/* Socials */}
                        <div className="flex items-center gap-2.5">
                            {SOCIALS.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:bg-orange-500 transition-all duration-200 shadow-md shadow-gray-900/10 hover:shadow-orange-500/25 hover:scale-110"
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                        <div key={title} className="space-y-6">
                            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3">
                                {title}
                            </h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-[14px] font-medium text-gray-500 hover:text-orange-600 transition-colors flex items-center gap-1.5 group"
                                        >
                                            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-orange-400" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Bottom Bar ── */}
            <div className="border-t border-gray-100 py-6">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-[13px] font-bold text-gray-400">
                        © {new Date().getFullYear()} All AI List. All rights reserved.
                    </div>

                    <div className="flex items-center gap-6 text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                        {[
                            { label: 'Privacy',  href: '/privacy' },
                            { label: 'Terms',    href: '/terms' },
                            { label: 'Cookies',  href: '/cookies' },
                            { label: 'DMCA',     href: '/dmca' },
                        ].map(({ label, href }) => (
                            <Link key={href} href={href} className="hover:text-gray-900 transition-colors">
                                {label}
                            </Link>
                        ))}
                    </div>

                    <div className="text-[12px] font-bold text-gray-400">
                        Built by <span className="text-gray-700 font-black">One To Five Click</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
