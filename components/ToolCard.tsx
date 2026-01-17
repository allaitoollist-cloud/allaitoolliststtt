'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, TrendingUp, Eye, Star, Share2, Scale, BadgeCheck, Sparkles } from 'lucide-react';
import { ShareDialog } from '@/components/ShareDialog';
import { Tool } from '@/types';
import { useComparison } from '@/contexts/ComparisonContext';

interface ToolCardProps {
    tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
    // Use useEffect to calculate isNew on client to avoid hydration mismatch
    const [isNew, setIsNew] = useState(false);
    const { addToComparison, removeFromComparison, isInComparison, comparisonTools, maxTools } = useComparison();

    useEffect(() => {
        if (tool.dateAdded) {
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            setIsNew(new Date(tool.dateAdded) > sevenDaysAgo);
        }
    }, [tool.dateAdded]);
    const inComparison = isInComparison(tool.id);
    const canAddMore = comparisonTools.length < maxTools;

    const handleCompareClick = () => {
        if (inComparison) {
            removeFromComparison(tool.id);
        } else if (canAddMore) {
            addToComparison(tool);
        }
    };

    // --- Dynamic Theming Engine ---
    const getToolTheme = (category: string) => {
        const themeMap: Record<string, any> = {
            'Image': { border: 'group-hover:border-purple-500/50', gradient: 'from-purple-500/10', iconBg: 'from-purple-900 to-indigo-900', badge: 'text-purple-400 bg-purple-500/10' },
            'Video': { border: 'group-hover:border-pink-500/50', gradient: 'from-pink-500/10', iconBg: 'from-pink-900 to-rose-900', badge: 'text-pink-400 bg-pink-500/10' },
            'Audio': { border: 'group-hover:border-orange-500/50', gradient: 'from-orange-500/10', iconBg: 'from-orange-900 to-red-900', badge: 'text-orange-400 bg-orange-500/10' },
            'Design': { border: 'group-hover:border-fuchsia-500/50', gradient: 'from-fuchsia-500/10', iconBg: 'from-fuchsia-900 to-purple-900', badge: 'text-fuchsia-400 bg-fuchsia-500/10' },

            'Code': { border: 'group-hover:border-emerald-500/50', gradient: 'from-emerald-500/10', iconBg: 'from-emerald-900 to-green-900', badge: 'text-emerald-400 bg-emerald-500/10' },
            'Development': { border: 'group-hover:border-cyan-500/50', gradient: 'from-cyan-500/10', iconBg: 'from-cyan-900 to-blue-900', badge: 'text-cyan-400 bg-cyan-500/10' },
            'Data': { border: 'group-hover:border-blue-500/50', gradient: 'from-blue-500/10', iconBg: 'from-blue-900 to-indigo-900', badge: 'text-blue-400 bg-blue-500/10' },

            'Business': { border: 'group-hover:border-slate-400', gradient: 'from-white/5', iconBg: 'from-slate-800 to-gray-900', badge: 'text-slate-300 bg-slate-500/10' },
            'Marketing': { border: 'group-hover:border-red-500/50', gradient: 'from-red-500/10', iconBg: 'from-red-900 to-orange-900', badge: 'text-red-400 bg-red-500/10' },
            'SEO': { border: 'group-hover:border-amber-500/50', gradient: 'from-amber-500/10', iconBg: 'from-amber-900 to-yellow-900', badge: 'text-amber-400 bg-amber-500/10' },

            'Writing': { border: 'group-hover:border-yellow-500/50', gradient: 'from-yellow-500/10', iconBg: 'from-yellow-900 to-amber-900', badge: 'text-yellow-400 bg-yellow-500/10' },
            'Text': { border: 'group-hover:border-stone-500/50', gradient: 'from-stone-500/10', iconBg: 'from-stone-800 to-neutral-900', badge: 'text-stone-300 bg-stone-500/10' },

            '3D': { border: 'group-hover:border-indigo-500/50', gradient: 'from-indigo-500/10', iconBg: 'from-indigo-900 to-violet-900', badge: 'text-indigo-400 bg-indigo-500/10' },
            'Game': { border: 'group-hover:border-lime-500/50', gradient: 'from-lime-500/10', iconBg: 'from-lime-900 to-green-900', badge: 'text-lime-400 bg-lime-500/10' },
            'Gaming': { border: 'group-hover:border-lime-500/50', gradient: 'from-lime-500/10', iconBg: 'from-lime-900 to-green-900', badge: 'text-lime-400 bg-lime-500/10' },
            'Character': { border: 'group-hover:border-rose-500/50', gradient: 'from-rose-500/10', iconBg: 'from-rose-900 to-pink-900', badge: 'text-rose-400 bg-rose-500/10' },
        };

        // Fallback for sub-categories or partial matches
        const cat = category?.split(' ')[0] || 'Other';

        // 1. Try exact match or first word
        if (themeMap[cat]) return themeMap[cat];
        if (themeMap[category]) return themeMap[category];

        // 2. Keyword partial match (e.g., "AI Game" -> "Game")
        const keywords = Object.keys(themeMap);
        const match = keywords.find(k => category?.includes(k));
        if (match) return themeMap[match];

        // 3. Fallback
        return {
            border: 'group-hover:border-primary/50',
            gradient: 'from-primary/10',
            iconBg: 'from-gray-800 to-black',
            badge: 'text-primary bg-primary/10'
        };
    };

