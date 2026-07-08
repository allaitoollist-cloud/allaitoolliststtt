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
    'Paid':                'bg-gray-100  text-gray-600   ring-1 ring-gray-200',
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
        <div className="group relative bg-white border border-gray-100 hover:border-orange-200 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-0.5 flex flex-col gap-3">

            {/* Sponsored label */}
            {tool.featured && tool.pricing !== 'Free' && (
                <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 ring-1 ring-purple-100 px-2 py-0.5 rounded-full">
                    Sponsored
                </span>
            )}

            {/* Top row: icon + name + tags */}
            <div className="flex items-start gap-3">
                <Link href={`/tool/${tool.slug}`} className="shrink-0">
                    <div className="w-11 h-11 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-orange-100 transition-all">
                        {tool.icon
                            ? <Image src={tool.icon} alt={tool.name} width={44} height={44} className="object-contain" />
                            : <span className="text-base font-black text-gray-300">{tool.name.charAt(0)}</span>
                        }
                    </div>
                </Link>

                <div className="flex-1 min-w-0 pr-2">
                    <Link href={`/tool/${tool.slug}`} className="block">
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <h3 className="text-[14.5px] font-black text-gray-900 truncate group-hover:text-orange-600 transition-colors leading-none">
                                {tool.name}
                            </h3>
                            {tool.verified && (
                                <span className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center shrink-0" title="Verified">
                                    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 6L9 17L4 12" />
                                    </svg>
                                </span>
                            )}
                        </div>
                    </Link>

                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${PRICING_STYLES[tool.pricing] ?? PRICING_STYLES['Paid']}`}>
                            {pricingLabel(tool.pricing)}
                        </span>
                        {tool.trending && (
                            <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full ring-1 ring-orange-100">
                                🔥 Trending
                            </span>
                        )}
                        {tool.featured && (
                            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full ring-1 ring-amber-100">
                                ★ Featured
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}
            <Link href={`/tool/${tool.slug}`} className="block">
                <p className="text-[12.5px] text-gray-500 leading-[1.6] line-clamp-2 group-hover:text-gray-600 transition-colors">
                    {tool.shortDescription}
                </p>
            </Link>

            {/* Footer: upvote + fav + visit */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-50 mt-auto">
                {/* Upvote */}
                <button
                    onClick={() => toggleUpvote(tool.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all border ${
                        upvoted
                            ? 'bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-200'
                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                    title="Upvote"
                >
                    <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span className="tabular-nums">{upvotes}</span>
                </button>

                {/* Favorite */}
                <button
                    onClick={() => toggleFavorite(tool.id)}
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                        favorited
                            ? 'text-red-500 bg-red-50 border-red-200'
                            : 'text-gray-300 border-gray-200 hover:text-red-400 hover:bg-red-50 hover:border-red-200'
                    }`}
                    aria-label="Save to favorites"
                >
                    <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-red-500' : ''}`} />
                </button>

                {/* Visit */}
                <Link
                    href={tool.affiliateUrl || tool.url}
                    target="_blank"
                    rel="nofollow noopener"
                    className="ml-auto flex items-center gap-1.5 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-xl text-[12px] font-black transition-all shadow-sm hover:shadow-orange-200 hover:shadow-md"
                >
                    Visit <ArrowUpRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
    );
}
