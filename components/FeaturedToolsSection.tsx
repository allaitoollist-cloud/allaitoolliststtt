'use client';

import { Tool } from '@/types';
import { ToolCard } from '@/components/ToolCard';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface FeaturedToolsSectionProps {
    tools: Tool[];
    title?: string;
    subtitle?: string;
    showViewAll?: boolean;
    maxTools?: number;
}

export function FeaturedToolsSection({
    tools,
    title = "Featured AI Tools",
    subtitle = "Hand-picked by our experts - The best AI tools you shouldn't miss",
    showViewAll = true,
    maxTools = 8
}: FeaturedToolsSectionProps) {
    // Filter only featured tools
    const featuredTools = tools.filter(tool => tool.featured).slice(0, maxTools);

    if (featuredTools.length === 0) {
        return null;
    }

    return (
        <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12">
                    <div className="space-y-2 sm:space-y-3">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-3 py-1">
                            <Sparkles className="h-3 w-3 mr-1.5" />
                            Editor's Pick
                        </Badge>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                            {title}
                        </h2>
                        <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
                            {subtitle}
                        </p>
                    </div>
                    {showViewAll && (
                        <Link href="/tools?filter=featured">
                            <Button variant="outline" className="group border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10">
                                View All Featured
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Featured Tools Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {featuredTools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))}
                </div>

                {/* Bottom CTA */}
                {featuredTools.length >= maxTools && (
                    <div className="text-center mt-8 sm:mt-12">
                        <p className="text-sm text-muted-foreground mb-4">
                            Discover more amazing AI tools curated by our team
                        </p>
                        <Link href="/tools">
                            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                                Browse All Tools
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
