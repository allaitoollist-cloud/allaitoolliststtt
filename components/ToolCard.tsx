'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ChevronUp, ArrowUpRight } from 'lucide-react';
import { Tool } from '@/types';
import { useUserInteractions } from '@/contexts/UserInteractionsContext';

interface ToolCardProps {
    tool: Tool;
}

const PRICING_STYLES: Record<string, string> = {
    'Free':                'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    'Freemium':            'bg-amber-50  text-amber-700  ring-1 ring-amber-200',
    'Paid':                'bg-zinc-100  text-zinc-600   ring-1 ring-zinc-200',
    'Contact for Pricing': 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
};

function pricingLabel(p: string) {
    return p === 'Contact for Pricing' ? 'Custom' : p;
}

export function ToolCard({ tool }: ToolCardProps) {
    const { favoriteToolIds, upvotedToolIds, toggleFavorite, toggleUpvote } = useUserInteractions();

    const upvoted   = upvotedToolIds.includes(tool.id);
    const favorited = favoriteToolIds.includes(tool.id);
    const baseUpvotes = tool.upvotesCount || tool.reviewCount || (tool.rating ? Math.floor(tool.rating * 150) : 42);
    const upvotes     = upvoted && !tool.upvotesCount ? baseUpvotes + 1 : (tool.upvotesCount ?? baseUpvotes);

    return (
        <div className="group relative bg-white border border-gray-100 hover:border-orange-200 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 flex flex-col h-full">

            {/* Featured glow */}
            {tool.featured && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/5 to-amber-500/5 pointer-events-none" />
            )}

            {/* Header row */}
            <div className="flex items-start gap-3 mb-4">
                {/* Icon */}
                <Link href={`/tool/${tool.slug}`} className="shrink-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-orange-100 transition-all">
                        {tool.icon
                            ? <Image src={tool.icon} alt={tool.name} width={48} height={48} className="object-contain" />
                            : <span className="text-lg font-black text-gray-300">{tool.name.charAt(0)}</span>
                        }
                    </div>
                </Link>

                {/* Name + badges */}
                <div className="flex-1 min-w-0">
                    <Link href={`/tool/${tool.slug}`} className="block">
                        <h3 className="text-[15px] font-black text-gray-900 truncate group-hover:text-orange-600 transition-colors leading-tight">
                            {tool.name}
                            {tool.verified && <span className="ml-1.5 text-orange-500 text-xs">✓</span>}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${PRICING_STYLES[tool.pricing] ?? PRICING_STYLES['Paid']}`}>
                            {pricingLabel(tool.pricing)}
                        </span>
                        {tool.trending && (
                            <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full ring-1 ring-orange-200">
                                🔥 Trending
                            </span>
                        )}
                        {tool.featured && (
                            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full ring-1 ring-amber-200">
                                ★ Featured
                            </span>
                        )}
                    </div>
                </div>

                {/* Category chip */}
                <span className="shrink-0 text-[10px] font-bold text-gray-400 uppercase tracking-wide bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 max-w-[80px] truncate text-right">
                    {tool.category || 'AI'}
                </span>
            </div>

            {/* Description */}
            <Link href={`/tool/${tool.slug}`} className="block flex-1 mb-5">
                <p className="text-[13px] text-gray-600 leading-[1.7] line-clamp-3">
                    {tool.shortDescription}
                </p>
            </Link>

            {/* Bottom actions */}
            <div className="flex items-center justify-between pt-3.5 border-t border-gray-100 mt-auto gap-2">
                {/* Upvote */}
                <button
                    onClick={() => toggleUpvote(tool.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${
                        upvoted
                            ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                            : 'bg-gray-50 text-gray-500 border border-gray-200 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                    title="Upvote"
                >
                    <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                    <span>{upvotes}</span>
                </button>

                <div className="flex items-center gap-1.5">
                    {/* Favorite */}
                    <button
                        onClick={() => toggleFavorite(tool.id)}
                        className={`p-2 rounded-xl border transition-all ${
                            favorited
                                ? 'text-red-500 bg-red-50 border-red-200'
                                : 'text-gray-300 border-gray-200 hover:text-red-400 hover:bg-red-50 hover:border-red-200'
                        }`}
                        aria-label="Save"
                    >
                        <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500' : ''}`} />
                    </button>

                    {/* Visit CTA — prominent orange */}
                    <Link
                        href={tool.affiliateUrl || tool.url}
                        target="_blank"
                        rel="nofollow noopener"
                        className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-xl text-sm font-black transition-all duration-200 shadow-sm hover:shadow-orange-200 hover:shadow-md"
                    >
                        Visit <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
