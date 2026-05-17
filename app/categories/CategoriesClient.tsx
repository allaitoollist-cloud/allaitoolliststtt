'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Sparkles, X } from 'lucide-react';

interface Category {
    name: string;
    count: number;
}

interface CategoriesClientProps {
    categories: Category[];
    totalTools: number;
}

// Full class strings must be complete for Tailwind JIT to pick them up
const CATEGORY_CONFIG: Record<string, { emoji: string; bg: string; border: string; countColor: string; hoverBorder: string; hoverBg: string }> = {
    'Writing':        { emoji: '✍️',  bg: 'bg-blue-50',    border: 'border-blue-100',    countColor: 'text-blue-600',    hoverBorder: 'hover:border-blue-300',    hoverBg: 'hover:bg-blue-50' },
    'Text':           { emoji: '📝',  bg: 'bg-blue-50',    border: 'border-blue-100',    countColor: 'text-blue-600',    hoverBorder: 'hover:border-blue-300',    hoverBg: 'hover:bg-blue-50' },
    'Image':          { emoji: '🎨',  bg: 'bg-rose-50',    border: 'border-rose-100',    countColor: 'text-rose-600',    hoverBorder: 'hover:border-rose-300',    hoverBg: 'hover:bg-rose-50' },
    'Art':            { emoji: '🖼️',  bg: 'bg-pink-50',    border: 'border-pink-100',    countColor: 'text-pink-600',    hoverBorder: 'hover:border-pink-300',    hoverBg: 'hover:bg-pink-50' },
    'Design':         { emoji: '🖌️',  bg: 'bg-fuchsia-50', border: 'border-fuchsia-100', countColor: 'text-fuchsia-600', hoverBorder: 'hover:border-fuchsia-300', hoverBg: 'hover:bg-fuchsia-50' },
    'Video':          { emoji: '🎬',  bg: 'bg-purple-50',  border: 'border-purple-100',  countColor: 'text-purple-600',  hoverBorder: 'hover:border-purple-300',  hoverBg: 'hover:bg-purple-50' },
    'Audio':          { emoji: '🎵',  bg: 'bg-amber-50',   border: 'border-amber-100',   countColor: 'text-amber-600',   hoverBorder: 'hover:border-amber-300',   hoverBg: 'hover:bg-amber-50' },
    'Music':          { emoji: '🎼',  bg: 'bg-amber-50',   border: 'border-amber-100',   countColor: 'text-amber-600',   hoverBorder: 'hover:border-amber-300',   hoverBg: 'hover:bg-amber-50' },
    'Voice':          { emoji: '🎙️', bg: 'bg-amber-50',   border: 'border-amber-100',   countColor: 'text-amber-600',   hoverBorder: 'hover:border-amber-300',   hoverBg: 'hover:bg-amber-50' },
    'Code':           { emoji: '💻',  bg: 'bg-emerald-50', border: 'border-emerald-100', countColor: 'text-emerald-600', hoverBorder: 'hover:border-emerald-300', hoverBg: 'hover:bg-emerald-50' },
    'Development':    { emoji: '⌨️',  bg: 'bg-cyan-50',    border: 'border-cyan-100',    countColor: 'text-cyan-600',    hoverBorder: 'hover:border-cyan-300',    hoverBg: 'hover:bg-cyan-50' },
    'Chat':           { emoji: '💬',  bg: 'bg-green-50',   border: 'border-green-100',   countColor: 'text-green-600',   hoverBorder: 'hover:border-green-300',   hoverBg: 'hover:bg-green-50' },
    'Chatbot':        { emoji: '🤖',  bg: 'bg-green-50',   border: 'border-green-100',   countColor: 'text-green-600',   hoverBorder: 'hover:border-green-300',   hoverBg: 'hover:bg-green-50' },
    'Marketing':      { emoji: '📣',  bg: 'bg-orange-50',  border: 'border-orange-100',  countColor: 'text-orange-600',  hoverBorder: 'hover:border-orange-300',  hoverBg: 'hover:bg-orange-50' },
    'SEO':            { emoji: '🔍',  bg: 'bg-yellow-50',  border: 'border-yellow-100',  countColor: 'text-yellow-700',  hoverBorder: 'hover:border-yellow-300',  hoverBg: 'hover:bg-yellow-50' },
    'Data':           { emoji: '📊',  bg: 'bg-indigo-50',  border: 'border-indigo-100',  countColor: 'text-indigo-600',  hoverBorder: 'hover:border-indigo-300',  hoverBg: 'hover:bg-indigo-50' },
    'Analytics':      { emoji: '📈',  bg: 'bg-indigo-50',  border: 'border-indigo-100',  countColor: 'text-indigo-600',  hoverBorder: 'hover:border-indigo-300',  hoverBg: 'hover:bg-indigo-50' },
    'Business':       { emoji: '💼',  bg: 'bg-slate-50',   border: 'border-slate-200',   countColor: 'text-slate-600',   hoverBorder: 'hover:border-slate-300',   hoverBg: 'hover:bg-slate-100' },
    'Productivity':   { emoji: '⚡',  bg: 'bg-sky-50',     border: 'border-sky-100',     countColor: 'text-sky-600',     hoverBorder: 'hover:border-sky-300',     hoverBg: 'hover:bg-sky-50' },
    'Automation':     { emoji: '🔄',  bg: 'bg-sky-50',     border: 'border-sky-100',     countColor: 'text-sky-600',     hoverBorder: 'hover:border-sky-300',     hoverBg: 'hover:bg-sky-50' },
    'Research':       { emoji: '🔬',  bg: 'bg-violet-50',  border: 'border-violet-100',  countColor: 'text-violet-600',  hoverBorder: 'hover:border-violet-300',  hoverBg: 'hover:bg-violet-50' },
    'Education':      { emoji: '📚',  bg: 'bg-teal-50',    border: 'border-teal-100',    countColor: 'text-teal-600',    hoverBorder: 'hover:border-teal-300',    hoverBg: 'hover:bg-teal-50' },
    'Customer':       { emoji: '🤝',  bg: 'bg-lime-50',    border: 'border-lime-100',    countColor: 'text-lime-700',    hoverBorder: 'hover:border-lime-300',    hoverBg: 'hover:bg-lime-50' },
    'Sales':          { emoji: '💰',  bg: 'bg-green-50',   border: 'border-green-100',   countColor: 'text-green-600',   hoverBorder: 'hover:border-green-300',   hoverBg: 'hover:bg-green-50' },
    'Finance':        { emoji: '💹',  bg: 'bg-emerald-50', border: 'border-emerald-100', countColor: 'text-emerald-600', hoverBorder: 'hover:border-emerald-300', hoverBg: 'hover:bg-emerald-50' },
    'Legal':          { emoji: '⚖️', bg: 'bg-stone-50',   border: 'border-stone-200',   countColor: 'text-stone-600',   hoverBorder: 'hover:border-stone-300',   hoverBg: 'hover:bg-stone-100' },
    'HR':             { emoji: '👥',  bg: 'bg-rose-50',    border: 'border-rose-100',    countColor: 'text-rose-600',    hoverBorder: 'hover:border-rose-300',    hoverBg: 'hover:bg-rose-50' },
    '3D':             { emoji: '🧊',  bg: 'bg-indigo-50',  border: 'border-indigo-100',  countColor: 'text-indigo-600',  hoverBorder: 'hover:border-indigo-300',  hoverBg: 'hover:bg-indigo-50' },
    'Game':           { emoji: '🎮',  bg: 'bg-lime-50',    border: 'border-lime-100',    countColor: 'text-lime-700',    hoverBorder: 'hover:border-lime-300',    hoverBg: 'hover:bg-lime-50' },
    'Gaming':         { emoji: '🎮',  bg: 'bg-lime-50',    border: 'border-lime-100',    countColor: 'text-lime-700',    hoverBorder: 'hover:border-lime-300',    hoverBg: 'hover:bg-lime-50' },
    'Social':         { emoji: '📱',  bg: 'bg-blue-50',    border: 'border-blue-100',    countColor: 'text-blue-600',    hoverBorder: 'hover:border-blue-300',    hoverBg: 'hover:bg-blue-50' },
    'Email':          { emoji: '📧',  bg: 'bg-orange-50',  border: 'border-orange-100',  countColor: 'text-orange-600',  hoverBorder: 'hover:border-orange-300',  hoverBg: 'hover:bg-orange-50' },
    'Translation':    { emoji: '🌐',  bg: 'bg-teal-50',    border: 'border-teal-100',    countColor: 'text-teal-600',    hoverBorder: 'hover:border-teal-300',    hoverBg: 'hover:bg-teal-50' },
    'Healthcare':     { emoji: '🏥',  bg: 'bg-red-50',     border: 'border-red-100',     countColor: 'text-red-600',     hoverBorder: 'hover:border-red-300',     hoverBg: 'hover:bg-red-50' },
    'Security':       { emoji: '🔐',  bg: 'bg-slate-50',   border: 'border-slate-200',   countColor: 'text-slate-700',   hoverBorder: 'hover:border-slate-300',   hoverBg: 'hover:bg-slate-100' },
    'Presentation':   { emoji: '📊',  bg: 'bg-orange-50',  border: 'border-orange-100',  countColor: 'text-orange-600',  hoverBorder: 'hover:border-orange-300',  hoverBg: 'hover:bg-orange-50' },
    'Summarization':  { emoji: '📝',  bg: 'bg-yellow-50',  border: 'border-yellow-100',  countColor: 'text-yellow-700',  hoverBorder: 'hover:border-yellow-300',  hoverBg: 'hover:bg-yellow-50' },
    'Agent':          { emoji: '🤖',  bg: 'bg-violet-50',  border: 'border-violet-100',  countColor: 'text-violet-600',  hoverBorder: 'hover:border-violet-300',  hoverBg: 'hover:bg-violet-50' },
};

