'use client';

import { useState, useMemo, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { SEOContent } from '@/components/SEOContent';
import { ToolCard } from '@/components/ToolCard';
import { Footer } from '@/components/Footer';
import { AdUnit } from '@/components/AdUnit';
import { AINewsSection } from '@/components/AINewsSection';
import { ComparisonBar } from '@/components/ComparisonBar';
import { Search, X, ArrowRight, SlidersHorizontal, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Tool } from '@/types';

interface CategoryWithCount {
    name: string;
    count: number;
    description: string;
}

interface HomeClientProps {
    initialTools: Tool[];
    categories?: CategoryWithCount[];
}

const CAT_EMOJI: Record<string, string> = {
    'Text & Writing':      '✍️',
    'Writing':             '✍️',
    'Writing & Content':   '✍️',
    'Image Generation':    '🎨',
    'Image':               '🎨',
    'Art & Images':        '🎨',
    'Video & Audio':       '🎬',
    'Video':               '🎬',
    'Audio':               '🎵',
    'Music':               '🎵',
    'Music & Audio':       '🎵',
    'Code & Development':  '💻',
    'Code':                '💻',
    'Developer Tools':     '💻',
    'Productivity':        '⚡',
    'Marketing':           '📈',
    'Marketing & SEO':     '📈',
    'SEO':                 '🔎',
    'Design':              '🎯',
    'Design & UI':         '🎯',
    'UI/UX':               '🎯',
    'Data & Analytics':    '📊',
    'Analytics':           '📊',
    'Customer Support':    '💬',
    'Chatbots':            '🤖',
    'Chatbots & AI':       '🤖',
    'Sales':               '💼',
    'Business':            '💼',
    'Business & Sales':    '💼',
    'Education':           '🎓',
    'Education & Learning':'🎓',
    'Research':            '🔍',
    'Research & Analysis': '🔍',
    'Finance':             '💰',
    'Legal':               '⚖️',
    'Translation':         '🌐',
    'Translation & Language':'🌐',
    'Social Media':        '📱',
    'Security':            '🔒',
    'Security & Privacy':  '🔒',
    'Health':              '🏥',
    'Health & Wellness':   '🏥',
    'HR & Recruiting':     '👥',
    'E-commerce':          '🛒',
    'Real Estate':         '🏠',
    'Travel':              '✈️',
    'Food':                '🍔',
    'Sports':              '⚽',
    'Gaming':              '🎮',
    'News':                '📰',
    'Presentation':        '📊',
    'Automation':          '⚙️',
    '3D':                  '🎲',
    'Avatars':             '🧑‍💻',
    'Logo':                '✨',
    'Summarizer':          '📋',
    'General Writing':     '📝',
    'Storytelling':        '📖',
    'Copywriting':         '✏️',
    'Email':               '📧',
    'Spreadsheets':        '📑',
    'PDF':                 '📄',
    'Meeting':             '📅',
    'Voice':               '🎤',
    'Speech':              '🗣️',
    'Transcription':       '📝',
    'Prompts':             '💡',
    'AI Detector':         '🔬',
    'Search':              '🔍',
    'Other':               '📁',
};

function getCatEmoji(name: string) {
    if (CAT_EMOJI[name]) return CAT_EMOJI[name];
    for (const [key, emoji] of Object.entries(CAT_EMOJI)) {
        if (name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(name.toLowerCase())) {
            return emoji;
        }
    }
    return '📁';
}

// ─── Sidebar ───────────────────────────────────────────────────────────────
function Sidebar({
    totalCount,
    categories,
    selected,
    onSelect,
}: {
    totalCount: number;
    categories: { name: string; count: number }[];
    selected: string;
    onSelect: (cat: string) => void;
}) {
    return (
        <div className="pt-4 pb-10">
            {/* Count header */}
            <div className="px-4 pb-4 border-b border-gray-100 mb-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">AI Tools Directory</p>
                <p className="text-[26px] font-black text-gray-900 leading-none tabular-nums">
                    <span className="text-orange-500">{totalCount.toLocaleString()}</span>+
                </p>
                <p className="text-xs text-gray-500 mt-1.5">across {categories.length} categories</p>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 pt-3 pb-1">Browse</p>

            {/* All Tools row */}
            <button
                onClick={() => onSelect('')}
                className={`w-full flex items-center justify-between px-4 py-2 text-left transition-colors group ${
                    !selected
                        ? 'bg-orange-50 border-r-2 border-orange-500'
                        : 'hover:bg-gray-100/70'
                }`}
            >
                <div className="flex items-center gap-2">
                    <span className="text-[15px] leading-none">🌐</span>
                    <span className={`text-[13px] ${!selected ? 'font-bold text-orange-600' : 'font-medium text-gray-700 group-hover:text-gray-900'}`}>
                        All Tools
                    </span>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full tabular-nums ${!selected ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                    {totalCount.toLocaleString()}
                </span>
            </button>

            {/* Categories */}
            {categories.map(cat => {
                const active = selected === cat.name;
                return (
                    <button
                        key={cat.name}
                        onClick={() => onSelect(cat.name)}
                        className={`w-full flex items-center justify-between px-4 py-[7px] text-left transition-colors group ${
                            active
                                ? 'bg-orange-50 border-r-2 border-orange-500'
                                : 'hover:bg-gray-100/70'
                        }`}
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm leading-none shrink-0">{getCatEmoji(cat.name)}</span>
                            <span className={`text-[13px] truncate ${active ? 'font-bold text-orange-600' : 'font-medium text-gray-700 group-hover:text-gray-900'}`}>
                                {cat.name}
                            </span>
                        </div>
                        <span className={`text-[11px] font-semibold shrink-0 px-2 py-0.5 rounded-full ml-1 tabular-nums ${active ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                            {cat.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

// ─── Sponsored banner ───────────────────────────────────────────────────────
function SponsoredBanner() {
    return (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50/60 border border-orange-100 rounded-xl p-4 flex items-center gap-4 mb-5">
            <div className="text-2xl leading-none">🚀</div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-wider text-orange-500 mb-0.5">⭐ Grow your AI tool</p>
                <p className="text-sm font-bold text-gray-900">Submit your tool — reach 50,000+ monthly visitors</p>
                <p className="text-xs text-gray-500 mt-0.5">Featured listing with priority 24h review • from $49</p>
            </div>
            <Link
                href="/submit"
                className="shrink-0 text-xs font-bold text-orange-600 bg-white border border-orange-200 rounded-lg px-4 py-2 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all whitespace-nowrap"
            >
                Get Listed →
            </Link>
        </div>
    );
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function HomeClient({ initialTools, categories = [] }: HomeClientProps) {
    const [searchQuery,       setSearchQuery]       = useState('');
    const [selectedPricing,   setSelectedPricing]   = useState<string[]>([]);
    const [selectedCategory,  setSelectedCategory]  = useState('');
    const [currentPage,       setCurrentPage]       = useState(1);
    const [sortBy,            setSortBy]            = useState<'latest' | 'popular' | 'name'>('latest');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const ITEMS_PER_PAGE = 24;

    const allCategories = useMemo(() => {
        const cats = new Map<string, number>();
        initialTools.forEach(t => {
            if (t.category) cats.set(t.category, (cats.get(t.category) || 0) + 1);
        });
        return Array.from(cats.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }, [initialTools]);

    const filteredTools = useMemo(() => {
        let list = initialTools.filter(tool => {
            const q = searchQuery.toLowerCase().trim();
            const matchSearch = !q ||
                tool.name.toLowerCase().includes(q) ||
                tool.shortDescription.toLowerCase().includes(q) ||
                (tool.tags || []).some((t: string) => t.toLowerCase().includes(q));
            const matchPricing = selectedPricing.length === 0 || selectedPricing.includes(tool.pricing);
            const matchCat     = !selectedCategory || tool.category === selectedCategory;
            return matchSearch && matchPricing && matchCat;
        });

        return [...list].sort((a, b) => {
            if (sortBy === 'latest')  return (new Date(b.dateAdded || 0).getTime()) - (new Date(a.dateAdded || 0).getTime());
            if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
            return a.name.localeCompare(b.name);
        });
    }, [initialTools, searchQuery, selectedPricing, selectedCategory, sortBy]);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedPricing, selectedCategory, sortBy]);

    const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE);
    const pagedTools = filteredTools.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const isFiltered = searchQuery !== '' || selectedPricing.length > 0 || selectedCategory !== '';

    const togglePricing = (p: string) =>
        setSelectedPricing(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

    const clearAll = () => { setSearchQuery(''); setSelectedPricing([]); setSelectedCategory(''); };

    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            {/* ── Search Strip ─────────────────────────────── */}
            <div className="sticky top-[60px] z-40 bg-white border-b border-gray-100 shadow-sm">
                <div className="flex items-center gap-2.5 px-4 py-3 flex-wrap sm:flex-nowrap">

                    {/* Mobile sidebar toggle */}
                    <button
                        onClick={() => setMobileSidebarOpen(true)}
                        className="lg:hidden flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 shrink-0"
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Categories
                    </button>

                    {/* Search input */}
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={`Search ${initialTools.length.toLocaleString()}+ AI tools...`}
                            className="w-full h-10 pl-9 pr-8 border border-gray-200 rounded-xl text-[13.5px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-gray-50 focus:bg-white transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Category dropdown */}
                    <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="hidden sm:block h-10 px-3 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-700 bg-gray-50 focus:outline-none focus:border-orange-400 cursor-pointer min-w-[150px] shrink-0"
                    >
                        <option value="">All Categories</option>
                        {allCategories.map(c => (
                            <option key={c.name} value={c.name}>{c.name} ({c.count})</option>
                        ))}
                    </select>

                    {/* Pricing pills */}
                    <div className="hidden md:flex items-center gap-1.5 shrink-0">
                        {(['Free', 'Freemium', 'Paid'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => togglePricing(p)}
                                className={`text-[12px] font-bold px-3.5 py-2 rounded-full border transition-all ${
                                    selectedPricing.includes(p)
                                        ? p === 'Free'
                                            ? 'bg-emerald-500 border-emerald-500 text-white'
                                            : p === 'Freemium'
                                            ? 'bg-amber-500 border-amber-500 text-white'
                                            : 'bg-gray-700 border-gray-700 text-white'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                        {isFiltered && (
                            <button
                                onClick={clearAll}
                                className="text-[12px] font-bold px-3 py-2 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-all flex items-center gap-1"
                            >
                                <X className="w-3 h-3" /> Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Body ─────────────────────────────────────── */}
            <div className="flex flex-1">

                {/* Mobile sidebar overlay */}
                {mobileSidebarOpen && (
                    <div className="fixed inset-0 z-[200] lg:hidden">
                        <div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setMobileSidebarOpen(false)}
                        />
                        <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl overflow-y-auto">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                <span className="font-black text-gray-900">Categories</span>
                                <button onClick={() => setMobileSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <Sidebar
                                totalCount={initialTools.length}
                                categories={allCategories}
                                selected={selectedCategory}
                                onSelect={cat => { setSelectedCategory(cat); setMobileSidebarOpen(false); }}
                            />
                        </aside>
                    </div>
                )}

                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-52 shrink-0 border-r border-gray-100 sticky top-[121px] h-[calc(100vh-121px)] overflow-y-auto bg-gray-50/40">
                    <Sidebar
                        totalCount={initialTools.length}
                        categories={allCategories}
                        selected={selectedCategory}
                        onSelect={setSelectedCategory}
                    />
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0 px-4 lg:px-5 py-5">

                    {/* Results header + sort */}
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                        <p className="text-[13px] font-semibold text-gray-500">
                            {isFiltered
                                ? <><span className="font-black text-gray-900">{filteredTools.length.toLocaleString()}</span> results{selectedCategory ? <span className="text-orange-500"> · {selectedCategory}</span> : ''}</>
                                : <>Showing <span className="font-black text-gray-900">{filteredTools.length.toLocaleString()}</span> tools</>
                            }
                        </p>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[12px] text-gray-400 font-medium mr-1">Sort:</span>
                            {(['latest', 'popular', 'name'] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSortBy(s)}
                                    className={`text-[12px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                                        sortBy === s
                                            ? 'bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-200'
                                            : 'bg-white border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-600'
                                    }`}
                                >
                                    {s === 'latest' ? 'Newest' : s === 'popular' ? 'Popular' : 'A–Z'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sponsored banner (home only) */}
                    {!isFiltered && <SponsoredBanner />}

                    {/* Tool Grid */}
                    {pagedTools.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {pagedTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-1.5 mt-10 mb-4">
                                    <button
                                        onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); scrollTop(); }}
                                        disabled={currentPage === 1}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-all"
                                    >
                                        <ArrowRight className="w-4 h-4 rotate-180" />
                                    </button>

                                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                        let p = i + 1;
                                        if (totalPages > 7) {
                                            if (currentPage > 4) p = currentPage - 3 + i;
                                            if (currentPage > totalPages - 3) p = totalPages - 6 + i;
                                        }
                                        if (p < 1 || p > totalPages) return null;
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => { setCurrentPage(p); scrollTop(); }}
                                                className={`w-9 h-9 flex items-center justify-center rounded-xl text-[13px] font-bold transition-all tabular-nums ${
                                                    currentPage === p
                                                        ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                                                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-orange-200'
                                                }`}
                                            >{p}</button>
                                        );
                                    })}

                                    <button
                                        onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); scrollTop(); }}
                                        disabled={currentPage === totalPages}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-all"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl">
                            <p className="text-gray-400 font-bold mb-4 text-base">No tools found for your filters</p>
                            <button
                                onClick={clearAll}
                                className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* Bottom content (home page only, page 1) */}
                    {!isFiltered && currentPage === 1 && (
                        <div className="mt-16 space-y-16">
                            <AINewsSection />
                            <SEOContent categories={categories} />
                        </div>
                    )}

                    <div className="mt-8">
                        <AdUnit slot="3924871065" format="horizontal" className="text-center" />
                    </div>
                </main>
            </div>

            <Footer />
            <ComparisonBar />
        </div>
    );
}
