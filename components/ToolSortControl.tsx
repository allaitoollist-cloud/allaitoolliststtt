'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Clock, ThumbsUp, Star } from 'lucide-react';

export type SortOption = 'newest' | 'popular' | 'rating' | 'verified';

interface ToolSortControlProps {
    currentSort: SortOption;
    onSortChange: (sort: SortOption) => void;
    totalResults: number;
}

export function ToolSortControl({ currentSort, onSortChange, totalResults }: ToolSortControlProps) {

    const getSortLabel = (sort: SortOption) => {
        switch (sort) {
            case 'newest': return 'Newest Added';
            case 'popular': return 'Most Popular';
            case 'rating': return 'Highest Rated';
            case 'verified': return 'Verified Only';
            default: return 'Newest Added';
        }
    };

    return (
        <div className="flex items-center justify-between mb-6 bg-secondary/20 p-4 rounded-xl border border-border/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent flex items-center gap-2">
                All Tools
                <span className="text-sm font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full border border-border/50">
                    {totalResults}
                </span>
            </h2>

            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground hidden sm:block">Sort by:</span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 gap-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5">
                            {getSortLabel(currentSort)}
                            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onSortChange('newest')}>
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            Newest Added
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSortChange('popular')}>
                            <ThumbsUp className="mr-2 h-4 w-4 text-muted-foreground" />
                            Most Popular
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSortChange('rating')}>
                            <Star className="mr-2 h-4 w-4 text-muted-foreground" />
                            Highest Rated
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSortChange('verified')}>
                            <BadgeCheck className="mr-2 h-4 w-4 text-blue-500" />
                            Verified Only
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

import { BadgeCheck } from 'lucide-react';
