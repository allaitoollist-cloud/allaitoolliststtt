'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100">

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

                </div>
            </div>
        </footer>
    );
}
