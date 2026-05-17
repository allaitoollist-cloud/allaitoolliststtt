'use client';

import { useState } from 'react';
import { Search, CheckCircle, RefreshCw, Shield, Users } from 'lucide-react';

interface HeroProps {
    onSearch?: (query: string) => void;
    toolCount?: number;
}

const QUICK_FILTERS = [
    { label: '🆓 Free',       q: 'Free' },
    { label: '✨ Freemium',   q: 'Freemium' },
    { label: '🔥 Trending',   q: 'Popular' },
    { label: '✅ Verified',   q: 'verified' },
    { label: '🆕 New',        q: 'new' },
    { label: '💻 Code AI',    q: 'code' },
    { label: '✍️ Writing',    q: 'writing' },
    { label: '🎨 Design',     q: 'design' },
];

export function Hero({ onSearch, toolCount = 5375 }: HeroProps) {
    const [searchValue, setSearchValue] = useState('');
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        onSearch?.(e.target.value);
    };

    const handleSearch = () => onSearch?.(searchValue);

    const handleFilter = (q: string) => {
        const next = q === activeFilter ? null : q;
        setActiveFilter(next);
        onSearch?.(next ?? '');
    };

    return (
        <div className="relative bg-gradient-to-b from-[#fff8f4] via-[#fffcfa] to-white border-b border-gray-100 overflow-hidden">
            {/* Background orbs */}
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-orange-100/50 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-10 -right-20 w-[300px] h-[300px] bg-amber-50/70 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-10 -left-20 w-[250px] h-[300px] bg-orange-50/50 rounded-full blur-2xl pointer-events-none" />

            <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-14 text-center">

                {/* Live badge */}
                <div className="inline-flex items-center gap-2 bg-white border border-orange-200 shadow-sm rounded-full px-4 py-1.5 mb-8">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[13px] font-bold text-gray-700">
                        <span className="text-orange-600 font-black">{toolCount.toLocaleString()}+</span> AI tools — updated daily
                    </span>
                </div>

                {/* Headline — gradient, punchy */}
                <h1 className="text-[46px] md:text-[64px] font-black text-gray-900 leading-[1.05] tracking-tight mb-5">
                    The #1 Directory to<br />
                    <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                        Find Any AI Tool
                    </span>
                </h1>

                {/* Subtext — high contrast */}
                <p className="text-[18px] text-gray-700 mb-10 max-w-xl mx-auto leading-relaxed font-medium">
                    Search, compare and discover{' '}
                    <span className="font-black text-gray-900">5,000+</span> hand-verified AI tools
                    across 70+ categories — updated daily.
                </p>

                {/* Search bar — wider, more dominant */}
                <div className="relative max-w-3xl mx-auto mb-5">
                    <div className="flex items-center bg-white border-2 border-gray-200 focus-within:border-orange-400 focus-within:shadow-[0_0_0_4px_rgba(249,115,22,0.08)] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 overflow-hidden">
                        <div className="pl-5 pr-3 shrink-0">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="flex-1 py-4 md:py-5 text-[16px] bg-transparent outline-none placeholder:text-gray-400 text-gray-900 font-medium"
                            placeholder="Search ChatGPT, Midjourney, Cursor..."
                            value={searchValue}
                            onChange={handleChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            autoComplete="off"
                        />
                        <div className="pr-2 shrink-0">
                            <button
                                onClick={handleSearch}
                                className="px-7 py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-black rounded-xl text-[15px] transition-all duration-150 hover:shadow-lg hover:shadow-orange-200 whitespace-nowrap"
                            >
                                Find Tools →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick filters — larger pills, active state */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest mr-1 hidden sm:inline">Browse:</span>
                    {QUICK_FILTERS.map(({ label, q }) => (
                        <button
                            key={q}
                            onClick={() => handleFilter(q)}
                            className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-150 ${
                                activeFilter === q
                                    ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200 scale-105'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 shadow-sm hover:shadow-md'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Trust row — richer data points */}
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] text-gray-500 font-semibold">
                    <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span><span className="text-gray-900 font-black">71</span> categories</span>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block" />
                    <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-blue-500 shrink-0" />
                        Updated daily
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block" />
                    <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-orange-500 shrink-0" />
                        Manually verified
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block" />
                    <span className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500 shrink-0" />
                        <span><span className="text-gray-900 font-black">42k+</span> monthly users</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
