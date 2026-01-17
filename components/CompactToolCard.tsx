'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Sparkles } from 'lucide-react';
import { Tool } from '@/types';
import { Badge } from '@/components/ui/badge';

interface CompactToolCardProps {
    tool: Tool;
}

export function CompactToolCard({ tool }: CompactToolCardProps) {
    return (
        <Card className="flex items-center gap-3 p-3 bg-[#0F0F16] border-white/5 hover:border-white/10 transition-all hover:bg-white/5 group">
            <Link href={tool.url} target="_blank" className="flex-shrink-0">
                <div className="relative w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                    {tool.icon ? (
                        <Image
                            src={tool.icon}
                            alt={tool.name}
                            fill
                            className="object-contain p-1"
                            sizes="40px"
                        />
                    ) : (
                        <Sparkles className="w-5 h-5 text-white/40" />
                    )}
                </div>
            </Link>

            <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <Link href={tool.url} target="_blank" className="truncate">
                        <h3 className="text-sm font-semibold text-white group-hover:text-primary transition-colors truncate">
                            {tool.name}
                        </h3>
                    </Link>
                    {tool.pricing === 'Free' && (
                        <Badge variant="secondary" className="px-1 py-0 text-[9px] h-4 bg-green-500/10 text-green-400 border-none">Free</Badge>
                    )}
                </div>
                <Link href={`/tool/${tool.slug}`} className="block">
                    <p className="text-[11px] text-gray-400 truncate hover:text-gray-300 transition-colors">
                        {tool.shortDescription}
                    </p>
                </Link>
            </div>

            <Button asChild size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-white hover:bg-white/10 flex-shrink-0">
                <Link href={tool.url} target="_blank">
                    <ExternalLink className="h-4 w-4" />
                </Link>
            </Button>
        </Card>
    );
}
