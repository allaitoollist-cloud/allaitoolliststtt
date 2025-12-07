'use client';

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
    const isNew = tool.dateAdded && new Date(tool.dateAdded) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const { addToComparison, removeFromComparison, isInComparison, comparisonTools, maxTools } = useComparison();
    const inComparison = isInComparison(tool.id);
    const canAddMore = comparisonTools.length < maxTools;

    const handleCompareClick = () => {
        if (inComparison) {
            removeFromComparison(tool.id);
        } else if (canAddMore) {
            addToComparison(tool);
        }
    };

    return (
        <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 flex flex-col h-full">
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Top Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badges - Top Right */}
            <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
                {/* Featured Badge */}
                {tool.featured && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                        <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                        Featured
                    </Badge>
                )}
                {tool.trending && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                        <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                        Trending
                    </Badge>
                )}
                {isNew && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                        New
                    </Badge>
                )}
            </div>

            <CardHeader className="space-y-2 sm:space-y-3 pb-2 sm:pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        {tool.icon && (
                            <Link href={`/tool/${tool.slug}`} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity">
                                <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                                    <Image
                                        src={tool.icon}
                                        alt={tool.name}
                                        fill
                                        className="object-contain"
                                        sizes="32px"
                                    />
                                </div>
                            </Link>
                        )}
                        <div className="flex-1 min-w-0">
                            <Link href={`/tool/${tool.slug}`}>
                                <CardTitle className="text-sm sm:text-base md:text-lg group-hover:text-primary transition-colors truncate flex items-center gap-1.5">
                                    {tool.name}
                                    {/* Verified Badge */}
                                    {tool.verified && (
                                        <span title="Verified Tool" className="flex-shrink-0">
                                            <BadgeCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
                                        </span>
                                    )}
                                </CardTitle>
                            </Link>
                            <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 flex-wrap">
                                <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0">
                                    {tool.category}
                                </Badge>
                                {tool.views && (
                                    <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-muted-foreground">
                                        <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                        {tool.views.toLocaleString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rating */}
                {tool.rating && (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(tool.rating!)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-600'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{tool.rating.toFixed(1)}</span>
                        {tool.reviewCount && (
                            <span className="text-[10px] sm:text-xs text-muted-foreground">
                                ({tool.reviewCount.toLocaleString()})
                            </span>
                        )}
                    </div>
                )}

                <CardDescription className="line-clamp-2 text-xs sm:text-sm">
                    {tool.shortDescription}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 sm:space-y-4 pt-0 mt-auto">
                {/* Tags */}
                <div className="flex flex-wrap gap-1 sm:gap-2">
                    {tool.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0 sm:py-0.5">
                            {tag}
                        </Badge>
                    ))}
                </div>

                {/* Platform badges */}
                {tool.platform && tool.platform.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {tool.platform.slice(0, 3).map((platform) => (
                            <Badge key={platform} variant="outline" className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0">
                                {platform}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1 sm:pt-2">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-[10px] sm:text-xs px-1.5 sm:px-2">
                            {tool.pricing}
                        </Badge>
                        <Button
                            size="icon"
                            variant="ghost"
                            className={`h-6 w-6 sm:h-7 sm:w-7 ${inComparison ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                            onClick={handleCompareClick}
                            disabled={!inComparison && !canAddMore}
                            title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
                        >
                            <Scale className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </Button>
                        <ShareDialog
                            url={`https://aitoollist.com/tool/${tool.slug}`}
                            title={`Check out ${tool.name} on AI Tool List!`}
                            trigger={
                                <Button size="icon" variant="ghost" className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground hover:text-primary">
                                    <Share2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                </Button>
                            }
                        />
                    </div>

                    <Link href={tool.url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="ghost" className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            Visit <ExternalLink className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