const DEFAULT_CONFIG = {
    emoji: '✨',
    bg: 'bg-gray-50',
    border: 'border-gray-100',
    countColor: 'text-orange-600',
    hoverBorder: 'hover:border-orange-200',
    hoverBg: 'hover:bg-orange-50',
};

function getCategoryConfig(name: string) {
    // Direct match
    if (CATEGORY_CONFIG[name]) return CATEGORY_CONFIG[name];
    // Keyword match
    const key = Object.keys(CATEGORY_CONFIG).find(k => name.includes(k));
    return key ? CATEGORY_CONFIG[key] : DEFAULT_CONFIG;
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    'Writing': 'AI writing assistants, content generators, grammar tools',
    'Text': 'Text analysis, summarization, and generation tools',
    'Image': 'AI art generators, image editors, and design AI',
    'Design': 'UI/UX design tools, prototyping, and creative AI',
    'Video': 'Video creation, editing, and generation with AI',
    'Audio': 'Music generation, voice cloning, and audio editing',
    'Code': 'AI coding assistants, debuggers, and dev tools',
    'Chat': 'Chatbots, conversational AI, and assistants',
    'Marketing': 'Ad copy, social media, and campaign tools',
    'SEO': 'Search optimization and content strategy tools',
    'Data': 'Data analysis, visualization, and insights',
    'Business': 'Business automation and workflow tools',
    'Productivity': 'Task management and workflow optimization',
    'Research': 'Academic and market research assistance',
    'Education': 'Learning tools, tutors, and course creators',
    'Customer': 'Support, CRM, and customer success tools',
};

