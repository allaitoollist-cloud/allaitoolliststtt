'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { SEOContent } from '@/components/SEOContent';
import { ToolCard } from '@/components/ToolCard';
import { Footer } from '@/components/Footer';
import { TrendingCategories } from '@/components/TrendingCategories';
import { AdUnit } from '@/components/AdUnit';
import { AINewsSection } from '@/components/AINewsSection';
import { ComparisonBar } from '@/components/ComparisonBar';
import { SlidersHorizontal, X, Zap, Star, ArrowRight, TrendingUp } from 'lucide-react';
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

const PRICING_OPTIONS = ['Free', 'Freemium', 'Paid', 'Contact for Pricing'];

const pricingBadgeCls = (p: string) => {
    if (p === 'Free')      return 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200';
    if (p === 'Freemium')  return 'bg-amber-100  text-amber-800  ring-1 ring-amber-200';
    if (p === 'Paid')      return 'bg-zinc-100  text-zinc-800   ring-1 ring-zinc-200';
    return 'bg-gray-100 text-gray-700 ring-1 ring-gray-200';
};

function ToolRow({ tool, idx }: { tool: Tool; idx: number }) {
    return (
        <Link
            href={`/tool/${tool.slug}`}
            className="flex items-center gap-4 py-3.5 px-4 rounded-2xl hover:bg-white hover:shadow-md hover:ring-1 hover:ring-orange-100 transition-all duration-200 group"
        >
            <span className="text-[13px] font-black text-gray-200 w-6 shrink-0 tabular-nums text-center group-hover:text-orange-300 transition-colors">
                {String(idx + 1).padStart(2, '0')}
            </span>

            <div className="w-10 h-10 rounded-xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm group-hover:shadow-md group-hover:border-orange-100 transition-all">
                {tool.icon
                    ? <Image src={tool.icon} alt={tool.name} width={40} height={40} className="object-contain" />
                    : <span className="text-sm font-black text-gray-400">{tool.name.charAt(0)}</span>
                }
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-[14px] font-black text-gray-900 truncate group-hover:text-orange-600 transition-colors leading-none">
                        {tool.name}
                    </p>
                    {tool.verified && (
                        <span className="flex items-center justify-center w-3.5 h-3.5 bg-orange-500 rounded-full shrink-0" title="Verified">
                            <svg viewBox="0 0 24 24" className="w-2 h-2 text-white fill-current" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17L4 12" fill="none"/></svg>
                        </span>
                    )}
                </div>
                <p className="text-[12px] text-gray-500 truncate mt-1 group-hover:text-gray-600 transition-colors leading-none">
                    {tool.shortDescription}
                </p>
            </div>

            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${pricingBadgeCls(tool.pricing)}`}>
                {tool.pricing === 'Contact for Pricing' ? 'Custom' : tool.pricing}
            </span>
        </Link>
    );
}

const SECTION_CONFIGS = [
    {
        id: 'latest',
        title: 'Recently Added',
        icon: <Zap className="w-4 h-4 text-orange-500" />,
        href: '/new',
        accentColor: 'bg-orange-500',
        filter: (tools: Tool[]) => tools.slice(0, 10),
        bgColor: 'bg-orange-50/40',
        borderColor: 'border-orange-100',
        headerBg: 'from-orange-50 to-transparent',
    },
    {
        id: 'featured',
        title: 'Our Selection',
        icon: <Star className="w-4 h-4 text-amber-500" />,
        href: '/categories',
        accentColor: 'bg-amber-400',
        filter: (tools: Tool[]) => {
            const feat = tools.filter(t => t.featured);
            return (feat.length > 0 ? feat : tools.slice(10, 20)).slice(0, 10);
        },
        bgColor: 'bg-amber-50/40',
        borderColor: 'border-amber-100',
        headerBg: 'from-amber-50 to-transparent',
    },
    {
        id: 'trending',
        title: 'Most Popular',
        icon: <TrendingUp className="w-4 h-4 text-rose-500" />,
        href: '/top-10',
        accentColor: 'bg-rose-500',
        filter: (tools: Tool[]) => {
            const tr = tools.filter(t => t.trending);
            return (tr.length > 0 ? tr : tools.slice(20, 30)).slice(0, 10);
        },
        bgColor: 'bg-rose-50/40',
        borderColor: 'border-rose-100',
        headerBg: 'from-rose-50 to-transparent',
    },
];

export default function HomeClient({ initialTools, categories = [] }: HomeClientProps) {
    const [searchQuery, setSearchQuery]               = useState('');
    const [selectedPricing, setSelectedPricing]       = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [showFilters, setShowFilters]               = useState(false);
    const [currentPage, setCurrentPage]               = useState(1);
    const [sortBy, setSortBy]                         = useState<'latest' | 'popular' | 'name'>('latest');
    const ITEMS_PER_PAGE = 24;

    const isFiltering = searchQuery !== '' || selectedPricing.length > 0 || selectedCategories.length > 0;

    const allCategories = useMemo(() => {
        const cats = new Set<string>();
        initialTools.forEach(t => { if (t.category) cats.add(t.category); });
        return Array.from(cats).sort();
    }, [initialTools]);

    const filteredTools = useMemo(() => {
        let list = initialTools.filter(tool => {
            const q = searchQuery.toLowerCase();
            const matchSearch = !q ||
                tool.name.toLowerCase().includes(q) ||
                tool.shortDescription.toLowerCase().includes(q) ||
                (tool.tags || []).some((t: string) => t.toLowerCase().includes(q));
            const matchPricing = selectedPricing.length === 0 || selectedPricing.includes(tool.pricing);
            const matchCat     = selectedCategories.length === 0 || selectedCategories.includes(tool.category);
            return matchSearch && matchPricing && matchCat;
        });

        list = [...list].sort((a, b) => {
            if (sortBy === 'latest')  return (new Date(b.dateAdded || 0).getTime()) - (new Date(a.dateAdded || 0).getTime());
            if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
            return a.name.localeCompare(b.name);
        });
        return list;
    }, [initialTools, searchQuery, selectedPricing, selectedCategories, sortBy]);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedPricing, selectedCategories]);

    const resetFilters = () => { setSearchQuery(''); setSelectedPricing([]); setSelectedCategories([]); };
    const totalPages   = Math.ceil(filteredTools.length / ITEMS_PER_PAGE);
    const pagedTools   = filteredTools.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/30">
            <Navbar onSearch={setSearchQuery} />
            <Hero onSearch={setSearchQuery} toolCount={initialTools.length || 5375} />

            <main className="flex-grow">

                {/* ─── FILTERED / SEARCH VIEW ─── */}
                {isFiltering ? (
                    <div className="max-w-7xl mx-auto px-4 py-12">
                        {/* Filter bar */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 mb-10">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2 mr-2">
                                    <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Sort:</span>
                                    <select
                                        value={sortBy}
                                        onChange={e => setSortBy(e.target.value as 'latest' | 'popular' | 'name')}
                                        className="text-sm border-0 font-bold text-gray-900 focus:ring-0 cursor-pointer bg-transparent"
                                    >
                                        <option value="latest">Newest First</option>
                                        <option value="popular">Most Popular</option>
                                        <option value="name">Alphabetical</option>
                                    </select>
                                </div>

                                <div className="h-6 w-px bg-gray-100 hidden sm:block mx-2" />

                                {PRICING_OPTIONS.map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setSelectedPricing(prev =>
                                            prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}
                                        className={`text-xs font-bold px-4 py-2 rounded-xl border-2 transition-all ${
                                            selectedPricing.includes(p)
                                                ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-100'
                                                : 'bg-white border-gray-100 text-gray-500 hover:border-orange-200 hover:text-orange-600'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border-2 transition-all ${
                                        selectedCategories.length > 0
                                            ? 'bg-orange-100 border-orange-200 text-orange-700'
                                            : 'bg-white border-gray-100 text-gray-500 hover:border-orange-200'
                                    }`}
                                >
                                    <SlidersHorizontal className="w-3.5 h-3.5" />
                                    Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`}
                                </button>

                                <div className="ml-auto flex items-center gap-4">
                                    <span className="text-sm font-bold text-gray-900">{filteredTools.length} results</span>
                                    <button onClick={resetFilters} className="text-sm font-black text-red-500 hover:text-red-700 transition-colors flex items-center gap-1">
                                        <X className="w-4 h-4" /> Reset
                                    </button>
                                </div>
                            </div>

                            {showFilters && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-6 pt-6 border-t border-gray-50">
                                    {allCategories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategories(prev =>
                                                prev.includes(cat) ? prev.filter(x => x !== cat) : [...prev, cat])}
                                            className={`text-[11px] font-bold px-3 py-2 rounded-xl border transition-all text-left truncate ${
                                                selectedCategories.includes(cat)
                                                    ? 'bg-orange-500 border-orange-500 text-white'
                                                    : 'bg-gray-50 border-transparent text-gray-600 hover:bg-orange-50 hover:text-orange-700'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Results grid */}
                        {pagedTools.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pagedTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-16">
                                        <button
                                            onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            disabled={currentPage === 1}
                                            className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-all font-black"
                                        >
                                            <ArrowRight className="w-5 h-5 rotate-180" />
                                        </button>
                                        <div className="flex items-center gap-2 px-2">
                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                let p = i + 1;
                                                if (totalPages > 5) {
                                                    if (currentPage > 3) p = currentPage - 2 + i;
                                                    if (currentPage > totalPages - 2) p = totalPages - 4 + i;
                                                }
                                                if (p < 1 || p > totalPages) return null;
                                                return (
                                                    <button
                                                        key={p}
                                                        onClick={() => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                        className={`w-12 h-12 flex items-center justify-center rounded-2xl text-[15px] font-black transition-all ${
                                                            currentPage === p
                                                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-100'
                                                                : 'bg-white text-gray-500 hover:bg-gray-50 border-2 border-transparent'
                                                        }`}
                                                    >{p}</button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            disabled={currentPage === totalPages}
                                            className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-all font-black"
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-24 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
                                <p className="text-gray-400 text-lg font-bold mb-6">No tools matched your filters.</p>
                                <button onClick={resetFilters} className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-100">
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>

                ) : (
                    /* ─── HOME VIEW ─── */
                    <div className="max-w-7xl mx-auto px-4 py-14 space-y-20">

                        {/* 3-column curated sections — visual hierarchy */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {SECTION_CONFIGS.map(section => {
                                const tools = section.filter(initialTools);
                                return (
                                    <div key={section.id} className="flex flex-col">
                                        {/* Section header */}
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`w-8 h-8 ${section.bgColor} rounded-lg flex items-center justify-center border ${section.borderColor}`}>
                                                    {section.icon}
                                                </div>
                                                <h2 className="text-[17px] font-black text-gray-900">{section.title}</h2>
                                            </div>
                                            <Link
                                                href={section.href}
                                                className="text-[11px] font-black text-gray-400 hover:text-orange-500 transition-colors uppercase tracking-widest flex items-center gap-1 hover:gap-1.5"
                                            >
                                                See all <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>

                                        {/* Tool list */}
                                        <div className="bg-white rounded-[28px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            {/* Accent stripe */}
                                            <div className={`h-1 w-full ${section.accentColor}`} />
                                            <div className="p-2 space-y-0.5">
                                                {tools.map((tool, idx) => (
                                                    <ToolRow key={tool.id} tool={tool} idx={idx} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Mid CTA Banner — lighter, high contrast button */}
                        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-10 md:p-16 text-center">
                            {/* Decorative blobs */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10 max-w-2xl mx-auto">
                                <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-1.5 mb-6">
                                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                                    <span className="text-[12px] font-black text-orange-300 uppercase tracking-widest">Full Directory</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
                                    Explore <span className="text-orange-400">{initialTools.length.toLocaleString()}+</span><br />
                                    Verified AI Tools
                                </h2>
                                <p className="text-gray-300 text-[17px] mb-10 font-medium leading-relaxed">
                                    Hand-curated across dozens of high-impact categories — find exactly what your workflow needs.
                                </p>
                                <button
                                    onClick={() => setSearchQuery(' ')}
                                    className="inline-flex items-center gap-3 px-10 py-4 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-black rounded-2xl shadow-2xl shadow-orange-500/30 transition-all duration-200 hover:scale-105 group text-[16px]"
                                >
                                    Browse Full Directory
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        <TrendingCategories />
                        <AINewsSection />
                        <SEOContent categories={categories} />
                    </div>
                )}

                {/* Ad */}
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <AdUnit slot="3924871065" format="horizontal" className="text-center" />
                </div>
            </main>

            <Footer />
            <ComparisonBar />
        </div>
    );
}