    // --- Layout Variant Engine ---
    const getLayoutVariant = (category: string) => {
        const cat = category?.split(' ')[0] || 'Other';

        // Creative Tools -> "Showcase" Variant (Focus on visuals, centered)
        const showcaseCats = ['Image', 'Video', 'Design', 'Audio', '3D', 'Game', 'Gaming', 'Character'];
        if (showcaseCats.includes(cat) || showcaseCats.some(c => category.includes(c))) return 'showcase';

        // Technical Tools -> "Terminal" Variant (Monospace, structured, dark)
        const technicalCats = ['Code', 'Development', 'Data', 'SEO', 'Artificial Intelligence'];
        if (technicalCats.includes(cat)) return 'technical';

        // Business/Standard -> "Professional" Variant (Clean, card-like)
        return 'professional';
    };

    const variant = getLayoutVariant(tool.category);
    const theme = getToolTheme(tool.category);

    const TooltipText = ({ text, children }: { text: string, children: React.ReactNode }) => (
        <div className="group relative">
            {children}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">{text}</span>
        </div>
    );

    // --- RENDER: SHOWCASE VARIANT (Creative) ---
    if (variant === 'showcase') {
        return (
            <Card className={`group relative overflow-hidden bg-[#0F0F16] border border-white/5 ${theme.border} transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 flex flex-col h-full rounded-3xl`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />

                <CardHeader className="relative z-10 p-6 flex flex-col items-center text-center pb-2">
                    <Link href={`/tool/${tool.slug}`} className="relative mb-4">
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${theme.iconBg} p-0.5 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                            <div className="w-full h-full bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center overflow-hidden">
                                {tool.icon ? (
                                    <div className="relative w-12 h-12">
                                        <Image src={tool.icon} alt={tool.name} fill className="object-contain drop-shadow-lg" sizes="48px" />
                                    </div>
                                ) : (
                                    <Sparkles className="w-8 h-8 text-white/70" />
                                )}
                            </div>
                        </div>
                        {tool.featured && (
                            <Badge className="absolute -top-2 -right-6 scale-90 bg-amber-500 text-black border-0 font-bold shadow-lg animate-pulse">
                                Featured
                            </Badge>
                        )}
                    </Link>

                    <Link href={`/tool/${tool.slug}`} className="block w-full">
                        <CardTitle className="text-xl font-black text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-all">
                            {tool.name}
                        </CardTitle>
                    </Link>

                    <div className="flex gap-2 justify-center mb-3">
                        <Link href={`/category/${encodeURIComponent(tool.category)}`} className="hover:opacity-80 transition-opacity">
                            <Badge variant="outline" className={`bg-white/5 border-white/10 ${theme.badge} backdrop-blur-md cursor-pointer`}>
                                {tool.category}
                            </Badge>
                        </Link>
                        {tool.rating && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 border border-white/10">
                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                <span className="text-[10px] font-bold text-white">{tool.rating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>

                    <CardDescription className="text-sm text-gray-400 line-clamp-2 leading-relaxed font-medium">
                        {tool.shortDescription}
                    </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10 p-6 pt-2 mt-auto">
                    <div className="flex items-center justify-between gap-3 bg-white/5 rounded-xl p-2 border border-white/5 backdrop-blur-sm group-hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-2 pl-2">
                            <TooltipText text={tool.pricing}>
                                <div className={`w-2 h-2 rounded-full ${tool.pricing === 'Free' ? 'bg-green-500' : tool.pricing === 'Freemium' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                            </TooltipText>
                            <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">{tool.pricing}</span>
                        </div>

                        <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white" onClick={handleCompareClick}>
                                <Scale className="h-4 w-4" />
                            </Button>
                            <ShareDialog
                                url={`https://allaitoollist.com/tool/${tool.slug}`}
                                title={tool.name}
                                trigger={
                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                }
                            />
                            <Button asChild size="icon" className="h-8 w-8 bg-white text-black hover:bg-gray-200 rounded-lg shadow-lg">
                                <Link href={tool.url} target="_blank"><ExternalLink className="h-4 w-4" /></Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // --- RENDER: TECHNICAL VARIANT (Code/Dev) ---
    if (variant === 'technical') {
        return (
            <Card className="group relative overflow-hidden bg-black border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] flex flex-col h-full rounded-lg font-mono">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                <CardHeader className="p-4 pb-2 space-y-2">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <Link href={`/category/${encodeURIComponent(tool.category)}`} className="text-[10px] text-emerald-500 mb-1 tracking-widest uppercase opacity-70 hover:opacity-100 hover:text-emerald-400 transition-all w-fit">
                                &lt;{tool.category} /&gt;
                            </Link>
                            <Link href={`/tool/${tool.slug}`} className="group-hover:text-emerald-400 transition-colors">
                                <CardTitle className="text-lg font-bold text-gray-100 flex items-center gap-2">
                                    {tool.tags?.includes('Open Source') && <span className="text-xs bg-emerald-900/50 text-emerald-400 px-1 rounded border border-emerald-900">OSS</span>}
                                    {tool.name}
                                </CardTitle>
                            </Link>
                        </div>
                        <div className="w-10 h-10 bg-white/5 rounded border border-white/10 flex items-center justify-center shrink-0">
                            {tool.icon ? (
                                <Image src={tool.icon} alt={tool.name} width={24} height={24} className="rounded-sm opacity-80 group-hover:opacity-100" />
                            ) : <div className="text-xs text-gray-500">IMG</div>}
                        </div>
                    </div>

                    <CardDescription className="text-xs text-gray-500 line-clamp-3 leading-relaxed border-l-2 border-white/5 pl-3 group-hover:border-emerald-500/30 transition-colors">
                        {tool.shortDescription}
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-4 pt-2 mt-auto space-y-3">
                    <div className="flex flex-wrap gap-1.5 font-sans">
                        {tool.tags?.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] bg-white/5 text-gray-400 px-1.5 py-0.5 rounded border border-white/5">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-dashed border-white/10">
                        <span className="text-xs text-emerald-600 font-bold">{tool.pricing}</span>
                        <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-500 hover:text-emerald-400" onClick={handleCompareClick}>
                                <Scale className="h-3.5 w-3.5" />
                            </Button>
                            <ShareDialog
                                url={`https://allaitoollist.com/tool/${tool.slug}`}
                                title={tool.name}
                                trigger={
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-500 hover:text-emerald-400">
                                        <Share2 className="h-3.5 w-3.5" />
                                    </Button>
                                }
                            />
                            <Link href={tool.url} target="_blank">
                                <Button size="sm" variant="outline" className="h-7 text-xs border-emerald-900 text-emerald-500 hover:bg-emerald-950 hover:text-emerald-400">
                                    RUN_TOOL
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // --- RENDER: PROFESSIONAL VARIANT (Standard Fallback) ---
    return (
        <Card className={`group relative overflow-hidden bg-[#0A0A0F]/90 backdrop-blur-md border border-white/5 ${theme.border} transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] flex flex-col h-full rounded-xl`}>
            {/* Background Gradients */}
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

            {/* Top Highlight Line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardHeader className="p-5 pb-2 relative z-10">
                <div className="flex items-start justify-between gap-4">
                    <Link href={`/tool/${tool.slug}`} className="relative group/icon">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.iconBg} border border-white/10 flex items-center justify-center overflow-hidden shadow-lg group-hover/icon:ring-2 ring-white/10 transition-all duration-300 group-hover/icon:scale-110`}>
                            {tool.icon ? (
                                <div className="relative w-9 h-9">
                                    <Image
                                        src={tool.icon}
                                        alt={tool.name}
                                        fill
                                        className="object-contain drop-shadow-md"
                                        sizes="36px"
                                    />
                                </div>
                            ) : (
                                <Sparkles className="w-6 h-6 text-white/50" />
                            )}
                        </div>
                    </Link>

                    {/* Top Right Badges */}
                    <div className="flex flex-col items-end gap-1.5">
                        {tool.featured && (
                            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] px-2 py-0.5 backdrop-blur-sm">
                                <Sparkles className="w-2.5 h-2.5 mr-1 fill-amber-500" /> Featured
                            </Badge>
                        )}
                        {tool.trending && (
                            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] px-2 py-0.5 backdrop-blur-sm">
                                <TrendingUp className="w-2.5 h-2.5 mr-1" /> Trending
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <Link href={`/tool/${tool.slug}`} className="block">
                            <CardTitle className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all line-clamp-1 flex items-center gap-1.5">
                                {tool.name}
                                {tool.verified && (
                                    <BadgeCheck className="h-4 w-4 text-blue-500 shrink-0" fill="currentColor" />
                                )}
                            </CardTitle>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/category/${encodeURIComponent(tool.category)}`}>
                            <Badge variant="outline" className={`text-[10px] border-white/5 ${theme.badge} transition-colors uppercase tracking-wider font-semibold cursor-pointer hover:opacity-80`}>
                                {tool.category}
                            </Badge>
                        </Link>

                        {/* Rating */}
                        {tool.rating && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/5 border border-yellow-500/10">
                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                <span className="text-[10px] font-medium text-yellow-500">{tool.rating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>

                    <CardDescription className="text-sm text-gray-400 line-clamp-2 leading-relaxed h-10 font-light">
                        {tool.shortDescription}
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-0 mt-auto space-y-4 relative z-10">
                {/* Visual Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={`text-[11px] px-2.5 py-1 ${tool.pricing === 'Free' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            tool.pricing === 'Freemium' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            } border font-medium`}>
                            {tool.pricing}
                        </Badge>

                        <div className="flex pl-2 gap-1 border-l border-white/10">
                            <Button
                                size="icon"
                                variant="ghost"
                                className={`h-8 w-8 rounded-full ${inComparison ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                onClick={handleCompareClick}
                            >
                                <Scale className="h-4 w-4" />
                            </Button>
                            <ShareDialog
                                url={`https://allaitoollist.com/tool/${tool.slug}`}
                                title={tool.name}
                                trigger={
                                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-gray-500 hover:text-white hover:bg-white/5">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                }
                            />
                        </div>
                    </div>

                    <Button asChild size="sm" className="h-8 px-4 bg-white hover:bg-gray-200 text-black font-semibold text-xs tracking-wide transition-all shadow-lg hover:shadow-white/20">
                        <Link href={tool.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            Visit <ExternalLink className="ml-1.5 h-3 w-3" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
