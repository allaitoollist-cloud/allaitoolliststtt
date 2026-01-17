'use client';

import {
    MessageSquare,
    Image as ImageIcon,
    Video,
    Code,
    PenTool,
    Briefcase,
    Mic,
    Share2,
    Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryIconsNavProps {
    selectedCategory?: string;
    onSelectCategory: (category: string) => void;
}

export function CategoryIconsNav({ selectedCategory, onSelectCategory }: CategoryIconsNavProps) {
    const categories = [
        { id: 'all', label: 'All', icon: Layout },
        { id: 'Chatbots', label: 'Chatbots', icon: MessageSquare },
        { id: 'Image Generation', label: 'Image Gen', icon: ImageIcon },
        { id: 'Video & Audio', label: 'Video', icon: Video },
        { id: 'Code & Development', label: 'Coding', icon: Code },
        { id: 'Writing', label: 'Writing', icon: PenTool },
        { id: 'Productivity', label: 'Productivity', icon: Briefcase },
        { id: 'Audio', label: 'Voice', icon: Mic },
        { id: 'Social Media', label: 'Social', icon: Share2 },
    ];

    return (
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/40 py-4 mb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
                    {categories.map((cat) => {
                        // Simple logic: if 'all' is selected or no category is selected
                        const isSelected = selectedCategory === cat.label || (cat.id === 'all' && (!selectedCategory || selectedCategory.length === 0));

                        return (
                            <button
                                key={cat.id}
                                onClick={() => onSelectCategory(cat.id === 'all' ? '' : cat.label)}
                                className={`
                                    flex flex-col items-center justify-center min-w-[4.5rem] gap-2 p-2 rounded-xl transition-all duration-200 group
                                    ${isSelected
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                    }
                                `}
                            >
                                <div className={`
                                    p-2.5 rounded-full transition-all duration-300
                                    ${isSelected
                                        ? 'bg-primary text-primary-foreground shadow-md scale-110'
                                        : 'bg-secondary group-hover:bg-secondary/80'
                                    }
                                `}>
                                    <cat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-medium whitespace-nowrap">{cat.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
