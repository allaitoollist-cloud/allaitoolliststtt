'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Minus, X, Search, Plus } from 'lucide-react';
import Link from 'next/link';

interface Tool {
    id: string;
    name: string;
    slug: string;
    short_description: string;
    category: string;
    pricing: string;
    platform: string[] | null;
    tags: string[] | null;
    verified: boolean;
    rating: number | null;
}

const FEATURES = [
    { label: 'Rating', key: 'rating', render: (t: Tool) => t.rating ? `${t.rating}/5` : '—' },
    { label: 'Pricing Model', key: 'pricing', render: (t: Tool) => t.pricing || '—' },
    { label: 'Category', key: 'category', render: (t: Tool) => t.category || '—' },
    { label: 'Platform', key: 'platform', render: (t: Tool) => Array.isArray(t.platform) ? t.platform.join(', ') : '—' },
    { label: 'Tags', key: 'tags', render: (t: Tool) => Array.isArray(t.tags) ? t.tags.slice(0, 3).join(', ') : '—' },
    { label: 'Verified', key: 'verified', render: (t: Tool) => t.verified ? 'Yes' : 'No' },
    { label: 'Free Plan', key: 'free', render: (t: Tool) => t.pricing === 'Free' || t.pricing === 'Freemium' ? 'Yes' : 'No' },
];

export function CompareClient({ tools }: { tools: Tool[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selected, setSelected] = useState<Tool[]>(() => {
        const slugs = searchParams.get('tools')?.split(',').filter(Boolean) || [];
        return slugs.map(slug => tools.find(t => t.slug === slug)).filter(Boolean) as Tool[];
    });
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        const slugs = selected.map(t => t.slug).join(',');
        const params = new URLSearchParams(slugs ? { tools: slugs } : {});
        router.replace(`/compare${slugs ? `?${params}` : ''}`, { scroll: false });
    }, [selected]);

    const filtered = useMemo(() =>
        tools.filter(t =>
            !selected.find(s => s.id === t.id) &&
            (t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.category.toLowerCase().includes(search.toLowerCase()))
        ).slice(0, 8),
        [tools, selected, search]
    );

    const addTool = (tool: Tool) => {
        if (selected.length < 3) {
            setSelected(prev => [...prev, tool]);
            setSearch('');
            setShowSearch(false);
        }
    };

    const removeTool = (id: string) => setSelected(prev => prev.filter(t => t.id !== id));

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-10">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-black text-gray-900 mb-3">Compare AI Tools</h1>
                    <p className="text-gray-500 text-lg">Select up to 3 tools to compare side by side</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Tool selector row */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="flex items-end pb-2">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Feature</span>
                    </div>

                    {selected.map((tool) => (
                        <div key={tool.id} className="bg-white rounded-2xl border border-gray-200 p-5 relative shadow-sm">
                            <button
                                onClick={() => removeTool(tool.id)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                                <span className="text-blue-600 font-black text-lg">{tool.name[0]}</span>
                            </div>
                            <Link href={`/tool/${tool.slug}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors text-sm leading-tight block mb-1">
                                {tool.name}
                            </Link>
                            <span className="text-xs text-gray-400">{tool.category}</span>
                            {tool.verified && (
                                <span className="block mt-2 text-xs text-blue-600 font-semibold">Verified</span>
                            )}
                        </div>
                    ))}

                    {selected.length < 3 && (
                        <div className="relative">
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="w-full h-full min-h-[120px] bg-white rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 flex flex-col items-center justify-center gap-2 transition-all text-gray-400 hover:text-blue-600"
                            >
                                <Plus className="w-8 h-8" />
                                <span className="text-sm font-semibold">Add Tool</span>
                            </button>

                            {showSearch && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                                    <div className="p-3 border-b border-gray-100">
                                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                                            <Search className="w-4 h-4 text-gray-400 shrink-0" />
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Search tools..."
                                                value={search}
                                                onChange={e => setSearch(e.target.value)}
                                                className="flex-1 bg-transparent text-sm outline-none text-gray-800"
                                            />
                                        </div>
                                    </div>
                                    <ul className="max-h-56 overflow-y-auto py-1">
                                        {filtered.length === 0 && (
                                            <li className="px-4 py-3 text-sm text-gray-400 text-center">No tools found</li>
                                        )}
                                        {filtered.map(tool => (
                                            <li key={tool.id}>
                                                <button
                                                    onClick={() => addTool(tool)}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                                                >
                                                    <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                                        <span className="text-blue-600 font-bold text-xs">{tool.name[0]}</span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-800">{tool.name}</div>
                                                        <div className="text-xs text-gray-400">{tool.category} · {tool.pricing}</div>
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {selected.length === 0 && (
                        <>
                            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 min-h-[120px] flex items-center justify-center text-gray-300 text-sm">
                                Tool 2
                            </div>
                            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 min-h-[120px] flex items-center justify-center text-gray-300 text-sm">
                                Tool 3
                            </div>
                        </>
                    )}
                    {selected.length === 1 && (
                        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 min-h-[120px] flex items-center justify-center text-gray-300 text-sm">
                            Tool 3
                        </div>
                    )}
                </div>

                {/* Comparison table */}
                {selected.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Side-by-Side Comparison</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {FEATURES.map((feature) => (
                                <div key={feature.label} className="grid gap-4 px-6 py-4" style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
                                    <div className="flex items-center text-sm font-medium text-gray-500">
                                        {feature.label}
                                    </div>
                                    {selected.map((tool) => {
                                        const val = feature.render(tool);
                                        const isYesNo = val === 'Yes' || val === 'No';
                                        return (
                                            <div key={tool.id} className="flex items-center">
                                                {isYesNo ? (
                                                    val === 'Yes'
                                                        ? <span className="flex items-center gap-1.5 text-green-600 font-semibold text-sm"><Check className="w-4 h-4" /> Yes</span>
                                                        : <span className="flex items-center gap-1.5 text-gray-400 text-sm"><Minus className="w-4 h-4" /> No</span>
                                                ) : (
                                                    <span className="text-sm text-gray-800">{val}</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* Actions row */}
                        <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">
                            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
                                <div />
                                {selected.map((tool) => (
                                    <Link
                                        key={tool.id}
                                        href={`/tool/${tool.slug}`}
                                        className="block text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                                    >
                                        View {tool.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {selected.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        <div className="text-5xl mb-4">↑</div>
                        <p className="text-lg font-medium">Add tools above to start comparing</p>
                        <p className="text-sm mt-1">Compare pricing, features, platforms and more</p>
                    </div>
                )}
            </div>
        </div>
    );
}