function getDescription(name: string): string {
    const key = Object.keys(CATEGORY_DESCRIPTIONS).find(k => name.includes(k));
    return key ? CATEGORY_DESCRIPTIONS[key] : 'Curated AI tools for this category';
}

export default function CategoriesClient({ categories, totalTools }: CategoriesClientProps) {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'count' | 'name'>('count');

    const filtered = useMemo(() => {
        let list = categories.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase())
        );
        if (sortBy === 'count') return [...list].sort((a, b) => b.count - a.count);
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }, [categories, search, sortBy]);

    const isSearching = search.length > 0;
    const featuredCats = isSearching ? [] : filtered.slice(0, 6);
    const gridCats     = isSearching ? filtered : filtered.slice(6);

    return (
        <div>
            {/* ── Hero ── */}
            <div className="relative bg-gradient-to-b from-[#fff8f4] via-[#fffcfa] to-white border-b border-gray-100 overflow-hidden">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-orange-100/50 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-0 -right-10 w-[250px] h-[300px] bg-amber-50/60 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-5xl mx-auto px-4 pt-14 pb-12 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white border border-orange-200 shadow-sm rounded-full px-4 py-1.5 mb-7">
                        <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-[13px] font-bold text-gray-700">
                            <span className="text-orange-600 font-black">{categories.length}</span> categories ·{' '}
                            <span className="text-orange-600 font-black">{totalTools.toLocaleString()}+</span> verified tools
                        </span>
                    </div>

                    <h1 className="text-[42px] md:text-[58px] font-black text-gray-900 leading-[1.06] tracking-tight mb-5">
                        Browse AI Tools<br />
                        <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                            by Category
                        </span>
                    </h1>
                    <p className="text-[18px] text-gray-700 mb-10 max-w-xl mx-auto font-medium leading-relaxed">
                        Every category is hand-curated and updated daily. Find the perfect AI tool for any task or workflow.
                    </p>

                    {/* Search */}
                    <div className="relative max-w-xl mx-auto">
                        <div className="flex items-center bg-white border-2 border-gray-200 focus-within:border-orange-400 focus-within:shadow-[0_0_0_4px_rgba(249,115,22,0.08)] rounded-2xl shadow-lg overflow-hidden transition-all">
                            <div className="pl-5 pr-3 shrink-0">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Filter categories..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="flex-1 py-4 text-[16px] bg-transparent outline-none placeholder:text-gray-400 text-gray-900 font-medium"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="pr-4 text-gray-400 hover:text-gray-700 transition-colors"
                                    aria-label="Clear search"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main content ── */}
            <div className="max-w-7xl mx-auto px-4 py-12">

                {/* Controls row */}
                <div className="flex items-center justify-between mb-10">
                    <p className="text-[15px] font-bold text-gray-500">
                        {filtered.length === categories.length
                            ? `${categories.length} categories`
                            : `${filtered.length} of ${categories.length} categories`}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest hidden sm:inline">Sort:</span>
                        <button
                            onClick={() => setSortBy('count')}
                            className={`px-3 py-1.5 rounded-xl text-[12px] font-black transition-all ${
                                sortBy === 'count'
                                    ? 'bg-orange-500 text-white shadow-md'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'
                            }`}
                        >
                            Most Tools
                        </button>
                        <button
                            onClick={() => setSortBy('name')}
                            className={`px-3 py-1.5 rounded-xl text-[12px] font-black transition-all ${
                                sortBy === 'name'
                                    ? 'bg-orange-500 text-white shadow-md'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'
                            }`}
                        >
                            A–Z
                        </button>
                    </div>
                </div>

                {/* Empty state */}
                {filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="text-5xl mb-4">🔍</div>
                        <p className="text-xl font-black text-gray-900 mb-2">No categories found</p>
                        <p className="text-gray-500 font-medium mb-6">Try a different search term</p>
                        <button
                            onClick={() => setSearch('')}
                            className="px-8 py-3 bg-orange-500 text-white font-black rounded-2xl shadow-lg hover:bg-orange-600 transition-all"
                        >
                            Show All
                        </button>
                    </div>
                ) : (
                    <div className="space-y-14">

                        {/* Featured top 6 */}
                        {featuredCats.length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <h2 className="text-[20px] font-black text-gray-900">Top Categories</h2>
                                    <span className="text-[11px] font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 uppercase tracking-widest">
                                        Most Popular
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {featuredCats.map((cat) => {
                                        const cfg = getCategoryConfig(cat.name);
                                        const desc = getDescription(cat.name);
                                        return (
                                            <Link
                                                key={cat.name}
                                                href={`/category/${encodeURIComponent(cat.name)}`}
                                                className={`group flex items-start gap-5 p-6 rounded-[24px] bg-white border-2 ${cfg.border} ${cfg.hoverBorder} ${cfg.hoverBg} transition-all duration-200 hover:shadow-xl hover:-translate-y-1`}
                                            >
                                                {/* Emoji */}
                                                <div className={`w-16 h-16 ${cfg.bg} rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                                                    {cfg.emoji}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-[17px] font-black text-gray-900 mb-1 group-hover:text-orange-600 transition-colors leading-tight">
                                                        {cat.name}
                                                    </h3>
                                                    <p className="text-[12px] text-gray-500 font-medium mb-3 leading-relaxed line-clamp-2">
                                                        {desc}
                                                    </p>
                                                    <div className="flex items-baseline gap-1.5">
                                                        <span className={`text-[26px] font-black leading-none ${cfg.countColor}`}>{cat.count}</span>
                                                        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wide">tools</span>
                                                    </div>
                                                </div>

                                                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Remaining / search results grid */}
                        {gridCats.length > 0 && (
                            <div>
                                {!isSearching && (
                                    <h2 className="text-[18px] font-black text-gray-900 mb-6">
                                        All Categories
                                        <span className="ml-2 text-[14px] font-bold text-gray-400">({gridCats.length})</span>
                                    </h2>
                                )}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {gridCats.map((cat) => {
                                        const cfg = getCategoryConfig(cat.name);
                                        return (
                                            <Link
                                                key={cat.name}
                                                href={`/category/${encodeURIComponent(cat.name)}`}
                                                className={`group flex flex-col p-5 rounded-[20px] bg-white border ${cfg.border} ${cfg.hoverBorder} ${cfg.hoverBg} transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`}
                                            >
                                                <div className={`w-11 h-11 ${cfg.bg} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-200 shrink-0`}>
                                                    {cfg.emoji}
                                                </div>
                                                <h3 className="text-[13px] font-black text-gray-900 leading-tight group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
                                                    {cat.name}
                                                </h3>
                                                <div className="flex items-baseline gap-1 mt-auto pt-2 border-t border-gray-50">
                                                    <span className={`text-[20px] font-black leading-none ${cfg.countColor}`}>{cat.count}</span>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide">tools</span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
